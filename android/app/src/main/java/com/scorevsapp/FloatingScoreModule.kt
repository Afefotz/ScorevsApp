package com.scorevsapp

import android.content.Intent
import android.net.Uri
import android.os.Build
import android.provider.Settings
import com.facebook.react.bridge.*
import com.facebook.react.modules.core.DeviceEventManagerModule

class FloatingScoreModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    init {
        activeContext = reactContext
    }

    override fun getName(): String = "FloatingScoreModule"

    @ReactMethod
    fun showOverlay(payload: String) {
        val context = reactApplicationContext
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M && !Settings.canDrawOverlays(context)) {
            val intent = Intent(
                Settings.ACTION_MANAGE_OVERLAY_PERMISSION,
                Uri.parse("package:" + context.packageName)
            )
            intent.flags = Intent.FLAG_ACTIVITY_NEW_TASK
            context.startActivity(intent)
            return
        }
        val intent = Intent(context, FloatingScoreService::class.java).apply {
            putExtra("CONFIG", payload)
        }
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            context.startForegroundService(intent)
        } else {
            context.startService(intent)
        }
    }

    @ReactMethod
    fun updateOverlay(payload: String) {
        val context = reactApplicationContext
        val intent = Intent(context, FloatingScoreService::class.java).apply {
            putExtra("CONFIG", payload)
            putExtra("ACTION", "UPDATE")
        }
        context.startService(intent)
    }

    @ReactMethod
    fun hideOverlay() {
        val context = reactApplicationContext
        val intent = Intent(context, FloatingScoreService::class.java)
        context.stopService(intent)
    }

    // --- REQUERIDOS POR React Native Event Emitter ---
    @ReactMethod
    fun addListener(eventName: String) {}

    @ReactMethod
    fun removeListeners(count: Int) {}
    // -------------------------------------------------

    // -------------------------------------------------

    companion object {
        var activeContext: ReactApplicationContext? = null

        fun sendScoreUpdate(playerId: String, currentScore: Int, change: Int) {
            val context = activeContext ?: return
            val params = Arguments.createMap().apply {
                putString("playerId", playerId)
                putInt("currentScore", currentScore)
                putInt("change", change)
            }
            if (context.hasActiveCatalystInstance()) {
                context.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
                    .emit("onScoreUpdate", params)
            }
        }
    }
}
