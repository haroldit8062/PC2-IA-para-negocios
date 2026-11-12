# Plantilla 1 — Problem Statement Canvas
## Framework PROMPT | Fase P — Problema de Negocio
### AD5018 Inteligencia Artificial para Negocios | UTEC

---

**Equipo:**
- Integrante 1: Harold Inca
- Integrante 2: Diego Requena
- Integrante 3: Jennifer Patiño

**Fecha de entrega:** 18/09/2026 (PC1) · **Actualizada:** 13/11/2026 (PC2)
**Versión del canvas:** v3 — PC2. El alcance y los niveles comprometidos en la PC1 se mantienen; se agregan los resultados reales en los bloques «Actualización PC2».

---

## SECCIÓN 1 — Definición del problema

### 1.1 Usuario afectado

Personas con discapacidad auditiva (sordera total o parcial) que pasan tiempo solas en su hogar, especialmente en situaciones donde no hay otra persona oyente cerca que pueda advertirles sobre sonidos críticos de seguridad en su entorno.

### 1.2 Problema específico

Estas personas pueden no percibir oportunamente una **alarma de incendio o detector de humo activado** en su vivienda. Al no contar con el canal auditivo, pueden no enterarse de una situación de riesgo real hasta que sea demasiado tarde para reaccionar con seguridad.

> **Nota de alcance (ajuste tras feedback docente):** el proyecto originalmente contemplaba 5 categorías de sonido (alarma, detector de humo, timbre, bocina, ruido de fondo). Tras recibir retroalimentación del profesor, el equipo decidió **reducir el alcance a una sola categoría crítica — la alarma de incendio / detector de humo —** frente a ruido de fondo, priorizando profundidad y calidad sobre amplitud. Se eligió este sonido porque representa el mayor riesgo de vida dentro de los escenarios cotidianos evaluados, y porque su patrón acústico es más estandarizado entre dispositivos, lo que permite lograr un clasificador confiable con un volumen de datos manejable para el curso.

### 1.3 Causa raíz

La causa raíz es que una alarma de incendio o detector de humo se comunica exclusivamente mediante una señal acústica, mientras que el usuario tiene acceso limitado o nulo a ese canal sensorial. Como consecuencia, una alerta de seguridad crítica puede no ser percibida en el momento en que ocurre.

### 1.4 Consecuencia medible

Una persona con discapacidad auditiva puede no identificar oportunamente una alarma de incendio real, lo que incrementa el riesgo de no reaccionar a tiempo ante una situación de peligro y reduce su autonomía y seguridad dentro del hogar.

Para esta propuesta académica se trabajará con un **baseline provisional** que permitirá estructurar la PC1:

- **Identificación correcta sin apoyo del MVP: 40 %.**
- **Tiempo promedio de reacción: 6 segundos.**

Estos valores se consideran **estimaciones académicas provisionales**, no resultados de una prueba real. La validación posterior del MVP se realizará con una muestra pequeña y manejable para el curso:

- **5 usuarios**;
- **10 eventos por usuario**;
- **50 observaciones de prueba en total**.

Los indicadores principales serán:

1. porcentaje de alarmas de incendio identificadas correctamente;
2. tiempo promedio desde que ocurre el sonido hasta que el usuario recibe la notificación.

> **Aclaración:** las muestras de audio mencionadas en el proyecto corresponden a audios de entrenamiento del modelo, no a personas participantes.

> **Actualización PC2:** los baselines de 40 % y 6 s eran estimaciones provisionales y nunca se midieron, por lo que no se afirma una mejora sobre ellos. La validación real se hizo con **4 usuarios y 32 observaciones** (no 5 y 50), de los cuales solo 1 tiene discapacidad auditiva (parcial). Resultados: 79.2 % de alarmas identificadas en rojo (91.7 % si se cuenta el ámbar con aviso) y una mediana de 7.8 s del sonido al aviso. Detalle en `mvp/evidencia/pruebas_usuario.md` y `resultados_okr.md`.

### 1.5 Declaración del problema — formato obligatorio

Las personas con discapacidad auditiva que permanecen solas en el hogar tienen dificultad para identificar oportunamente una alarma de incendio o detector de humo activado —debido a su acceso limitado o nulo al canal auditivo—, lo que incrementa la posibilidad de no reaccionar a tiempo ante una situación de riesgo real y reduce su seguridad y autonomía.

---

## SECCIÓN 2 — Filtro de validación IA

| Pregunta | SÍ/NO | Justificación |
|---|---|---|
| ¿Una hoja de cálculo o un formulario resuelve esto? | NO | El problema exige reconocer un patrón acústico capturado por un micrófono en tiempo real. |
| ¿El problema escala con el volumen de datos o usuarios? | SÍ | El desempeño del clasificador puede mejorar al incorporar más ejemplos y mayor diversidad de condiciones (distintos modelos de alarma, distancias, ruido ambiental). |
| ¿Hay un patrón repetitivo que un humano reconoce pero tarda en procesar? | SÍ | La alarma de incendio presenta un patrón acústico consistente y diferenciable del ruido de fondo. |
| ¿El problema requiere generar contenido, responder preguntas o razonar en lenguaje natural? | SÍ, de forma acotada | El resultado del clasificador debe convertirse en un mensaje claro enviado por notificación a Telegram (WhatsApp queda como mejora futura). |
| ¿Necesitas tanto predecir como explicar, comunicar o actuar? | SÍ | El componente analítico clasifica el sonido y el componente generativo redacta y envía la notificación al usuario. |

