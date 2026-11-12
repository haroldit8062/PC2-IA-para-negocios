// evaluacion/evaluar_g1.js
// Evalúa las respuestas de Gemini con EXACTAMENTE el mismo pedido que hace api/alerta.js.
//
// Cómo se garantiza que es el mismo pedido (sin copiar nada ni modificar api/alerta.js):
//   1. Se lee api/alerta.js y se carga en memoria (el archivo no se toca).
//   2. Por cada caso se llama a su propia función pedirMensajeAGemini con un "fetch" falso
//      que solo anota la URL y el cuerpo que esa función quiere enviar.
//   3. Ese mismo cuerpo se envía de verdad a Gemini desde aquí.
// Diferencia intencional: aquí no hay límite de 2 s (para medir la calidad aunque Gemini tarde);
// la columna supera_2s indica si en la app ese caso habría usado el mensaje fijo.
//
// Uso (desde la carpeta del proyecto):  node --env-file=.env.local evaluacion/evaluar_g1.js

const fs = require("fs");
const path = require("path");
const Module = require("module");

const RAIZ = path.join(__dirname, "..");
const RUTA_ALERTA = path.join(RAIZ, "api", "alerta.js");
const RUTA_CSV = path.join(__dirname, "resultados_g1.csv");
const RUTA_PROMPT = path.join(__dirname, "prompt_usado.txt");

const MAX_INTENTOS = 3;           // solo se reintenta si Gemini responde 503 o 429
const ESPERA_REINTENTO_MS = 3000;
const LIMITE_PEDIDO_MS = 30000;   // corta un pedido colgado (no es el límite de la app)
const LIMITE_APP_MS = 2000;       // límite real de api/alerta.js, solo para la columna supera_2s

// ===== Los 20 casos, en este orden =====
const CASOS = [
  ...[0.99, 0.95, 0.90, 0.85, 0.80, 0.75, 0.70, 0.60, 0.52].map((c) => ({ tipo: "ruido", clase: "ruido_de_fondo", confianza: c })),
  ...[0.79, 0.75, 0.70, 0.65, 0.60, 0.55, 0.50].map((c) => ({ tipo: "duda", clase: "alarma_incendio", confianza: c })),
  ...[0.80, 0.85, 0.93, 0.99].map((c) => ({ tipo: "control", clase: "alarma_incendio", confianza: c })),
];

// ===== 1. Cargar api/alerta.js en memoria y acceder a sus piezas internas =====
function cargarAlerta() {
  const fuente = fs.readFileSync(RUTA_ALERTA, "utf8") +
    "\nmodule.exports.__eval = { SYSTEM_PROMPT, GEMINI_URL, CONFIG_CLASES, pedirMensajeAGemini };\n";
  const m = new Module(RUTA_ALERTA, module);
  m.filename = RUTA_ALERTA;
  m.paths = Module._nodeModulePaths(path.dirname(RUTA_ALERTA));
  m._compile(fuente, RUTA_ALERTA);
  return m.exports.__eval;
}

// Pide a pedirMensajeAGemini que arme su pedido, pero lo captura en vez de enviarlo.
async function capturarPedido(alerta, clase, confianza) {
  const fetchReal = global.fetch;
  const logReal = console.log;
  let capturado = null;
  global.fetch = async (url, opciones) => {
    capturado = { url, body: opciones.body };
    throw new Error("capturado");
  };
  console.log = () => {}; // silencia el "Gemini falló en X ms" de api/alerta.js
  try {
    await alerta.pedirMensajeAGemini(clase, confianza);
  } catch {
    // esperado: el fetch falso siempre falla
  } finally {
    global.fetch = fetchReal;
    console.log = logReal;
  }
  if (!capturado) throw new Error("No se pudo capturar el pedido de api/alerta.js");
  return capturado;
}

// ===== 3. Enviar a Gemini: una sola vez; reintentos solo con 503/429 =====
const esperar = (ms) => new Promise((r) => setTimeout(r, ms));

async function pedirUnaVez(pedido) {
  const controlador = new AbortController();
  const temporizador = setTimeout(() => controlador.abort(), LIMITE_PEDIDO_MS);
  const inicio = Date.now();
  try {
    const r = await fetch(pedido.url, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-goog-api-key": process.env.GEMINI_API_KEY },
      body: pedido.body,
      signal: controlador.signal,
    });
    const ms = Date.now() - inicio;
    if (!r.ok) return { estadoHttp: r.status, ms };
    const datos = await r.json();
    // Misma forma de leer la respuesta que api/alerta.js.
    const texto = datos?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
    return texto ? { estadoHttp: 200, ms, texto } : { estadoHttp: 200, ms, error: "Gemini no devolvió texto" };
  } catch (e) {
    return { ms: Date.now() - inicio, error: e.name === "AbortError" ? `sin respuesta en ${LIMITE_PEDIDO_MS / 1000} s` : "error de red" };
  } finally {
    clearTimeout(temporizador);
  }
}

