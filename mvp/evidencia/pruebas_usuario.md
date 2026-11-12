# Pruebas con usuarios — Alertly (PC2)

> Registro de la validación del MVP con 4 participantes (11/11/2026). Los datos salen del archivo de registro del equipo (`registro_validacion_alertly_final.xlsx`). Los participantes se identifican solo con códigos (P1 a P4).

## Resumen

| Indicador | Resultado |
|---|---|
| Participantes / eventos por persona / observaciones | 4 / 8 / 32 |
| Instalación sin ayuda | 4 de 4 (mediana 1:40; de 99 a 102 s); 0 ayudas |
| Alarmas que llegaron a rojo | 19 de 24 = 79.2 % |
| Alarmas con algún aviso (rojo o ámbar) | 22 de 24 = 91.7 % |
| Tiempo del sonido al mensaje | Mediana 7.8 s (de 5.3 a 18.1 s). Ninguno ≤ 3 s |
| Falsas alarmas en rojo (ruidos) | 0 de 8 |
| Avisos entendidos | 22 de 22 (claridad promedio 4.75 de 5) |
| Mensajes que molestaron | 0 de 4 participantes |
| Lo usarían como complemento de un detector de humo | 4 de 4 |

## 1. Objetivo y método

Comprobar si personas ajenas al equipo pueden vincular y usar Alertly sin ayuda, si entienden los avisos que reciben y cómo responde el sistema ante alarmas y ruidos, incluidos casos límite (TV, otra habitación, celular en el bolsillo).

- Una persona del equipo condujo cada sesión (Harold) y otra anotó (Diego o Harold).
- Los audios se reprodujeron completos y sin cortes desde otro dispositivo. **La página de Alertly corrió en el celular Android de cada participante**, que también recibió los avisos de Telegram; cada persona hizo la instalación en su propio celular.
- Cronómetro a mano: se midió desde que empieza el sonido hasta que el aviso llega al celular del participante.
- El protocolo pedía dejar al menos 45 s entre dos alarmas, para que el sistema cerrara el evento anterior.

## 2. Participantes

| Código | Fecha y hora | Discapacidad auditiva | Dispositivo | Consentimiento | Condujo | Anotó |
|---|---|---|---|---|---|---|
| P1 | 11/11/2026 17:17 | No | Android | Escrita | Harold | Diego |
| P2 | 11/11/2026 18:40 | No | Android | Escrita | Harold | Diego |
| P3 | 11/11/2026 19:40 | Parcial | Android | Escrita | Harold | Harold |
| P4 | 11/11/2026 22:50 | No | Android | Verbal | Harold | Diego |

**P3 tiene discapacidad auditiva parcial; los otros tres participantes no.** Fue difícil encontrar personas con discapacidad auditiva y se prefirió no seguir sumando personas sin discapacidad para que no predominaran en la muestra. La usabilidad con el público objetivo está, por lo tanto, probada solo en parte.

### Consentimiento y privacidad

Texto leído antes de empezar: *«Participo voluntariamente en la prueba de Alertly. Se usa mi identificador de Telegram y los avisos que recibo. El audio no se guarda ni sale de mi navegador. Puedo retirarme cuando quiera.»*

Los cuatro aceptaron (escrito en P1, P2 y P3; verbal en P4). No se registran nombres, números ni el identificador de Telegram, y las capturas de los avisos se guardaron sin datos personales.

## 3. Los ocho eventos

