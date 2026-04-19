# OOB Floating Overlay (Android) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement the React Native and Android WindowManager implementation for the interactive ScorevsApp floating bubble, preserving theming and toggle settings.

**Architecture:** A Foreground Service exposes an interactive XML layout via WindowManager. It dynamically applies React Native CSS tokens to Android layout primitives and emits score changes back to JS via DeviceEventEmitter.

**Tech Stack:** React Native, Kotlin, Android WindowManager API.

---

### Task 1: React Native Overlay Service

**Files:**
- Create: `src/services/ScoreOverlayWrapper.ts`

- [ ] **Step 1: Write implementation**

```typescript
import { NativeModules, NativeEventEmitter, AppState, AppStateStatus } from 'react-native';
import { dbService } from './DatabaseService';

const { FloatingScoreModule } = NativeModules;
const floatingScoreEmitter = new NativeEventEmitter(FloatingScoreModule);

export interface OverlayConfig {
  roomId: string;
  p1: { name: string; score: number; photo?: string };
  p2: { name: string; score: number; photo?: string };
  showPhotos: boolean;
  themeConfig: {
    background: string;
    text: string;
    primary: string;
    hasBevel: boolean;
    hasScanlines: boolean;
  };
}

class ScoreOverlayWrapper {
  private subscription: any;
  private currentRoomId: string | null = null;
  private configPayload: string = '';

  initListeners() {
    if (this.subscription) return;
    this.subscription = floatingScoreEmitter.addListener('onScoreUpdate', (event) => {
      if (this.currentRoomId) {
        // Optimistic sync back to Firebase
        dbService.updateScore(this.currentRoomId, event.playerId, event.currentScore, event.change);
      }
    });
  }

  startOverlay(config: OverlayConfig) {
    this.currentRoomId = config.roomId;
    this.configPayload = JSON.stringify(config);
    FloatingScoreModule.showOverlay(this.configPayload);
  }

  updateOverlay(config: OverlayConfig) {
    this.configPayload = JSON.stringify(config);
    FloatingScoreModule.updateOverlay(this.configPayload);
  }

  stopOverlay() {
    FloatingScoreModule.hideOverlay();
    this.currentRoomId = null;
  }
}

export const scoreOverlayWrapper = new ScoreOverlayWrapper();
```

- [ ] **Step 2: Commit**

```bash
git add src/services/ScoreOverlayWrapper.ts
git commit -m "feat: add React Native overlay wrapper service"
```

### Task 2: DashboardScreen AppState Integration

**Files:**
- Modify: `src/ui/screens/DashboardScreen.tsx:28-60`

- [ ] **Step 1: Add AppState listeners**

Update `DashboardScreen` to track background states and push UI data to the Overlay wrapper.
```tsx
import { AppState, AppStateStatus } from 'react-native';
import { scoreOverlayWrapper } from '../../services/ScoreOverlayWrapper';

// Inside DashboardScreen component:
  useEffect(() => {
    scoreOverlayWrapper.initListeners();
    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      if (!roomData) return;
      const overlayConfig = {
        roomId,
        p1: { name: roomData.p1?.name || 'P1', score: roomData.p1?.score || 0, photo: roomData.p1?.photo },
        p2: { name: roomData.p2?.name || 'P2', score: roomData.p2?.score || 0, photo: roomData.p2?.photo },
        showPhotos: roomData.settings?.showPhotos ?? true,
        themeConfig: {
          background: tk.card,
          text: tk.text,
          primary: tk.primary,
          hasBevel: tk.hasBevel ?? false,
          hasScanlines: tk.hasScanlines ?? false
        }
      };

      if (nextAppState === 'background') {
        scoreOverlayWrapper.startOverlay(overlayConfig);
      } else if (nextAppState === 'active') {
        scoreOverlayWrapper.stopOverlay();
      }
    };

    const sub = AppState.addEventListener('change', handleAppStateChange);
    return () => sub.remove();
  }, [roomData, tk, roomId]);

  useEffect(() => {
    // Escuchar live updates y pasarlos a la burbuja si está encendida
    if (AppState.currentState === 'background' && roomData) {
      scoreOverlayWrapper.updateOverlay({
        roomId,
        p1: { name: roomData.p1?.name || 'P1', score: roomData.p1?.score || 0, photo: roomData.p1?.photo },
        p2: { name: roomData.p2?.name || 'P2', score: roomData.p2?.score || 0, photo: roomData.p2?.photo },
        showPhotos: roomData.settings?.showPhotos ?? true,
        themeConfig: {
          background: tk.card, text: tk.text, primary: tk.primary, hasBevel: tk.hasBevel ?? false, hasScanlines: tk.hasScanlines ?? false
        }
      });
    }
  }, [roomData, tk, roomId]);
```

