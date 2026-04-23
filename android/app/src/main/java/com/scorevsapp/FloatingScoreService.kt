package com.scorevsapp

import android.animation.ValueAnimator
import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.Service
import android.content.Context
import android.content.Intent
import android.graphics.Color
import android.graphics.PixelFormat
import android.graphics.Typeface
import android.graphics.drawable.GradientDrawable
import android.graphics.drawable.LayerDrawable
import android.graphics.BitmapFactory
import android.util.Base64
import android.os.Build
import android.os.IBinder
import android.view.GestureDetector
import android.view.Gravity
import android.view.LayoutInflater
import android.view.MotionEvent
import android.view.ScaleGestureDetector
import android.view.View
import android.view.WindowManager
import android.view.animation.DecelerateInterpolator
import android.widget.Button
import android.widget.ImageView
import android.widget.LinearLayout
import android.widget.TextView
import androidx.core.app.NotificationCompat
import org.json.JSONObject

class FloatingScoreService : Service() {

    private lateinit var windowManager: WindowManager
    private lateinit var floatingView: View
    private lateinit var dismissZone: View
    private lateinit var params: WindowManager.LayoutParams
    private lateinit var dismissParams: WindowManager.LayoutParams
    private lateinit var scaleDetector: ScaleGestureDetector
    private lateinit var gestureDetector: GestureDetector
    
    private var isViewAttached = false
    private var isDismissZoneAttached = false
    
    private var currentThemeId: String? = null
    private var scaleFactor: Float = 1.0f
    private var baseWidth = 0
    private var baseHeight = 0

    override fun onBind(intent: Intent?): IBinder? = null

    override fun onCreate() {
        super.onCreate()
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val channel = NotificationChannel(
                "floating_service",
                "Floating Score Service",
                NotificationManager.IMPORTANCE_LOW
            )
            val manager = getSystemService(NotificationManager::class.java)
            manager?.createNotificationChannel(channel)

            val notification = NotificationCompat.Builder(this, "floating_service")
                .setContentTitle("ScorevsApp Overlay")
                .setContentText("Marcador interactivo activado.")
                .setSmallIcon(R.mipmap.ic_launcher)
                .build()

            startForeground(1, notification)
        }

        windowManager = getSystemService(WINDOW_SERVICE) as WindowManager
        
