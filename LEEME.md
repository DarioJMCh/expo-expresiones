# App web — Expresiones faciales (para el auditorio)

Versión web de `3. expresiones faciales.py`. Detecta las **mismas 7 emociones**
(Feliz, Neutral, Triste, Enojado, Sorprendido, Miedo, Disgusto) usando la cámara
del celular. Funciona en **Android y iPhone**, sin instalar nada: solo abrir un enlace.

> La distancia en metros es una **estimación aproximada** por el tamaño del rostro.
> El celular no tiene el sensor de profundidad de la RealSense.

---

## Requisito clave: HTTPS
La cámara del navegador SOLO funciona en `localhost` o en un sitio con **HTTPS**.
Por eso, para el auditorio hay que publicarla (GitHub Pages, Netlify, etc.).

---

## 1) Probar en TU PC (rápido)
```bash
cd "/home/dariou2/PycharmProjects/visionexpo/appweb_expresiones"
python3 -m http.server 8000
```
Abre en el navegador de la PC: **http://localhost:8000**
(En localhost la cámara sí funciona aunque no haya HTTPS.)

---

## 2) Publicar para el auditorio — Opción A: Netlify Drop (la más fácil, 1 min)
1. Entra a https://app.netlify.com/drop
2. Arrastra la carpeta `appweb_expresiones` completa a la página.
3. Te da una URL con HTTPS (ej: `https://algo-random.netlify.app`). ¡Ese es tu enlace!

## 2) Publicar — Opción B: GitHub Pages (enlace permanente y gratis)
```bash
cd "/home/dariou2/PycharmProjects/visionexpo/appweb_expresiones"
git init
git add index.html
git commit -m "App web expresiones faciales"
# crea un repo vacío en github.com (ej: expo-expresiones) y luego:
git branch -M main
git remote add origin https://github.com/TU_USUARIO/expo-expresiones.git
git push -u origin main
```
Luego en GitHub: **Settings → Pages → Branch: main / root → Save**.
En 1-2 min tendrás: `https://TU_USUARIO.github.io/expo-expresiones/`

---

## 3) En el auditorio
- Genera un **código QR** de tu enlace (ej: https://www.qr-code-generator.com) y
  proyéctalo. Cada asistente lo escanea con su cámara → abre la app → toca
  **"Iniciar cámara"** → permite el acceso. Listo.
- Botón **"Cambiar cámara"** alterna frontal / trasera.

## Notas
- Primera carga descarga ~2 MB de modelos de IA (se cachean después).
- Recomienda a los asistentes tener buena luz de frente al rostro.
- Si alguien ve "Error de cámara": revisar que aceptó el permiso y que la URL es HTTPS.

---

# Más demos de visión artificial (misma carpeta)

Menú con todas las demos: `https://TU_USUARIO.github.io/expo-expresiones/menu/`
(usa **ese** enlace para el código QR de la charla).

| Carpeta | Demo | Concepto que explica |
|---|---|---|
| `pixeles/` | Así ve una máquina | La imagen son números: píxeles, RGB, grises, bordes, umbral |
| `/` (raíz) | Expresiones faciales | Clasificación |
| `objetos/` | Detector de objetos + búsqueda del tesoro | Detección (qué hay y dónde) |
| `manos/` | Piedra, papel o tijera contra la IA | Puntos clave (21 puntos de la mano) |
| `entrena/` | Entrena tu propia IA | Aprendizaje con ejemplos, sesgo en los datos |

- Las demos 3, 4 y 5 usan **MediaPipe** (Google) y descargan su modelo la primera vez
  (4–8 MB). Pide al público abrir el enlace al inicio de la charla.
- `comun/` tiene el estilo y el código de cámara compartidos: súbelo junto con las carpetas.
- Todo se procesa en el celular; ninguna imagen sale del dispositivo.
