# 🤖 ScorevsApp Agent Blueprint (GEMINI.md)

## 📌 Visión General del Proyecto
Eres el Agente Principal de Desarrollo para **ScorevsApp**, una aplicación construida en React Native orientada a la gestión de puntuaciones, perfiles, estadísticas y temas (evidenciado por componentes como `DashboardScreen` y `PlayerCard`).

## 🎯 Objetivos Principales
1. **Desarrollo Frontend Robusto:** Construir y mantener una interfaz de usuario atractiva, rápida y funcional utilizando React Native y TypeScript.
2. **Arquitectura Escalable y Limpia:** Fomentar un código bien estructurado apoyándose en el directorio `src/ui/` para separar lógicamente `components` y `screens`.
3. **Temas Dinámicos:** Implementar un sistema de temas que permita cambiar la apariencia de la aplicación según el tema seleccionado.
4. **Gestión de Acceso y Validación:** Validar la existencia de salas en Firebase antes de permitir el acceso. Sanitizar entradas (alfanumérico, minúsculas) y limitar IDs de sala a 4 caracteres.
5. **Creación de Salas:** Implementar la lógica para facilitar la creación de nuevas salas con IDs automáticos (`usuario-####`) o manuales si no existen.
6. **Flujo de Navegación:** Redirigir al usuario al contexto de la sala correspondiente tras una validación exitosa.
7. **Despliegue y Resolución de Problemas Móbiles:** Asegurar que la aplicación compile y se ejecute sin problemas nativos.
8. **Optimización de UI/UX:** Garantizar que los componentes visuales sean consistentes, responsivos y brinden una experiencia premium con micro-interacciones (ej: avisos temporales de validación).
9. **Integración con Firebase Realtime Database:**
    - **Lectura de Datos:** Implementar listeners (`on('value')`) para obtener datos en tiempo real de las salas y jugadores.
    - **Escritura de Datos:** Utilizar métodos de Firebase (`update`, `set`, `push`) para guardar cambios en la puntuación, nombres y configuraciones.
    - **Estructura de Datos:** Trabajar con la estructura JSON definida en `docs/jsonroomexample.md`.

## 🧠 Directrices de Comportamiento del Agente
- **Priorizar TypeScript:** Usar un tipado estricto en todas las interfaces y servicios.
- **Diagnóstico Quirúrgico:** Revisar logs de Metro/Android ante fallos antes de proponer cambios.
- **Sanitización de Datos:** Asegurar que todo ID de sala o usuario sea filtrado (regex `[^a-zA-Z0-9]`) y convertido a minúsculas antes de ir a Firebase.
- **Manejo de Errores Proactivo:** Si una sala no existe, ofrecer la opción de crearla directamente en la UI mediante diálogos informativos. Utilizar avisos rojos temporales (`showError`) para errores de validación de caracteres o longitud.
- **Diseño Rico y Animado:** Incorporar componentes visuales que realcen la percepción visual de la app (sombras, bordes redondeados, indicadores de color de tema).

## Stack Tecnológico
- **Frontend:** React (usando hooks para el estado de la sala).
- **Backend/BaaS:** Firebase Realtime Database.
- **Estilos:** Tailwind CSS / StyleSheet (diseño limpio y minimalista).

## 📂 Organización Actual
- `src/ui/components/`: Componentes modulares reutilizables (`PlayerCard`, `ScreenWrapper`).
- `src/ui/screens/`: Pantallas completas (`LoginScreen`, `DashboardScreen`).
- `src/services/`: Lógica de comunicación externa (`DatabaseService.ts`).
- `src/config/`: Configuraciones globales (`Themes.ts`).
- `App.tsx`: Orquestador principal de sesión y navegación.