| # | Sonido | Tipo | Archivo usado | Para qué sirve |
|---|---|---|---|---|
| 1 | Alarma peruana 1 (repetida) | Alarma | prueba_real_1_pulsos_3100hz_repetido_limpio.wav | Caso principal |
| 2 | Alarma peruana 2 (repetida) | Alarma | prueba_real_2_cuatro_pitidos_4000hz_repetido_limpio.wav | Caso principal |
| 3 | Alarma reservada (Freesound, no entrenada) | Alarma | «Testing smoke detector (SoundAction 239)» (Freesound, CC BY 4.0) | Una alarma que el modelo nunca oyó |
| 4 | Alarma peruana 1 con ruido y TV encendida | Alarma | prueba_real_1_pulsos_3100hz_repetido_con_ruido.wav, con una TV encendida | Caso límite |
| 5 | Alarma desde otra habitación (peruana 2) | Alarma | prueba_real_2_cuatro_pitidos_4000hz_repetido_limpio.wav, desde otra habitación o a bajo volumen | Caso límite |
| 6 | Ventilador o conversación | Ruido | Conversación grabada de un video (no se publica) | Falsa alarma |
| 7 | Claxon (sintético) | Ruido | PRUEBA_claxon_auto_tono_alto.wav (sintético, generado por código) | Falsa alarma |
| 8 | Alarma con el celular en el bolsillo (peruana 1) | Alarma | prueba_real_1_pulsos_3100hz_repetido_limpio.wav, con el celular del participante (donde corría la página) en el bolsillo | Caso límite: ¿se entera sin mirar la pantalla? |

Los archivos de alarma peruana son clips reales de 1 a 2 s repetidos hasta 20 s con una pausa de 1.5 s elegida por el equipo (no es la pausa real del detector) y 1 s de silencio inicial. Las versiones «con ruido» llevan ruido rosa sintético agregado.

## 4. Resultados

### 4.1 Instalación sin ayuda

Cada participante recibió solo el enlace del bot, sin explicaciones. Tocó «Iniciar», abrió Alertly desde el botón del bot, aceptó el micrófono y empezó a escuchar.

| Participante | ¿Sin ayuda? | Tiempo (s) | Ayudas | Dónde se trabó | Micrófono ok | Mensaje de inicio |
|---|---|---|---|---|---|---|
| P1 | Sí | 100 | 0 | Ninguno | Sí | Sí (Gemini) |
| P2 | Sí | 102 | 0 | Ninguno | Sí | Sí (Respaldo) |
| P3 | Sí | 100 | 0 | Ninguno | Sí | Sí (Gemini) |
| P4 | Sí | 99 | 0 | Ninguno | Sí | Sí (Respaldo) |

### 4.2 Eventos por participante

Color = el más grave que apareció en pantalla. Segundos = del inicio del sonido a la llegada del aviso (vacío si no llegó aviso). Origen del texto: «Fijo» es el texto fijo de alarma; «Respaldo» es el texto de respaldo; «Gemini» lo redactó el modelo de lenguaje.

**P1**

| # | Sonido | Color | ¿Llegó aviso? | Segundos | Origen del texto | ¿Lo entendió? |
|---|---|---|---|---|---|---|
| 1 | Alarma peruana 1 (repetida) | Rojo | Sí | 9.5 | Fijo | Sí |
| 2 | Alarma peruana 2 (repetida) | Rojo | Sí | 7.8 | Fijo | Sí |
| 3 | Alarma reservada (Freesound, no entrenada) | Rojo | Sí | 10.8 | Fijo | Sí |
| 4 | Alarma peruana 1 con ruido y TV encendida | Rojo | Sí | 13.7 | Fijo | Sí |
| 5 | Alarma desde otra habitación (peruana 2) | Ámbar | Sí | — | Gemini | Sí |
| 6 | Ventilador o conversación | Verde | No | — | No llegó | — |
| 7 | Claxon (sintético) | Verde | No | — | No llegó | — |
| 8 | Alarma con el celular en el bolsillo (peruana 1) | Ámbar | Sí | 18.1 | Gemini | Sí |

**P2**