async function pedirCaso(pedido) {
  const inicioTotal = Date.now();
  let ultimo;
  for (let intento = 1; intento <= MAX_INTENTOS; intento++) {
    ultimo = await pedirUnaVez(pedido);
    const reintentable = ultimo.estadoHttp === 503 || ultimo.estadoHttp === 429;
    if (ultimo.texto) return { estado: "ok", intentos: intento, ...ultimo, msTotal: Date.now() - inicioTotal };
    if (!reintentable) {
      const motivo = ultimo.error || `HTTP ${ultimo.estadoHttp}`;
      return { estado: `error (${motivo})`, intentos: intento, ...ultimo, msTotal: Date.now() - inicioTotal };
    }
    if (intento < MAX_INTENTOS) await esperar(ESPERA_REINTENTO_MS);
  }
  return { estado: "no_disponible", intentos: MAX_INTENTOS, ...ultimo, msTotal: Date.now() - inicioTotal };
}

// ===== 4. Chequeos automáticos =====
// Se comparan sin mayúsculas ni tildes ("está" = "esta").
const normalizar = (t) => t.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
const contieneAlguno = (texto, palabras) => palabras.some((p) => texto.includes(normalizar(p)));

function contarOraciones(texto) {
  return texto.split(/[.!?…]+(?:\s+|$)/).filter((s) => s.trim()).length;
}

function chequear(tipo, respuesta) {
  const t = normalizar(respuesta);
  const c = { a: "n/a", b: "n/a", c: "n/a", d: "n/a", e: "n/a" };
  const sn = (v) => (v ? "sí" : "no");

  c.a = sn(contarOraciones(respuesta) <= 2);
  c.b = sn(!contieneAlguno(t, ["confianza", "umbral", "por ciento"]) && !/[0-9%]/.test(t));

  if (tipo === "ruido") {
    c.c = sn(contieneAlguno(t, ["no se detecta", "ninguna alarma"]) &&
             contieneAlguno(t, ["activo", "monitore", "funcionando"]));
  } else if (tipo === "duda") {
    c.d = sn(contieneAlguno(t, ["no estoy seguro", "podría", "posible", "no tengo la seguridad"]) &&
             contieneAlguno(t, ["verifica", "revisa", "comprueba"]) &&
             !contieneAlguno(t, ["no se ha detectado", "no se detecta", "no hay alarma",
                                  "todo tranquilo", "todo está bien", "sin alarma"]));
  } else {
    c.e = sn(t.includes("alarma") && contieneAlguno(t, ["verifica", "evacu", "precauci", "revisa"]));
  }
  const aprobado = Object.values(c).every((v) => v !== "no");
  return { ...c, aprobado: sn(aprobado) };
}

// ===== 5. CSV =====
function campoCsv(valor) {
  const s = String(valor ?? "");
  return `"${s.replace(/"/g, '""')}"`;
}

