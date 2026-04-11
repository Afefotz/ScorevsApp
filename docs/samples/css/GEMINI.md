# Ejemplo de CSS para ThemeSelector

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

/* =========================================
TEMA 3: CYBERPUNK NEÓN (Panel de Control)
========================================= */
.theme-neon {
  background: #050510;
  color: #0ff;
  font-family: "VT323", monospace, sans-serif;
}

.theme-neon .window {
  background: rgba(10, 10, 20, 0.9);
  border: 1px solid #0ff;
  box-shadow: 0 0 15px rgba(0, 255, 255, 0.2);
  border-radius: 0;
}

.theme-neon .title-bar {
  background: #0ff;
  color: #000;
  text-transform: uppercase;
  font-weight: bold;
  text-align: center;
}

.theme-neon .player-section {
  border: 1px solid #f0f;
  box-shadow: inset 0 0 10px rgba(255, 0, 255, 0.1);
  background: transparent;
}

.theme-neon .section-title {
  background: #050510;
  color: #f0f;
  text-shadow: 0 0 5px #f0f;
  top: -10px;
  border: 1px solid #f0f;
}

.theme-neon button {
  background: transparent;
  color: #0ff;
  border: 1px solid #0ff;
  text-transform: uppercase;
  transition: 0.2s;
}

.theme-neon button:active {
  background: #0ff;
  color: #000;
  box-shadow: 0 0 15px #0ff;
}

.theme-neon input[type="text"],
.theme-neon select {
  background: transparent;
  color: #0ff;
  border: 1px solid #0ff;
  outline: none;
}

.theme-neon input[type="text"]:focus {
  box-shadow: 0 0 8px #0ff;
}

.theme-neon .btn-update {
  background: transparent;
  color: #f0f;
  border-color: #f0f;
}

.theme-neon .btn-update:active {
  background: #f0f;
  color: #000;
  box-shadow: 0 0 15px #f0f;
}

.theme-neon input[type="checkbox"] {
  border: 1px solid #0ff;
  background: #000;
}

.theme-neon input[type="checkbox"]:checked::before {
  color: #f0f;
  content: "X";
  font-family: monospace;
}

.theme-neon div[style*="background: #c0c0c0"] {
  background: transparent !important;
  border: 1px solid #0ff !important;
  box-shadow: inset 0 0 8px rgba(0, 255, 255, 0.2);
}

.theme-neon div[style*="background: #000"] {
  border-color: #f0f !important;
  color: #f0f !important;
  text-shadow: 0 0 8px #f0f;
}

/* Recuadro del marcador */
.theme-neon label,
.theme-neon p,
.theme-neon strong {
  color: #0ff !important;
}

/* =========================================
TEMA 9: METÁLICO (Plata, Oro, Bronce)
========================================= */
.theme-metal { 
    background: transparent; /* Transparente para el overlay */
    font-family: 'Arial Black', 'Impact', sans-serif; 
    text-transform: uppercase;
}

/* Efecto de marco metálico pesado */
.theme-metal .window { 
    background-color: var(--main-color); 
    border-radius: 4px; 
    /* Sombra exterior pesada y resplandor interior para simular bisel */
    box-shadow: inset 0 0 10px rgba(255,255,255,0.5), inset 2px 2px 5px rgba(255,255,255,0.8), inset -3px -3px 8px rgba(0,0,0,0.6), 5px 8px 15px rgba(0,0,0,0.6); 
}

.theme-metal .title-bar { 
    background: rgba(0, 0, 0, 0.15); 
    text-align: center; 
    font-weight: 900; 
    letter-spacing: 2px;
    border-bottom: 2px solid rgba(0,0,0,0.4); 
    border-top: 1px solid rgba(255,255,255,0.4);
    padding: 8px 0;
}

/* Efecto de texto grabado en el metal */
.theme-metal .player-name, .theme-metal .vs, .theme-metal .title-bar, .theme-metal .score-box { 
    /* Sombra clara abajo-derecha, sombra oscura arriba-izquierda = Hundido/Grabado */
    text-shadow: 1px 1px 1px rgba(255,255,255,0.6), -1px -1px 1px rgba(0,0,0,0.6); 
}

.theme-metal .photo-frame { 
    border: 3px solid; 
    border-radius: 5px; 
    box-shadow: inset 2px 2px 5px rgba(0,0,0,0.8), 1px 1px 2px rgba(255,255,255,0.5); 
}

.theme-metal .score-box { 
    background: rgba(0,0,0,0.1); 
    border: 2px solid; 
    border-radius: 4px; 
    box-shadow: inset 2px 2px 6px rgba(0,0,0,0.6), 1px 1px 1px rgba(255,255,255,0.4); 
}

/* ESTILOS PARA EL PANEL DE CONTROL */
.theme-metal .panel-card { 
    background: rgba(255,255,255,0.1); 
    border: 1px solid rgba(0,0,0,0.4); 
    box-shadow: inset 1px 1px 3px rgba(255,255,255,0.3), inset -1px -1px 3px rgba(0,0,0,0.4); 
    border-radius: 4px; 
}
.theme-metal button { 
    font-family: 'Arial Black', sans-serif; 
    text-transform: uppercase; 
    border-radius: 3px; 
    transition: 0.1s; 
    box-shadow: inset 1px 1px 2px rgba(255,255,255,0.5), 2px 2px 5px rgba(0,0,0,0.4);
}
.theme-metal button:active { 
    transform: translateY(2px); 
    box-shadow: inset 2px 2px 5px rgba(0,0,0,0.5); 
}
.theme-metal input[type="text"], .theme-metal select { 
    background: rgba(0,0,0,0.1); 
    border: 1px solid rgba(0,0,0,0.5); 
    box-shadow: inset 2px 2px 5px rgba(0,0,0,0.4), 1px 1px 0 rgba(255,255,255,0.3); 
    color: inherit;
    font-weight: bold;
}

/* Ajustes de texto para la vista previa en el Index */
.theme-modern h3,
.theme-modern p {
  color: #fff !important;
}

.theme-modern-light h3,
.theme-modern-light p {
  color: #333 !important;
}

.theme-neon h3,
.theme-neon p {
  color: #0ff !important;
  text-shadow: 0 0 5px #0ff;
}

.theme-pastel h3,
.theme-pastel p {
  color: #d87093 !important;
}

.theme-stone h3,
.theme-stone p {
  color: #f0f0f0 !important;
  font-family: "Georgia", serif;
}

.theme-laser h3,
.theme-laser p {
  color: #ff0000 !important;
  text-shadow: 0 0 5px #ff0000;
  text-transform: uppercase;
}

.theme-paper h3,
.theme-paper p {
  color: #333 !important;
  text-shadow: 0 0 5px #333;
  text-transform: uppercase;
}

.theme-metal h3,
.theme-metal p {
  color: #e0e5ec !important;
  text-shadow: 0 0 5px #e0e5ec;
  text-transform: uppercase;
}
```