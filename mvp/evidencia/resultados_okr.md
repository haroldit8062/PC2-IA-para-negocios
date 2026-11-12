# Resultados de los OKR — Alertly (PC2)

> Los KR son los comprometidos en la PC1 y **no se modificaron** después de la Semana 6. Aquí se reporta el valor real de cada uno, cumpla o no la meta. Las cifras salen de `medicion_modelo.md`, `evaluacion_g1.md` y `pruebas_usuario.md`.

**Objetivo (Plantilla 3):** mejorar la capacidad del usuario para identificar oportunamente una alarma de incendio en su hogar mediante un MVP accesible por notificaciones.

## Resumen

| KR | Meta | Baseline | Valor real | Estado |
|---|---|---|---|---|
| **KR1** Identificación de alarmas | ≥ 80 % | 40 % (provisional) | **79.2 %** estricto (19/24); **91.7 %** amplio (22/24) | No cumple (estricto); cumple (amplio) |
| **KR2** Tiempo hasta la notificación | ≤ 3 s | 6 s (provisional) | Mediana **7.8 s** (de 5.3 a 18.1 s); 0 de 22 avisos en 3 s o menos | No cumple |
| **KR3** Exactitud y recall del modelo | Exactitud ≥ 80 %, recall ≥ 85 %, superar el baseline | 53.8 % (dataset inicial); 58.2 % con el dataset actual | Exactitud **90 %**, recall **80 %**, precisión 100 % | No se cumple en su totalidad (exactitud sí, recall no) |
| **KR4** Mejora tras reentrenar | ≥ +5 puntos de recall | — | **No medido** | No medido |
| **KR5** Calidad de G1 | ≥ 90 % de 20 casos | — | **85 %** (17/20); **100 %** (16/16 de los que escribe Gemini) | No cumple (20 casos); cumple (16 casos) |

Ningún KR se cumple plenamente con la lectura estricta. KR1 y KR5 se cumplen con la lectura amplia, y de KR3 se cumple la exactitud. Dos KR (1 y 5) dependen de una decisión del profesor sobre cómo contarlos (ver el final).

---

## KR1 — Identificación de alarmas (≥ 80 %)

**Cómo se midió.** En la validación con 4 participantes (11/11/2026) se presentaron 6 eventos de alarma por persona (24 intentos). *Alarma identificada (estricto)* = la pantalla llegó a rojo y se recibió el aviso de alarma. *Amplio* = rojo, o ámbar con aviso de duda.

**Resultado.**

| Lectura | Resultado |
|---|---|
| Estricto | 19 de 24 = 79.2 % |
| Amplio | 22 de 24 = 91.7 % |
| Alarmas que quedaron en verde (sin ninguna reacción) | 0 |

**Explicación.** Con la lectura estricta faltó una alarma para llegar a la meta (20/24 = 83.3 %). Las 5 que no llegaron a rojo fueron los 4 intentos de «otra habitación» y 1 del evento del celular en el bolsillo; todas se quedaron en ámbar. El baseline de 40 % fue una estimación académica provisional y no se midió, por lo que no se afirma una mejora sobre él.

**Limitaciones.** 4 participantes (no 5), 1 solo con discapacidad auditiva parcial; alarmas reproducidas por parlante; las alarmas salen de pocas grabaciones; en las sesiones, la página corrió en el celular de cada participante, que también recibió los avisos (en el uso previsto, un dispositivo fijo escucha y el celular del usuario recibe).

## KR2 — Tiempo hasta la notificación (≤ 3 s)

**Cómo se midió.** Con cronómetro a mano, desde que empieza el sonido hasta que el aviso llega al celular del participante, en los eventos de alarma de la validación.

**Resultado.**

| Medida | Valor |
|---|---|
| Avisos con tiempo medido | 21 de 22 |
| Mediana | 7.8 s |
| Mínimo / máximo | 5.3 s / 18.1 s |
| Avisos en 3 s o menos | 0 |

En las pruebas del modelo a solas, la mediana del sonido al rojo fue 5.8 s (de 3.3 a 18.1 s).

**Explicación.** No se cumple. Una hipótesis, no verificada por componente: el tiempo lo domina la detección (el modelo junta alrededor de 1 s de audio y la regla pide 2 lecturas altas dentro de una ventana de 3 s), más que el envío; en las mediciones del backend, el envío a Telegram tomó entre 0.7 y 1.1 s, y Gemini no interviene en la alarma. Los archivos repetidos empiezan con 1 s de silencio y el cronómetro manual agrega error. El baseline de 6 s fue una estimación provisional con otra metodología, por lo que la comparación directa no es válida.

## KR3 — Exactitud y recall del modelo

**Cómo se midió.** 30 pruebas con audios que el modelo no entrenó (15 alarmas y 15 ruidos). Detalle en `medicion_modelo.md`.

| Métrica | Valor | Meta | Estado |
|---|---|---|---|
| Recall de `alarma_incendio` | 80 % (12/15) | ≥ 85 % | No cumple |
| Precisión | 100 % (12/12) | ≥ 80 % | Cumple |
| Exactitud | 90 % (27/30) | ≥ 80 % | Cumple |
| Baseline (dataset actual: 627 alarma y 872 ruido) | 58.2 % | Superarlo | Lo supera |

**Explicación.** Las 3 alarmas perdidas dieron ámbar, no verde: dos fueron de «otra habitación» y una «con ruido». Con 15 alarmas, el intervalo de confianza del recall es amplio (de 55 % a 93 %), por lo que no se puede asegurar si está realmente por debajo de 85 %. Se reporta como no cumplido.