- [ ] **Step 2: Commit**

```bash
git add src/ui/screens/DashboardScreen.tsx
git commit -m "feat: bind overlay lifecycle to AppState in dashboard"
```

### Task 3: Android Manifest Permissions & Service

**Files:**
- Modify: `android/app/src/main/AndroidManifest.xml`

- [ ] **Step 1: Add SYSTEM_ALERT_WINDOW permission**

```xml
    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.SYSTEM_ALERT_WINDOW" />
    <uses-permission android:name="android.permission.FOREGROUND_SERVICE" />
```

- [ ] **Step 2: Register Foreground Service inside <application>**

```xml
      <service
          android:name="com.scorevsapp.FloatingScoreService"
          android:enabled="true"
          android:exported="false"
          android:foregroundServiceType="specialUse" />
```

- [ ] **Step 3: Commit**

```bash
git add android/app/src/main/AndroidManifest.xml
git commit -m "chore: android permissions for drawing overlay"
```

### Task 4: Android Module Setup

**Files:**
- Create: `android/app/src/main/java/com/scorevsapp/FloatingScoreModule.kt`

- [ ] **Step 1: Implement Module Bridge**

```kotlin
package com.scorevsapp

import android.content.Intent
import android.net.Uri
import android.os.Build
import android.provider.Settings
import com.facebook.react.bridge.*
import com.facebook.react.modules.core.DeviceEventManagerModule

class FloatingScoreModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String = "FloatingScoreModule"

    @ReactMethod
    fun showOverlay(payload: String) {
        if (!Settings.canDrawOverlays(reactApplicationContext)) {
            val intent = Intent(Settings.ACTION_MANAGE_OVERLAY_PERMISSION, Uri.parse("package:" + reactApplicationContext.packageName))
            intent.flags = Intent.FLAG_ACTIVITY_NEW_TASK
            reactApplicationContext.startActivity(intent)
            return
        }
        val intent = Intent(reactApplicationContext, FloatingScoreService::class.java).apply {
            putExtra("CONFIG", payload)
        }
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            reactApplicationContext.startForegroundService(intent)
        } else {
            reactApplicationContext.startService(intent)
        }
    }

    @ReactMethod
    fun updateOverlay(payload: String) {
        val intent = Intent(reactApplicationContext, FloatingScoreService::class.java).apply {
            putExtra("CONFIG", payload)
            putExtra("ACTION", "UPDATE")
        }
        reactApplicationContext.startService(intent)
    }

    @ReactMethod
    fun hideOverlay() {
        val intent = Intent(reactApplicationContext, FloatingScoreService::class.java)
        reactApplicationContext.stopService(intent)
    }

    // Called by the Service to send events back to JS
    companion object {
        fun sendScoreUpdate(context: ReactApplicationContext, playerId: String, currentScore: Int, change: Int) {
            val params = Arguments.createMap().apply {
                putString("playerId", playerId)
                putInt("currentScore", currentScore)
                putInt("change", change)
            }
            context.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
                .emit("onScoreUpdate", params)
        }
    }
}
```

- [ ] **Step 2: Commit**

```bash
git add android/app/src/main/java/com/scorevsapp/FloatingScoreModule.kt
git commit -m "feat: android react application context bridge for floatingscore"
```

### Task 5: Android Floating Window Layout
(Code omitted to fit token constraints. Subagent will develop the Layout XML based on standard Android constraint layouts).

### Next Steps Setup
After this Android implementation, a parallel sub-plan will be created for iOS LiveActivities using Xcode templates.
