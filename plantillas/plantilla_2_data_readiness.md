# Plantilla 2 — Data Readiness Checklist
## Framework PROMPT | Fase R — Recursos de Datos
### AD5018 Inteligencia Artificial para Negocios | UTEC

---

**Equipo:**
- Integrante 1: Harold Inca
- Integrante 2: Diego Requena



**Tipo de IA del proyecto:** Combinación — Clasificación de audio binaria, Nivel A3 (analítico, con reentrenamiento y medición de mejora) + capa de lenguaje G1 que traduce el resultado en una notificación por Telegram (generativo)

> **Actualización PC2:** este documento conserva la estructura de la PC1 y refleja los datos reales con los que se construyó y se midió el MVP. Lo que cambió respecto de la PC1 está marcado como «PC2».

---

## SECCIÓN 1 — Inventario de datos

### Parte A — Componente generativo: inventario de conocimiento

| # | Tipo de información | Dónde está | Formato | ¿Está disponible? |
|---|---|---|---|---|
| 1 | Mapeo alarma confirmada → texto de alerta: «Posible alarma de incendio detectada. Verifica tu entorno.» (PC2: texto fijo, sin modelo de lenguaje) | `api/alerta.js` | Texto en el código | SÍ |
| 2 | Mapeo duda (alarma bajo el umbral) → mensaje. Gemini lo redacta; respaldo: «Escuché un sonido que podría ser una alarma, pero no estoy seguro. Verifica tu entorno.» | `api/alerta.js` | Prompt + texto de respaldo | SÍ |
| 3 | Mapeo ausencia de alarma → mensaje tranquilizador (solo al iniciar). Respaldo: «No se detecta ninguna alarma. El sistema sigue activo.» | `api/alerta.js` | Prompt + texto de respaldo | SÍ |
| 4 | Aviso de IA y privacidad: «Este sistema usa inteligencia artificial y puede equivocarse. No reemplaza tu detector de humo.» | `index.html` y mensaje del bot | Texto plano | SÍ |
| 5 | Justificación de umbrales por clase (costo del error): 0.80 para confirmar una alarma, 0.50 para la duda | `index.html` y Plantilla 3, sección 6 | Documento de diseño | SÍ |
| 6 | Instrucciones de uso y vinculación (bot → «Abrir Alertly») | Mensaje del bot y tarjeta «Antes de empezar» | Texto plano | SÍ (PC2) |

**Estrategia de contexto elegida:**
- [X] **G1** Prompt simple *(base de conocimiento pequeña y estable)*
- [ ] **G2** RAG
- [ ] **G3/G4** Agente con herramientas
- [ ] Memoria de sesión

> **Justificación:** el conocimiento del componente generativo es pequeño y estable: tres situaciones (alarma, duda y ruido de fondo), cada una con un mensaje. No cambia con frecuencia ni requiere buscar en documentos externos, por lo que G1 (prompt con contexto fijo) sigue siendo la opción correcta. **PC2:** la alarma confirmada se resuelve con un texto fijo y no con el modelo de lenguaje.

**Si el nivel es G2 (RAG) o G3/G4:** No aplica.

---

### Parte B — Componente analítico: inventario de datos históricos

| # | Dataset | Fuente | Formato | N° de registros | ¿Tiene etiquetas? |
|---|---|---|---|---|---|
| 1 | Audio de alarma de incendio / detector de humo (clase `alarma_incendio`) | Audios sintéticos generados por código (≈540 muestras: 6 detectores de tono T3 y 18 diseñados a partir de las grabaciones peruanas) y grabaciones reales de detectores de humo hechas con su celular por un amigo del equipo (≈87 muestras; no son de Freesound) | .wav | **627 muestras** de 1 s (las corta Teachable Machine) | SÍ (por clase) |
| 2 | Audio de ruido de fondo (clase `ruido_de_fondo`) | Audios sintéticos (≈460 muestras: sonidos parecidos a una alarma doméstica, pitidos aislados y claxons) y grabaciones propias (≈412 muestras: conversaciones, TV, cocina, calle, ventilador y voces fuertes) | .wav | **872 muestras** de 1 s | SÍ |
| 3 | Conjunto de prueba (no entrenado) | 15 pruebas de alarma (4 grabaciones reales distintas) y 15 de ruido (reales y sintéticas) | .wav | 30 pruebas | SÍ |

**Composición aproximada** (una muestra por segundo de audio):

| Clase | Sintéticas (generadas por código) | Reales | Total |
|---|---:|---:|---:|
| Alarma de incendio | ≈540 (86 %) | ≈87 (14 %) | 627 |
| Ruido de fondo | ≈460 (53 %) | ≈412 (47 %) | 872 |
| **Total** | **≈1 000 (67 %)** | **≈499 (33 %)** | **1 499** |

