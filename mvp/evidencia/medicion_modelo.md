# Medición del modelo de audio — Alertly (PC2)

> Medición del clasificador (componente A3) con 30 pruebas de audios que el modelo no entrenó. Datos del archivo `medicion_modelo_alertly.xlsx`. Fecha: 11/11/2026.

## Resumen

| Métrica | Valor | Meta de la PC1 | Estado |
|---|---|---|---|
| Recall de `alarma_incendio` | 80.0 % (12/15) | ≥ 85 % | No cumple |
| Precisión | 100 % (12/12) | ≥ 80 % | Cumple |
| Exactitud | 90 % (27/30) | ≥ 80 % | Cumple |
| Baseline (clase mayoritaria del dataset actual) | 58.2 % (872/1499) | Superarlo | La exactitud lo supera |
| Falsas alarmas en rojo | 0 de 15 ruidos | — | — |
| Alarmas perdidas | 3 de 15 (las 3 dieron ámbar, ninguna verde) | — | — |

El recall de 80 % no alcanza la meta de 85 %. Con 15 alarmas, el intervalo de confianza del 95 % (Wilson) va de 55 % a 93 %, de modo que la diferencia con la meta no es concluyente. Se reporta tal como salió.

## 1. Método

- **Dispositivos:** la página de Alertly abierta en un celular Samsung Galaxy S24 FE y los audios reproducidos desde una laptop HP ProBook 440 G7. Salvo indicación, a 30 cm del celular, con el volumen de la laptop al 100 % y en una habitación silenciosa. «Volumen bajo» fue al 70 %; «a 3 m» se hizo a 3 m; «con TV», a 80 cm con una TV encendida; «otra habitación», a 5 m en una habitación diferente.
- **Ruido en las alarmas:** en las dos grabaciones peruanas, «con ruido» es un archivo con ruido rosa sintético agregado; en las alarmas de Freesound, «con ruido» fue ruido real de los exteriores.
- **Procedimiento:** se inicia el monitoreo y se espera la pantalla en verde. Cada audio se reproduce completo, sin cortes. Se anota el color más grave que aparece y, si llega a rojo, los segundos desde el inicio del sonido (cronómetro a mano).
- **Definiciones:** *acierto en alarma* = era alarma y llegó a rojo; *alarma perdida* = era alarma y no llegó a rojo; *falsa alarma* = era ruido y llegó a rojo; *acierto en ruido* = era ruido y no llegó a rojo. El ámbar cuenta como «no rojo» en la medición estricta.
- **Independencia:** ningún audio de la prueba (ni sus versiones regrabadas) se usó para entrenar.

## 2. Matriz de confusión

|  | Sistema dijo alarma (rojo) | Sistema dijo no alarma (verde o ámbar) | Total |
|---|---|---|---|
| **Era alarma** | 12 | 3 | 15 |
| **No era alarma** | 0 | 15 | 15 |
| **Total** | 12 | 18 | 30 |

- Recall amplio (rojo o ámbar): 15/15 = 100 %. Es informativo; no reemplaza la medición estricta.
- Ruidos que dieron ámbar: 6 de 15 (3 claxons sintéticos, una conversación con TV, un sonido de hogar y un grito). Son dudas, no falsas alarmas.

## 3. Las 30 pruebas

