# Plantilla 3 — AI Product Canvas
## Framework PROMPT | Fase O — Diseño del Producto
### AD5018 Inteligencia Artificial para Negocios | UTEC

---

**Equipo:**
- Integrante 1: Harold Inca
- Integrante 2: Diego Requena


**Versión:** v3 — PC2. El alcance, los niveles y los KR de la PC1 se mantienen; se actualizan el diseño real, el prompt, los umbrales, los criterios de éxito y los resultados. Los cambios están marcados como «PC2».

---

# SECCIÓN 1 — AI Product Canvas

## 1.1 Nombre del MVP

**Alertly**

## 1.2 Problema

Las personas con discapacidad auditiva que permanecen solas en el hogar tienen dificultad para identificar oportunamente una alarma de incendio o detector de humo activado —debido a su acceso limitado o nulo al canal auditivo—, lo que incrementa la posibilidad de no reaccionar a tiempo ante una situación de riesgo real y reduce su seguridad y autonomía.

## 1.3 Usuario objetivo

Personas con discapacidad auditiva total o parcial que pasan periodos de tiempo solas en casa, cuentan con un dispositivo con micrófono que pueden dejar fijo en el hogar, y tienen una cuenta de Telegram en su celular donde recibir notificaciones. *(PC2: solo Telegram.)*

## 1.4 Propuesta de valor

Detectar si suena una alarma de incendio en el entorno del usuario y enviarle una notificación clara por Telegram. Cuando el sistema duda, lo dice y pide verificar; al iniciar, confirma que está activo. Alertly es un **complemento** y no reemplaza un detector de humo.

---

# SECCIÓN 2 — Componentes

## Analítico

**A3 — Clasificación de audio (binaria)**

Clases:
- alarma_incendio (incluye detector de humo)
- ruido_de_fondo


## Generativo

**G1 — Prompt con contexto fijo**

Entrada: clase, confianza, criticidad y umbral. Salida: mensaje breve de **duda** o **tranquilizador** (máximo dos oraciones) para Telegram.


---

# SECCIÓN 3 — Flujo

```text
Micrófono
↓
Audio (se procesa en el navegador)
↓
Modelo A3 (2 clases)
↓
Clase + confianza
↓
Reglas: umbrales y ventana de 3 s
↓
Rojo (alarma confirmada) ── texto fijo ──────────────┐
Ámbar (duda) ──── G1 / texto de respaldo ────────────┤
Verde (solo al iniciar) ── G1 / texto de respaldo ───┴→ Telegram → Usuario
```

---

# SECCIÓN 4 — Mensajes y System Prompt

## 4.1 Mensajes (PC2)

| Situación | Quién lo escribe | Texto |
|---|---|---|
| Alarma confirmada | Texto fijo del sistema | «Posible alarma de incendio detectada. Verifica tu entorno.» |
| Duda (alarma bajo el umbral) | Gemini; respaldo si falla o tarda más de 2 s | Respaldo: «Escuché un sonido que podría ser una alarma, pero no estoy seguro. Verifica tu entorno.» |
| Tranquilizador (solo ruido de fondo, al iniciar) | Gemini; respaldo si falla o tarda más de 2 s | Respaldo: «No se detecta ninguna alarma. El sistema sigue activo.» |

## 4.2 System Prompt vigente

Texto exacto de la constante `SYSTEM_PROMPT` de `mvp/api/alerta.js` (líneas 8 a 28). El pedido a Gemini tiene el formato `Clase: … Confianza: … Criticidad: … Umbral: …`.

```text
Eres la capa de comunicación de un sistema de accesibilidad para personas
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
- Máximo dos oraciones.
```

## 4.3 Textos fijos y de respaldo en el código

| Constante en `api/alerta.js` | Se usa cuando | Texto |
|---|---|---|
| `MENSAJE_ALARMA_CONFIRMADA` | Siempre que hay una alarma confirmada (`USAR_GEMINI_EN_ALARMA = false`, sin pasar por Gemini) | «Posible alarma de incendio detectada. Verifica tu entorno.» |
| `MENSAJE_INCIERTO` | Duda, si Gemini falla o tarda más de 2 s | «Escuché un sonido que podría ser una alarma, pero no estoy seguro. Verifica tu entorno.» |
| `MENSAJE_TRANQUILIZADOR` | Ruido de fondo, si Gemini falla o tarda más de 2 s | «No se detecta ninguna alarma. El sistema sigue activo.» |

> **Nota:** el texto fijo de la alarma empieza con «Posible», mientras que la pantalla roja dice «ALARMA DE INCENDIO». Se mantuvo el texto con el que se validó el MVP con los participantes; unificar la redacción queda como mejora futura.

> **Por qué la duda nunca tranquiliza:** en una prueba temprana, Gemini respondió «no se ha detectado ninguna alarma» ante una alarma con confianza 0.60. En un producto de seguridad, la falsa tranquilidad es el error más costoso, por lo que se separaron las reglas de duda y de ruido.

