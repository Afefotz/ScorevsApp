# 🎮 ScorevsApp

![React Native](https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Kotlin](https://img.shields.io/badge/Kotlin-7F52FF?style=for-the-badge&logo=kotlin&logoColor=white)

ScorevsApp es una avanzada aplicación móvil construida principalmente en **React Native**, pero que integra robustas capacidades nativas en **Java/Kotlin** para Android. Está orientada a la gestión de puntuaciones interactivas, perfiles de jugadores, estadísticas y personalización a través de un sistema de temas dinámicos sincronizados en tiempo real mediante Firebase.

---

## ✨ Características Principales

*   **Sistema de Salas en Tiempo Real (Create/Join):** Sincronización atómica mediante Firebase Realtime Database.
*   **Temas Dinámicos en Tiempo Real:** 8 variaciones visuales (Win95, Neon, Metal, Modern, etc.) con transiciones limpias y sin residuos de renderizado.
*   **Marcador OOB (Out-of-Bounds):** Implementación nativa de una burbuja flotante/Picture-in-Picture que permite interactuar con el marcador incluso con la app en segundo plano.
*   **Gestión de Jugadores:** Perfiles con fotos, nombres personalizables y estadísticas históricas.
*   **Gestión de Link para Streaming:** Generación y copiado automático del enlace de overlay para visualización web, facilitando la integración con OBS Studio y plataformas de transmisión.
*   **Configuración Avanzada:** Control granular de opacidad, orientación vertical (TikTok mode) y visibilidad de elementos decorativos.

---

## 🛠 Arquitectura Híbrida

El éxito de la funcionalidad de la burbuja flotante se debe a una arquitectura que combina lo mejor de ambos mundos:

*   **Capa JavaScript (React Native + TS):** Gestiona la lógica de negocio, la navegación, la sincronización con Firebase y la interfaz principal de la aplicación.
*   **Capa Nativa (Java/Kotlin):** Crucial para el desarrollo del **FloatingScoreService**. Al ser una funcionalidad que vive fuera del contexto estándar de una Activity (fuera de los límites de la app), se implementó directamente con las APIs nativas de Android (`WindowManager`, `Service`).
*   **Puente de Comunicación:** Se utiliza un sistema de `NativeModules` para disparar el overlay y `NativeEventEmitter` para devolver las interacciones (clics en la burbuja) al estado global de la aplicación.

---

## 🚀 Cómo Empezar (Para Desarrolladores)

### Prerrequisitos

*   [Node.js](https://nodejs.org/en/)
*   [JDK 17+](https://www.oracle.com/java/technologies/downloads/) (Necesario para la compilación Kotlin/Java)
*   [Android Studio](https://developer.android.com/studio) / [Xcode](https://developer.apple.com/xcode/)
*   [React Native Environment Setup](https://reactnative.dev/docs/set-up-your-environment)

### Instalación y Ejecución

1.  **Dependencias:** `npm install` o `yarn install`.
2.  **Firebase:** Configurar `google-services.json` / `GoogleService-Info.plist`.
3.  **Metro Bundler:** `npm start`.
4.  **Lanzamiento:** `npm run android` o `npm run ios`.

---

## 🔧 Configuración para Ambientes de Producción

Para compilar versiones firmadas, configurar en `gradle.properties`:
*   `MYAPP_UPLOAD_STORE_FILE`
*   `MYAPP_UPLOAD_KEY_ALIAS`
*   `MYAPP_UPLOAD_STORE_PASSWORD`
*   `MYAPP_UPLOAD_KEY_PASSWORD`

---

## 🫧 Marcador Flotante (Android Configuration)

### Para el Usuario
*   **Permiso Overlay:** Obligatorio conceder "Mostrar sobre otras aplicaciones" al primer inicio o desde ajustes.
*   **Batería:** Configure la app como "Sin restricciones" para asegurar que la burbuja no sea eliminada por el sistema en sesiones largas.

### Para el Desarrollador
*   El código nativo se encuentra en `android/app/src/main/java/com/scorevsapp/`.
*   Se utiliza un `Foreground Service` con tipo `specialUse` para garantizar la persistencia del marcador mientras la app está minimizada.
