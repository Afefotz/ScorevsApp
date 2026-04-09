# Especificación de Diseño: Configuración del Overlay para ScorevsApp

## 1. Visión General
Este documento detalla la implementación del sistema de configuración de overlays dentro del Dashboard de ScorevsApp. El objetivo es permitir a los usuarios modificar la apariencia del overlay que se muestra en OBS/Stream en tiempo real, utilizando un modal que se adapta al tema actual de la aplicación.

## 2. Requerimientos del Usuario
- **Interfaz:** Un botón en el dashboard abre un modal flotante.
- **Tematización:** El modal debe reflejar el estilo visual (colores, bordes) del tema activo en la aplicación.
- **Configuraciones:**
  - Selector de Tema del Overlay.
  - Selector Dinámico de Subtemas (Variantes): Solo visible si el tema tiene variaciones (ej. Metálico -> Oro, Plata, Bronce).
  - Control de Opacidad del fondo del overlay.
  - Interruptor de Orientación (Horizontal para Twitch, Vertical para TikTok/Reels).
- **Sincronización:** Los cambios deben persistir en Firebase Realtime Database bajo la ruta `/rooms/{roomId}/settings`.

## 3. Arquitectura de Datos y Componentes

### 3.1. Extensión del Sistema de Temas (`Themes.ts`)
Se actualizará el objeto `Themes` para incluir una propiedad opcional `variants`.
```typescript
'theme-metal': {
    background: '#2c3e50',
    primary: '#ffd700',
    text: '#fff',
    variants: [
        { id: 'steel', label: 'Acero', color: '#bdc3c7' },
        { id: 'gold', label: 'Oro', color: '#ffd700' },
        { id: 'bronze', label: 'Bronce', color: '#cd7f32' }
    ]
}
```

### 3.2. Componente de UI: `OverlaySettingsModal`
Ubicación: `src/ui/components/OverlaySettingsModal.tsx`
- **Props:** `isVisible`, `onClose`, `roomId`, `currentThemeKey`.
- **Estado Local:** Maneja los valores temporales antes de subirlos a Firebase o guarda directamente al cambiar.
- **Mejores Prácticas:**
  - Uso de `Pressable` con feedback visual para botones.
  - `useMemo` para estilos dinámicos basados en temas.
  - `useCallback` para estabilizar los manejadores de eventos.

## 4. Flujo de Trabajo
1. El usuario presiona el icono de engranaje (⚙️) en `DashboardScreen`.
2. Se abre el `OverlaySettingsModal`.
3. El modal lee la configuración actual de `/rooms/{roomId}/settings`.
4. Al modificar un valor, se llama a `dbService.updateSettings(roomId, newSettings)`.
5. El overlay (web) escucha estos cambios y se actualiza instantáneamente.

## 5. Plan de Verificación
- **Prueba Funcional:** Abrir el modal, cambiar de "Horizontal" a "Vertical" y verificar que el valor cambie en Firebase.
- **Prueba de UI:** Cambiar el tema global de la app y verificar que el modal adopte los nuevos colores.
- **Prueba de Variantes:** Seleccionar "Metálico" y confirmar que aparece el selector de Oro/Plata/Bronce; luego seleccionar "Win95" y confirmar que desaparece.
