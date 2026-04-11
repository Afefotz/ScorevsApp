# Especificación de Diseño: Sincronización de Temas en Tiempo Real (Firebase)

**Fecha:** 2026-04-11
**Estado:** Pendiente de Revisión
**Tema:** Implementación de sincronización dinámica del tema entre el Modal de Ajustes y el Dashboard.

## 1. Problema
Actualmente, el tema de la aplicación se selecciona en el `LoginScreen` y se pasa como una prop estática (`theme`) al `DashboardScreen`. Aunque el `OverlaySettingsModal` permite cambiar el tema en Firebase, el `DashboardScreen` y sus componentes hijos (`PlayerCard`) no reaccionan a este cambio porque dependen de la prop inicial.

## 2. Objetivo
Lograr que toda la interfaz del Dashboard responda en tiempo real a los cambios de tema realizados en el modal o por otros usuarios en la misma sala, utilizando Firebase como la fuente única de verdad.

## 3. Arquitectura Propuesta (Enfoque A)

### 3.1. Flujo de Datos
1.  **DashboardScreen** observa la raíz de la sala en Firebase vía `dbService.listenToRoom`.
2.  Cada actualización de datos contiene el objeto `settings.theme`.
3.  El `DashboardScreen` resuelve el "Tema Activo":
    *   Prioridad 1: `roomData.settings.theme` (Si existe y es válido).
    *   Prioridad 2: `theme` (Prop de navegación/caché local).
4.  El `activeTheme` se distribuye hacia abajo:
    *   `useTheme(activeTheme)` para los estilos del Dashboard.
    *   `PlayerCard(theme={activeTheme})`.
    *   `OverlaySettingsModal(currentThemeKey={activeTheme})`.

### 3.2. Sincronización Local (AsyncStorage)
Para mantener la consistencia entre sesiones:
*   Se añadirá un `useEffect` en `DashboardScreen` que observe cambios en el tema proveniente de Firebase.
*   Al detectar un cambio, se actualizará `AsyncStorage.setItem('@versus_selected_theme', newTheme)` de forma silenciosa.

## 4. Componentes Afectados

### 4.1. DashboardScreen.tsx
*   **Lógica de Derivación:** Añadir `const activeTheme = (roomData?.settings?.theme as ThemeKey) || theme;`.
*   **Seguridad:** Validar que `activeTheme` existe en `Themes`.
*   **Distribución:** Actualizar las llamadas a `useTheme`, `PlayerCard` y `OverlaySettingsModal`.

### 4.2. OverlaySettingsModal.tsx
*   Asegurar que el selector visual refleje el estado de Firebase inmediatamente.
*   Actualizar `useTheme(currentThemeKey)` para que el propio modal cambie de apariencia junto con el resto de la app.

## 5. Consideraciones Tecnológicas
*   **Rendimiento:** El hook `useTheme` usa `useMemo`, por lo que cambiar la `key` es eficiente.
*   **UX:** El uso de `LayoutAnimation` (ya presente en el selector) suavizará la transición visual entre temas.
*   **Escalabilidad:** Al no usar condicionales `if(theme === 'neon')`, añadir un tema nuevo a `Themes.ts` es suficiente para soportarlo globalmente.

## 6. Revisión de Seguridad
*   Sanitización del string de tema proveniente de Firebase para evitar crashes si se introduce una clave inexistente.