---

# SECCIÓN 5 — Model Design Canvas

## Dataset

| Clase | PC1 (inicial) | PC2 (modelo final, muestras de 1 s) |
|---|---:|---:|
| Alarma de incendio | 60 audios | 627 |
| Ruido de fondo | 70 audios | 872 |
| **Total** | **130** | **1 499** |

> Las cifras corresponden a audios de entrenamiento, no a personas. La clase de alarma es mayormente sintética (≈86 %) y trae ≈87 muestras de detectores reales; ver `plantilla_2_data_readiness.md`.

## Baseline técnico

| | Valor |
|---|---|
| PC1 (dataset inicial) | 70 / 130 = 53.8 % de exactitud |
| PC2 (dataset actual) | 872 / 1 499 = **58.2 %** |

Un modelo que siempre dijera «ruido de fondo» tendría esa exactitud y 0 % de recall en la clase que importa. Por eso la métrica prioritaria es el **recall de alarma_incendio**.

## Baseline de negocio provisional (PC1)

- identificación correcta sin MVP: **40 %**;
- tiempo promedio de reacción: **6 segundos**.

Fueron estimaciones académicas provisionales y no se midieron.

## Métricas y metas técnicas

| Métrica | Meta | Resultado PC2 |
|---|---|---|
| Recall de alarma_incendio (prioritaria) | ≥ 85 % | 80 % (12/15) |
| Precisión de alarma_incendio | ≥ 80 % | 100 % (12/12) |
| Exactitud global | ≥ 80 % | 90 % (27/30) |
| Matriz de confusión (2×2) | — | 12 / 3 / 0 / 15 |

---

# SECCIÓN 6 — Umbrales

**Corrección PC2.** La versión de la PC1 decía que 0.80 era un umbral «más bajo». Es al revés: **0.80 es el umbral más alto**, el que exige el sistema para confirmar una alarma, y 0.50 es el umbral de duda.

## 6.1 Umbrales de decisión de la página

| Estado | Condición | Mensaje |
|---|---|---|
| **Rojo** (alarma confirmada) | 2 lecturas con confianza ≥ 0.80 en una ventana de 3 s | Texto fijo |
| **Ámbar** (duda) | El máximo de la ventana entre 0.50 y 0.80 | G1 (duda), si dura 5 s seguidos |
| **Verde** | Ruido de fondo | G1 (tranquilizador), solo al iniciar |

## 6.2 Criticidad y umbral que recibe G1

| Clase | Criticidad | Umbral |
|---|---|---:|
| Alarma de incendio | Alta | 0.80 |
| Ruido de fondo | Baja | 0.70 |

> **Costo del error:** un falso negativo (no avisar una alarma real) es mucho más grave que una falsa alarma. Por eso existe el estado ámbar: ante la duda, el sistema avisa que duda en lugar de callar o de tranquilizar.

## 6.3 Reglas de envío (anti-saturación)

| Regla | Valor |
|---|---|
| Mensaje tranquilizador | Una sola vez, al iniciar |
| Alarma | Aviso al empezar y hasta 2 recordatorios (uno por minuto); el evento termina tras 30 s sin lecturas de alarma |
| Aviso de duda | El ámbar debe durar 5 s seguidos, máximo 1 aviso cada 5 minutos y ninguno en los 2 minutos posteriores a una alarma |
| Límite de Gemini | 2 s; si no responde, texto de respaldo |

---

# SECCIÓN 7 — OKRs

Los KR no se modificaron después de la Semana 6. Resultados en `mvp/evidencia/resultados_okr.md`.

## Objetivo

Mejorar la capacidad del usuario para identificar oportunamente una alarma de incendio en su hogar mediante un MVP accesible por notificaciones.

| KR | Texto (PC1, sin cambios) | Resultado PC2 | Estado |
|---|---|---|---|
| **KR1** | Pasar de un baseline provisional de 40 % de identificación correcta a ≥ 80 % | 79.2 % estricto (19/24); 91.7 % amplio (22/24) | No cumple (estricto) |
| **KR2** | Reducir el tiempo promedio de reacción de 6 s a ≤ 3 s, desde que ocurre el sonido hasta que llega la notificación | Mediana 7.8 s | No cumple |
| **KR3** | Superar el baseline técnico de 53.8 % y alcanzar exactitud ≥ 80 % y recall de alarma_incendio ≥ 85 % | Exactitud 90 %, recall 80 %; baseline actual 58.2 % superado | Parcial |
| **KR4** | Tras reentrenar, mejorar al menos 5 puntos porcentuales de recall en alarma_incendio | No medido | No medido |
| **KR5** | ≥ 90 % de 20 casos de prueba G1 correctos y comprensibles | 85 % (17/20); 100 % (16/16 de los que escribe Gemini) | No cumple (20 casos) / cumple (16) |

---

# SECCIÓN 8 — Validación con usuarios

