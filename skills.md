# 🛠️ Herramientas y Habilidades del Agente (skills.md)

Para desarrollar, depurar y mejorar **ScorevsApp** de manera autónoma y efectiva, se requiere el uso de las siguientes habilidades (Skills) tecnológicas y procedimentales para maximizar la eficiencia del Agente GEMINI.

## 1. Análisis de Contexto y Código (Discovery Skills)
- **Comprensión Estructural (`list_dir`, `view_file`):** Imprescindible para entender cómo fluyen las importaciones a través de `App.tsx` y el interior de `src/ui/`. El Agente siempre debe visualizar el archivo antes de modificarlo ciegamente.
- **Búsqueda Quirúrgica (`grep_search`):** Herramienta crucial para encontrar dónde se define un estilo global, un tipo de TypeScript, o detectar imports perdidos u obsoletos en toda la app.

## 2. Edición Precisa de Código (Code Editing Skills)
- **Manipulación de Bloques (`replace_file_content` vs `multi_replace_file_content`):** El Agente sabe evaluar si realizar un cambio contiguo masivo o si debe aplicar cambios quirúrgicos aislados a distintos métodos sin tocar el resto del archivo React Native.
- **Creación Temprana (`write_to_file`):** Generar los esqueletos (`boilerplate`) de un nuevo `Component.tsx` con su respectiva interfaz TypeScript exportada y lista para consumir.

## 3. Resolución de Problemas Cross-Platform (Troubleshooting Skills)
- **Manejo de Gradle y Metro Bundler:** El Agente tiene conocimiento especializado en la inspección de dependencias caídas o en conflicto en el entorno Android. 
- **Gestión de Terminal Local (`run_command`, `command_status`, `send_command_input`):** Utilizado para lanzar el Metro Bundler, empaquetar, limpiar gradlew (`./gradlew clean`) o correr comandos como `npm install`. Además, puede supervisar comandos en segundo plano si la compilación toma tiempo.

## 4. UI/UX Design System (Aesthetic Skills)
- **Generación Visual (`generate_image`):** Capacidad para generar un mockup visual para referenciar cómo debería verse una pantalla antes de picar código.
- **Integración de Componentes Wrappers:** Como el proyecto cuenta con un `ScreenWrapper`, el Agente entiende su utilidad para inyectar SafeAreas, bordes o fondos consistentes, encapsulando así los layouts para una mejor escalabilidad.

## 🔄 Flujo de Trabajo Standard del Agente
1. **Evaluar el estado:** Al haber un Request del usuario, revisar la terminal y los archivos abiertos.
2. **Entender el alcance:** Usar `grep_search` para ubicar relaciones (e.g. ¿quién llama a `PlayerCard`?).
3. **Ejecutar o Codificar:** Crear los cambios en UI o enviar comandos nativos de reparación.
4. **Verificar:** Confirmar o pedir al usuario compilación local / feedback de renderizado.
