// Utilidades comunes de las demos: cámara, carga de MediaPipe y FPS.
// Todo corre en el celular: ninguna imagen sale del dispositivo.

export const MP_VERSION = "0.10.35";
const MP_BASE = "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@" + MP_VERSION;
export const MODELOS = "https://storage.googleapis.com/mediapipe-models";

// Carga la librería MediaPipe Tasks Vision y sus binarios WebAssembly.
export async function cargarVision() {
  const mod = await import(MP_BASE + "/vision_bundle.mjs");
  const fileset = await mod.FilesetResolver.forVisionTasks(MP_BASE + "/wasm");
  return { mod, fileset };
}

// Crea una tarea de MediaPipe probando primero la GPU y luego la CPU
// (algunos celulares no soportan el delegado GPU).
export async function crearTarea(Clase, fileset, opciones) {
  let ultimoError;
  for (const delegate of ["GPU", "CPU"]) {
    try {
      const tarea = await Clase.createFromOptions(fileset, {
        ...opciones,
        baseOptions: { ...opciones.baseOptions, delegate },
      });
      return { tarea, delegate };
    } catch (e) { ultimoError = e; }
  }
  throw ultimoError;
}

export class Camara {
  constructor(video, stage, facing = "user") {
    this.video = video;
    this.stage = stage;
    this.facing = facing;
    this.stream = null;
  }

  // La cámara frontal se muestra como espejo (más natural para el usuario).
  get espejo() { return this.facing === "user"; }
  get activa() { return !!this.stream; }

  async iniciar() {
    this.detener();
    this.stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: this.facing, width: { ideal: 640 }, height: { ideal: 480 } },
      audio: false,
    });
    this.video.srcObject = this.stream;
    await this.video.play();
    this.stage.classList.toggle("mirror", this.espejo);
    this.ajustarEscenario();
  }

  // Ajusta el recuadro a la proporción real del video para que los dibujos
  // del canvas coincidan exactamente con la imagen.
  ajustarEscenario() {
    const vw = this.video.videoWidth, vh = this.video.videoHeight;
    if (!vw || !vh) return;
    this.stage.style.aspectRatio = vw + " / " + vh;
    const maxW = Math.min(640, window.innerHeight * 0.62 * vw / vh);
    this.stage.style.maxWidth = Math.round(maxW) + "px";
  }

  detener() {
    if (this.stream) this.stream.getTracks().forEach(t => t.stop());
    this.stream = null;
  }

  async cambiar() {
    this.facing = (this.facing === "user") ? "environment" : "user";
    if (this.stream) await this.iniciar();
  }
}

// Devuelve una función que, llamada en cada cuadro, actualiza el texto de FPS.
export function medidorFPS(el) {
  let ultimo = performance.now(), suave = 0;
  return () => {
    const ahora = performance.now();
    const dt = ahora - ultimo; ultimo = ahora;
    if (dt > 0) {
      const fps = 1000 / dt;
      suave = suave ? suave * 0.9 + fps * 0.1 : fps;
      el.textContent = "FPS " + suave.toFixed(0);
    }
  };
}

// Marca de tiempo estrictamente creciente (MediaPipe la exige en modo VIDEO).
let ultimoTs = 0;
export function marcaTiempo() {
  const t = Math.max(performance.now(), ultimoTs + 1);
  ultimoTs = t;
  return t;
}

export function mensajeErrorCamara(err) {
  return "Error de cámara: " + (err && err.message ? err.message : err) +
    " (¿permitiste el acceso? ¿estás en HTTPS?)";
}
