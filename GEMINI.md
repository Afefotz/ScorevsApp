# 🤖 ScorevsApp Agent Blueprint (GEMINI.md)

## 📌 Visión General del Proyecto
Eres el Agente Principal de Desarrollo para **ScorevsApp**, una aplicación construida en React Native orientada a la gestión de puntuaciones, perfiles, estadísticas y temas (evidenciado por componentes como `DashboardScreen` y `PlayerCard`).

## 🎯 Objetivos Principales
1. **Desarrollo Frontend Robusto:** Construir y mantener una interfaz de usuario atractiva, rápida y funcional utilizando React Native y TypeScript.
2. **Arquitectura Escalable y Limpia:** Fomentar un código bien estructurado apoyándose en el directorio `src/ui/` para separar lógicamente `components` y `screens`.
3. **Sistema de Temas Centralizado:** Utilizar `src/config/Themes.ts` como fuente única de verdad con tokens granulares (bordes, elevación, flags semánticos como `hasBevel`).
4. **Temas Dinámicos y Diccionario Web:** Implementar el catálogo de 8 temas principales (Win95, Neon, Metal, Modern, Modern Light, Pastel, Stone, Paper). Las variantes ("id") enviadas a Firebase deben coincidir cadena por cadena (ej. "Acero Plateado") con el diccionario web `paletasDeColor` de OBS.
5. **Inmersión Tipográfica Reactiva:** Asegurar que cada tema y variante aplique sus propios tokens de tipografía (`fontFamily`, `textTransform`, `textShadow`) de forma atómica y reactiva.
6. **Control Maestro de Overlay:** Facilitar la configuración granular del overlay a través de componentes interactivos como Sliders personalizados y Modales, atando las opciones disponibles al tema vivo de la sala.
7. **Gestión Atómica de Salas (Crear vs Unirse):** En modo "Crear", una nueva sala empuja inicialmente sus tokens de diseño (`themeDefaults`) a la base de datos. En modo "Unirse", **se debe hidratar (recuperar) primero el tema existente de Firebase** y cargarlo para no corromper la pantalla en uso y evitar "residuos" visuales.
8. **Sincronización de Datos Proactiva:** Utilizar suscripciones unificadas a la raíz de la sala para garantizar que todos los componentes se actualicen de forma atómica y reactiva.
9. **Optimización de UI/UX:** Garantizar que los componentes visuales sean consistentes y brinden una experiencia premium.
10. **Marcador Flotante (OOB Overlay):** Soporte nativo y reactivo para mantener la interacción del marcador a través de una burbuja flotante o Picture-in-Picture.
11. **Gesto de Retorno Inteligente:** Implementación de gestos avanzados (Double Tap) en la capa nativa para re-enfocar la aplicación y destruir el overlay de forma elegante.
12. **Compatibilidad Híbrida (Web/App):** Garantizar paridad total entre los ajustes de la web (OBS) y la app mediante la normalización de tokens de variantes.

## 🧠 Directrices de Comportamiento del Agente
- **Priorizar TypeScript:** Usar un tipado estricto en todas las interfaces, especialmente en `ThemeConfig` (incluyendo tokens de tipografía obligatorios).
- **Uso de useTheme:** Consumir siempre el hook `src/hooks/useTheme.ts` para resolver estilos dinámicos en componentes y pantallas.
- **Patrón de Re-montado Clean:** Usar el atributo `key` vinculado a `${theme}-${variant}` en contenedores principales de pantallas para forzar un re-montado limpio al cambiar de tema, eliminando residuos visuales de la plataforma.
- **Componentes Temáticos Atómicos:** Mover primitivas visuales complejas (biseles Win95, scanlines Neon, texto grabado) a `src/ui/components/themed/`.
- **Gestión de Re-renders:** Evitar `React.memo` en sub-componentes que consumen objetos de tema estables (como `Themes[key]`) si esto impide la actualización visual inmediata.
- **Precaución con LayoutAnimation:** No combinar `LayoutAnimation.create` (específicamente `opacity`) con remounts de componentes (cambios de `key`) en Android para evitar elementos invisibles.
- **Suscripción Única por Pantalla:** Mantener un único listener a la raíz de la sala para asegurar coherencia de datos.
- **Mapeo de Valores Seguro:** Implementar rangos de seguridad para valores críticos (ej: Opacidad mapeada de 0-100 UI a 65-100 DB).
- **Sanitización de Datos:** Asegurar que todo ID de sala o usuario sea filtrado (regex `[^a-zA-Z0-9]`) y convertido a minúsculas.
- **Gestión de Overlay Nativo:** Actualizar optimísticamente la interfaz nativa del `FloatingScoreModule` para evitar retrasos de sincronización. El servicio nativo debe usar `parseColorSafe` para manejar formatos CSS (`rgba`, `rgb`) sin crasheos.
- **Normalización de Datos en DB:** Utilizar `normalizeSettings` en `DatabaseService.ts` para mapear `theme_variant` (Web) a `variant` (App) de forma transparente, asegurando reactividad en cambios remotos.
- **Doble Tap Foreground:** El overlay nativo debe implementar un `GestureDetector` que dispare el `launchIntentForPackage` al detectar un doble toque, cerrando el servicio con `stopSelf()` tras la transición.

## Stack Tecnológico
- **Frontend:** React Native (Hooks, Context/Props para estado centralizado).
- **Backend/BaaS:** Firebase Realtime Database.
- **Estilos:** StyleSheet / Sistema de Tokens Centralizado (`Themes.ts`).

## 📂 Organización Actual
- `src/ui/components/`: Componentes modulares reutilizables (`PlayerCard`, `ScreenWrapper`).
- `src/ui/components/themed/`: Primitivas visuales específicas por tema (`EngravedText`, `NeonParts`, `ThemeEngine`).
- `src/ui/screens/`: Pantallas completas (`LoginScreen`, `DashboardScreen`).
- `src/hooks/`: Hooks personalizados (`useTheme.ts`).
- `src/services/`: Lógica de comunicación externa (`DatabaseService.ts`, `ScoreOverlayWrapper.ts`).
- `src/config/`: Configuraciones globales y tokens de diseño (`Themes.ts`).
- `android/app/src/main/`: Código y layout nativo de Android (Kotlin/XML) para servicios como `FloatingScoreService`.
- `App.tsx`: Orquestador principal de sesión y navegación.
- `docs/`: Documentación técnica y esquemas JSON.