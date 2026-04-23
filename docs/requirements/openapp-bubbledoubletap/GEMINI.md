<goal>Refactor existing native floating bubble service to implement a double-tap gesture that foregrounds the main app and destroys the bubble overlay.</goal>

<context>
  - Stack: Android Native (Kotlin)
  - Target Files: FloatingScoreService.kt, FloatingScoreModule.kt
</context>

<phase_1_planning>
  1. Discovery: Utilize available MCP servers and custom skills to analyze the workspace. Map the relationships between the Target Files and the Main Activity.
  2. Validation: Search for existing `PendingIntent`, `GestureDetector`, or background intent workaround implementations in the codebase using your tools.
  3. Output: Generate a hyper-concise, bulleted execution plan detailing:
     a) Exact lines/functions to modify.
     b) Intent flags to be used for background restriction bypass.
     c) MCP/Skills to be invoked during execution.
  4. Yield: Pause and wait for user approval before writing any code.
</phase_1_planning>

<phase_2_execution>
  1. Inject double-tap gesture listener into the bubble's root view.
  2. On double-tap trigger:
     a) Reuse discovered PendingIntent or generate a new one.
     b) Bypass Android background launch restrictions leveraging Foreground Service or SYSTEM_ALERT_WINDOW context.
     c) Execute stopSelf() (or module equivalent) to gracefully destroy the overlay.
</phase_2_execution>

<constraints>
  - NO AI slop or preamble. Keep the plan strictly technical.
  - Patching: During Phase 2, output code strictly using diffs/patches with exact line numbers.
  - Tool Persistence: If compilation or linting fails after editing, use MCP/skills to read the error trace, reflect, and auto-correct. Do not yield until the build passes.
</constraints>

<nudge><plan></nudge>