**Comprometido en la PC1:** 5 usuarios × 10 eventos = 50 observaciones.
**Realizado en la PC2:** 4 usuarios × 8 eventos = **32 observaciones** (11/11/2026). Solo 1 participante (P3) tiene discapacidad auditiva, en forma parcial; fue difícil encontrar más personas con discapacidad auditiva y se prefirió no sumar más personas sin discapacidad para que no predominaran.

Se registró, por evento: color en pantalla, si llegó el aviso, segundos hasta el aviso, texto recibido (Gemini, respaldo o fijo) y comprensión; y, por persona: instalación sin ayuda, preguntas finales y mensajes recibidos. Detalle en `mvp/evidencia/pruebas_usuario.md`.

> **Nota:** en las sesiones, la página corrió en el celular de cada participante, que también recibió los avisos. En el uso previsto, un dispositivo fijo escucha y el celular del usuario recibe; esa configuración no se probó con participantes.

---

# SECCIÓN 9 — Estrategia A3

1. Entrenar una primera versión con las 2 clases.
2. Evaluar errores.
3. Identificar los sonidos que más confunden al modelo.
4. Recolectar datos dirigidos a esas condiciones.
5. Reentrenar.
6. Comparar versiones.


---

# SECCIÓN 10 — Stack (PC2, tal como se construyó)

| Capa | Tecnología |
|---|---|
| Modelo | Teachable Machine (audio) |
| Inferencia | TensorFlow.js, en el navegador |
| Audio | Web Audio API |
| Página | `index.html` (micrófono, tres estados, vinculación y aviso de IA) |
| G1 | API de Gemini (`gemini-3.1-flash-lite`) con prompt fijo |
| Notificaciones | Telegram Bot API (solo Telegram) |
| Backend | Funciones serverless (`api/alerta.js`, `api/telegram.js`) |
| Despliegue | Vercel (plan Hobby) |
| Repositorio | GitHub |

---

# SECCIÓN 11 — Alcance

## Incluye
- captura de audio en el navegador;
- dos clases (alarma_incendio, ruido_de_fondo);
- confianza, umbrales y ventana de decisión;
- notificación por Telegram con tres mensajes: alarma (texto fijo), duda y tranquilizador;
- G1 con texto de respaldo;
- vinculación sin escribir el `chat_id` (bot → «Abrir Alertly»);
- reentrenamiento A3;
- validación con usuarios (4).

## No incluye
- reconocimiento de más de 2 categorías ni alarmas de monóxido, de edificio o sirenas;
- llamadas automáticas de emergencia y geolocalización;
- almacenamiento permanente de audio;
- aplicación móvil nativa, dashboard o historial *(la página solo muestra los tres estados)*;
- WhatsApp *(mejora futura)*, wearables, RAG, agentes y automatizaciones adicionales;
- funcionamiento fuera del hogar o con la página cerrada.

---

# SECCIÓN 12 — Criterios de éxito

| # | Criterio (PC1) | Estado PC2 |
|---|---|---|
| 1 | ≥ 80 % de alarmas de incendio identificadas correctamente | 79.2 % estricto; 91.7 % amplio |
| 2 | ≤ 3 s de tiempo promedio hasta la notificación | No cumple (7.8 s) |
| 3 | Exactitud ≥ 80 % | Cumple (90 %) |
| 4 | Recall de alarma_incendio ≥ 85 % | No cumple (80 %) |
| 5 | Mejora ≥ 5 pp tras el reentrenamiento | No medido |
| 6 | ≥ 90 % de casos G1 correctos | 85 % (20 casos) / 100 % (16 de Gemini) |
| 7 | Bot de Telegram funcional | Cumple. **Corrección PC2:** el criterio decía «sin instalación adicional», lo cual no es cierto: el usuario necesita Telegram instalado y un dispositivo con la página abierta |
| 8 | 5 usuarios completan la prueba | 4 usuarios |
| 9 | 50 observaciones documentadas | 32 observaciones |

---

# SECCIÓN 13 — Resumen de cifras

| Elemento | PC1 | PC2 (real) |
|---|---:|---:|
| Muestras de entrenamiento | 130 | 1 499 (627 y 872) |
| Clases | 2 | 2 |
| Participantes | 5 | 4 |
| Eventos por persona | 10 | 8 |
| Observaciones humanas | 50 | 32 |
| Baseline técnico (exactitud) | 53.8 % | 58.2 % |
| Baseline de negocio provisional | 40 % | No medido |
| Tiempo base provisional | 6 s | No medido |
| Identificación | meta ≥ 80 % | 79.2 % (estricto) |
| Tiempo hasta el aviso | meta ≤ 3 s | 7.8 s |
| Exactitud | meta ≥ 80 % | 90 % |
| Recall crítico (alarma_incendio) | meta ≥ 85 % | 80 % |
| Mejora A3 | meta ≥ 5 pp | No medido |
| Casos G1 | 20 | 20 |
| Calidad G1 | meta ≥ 90 % | 85 % (20 casos) / 100 % (16) |
