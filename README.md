# Alertly
## Proyecto Integrador de IA para Negocios — AD5018
### Universidad de Ingeniería y Tecnología (UTEC)

Alertly detecta con IA la alarma de un detector de humo doméstico y avisa por Telegram a una persona con discapacidad auditiva. Es un **complemento** y no reemplaza un detector de humo.

| | |
|---|---|
| **Pruébalo** | https://alertly-alpha.vercel.app (entra desde el bot) |
| **Bot de Telegram** | https://t.me/Alertly_alarma_bot |
| **Entrega** | PC2 — 13/11/2026 |

---

## 1. Equipo

- Harold Inca
- Diego Requena

**Curso:** AD5018 — Inteligencia Artificial para Negocios · **Framework:** PROMPT v2.0

---

## 2. Problema

Las personas con discapacidad auditiva que permanecen solas en el hogar tienen dificultad para identificar oportunamente una alarma de incendio o detector de humo activado —debido a su acceso limitado o nulo al canal auditivo—, lo que incrementa la posibilidad de no reaccionar a tiempo ante una situación de riesgo real y reduce su seguridad y autonomía.

## 3. Solución

Un dispositivo fijo en el hogar (una laptop o un celular con la página abierta) escucha el ambiente. Un modelo de audio entrenado por el equipo distingue la alarma de un detector de humo del ruido de fondo. Si hay una alarma, el celular del usuario recibe un aviso por Telegram. Si el sistema duda, lo dice y pide verificar.

El producto combina:

- **Componente analítico A3:** clasificador de audio de 2 clases (`alarma_incendio`, `ruido_de_fondo`) hecho con Teachable Machine, que corre en el navegador (el audio no se envía a ningún servidor).
- **Componente generativo G1:** un modelo de lenguaje (Gemini) con prompt fijo redacta los mensajes de duda y de tranquilidad, con un texto de respaldo si no responde en 2 s.
- **Alarma confirmada:** usa un texto fijo, sin modelo de lenguaje.
- **Patrón de conexión:** Modelo → Lenguaje.

```text
Micrófono → modelo de audio → reglas (umbrales, ventana de 3 s)
          → función serverless → Telegram
```

### Decisiones de alcance (feedback del profesor en la PC1)

- Dos clases, con la alarma de incendio como foco.
- Notificación por Telegram, sin app móvil. WhatsApp queda como mejora futura.

---

## 4. Cómo probarlo

1. Abre https://t.me/Alertly_alarma_bot y presiona **Iniciar**.
2. Toca **«Abrir Alertly»**.
3. Presiona **«Empezar a escuchar»** y acepta el micrófono.
4. Reproduce el sonido de un detector de humo desde otro dispositivo.
5. Verás la pantalla pasar de verde a ámbar o rojo y recibirás el aviso en Telegram.

Instrucciones completas y solución de problemas: [`mvp/README_mvp.md`](mvp/README_mvp.md).

---

## 5. Resultados

Los KR son los de la PC1 y no se modificaron. Se reportan con su valor real, cumplan o no la meta.

| KR | Meta | Resultado | Estado |
|---|---|---|---|
| KR1 Identificación de alarmas | ≥ 80 % | 79.2 % estricto (19/24); 91.7 % amplio | No cumple (estricto) |
| KR2 Tiempo hasta el aviso | ≤ 3 s | Mediana 7.8 s | No cumple |
| KR3 Modelo | Exactitud ≥ 80 %, recall ≥ 85 % | Exactitud 90 %, recall 80 %, precisión 100 %; baseline 58.2 % superado | Parcial |
| KR4 Mejora tras reentrenar | ≥ +5 pp de recall | No medido | No medido |
| KR5 Calidad de G1 | ≥ 90 % de 20 casos | 85 % (17/20); 100 % (16/16 de los que escribe Gemini) | No cumple (20) / cumple (16) |

**Validación con usuarios:** 4 personas (1 con discapacidad auditiva parcial) y 32 observaciones. Las 4 instalaron el sistema sin ayuda (mediana 1:40), entendieron los 22 avisos recibidos y ninguna tuvo falsas alarmas en rojo. La alarma desde otra habitación no llegó a rojo (0 de 4).

Detalle: [`mvp/evidencia/resultados_okr.md`](mvp/evidencia/resultados_okr.md).

### Limitaciones principales

- La clase de alarma se entrenó mayormente con audio sintético (unas 540 de 627 muestras, 86 %) y unas 87 muestras (14 %) de grabaciones reales de detectores de humo; las alarmas de prueba salen de pocas grabaciones.
- 4 participantes y 32 observaciones, no los 5 y 50 comprometidos. En las sesiones, la página corrió en el celular de cada participante, que también recibió los avisos.
- Necesita un dispositivo con la página abierta, la pantalla encendida e internet; no funciona fuera del hogar.
- Tiempos medidos con cronómetro a mano.
- No cubre alarmas de monóxido, de edificio ni sirenas.

---

## 6. Estructura del repositorio

```text
/
├─ README.md
├─ resumen_ejecutivo.md
├─ cronograma.md
├─ presentacion_pc2.pdf
├─ plantillas/
│   ├─ plantilla_1_problem_statement.md
│   ├─ plantilla_2_data_readiness.md
│   ├─ plantilla_3_ai_product_canvas.md
│   └─ plantilla_4_scorecard_risk.md
└─ mvp/
    ├─ README_mvp.md
    ├─ index.html
    ├─ api/ (alerta.js, telegram.js)
    ├─ evaluacion/ (evaluar_g1.js)
    └─ evidencia/
        ├─ pruebas_usuario.md
        ├─ resultados_okr.md
        ├─ medicion_modelo.md
        ├─ evaluacion_g1.md
        └─ licencias_audios.md
```

Los audios de terceros, las grabaciones con voces y las capturas de los participantes **no se publican** en el repositorio.

## 7. Documentos principales

| Documento | Contenido |
|---|---|
| `resumen_ejecutivo.md` | Síntesis del proyecto y de los resultados |
| `plantillas/plantilla_1` a `plantilla_3` | Fases P, R y O (actualizadas en la PC2) |
| `plantillas/plantilla_4_scorecard_risk.md` | Scorecard, riesgos, ética y Ley N.° 29733 |
| `mvp/README_mvp.md` | Cómo usar y desplegar el MVP |
| `mvp/evidencia/` | Pruebas con usuarios, resultados de los KR, medición del modelo, evaluación de G1 y licencias |

---

## 8. Créditos y licencias

- Teachable Machine, TensorFlow.js, Gemini, Telegram Bot API y Vercel.
- Audios de prueba de Freesound: «Testing smoke detector (SoundAction 239)» por alexarje (CC BY 4.0) y «Smoke Detector Alarm» por rayprice (CC BY 3.0). Detalle en [`mvp/evidencia/licencias_audios.md`](mvp/evidencia/licencias_audios.md).

## 9. Uso de IA

El código se escribió con Claude Code y los borradores de documentos y de plantillas fueron asistidos por Claude. El equipo revisó los datos, las cifras y las decisiones. Gemini es un componente del producto.

---

**Estado:** PC2 — MVP desplegado y validado con 4 usuarios.