Las ≈87 muestras reales de alarma son grabaciones de **detectores de humo reales** hechas con su celular por un amigo del equipo. Las otras alarmas reales (2 peruanas y 2 de Freesound) se usaron solo para probar el modelo. Los audios sintéticos de alarma se diseñaron a partir de las dos grabaciones peruanas que luego se usaron en 10 de las 15 pruebas de alarma, por lo que esas pruebas no son totalmente ciegas; las 5 pruebas con audios de Freesound no se usaron para diseñar nada.


**Variable objetivo (target):**
```
La categoría de sonido detectado en un fragmento de audio: alarma_incendio
(incluye detector de humo) o ruido_de_fondo (ausencia de alarma).
```

**Tipo de problema confirmado:**
- [X] Clasificación (binaria) — decide entre 2 categorías
- [ ] Regresión
- [ ] Agrupamiento

**Recuento de casos por categoría (PC2):**

| Categoría | N° de muestras (modelo final) |
|---|---|
| Alarma de incendio | 627 |
| Ruido de fondo | 872 |

> **Balance:** la clase de ruido es 1.4 veces la de alarma. Con el dataset actual, el baseline de predecir siempre «ruido de fondo» es 872 / 1 499 = **58.2 %** (el 53.8 % de la PC1 correspondía al dataset inicial de 130 audios).
>
> **Nivel A3:** la segunda ronda de recolección se hizo de forma iterativa, dirigida a los errores observados: alarmas de 4 kHz que solo llegaban a ámbar, un grito, un claxon y un ventilador. Ver `mvp/evidencia/resultados_okr.md`, KR4.

**Revisión de fuga de datos (obligatoria):**

| Variable sospechosa | ¿Existe antes del hecho a predecir? | Decisión |
|---|---|---|
| Volumen/ruido de fondo del clip | SÍ — el micrófono lo capta en el momento real | Se mantiene |
| Duración del clip (1 s, definido por Teachable Machine) | SÍ | Se mantiene |
| **PC2:** audios de prueba que pudieran haber entrado al entrenamiento | No debe ocurrir | Los audios de prueba se separaron antes de entrenar; las versiones regrabadas o repetidas de un mismo audio quedan del mismo lado |

> No se identifican variables con fuga de datos: el modelo solo usa el audio capturado en el instante.

---

### Parte C — Cómo se conectan los datos de ambos componentes

```
El componente analítico (modelo de audio en Teachable Machine, en el
navegador) recibe el sonido del micrófono y devuelve la clase predicha
(alarma_incendio o ruido_de_fondo) y la confianza (ej. 0.92).

Las reglas de la página deciden el estado:
- Rojo: 2 lecturas con confianza >= 0.80 en una ventana de 3 s. Se envía
  el texto fijo de alarma.
- Ámbar: el máximo de la ventana entre 0.50 y 0.80. Si dura 5 s seguidos
  (y no hay otro aviso de duda en los últimos 5 minutos), la capa G1
  redacta un mensaje de duda.
- Verde: ruido de fondo. Al iniciar, la capa G1 redacta un mensaje
  tranquilizador.
```

---

## SECCIÓN 2 — Evaluación de calidad con semáforo

### Dataset / Fuente principal: audio de alarma de incendio y ruido de fondo

| Dimensión | Semáforo | Evidencia que respalda la evaluación | Plan de acción (si es 🟡 o 🔴) |
|---|---|---|---|
| **Disponibilidad** | 🟢 | Hay clips de alarmas en bancos de sonido de acceso gratuito y se generaron audios propios y sintéticos | — |
| **Volumen** | 🟡 | 627 y 872 muestras, pero ninguna alarma de entrenamiento es de un detector real (15 pruebas con alarmas reales salen de 4 grabaciones) | Declarado como limitación; ampliar con más alarmas reales |
| **Calidad** | 🟡 | La clase alarma es mayormente sintética (86 %); las ≈87 muestras reales las grabó un amigo con su celular | Las pruebas se hicieron con audios reales no entrenados |
| **Relevancia** | 🟡 | Los audios corresponden al escenario de mayor riesgo, pero solo 2 grabaciones son de detectores vendidos en Perú (marca y modelo desconocidos) | Probar con más detectores reales |
| **Legalidad** | 🟡 | Los audios de prueba de Freesound son CC BY 3.0 y 4.0 (exigen atribución) y están acreditados; falta documentar la fuente de algunos audios de entrenamiento de terceros | Ver Bloqueante 2 |
| **Etiquetas (analítico)** | 🟢 | Cada clase se etiqueta por su nombre en Teachable Machine | — |
| **Balance (analítico)** | 🟢 | 627 frente a 872 muestras (1.4 veces) | — |
| **Fuga de datos (analítico)** | 🟢 | Conjunto de prueba separado antes de entrenar; revisado en la Sección 1, Parte B | — |
| **Vigencia (analítico)** | 🟢 | El sonido de una alarma no cambia con el tiempo | — |
| **Cobertura (generativo)** | 🟢 | Los 3 mensajes cubren las 3 situaciones que produce el sistema | — |
| **Actualidad (generativo)** | 🟢 | Conocimiento fijo y estable | — |
| **Permisos (solo agentes)** | — | No aplica | — |

