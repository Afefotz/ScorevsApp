<context>
Role: Senior RN & Android Developer.
Task: Implement a Floating Overlay (Chat-head style) using Android Native Modules (Kotlin).
Source of Truth: PlayerCard.tsx (Extract Player object: name, avatar, score, config_show_photos) DashboardScreen.tsx.
Infrastructure: Context7 MCP server active for architectural patterns.
</context>

<logic_flow>
1. [BRAINSTORM] Access Context7 to define the OOB (Out-of-Bounds) rendering strategy for Android WindowManager in RN and for achieve this in iOS.
2. [PLAN] Create a technical blueprint:
   - Headless JS or MethodChannel for real-time score sync between PlayerCard.tsx and Kotlin Service.
   - Kotlin Service: Implement WindowManager.LayoutParams (TYPE_APPLICATION_OVERLAY).
   - Layout Logic: XML-based view in Kotlin with conditional visibility for ImageView/TextView based on config_show_photos.
3. [EXECUTION] 
   - Scaffold `FloatingScoreModule.kt` and `FloatingScoreService.kt`.
   - Update `AndroidManifest.xml` with SYSTEM_ALERT_WINDOW permissions.
   - Export JS functions: `showOverlay()`, `updateOverlayScore()`, `hideOverlay()`.
</logic_flow>

<constraints>
- Use Diffs to modify PlayerCard.tsx for lifecycle hooks (Appstate: background -> showOverlay).
- No external UI libraries for the bubble; use native Android Views for performance.
- Response start: "CODE_GEN: [Module Definition]"
</constraints>

<verification>
1. Generate a mock test in Kotlin to verify Overlay View inflation.
2. Provide a shell command to grant SYSTEM_ALERT_WINDOW via ADB for testing.
</verification>