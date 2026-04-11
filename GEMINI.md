# 🤖 ScorevsApp Agent Blueprint (GEMINI.md)

## 📌 Visión General del Proyecto
Eres el Agente Principal de Desarrollo para **ScorevsApp**, una aplicación construida en React Native orientada a la gestión de puntuaciones, perfiles, estadísticas y temas (evidenciado por componentes como `DashboardScreen` y `PlayerCard`).

## 🎯 Objetivos Principales
1. **Desarrollo Frontend Robusto:** Construir y mantener una interfaz de usuario atractiva, rápida y funcional utilizando React Native y TypeScript.
2. **Arquitectura Escalable y Limpia:** Fomentar un código bien estructurado apoyándose en el directorio `src/ui/` para separar lógicamente `components` y `screens`.
3. **Sistema de Temas Centralizado:** Utilizar `src/config/Themes.ts` como fuente única de verdad con tokens granulares (bordes, elevación, flags semánticos como `hasBevel`).
4. **Temas Dinámicos y Variantes:** Implementar un sistema de temas y sub-variantes (ej: Metal: Oro, Plata) que permita cambiar la apariencia de la aplicación y el overlay en tiempo real mediante el hook `useTheme`.
5. **Control Maestro de Overlay:** Facilitar la configuración granular del overlay a través de componentes interactivos como Sliders personalizados y Modales.
6. **Gestión de Acceso y Validación:** Validar la existencia de salas en Firebase antes de permitir el acceso. Sanitizar entradas (alfanumérico, minúsculas) y limitar IDs de sala a 4 caracteres.
7. **Sincronización de Datos Proactiva:** Utilizar suscripciones unificadas a la raíz de la sala para garantizar que todos los componentes se actualicen de forma atómica y reactiva.
8. **Optimización de UI/UX:** Garantizar que los componentes visuales sean consistentes y brinden una experiencia premium con micro-interacciones (ej: `LayoutAnimation` en cambios de tema).

## 🧠 Directrices de Comportamiento del Agente
- **Priorizar TypeScript:** Usar un tipado estricto en todas las interfaces, especialmente en `ThemeConfig`.
- **Uso de useTheme:** Consumir siempre el hook `src/hooks/useTheme.ts` para resolver estilos dinámicos en componentes y pantallas.
- **Componentes Temáticos Atómicos:** Mover primitivas visuales complejas (biseles Win95, scanlines Neon) a `src/ui/components/themed/`.
- **Gestión de Re-renders:** Evitar `React.memo` en sub-componentes que consumen objetos de tema estables (como `Themes[key]`) si esto impide la actualización visual inmediata.
- **Precaución con LayoutAnimation:** No combinar `LayoutAnimation.create` (específicamente `opacity`) con remounts de componentes (cambios de `key`) en Android para evitar elementos invisibles.
- **Suscripción Única por Pantalla:** Mantener un único listener a la raíz de la sala para asegurar coherencia de datos.
- **Mapeo de Valores Seguro:** Implementar rangos de seguridad para valores críticos (ej: Opacidad mapeada de 0-100 UI a 65-100 DB).
- **Sanitización de Datos:** Asegurar que todo ID de sala o usuario sea filtrado (regex `[^a-zA-Z0-9]`) y convertido a minúsculas.

## Stack Tecnológico
- **Frontend:** React Native (Hooks, Context/Props para estado centralizado).
- **Backend/BaaS:** Firebase Realtime Database.
- **Estilos:** StyleSheet / Sistema de Tokens Centralizado (`Themes.ts`).

## 📂 Organización Actual
- `src/ui/components/`: Componentes modulares reutilizables (`PlayerCard`, `ScreenWrapper`).
- `src/ui/components/themed/`: Primitivas visuales específicas por tema (`Win95Parts`, `NeonParts`).
- `src/ui/screens/`: Pantallas completas (`LoginScreen`, `DashboardScreen`).
- `src/hooks/`: Hooks personalizados (`useTheme.ts`).
- `src/services/`: Lógica de comunicación externa (`DatabaseService.ts`).
- `src/config/`: Configuraciones globales y tokens de diseño (`Themes.ts`).
- `App.tsx`: Orquestador principal de sesión y navegación.
- `docs/`: Documentación técnica y esquemas JSON.
