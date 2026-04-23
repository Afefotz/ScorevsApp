# Enhanced Floating Bubble Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Refactor the Android native floating bubble to be reactive to the room's theme, including gestures like pinch-to-zoom, snap-to-edge, and drag-to-dismiss.

**Architecture:** Extend the CONFIG JSON payload from JS with comprehensive theme tokens. The Android service detects theme changes to perform a "force remount" of the View, applying styles dynamically in Kotlin. Gestures are handled via a unified `OnTouchListener` and `ScaleGestureDetector`.

**Tech Stack:** React Native (TypeScript), Android Native (Kotlin, XML), SharedPreferences, WindowManager.

---

### Task 1: ScoreOverlayWrapper.ts Schema Extension

**Files:**
- Modify: `d:\Dv\ScorevsApp\src\services\ScoreOverlayWrapper.ts`

- [x] **Step 1: Update OverlayConfig interface**
Add the new theme tokens to the `themeConfig` property.

```typescript
export interface OverlayConfig {
  roomId: string;
  p1: { name: string; score: number; photo?: string | null };
  p2: { name: string; score: number; photo?: string | null };
  showPhotos: boolean;
  themeConfig: {
    background: string;
    text: string;
    primary: string;
    border: string;           // NEW
    hasBevel: boolean;
    hasScanlines: boolean;
    themeId: string;          // NEW
    imageShape: "circle" | "rounded-square" | "bevel-square"; // NEW
    fontMono: boolean;        // NEW
    scanlinesColor: string;   // NEW
    scaleFactor: number;      // NEW
  };
}
```

- [ ] **Step 2: Commit**
```bash
git add src/services/ScoreOverlayWrapper.ts
git commit -m "feat(overlay): extend theme tokens schema"
```

---

### Task 2: Neutralize bubble_layout.xml

**Files:**
- Modify: `d:\Dv\ScorevsApp\android\app\src\main\res\layout\bubble_layout.xml`

- [x] **Step 1: Remove hardcoded button and styles**
Delete the `btn_close` button and clean up any hardcoded background/padding that will be managed by code. Ensure all containers have IDs for Kotlin binding.

```xml
<?xml version="1.0" encoding="utf-8"?>
<LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
    android:id="@+id/overlay_root"
    android:layout_width="wrap_content"
    android:layout_height="wrap_content"
    android:orientation="vertical"
    android:elevation="8dp">

    <!-- Content Area -->
    <LinearLayout
        android:id="@+id/content_area"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:orientation="horizontal"
        android:gravity="center"
        android:padding="8dp">

        <!-- Player 1 -->
        <LinearLayout
            android:id="@+id/p1_container"
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:orientation="vertical"
            android:gravity="center"
            android:padding="8dp">
            
            <ImageView
                android:id="@+id/iv_p1"
                android:layout_width="64dp"
                android:layout_height="64dp"
                android:scaleType="centerCrop"
                android:layout_marginBottom="4dp" />

            <TextView
                android:id="@+id/tv_p1_name"
                android:layout_width="wrap_content"
                android:layout_height="wrap_content"
                android:textSize="14sp"
                android:layout_marginBottom="4dp" />

            <TextView
                android:id="@+id/tv_p1_score"
                android:layout_width="wrap_content"
                android:layout_height="wrap_content"
                android:textSize="28sp"
                android:textStyle="bold"
                android:layout_marginBottom="8dp" />

            <LinearLayout
                android:id="@+id/p1_controls"
                android:layout_width="wrap_content"
                android:layout_height="wrap_content"
                android:orientation="horizontal">
                <Button
                    android:id="@+id/btn_p1_minus"
                    android:layout_width="44dp"
                    android:layout_height="44dp"
                    android:text="-"
                    android:textSize="18sp"
                    android:layout_marginEnd="4dp" />
                <Button
                    android:id="@+id/btn_p1_plus"
                    android:layout_width="44dp"
                    android:layout_height="44dp"
                    android:text="+"
                    android:textSize="18sp" />
            </LinearLayout>
        </LinearLayout>

        <TextView
            android:id="@+id/tv_vs"
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:text="VS"
            android:textSize="18sp"
            android:paddingHorizontal="16dp" />

        <!-- Player 2 (Mirror) -->
        <LinearLayout
            android:id="@+id/p2_container"
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:orientation="vertical"
            android:gravity="center"
            android:padding="8dp">
            <ImageView android:id="@+id/iv_p2" android:layout_width="64dp" android:layout_height="64dp" android:scaleType="centerCrop" android:layout_marginBottom="4dp" />
            <TextView android:id="@+id/tv_p2_name" android:layout_width="wrap_content" android:layout_height="wrap_content" android:textSize="14sp" android:layout_marginBottom="4dp" />
            <TextView android:id="@+id/tv_p2_score" android:layout_width="wrap_content" android:layout_height="wrap_content" android:textSize="28sp" android:textStyle="bold" android:layout_marginBottom="8dp" />
            <LinearLayout android:layout_width="wrap_content" android:layout_height="wrap_content" android:orientation="horizontal">
                <Button android:id="@+id/btn_p2_minus" android:layout_width="44dp" android:layout_height="44dp" android:text="-" android:textSize="18sp" android:layout_marginEnd="4dp" />
                <Button android:id="@+id/btn_p2_plus" android:layout_width="44dp" android:layout_height="44dp" android:text="+" android:textSize="18sp" />
            </LinearLayout>
        </LinearLayout>

    </LinearLayout>
</LinearLayout>
```