| # | Audio | Origen | Categoría | Condición | Color | Segundo del rojo | Resultado |
|---|---|---|---|---|---|---|---|
| 1 | prueba_real_1_pulsos_3100hz_repetido_limpio.wav | Real | Alarma real peruana | Normal | Rojo | 6.08 | Acierto (alarma) |
| 2 | prueba_real_1_pulsos_3100hz_repetido_limpio.wav | Real | Alarma real peruana | Volumen bajo | Rojo | 17.17 | Acierto (alarma) |
| 3 | prueba_real_1_pulsos_3100hz_repetido_con_ruido.wav | Real | Alarma real peruana | Con ruido | Rojo | 5.33 | Acierto (alarma) |
| 4 | prueba_real_1_pulsos_3100hz_repetido_limpio.wav | Real | Alarma real peruana | A 3 m | Rojo | 11.33 | Acierto (alarma) |
| 5 | prueba_real_1_pulsos_3100hz_repetido_limpio.wav | Real | Alarma real peruana | Con TV | Rojo | 3.33 | Acierto (alarma) |
| 6 | prueba_real_2_cuatro_pitidos_4000hz_repetido_limpio.wav | Real | Alarma real peruana | Normal | Rojo | 6.21 | Acierto (alarma) |
| 7 | prueba_real_2_cuatro_pitidos_4000hz_repetido_limpio.wav | Real | Alarma real peruana | Volumen bajo | Rojo | 5.46 | Acierto (alarma) |
| 8 | prueba_real_2_cuatro_pitidos_4000hz_repetido_con_ruido.wav | Real | Alarma real peruana | Con ruido | Rojo | 4.28 | Acierto (alarma) |
| 9 | prueba_real_2_cuatro_pitidos_4000hz_repetido_limpio.wav | Real | Alarma real peruana | A 3 m | Rojo | 18.08 | Acierto (alarma) |
| 10 | prueba_real_2_cuatro_pitidos_4000hz_repetido_limpio.wav | Real | Alarma real peruana | Otra habitación | Ámbar | — | Alarma perdida |
| 11 | Testing smoke detector (SoundAction 239) | Real | Alarma real otra | Normal | Rojo | 7.62 | Acierto (alarma) |
| 12 | Testing smoke detector (SoundAction 239) | Real | Alarma real otra | Con ruido | Ámbar | — | Alarma perdida |
| 13 | Smoke Detector Alarm | Real | Alarma real otra | Normal | Rojo | 3.41 | Acierto (alarma) |
| 14 | Smoke Detector Alarm | Real | Alarma real otra | Con ruido | Rojo | 4.22 | Acierto (alarma) |
| 15 | PRUEBA_claxon_auto_tono_alto | Sintético | Claxon sintético | Normal | Ámbar | — | Acierto (ruido) |
| 16 | PRUEBA_claxon_pickup_grave | Sintético | Claxon sintético | Normal | Ámbar | — | Acierto (ruido) |
| 17 | PRUEBA_claxon_moto_largo | Sintético | Claxon sintético | Normal | Ámbar | — | Acierto (ruido) |
| 18 | Claxon camion | Real | Claxon real | Normal | Verde | — | Acierto (ruido) |
| 19 | Claxon tráfico | Real | Claxon real | Normal | Verde | — | Acierto (ruido) |
| 20 | Conversacion 1 | Real | Conversación/voces | Normal | Verde | — | Acierto (ruido) |
| 21 | Conversacion 1 | Real | Conversación/voces | A 3 m | Verde | — | Acierto (ruido) |
| 22 | Conversacion 1 | Real | Conversación/voces | Con TV | Ámbar | — | Acierto (ruido) |
| 23 | TV 1 | Real | TV | Normal | Verde | — | Acierto (ruido) |
| 24 | TV 2 | Real | TV | Normal | Verde | — | Acierto (ruido) |
| 25 | Cocina 1 | Real | Cocina/hogar | Normal | Verde | — | Acierto (ruido) |
| 26 | Hogar 1 | Real | Cocina/hogar | Normal | Ámbar | — | Acierto (ruido) |
| 27 | Ventilador 1 | Real | Ventilador | Normal | Verde | — | Acierto (ruido) |
| 28 | Ventilador 2 | Real | Ventilador | Normal | Verde | — | Acierto (ruido) |
| 29 | Grito 1 | Real | Grito/voz fuerte | Normal | Ámbar | — | Acierto (ruido) |
| 30 | Smoke Detector Alarm | Real | Alarma real otra | Otra habitación | Ámbar | — | Alarma perdida |

Las alarmas de prueba salen de **4 grabaciones distintas**: las dos grabaciones peruanas (10 pruebas), «Testing smoke detector (SoundAction 239)» y «Smoke Detector Alarm» (5 pruebas entre ambas). No son 15 alarmas independientes.

## 4. Resultados por condición y por categoría

| Condición (solo alarmas) | Pruebas | Rojo | Ámbar |
|---|---|---|---|
| Normal | 4 | 4 | 0 |
| Volumen bajo | 2 | 2 | 0 |
| A 3 m | 2 | 2 | 0 |
| Con TV | 1 | 1 | 0 |
| Con ruido | 4 | 3 | 1 |
| Otra habitación | 2 | 0 | 2 |

