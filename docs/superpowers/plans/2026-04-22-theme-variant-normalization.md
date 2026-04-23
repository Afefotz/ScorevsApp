# Theme Variant Normalization Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ensure the mobile app reacts to theme variant changes sent as `theme_variant` from remote sources by normalizing it to the internal `variant` field in the data layer.

**Architecture:** Implement a private `normalizeSettings` helper in `DatabaseService` that acts as a bridge between Firebase payloads and the app's internal interfaces. All room and settings listeners will use this helper.

**Tech Stack:** React Native, Firebase Realtime Database, TypeScript.

---

### Task 1: Update `DatabaseService.ts` interface and helper

**Files:**
- Modify: `src/services/DatabaseService.ts`

- [ ] **Step 1: Update `SettingsData` interface and add `normalizeSettings`**
Add `theme_variant` to the interface and implement the private helper method.

```typescript
// src/services/DatabaseService.ts

export interface SettingsData {
  theme: string;
  variant: string;
  theme_variant?: string; // New field from remote sources
  accentColor: string;
  opacity: number;
  verticalMode: boolean;
  showPhotos: boolean;
  swapPlayers: boolean;
  customTitle: string;
  colors?: {
    bg: string;
    primary: string;
    score: string;
    secondary: string;
    text: string;
    window: string;
  };
}

// Inside DatabaseService class
private normalizeSettings(settings: any): SettingsData {
  if (!settings) return {} as SettingsData;
  
  return {
    ...settings,
    // Normalization bridge: prefer theme_variant if present (from web)
    variant: settings.theme_variant || settings.variant || 'default',
  };
}
```

- [ ] **Step 2: Commit changes**
```bash
git add src/services/DatabaseService.ts
git commit -m "refactor: add theme_variant normalization helper to DatabaseService"
```

### Task 2: Integrate normalization into Room Listener

**Files:**
- Modify: `src/services/DatabaseService.ts`

- [ ] **Step 1: Update `listenToRoom`**
Intercept the room payload and normalize the nested settings object.

```typescript
// src/services/DatabaseService.ts

listenToRoom(roomId: string, callback: (data: any) => void) {
  const reference = this.db.ref(`/rooms/${roomId}`);
  reference.on('value', snapshot => {
    const data = snapshot.val();
    if (data && data.settings) {
      data.settings = this.normalizeSettings(data.settings);
    }
    callback(data);
  });
  return () => reference.off('value');
}
```

- [ ] **Step 2: Commit changes**
```bash
git add src/services/DatabaseService.ts
git commit -m "feat: integrate normalization in listenToRoom"
```

### Task 3: Integrate normalization into Settings Listener

**Files:**
- Modify: `src/services/DatabaseService.ts`

- [ ] **Step 1: Update `listenToSettings`**
Ensure the specialized settings listener also uses the normalization bridge.

```typescript
// src/services/DatabaseService.ts

listenToSettings(roomId: string, callback: (settings: SettingsData) => void) {
  const reference = this.db.ref(`/rooms/${roomId}/settings`);
  reference.on('value', snapshot => {
    const data = snapshot.val();
    callback(this.normalizeSettings(data));
  });
  return () => reference.off('value');
}
```

- [ ] **Step 2: Commit changes**
```bash
git add src/services/DatabaseService.ts
git commit -m "feat: integrate normalization in listenToSettings"
```

### Task 4: Verification

- [ ] **Step 1: Verify DashboardScreen reactivity**
Open `DashboardScreen.tsx`. Since it uses `dbService.listenToRoom` (Line 29), it should now receive the corrected `variant` automatically, and `activeVariant` (Line 38) will reflect the remote change.

- [ ] **Step 2: Verify OverlaySettingsModal reactivity**
Open `OverlaySettingsModal.tsx`. It uses `dbService.listenToSettings` (Line 93). It should now correctly populate the local `settings` state with the remote variant.