        val layoutFlag = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            WindowManager.LayoutParams.TYPE_APPLICATION_OVERLAY
        } else {
            @Suppress("DEPRECATION")
            WindowManager.LayoutParams.TYPE_PHONE
        }

        params = WindowManager.LayoutParams(
            WindowManager.LayoutParams.WRAP_CONTENT,
            WindowManager.LayoutParams.WRAP_CONTENT,
            layoutFlag,
            WindowManager.LayoutParams.FLAG_NOT_FOCUSABLE,
            PixelFormat.TRANSLUCENT
        )
        params.gravity = Gravity.TOP or Gravity.START
        params.x = 0
        params.y = 100

        dismissParams = WindowManager.LayoutParams(
            WindowManager.LayoutParams.MATCH_PARENT,
            250, // aprox 100dp
            layoutFlag,
            WindowManager.LayoutParams.FLAG_NOT_FOCUSABLE or WindowManager.LayoutParams.FLAG_NOT_TOUCHABLE,
            PixelFormat.TRANSLUCENT
        )
        dismissParams.gravity = Gravity.BOTTOM or Gravity.CENTER_HORIZONTAL

        scaleFactor = getSharedPreferences("bubble_prefs", Context.MODE_PRIVATE).getFloat("bubble_scale", 1.0f)

        dismissZone = LayoutInflater.from(this).inflate(R.layout.dismiss_zone_layout, null)
        dismissZone.alpha = 0f
        dismissZone.translationY = 250f

        gestureDetector = GestureDetector(this, object : GestureDetector.SimpleOnGestureListener() {
            override fun onDoubleTap(e: MotionEvent): Boolean {
                handleDoubleTap()
                return true
            }
        })
    }

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        val configPayload = intent?.getStringExtra("CONFIG") ?: return START_NOT_STICKY
        
        try {
            val config = JSONObject(configPayload)
            val themeConfig = config.getJSONObject("themeConfig")
            val themeId = themeConfig.optString("themeId")

            if (themeId != currentThemeId || !isViewAttached) {
                remountView(config)
            } else {
                // Actualizar tanto los tokens visuales (colores/estilos) como los datos (nombres/puntos)
                applyThemeTokens(config)
                updateUIFromConfig(configPayload)
            }
        } catch (e: Exception) {
            e.printStackTrace()
        }

        return START_NOT_STICKY
    }

    private fun remountView(config: JSONObject) {
        if (isViewAttached && this::floatingView.isInitialized) {
            windowManager.removeView(floatingView)
        }
        
        floatingView = LayoutInflater.from(this).inflate(R.layout.bubble_layout, null)
        
        applyThemeTokens(config)
        updateUIFromConfig(config.toString())
        setupScaleDetector()
        setupTouchHandlers()

        // Initial setup for perfect scaling
        floatingView.post {
            if (isViewAttached) {
                val innerView = floatingView.findViewById<View>(R.id.overlay_root)
                innerView.measure(View.MeasureSpec.UNSPECIFIED, View.MeasureSpec.UNSPECIFIED)
                baseWidth = innerView.measuredWidth
                baseHeight = innerView.measuredHeight
                if (baseWidth > 0) {
                    // Freeze inner view size to prevent layout squishing when window shrinks
                    val lp = innerView.layoutParams
                    lp.width = baseWidth
                    lp.height = baseHeight
                    innerView.layoutParams = lp

                    // Apply visual scale
                    innerView.scaleX = scaleFactor
                    innerView.scaleY = scaleFactor
                    innerView.pivotX = 0f
                    innerView.pivotY = 0f

                    // Set window to exact scaled size
                    params.width = (baseWidth * scaleFactor).toInt()
                    params.height = (baseHeight * scaleFactor).toInt()
                    windowManager.updateViewLayout(floatingView, params)
                }
            }
        }

        windowManager.addView(floatingView, params)
        isViewAttached = true
        
        // Reset base dimensions
        baseWidth = 0
        baseHeight = 0
        
        currentThemeId = config.getJSONObject("themeConfig").optString("themeId")
    }

    private fun setupScaleDetector() {
        scaleDetector = ScaleGestureDetector(this, object : ScaleGestureDetector.SimpleOnScaleGestureListener() {
            override fun onScaleBegin(detector: ScaleGestureDetector): Boolean {
                if (baseWidth == 0 || baseHeight == 0) {
                    val innerView = floatingView.findViewById<View>(R.id.overlay_root)
                    innerView.measure(View.MeasureSpec.UNSPECIFIED, View.MeasureSpec.UNSPECIFIED)
                    baseWidth = innerView.measuredWidth
                    baseHeight = innerView.measuredHeight
                    
                    if (baseWidth > 0) {
                        val lp = innerView.layoutParams
                        lp.width = baseWidth
                        lp.height = baseHeight
                        innerView.layoutParams = lp
                    }
                }
                
                // Expand window to MAX size to prevent clipping during fast gestures
                if (baseWidth > 0 && baseHeight > 0 && isViewAttached) {
                    params.width = (baseWidth * 1.55f).toInt()
                    params.height = (baseHeight * 1.55f).toInt()
                    windowManager.updateViewLayout(floatingView, params)
                }
                return true
            }

            override fun onScale(detector: ScaleGestureDetector): Boolean {
                scaleFactor *= detector.scaleFactor
                scaleFactor = Math.max(0.7f, Math.min(scaleFactor, 1.5f))
                
                val innerView = floatingView.findViewById<View>(R.id.overlay_root)
                innerView.scaleX = scaleFactor
                innerView.scaleY = scaleFactor
                innerView.pivotX = 0f
                innerView.pivotY = 0f
                
                return true
            }

            override fun onScaleEnd(detector: ScaleGestureDetector) {
                // Tighten window to EXACT scaled size
                if (baseWidth > 0 && baseHeight > 0 && isViewAttached) {
                    params.width = (baseWidth * scaleFactor).toInt()
                    params.height = (baseHeight * scaleFactor).toInt()
                    windowManager.updateViewLayout(floatingView, params)
                }
                
                getSharedPreferences("bubble_prefs", Context.MODE_PRIVATE)
                    .edit()
                    .putFloat("bubble_scale", scaleFactor)
                    .apply()
            }
        })
    }

    private fun setupTouchHandlers() {
        val rootLayout = floatingView.findViewById<LinearLayout>(R.id.overlay_root)
        var initialX = 0
        var initialY = 0
        var initialTouchX = 0f
        var initialTouchY = 0f
        var isDragging = false

        rootLayout.setOnTouchListener { _, event ->
            gestureDetector.onTouchEvent(event)
            scaleDetector.onTouchEvent(event)
            
            if (scaleDetector.isInProgress) {
                return@setOnTouchListener true
            }

            when (event.actionMasked) {
                MotionEvent.ACTION_DOWN -> {
                    initialX = params.x
                    initialY = params.y
                    initialTouchX = event.rawX
                    initialTouchY = event.rawY
                    isDragging = false
                    true
                }
                MotionEvent.ACTION_MOVE -> {
                    val deltaX = event.rawX - initialTouchX
                    val deltaY = event.rawY - initialTouchY
                    
                    if (!isDragging && (Math.abs(deltaX) > 10 || Math.abs(deltaY) > 10)) {
                        isDragging = true
                        showDismissZone()
                    }
                    
                    if (isDragging) {
                        params.x = initialX + deltaX.toInt()
                        params.y = initialY + deltaY.toInt()
                        if (isViewAttached) {
                            windowManager.updateViewLayout(floatingView, params)
                        }
                    }
                    true
                }
                MotionEvent.ACTION_UP, MotionEvent.ACTION_CANCEL -> {
                    if (isDragging) {
                        isDragging = false
                        hideDismissZone()
                        
                        if (isOverDismissZone(event.rawX, event.rawY)) {
                            stopSelf()
                        } else {
                            snapToEdge()
                        }
                    }
                    true
                }
                else -> false
            }
        }
    }

    private fun showDismissZone() {
        if (!isDismissZoneAttached) {
            windowManager.addView(dismissZone, dismissParams)
            isDismissZoneAttached = true
        }
        dismissZone.animate().alpha(1f).translationY(0f).setDuration(200).start()
    }
    
    private fun hideDismissZone() {
        dismissZone.animate().alpha(0f).translationY(250f).setDuration(200).withEndAction {
            if (isDismissZoneAttached) {
                windowManager.removeView(dismissZone)
                isDismissZoneAttached = false
            }
        }.start()
    }
    
    private fun isOverDismissZone(rawX: Float, rawY: Float): Boolean {
        val displayHeight = windowManager.defaultDisplay.height
        return rawY > (displayHeight - 300)
    }

    private fun snapToEdge() {
        val displayWidth = resources.displayMetrics.widthPixels
        
        // Calculate the actual dynamic width of the bubble based on its current scale
        val currentWidth = if (baseWidth > 0) (baseWidth * scaleFactor).toInt() else floatingView.width
        
        // Calculate the center point of the bubble
        val bubbleCenterX = params.x + (currentWidth / 2)
        
        // Snap based on the bubble's center, not its top-left edge
        val targetX = if (bubbleCenterX < displayWidth / 2) 0 else displayWidth - currentWidth
        
        ValueAnimator.ofInt(params.x, targetX).apply {
            duration = 250
            interpolator = DecelerateInterpolator()
            addUpdateListener { 
                params.x = it.animatedValue as Int
                if (isViewAttached) {
                    windowManager.updateViewLayout(floatingView, params)
                }
            }
            start()
        }
    }

    private fun parseColorSafe(colorStr: String, defaultColor: Int = Color.TRANSPARENT): Int {
        if (colorStr.isEmpty() || colorStr.lowercase() == "transparent") return Color.TRANSPARENT
        try {
            if (colorStr.startsWith("rgba(") || colorStr.startsWith("rgb(")) {
                val numbers = colorStr.replace(Regex("[^0-9.,]"), "").split(",")
                if (numbers.size >= 3) {
                    val r = numbers[0].toFloat().toInt()
                    val g = numbers[1].toFloat().toInt()
                    val b = numbers[2].toFloat().toInt()
                    val a = if (numbers.size >= 4) (numbers[3].toFloat() * 255).toInt() else 255
                    return Color.argb(a, r, g, b)
                }
            }
            if (colorStr.startsWith("#") && colorStr.length == 4) {
                val r = colorStr[1]
                val g = colorStr[2]
                val b = colorStr[3]
                return Color.parseColor("#$r$r$g$g$b$b")
            }
            return Color.parseColor(colorStr)
        } catch (e: Exception) {
            e.printStackTrace()
            return defaultColor
        }
    }

    private fun applyThemeTokens(config: JSONObject) {
        try {
            val themeConfig = config.getJSONObject("themeConfig")
            val rootLayout = floatingView.findViewById<LinearLayout>(R.id.overlay_root)
            val contentArea = floatingView.findViewById<LinearLayout>(R.id.content_area)

            val bgColor = parseColorSafe(themeConfig.optString("background", "#202020"))
            val textColor = parseColorSafe(themeConfig.optString("text", "#FFFFFF"))
            val primaryColor = parseColorSafe(themeConfig.optString("primary", "#007BFF"))
            val borderColor = parseColorSafe(themeConfig.optString("border", "#007BFF"))
            
            val btnBgColor = parseColorSafe(themeConfig.optString("btnBg", themeConfig.optString("primary", "#007BFF")))
            val btnTextColor = parseColorSafe(themeConfig.optString("btnTextColor", themeConfig.optString("background", "#FFFFFF")))
            val btnBorderColor = parseColorSafe(themeConfig.optString("btnBorderColor", "transparent"))
            val btnBorderRadius = themeConfig.optDouble("btnBorderRadius", 100.0).toFloat()
            
            val hasBevel = themeConfig.optBoolean("hasBevel", false)
            val imageShape = themeConfig.optString("imageShape", "circle")
            val fontMono = themeConfig.optBoolean("fontMono", false)

            // Background & Border
            val backgroundDrawable = GradientDrawable().apply {
                setColor(bgColor)
                setStroke(4, borderColor)
                cornerRadius = when (imageShape) {
                    "circle" -> 100f
                    "rounded-square" -> 24f
                    else -> 0f
                }
            }
            
            if (hasBevel) {
                // Real 3D Bevel Effect (Win95/Metal style)
                val topHighlight = GradientDrawable().apply {
                    setStroke(6, Color.parseColor("#88FFFFFF"))
                    cornerRadius = backgroundDrawable.cornerRadius
                }
                val bottomShadow = GradientDrawable().apply {
                    setStroke(6, Color.parseColor("#88000000"))
                    cornerRadius = backgroundDrawable.cornerRadius
                }
                
                val layerDrawable = LayerDrawable(arrayOf(backgroundDrawable, topHighlight, bottomShadow))
                layerDrawable.setLayerInset(1, 0, 0, 4, 4) // Highlight offset
                layerDrawable.setLayerInset(2, 4, 4, 0, 0) // Shadow offset
                contentArea.background = layerDrawable
            } else {
                contentArea.background = backgroundDrawable
            }

            // Scanlines Overlay (Neon/Laser)
            val hasScanlines = themeConfig.optBoolean("hasScanlines", false)
            if (hasScanlines) {
                val scanColorStr = themeConfig.optString("scanlinesColor", "#2200FF41")
                val scanColor = Color.parseColor(scanColorStr)
                
                // We use a simple repeating gradient or a tinted overlay
                // For performance, we'll just tint the container slightly or use a pattern
                // Let's add a subtle semi-transparent overlay to the root
                val scanOverlay = GradientDrawable(GradientDrawable.Orientation.TOP_BOTTOM, intArrayOf(scanColor, Color.TRANSPARENT, scanColor))
                scanOverlay.alpha = 40
                rootLayout.foreground = scanOverlay
            } else {
                rootLayout.foreground = null
            }

            // Text Colors
            val tvVs = floatingView.findViewById<TextView>(R.id.tv_vs)
            val tvP1Name = floatingView.findViewById<TextView>(R.id.tv_p1_name)
            val tvP2Name = floatingView.findViewById<TextView>(R.id.tv_p2_name)
            val tvP1Score = floatingView.findViewById<TextView>(R.id.tv_p1_score)
            val tvP2Score = floatingView.findViewById<TextView>(R.id.tv_p2_score)

            tvVs.setTextColor(primaryColor)
            tvP1Name.setTextColor(textColor)
            tvP2Name.setTextColor(textColor)
            tvP1Score.setTextColor(textColor)
            tvP2Score.setTextColor(textColor)
            
            // Buttons Color & Design
            val buttonIds = arrayOf(R.id.btn_p1_plus, R.id.btn_p1_minus, R.id.btn_p2_plus, R.id.btn_p2_minus)
            for (id in buttonIds) {
                val btn = floatingView.findViewById<Button>(id)
                btn.setTextColor(btnTextColor)
                
                val btnDrawable = GradientDrawable().apply {
                    setColor(btnBgColor)
                    cornerRadius = btnBorderRadius * resources.displayMetrics.density
                    
                    if (btnBorderColor != Color.TRANSPARENT) {
                        setStroke(2, btnBorderColor)
                    }
                }
                
                if (hasBevel) {
                    val topHighlight = GradientDrawable().apply {
                        setStroke(4, Color.parseColor("#88FFFFFF"))
                        cornerRadius = btnDrawable.cornerRadius
                    }
                    val bottomShadow = GradientDrawable().apply {
                        setStroke(4, Color.parseColor("#88000000"))
                        cornerRadius = btnDrawable.cornerRadius
                    }
                    val layerDrawable = LayerDrawable(arrayOf(btnDrawable, topHighlight, bottomShadow))
                    layerDrawable.setLayerInset(1, 0, 0, 2, 2)
                    layerDrawable.setLayerInset(2, 2, 2, 0, 0)
                    btn.background = layerDrawable
                } else {
                    btn.background = btnDrawable
                }
            }

            // Font
            if (fontMono) {
                val mono = Typeface.MONOSPACE
                tvP1Name.typeface = mono
                tvP2Name.typeface = mono
                tvP1Score.typeface = mono
                tvP2Score.typeface = mono
                floatingView.findViewById<Button>(R.id.btn_p1_plus).typeface = mono
                floatingView.findViewById<Button>(R.id.btn_p1_minus).typeface = mono
                floatingView.findViewById<Button>(R.id.btn_p2_plus).typeface = mono
                floatingView.findViewById<Button>(R.id.btn_p2_minus).typeface = mono
            }
            
            // Image Shape
            val ivP1 = floatingView.findViewById<ImageView>(R.id.iv_p1)
            val ivP2 = floatingView.findViewById<ImageView>(R.id.iv_p2)
            ivP1.clipToOutline = true
            ivP2.clipToOutline = true
            
            val imageBg = GradientDrawable().apply {
                setColor(Color.TRANSPARENT)
                cornerRadius = when (imageShape) {
                    "circle" -> 100f
                    "rounded-square" -> 16f
                    else -> 0f
                }
            }
            ivP1.background = imageBg
            ivP2.background = imageBg

        } catch (e: Exception) {
            e.printStackTrace()
        }
    }

    private fun updateUIFromConfig(payload: String) {
        try {
            val config = JSONObject(payload)
            val p1 = config.getJSONObject("p1")
            val p2 = config.getJSONObject("p2")
            val showPhotos = config.optBoolean("showPhotos", true)

            val tvP1Name = floatingView.findViewById<TextView>(R.id.tv_p1_name)
            val tvP1Score = floatingView.findViewById<TextView>(R.id.tv_p1_score)
            val tvP2Name = floatingView.findViewById<TextView>(R.id.tv_p2_name)
            val tvP2Score = floatingView.findViewById<TextView>(R.id.tv_p2_score)
            val ivP1 = floatingView.findViewById<ImageView>(R.id.iv_p1)
            val ivP2 = floatingView.findViewById<ImageView>(R.id.iv_p2)

            val p1Plus = floatingView.findViewById<Button>(R.id.btn_p1_plus)
            val p1Minus = floatingView.findViewById<Button>(R.id.btn_p1_minus)
            val p2Plus = floatingView.findViewById<Button>(R.id.btn_p2_plus)
            val p2Minus = floatingView.findViewById<Button>(R.id.btn_p2_minus)

            var currentP1Score = p1.optInt("score", 0)
            var currentP2Score = p2.optInt("score", 0)

            tvP1Score.text = currentP1Score.toString()
            tvP2Score.text = currentP2Score.toString()

            if (showPhotos) {
                tvP1Name.visibility = View.GONE
                tvP2Name.visibility = View.GONE
                ivP1.visibility = View.VISIBLE
                ivP2.visibility = View.VISIBLE
                
                loadBase64Image(p1.optString("photo"), ivP1)
                loadBase64Image(p2.optString("photo"), ivP2)
            } else {
                ivP1.visibility = View.GONE
                ivP2.visibility = View.GONE
                tvP1Name.visibility = View.VISIBLE
                tvP2Name.visibility = View.VISIBLE
                
                tvP1Name.text = p1.optString("name", "P1")
                tvP2Name.text = p2.optString("name", "P2")
            }

            val sendUpdate = { playerId: String, score: Int, change: Int ->
                FloatingScoreModule.sendScoreUpdate(playerId, score, change)
            }

            p1Plus.setOnClickListener { 
                currentP1Score += 1
                tvP1Score.text = currentP1Score.toString()
                sendUpdate("p1", currentP1Score - 1, 1) 
            }
            p1Minus.setOnClickListener { 
                currentP1Score -= 1
                tvP1Score.text = currentP1Score.toString()
                sendUpdate("p1", currentP1Score + 1, -1) 
            }
            p2Plus.setOnClickListener { 
                currentP2Score += 1
                tvP2Score.text = currentP2Score.toString()
                sendUpdate("p2", currentP2Score - 1, 1) 
            }
            p2Minus.setOnClickListener { 
                currentP2Score -= 1
                tvP2Score.text = currentP2Score.toString()
                sendUpdate("p2", currentP2Score + 1, -1) 
            }

        } catch (e: Exception) {
            e.printStackTrace()
        }
    }

    private fun loadBase64Image(base64Str: String?, imageView: ImageView) {
        if (base64Str.isNullOrEmpty()) {
            imageView.setImageResource(android.R.drawable.ic_menu_crop)
            return
        }
        try {
            val cleanBase64 = base64Str.substringAfter("base64,")
            val decodedBytes = Base64.decode(cleanBase64, Base64.DEFAULT)
            val bitmap = BitmapFactory.decodeByteArray(decodedBytes, 0, decodedBytes.size)
            imageView.setImageBitmap(bitmap)
        } catch (e: Exception) {
            e.printStackTrace()
            imageView.setImageResource(android.R.drawable.ic_menu_crop)
        }
    }

    private fun handleDoubleTap() {
        val intent = packageManager.getLaunchIntentForPackage(packageName)?.apply {
            addFlags(Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_REORDER_TO_FRONT)
        }
        if (intent != null) {
            startActivity(intent)
        }

        if (this::floatingView.isInitialized) {
            floatingView.animate()
                .alpha(0f)
                .scaleX(0.8f)
                .scaleY(0.8f)
                .setDuration(300)
                .withEndAction {
                    stopSelf()
                }
                .start()
        } else {
            stopSelf()
        }
    }

    override fun onDestroy() {
        super.onDestroy()
        if (isViewAttached && this::floatingView.isInitialized) {
            windowManager.removeView(floatingView)
            isViewAttached = false
        }
        if (isDismissZoneAttached) {
            windowManager.removeView(dismissZone)
            isDismissZoneAttached = false
        }
    }
}
