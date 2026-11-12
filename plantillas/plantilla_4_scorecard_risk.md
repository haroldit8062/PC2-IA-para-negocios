# Plantilla 4 — Scorecard y Registro de Riesgos
## Framework PROMPT | Fase T — Trazabilidad, riesgos y ética
### AD5018 Inteligencia Artificial para Negocios | UTEC

---

**Equipo:**
- Integrante 1: Harold Inca
- Integrante 2: Diego Requena


**Producto:** Alertly
**Fuentes de las cifras:** `mvp/evidencia/medicion_modelo.md`, `evaluacion_g1.md`, `pruebas_usuario.md` y `resultados_okr.md`.

---

## SECCIÓN 1 — Scorecard por componente

Una métrica de cada componente, con su meta de la PC1 y el resultado real.

### 1.1 Componente analítico (A3 — clasificador de audio)

| Métrica | Meta | Resultado | Estado |
|---|---|---|---|
| Recall de `alarma_incendio` | ≥ 85 % | 80 % (12/15) | No cumple |
| Precisión | ≥ 80 % | 100 % (12/12) | Cumple |
| Exactitud | ≥ 80 % | 90 % (27/30) | Cumple |
| Exactitud frente al baseline | Superarlo | 90 % frente a 58.2 % | Cumple |
| Falsas alarmas en rojo (30 pruebas) | Las menos posibles | 0 de 15 ruidos | — |
| Falsas alarmas en rojo (10 min de ruido continuo) | Las menos posibles | 0 (21 episodios ámbar) | — |

Matriz de confusión (rojo = dijo alarma): 12 aciertos en alarma, 3 alarmas perdidas (todas en ámbar), 0 falsas alarmas y 15 aciertos en ruido.

### 1.2 Componente generativo (G1 — capa de lenguaje)

| Métrica | Meta | Resultado | Estado |
|---|---|---|---|
| Calidad de los mensajes (20 casos) | ≥ 90 % | 85 % (17/20) | No cumple |
| Calidad de los 16 mensajes que Gemini escribe en el producto | ≥ 90 % | 100 % (16/16) | Cumple |
| Fallas de disponibilidad (503 o 429) | — | 0 de 20 | — |
| Respuestas en 2 s o menos | — | 13 de 20 (65 %); en las demás la app envía el texto de respaldo | — |

### 1.3 Sistema y usuarios

| Métrica | Meta | Resultado | Estado |
|---|---|---|---|
| Identificación de alarmas (KR1) | ≥ 80 % | 79.2 % estricto; 91.7 % amplio | No cumple (estricto) |
| Tiempo del sonido al aviso (KR2) | ≤ 3 s | Mediana 7.8 s | No cumple |
| Instalación sin ayuda | — | 4 de 4 (mediana 1:40) | — |
| Avisos entendidos | — | 22 de 22; claridad 4.75 de 5 | — |
| Participantes a los que molestaron los mensajes | — | 0 de 4 | — |

---

## SECCIÓN 2 — Registro de riesgos

La probabilidad y el impacto son una valoración cualitativa propuesta por el equipo. `[PENDIENTE: el equipo confirma las valoraciones]`