Normal: 4 de 4 en rojo. Condiciones más exigentes: 8 de 11. Los tres fallos fueron dos de «otra habitación» y uno de «con ruido». Es un desglose posterior y con pocos datos: se presenta como orientación, no como conclusión.

| Categoría | Pruebas | Rojo | Ámbar | Verde |
|---|---|---|---|---|
| Alarma real peruana | 10 | 9 | 1 | 0 |
| Alarma real otra | 5 | 3 | 2 | 0 |
| Conversación/voces | 3 | 0 | 1 | 2 |
| TV | 2 | 0 | 0 | 2 |
| Cocina/hogar | 2 | 0 | 1 | 1 |
| Ventilador | 2 | 0 | 0 | 2 |
| Claxon real | 2 | 0 | 0 | 2 |
| Claxon sintético | 3 | 0 | 3 | 0 |
| Grito/voz fuerte | 1 | 0 | 1 | 0 |

En las categorías de alarma lo deseable es rojo; en las de ruido, verde. Los 2 claxons reales dieron verde, mientras que los 3 sintéticos dieron ámbar.

## 5. Tiempo hasta el rojo

| Medida | Valor |
|---|---|
| Alarmas que llegaron a rojo | 12 |
| Mediana | 5.77 s |
| Mínimo / máximo | 3.33 s / 18.08 s |

Los archivos repetidos empiezan con 1 s de silencio; descontándolo en esas pruebas, la mediana bajaría a unos 4.8 s (dato de referencia; la cifra medida es 5.77 s). La medición es con cronómetro a mano. Este tiempo no incluye el envío del mensaje a Telegram, que se midió en las sesiones con usuarios (mediana 7.8 s hasta el mensaje).

## 6. Prueba de ruido continuo (10 minutos)

- **Fecha y hora de inicio:** 11/11/2026, 14:33. Sin ninguna alarma sonando.
- **Ambiente:** videos reproducidos en el celular, ruido de la calle muy bajo (ventanas cerradas) y maquinaria de una obra cercana.
- **Resultado:** 21 episodios ámbar, 0 en rojo y 2 avisos de duda a Telegram, ambos redactados por Gemini y que cumplen los criterios (dos oraciones, expresan duda y piden verificar). Dos avisos es el máximo que permite el límite de 1 cada 5 minutos, así que no se puede saber si hubo más episodios de ámbar de 5 s o más.
- **Lectura:** 0 falsas alarmas en rojo, pero el modelo duda con frecuencia en un ambiente ruidoso. Es una sola prueba en un ambiente no controlado.

## 7. Baseline

El modelo final se entrenó con **627 muestras** de alarma y **872 muestras** de ruido de fondo (muestras de un segundo que corta Teachable Machine). Un clasificador que siempre dijera «ruido de fondo» tendría 872/1499 = 58.2 % de exactitud y 0 % de recall. El baseline de 53.8 % de la PC1 (70/130) corresponde al dataset inicial, que cambió.

El conjunto de prueba está balanceado a propósito (15 y 15), por lo que su exactitud no se compara con la prevalencia real de una alarma en un hogar, que es mucho menor.

## 8. Limitaciones

- 15 alarmas de 4 grabaciones; el recall tiene un intervalo de confianza amplio.
- Todas las alarmas de prueba se reproducen por parlante; no se probó con alarmas reales encendidas ni con otras marcas distintas.
- La clase alarma se entrenó mayormente con audio sintético (unas 540 de 627 muestras) y unas 87 muestras de detectores de humo reales grabados por un amigo del equipo; las alarmas de prueba son otras grabaciones reales.
- Los audios sintéticos de alarma se diseñaron a partir de las dos grabaciones peruanas que luego se usaron en 10 de las 15 pruebas de alarma, por lo que esas pruebas no son totalmente ciegas; las 5 pruebas con audios de Freesound no se usaron para diseñar nada.
- Tiempos medidos a mano; los audios repetidos tienen 1 s de silencio inicial y una pausa de 1.5 s entre repeticiones elegida por el equipo.
- La comparación entre la primera versión del modelo y la versión final (KR4) no se midió con este mismo conjunto de prueba.
- Los resultados valen para este montaje (celular, laptop, distancia y volumen).
