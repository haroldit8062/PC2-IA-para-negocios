# Alertly — MVP

Alertly escucha el entorno con un dispositivo fijo en el hogar y, si detecta la alarma de un detector de humo, avisa por Telegram al celular de una persona con discapacidad auditiva. Es un **complemento**: no reemplaza un detector de humo.

| | |
|---|---|
| **URL pública** | https://alertly-alpha.vercel.app |
| **Bot de Telegram** | [@Alertly_alarma_bot](https://t.me/Alertly_alarma_bot) |
| **Qué necesitas** | Un celular con Telegram, y un dispositivo con micrófono (laptop o celular) para dejar la página escuchando |

> **Importante:** no entres directamente a la URL. Entra siempre desde el bot (paso 3), porque ahí se vincula tu cuenta de Telegram.

---

## Cómo probarlo (evaluador, 6 pasos)

1. Abre **https://t.me/Alertly_alarma_bot** desde tu celular (Telegram instalado).
2. Presiona **Iniciar** (o escribe `/start`). El bot responde con un botón.
3. Toca **«Abrir Alertly»**. La página se abre ya vinculada a tu chat.
4. Presiona **«Empezar a escuchar»** y acepta el permiso del micrófono. Si el micrófono falla en el navegador interno de Telegram, abre el enlace en Chrome. Verás la pantalla en **verde** y te llegará un mensaje de inicio a Telegram.
5. Deja la página abierta, con la pantalla encendida, cerca de donde sonará la alarma.
6. Reproduce el sonido de un detector de humo desde otro dispositivo, completo y sin cortarlo (por ejemplo, busca «smoke alarm beeping» en YouTube). Verás la pantalla pasar de verde a **ámbar** y a **rojo**, y recibirás el aviso en Telegram.

| Pantalla | Significa | Aviso a Telegram |
|---|---|---|
| Verde — «Todo tranquilo» | No se detecta alarma | Solo un mensaje al iniciar |
| Ámbar — «Posible alarma» | El sistema duda | Si dura 5 s seguidos; máximo 1 cada 5 minutos |
| Rojo — «Alarma de incendio» | Alarma confirmada | Al empezar, y hasta 2 recordatorios (uno por minuto) mientras siga |

**Tiempos esperados:** la instalación toma unos 2 minutos y el aviso de una alarma llega, en nuestras pruebas, unos 8 segundos después de que empieza el sonido (mediana 7.8 s).

---

## Cómo funciona

```text
Micrófono → modelo de audio (Teachable Machine, en el navegador)
          → reglas de decisión (umbrales y ventana de 3 s)
          → función serverless (Vercel)
          → mensaje por Telegram
```

- **Modelo (A3):** clasifica cada segundo de audio en `alarma_incendio` o `ruido_de_fondo`, y devuelve una confianza. Corre en el navegador: el audio no se envía a ningún servidor.
- **Reglas:** rojo si hay 2 lecturas con confianza ≥ 0.80 dentro de una ventana de 3 s; ámbar si el máximo de la ventana está entre 0.50 y 0.80.
- **Mensajes:**
  - **Alarma confirmada:** texto fijo, sin modelo de lenguaje: «Posible alarma de incendio detectada. Verifica tu entorno.»
  - **Duda:** redactado por Gemini (capa G1) con un prompt fijo; si Gemini falla o tarda más de 2 s, se envía un texto de respaldo.
  - **Tranquilizador:** igual que la duda, solo al iniciar y solo para ruido de fondo.
- **Anti-saturación:** el aviso de duda necesita 5 s seguidos en ámbar, máximo 1 cada 5 minutos y ninguno en los 2 minutos posteriores a una alarma. El evento de alarma termina tras 30 s sin lecturas de alarma.

## Recomendaciones de uso

- Coloca el dispositivo que escucha **cerca del detector de humo, en la misma habitación**: con la alarma en otra habitación el sistema solo llegó a ámbar en nuestras pruebas.
- Conéctalo al cargador y deja la pantalla encendida: si se apaga o pierde internet, no podrá avisar.
- Activa el sonido de Telegram en tu celular.

## Solución de problemas

| Problema | Qué hacer |
|---|---|
| El micrófono no funciona al abrir desde Telegram | Abre el enlace en Chrome desde el menú de los tres puntos |
| La página dice que falta vincular | Vuelve al bot, presiona `/start` y toca «Abrir Alertly» |
| No llegan avisos | Revisa que el chat del bot no esté silenciado y que el dispositivo tenga internet |
| Quieres vincular otra cuenta | En «Detalles técnicos» elige «Desvincular este dispositivo» y abre Alertly de nuevo desde el bot |

---

## Arquitectura técnica

| Parte | Tecnología |
|---|---|
| Modelo de audio | Teachable Machine (audio), 2 clases, ejecutado con TensorFlow.js en el navegador |
| Captura de audio | Web Audio API |
| Página | `index.html` (una sola página con el micrófono, los tres estados y la vinculación) |
| Función serverless | `api/alerta.js` (decide el mensaje y lo envía) y `api/telegram.js` (webhook del bot) |
| Capa de lenguaje (G1) | API de Gemini (`gemini-3.1-flash-lite`) con prompt fijo |
| Notificaciones | Telegram Bot API |
| Despliegue | Vercel (plan Hobby) |

### Variables de entorno (solo los nombres; los valores **no** están en el repositorio)

| Variable | Para qué |
|---|---|
| `GEMINI_API_KEY` | Clave de la API de Gemini |
| `TELEGRAM_TOKEN` | Token del bot de Telegram |
| `TELEGRAM_WEBHOOK_SECRET` | Secreto que Telegram envía al webhook |
| `ALERTA_SECRET` | Secreto con el que se firma el código de vinculación |

Se guardan en el panel de Vercel y, para desarrollo local, en `.env.local` (que está en `.gitignore`).

### Desarrollo local y despliegue

```text
vercel dev        # servidor local en http://localhost:3000
vercel --prod     # publica en producción
```

### Evaluación de la capa de lenguaje

```text
node --env-file=.env.local evaluacion/evaluar_g1.js
```

Corre 20 casos contra Gemini y guarda el resultado en `evaluacion/`. Los resultados están en `evidencia/evaluacion_g1.md`.

## Estructura de la carpeta

```text
mvp/
├─ README_mvp.md
├─ index.html
├─ api/
│   ├─ alerta.js
│   └─ telegram.js
├─ evaluacion/
│   └─ evaluar_g1.js
└─ evidencia/
    ├─ pruebas_usuario.md
    ├─ resultados_okr.md
    ├─ medicion_modelo.md
    ├─ evaluacion_g1.md
    └─ licencias_audios.md
```

## Limitaciones conocidas

- Necesita un dispositivo con la página abierta, la pantalla encendida e internet; no escucha en segundo plano.
- Solo reconoce alarmas de detectores de humo domésticos; no cubre alarmas de monóxido, de edificio ni sirenas.
- En las pruebas, el recall fue de 80 % y la alarma desde otra habitación no llegó a rojo.
- No funciona fuera del hogar.
- Cuando Gemini no responde a tiempo, se envía un texto de respaldo.

Más detalles en `evidencia/` y en `plantillas/plantilla_4_scorecard_risk.md`.
