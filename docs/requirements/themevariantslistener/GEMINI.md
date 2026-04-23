<context>
Stack: React Native (TSX).
DB: Firebase Realtime Database.
Archivos implicados: `dashboardscreen.tsx` y `overlaysettingsmodal.tsx`.
Estado Actual: El UI local maneja los cambios propios de `theme` y `theme_variant`, y el listener remoto recibe bien el `theme`.
</context>

<bug>
El listener de Firebase Realtime Database actualiza exitosamente el estado del `theme` ante una mutación remota, pero ignora o no setea en el estado local los cambios del campo `theme_variant`. Esto impide el re-renderizado en la app móvil.
</bug>

<goal>
Mapear el punto de fallo en el flujo de datos e interceptar `theme_variant` en el payload para vincularlo al estado de React Native.
</goal>

<execution>
1. <check> Inspecciona `dashboardscreen.tsx` y `overlaysettingsmodal.tsx`. Localiza el listener exacto de Firebase que extrae el snapshot del nodo que contiene el `theme`. </check>
2. <plan> Antes de generar cualquier código, genera un plan de inspección ultra-conciso (máximo 3 bullet-points). Traza el flujo de datos desde la recepción del payload de Firebase hasta la actualización del estado local para identificar en qué línea exacta se está descartando o ignorando `theme_variant`. </plan>
3. <refactor> Basado en tu plan, modifica la desestructuración del snapshot o el casteo del payload para extraer también `theme_variant`. Inyecta este valor en el hook de estado correspondiente. </refactor>
4. <verify> Reflexiona sobre la ejecución: asegúrate de que no haya condiciones de carrera entre la actualización de `theme` y `theme_variant`. </verify>
5. Restricción de salida: Utiliza diffs/parches para mostrar los cambios de código. Cero descripciones en lenguaje natural fuera del plan de inspección.
</execution>

<nudge>
### Plan de Inspección
-