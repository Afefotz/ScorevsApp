# Ejemplo de CSS del tema Windows 95

```css
/* =========================================
TEMA 1: Clasico Windows95 (Panel de Control)
========================================= */

body {
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  background: #008080;
  padding: 50px;
  text-align: center;
}

.window {
  background: #c0c0c0;
  border: 2px solid;
  border-color: #fff #808080 #808080 #fff;
  padding: 15px;
  max-width: 400px;
  margin: 0 auto;
  box-shadow: 4px 4px 10px rgba(0, 0, 0, 0.5);
}

.title-bar {
  background: linear-gradient(90deg, #000080, #1084d0);
  color: white;
  padding: 4px 8px;
  margin-bottom: 15px;
  font-weight: bold;
  text-align: left;
  font-size: 14px;
}

input {
  padding: 6px;
  width: 85%;
  margin-bottom: 20px;
  border: 2px solid;
  border-color: #808080 #fff #fff #808080;
  /* Efecto hundido */
}

button {
  padding: 8px 15px;
  font-weight: bold;
  cursor: pointer;
  background: #c0c0c0;
  border: 2px solid;
  border-color: #fff #808080 #808080 #fff;
}

button:active {
  border-color: #808080 #fff #fff #808080;
  /* Efecto presionado */
  transform: translate(1px, 1px);
}

/* ---Overlay---*/
body {
  margin: 0;
  padding: 20px;
  background-color: transparent;
  font-family: Arial, sans-serif;
}

.window {
  background-color: #c0c0c0;
  width: fit-content;
  border-top: 3px solid #fff;
  border-left: 3px solid #fff;
  border-right: 3px solid #000;
  border-bottom: 3px solid #000;
  box-shadow: 4px 4px 10px rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
  opacity: var(--widget-opacity, 1);
  transition: opacity 0.2s ease; /* Transición suave al deslizar */
}

.title-bar {
  background: linear-gradient(90deg, #000080, #1084d0);
  padding: 4px;
  color: white;
  font-weight: bold;
  font-size: 14px;
}

.content {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  gap: 20px;
  padding: 15px 10px;
  box-sizing: border-box;
}

/* Tarjeta de Jugador */
.player-card {
  display: flex;
  align-items: center;
  gap: 8px;
}

/* Marco de la foto hundido */
.photo-frame {
  width: 50px;
  height: 50px;
  background: #fff;
  border: 2px solid;
  border-color: #808080 #fff #fff #808080;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
}

.photo-frame img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.player-info {
  display: flex;
  flex-direction: column;
}

.player-name {
  font-weight: bold;
  font-size: 14px;
  color: #000;
  margin-bottom: 2px;
  text-transform: uppercase;
}

/* Marcador estilo digital */
.score-box {
  background: #000;
  color: #0f0;
  /* Verde matrix */
  font-family: "VT323", monospace;
  font-size: 35px;
  padding: 0 10px;
  min-width: 40px;
  text-align: center;
  border: 2px solid;
  border-color: #808080 #fff #fff #808080;
  /* NUEVO: Le decimos que cualquier cambio de tamaño o color tome 0.2 segundos */
  transition:
    transform 0.1s ease-out,
    color 0.1s ease-out,
    text-shadow 0.1s ease-out;
}

/* NUEVO: La clase que inyectaremos con JavaScript al sumar un punto */
.score-animating {
  transform: scale(1.5);
  /* Crece un 50% */
  color: #ffff00 !important;
  /* Se vuelve amarillo brillante */
  text-shadow: 0 0 15px #ffff00;
  /* Efecto de resplandor */
}

.vs {
  font-weight: bold;
  color: #808080;
  font-style: italic;
  font-size: 20px;
}

/* --- ESTILOS PARA EL MODO SIN FOTOS --- */
.modo-texto .photo-frame {
  display: none !important;
  /* Desaparece el cuadro 3D por completo */
}

.modo-texto .player-card {
  flex-direction: column !important;
  /* Apila el nombre sobre el marcador */
  justify-content: center;
}

.modo-texto .player-name {
  font-size: 16px;
  margin-bottom: 5px;
  text-align: center;
}

/* Clase dinámica para invertir a los jugadores */
.jugadores-invertidos {
  flex-direction: row-reverse !important;
}
```