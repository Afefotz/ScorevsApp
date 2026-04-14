# Ejemplo de CSS del tema Neon

```css
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
```