| # | Sonido | Color | ¿Llegó aviso? | Segundos | Origen del texto | ¿Lo entendió? |
|---|---|---|---|---|---|---|
| 1 | Alarma peruana 1 (repetida) | Rojo | Sí | 5.8 | Fijo | Sí |
| 2 | Alarma peruana 2 (repetida) | Rojo | Sí | 6.3 | Fijo | Sí |
| 3 | Alarma reservada (Freesound, no entrenada) | Rojo | Sí | 9.7 | Fijo | Sí |
| 4 | Alarma peruana 1 con ruido y TV encendida | Rojo | Sí | 8.1 | Fijo | Sí |
| 5 | Alarma desde otra habitación (peruana 2) | Ámbar | No | — | No llegó | — |
| 6 | Ventilador o conversación | Verde | No | — | No llegó | — |
| 7 | Claxon (sintético) | Verde | No | — | No llegó | — |
| 8 | Alarma con el celular en el bolsillo (peruana 1) | Rojo | Sí | 7.8 | Fijo | Sí |

**P3**

| # | Sonido | Color | ¿Llegó aviso? | Segundos | Origen del texto | ¿Lo entendió? |
|---|---|---|---|---|---|---|
| 1 | Alarma peruana 1 (repetida) | Rojo | Sí | 6.8 | Fijo | Sí |
| 2 | Alarma peruana 2 (repetida) | Rojo | Sí | 7.2 | Fijo | Sí |
| 3 | Alarma reservada (Freesound, no entrenada) | Rojo | Sí | 9.6 | Fijo | Sí |
| 4 | Alarma peruana 1 con ruido y TV encendida | Rojo | Sí | 9.3 | Fijo | Sí |
| 5 | Alarma desde otra habitación (peruana 2) | Ámbar | No | — | No llegó | — |
| 6 | Ventilador o conversación | Ámbar | No | — | No llegó | — |
| 7 | Claxon (sintético) | Verde | No | — | No llegó | — |
| 8 | Alarma con el celular en el bolsillo (peruana 1) | Rojo | Sí | 7.8 | Fijo | Sí |

**P4**

| # | Sonido | Color | ¿Llegó aviso? | Segundos | Origen del texto | ¿Lo entendió? |
|---|---|---|---|---|---|---|
| 1 | Alarma peruana 1 (repetida) | Rojo | Sí | 5.3 | Fijo | Sí |
| 2 | Alarma peruana 2 (repetida) | Rojo | Sí | 12.2 | Fijo | Sí |
| 3 | Alarma reservada (Freesound, no entrenada) | Rojo | Sí | 7.4 | Fijo | Sí |
| 4 | Alarma peruana 1 con ruido y TV encendida | Rojo | Sí | 7.5 | Fijo | Sí |
| 5 | Alarma desde otra habitación (peruana 2) | Ámbar | Sí | 10.6 | Respaldo | Sí |
| 6 | Ventilador o conversación | Ámbar | No | — | No llegó | — |
| 7 | Claxon (sintético) | Verde | No | — | No llegó | — |
| 8 | Alarma con el celular en el bolsillo (peruana 1) | Rojo | Sí | 7.5 | Fijo | Sí |

### 4.3 Alarmas por evento

| # | Sonido | Rojo | Ámbar | Verde | Con aviso | Mediana (s) |
|---|---|---|---|---|---|---|
| 1 | Alarma peruana 1 (repetida) | 4 | 0 | 0 | 4 | 6.3 |
| 2 | Alarma peruana 2 (repetida) | 4 | 0 | 0 | 4 | 7.5 |
| 3 | Alarma reservada (Freesound, no entrenada) | 4 | 0 | 0 | 4 | 9.6 |
| 4 | Alarma peruana 1 con ruido y TV encendida | 4 | 0 | 0 | 4 | 8.7 |
| 5 | Alarma desde otra habitación (peruana 2) | 0 | 4 | 0 | 2 | 10.6 |
| 8 | Alarma con el celular en el bolsillo (peruana 1) | 3 | 1 | 0 | 4 | 7.8 |
|  | **Total (24 intentos)** | 19 | 5 | 0 | 22 | 7.8 |

- **Estricto** (rojo): 19 de 24 = 79.2 %. **Amplio** (rojo o ámbar con aviso): 22 de 24 = 91.7 %. Ninguna alarma quedó en verde.
- Los 5 ámbar: los cuatro del evento 5 (otra habitación) y uno del evento 8 (bolsillo). De ellos, 3 recibieron aviso de duda y 2 no recibieron ningún aviso.

