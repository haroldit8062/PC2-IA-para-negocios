// api/telegram.js
// Webhook de Telegram. Cuando alguien escribe /start al bot, le responde con
// un botón que abre Alertly con su chat_id y un código de acceso (k).
// No guarda ningún dato y no escribe en los logs el chat id ni el token.

const crypto = require("crypto");

const APP_URL = "https://alertly-alpha.vercel.app/";

const TEXTO_START =
  "Hola, soy Alertly. Toca el botón para activar el monitoreo. " +
  "Este sistema usa inteligencia artificial y puede equivocarse: no reemplaza tu detector de humo.";
const TEXTO_OTRO = "Escribe /start para activar Alertly.";

// Código de acceso: primeros 32 caracteres del HMAC-SHA256 del chat id (igual que api/alerta.js).
function calcularCodigo(chatId) {
  return crypto
    .createHmac("sha256", process.env.ALERTA_SECRET)
    .update(String(chatId))
    .digest("hex")
    .slice(0, 32);
}

// ¿El encabezado secreto que manda Telegram coincide con el nuestro?
function secretoValido(recibido) {
  const esperado = process.env.TELEGRAM_WEBHOOK_SECRET;
  if (!esperado || typeof recibido !== "string") return false;
  const a = Buffer.from(esperado);
  const b = Buffer.from(recibido);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

// Envía un mensaje al chat. Si falla, lanza un error sin el token ni el chat id.
async function enviarMensaje(datos) {
  const url = `https://api.telegram.org/bot${process.env.TELEGRAM_TOKEN}/sendMessage`;
  const respuesta = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(datos),
  });
  if (!respuesta.ok) {
    throw new Error(`Telegram respondió con estado ${respuesta.status}`);
  }
}

module.exports = async function handler(req, res) {
  // Solo aceptamos POST.
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Usa el método POST" });
  }

  // Solo Telegram conoce el secreto que le dimos al registrar el webhook.
  if (!secretoValido(req.headers["x-telegram-bot-api-secret-token"])) {
    return res.status(401).json({ error: "No autorizado" });
  }

  try {
    const mensaje = req.body && req.body.message;
    const chatId = mensaje && mensaje.chat && mensaje.chat.id;
    if (chatId) {
      const texto = typeof mensaje.text === "string" ? mensaje.text : "";
      if (texto.startsWith("/start")) {
        const enlace = `${APP_URL}?chat_id=${chatId}&k=${calcularCodigo(chatId)}`;
        await enviarMensaje({
          chat_id: chatId,
          text: TEXTO_START,
          reply_markup: { inline_keyboard: [[{ text: "Abrir Alertly", url: enlace }]] },
        });
      } else {
        await enviarMensaje({ chat_id: chatId, text: TEXTO_OTRO });
      }
    }
  } catch (error) {
    // Solo el motivo general: nunca el chat id ni el token.
    console.error("Webhook: no se pudo responder:", error.message);
  }

  // Siempre 200 para que Telegram no reintente el mismo mensaje.
  return res.status(200).json({ ok: true });
};
