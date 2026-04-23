# Floating Bubble Enhanced — Design Spec
**Fecha:** 2026-04-21  
**Archivos target:** `FloatingScoreService.kt`, `FloatingScoreModule.kt`, `bubble_layout.xml`, `ScoreOverlayWrapper.ts`

---

## Resumen

Refactor del overlay flotante nativo de Android para:
1. Hacer el layout **reactivo al tema activo** de la sala (tokens de `ThemeConfig`)
2. Reemplazar el botón Close por **Drag-to-Dismiss** estilo Messenger
3. Añadir **Pinch-to-Zoom** con límites y persistencia
4. Implementar **snap magnético** a bordes de pantalla
5. Adaptar la **forma de las imágenes de jugador** al tema

El enfoque elegido es **Enfoque C**: tokens en CONFIG JSON + recreación de View al cambiar de tema (force remount en Kotlin).

---

## 1. Arquitectura y Flujo de Datos

```
useTheme (JS)  →  ScoreOverlayWrapper.ts  →  FloatingScoreService.kt
                       (CONFIG JSON)              (onStartCommand)
                                                       │
                                              ¿themeId cambió?
                                              ├── SÍ → destroyView()
                                              │         inflateFreshView()
                                              │         applyThemeTokens()
                                              │         setupTouchHandlers()
                                              │         reattachToWindowManager()
                                              └── NO → updateUIFromConfig()
```

- `ScoreOverlayWrapper.ts` extiende el `OverlayConfig` con los nuevos campos de tema.
- `FloatingScoreService.kt` mantiene `currentThemeId: String?` como variable de instancia.
- Al detectar un cambio de `themeId`, destruye la `floatingView` actual y la reinflata desde cero, preservando `params` (posición x/y) y `scaleFactor` (zoom).

---

## 2. Schema de Tokens — CONFIG JSON Extendido

### TypeScript (`ScoreOverlayWrapper.ts`)

```typescript
export interface OverlayConfig {
  roomId: string;
  p1: { name: string; score: number; photo?: string | null };
  p2: { name: string; score: number; photo?: string | null };
  showPhotos: boolean;
  themeConfig: {
    // Existentes
    background:     string;   // "#1a1a2e"
    text:           string;   // "#FFFFFF"
    primary:        string;   // "#4f8ef7"
    border:         string;   // color del borde exterior
    hasBevel:       boolean;
    hasScanlines:   boolean;

    // Nuevos
    themeId:        string;   // "theme-win95" | "theme-neon" | "theme-metal" | ...
    imageShape:     "circle" | "rounded-square" | "bevel-square";
    fontMono:       boolean;
    scanlinesColor: string;   // color ARGB del overlay (ej. "#2200FF41")
    scaleFactor:    number;   // último zoom guardado, default 1.0
  };
}
```

### Mapeo por tema

| Tema            | `imageShape`      | `hasBevel` | `hasScanlines` | `fontMono` |
|-----------------|-------------------|-----------|----------------|-----------|
| Win95           | `bevel-square`    | ✅        | ❌             | ✅        |
| Neon            | `bevel-square`    | ❌        | ✅             | ❌        |
| Laser           | `bevel-square`    | ❌        | ✅             | ❌        |
| Metal           | `rounded-square`  | ✅        | ❌             | ❌        |
| Stone           | `rounded-square`  | ✅        | ❌             | ❌        |
| Modern          | `circle`          | ❌        | ❌             | ❌        |
| Modern Light    | `circle`          | ❌        | ❌             | ❌        |
| Pastel          | `circle`          | ❌        | ❌             | ❌        |
| Paper           | `circle`          | ❌        | ❌             | ❌        |

---

## 3. Touch Handling

Tres gestos coexisten en el mismo `OnTouchListener`. Sin conflicto: `ScaleGestureDetector` consume eventos multi-touch; con un solo dedo, el drag toma control.

### 3a — Drag (mover la burbuja)
- `ACTION_DOWN` → captura posición inicial; **muestra la dismiss-zone** (slide-up + fade-in, 200ms)
- `ACTION_MOVE` → actualiza `params.x / params.y` via `WindowManager.updateViewLayout`
- `ACTION_UP` / `ACTION_CANCEL` → **snap magnético** al borde más cercano (izquierda o derecha); oculta la dismiss-zone (slide-down + fade-out, 200ms)
- Si en `ACTION_UP` el centro de `floatingView` intersecta el rectángulo de la dismiss-zone → `stopSelf()`

### 3b — Pinch-to-Zoom (`ScaleGestureDetector`)
```kotlin
override fun onScale(detector: ScaleGestureDetector): Boolean {
    scaleFactor = (scaleFactor * detector.scaleFactor).coerceIn(0.6f, 2.0f)
    floatingView.scaleX = scaleFactor
    floatingView.scaleY = scaleFactor
    return true
}
override fun onScaleEnd(detector: ScaleGestureDetector) {
    // Persiste en SharedPreferences nativas del servicio
    getSharedPreferences("bubble_prefs", Context.MODE_PRIVATE)
        .edit().putFloat("bubble_scale", scaleFactor).apply()
}
```

