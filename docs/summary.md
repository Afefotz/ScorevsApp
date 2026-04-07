# 🏆 ScoreVS Widget

Un widget de marcador interactivo, personalizable y en tiempo real diseñado para transmisiones en vivo (OBS Studio, PRISM Live, XSplit). Permite a los streamers llevar el control de los puntajes, nombres y fotografías de los jugadores desde un panel de administración web, reflejando los cambios instantáneamente en la transmisión.

## ✨ Características Principales

* **⚡ Sincronización en Tiempo Real:** Actualizaciones instantáneas sin necesidad de recargar la página gracias a Firebase.
* **🎨 Múltiples Temas Visuales (9 diseños):** Cambia el aspecto del overlay y del panel de control con un solo clic (Retro Win95, Moderno Oscuro/Claro, Cyberpunk Neón, Pastel, Rocoso, Láser, Papel y Metálico).
* **📸 Procesamiento de Imágenes Local:** Sube fotos desde tu dispositivo. El sistema las comprime en un `<canvas>` y las convierte a Base64 para un renderizado ultra rápido sin depender de servicios de almacenamiento externos.
* **🎬 Animaciones Reactivas:** Efectos visuales automáticos (zoom y resplandor) al detectar incrementos en el puntaje.
* **📱 Diseño Adaptable:** Soporte nativo para modo horizontal (estándar) y modo vertical (ideal para streams en TikTok, Shorts o juegos retro).
* **🔒 Salas Seguras:** Sistema de generación de URLs únicas con sufijos aleatorios y reglas de seguridad de Firebase para aislar los datos de cada transmisión.

---

## ✨ Novedades en la última versión web

Hemos llevado la personalización visual al siguiente nivel aplicando ingeniería de CSS avanzada:

* **🎚️ Control de Opacidad Global:** Nuevo deslizador en el panel de control para ajustar la transparencia del overlay en tiempo real (de 50% a 100%). ¡El diseño del deslizador muta según el tema elegido!
* **🧠 Colores Relativos Inteligentes:** El sistema ahora calcula automáticamente colores de contraste. Por ejemplo, en el tema Cyberpunk, si eliges el neón rosa, los nombres cambian a cian para mantener una estética perfecta.
* **🖼️ Texturas Complejas en CSS Puro:** Adiós a las imágenes de fondo. Los nuevos temas utilizan múltiples capas de gradientes lineales, radiales y filtros SVG nativos para simular materiales físicos (piedra, musgo, metal grabado).

---

## 📖 Manual de Uso (Integración con OBS/PRISM)

1.  Ingresa a la página principal (`index.html`) y crea una sala.
2.  Desde el **Panel de Administración**, copia el enlace generado en el campo "Enlace para OBS".
3.  Abre OBS Studio o PRISM Live Studio.
4.  Añade una nueva fuente de tipo **Navegador (Browser Source)**.
5.  Pega el enlace, ajusta el ancho a `500` y el alto a `300` (o ajusta según tu preferencia).
6.  ¡Listo! Abre el panel de administración en tu celular o segundo monitor y controla el stream a distancia.

## 👨‍💻 Sobre el Autor

Desarrollador de software con sólida experiencia en programación y arquitectura de sistemas. Enfocado en crear herramientas web eficientes, reactivas y con arquitecturas escalables que resuelven problemas reales.

---
*Hecho con dedicación para la comunidad de Pump It Up*