| ID | Riesgo | Componente | Prob. | Impacto | Evidencia | Mitigación implementada o propuesta | Riesgo residual |
|---|---|---|---|---|---|---|---|
| R1 | **Falso negativo:** una alarma real no llega a rojo | Modelo | Media | Alta | Recall 80 %; con la alarma en otra habitación, 0 de 4 en rojo en las sesiones | El estado ámbar envía un aviso de duda; recomendación de colocar el dispositivo cerca del detector; ampliar el dataset real | Alto: es el riesgo principal del producto |
| R2 | **El dispositivo se apaga, pierde internet o se bloquea** y nadie se entera | Sistema | Media | Alta | Limitación conocida | Wake Lock; recomendación de conectarlo al cargador; aviso en pantalla si deja de escuchar; opción de aviso «sigo activo» (`HEARTBEAT_HORAS`, desactivada) como mejora | Medio |
| R3 | **Fatiga por avisos de duda** | Sistema | Alta | Media | 21 episodios ámbar y 2 avisos en 10 minutos de ruido | El ámbar debe durar 5 s seguidos y hay máximo 1 aviso cada 5 minutos; línea explicativa en la pantalla ámbar | Medio |
| R4 | **Disponibilidad de Gemini** (errores 503 o 429, respuestas lentas) | Lenguaje | Alta | Baja | 7 de 20 respuestas superaron 2 s; en una prueba inicial solo 1 de 10 respondió a tiempo | Límite de 2 s y texto de respaldo; la alarma no usa Gemini | Bajo |
| R5 | **Mensajes de Gemini inconsistentes** (símbolos, 3 oraciones, instrucciones inventadas) | Lenguaje | Media | Media | Los 4 casos de control de G1 | Texto fijo para la alarma confirmada; prompt con reglas; evaluación de 20 casos | Bajo |
| R6 | **Datos personales:** el `chat_id` de Telegram | Datos | Baja | Alta | Ley N.° 29733 | El `chat_id` y el código de vinculación se guardan solo en el navegador del usuario; el audio no sale del navegador; consentimiento en las pruebas; códigos P1 a P4 | Bajo. Revisados los Runtime Logs de Vercel (12/11/2026): solo registran si existen las variables de entorno, no el `chat_id` ni valores de claves. No se revisó el registro de solicitudes, que podría incluir la dirección de la página (lleva el `chat_id`) |
| R7 | **Uso indebido de la función pública** | Seguridad | Media | Media | La URL es pública | Código `k` con HMAC (`ALERTA_SECRET`) que la función valida; secreto del webhook; claves fuera del repositorio | Bajo |
| R8 | **Clase de alarma mayormente sintética; pocas alarmas reales** | Datos | Alta | Media | Solo ≈87 de 627 muestras de alarma (14 %) vienen de detectores reales; las 15 alarmas de prueba salen de 4 grabaciones | Declarado; se probó con audios reales que no se entrenaron; ampliar con más detectores | Medio |
| R9 | **Dependencia de terceros** (Teachable Machine, Vercel plan Hobby, Telegram, Gemini gratuito) | Sistema | Media | Media | Servicios externos | Textos de respaldo; copia del modelo descargada; capturas para la demo | Medio |
| R10 | **Voces de terceros en los audios de entrenamiento y prueba** | Datos | Media | Media | Conversaciones, TV y un curso en línea | Consentimiento; los audios no se publican en el repositorio | Bajo |
| R11 | **Tiempo hasta el aviso mayor que la meta** | Sistema | Alta | Media | Mediana 7.8 s frente a 3 s | Limitación declarada; revisar la ventana de 3 s y la regla de 2 lecturas como mejora | Medio |
| R12 | **El usuario cree que Alertly reemplaza un detector de humo** | Uso | Media | Alta | Producto de IA que puede equivocarse | Aviso de IA visible en la página y en el bot: «No reemplaza tu detector de humo» | Medio |

---

## SECCIÓN 3 — Ética y transparencia

- **Transparencia:** la página y el bot indican que el sistema usa inteligencia artificial, que puede equivocarse y que no reemplaza un detector de humo.
- **Los dos tipos de error no pesan igual.** Un falso negativo (no avisar una alarma real) es mucho más grave que una falsa alarma. Por eso el diseño tolera dudas (ámbar) y prioriza el recall sobre la exactitud.
- **Nunca se tranquiliza ante una duda.** Cuando el modelo duda, el mensaje expresa incertidumbre y pide verificar; el prompt prohíbe decir que no hay alarma. El mensaje tranquilizador existe solo para el ruido de fondo.
- **La alarma confirmada no depende de un modelo de lenguaje.** Usa un texto fijo, porque los mensajes generados para ese caso fueron inconsistentes en la evaluación.
- **Honestidad sobre el alcance:** no cubre alarmas de monóxido ni de edificio, no funciona fuera del hogar y no se probó con alarmas reales encendidas.
- **Inclusión:** el producto se diseñó para personas con discapacidad auditiva, pero solo 1 de 4 participantes la tenía (parcial). Se declara como limitación.
- **Uso de IA en el proyecto:** el código se escribió con Claude Code y los borradores de documentos fueron asistidos por Claude; el equipo revisó los datos y las decisiones.