// ===== Programa principal =====
async function main() {
  if (!process.env.GEMINI_API_KEY) {
    console.error("Falta GEMINI_API_KEY. Ejecuta: node --env-file=.env.local evaluacion/evaluar_g1.js");
    process.exit(1);
  }

  const alerta = cargarAlerta();
  const modelo = (alerta.GEMINI_URL.match(/models\/([^:]+):/) || [])[1] || alerta.GEMINI_URL;
  const ahora = new Date();

  // 6. Prompt usado
  const primerPedido = JSON.parse((await capturarPedido(alerta, "ruido_de_fondo", 0.99)).body);
  fs.writeFileSync(RUTA_PROMPT, [
    `Fecha y hora de la corrida: ${ahora.toLocaleString("es")} (ISO ${ahora.toISOString()})`,
    `Modelo: ${modelo}`,
    `generationConfig: ${JSON.stringify(primerPedido.generationConfig)}`,
    `Fuente: api/alerta.js (leído en memoria, sin copiar)`,
    "",
    "SYSTEM_PROMPT:",
    alerta.SYSTEM_PROMPT,
    "",
  ].join("\n"), "utf8");

  console.log(`Modelo: ${modelo} · ${CASOS.length} casos · cada caso se pide una sola vez\n`);

  const filas = [];
  for (let i = 0; i < CASOS.length; i++) {
    const caso = CASOS[i];
    const pedido = await capturarPedido(alerta, caso.clase, caso.confianza);
    const entrada = JSON.parse(pedido.body).contents[0].parts[0].text;
    const r = await pedirCaso(pedido);
    const chk = r.texto ? chequear(caso.tipo, r.texto) : null;

    filas.push({ numero: i + 1, caso, entrada, r, chk });
    const marca = !r.texto ? `✗ ${r.estado}` : chk.aprobado === "sí" ? "✓ aprobado" : "✗ no aprobado";
    console.log(`${String(i + 1).padStart(2)}. ${caso.tipo.padEnd(7)} ${caso.confianza.toFixed(2)}  ` +
      `${marca}  (${r.intentos} intento${r.intentos > 1 ? "s" : ""}, ${r.ms} ms)`);
  }

  // 5. Guardar CSV (con BOM para que Excel muestre bien las tildes)
  const encabezado = ["numero", "tipo", "clase", "confianza", "entrada", "respuesta", "estado", "intentos",
    "tiempo_ms", "tiempo_total_ms", "supera_2s", "a_max_2_oraciones", "b_sin_numeros_ni_terminos",
    "c_ruido_ok", "d_duda_ok", "e_control_ok", "aprobado_auto", "revision_humana"];
  const lineas = [encabezado.map(campoCsv).join(",")];
  for (const { numero, caso, entrada, r, chk } of filas) {
    lineas.push([
      numero, caso.tipo, caso.clase, caso.confianza.toFixed(2), entrada, r.texto || "", r.estado, r.intentos,
      r.ms, r.msTotal, r.texto ? (r.ms > LIMITE_APP_MS ? "sí" : "no") : "",
      chk?.a ?? "", chk?.b ?? "", chk?.c ?? "", chk?.d ?? "", chk?.e ?? "", chk?.aprobado ?? "", "",
    ].map(campoCsv).join(","));
  }
  fs.writeFileSync(RUTA_CSV, "﻿" + lineas.join("\r\n") + "\r\n", "utf8");

  // 7. Resumen
  const exitosas = filas.filter((f) => f.r.texto);
  const aprobadas = filas.filter((f) => f.chk?.aprobado === "sí");
  const porTipo = (tipo) => {
    const del = filas.filter((f) => f.caso.tipo === tipo);
    return `${del.filter((f) => f.chk?.aprobado === "sí").length}/${del.length}`;
  };
  const noDisp = filas.filter((f) => f.r.estado === "no_disponible");
  const otrosErrores = filas.filter((f) => !f.r.texto && f.r.estado !== "no_disponible");
  const promedio = exitosas.length
    ? Math.round(exitosas.reduce((s, f) => s + f.r.ms, 0) / exitosas.length) : 0;
  const lentas = exitosas.filter((f) => f.r.ms > LIMITE_APP_MS).length;

  console.log("\n===== Resumen =====");
  console.log(`Aprobados por chequeos automáticos: ${aprobadas.length}/${filas.length}`);
  console.log(`  ruido_de_fondo:            ${porTipo("ruido")}`);
  console.log(`  duda (alarma bajo umbral): ${porTipo("duda")}`);
  console.log(`  control (alarma sobre):    ${porTipo("control")}`);
  console.log(`Fallas de disponibilidad (503/429 en los ${MAX_INTENTOS} intentos): ` +
    (noDisp.length ? noDisp.map((f) => `#${f.numero}`).join(", ") : "ninguna"));
  if (otrosErrores.length) {
    console.log(`Otros errores (sin reintento): ` +
      otrosErrores.map((f) => `#${f.numero} ${f.r.estado}`).join(", "));
  }
  console.log(`Tiempo promedio de respuesta: ${promedio} ms (de ${exitosas.length} respuestas)`);
  console.log(`Respuestas de más de ${LIMITE_APP_MS / 1000} s (en la app usarían el mensaje fijo): ${lentas}/${exitosas.length}`);
  console.log(`\nGuardado: ${path.relative(RAIZ, RUTA_CSV)} y ${path.relative(RAIZ, RUTA_PROMPT)}`);
}

if (require.main === module) {
  main().catch((e) => {
    console.error("Error inesperado:", e.message);
    process.exit(1);
  });
}

module.exports = { cargarAlerta, capturarPedido, chequear, contarOraciones, CASOS };
