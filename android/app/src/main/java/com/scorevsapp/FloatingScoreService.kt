package com.scorevsapp

import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.Service
import android.content.Context
import android.content.Intent
import android.graphics.Color
import android.graphics.PixelFormat
import android.graphics.drawable.GradientDrawable
import android.graphics.BitmapFactory
import android.util.Base64
import android.os.Build
import android.os.IBinder
import android.view.Gravity
import android.view.LayoutInflater
import android.view.MotionEvent
import android.view.View
import android.view.WindowManager
import android.widget.Button
import android.widget.ImageView
import android.widget.LinearLayout
import android.widget.TextView
import androidx.core.app.NotificationCompat
import org.json.JSONObject

class FloatingScoreService : Service() {

    private lateinit var windowManager: WindowManager
    private lateinit var floatingView: View
    private lateinit var params: WindowManager.LayoutParams
    private var isViewAttached = false

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
        floatingView = LayoutInflater.from(this).inflate(R.layout.bubble_layout, null)

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

        setupDragListener()
        setupCloseButton()
    }

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        val configPayload = intent?.getStringExtra("CONFIG")
        val action = intent?.getStringExtra("ACTION")

        if (action != "UPDATE" && !isViewAttached) {
            windowManager.addView(floatingView, params)
            isViewAttached = true
        }

        configPayload?.let { updateUIFromConfig(it) }

        return START_NOT_STICKY
    }

    private fun setupDragListener() {
        val rootLayout = floatingView.findViewById<LinearLayout>(R.id.overlay_root)
        var initialX = 0
        var initialY = 0
        var initialTouchX = 0f
        var initialTouchY = 0f

        rootLayout.setOnTouchListener { view, event ->
            when (event.action) {
                MotionEvent.ACTION_DOWN -> {
                    initialX = params.x
                    initialY = params.y
                    initialTouchX = event.rawX
                    initialTouchY = event.rawY
                    true
                }
                MotionEvent.ACTION_MOVE -> {
                    params.x = initialX + (event.rawX - initialTouchX).toInt()
                    params.y = initialY + (event.rawY - initialTouchY).toInt()
                    if (isViewAttached) {
                        windowManager.updateViewLayout(floatingView, params)
                    }
                    true
                }
                else -> false
            }
        }
    }

    private fun setupCloseButton() {
        val btnClose = floatingView.findViewById<Button>(R.id.btn_close)
        btnClose.setOnClickListener {
            stopSelf()
        }
    }

    private fun updateUIFromConfig(payload: String) {
        try {
            val config = JSONObject(payload)
            val p1 = config.getJSONObject("p1")
            val p2 = config.getJSONObject("p2")
            val showPhotos = config.optBoolean("showPhotos", true)
            val themeConfig = config.getJSONObject("themeConfig")

            // Bind UI Elements
            val tvP1Name = floatingView.findViewById<TextView>(R.id.tv_p1_name)
            val tvP1Score = floatingView.findViewById<TextView>(R.id.tv_p1_score)
            val tvP2Name = floatingView.findViewById<TextView>(R.id.tv_p2_name)
            val tvP2Score = floatingView.findViewById<TextView>(R.id.tv_p2_score)
            val tvVs = floatingView.findViewById<TextView>(R.id.tv_vs)
            val ivP1 = floatingView.findViewById<ImageView>(R.id.iv_p1)
            val ivP2 = floatingView.findViewById<ImageView>(R.id.iv_p2)

            val p1Plus = floatingView.findViewById<Button>(R.id.btn_p1_plus)
            val p1Minus = floatingView.findViewById<Button>(R.id.btn_p1_minus)
            val p2Plus = floatingView.findViewById<Button>(R.id.btn_p2_plus)
            val p2Minus = floatingView.findViewById<Button>(R.id.btn_p2_minus)
            val rootLayout = floatingView.findViewById<LinearLayout>(R.id.overlay_root)

            // Extract scores
            var currentP1Score = p1.optInt("score", 0)
            var currentP2Score = p2.optInt("score", 0)

            
            tvP1Score.text = currentP1Score.toString()
            tvP2Score.text = currentP2Score.toString()

            // Conditional Photo vs Name Binding
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

            // Bind Actions
            val sendUpdate = { playerId: String, score: Int, change: Int ->
                FloatingScoreModule.sendScoreUpdate(playerId, score, change)
            }

            p1Plus.setOnClickListener { 
                android.util.Log.d("ScorevsApp", "Boton p1+ pulsado, ReactContext: ${FloatingScoreModule.activeContext != null}")
                currentP1Score += 1
                tvP1Score.text = currentP1Score.toString()
                sendUpdate("p1", currentP1Score - 1, 1) 
            }
            p1Minus.setOnClickListener { 
                android.util.Log.d("ScorevsApp", "Boton p1- pulsado, ReactContext: ${FloatingScoreModule.activeContext != null}")
                currentP1Score -= 1
                tvP1Score.text = currentP1Score.toString()
                sendUpdate("p1", currentP1Score + 1, -1) 
            }
            p2Plus.setOnClickListener { 
                android.util.Log.d("ScorevsApp", "Boton p2+ pulsado, ReactContext: ${FloatingScoreModule.activeContext != null}")
                currentP2Score += 1
                tvP2Score.text = currentP2Score.toString()
                sendUpdate("p2", currentP2Score - 1, 1) 
            }
            p2Minus.setOnClickListener { 
                android.util.Log.d("ScorevsApp", "Boton p2- pulsado, ReactContext: ${FloatingScoreModule.activeContext != null}")
                currentP2Score -= 1
                tvP2Score.text = currentP2Score.toString()
                sendUpdate("p2", currentP2Score + 1, -1) 
            }

            // Theme Styling
            val bgColorStr = themeConfig.optString("background", "#202020")
            val textColorStr = themeConfig.optString("text", "#FFFFFF")
            val primaryColorStr = themeConfig.optString("primary", "#007BFF")
            
            val bgColor = Color.parseColor(bgColorStr)
            val textColor = Color.parseColor(textColorStr)
            val primaryColor = Color.parseColor(primaryColorStr)

            val backgroundDrawable = GradientDrawable().apply {
                setColor(bgColor)
                cornerRadius = 24f
                setStroke(4, primaryColor)
            }
            rootLayout.background = backgroundDrawable

            tvVs.setTextColor(primaryColor)
            tvP1Name.setTextColor(textColor)
            tvP2Name.setTextColor(textColor)
            tvP1Score.setTextColor(textColor)
            tvP2Score.setTextColor(textColor)

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
            // Placeholder fallback
            imageView.setImageResource(android.R.drawable.ic_menu_crop)
        }
    }

    override fun onDestroy() {
        super.onDestroy()
        if (isViewAttached) {
            windowManager.removeView(floatingView)
            isViewAttached = false
        }
    }
}
