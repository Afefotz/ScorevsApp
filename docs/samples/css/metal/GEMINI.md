# Ejemplo de CSS del tema Metal

```css
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

/* Efecto del recuadro del marcador (Hundido en el metal) */
.theme-metal .score-box { 
    /* Fondo más oscuro simulando la profundidad */
    background: rgba(0, 0, 0, 0.25) !important; 
    
    /* Bordes que simulan un corte biselado (oscuro arriba/izquierda, luz abajo/derecha) */
    border-top: 2px solid rgba(0,0,0,0.8) !important;
    border-left: 2px solid rgba(0,0,0,0.8) !important;
    border-bottom: 2px solid rgba(255,255,255,0.5) !important;
    border-right: 2px solid rgba(255,255,255,0.5) !important;
    
    /* Sombra interna agresiva para dar profundidad 3D */
    box-shadow: inset 4px 4px 10px rgba(0,0,0,0.8), 1px 1px 0px rgba(255,255,255,0.3) !important; 
    border-radius: 6px; 
}

/* Efecto de NÚMEROS TALLADOS (Color oscuro con reflejo en el borde inferior) */
body.theme-metal.textura-plata .score-box {
    color: #1a252f !important; /* Gris casi negro por la sombra interna */
    text-shadow: 1px 1px 1px rgba(255,255,255,0.8), -1px -1px 1px rgba(0,0,0,0.9) !important;
}

body.theme-metal.textura-oro .score-box {
    color: #332400 !important; /* Café muy oscuro, sin brillo */
    text-shadow: 1px 1px 1px rgba(255,255,255,0.5), -1px -1px 2px rgba(0,0,0,0.9) !important;
}

body.theme-metal.textura-bronce .score-box {
    color: #1a0c03 !important; /* Marrón casi negro */
    text-shadow: 1px 1px 1px rgba(255,160,100,0.5), -1px -1px 2px rgba(0,0,0,0.9) !important;
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

.theme-metal input[type="range"]::-webkit-slider-runnable-track {
    width: 100%; height: 10px; background: rgba(0,0,0,0.4); border-top: 2px solid #000; border-bottom: 1px solid rgba(255,255,255,0.2); border-radius: 5px;
}
.theme-metal input[type="range"]::-webkit-slider-thumb {
    -webkit-appearance: none; height: 22px; width: 12px; background: var(--main-color);
    border: 1px solid #000; border-radius: 3px;
    box-shadow: inset 1px 1px 3px rgba(255,255,255,0.8), inset -2px -2px 3px rgba(0,0,0,0.6), 2px 2px 5px rgba(0,0,0,0.8);
    margin-top: -7px; cursor: pointer;
}

/* ================= VARIANTES DE TEXTURA PARA METAL ==================== */

/* 1. ACERO PLATEADO (Brillo frío) */
body.theme-metal.textura-plata .window, 
body.theme-metal.textura-plata button {
    background: linear-gradient(135deg, #e4e9ec 0%, #b8c0c8 25%, #f2f5f6 50%, #a2abb3 75%, #d1d8df 100%);
    color: #2c3e50; /* Texto gris muy oscuro */
}
body.theme-metal.textura-plata .photo-frame, 
body.theme-metal.textura-plata .score-box {
    border-color: #8a9198;
}

/* 2. ORO IMPERIAL (Brillo cálido y lujoso) */
body.theme-metal.textura-oro .window, 
body.theme-metal.textura-oro button {
    background: linear-gradient(135deg, #ffdf00 0%, #d4af37 25%, #fff8b0 50%, #aa7700 75%, #ffd700 100%);
    color: #4a3500; /* Texto marrón oscuro dorado */
}
body.theme-metal.textura-oro .photo-frame, 
body.theme-metal.textura-oro .score-box {
    border-color: #aa7700;
}

/* 3. BRONCE ANTIGUO (Cálido, terroso y pesado) */
body.theme-metal.textura-bronce .window, 
body.theme-metal.textura-bronce button {
    background: linear-gradient(135deg, #cd7f32 0%, #8b4513 25%, #e6a87c 50%, #5c2e0b 75%, #b87333 100%);
    color: #2b1405; /* Texto marrón casi negro */
    /* El bronce suele tener letras más contrastantes para simular la pátina */
    text-shadow: 1px 1px 1px rgba(255,160,100,0.4), -1px -1px 1px rgba(0,0,0,0.8);
}
body.theme-metal.textura-bronce .photo-frame, 
body.theme-metal.textura-bronce .score-box {
    border-color: #5c2e0b;
}

/* Corrección de fondo para el panel de control (para que no se vea blanco transparente) */
body.theme-metal { background-color: #222; color: #fff; } /* Gris muy oscuro de fondo en el panel */

/* ---Overlay--- */
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

/* Efecto del recuadro del marcador (Hundido en el metal) */
.theme-metal .score-box { 
    /* Fondo más oscuro simulando la profundidad */
    background: rgba(0, 0, 0, 0.25) !important; 
    
    /* Bordes que simulan un corte biselado (oscuro arriba/izquierda, luz abajo/derecha) */
    border-top: 2px solid rgba(0,0,0,0.8) !important;
    border-left: 2px solid rgba(0,0,0,0.8) !important;
    border-bottom: 2px solid rgba(255,255,255,0.5) !important;
    border-right: 2px solid rgba(255,255,255,0.5) !important;
    
    /* Sombra interna agresiva para dar profundidad 3D */
    box-shadow: inset 4px 4px 10px rgba(0,0,0,0.8), 1px 1px 0px rgba(255,255,255,0.3) !important; 
    border-radius: 6px; 
}

/* Efecto de NÚMEROS TALLADOS (Color oscuro con reflejo en el borde inferior) */
body.theme-metal.textura-plata .score-box {
    color: #1a252f !important; /* Gris casi negro por la sombra interna */
    text-shadow: 1px 1px 1px rgba(255,255,255,0.8), -1px -1px 1px rgba(0,0,0,0.9) !important;
}

body.theme-metal.textura-oro .score-box {
    color: #332400 !important; /* Café muy oscuro, sin brillo */
    text-shadow: 1px 1px 1px rgba(255,255,255,0.5), -1px -1px 2px rgba(0,0,0,0.9) !important;
}

body.theme-metal.textura-bronce .score-box {
    color: #1a0c03 !important; /* Marrón casi negro */
    text-shadow: 1px 1px 1px rgba(255,160,100,0.5), -1px -1px 2px rgba(0,0,0,0.9) !important;
}

/* ============== VARIANTES DE TEXTURA PARA METAL ==================== */

/* 1. ACERO PLATEADO (Brillo frío) */
body.theme-metal.textura-plata .window, 
body.theme-metal.textura-plata button {
    background: linear-gradient(135deg, #e4e9ec 0%, #b8c0c8 25%, #f2f5f6 50%, #a2abb3 75%, #d1d8df 100%);
    color: #2c3e50; /* Texto gris muy oscuro */
}
body.theme-metal.textura-plata .photo-frame, 
body.theme-metal.textura-plata .score-box {
    border-color: #8a9198;
}

/* 2. ORO IMPERIAL (Brillo cálido y lujoso) */
body.theme-metal.textura-oro .window, 
body.theme-metal.textura-oro button {
    background: linear-gradient(135deg, #ffdf00 0%, #d4af37 25%, #fff8b0 50%, #aa7700 75%, #ffd700 100%);
    color: #4a3500; /* Texto marrón oscuro dorado */
}
body.theme-metal.textura-oro .photo-frame, 
body.theme-metal.textura-oro .score-box {
    border-color: #aa7700;
}

/* 3. BRONCE ANTIGUO (Cálido, terroso y pesado) */
body.theme-metal.textura-bronce .window, 
body.theme-metal.textura-bronce button {
    background: linear-gradient(135deg, #cd7f32 0%, #8b4513 25%, #e6a87c 50%, #5c2e0b 75%, #b87333 100%);
    color: #2b1405; /* Texto marrón casi negro */
    /* El bronce suele tener letras más contrastantes para simular la pátina */
    text-shadow: 1px 1px 1px rgba(255,160,100,0.4), -1px -1px 1px rgba(0,0,0,0.8);
}
body.theme-metal.textura-bronce .photo-frame, 
body.theme-metal.textura-bronce .score-box {
    border-color: #5c2e0b;
}

body.theme-metal { background-color: transparent !important; }

```