- [ ] **Step 2: Commit**
```bash
git add android/app/src/main/res/layout/bubble_layout.xml
git commit -m "style(bubble): neutralize XML layout for dynamic theming"
```

---

### Task 3: FloatingScoreService.kt Refactor - Base & Theme Logic

**Files:**
- Modify: `d:\Dv\ScorevsApp\android\app\src\main\java\com\scorevsapp\FloatingScoreService.kt`

- [x] **Step 1: Add instance variables and basic methods**
Define `currentThemeId`, `scaleFactor`, and the `remountView` skeletal logic.

```kotlin
private var currentThemeId: String? = null
private var scaleFactor: Float = 1.0f

private fun remountView(config: JSONObject) {
    if (isViewAttached) {
        windowManager.removeView(floatingView)
    }
    floatingView = LayoutInflater.from(this).inflate(R.layout.bubble_layout, null)
    applyThemeTokens(config)
    setupTouchHandlers()
    windowManager.addView(floatingView, params)
    isViewAttached = true
    
    val themeConfig = config.getJSONObject("themeConfig")
    currentThemeId = themeConfig.optString("themeId")
}
```

- [x] **Step 2: Implement applyThemeTokens**
Map the JSON tokens to Android View properties (Colors, Typeface, Drawables).

```kotlin
private fun applyThemeTokens(config: JSONObject) {
    val theme = config.getJSONObject("themeConfig")
    val root = floatingView.findViewById<LinearLayout>(R.id.overlay_root)
    
    val bgColor = Color.parseColor(theme.getString("background"))
    val textColor = Color.parseColor(theme.getString("text"))
    val primaryColor = Color.parseColor(theme.getString("primary"))
    val borderColor = Color.parseColor(theme.optString("border", theme.getString("primary")))
    
    val bg = GradientDrawable().apply {
        setColor(bgColor)
        setStroke(4, borderColor)
        cornerRadius = if (theme.getString("imageShape") == "circle") 100f else 24f
    }
    root.background = bg
    
    // Set text colors
    listOf(R.id.tv_p1_name, R.id.tv_p2_name, R.id.tv_p1_score, R.id.tv_p2_score).forEach {
        floatingView.findViewById<TextView>(it).setTextColor(textColor)
    }
    floatingView.findViewById<TextView>(R.id.tv_vs).setTextColor(primaryColor)
    
    // Font Mono
    if (theme.optBoolean("fontMono", false)) {
        listOf(R.id.tv_p1_name, R.id.tv_p2_name, R.id.tv_p1_score, R.id.tv_p2_score).forEach {
            floatingView.findViewById<TextView>(it).typeface = Typeface.MONOSPACE
        }
    }
}
```

- [x] **Step 3: Update onStartCommand to handle remount**
Check if `themeId` changed to trigger `remountView`.

```kotlin
override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
    val configPayload = intent?.getStringExtra("CONFIG") ?: return START_NOT_STICKY
    val config = JSONObject(configPayload)
    val themeId = config.getJSONObject("themeConfig").optString("themeId")

    if (themeId != currentThemeId) {
        remountView(config)
    } else {
        updateUIFromConfig(configPayload)
    }

    return START_NOT_STICKY
}
```

- [ ] **Step 4: Commit**
```bash
git add android/app/src/main/java/com/scorevsapp/FloatingScoreService.kt
git commit -m "feat(bubble): implement reactive remount and theme application"
```

---

### Task 4: FloatingScoreService.kt - Gestures & Persistence

