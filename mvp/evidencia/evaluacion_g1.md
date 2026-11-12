# Evaluación de la capa de lenguaje (G1) — Alertly (PC2)

> Evaluación de los mensajes que redacta Gemini con 20 casos, una sola corrida, con el mismo prompt, modelo y formato de mensaje que usa el producto. Corrida del 09/11/2026 (~17:34).

## Resumen

| Lectura | Resultado | Meta (KR5) |
|---|---|---|
| Los 20 casos (lectura literal del KR5) | 17 de 20 = 85 % | ≥ 90 %: No cumple |
| Solo los 16 mensajes que Gemini escribe en el producto (tranquilizador y duda) | 16 de 16 = 100 % | ≥ 90 %: Cumple |
| Los 4 casos de control (alarma confirmada; en el producto usa texto fijo) | 1 de 4 | — |
| Fallas de disponibilidad (503 o 429 en los 3 intentos) | 0 | — |
| Tiempo promedio de respuesta | 3 840 ms | — |
| Respuestas de más de 2 s (en la app habrían usado el texto de respaldo) | 7 de 20 (6 de los 16 de Gemini) | — |

Falta confirmar con el profesor cuál de las dos lecturas cuenta para el KR5. Se reportan ambas.

## 1. Método

- **Casos:** 9 de `ruido_de_fondo` (mensaje tranquilizador; confianzas 0.99 a 0.52), 7 de `alarma_incendio` bajo el umbral (mensaje de duda; confianzas 0.79 a 0.50) y 4 de `alarma_incendio` sobre el umbral (control; confianzas 0.80 a 0.99).
- **Modelo:** `gemini-3.1-flash-lite`. El script `evaluacion/evaluar_g1.js` captura el pedido exacto que `api/alerta.js` enviaría a Gemini, de modo que el prompt, el modelo y el formato son siempre los del producto.
- **Una corrida por caso.** Solo ante un error 503 o 429 se reintentaba, hasta 3 veces en total. Nunca se repitió un caso para quedarse con una mejor respuesta.
- **Sin corte a 2 s.** La app usa el texto de respaldo si Gemini tarda más de 2 s; el script espera la respuesta para medir la calidad y registra aparte cuántas superan los 2 s.

## 2. Criterios de revisión

Una respuesta es correcta si cumple las cuatro condiciones:

1. Tiene como máximo dos oraciones.
1. Dice lo que corresponde: en ruido, que no se detecta alarma y que el sistema sigue activo; en duda, que no está seguro y que verifique, sin decir nunca que no hay alarma; en control, que hay una alarma, con urgencia.
1. Se entiende: español simple, sin números ni términos técnicos.
1. No inventa información que no estaba en la entrada.

Los chequeos automáticos del script buscan palabras exactas (17 de 20 aprobaron), por lo que el veredicto final es el de la revisión del equipo. La propuesta inicial de veredictos fue asistida por Claude; el equipo la revisó y cambió 1 veredicto (caso 19, de «no» a «sí»: tiene dos oraciones y la indicación de evacuar es una recomendación razonable).

## 3. Resultados por caso