### 4.4 Falsas alarmas (eventos 6 y 7)

| # | Sonido | Verde | Ámbar | Rojo (falsa alarma) |
|---|---|---|---|---|
| 6 | Ventilador o conversación | 2 | 2 | 0 |
| 7 | Claxon (sintético) | 4 | 0 | 0 |

Ninguna falsa alarma en rojo. Los dos ámbar del evento 6 no generaron ningún aviso. El claxon del evento 7 es sintético; el mismo audio dio ámbar en las pruebas del modelo a solas y verde en las sesiones, así que el resultado depende del montaje.

### 4.5 Tiempo hasta el mensaje

| Medida | Valor |
|---|---|
| Mensajes con tiempo medido | 21 |
| Mediana | 7.78 s |
| Mínimo / máximo | 5.26 s / 18.12 s |
| Mediana solo de avisos de alarma (rojo) | 7.77 s |
| Avisos en 3 s o menos | 0 |

El tiempo incluye 1 s de silencio al inicio de los audios repetidos y el error de un cronómetro manual. Aun así, está lejos de la meta de 3 s (KR2).

### 4.6 Textos recibidos

| Caso | Gemini | Respaldo | Fijo |
|---|---|---|---|
| Tranquilizador (mensaje de inicio) | 2 | 2 | — |
| Duda (ámbar) | 2 | 1 | — |
| Alarma (rojo) | — | — | 19 |

### 4.7 Comprensión y molestia

| Participante | ¿Entendió? | Nota de claridad | ¿Demasiados mensajes? | ¿Molestó alguno? | ¿Lo usaría como complemento? | Mensajes en la sesión |
|---|---|---|---|---|---|---|
| P1 | Sí | 5 | No | No | Sí | 7 |
| P2 | Sí | 5 | No | No | Sí | 6 |
| P3 | Sí | 4 | No | No | Sí | 6 |
| P4 | Sí | 5 | No | No | Sí | 7 |

Respuestas abiertas, tal como las dieron:

- **P1.** Si recibiera «alarma de incendio»: «Consultaría con uno de los miembros de mi casa». ¿Algo te confundió?: «Nada». ¿Qué cambiarías?: «Que el texto no sea tan largo».
- **P2.** Si recibiera «alarma de incendio»: «Revisaría si esta todo en orden y consultaría con los miembros de mi familia». ¿Algo te confundió?: «Nada». ¿Qué cambiarías?: «No cambiaría nada».
- **P3.** Si recibiera «alarma de incendio»: «Consultaría con alguien de mi familia que se encuentre presente o en todo caso saldría hacia el exterior». ¿Algo te confundió?: «Cuando salía en ámbar por un aprox. de 2 segundos y nunca recibí un mensaje». ¿Qué cambiarías?: «No cambiaría nada».
- **P4.** Si recibiera «alarma de incendio»: «En mi caso revisaría por mi cuenta y luego saldría por precaución». ¿Algo te confundió?: «Nada». ¿Qué cambiarías?: «Nada en absoluto».

## 5. Hallazgos y cambios

| # | Hallazgo | Evidencia | Gravedad | Cambio y fecha | Resultado después |
|---|---|---|---|---|---|
| 1 | El ámbar sin aviso confundió a un participante | P3, preguntas finales; eventos 5 y 6 | Media | 12/11/2026, 10:34: se agregó en la pantalla ámbar la línea «Si el sonido continúa unos segundos, puede llegarte un aviso a Telegram» | Seguimiento con P3 el 12/11/2026: se le mostró la pantalla mientras llegaba el aviso, sin explicarle nada. Dijo que el sistema duda de lo que escucha, que no puede confirmarlo y que prefiere verificar por sí mismo; sí esperaría recibir un mensaje. Una sola persona, que ya conocía el producto, y el aviso llegó durante la demostración, lo que pudo influir |
| 2 | Alarma desde otra habitación: 0 de 4 en rojo; 2 de 4 sin ningún aviso | Evento 5 | Alta | 12/11/2026, 10:34: se agregó a «Antes de empezar» la recomendación «Ponlo cerca del detector de humo, en la misma habitación» | No se repitió el evento 5 con participantes: por verificar |
| 3 | Tiempo hasta el aviso con mediana de 7.8 s (meta 3 s) | Eventos de alarma | Alta | Sin cambio. Limitación y mejora futura | — |
| 4 | Mensajes algo largos (1 de 4) | P1, preguntas finales | Baja | Sin cambio: tocaría el prompt de G1 y obligaría a repetir la evaluación de 20 casos | — |

