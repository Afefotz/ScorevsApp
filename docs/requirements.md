# ScoreVS Mobile - Especificaciones del Proyecto

ScoreVS Mobile es la aplicación controlador para el ecosistema de marcadores web **ScoreVS**, diseñada para permitir a streamers y jueces controlar las puntuaciones y la apariencia de las partidas competitivas (Versus) de manera remota a través de dispositivos Android e iOS.

## 1. Visión General
Esta aplicación actúa como un control remoto avanzado, sincronizado en tiempo real (vía Firebase Realtime Database) con el overlay web que se muestra en programas de transmisión en vivo (OBS Studio, PRISM Live, XSplit, etc). Su objetivo principal es facilitar el manejo de marcadores, nombres de jugadores, fotografías y apariencia visual del stream sin interactuar con la PC.

## 2. Tecnologías Core
- **Framework:** React Native (con TypeScript) para Android e iOS.
- **Base de Datos:** Firebase Realtime Database.
- **Persistencia Local:** AsyncStorage (para mantener salas y configuraciones previas).
- **Gestión Multimedia Local:** Para captura y procesamiento de imágenes a Base64 desde el dispositivo móvil.

## 3. Requerimientos Funcionales

### 3.1 Gestión de Salas y Sesiones
- Creación y acceso a salas seguras mediante un **Nombre de Usuario** y un identificador con sufijos aleatorios para aislar transmisiones (e.g., `afefotz-8f4y`).
- Persistencia local para recordar automáticamente la última sala activa sin iniciar sesión nuevamente.
- Cierre de sesión: Posibilidad de borrar la sesión local para unirse a una nueva sala.

### 3.2 Control de Estado de los Jugadores
- **Puntuación:** Controles de incremento (+1) y decremento (-1). Esto disparará las animaciones reactivas (zoom/resplandor) en el overlay web.
- **Identidad:** Edición en tiempo real del nombre de los jugadores.
- **Fotografía / Avatares:** Permite subir fotos utilizando la cámara del celular o seleccionar de la galería, reduciéndolas y enviándolas como cadena Base64 al servidor de la misma forma que lo realiza el widget web original.

### 3.3 Gestión de Apariencia del Overlay
- **Tematización Completa:** Soporte para cambiar entre los 9 diseños CSS predefinidos del overlay (Retro Win95, Moderno Oscuro, Moderno Claro, Cyberpunk Neón, Pastel, Rocoso, Láser, Papel y Metálico).
- **Adaptabilidad de Pantalla:** Interruptor/botón para alternar el diseño del overlay entre modo horizontal (estándar) y modo vertical (optimizado para TikTok o YouTube Shorts).
- **Control de Opacidad:** Un deslizador (slider) para ajustar dinámicamente la opacidad global del widget en el stream en tiempo real (de 50% a 100%).
- **Colores Inteligentes:** Selección u opción para aprovechar los colores de contraste automáticos calculados por el overlay.

### 3.4 Sincronización Inversa
- Escucha pasiva: Si otro controlador o el panel web original modifica alguna configuración, la interfaz de ScoreVS Mobile debe reflejar estos cambios visualmente al instante.

## 4. Requerimientos de UI/UX (Aplicación Móvil)
- **Diseño Premium y Tematizado:** La UI del controlador móvil debe adaptarse visualmente al tema seleccionado actualmente (por ejemplo, tomar los colores relativos si está en modo Cyberpunk), brindando una experiencia inmersiva.
- **Interacción Tangible:** Feedback visual en pulsaciones y animaciones de confirmación.
- **Diseño Responsive:** Controles cómodos para usar el móvil a modo de "Gamepad" horizontal o en modo vertical tradicional.

## 5. EJEMPLO de estructura de Datos (Firebase - Referencia de Sincronización)
```json
{
  "rooms": {
    "afefotz-8f4g": {
      "p1": {
        "name": "Afefotz",
        "photo": "data:image",
        "score": 12
      },
      "p2": {
        "name": "Sabrina",
        "photo": "data:image",
        "score": 4
      },
      "settings": {
        "accentColor": "#c0c0c0",
        "colors": {
          "bg": "#3a3a3a",
          "primary": "#2b2b2b",
          "score": "#ffffff",
          "secondary": "#8c8c8c",
          "text": "#000000",
          "window": "#6b6b6b"
        },
        "customTitle": "Liga S Potosina - Semana 9",
        "opacity": 96,
        "showPhotos": true,
        "swapPlayers": true,
        "theme": "theme-win95",
        "verticalMode": false
      }
    }
  }
}
```

## 6. Próximos Pasos (Hoja de Ruta)
1. Conectar interfaz dinámica con el control de Puntuaciones y Nombres de jugadores.
2. Integrar lógica para manejo, compresión en canvas y envío de fotos a Base64 usando React Native.
3. Incorporar controles de configuración avanzados (Opacidad, Disposición vertical/horizontal).
4. Implementar selector de las 9 resoluciones/temas visuales de forma coherente.
5. Implementar una burbuja flotante para controlar el score sin abrir la app. La burbuja debe ser arrastrable (Drag and Drop), al soltarla se pega automáticamente al borde izquierdo o derecho de la pantalla, por defecto sea solo un pequeño ícono discreto, y al tocarlo se expanda mostrando los nombres y los botones de "+1" y "-1" y que cuando no se esté tocando, se vuelva semitransparente.