**Files:**
- Modify: `d:\Dv\ScorevsApp\android\app\src\main\java\com\scorevsapp\FloatingScoreService.kt`

- [x] **Step 1: Add ScaleGestureDetector**
Implement pinch-to-zoom logic.

```kotlin
private lateinit var scaleDetector: ScaleGestureDetector

private fun setupScaleDetector() {
    scaleDetector = ScaleGestureDetector(this, object : ScaleGestureDetector.SimpleOnScaleGestureListener() {
        override fun onScale(detector: ScaleGestureDetector): Boolean {
            scaleFactor *= detector.scaleFactor
            scaleFactor = Math.max(0.6f, Math.min(scaleFactor, 2.0f))
            floatingView.scaleX = scaleFactor
            floatingView.scaleY = scaleFactor
            return true
        }
        
        override fun onScaleEnd(detector: ScaleGestureDetector) {
            getSharedPreferences("bubble_prefs", MODE_PRIVATE).edit().putFloat("scale", scaleFactor).apply()
        }
    })
}
```

- [x] **Step 2: Update setupTouchHandlers for Drag & Snap**
Add dismiss zone detection and magnetic snapping.

```kotlin
private fun setupTouchHandlers() {
    val root = floatingView.findViewById<LinearLayout>(R.id.overlay_root)
    var initialX = 0; var initialY = 0
    var initialTouchX = 0f; var initialTouchY = 0f

    root.setOnTouchListener { v, event ->
        scaleDetector.onTouchEvent(event)
        
        when (event.action) {
            MotionEvent.ACTION_DOWN -> {
                initialX = params.x
                initialY = params.y
                initialTouchX = event.rawX
                initialTouchY = event.rawY
                // TODO: Show dismiss zone
                true
            }
            MotionEvent.ACTION_MOVE -> {
                params.x = initialX + (event.rawX - initialTouchX).toInt()
                params.y = initialY + (event.rawY - initialTouchY).toInt()
                windowManager.updateViewLayout(floatingView, params)
                true
            }
            MotionEvent.ACTION_UP -> {
                // TODO: Snap to edge
                // TODO: Check dismiss zone
                true
            }
            else -> false
        }
    }
}
```

- [x] **Step 3: Implement Snap to Edge Animation**
```kotlin
private fun snapToEdge() {
    val displayWidth = resources.displayMetrics.widthPixels
    val targetX = if (params.x < displayWidth / 2) 0 else displayWidth - floatingView.width
    
    ValueAnimator.ofInt(params.x, targetX).apply {
        duration = 250
        addUpdateListener { 
            params.x = it.animatedValue as Int
            windowManager.updateViewLayout(floatingView, params)
        }
        start()
    }
}
```

- [ ] **Step 4: Commit**
```bash
git add android/app/src/main/java/com/scorevsapp/FloatingScoreService.kt
git commit -m "feat(bubble): add pinch-to-zoom and snap-to-edge gestures"
```

---

### Task 5: Implementation of Dismiss Zone

**Files:**
- Modify: `d:\Dv\ScorevsApp\android\app\src\main\java\com\scorevsapp\FloatingScoreService.kt`
- Create: `android/app/src/main/res/layout/dismiss_zone_layout.xml`

- [x] **Step 1: Create dismiss zone layout**
```xml
<LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
    android:layout_width="match_parent"
    android:layout_height="100dp"
    android:gravity="center"
    android:background="@drawable/dismiss_gradient"
    android:orientation="vertical">
    <TextView
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:text="🗑 Arrastra aquí para cerrar"
        android:textColor="#FFFFFF"
        android:textStyle="bold" />
</LinearLayout>
```

- [x] **Step 2: Add Dismiss Zone to Service**
Initialize and handle visibility of the dismiss zone during drag.

- [x] **Step 3: Intersect Detection**
Stop service if bubble center is inside the dismiss zone on `ACTION_UP`.

- [x] **Step 4: Commit**
```bash
git add android/app/src/main/java/com/scorevsapp/FloatingScoreService.kt ...
git commit -m "feat(bubble): implement messenger-style drag-to-dismiss"
```

---

### Task 6: Final Verification

- [ ] **Step 1: Build and Run**
```bash
npx react-native run-android
```
- [ ] **Step 2: Verify Theme Change**
Open a room, change theme in settings, verify bubble remounts correctly.
- [ ] **Step 3: Verify Gestures**
Test pinch-to-zoom, snap-to-edge, and drag-to-dismiss.
- [ ] **Step 4: Verify Persistence**
Close overlay, reopen, and check if scale factor is preserved.
