# Copiado de Link de Sala (OBS) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Añadir una sección al modal de ajustes que muestre el link de la sala para OBS y permita copiarlo al portapapeles con feedback visual.

**Architecture:** Se utilizará un `TextInput` en modo lectura estilizado según el tema activo y la librería `@react-native-clipboard/clipboard` para la interacción con el sistema. Se añade un estado local `copied` para gestionar el feedback del botón.

**Tech Stack:** React Native, TypeScript, @react-native-clipboard/clipboard.

---

### Task 1: Instalación de Dependencia

**Files:**
- Modify: `package.json` (implícito vía comando)

- [ ] **Step 1: Instalar la librería de Clipboard**

Run: `npm install @react-native-clipboard/clipboard`
Expected: Instalación exitosa y actualización de `package.json`.

- [ ] **Step 2: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: add @react-native-clipboard/clipboard dependency"
```

### Task 2: Preparación de Lógica y Estado en OverlaySettingsModal

**Files:**
- Modify: `src/ui/components/OverlaySettingsModal.tsx`

- [ ] **Step 1: Importar Clipboard y añadir estados**

```typescript
// Al inicio del archivo
import Clipboard from '@react-native-clipboard/clipboard';

// Dentro del componente
const [copied, setCopied] = useState(false);

const handleCopy = useCallback(() => {
  const url = `https://scorevs.vercel.app/overlay.html?room=${roomId}`;
  Clipboard.setString(url);
  setCopied(true);
  setTimeout(() => setCopied(false), 2000);
}, [roomId]);
```

- [ ] **Step 2: Commit**

```bash
git add src/ui/components/OverlaySettingsModal.tsx
git commit -m "feat: add copy logic to OverlaySettingsModal"
```

### Task 3: Implementación de UI

**Files:**
- Modify: `src/ui/components/OverlaySettingsModal.tsx`

- [ ] **Step 1: Insertar la sección de Link antes del botón de guardar**

```tsx
{/* LINK PARA OBS STUDIO */}
<View style={styles.section}>
  <Text style={[styles.label, { color: tk.text }]}>LINK PARA STREAMING</Text>
  <View style={styles.linkRow}>
    <TextInput
      style={[styles.input, styles.linkInput, {
        flex: 1,
        backgroundColor: tk.inputBg, color: tk.text, borderColor: tk.hasEngravedText ? 'transparent' : tk.primary,
        ...(tk.hasEngravedText && {
          borderTopWidth: 2, borderLeftWidth: 2,
          borderBottomWidth: 1, borderRightWidth: 1,
          borderTopColor: 'rgba(0,0,0,0.85)',
          borderLeftColor: 'rgba(0,0,0,0.85)',
          borderBottomColor: 'rgba(255,255,255,0.2)',
          borderRightColor: 'rgba(255,255,255,0.2)',
        }),
      }]}
      value={`https://scorevs.vercel.app/overlay.html?room=${roomId}`}
      editable={false}
    />
    <Pressable 
      style={[styles.copyBtn, { backgroundColor: tk.primary }]} 
      onPress={handleCopy}
    >
      <Text style={[styles.copyBtnText, { color: tk.background }]}>
        {copied ? '¡LISTO!' : 'COPIAR'}
      </Text>
    </Pressable>
  </View>
</View>
```

- [ ] **Step 2: Commit**

```bash
git add src/ui/components/OverlaySettingsModal.tsx
git commit -m "feat: add room link UI to OverlaySettingsModal"
```

### Task 4: Definición de Estilos

**Files:**
- Modify: `src/ui/components/OverlaySettingsModal.tsx` (Styles section)

- [ ] **Step 1: Añadir estilos linkRow, linkInput, copyBtn y copyBtnText**

```typescript
  linkRow: { flexDirection: 'row', gap: 10, alignItems: 'center' },
  linkInput: { fontSize: 13, paddingVertical: 10 },
  copyBtn: { paddingHorizontal: 15, paddingVertical: 12, borderRadius: 8, minWidth: 90, alignItems: 'center' },
  copyBtnText: { fontWeight: '900', fontSize: 11, letterSpacing: 1 },
```

- [ ] **Step 2: Commit**

```bash
git add src/ui/components/OverlaySettingsModal.tsx
git commit -m "feat: add styles for room link section"
```
