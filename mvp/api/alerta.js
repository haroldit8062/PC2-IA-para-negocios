// api/alerta.js
// Función serverless de Vercel. Recibe una detección del modelo de audio,
// le pide a Gemini un mensaje claro y lo envía por Telegram.

const crypto = require("crypto");

// 1) El "system prompt": las instrucciones fijas que le damos a Gemini.
const SYSTEM_PROMPT = `Eres la capa de comunicación de un sistema de accesibilidad para personas
con discapacidad auditiva. Tu salida se envía como notificación de Telegram.

Recibirás una clase de sonido (alarma_incendio o ruido_de_fondo), un score
de confianza, un nivel de criticidad y un umbral.

Genera una notificación breve y clara.

Reglas:
- No inventes información.
- No afirmes que hay una alarma si la confianza está bajo el umbral.
- Si la clase es ruido_de_fondo, redacta un mensaje tranquilizador
  confirmando que no se detecta ninguna alarma y que el sistema sigue
  activo.
- Si la clase es alarma_incendio pero la confianza está bajo el umbral,
  expresa incertidumbre (por ejemplo: "escuché algo que podría ser una
  alarma, pero no estoy seguro") y pide revisar el entorno. No digas que
  no hay alarma.
- Si la clase es alarma_incendio y supera el umbral, prioriza claridad
  y urgencia sin generar pánico innecesario.
- Máximo dos oraciones.`;

// Criticidad y umbral de cada clase del modelo de audio.
const CONFIG_CLASES = {
  alarma_incendio: { criticidad: "alta", umbral: 0.8 },
  ruido_de_fondo: { criticidad: "baja", umbral: 0.7 },
};

// 2) Mensajes fijos: se usan sin Gemini o si Gemini falla o tarda demasiado.
const MENSAJE_ALARMA_CONFIRMADA = "Posible alarma de incendio detectada. Verifica tu entorno.";
const MENSAJE_INCIERTO =
  "Escuché un sonido que podría ser una alarma, pero no estoy seguro. Verifica tu entorno.";
const MENSAJE_TRANQUILIZADOR = "No se detecta ninguna alarma. El sistema sigue activo.";

// Si es false, una alarma confirmada se envía al instante con el mensaje fijo, sin Gemini.
// Si es true, la alarma confirmada también pasa por Gemini.
const USAR_GEMINI_EN_ALARMA = false;

// 3) Tiempo máximo que esperamos a Gemini (en milisegundos).
const LIMITE_GEMINI_MS = 2000;

const GEMINI_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite:generateContent";

// Pide el mensaje a Gemini. Si tarda más de 2 s, se cancela y lanza un error.
async function pedirMensajeAGemini(clase, confianza) {
  const controlador = new AbortController();
  const temporizador = setTimeout(() => controlador.abort(), LIMITE_GEMINI_MS);
  const config = CONFIG_CLASES[clase] || { criticidad: "desconocida", umbral: "desconocido" };
  const inicio = Date.now();
  let resultado = "falló";

  try {
    const respuesta = await fetch(GEMINI_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": process.env.GEMINI_API_KEY,
      },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
        contents: [
          {
            role: "user",
            parts: [
              {
                text:
                  `Clase: ${clase}. Confianza: ${confianza}. ` +
                  `Criticidad: ${config.criticidad}. Umbral: ${config.umbral}.`,
              },
            ],
          },
        ],
        // Razonamiento al mínimo para que responda más rápido.
        generationConfig: {
          thinkingConfig: { thinkingLevel: "MINIMAL" },
        },
      }),
      signal: controlador.signal,
    });

    if (!respuesta.ok) {
      throw new Error(`Gemini respondió con estado ${respuesta.status}`);
    }

    const datos = await respuesta.json();
    const texto = datos?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
    if (!texto) {
      throw new Error("Gemini no devolvió texto");
    }
    resultado = "respondió bien";
    return texto;
  } finally {
    clearTimeout(temporizador);
    // Diagnóstico: cuánto tardó Gemini, haya respondido bien o no.
    console.log(`Gemini ${resultado} en ${Date.now() - inicio} ms`);
  }
}

// ¿Es una alarma de incendio con confianza igual o mayor al umbral?
function esAlarmaConfirmada(clase, confianza) {
  return clase === "alarma_incendio" && confianza >= CONFIG_CLASES.alarma_incendio.umbral;
}

// Elige el mensaje fijo que corresponde a la clase (respaldo si Gemini falla).
function elegirMensajeFijo(clase, confianza) {
  if (esAlarmaConfirmada(clase, confianza)) return MENSAJE_ALARMA_CONFIRMADA;
  if (clase === "ruido_de_fondo") return MENSAJE_TRANQUILIZADOR;
  // alarma_incendio bajo el umbral, o una clase desconocida.
  return MENSAJE_INCIERTO;
}