Los dos cambios se aplicaron después de las sesiones, por lo que su efecto no se midió con los participantes.

## 6. Casos límite

| Caso | ¿Cómo respondió el sistema? | ¿Qué aprendimos? |
|---|---|---|
| Con TV (evento 4) | 4 de 4 en rojo; aviso con mediana de 8.7 s (de 7.5 a 13.7 s) | La TV retrasa algo el aviso, pero no impide la detección |
| Otra habitación (evento 5) | 0 de 4 en rojo (4 ámbar). 2 recibieron aviso de duda (uno de Gemini y uno de respaldo, a los 10.6 s) y 2 no recibieron ninguno | Una alarma lejana solo produce duda; conviene colocar el dispositivo cerca del detector |
| Bolsillo (evento 8) | 3 de 4 en rojo (mediana 7.8 s) y 1 en ámbar con aviso a los 18.1 s. Los 4 se enteraron sin mirar la pantalla | El celular que escucha, aun en el bolsillo, detectó la alarma y la notificación llegó sin necesidad de mirar la pantalla |
| Ruidos (eventos 6 y 7) | 0 falsas alarmas en rojo; 2 ámbar sin aviso en el evento 6 | El ámbar no siempre genera aviso |

## 7. Limitaciones

- 4 participantes y 32 observaciones, no los 5 usuarios y 50 observaciones comprometidos en la PC1. Solo 1 de 4 (P3) tiene discapacidad auditiva, en forma parcial.
- En las sesiones, el dispositivo que escucha y el que recibe los avisos fue el mismo celular del participante. En el uso previsto, un dispositivo fijo escucha y el celular del usuario recibe; esa configuración no se probó con participantes.
- Alarmas reproducidas por un parlante en un entorno controlado; no se encendió ninguna alarma real.
- Las alarmas de prueba son grabaciones reales (2 peruanas y 2 de Freesound), pero la clase alarma se entrenó mayormente con audio sintético (86 % de sus muestras).
- Tiempos medidos con cronómetro a mano; los audios repetidos empiezan con 1 s de silencio y la pausa de 1.5 s entre repeticiones la eligió el equipo.
- El sistema necesita un dispositivo con la página abierta, la pantalla encendida e internet. Si se apaga, nadie se entera.
- Con la alarma en otra habitación, 2 de 4 participantes no recibieron ningún aviso.
- El claxon de las sesiones fue sintético.
- Los cambios posteriores a las sesiones no se midieron con los participantes.

## 8. Conclusión

Los 4 participantes instalaron y usaron Alertly sin ayuda (mediana 1:40) y entendieron los 22 avisos que recibieron durante los eventos (claridad promedio 4.75). A ninguno le molestaron los mensajes y los 4 lo usarían como complemento de un detector de humo. El sistema llegó a rojo en 19 de 24 alarmas (79.2 %, a una alarma de la meta del 80 %); en las otras 5 marcó ámbar y en 3 de ellas llegó un aviso de duda. La condición más débil fue la alarma en otra habitación (0 de 4 en rojo). El aviso llegó con una mediana de 7.8 s, lejos de la meta de 3 s. No hubo falsas alarmas en rojo (0 de 8). Los hallazgos derivaron en dos cambios de texto en la pantalla, aplicados el 12/11/2026 a las 10:34, después de las sesiones; su efecto se comprobó solo con un seguimiento breve con una persona (P3).
