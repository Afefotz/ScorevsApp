# Especificación de Diseño: Copiado de Link de Sala (OBS)

**Fecha:** 2026-04-19
**Estado:** Borrador (Pendiente de aprobación)
**Tema:** Añadir funcionalidad de visualización y copiado del link de la sala para integración con OBS Studio (Streaming) en el modal de ajustes.

## 1. Objetivo
Facilitar a los usuarios el acceso al link de overlay de su sala directamente desde la aplicación móvil, permitiendo copiarlo al portapapeles con un solo toque para pegarlo en fuentes de red de aplicaciones de streaming (ej. OBS Studio).

## 2. Requerimientos
- Mostrar el link completo con la estructura: `https://scorevs.vercel.app/overlay.html?room=${roomId}`.
- El link debe estar en un campo visualmente similar a los inputs del tema actual.
- Label: "LINK PARA STREAMING".
- Botón dedicado de "COPIAR" con feedback visual ("¡LISTO!") tras la acción.
- Respetar los 8 temas actuales (Win95, Neon, Metal, Modern, Modern Light, Pastel, Stone, Paper).

## 3. Arquitectura y Componentes

### 3.1 Nueva Dependencia
- `@react-native-clipboard/clipboard`: Necesaria para la interacción nativa con el portapapeles.

### 3.2 Modificaciones en `OverlaySettingsModal.tsx`
- **Estado Nuevo:** `copied` (boolean) con un temporizador de 2 segundos.
- **Lógica de Construcción:** El link se genera dinámicamente usando la prop `roomId`.
- **UI:** 
    - Inserción de una nueva sección `View` al final del `ScrollView`.
    - Uso de `TextInput` con `editable={false}` para asegurar que el link sea seleccionable pero no editable accidentalmente.
    - `Pressable` para la acción de copiado.

## 4. Diseño Visual (Tokens de Temas)
- **Win95:** El input mantendrá el efecto de bisel "engraved" (hundido).
- **Neon:** El input y el botón conservarán los efectos de sombra y resplandor (glow).
- **General:** Se utilizarán las constantes `tk.primary`, `tk.background`, `tk.text` e `tk.inputBg` para garantizar coherencia total.

## 5. Plan de Verificación
1. **Visual:** Abrir el modal en distintos temas y verificar que la sección del link se adapta correctamente.
2. **Funcional:** Presionar "COPIAR" y verificar:
   - Cambio de texto a "¡LISTO!".
   - El link correcto está en el portapapeles del sistema.
   - Retorno al texto "COPIAR" tras 2 segundos.
