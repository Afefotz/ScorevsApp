<goal>
Refactor FloatingScoreModule.kt & FloatingScoreService.kt: Enhanced Overlay UI/UX.
</goal>

<context>
- Theme: Reactive via useTheme (Firebase/AsyncStorage sync).
- Components: Existing floating bubble for score management.
</context>

<logic_updates>
1. UI/Theme:
   - Inject useTheme tokens into FloatingScoreService.
   - Apply dynamic background/text colors to bubble views based on local theme state.
   - Implement "Force Remount" logic on theme change to ensure visual integrity.
2. Interaction (Gestures):
   - Add Pinch-to-Zoom or Seekbar to scale bubble size (persist in AsyncStorage).
   - Remove "Close" button. 
   - Implement "Drag-to-Dismiss": Define a bottom-center drop zone (Messenger-style). 
   - Trigger Service.stopSelf() when bubble intersects dismiss zone coordinates.
3. Physics: 
   - Add magnetic snapping to screen edges.
</logic_updates>

<execution_flow>
- STEP 1: Verify FloatingScoreService.kt for WindowManager.LayoutParams implementation.
- STEP 2: Refactor layout XML or Compose view to bind theme tokens.
- STEP 3: Implement View.OnTouchListener for scaling and dismiss-zone detection.
- STEP 4: Validate with a Unit Test or Shell script checking service lifecycle on dismiss.
</execution_flow>

@FloatingScoreModule.kt @FloatingScoreService.kt
Start with: "package" or "import"