| # | Tipo | Confianza | Respuesta de Gemini | ms | > 2 s | Chequeo automático | Revisión del equipo |
|---|---|---|---|---|---|---|---|
| 1 | ruido | 0.99 | No se detecta ninguna alarma en tu entorno. El sistema sigue activo y monitoreando correctamente. | 2104 | sí | sí | sí |
| 2 | ruido | 0.95 | El sistema no detecta ninguna alarma y permanece activo. Todo está en calma. | 732 | no | sí | sí |
| 3 | ruido | 0.9 | El entorno es tranquilo y no se detecta ninguna alarma. El sistema de monitoreo sigue activo. | 1644 | no | sí | sí |
| 4 | ruido | 0.85 | No se detecta ninguna alarma en el entorno. El sistema sigue activo y monitoreando. | 1366 | no | sí | sí |
| 5 | ruido | 0.8 | El sistema está activo y no se detecta ninguna señal de alarma. Todo está en calma. | 883 | no | sí | sí |
| 6 | ruido | 0.75 | No se ha detectado ninguna alarma en tu entorno. El sistema sigue activo y monitoreando correctamente. | 1118 | no | sí | sí |
| 7 | ruido | 0.7 | El sistema está activo y monitoreando. No se ha detectado ninguna alarma en el entorno. | 1405 | no | sí | sí |
| 8 | ruido | 0.6 | El sistema no ha detectado ninguna alarma y permanece activo. Todo se encuentra en calma. | 9612 | sí | sí | sí |
| 9 | ruido | 0.52 | No se ha detectado ninguna alarma y el entorno parece tranquilo. El sistema de monitoreo sigue activo. | 15724 | sí | sí | sí |
| 10 | duda | 0.79 | Se ha detectado un sonido que podría ser una alarma de incendio, pero no tengo la certeza suficiente. Por favor, revisa tu entorno por seguridad. | 3039 | sí | sí | sí |
| 11 | duda | 0.75 | He detectado un sonido que podría ser una alarma de incendio, pero no tengo total certeza. Por favor, revisa tu entorno de inmediato para confirmar si hay algún peligro. | 15155 | sí | sí | sí |
| 12 | duda | 0.7 | Se ha detectado un sonido que podría ser una alarma de incendio, pero no hay certeza suficiente. Por favor, revisa tu entorno inmediatamente por seguridad. | 929 | no | sí | sí |
| 13 | duda | 0.65 | Se ha detectado un sonido que podría ser una alarma de incendio, pero el sistema no tiene total certeza. Por favor, verifica tu entorno por seguridad. | 10629 | sí | sí | sí |
| 14 | duda | 0.6 | Se ha detectado un sonido que podría ser una alarma de incendio, pero no tengo la certeza suficiente. Por favor, revisa tu entorno de inmediato para confirmar si existe algún peligro. | 907 | no | sí | sí |
| 15 | duda | 0.55 | Se ha detectado un sonido que podría ser una alarma de incendio, pero no hay certeza suficiente. Por favor, revisa tu entorno por seguridad. | 1136 | no | sí | sí |
| 16 | duda | 0.5 | He detectado un sonido que podría ser una alarma de incendio, pero no tengo suficiente certeza. Por favor, verifica tu entorno por precaución. | 932 | no | sí | sí |
| 17 | control | 0.8 | ¡Alerta! Se ha detectado una alarma de incendio con alta criticidad. Por favor, evacúe el lugar de inmediato. | 882 | no | no | no |
| 18 | control | 0.85 | ⚠️ ¡Atención! Se ha detectado una posible alarma de incendio. Por favor, evacúe el lugar de forma segura inmediatamente. | 6779 | sí | no | no |
| 19 | control | 0.93 | ⚠️ Alerta: Se ha detectado una alarma de incendio. Por favor, evacue el área de forma segura de inmediato. | 903 | no | sí | sí |
| 20 | control | 0.99 | ¡ALERTA! Se ha detectado una alarma de incendio en tu entorno con alta seguridad. Por favor, evacúa el lugar de inmediato. | 919 | no | no | no |

| Tipo | Casos | Aprobados (revisión del equipo) |
|---|---|---|
| Tranquilizador | 9 | 9 |
| Duda | 7 | 7 |
| Control | 4 | 1 |
| **Total** | 20 | 17 |

## 4. Hallazgos

- **Los mensajes de duda y tranquilizador cumplen** los criterios en los 16 casos. Ninguno de los 7 casos de duda dijo que no hay alarma.
- **Los 4 mensajes de alarma confirmada fueron inconsistentes:** tres oraciones, símbolos, el término técnico «alta criticidad», la frase «con alta seguridad» (que confunde) e instrucciones de evacuar que nadie pidió. Eso respalda la decisión de usar un **texto fijo** para la alarma confirmada.
- **Velocidad:** 6 de los 16 mensajes de Gemini tardaron más de 2 s; en la app habrían salido como texto de respaldo. Por eso la disponibilidad se reporta aparte de la calidad.
- **Observación en uso real:** en la prueba de 10 minutos y en las sesiones con usuarios, los avisos de duda redactados por Gemini cumplieron los criterios. No son una nueva medición del KR5.

## 5. Limitaciones

- Una sola corrida de 20 casos; Gemini no responde igual cada vez.
- Los casos de control no pasan por Gemini en el producto: se reportan aparte.
- La revisión la hizo el equipo con una propuesta inicial asistida por IA.
- Los chequeos automáticos buscan palabras exactas; no sustituyen la revisión humana.
- El archivo de salida del script se guardó como texto delimitado por tabulaciones al abrirlo en Excel; su contenido coincide con lo impreso en la terminal.

## 6. Archivos de la evaluación

- `mvp/evaluacion/evaluar_g1.js`: script de la evaluación.
- `prompt_usado_corrida1.txt`: prompt, modelo, configuración y fecha de la corrida.
- Salida del script (`resultados_g1_corrida1`) y revisión del equipo (`resultados_g1_corrida1_revisado.xlsx`).