### 3c — Snap magnético
```kotlin
fun snapToEdge() {
    val displayWidth = windowManager.currentWindowMetrics.bounds.width()
    val targetX = if (params.x < displayWidth / 2) 0 else displayWidth - floatingView.width
    val animator = ValueAnimator.ofInt(params.x, targetX).apply {
        duration = 250
        interpolator = DecelerateInterpolator()
        addUpdateListener {
            params.x = it.animatedValue as Int
            if (isViewAttached) windowManager.updateViewLayout(floatingView, params)
        }
    }
    animator.start()
}
```

### 3d — Dismiss Zone
- View separada añadida al `WindowManager` con `Gravity.BOTTOM or Gravity.CENTER_HORIZONTAL`, posición fija
- `alpha = 0f`, `translationY = 100dp` por defecto (invisible)
- Al iniciar drag: `dismissZone.animate().alpha(1f).translationY(0f).setDuration(200).start()`
- Al soltar: `dismissZone.animate().alpha(0f).translationY(100f.dp).setDuration(200).start()`
- Contenido: ícono de papelera + texto "Arrastra aquí para cerrar"

---

## 4. Layout Reactivo — `bubble_layout.xml` y `applyThemeTokens()`

### Nuevo `bubble_layout.xml`
Estructura neutral sin colores ni estilos hardcodeados. Se elimina `btn_close`. Se añaden IDs necesarios:

```
overlay_root (LinearLayout, vertical)
  └── content_area (LinearLayout, horizontal)
        ├── player_1_container (LinearLayout, vertical)
        │     ├── iv_p1 (ImageView)
        │     ├── tv_p1_name (TextView)
        │     ├── tv_p1_score (TextView)
        │     └── controls_row (LinearLayout, horizontal)
        │           ├── btn_p1_minus
        │           └── btn_p1_plus
        ├── tv_vs (TextView)
        └── player_2_container (espejo de player_1)
              ├── iv_p2
              ├── tv_p2_name
              ├── tv_p2_score
              └── (btn_p2_minus, btn_p2_plus)
```

### `applyThemeTokens()` — tabla de efectos

| Token              | Efecto en la View                                                                 |
|--------------------|-----------------------------------------------------------------------------------|
| `background`       | `GradientDrawable.setColor(bgColor)`                                              |
| `border`           | `GradientDrawable.setStroke(3dp, borderColor)`                                    |
| `hasBevel`         | `LayerDrawable` con bordes superiores blancos e inferiores grises                 |
| `hasScanlines`     | View overlay semi-transparente con `Paint` de líneas horizontales cada 4dp        |
| `scanlinesColor`   | Color ARGB del `Paint` de scanlines                                               |
| `imageShape: circle`         | `iv.clipToOutline = true` + `ShapeAppearance` circular                |
| `imageShape: rounded-square` | `cornerRadius = 12dp` en drawable del ImageView                       |
| `imageShape: bevel-square`   | `cornerRadius = 0` + borde biselado doble (`LayerDrawable`)           |
| `fontMono`         | `tv.typeface = Typeface.MONOSPACE`                                                |
| `primary`          | Color de botones +/- y `tv_vs`                                                    |
| `text`             | Color de `tv_p1_name`, `tv_p2_name`, `tv_p1_score`, `tv_p2_score`                |

### Force Remount
```kotlin
private fun remountView(config: JSONObject) {
    if (isViewAttached) windowManager.removeView(floatingView)
    floatingView = LayoutInflater.from(this).inflate(R.layout.bubble_layout, null)
    applyThemeTokens(config)
    setupTouchHandlers()          // ScaleGestureDetector se adjunta a la nueva View
    windowManager.addView(floatingView, params)  // params preserva x/y y scaleFactor
    isViewAttached = true
    currentThemeId = config.getJSONObject("themeConfig").getString("themeId")
}
```

---

## 5. Persistencia de Escala

- **Escritura:** `SharedPreferences("bubble_prefs")` → clave `bubble_scale` (Float), escrita en `onScaleEnd`
- **Lectura:** al iniciar el servicio, `scaleFactor` se inicializa desde `SharedPreferences` (default `1.0f`)
- **Envío a JS:** el `scaleFactor` actual se incluye en el CONFIG de respuesta cuando JS llama `updateOverlay`, para que `ScoreOverlayWrapper` pueda sincronizarlo si es necesario

---

## 6. Archivos Modificados

| Archivo | Tipo de cambio |
|---|---|
| `ScoreOverlayWrapper.ts` | Ampliar `OverlayConfig.themeConfig` con los nuevos tokens |
| `FloatingScoreService.kt` | Remount lógic, touch handlers, snap, dismiss zone, applyThemeTokens |
| `bubble_layout.xml` | Eliminar `btn_close`, neutralizar estilos hardcodeados |
| `FloatingScoreModule.kt` | Sin cambios (la interfaz JS→Kotlin ya es suficiente) |

---

## 7. Plan de Verificación

- **Unit / manual:** Cambiar tema desde la UI de la sala → verificar que la burbuja se remonta visualmente sin residuos
- **Gestos:** Probar pinch-to-zoom y verificar clamp en 0.6× y 2.0×; verificar persistencia tras cerrar y reabrir la burbuja
- **Dismiss:** Arrastrar hasta la zona inferior → el servicio debe detenerse y la burbuja desaparecer
- **Snap:** Soltar la burbuja en el centro → debe animar hacia el borde más cercano
- **Fotos:** Con `showPhotos: true`, verificar que cada `imageShape` aplica correctamente por tema
