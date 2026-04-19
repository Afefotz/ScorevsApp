# Diseño: ScorevsApp Out-of-Bounds (OOB) Overlay

## 1. Visión General
Implementar una interfaz de usuario visual estéticamente coherente basada en el tema del usuario (Win95, Neon, Modern) que persista fuera de los límites principales de la app móvil. Permitirá a los usuarios ver y modificar sus puntuaciones de sala en tiempo real. 

Debido a las estrictas diferencias entre los ecosistemas móviles, **Android usa un sistema de Burbuja Flotante** e **iOS usa un Live Activity con Dynamic Island**. Ambas capas se comunican con React Native.

## 2. Arquitectura Base: React Native (Capa Unificada)
- **`ScoreOverlayWrapper.ts`**: Módulo/Hook responsable de orquestar el comportamiento del overlay. Se anclará al `AppState` para iniciar los overlays al ir a background.
- **Sistema de Inyección de Tema**: Para preservar la elección visual del usuario de `OverlaySettingsModal`, la capa de React Native pasará los JSONs dinámicos de tokens de tema (`Themes.ts`) al código nativo en cada recarga de estado.
- **Sincronización Interactiva**: Configuración de `DeviceEventEmitter` para recibir `onP1ScoreUp`, `onP2ScoreUp`, etc. Esto llamará inmediatamente al método maestro de base de datos `dbService.updateScore()`, asegurando que Firebase sea siempre la fuente de la verdad para el resto de los dispositivos conectados.

## 3. Implementación Android (Floating Window)
- **Tecnología Principal**: `WindowManager.LayoutParams.TYPE_APPLICATION_OVERLAY`, Foreground Service (`Service`) en Kotlin, Vistas Nativas de Android.
- **`FloatingScoreService.kt`**: Inyectará programáticamente un ConstraintLayout cargado vía XML nativo.
- **Estética Dinámica**: Se analizará el diccionario del Tema de manera nativa para crear `GradientDrawable` envolventes (bordes coloridos para Neon, biselados simulados para Win95, fondos translúcidos).
- **Interacción (Drag & Drop)**: El ConstraintLayout estará adherido a un `OnTouchListener` para actualizar el eje `X` y `Y` del WindowManager fluídamente. Taps cortos en áreas definidas de P1/P2 enviarán el evento hacia el ReactInstanceManager.

## 4. Implementación iOS (Live Activity)
- **Tecnología Principal**: `ActivityKit`, `SwiftUI`, `AppIntents` (iOS 16+ / 17+).
- **Extensiones (Xcode)**: Creación un target nuevo en Xcode llamado tipo `Widget Extension` para soportar tanto los Widgets como las Live Activities.
- **Estética Dinámica**: Las vistas en `SwiftUI` recibirán el String del Tema desde JS, aplicando internamente modificadores gráficos modernos que emulan el estilo seleccionado.
- **Interacción (AppIntents)**: Uso de botones estáticos en SwiftUI atados a un `AppIntent`. Apple ejecutará este intent en background, el cual buscará el motor de React Native activo para inyectar su evento al componente JS de escucha y actualizar la base de datos de manera silenciosa.

## 5. Lógica Visual de Componentes (Toggle `showPhotos`)
El diseño del overlay (tanto la Burbuja en Android como la Live Activity en iOS) respetará holísticamente el estado global configurado desde el `OverlaySettingsModal`:
- **Con Fotos Activas (`showPhotos: true`)**: La interfaz se priorizará de forma gráfica. Mostrará únicamente las fotos redondas (avatares) de cada jugador, con su puntuación correspondiente al lado y los dos botones minimalistas interactivos (`+1` / `-1`). 
- **Con Fotos Inactivas (`showPhotos: false`)**: La interfaz cambia a modo texto compacto. Desaparecen los avatares para mostrar el **nombre del jugador**, manteniendo su puntuación y los mimos botones interactivos de puntos.

## 6. Prevención de Errores
- **Recuperación de Estado**: Android requerirá conceder el permiso explícito explícito de *Draw Over Other Apps*. Habrá una capa de JS interactiva si el permiso es rechazado o nulo para redirigir a los Ajustes de Android.
- **Resiliencia de Firebase**: Si fallara la Red, el usuario podría enviar múltiples pings que se encolarán de manera nativa y se ejecutarán apenas JS retome conexión.
