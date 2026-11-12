# Resumen Ejecutivo
## Proyecto Integrador de IA para Negocios — AD5018
### MVP: Alertly (PC2)

**Equipo:** Harold Inca · Diego Requena · Jennifer Patiño
**Entrega:** 13/11/2026 · **URL:** https://alertly-alpha.vercel.app · **Bot:** https://t.me/Alertly_alarma_bot

---

## Problema y usuario

Una persona con discapacidad auditiva que está sola en casa puede no enterarse de que suena la alarma de su detector de humo, porque esa alerta se comunica solo con sonido. Eso retrasa su reacción ante un riesgo de vida y reduce su autonomía.

## Solución

**Alertly** es un complemento, no un reemplazo del detector de humo. Un dispositivo fijo en el hogar escucha el ambiente; un modelo de audio entrenado por el equipo distingue la alarma del ruido de fondo y, si la detecta, avisa por Telegram al celular del usuario.

- **Componente analítico (A3):** clasificador de audio de 2 clases con Teachable Machine, que corre en el navegador (el audio no sale del dispositivo).
- **Componente generativo (G1):** un modelo de lenguaje redacta el mensaje de duda y el tranquilizador, con un texto de respaldo si no responde a tiempo. La alarma confirmada usa un texto fijo.
- **Tres estados:** verde (todo tranquilo), ámbar (el sistema duda y pide verificar) y rojo (alarma). Ante la duda, nunca tranquiliza.

El alcance se redujo, por feedback del profesor, a 2 clases y a notificaciones por Telegram.

## Resultados (valores reales)

| Indicador | Meta | Resultado |
|---|---|---|
| Alarmas identificadas en rojo (KR1) | ≥ 80 % | 79.2 % (19/24); 91.7 % si se cuenta el ámbar con aviso |
| Tiempo del sonido al aviso (KR2) | ≤ 3 s | Mediana 7.8 s |
| Exactitud del modelo (KR3) | ≥ 80 % | 90 % |
| Recall de alarma (KR3) | ≥ 85 % | 80 % (12/15); precisión 100 % |
| Mejora tras reentrenar (KR4) | ≥ +5 pp | No medido |
| Calidad de G1 (KR5) | ≥ 90 % | 85 % (17/20); 100 % (16/16 de los que escribe Gemini) |

**Validación con 4 usuarios** (32 observaciones; 1 con discapacidad auditiva parcial): los 4 instalaron el sistema sin ayuda (mediana 1:40), entendieron los 22 avisos recibidos y no hubo falsas alarmas en rojo. En una prueba de 10 minutos de ruido tampoco hubo falsas alarmas en rojo, aunque el sistema dudó 21 veces.

## Riesgos principales

- **Falso negativo:** la alarma desde otra habitación solo llegó a ámbar (0 de 4). Mitigación: colocar el dispositivo cerca del detector.
- **El dispositivo se apaga o pierde internet:** nadie se entera.
- **Dependencia de Gemini:** respondió en más de 2 s en 7 de 20 casos; hay texto de respaldo y la alarma no depende de él.
- **Datos personales:** el `chat_id` solo se guarda en el navegador del usuario (Ley N.° 29733).

## Limitaciones

Dataset de alarma mayormente sintético (86 %), con pocas grabaciones reales; 4 participantes en lugar de 5; tiempos medidos a mano; no cubre alarmas de monóxido ni de edificio.

## Próximos pasos

Más alarmas reales de distintas marcas y distancias, revisar la regla de decisión para reducir el tiempo, aviso cuando el dispositivo deja de escuchar, mensajes de G1 más cortos, WhatsApp como segundo canal y validar con más personas con discapacidad auditiva.

---

*Detalle y evidencia en `mvp/evidencia/` y `plantillas/`. Framework PROMPT v2.0 — AD5018 UTEC.*
