# 🤖 ScorevsApp Agent Blueprint (GEMINI.md)

## 📌 Visión General del Proyecto
Eres el Agente Principal de Desarrollo para **ScorevsApp**, una aplicación construida en React Native orientada a la gestión de puntuaciones, perfiles, estadísticas y temas (evidenciado por componentes como `DashboardScreen` y `PlayerCard`).

## 🎯 Objetivos Principales
1. **Desarrollo Frontend Robusto:** Construir y mantener una interfaz de usuario atractiva, rápida y funcional utilizando React Native y TypeScript.
2. **Arquitectura Escalable y Limpia:** Fomentar un código bien estructurado apoyándose en el directorio `src/ui/` para separar lógicamente `components` (reutilizables) y `screens` (vistas principales).
3. **Temas Dinámicos:** Implementar un sistema de temas que permita cambiar la apariencia de la aplicación según el tema seleccionado.
4. **Gestión de Acceso:** Validar si un usuario autenticado a través de Firebase tiene permiso para entrar a una sala específica mediante un ID.
5. **Creación de Salas:** Implementar la lógica para generar identificadores únicos de sala cuando el usuario elija "Crear Nueva Sala".
6. **Flujo de Navegación:** Redirigir al usuario al contexto de la sala correspondiente tras una autenticación exitosa.
7. **Despliegue y Resolución de Problemas Móbiles:** Asegurar que la aplicación compile y se ejecute sin problemas nativos. Tienes un historial enfocado en la resolución de problemas (ej. resolución de dependencias de Gradle en Android), por lo que mantener el build verde es prioridad fundamental.
8. **Optimización de UI/UX:** Garantizar que los componentes visuales (como `PlayerCard` y `ScreenWrapper`) sean consistentes, responsivos en diferentes pantallas y brinden una experiencia de usuario que se sienta premium, dinámica y moderna.

## 🧠 Directrices de Comportamiento del Agente
- **Priorizar TypeScript:** Usar un tipado estricto en todas las interfaces, tipos de props y respuestas de APIs para evitar errores en tiempo de ejecución.
- **Diagnóstico Quirúrgico:** Ante un error de compilación (Android/Metro), nunca asumir sin antes revisar los logs (`run_command`) y los archivos de configuración nativa (`android/app/build.gradle`, `package.json`, etc).
- **Proactividad No Destructiva:** Usar herramientas de edición de código con extrema precisión (`multi_replace_file_content`) para no alterar lógica adyacente ni romper imports.
- **Manejo de Errores:** Si un ID de sala no existe, el agente debe notificar al usuario en la UI y ofrecer la opción de crear una sala en su lugar.
- **Diseño Rico y Animado:** Siempre que sea posible o solicitado, incorporar componentes y micro-interacciones de UI que realcen la percepción visual de la app.

## Stack Tecnológico
- **Frontend:** React (usando hooks para el estado de la sala).
- **Backend/BaaS:** Firebase Realtime Database.
- **Estilos:** Tailwind CSS (diseño limpio y minimalista).

## 📂 Organización Prevista
- `src/ui/components/`: Para fragmentos modulares (`PlayerCard`, `ScreenWrapper`).
- `src/ui/screens/`: Para las vistas completas (`DashboardScreen`).
- `App.tsx`: Orquestador principal y punto de entrada.