// Código de acceso: primeros 32 caracteres del HMAC-SHA256 del chat id (igual que api/telegram.js).
function calcularCodigo(chatId) {
  return crypto
    .createHmac("sha256", process.env.ALERTA_SECRET)
    .update(String(chatId))
    .digest("hex")
    .slice(0, 32);
}

// Compara k con el código esperado sin revelar pistas por el tiempo de respuesta.
function codigoValido(chatId, k) {
  const esperado = Buffer.from(calcularCodigo(chatId));
  const recibido = Buffer.from(String(k));
  return esperado.length === recibido.length && crypto.timingSafeEqual(esperado, recibido);
}

// Envía un mensaje de texto a un chat de Telegram.
async function enviarATelegram(chatId, texto) {
  const url = `https://api.telegram.org/bot${process.env.TELEGRAM_TOKEN}/sendMessage`;
  const respuesta = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, text: texto }),
  });
  // Leemos la respuesta como texto por si Telegram no devuelve JSON.
  const textoRespuesta = await respuesta.text();
  let datos;
  try {
    datos = JSON.parse(textoRespuesta);
  } catch {
    datos = { ok: false, description: "Respuesta no es JSON" };
  }
  if (!respuesta.ok || !datos.ok) {
    // Solo mostramos el estado y la respuesta; nunca la URL, porque contiene el token.
    console.error("Telegram falló. Estado:", respuesta.status, "Respuesta:", textoRespuesta);
    throw new Error(`Telegram: ${datos.description}`);
  }
}

// Función principal: Vercel la ejecuta cada vez que alguien llama a /api/alerta.
module.exports = async function handler(req, res) {
  const inicioTotal = Date.now();
  // Diagnóstico: solo dice si las variables existen (true/false), nunca su valor.
  console.log("GEMINI_API_KEY existe:", Boolean(process.env.GEMINI_API_KEY));
  console.log("TELEGRAM_TOKEN existe:", Boolean(process.env.TELEGRAM_TOKEN));

  // Solo aceptamos POST.
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Usa el método POST" });
  }

  const { clase, confianza, chat_id, k } = req.body || {};

  // Sin la clave secreta no se puede verificar a nadie.
  if (!process.env.ALERTA_SECRET) {
    console.error("Falta la variable ALERTA_SECRET");
    return res.status(500).json({ error: "Configuración incompleta" });
  }

  // Solo quien recibió el enlace del bot tiene el código k correcto para su chat_id.
  if (!chat_id || !k || !codigoValido(chat_id, k)) {
    return res.status(401).json({ error: "No autorizado" });
  }

  // Revisamos que los datos sean válidos.
  if (
    (clase !== "alarma_incendio" && clase !== "ruido_de_fondo") ||
    typeof confianza !== "number" || !(confianza >= 0 && confianza <= 1) ||
    !/^-?\d+$/.test(String(chat_id))
  ) {
    return res.status(400).json({
      error: "Datos inválidos. Envía {clase, confianza (0 a 1), chat_id (número), k}",
    });
  }

  let mensaje;
  let origen;
  if (esAlarmaConfirmada(clase, confianza) && !USAR_GEMINI_EN_ALARMA) {
    // Alarma confirmada: avisamos de inmediato, sin esperar a Gemini.
    mensaje = MENSAJE_ALARMA_CONFIRMADA;
    origen = "fijo";
  } else {
    // Demás casos: intentamos con Gemini; si falla o tarda, usamos el mensaje fijo de la clase.
    try {
      mensaje = await pedirMensajeAGemini(clase, confianza);
      origen = "gemini";
    } catch (error) {
      console.error("Gemini falló, uso mensaje fijo:", error.message);
      mensaje = elegirMensajeFijo(clase, confianza);
      origen = "respaldo";
    }
  }

  // Enviamos el mensaje a Telegram.
  const inicioTelegram = Date.now();
  try {
    await enviarATelegram(chat_id, mensaje);
  } catch (error) {
    console.error("No se pudo enviar a Telegram:", error.message);
    console.log(`Telegram falló en ${Date.now() - inicioTelegram} ms`);
    console.log(`Función completa: ${Date.now() - inicioTotal} ms`);
    return res.status(502).json({ error: "No se pudo enviar el mensaje a Telegram" });
  }
  console.log(`Telegram respondió bien en ${Date.now() - inicioTelegram} ms`);

  console.log(`Función completa: ${Date.now() - inicioTotal} ms`);
  return res.status(200).json({ enviado: true, origen, mensaje });
};
