# Design Spec: Theme Variant Normalization

## Overview
This specification addresses the synchronization issue where theme variant changes from remote sources (like the web dashboard) are ignored by the mobile app because of a field name discrepancy (`theme_variant` vs `variant`).

## Goals
- Ensure real-time reactivity in the mobile app when `theme_variant` is mutated in Firebase.
- Maintain internal code consistency by continuing to use `variant` within the app's logic.
- Centralize the fix in the data layer (`DatabaseService`) to avoid UI clutter.

## Proposed Changes

### DatabaseService.ts
- **Interface Update**: Add `theme_variant?: string` to `SettingsData`.
- **New Method**: `private normalizeSettings(settings: any): SettingsData`.
- **Listener Updates**:
    - `listenToRoom`: Intercept the snapshot, normalize `settings` if present, and return the modified room data.
    - `listenToSettings`: Normalize the snapshot value before calling the callback.

### Data Flow
1. Firebase emits a change on `/rooms/{roomId}`.
2. `DatabaseService` receives the payload.
3. If `payload.settings.theme_variant` exists and `payload.settings.variant` is missing or different, it populates `variant`.
4. The UI receives the normalized object and re-renders using the existing `variant` logic.

## Success Criteria
- Remote changes to the theme variant from the web (sending `theme_variant`) trigger an immediate visual update in `DashboardScreen` and `OverlaySettingsModal`.
- No changes are required to the rendering logic of components.