**Limitaciones.** Los audios sintéticos de alarma se diseñaron a partir de las dos grabaciones peruanas que luego se usaron en 10 de las 15 pruebas de alarma, por lo que esas pruebas no son totalmente ciegas; las 5 pruebas con audios de Freesound no se usaron para diseñar nada. Las 15 alarmas salen de 4 grabaciones; la clase alarma se entrenó mayormente con audio sintético (unas 540 de 627 muestras, 86 %) y unas 87 muestras (14 %) de grabaciones reales de detectores de humo; el conjunto de prueba está balanceado, por lo que su exactitud no refleja la baja prevalencia real de una alarma.

## KR4 — Mejora de recall tras reentrenar (≥ +5 puntos)

**Resultado: no medido.** Las versiones anteriores del modelo no se evaluaron con el mismo conjunto de prueba que la versión final (V2), así que no hay un recall comparable. No se inventa una cifra.

**Lo que sí hay: observaciones del ciclo A3.** Estas observaciones son informales (sin matriz de confusión) y no reemplazan la medición de KR4:

| Observación en una versión anterior | Dato agregado | Resultado observado después |
|---|---|---|
| La grabación peruana de 4 kHz con 4 pitidos rápidos solo llegaba a ámbar | 18 alarmas sintéticas diseñadas a partir de las grabaciones peruanas, ruido ambiente real; se quitaron las alarmas de edificio y la de monóxido | Las dos grabaciones peruanas llegaron a rojo |
| Un grito de un video activó una falsa alarma | Voces fuertes y gritos en la clase de ruido | Sin falsas alarmas en rojo en las pruebas finales |
| Un claxon activó la alarma | Claxons sintéticos y reales en la clase de ruido | Los 2 claxons reales dieron verde |
| El ventilador daba ámbar | Grabaciones del ventilador | El ventilador dio verde (2 de 2) |

**Historial de versiones del modelo**

| Versión | Entrenamiento | Estado |
|---|---|---|
| Modelo inicial | Solo audios sintéticos (paquete inicial) | Sustituido |
| V1 | Se agregaron alarmas sintéticas con los pitidos de los detectores vendidos en Perú (generadas a partir de dos grabaciones reales) | Sustituida |
| **V2 (final)** | Entrenada con todo el material: lo anterior, ruido de fondo real (conversaciones, TV, cocina, calle, ventilador, voces fuertes), claxons y sin alarmas de edificio ni la de monóxido | **Congelada el 08/11/2026.** Es la que se usó en las pruebas del modelo y en las sesiones con usuarios |
| Cambios posteriores | No al modelo: dos cambios de texto en la página, el 12/11/2026 a las 10:34 | — |

Solo se registra con fecha el congelado del modelo (08/11/2026); las demás fechas no se anotaron.

## KR5 — Calidad de la capa de lenguaje (≥ 90 % de 20 casos)

**Cómo se midió.** 20 casos corridos una sola vez contra Gemini con el prompt del producto. Detalle en `evaluacion_g1.md`.

| Lectura | Resultado | Estado |
|---|---|---|
| Los 20 casos (lectura literal) | 17 de 20 = 85 % | No cumple |
| Los 16 mensajes que Gemini escribe en el producto | 16 de 16 = 100 % | Cumple |

**Explicación.** Los 4 casos de control (alarma confirmada) no pasan por Gemini en el producto, que usa un texto fijo. Fueron justamente los que fallaron: tres oraciones, símbolos, términos técnicos e instrucciones que nadie pidió. Eso justifica la decisión del texto fijo. La disponibilidad se reporta aparte: 0 fallas por 503 o 429, y 7 de 20 respuestas superaron 2 s (6 de las 16 de Gemini), caso en el que la app envía el texto de respaldo.

---

## Lo que funcionó

- Los 4 participantes instalaron y usaron Alertly sin ayuda (mediana 1:40).
- 0 falsas alarmas en rojo, tanto en las 30 pruebas del modelo como en las sesiones y en la prueba de 10 minutos de ruido continuo.
- Ninguna alarma quedó en verde: el modelo dudó, pero no las ignoró.
- Los 22 avisos de las sesiones se entendieron (claridad promedio 4.75), y ninguno molestó.
- Con el celular en el bolsillo, los 4 participantes se enteraron por la notificación.

## Lo que no funcionó o falta

- La alarma desde otra habitación no llegó a rojo (0 de 4).
- El aviso tarda más de lo comprometido (mediana 7.8 s frente a 3 s).
- En 10 minutos de ruido hubo 21 episodios de duda; el límite de avisos evitó saturar al usuario (2 avisos).
- No se midió el KR4.
- La validación se hizo con 4 participantes y no con los 5 comprometidos.

## Mejoras si hubiera más tiempo

- Ampliar el dataset con alarmas reales de más marcas y con alarmas lejanas.
- Revisar la ventana de 3 s y la regla de 2 lecturas, midiendo el efecto en el tiempo y en las falsas alarmas.
- Medir el KR4 con un conjunto de prueba fijo para todas las versiones.
- Acortar los mensajes de Gemini y repetir la evaluación de 20 casos.
- Validar con más personas con discapacidad auditiva.

## Preguntas abiertas para el profesor

1. ¿El KR5 se mide con los 20 casos (85 %) o con los 16 que escribe Gemini (100 %)?
2. ¿Cómo debe contarse el estado ámbar en KR1 (estricto o amplio)?
3. ¿La alarma confirmada con texto fijo mantiene el nivel G1?
4. ¿Cuentan 4 usuarios con casos límite en lugar de 5 usuarios y 50 observaciones?
5. ¿Es aceptable que la clase de alarma sea mayormente sintética, declarándolo?

Estas preguntas no se consultaron con el profesor antes de la entrega; por eso se reportan ambas lecturas en KR1 y KR5.