---

## SECCIÓN 3 — Los dos componentes del producto

### 3.1 Componente analítico

**Tarea:** Clasificación binaria.

**Clases:**
- alarma_incendio (incluye detector de humo)
- ruido_de_fondo

**Nivel:** **A3**

El modelo se entrenará en una primera versión, se evaluará su desempeño (matriz de confusión, recall), se recolectarán nuevos datos en las condiciones donde falle más y luego se reentrenará para comparar la mejora. Al trabajar con solo 2 clases, el equipo puede invertir ese esfuerzo de reentrenamiento en profundidad real —más variantes de alarmas, más condiciones de ruido— en vez de dispersarlo entre múltiples categorías.

> **Actualización PC2:** el ciclo se ejecutó de forma iterativa (errores observados → datos dirigidos → reentrenamiento): alarmas de 4 kHz que solo llegaban a ámbar, un grito, un claxon y un ventilador que confundían al modelo. El modelo final se midió con 30 pruebas: recall 80 % (meta 85 %), precisión 100 % y exactitud 90 %. La mejora entre versiones (KR4) no se midió con un conjunto comparable. Ver `medicion_modelo.md`.

### 3.2 Componente generativo

**Nivel:** **G1**

La capa de lenguaje recibe:
- clase predicha (alarma_incendio / ruido_de_fondo);
- score de confianza;
- nivel de criticidad y umbral.

Con esa información redacta un mensaje breve y claro, enviado como **notificación por Telegram**:
- Si detecta alarma_incendio con confianza suficiente → alerta de seguridad.
- Si detecta alarma_incendio con confianza insuficiente → mensaje de **duda**: expresa incertidumbre y pide verificar el entorno, sin decir nunca que no hay alarma.
- Si detecta ruido_de_fondo → mensaje tranquilizador, solo al iniciar, confirmando que no hay ninguna alarma activa y que el sistema sigue funcionando.

> **Actualización PC2:** en el producto, la **alarma confirmada usa un texto fijo** y no pasa por el modelo de lenguaje, porque en la evaluación de 20 casos los mensajes generados para ese caso fueron inconsistentes (tres oraciones, símbolos, términos técnicos, instrucciones inventadas). Gemini redacta solo los mensajes de duda y tranquilizador, con un texto de respaldo si no responde en 2 s. Ver `evaluacion_g1.md`.

### 3.3 Patrón de conexión

**Patrón 1 — Modelo → lenguaje**

```text
Audio → Clasificador (2 clases) → Clase + score → Reglas y umbrales
      → alarma confirmada: texto fijo ─────────────┐
      → duda o tranquilizador: G1 (Gemini) ────────┴→ Notificación por Telegram
```

### 3.4 Dónde va la ambición del equipo

- [X] **Profundidad en A3 y piso en G1**

La prioridad es mejorar la confiabilidad de la detección de la alarma de incendio. Un falso negativo (no detectar una alarma real) es el error más costoso posible en este producto, mucho más grave que una notificación redactada con poca sofisticación. Reducir el alcance a 2 clases permite dedicar el esfuerzo de recolección y reentrenamiento a que esa única detección crítica sea lo más confiable posible.

### 3.5 Métricas principales

- recall de la clase alarma_incendio (métrica prioritaria);
- precision de la clase alarma_incendio;
- accuracy global;
- matriz de confusión (2×2);
- porcentaje de alarmas identificadas correctamente;
- tiempo de reacción / tiempo hasta la notificación.

> **Actualización PC2:** estas métricas se reportan en `mvp/evidencia/resultados_okr.md`.

### 3.6 Solo si el equipo solicita excepción

No aplica. El equipo sí entrenará un modelo de clasificación de audio.

---

## SECCIÓN 4 — Autoevaluación

| Pregunta | Respuesta |
|---|---|
| ¿El problema está descrito sin mencionar tecnología? | SÍ |
| ¿La consecuencia tiene indicadores medibles? | SÍ |
| ¿Los dos componentes están definidos? | SÍ |
| ¿El patrón de conexión está elegido? | SÍ |
| ¿Está clara la ambición del equipo? | SÍ |
| ¿Está diferenciada la cantidad de audios frente a la cantidad de usuarios? | SÍ |
| ¿Todos los integrantes pueden explicar el canvas? | *(completar en equipo)* |

---

## SECCIÓN 5 — Actualización PC2 (13/11/2026)

| Elemento | PC1 | PC2 |
|---|---|---|
| Nombre | Alerta Sonora Accesible / Alertly | **Alertly** |
| Canal de notificación | Telegram o WhatsApp | **Solo Telegram** (WhatsApp, mejora futura) |
| Clases | 2 | 2 (sin cambios) |
| Validación | 5 usuarios × 10 eventos = 50 observaciones | 4 usuarios × 8 eventos = 32 observaciones |
| Mensajes | Alerta y tranquilizador | Tres: alarma (texto fijo), duda y tranquilizador |

Los KR comprometidos en la PC1 no se modificaron. Sus resultados, cumplan o no la meta, están en `mvp/evidencia/resultados_okr.md`.