---

### Dataset / Fuente secundaria: No aplica.

---

## SECCIÓN 3 — Plan de resolución de bloqueantes (estado en la PC2)

### Bloqueante 1
```
Dimensión afectada: Volumen
Descripción del problema (PC1): faltaba completar la recolección de
muestras para las 2 clases.
Estado PC2: PARCIALMENTE RESUELTO. El modelo final se entrenó con 627
muestras de alarma y 872 de ruido de fondo. Persiste el riesgo de pocas
alarmas reales.
Acción pendiente: ampliar con alarmas reales de más marcas y a distintas
distancias, y con alarmas desde otras habitaciones (la condición más
débil en las pruebas).
Plan B aplicado: audios sintéticos diseñados a partir de grabaciones
reales, declarados como tales.
```

### Bloqueante 2
```
Dimensión afectada: Legalidad
Descripción del problema (PC1): no se había revisado la licencia de cada
clip descargado.
Estado PC2: PARCIALMENTE RESUELTO. Los dos audios de Freesound usados en
las pruebas tienen licencia de atribución (CC BY 3.0 y 4.0) y están
acreditados en mvp/evidencia/licencias_audios.md; no se redistribuyen.
Acción pendiente: documentar la fuente y licencia de los demás audios de
terceros usados para entrenar.
Plan B: sustituir esos clips por grabaciones propias.
```

---

## SECCIÓN 4 — Privacidad y legalidad de los datos

| Pregunta | Respuesta | Detalle |
|---|---|---|
| ¿Los datos contienen información personal de usuarios? | PARCIALMENTE | Los audios de alarma no. Algunos audios de ruido de fondo contienen voces de terceros (conversaciones, TV y un curso en línea). Además, el sistema maneja el identificador de chat de Telegram del usuario. |
| ¿Se cuenta con consentimiento explícito para usar esos datos? | SÍ, salvo la voz de un tercero en un curso en línea | Participantes de la validación: consentimiento verbal o escrito. Personas grabadas por el equipo en audios propios: todas dieron su consentimiento. Usuario del bot: inicia la conversación y toca el botón de vinculación. La voz del curso en línea es de un tercero y no se publica. |
| ¿Los datos serán anonimizados antes de usarlos en el proyecto? | SÍ, en la validación | Participantes identificados solo como P1 a P4, sin nombres ni números; capturas sin datos personales. Las voces de terceros no se publican en el repositorio. |
| ¿Aplica la Ley N.° 29733 de Protección de Datos Personales del Perú? | SÍ (descripción, no asesoría legal) | Aplica al `chat_id` y a las voces de terceros. El `chat_id` solo se guarda en el navegador del usuario; el audio se procesa en el navegador y no se guarda. Detalle en la Plantilla 4. |
| ¿Hay alguna restricción contractual o de confidencialidad? | NO | Fuentes públicas, grabaciones propias y audios sintéticos. Los de atribución se acreditan. |

---

## SECCIÓN 5 — Autoevaluación del equipo

| Pregunta de control | Respuesta |
|---|---|
| ¿Cada semáforo tiene evidencia concreta que lo respalda? | SÍ |
| ¿Todos los 🔴 tienen un plan de acción con fecha y responsable? | SÍ (no hay 🔴; los 🟡 tienen plan) |
| ¿El equipo verificó el acceso real a los datos? | SÍ — el modelo se entrenó y se midió |
| ¿La estrategia de contexto es coherente con los datos disponibles? | SÍ |
| ¿Hay casos suficientes de **cada** categoría, no solo filas en total? | PARCIAL — 627 y 872 muestras, pero la clase de alarma no incluye detectores reales |
| ¿Se revisó variable por variable que no haya fuga de datos? | SÍ |
| ¿Están inventariadas las herramientas del agente? | N/A — no hay agente |

---
