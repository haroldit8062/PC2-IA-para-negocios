# Licencias y créditos de los audios — Alertly (PC2)

> Fuentes, licencias y uso de los audios. Los audios de terceros **no se redistribuyen** en este repositorio: aquí solo se documentan y se acreditan.

## 1. Audios de terceros (Freesound)

| Audio | Autor | Licencia | Uso en el proyecto | Enlace |
|---|---|---|---|---|
| «Testing smoke detector (SoundAction 239)» | alexarje | Creative Commons Atribución 4.0 (CC BY 4.0) | Alarma de prueba: evento 3 de la validación y pruebas del modelo. Grabación real (etiqueta `field-recording`) | https://freesound.org/people/alexarje/sounds/863217/ |
| «Smoke Detector Alarm» | rayprice | Creative Commons Atribución 3.0 (CC BY 3.0) | Alarma de prueba en las pruebas del modelo. Grabación real de un detector doméstico | https://freesound.org/people/rayprice/sounds/155006/ |

**Créditos (licencias de atribución):**

- «Testing smoke detector (SoundAction 239)» por alexarje, Freesound.org (https://freesound.org/people/alexarje/sounds/863217/), licencia CC BY 4.0 (https://creativecommons.org/licenses/by/4.0/).
- «Smoke Detector Alarm» por rayprice, Freesound.org (https://freesound.org/people/rayprice/sounds/155006/), licencia CC BY 3.0 (https://creativecommons.org/licenses/by/3.0/).

Los dos se usaron únicamente para **probar** el modelo, no para entrenarlo. No se anotó ninguna modificación del audio; en las pruebas «con ruido», el ruido era el de los exteriores de la habitación, no se mezcló en el archivo.

## 2. Audios propios del equipo

| Audio | Descripción | Uso |
|---|---|---|
| Grabaciones de detectores de humo vendidos en Perú (2) | Un detector con 4 pitidos rápidos a unos 4 kHz y otro con pulsos rápidos a unos 3.1 kHz. Marca y modelo desconocidos | Referencia para diseñar los audios sintéticos y, repetidos hasta 20 s con una pausa de 1.5 s, audios de prueba |
| Ruido de fondo propio (entrenamiento y pruebas) | Conversaciones, TV, cocina, calle, ventilador y voces fuertes grabados por el equipo (unas 412 muestras de entrenamiento). Las personas grabadas dieron su consentimiento | Entrenamiento y pruebas |
| Pruebas del 08/11/2026 | Grabadas con un celular Samsung Galaxy S24 FE: cocina (agua, platos y cubiertos, unos 15 s), hogar (microondas y lavadora, unos 15 s), un ventilador distinto al del entrenamiento y un grito | Solo pruebas (no entraron al entrenamiento) |
| Claxon de camión y de tráfico | Grabados desde la calle con el mismo celular el 08/11/2026 (unos 10 s cada uno) | Solo pruebas |

## 3. Audios sintéticos

Generados por código (Python) por el equipo con ayuda de Claude; no contienen material de terceros y no tienen restricciones de licencia.

- Alarmas de detector de humo con distintos patrones de pitidos, a distintas distancias y con ruido.
- 18 alarmas diseñadas a partir de las dos grabaciones peruanas (tonos de unos 4 kHz y de unos 3.1 kHz).
- Claxons de auto, camión, bus y moto, con tráfico de fondo.
- Pitidos aislados (uno cada varios segundos) para la clase de ruido.

## 4. Otras fuentes

- **Grabaciones reales de detectores de humo** hechas con su celular por un amigo del equipo para la clase de alarma (unas 87 muestras del entrenamiento). No son de Freesound ni de otros bancos de sonido, por lo que no tienen licencias de terceros. Marca y modelo de esos detectores: desconocidos.
- La conversación usada como ruido de prueba salió de un video de un curso dictado por internet (fragmento de unos 20 s). Contiene la voz de un tercero y **no se publica**.

## 5. Qué no está en el repositorio

- Los archivos de audio de Freesound.
- Las grabaciones con voces de terceros (conversaciones, TV, curso en línea).
- Las capturas de Telegram de los participantes.