---

## SECCIÓN 4 — Ley N.° 29733 (Protección de Datos Personales)

> Descripción de lo que hace el sistema con los datos. No es asesoría legal.

| Dato | Dónde está | Para qué | Consentimiento | Conservación |
|---|---|---|---|---|
| **Identificador de chat de Telegram** (`chat_id`) | En el navegador del usuario y en la solicitud que la página envía a la función para entregar el aviso | Enviar los avisos al celular del usuario | El usuario inicia la conversación con el bot y toca el botón de vinculación; en las pruebas se leyó el consentimiento | No se guarda en una base de datos propia. Los Runtime Logs de Vercel no registran el `chat_id` (revisado el 12/11/2026); el registro de solicitudes de Vercel no se revisó y podría incluir la dirección de la página, que lleva el `chat_id` |
| **Audio del micrófono** | Se procesa en el navegador | Clasificar el sonido | El navegador pide permiso del micrófono | No se guarda ni sale del navegador; al servidor solo viaja la clase y la confianza |
| **Datos de los participantes de la validación** | Registro del equipo | Evaluar el MVP | Verbal o escrito, antes de empezar | Solo códigos P1 a P4; sin nombres, números ni identificadores; capturas sin datos personales |
| **Voces de terceros** en audios de entrenamiento y prueba | Equipos del equipo | Entrenar y probar el modelo | Las personas grabadas por el equipo dieron su consentimiento; la voz de un curso en línea es de un tercero | No se publican en el repositorio |

Medidas: el usuario puede **desvincular** su dispositivo desde «Detalles técnicos» (borra el `chat_id` y el código del navegador) y bloquear o eliminar el bot en Telegram; el código de vinculación se firma con un secreto que no está en el repositorio.

---

## SECCIÓN 5 — Mejoras y plan de monitoreo

| Mejora | Riesgo que reduce |
|---|---|
| Más alarmas reales de otras marcas, a distintas distancias | R1, R8 |
| Aviso cuando el dispositivo deja de escuchar o cuando la batería es baja | R2 |
| Subir el límite entre avisos de duda (por ejemplo, a 15 minutos) y medir el efecto | R3 |
| Mensajes de Gemini más cortos y repetir la evaluación de G1 | R4, R5 |
| Revisar la ventana de 3 s y la regla de 2 lecturas, midiendo tiempo y falsas alarmas | R11 |
| Unificar la redacción del texto fijo de la alarma («Posible alarma…») con la pantalla roja («ALARMA DE INCENDIO») y volver a validarla | R12 |
| WhatsApp como segundo canal | R9 |
| Contacto de confianza que reciba el aviso si el usuario no responde | R1, R2 |

---

## SECCIÓN 6 — Autoevaluación

| Pregunta | Respuesta |
|---|---|
| ¿Hay una métrica por cada componente? | SÍ |
| ¿Los riesgos tienen evidencia, mitigación y riesgo residual? | SÍ |
| ¿Se reportan las metas no cumplidas? | SÍ |
| ¿Se describen el tratamiento de datos personales y la Ley N.° 29733? | SÍ, con pendientes marcados |
| ¿Se declaran las limitaciones de la validación? | SÍ |

---

*Framework PROMPT v2.0 — AD5018 UTEC | Plantilla 4 de 4*
