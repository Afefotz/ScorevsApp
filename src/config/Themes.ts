// ─── Tipos base ───────────────────────────────────────────────────────────────

export interface ThemeVariant {
  id: string;
  label: string;
  color: string;
}

export interface ThemeConfig {
  // ── Tokens existentes (backward compat — NO renombrar) ───────────────────
  /** Superficie de contraste: usada como color de texto sobre botones primarios */
  background: string;
  /** Color de acento / primario */
  primary: string;
  /** Color de texto principal */
  text: string;
  /** Fondo de inputs */
  inputBg: string;
  /** Superficie de tarjetas de puntuación */
  card: string;
  /** Familia tipográfica */
  font: string;
  variants?: ThemeVariant[];

  // ── Pantalla ─────────────────────────────────────────────────────────────
  /** Fondo de la pantalla completa (LoginScreen, DashboardScreen) */
  screenBg: string;

  // ── Cards / Paneles ───────────────────────────────────────────────────────
  cardBorderColor: string;
  cardBorderWidth: number;
  cardBorderRadius: number;
  cardElevation: number;
  cardShadowColor: string;

  // ── Header / TitleBar ─────────────────────────────────────────────────────
  headerBg: string;
  headerTextColor: string;
  headerLetterSpacing: number;
  headerFontWeight: '400' | '700' | '900';
  headerTextTransform: 'none' | 'uppercase' | 'lowercase';
  headerBorderBottomColor: string;
  headerBorderBottomWidth: number;

  // ── Inputs ────────────────────────────────────────────────────────────────
  inputBorderColor: string;
  inputBorderWidth: number;
  inputBorderRadius: number;
  inputTextColor: string;
  inputPlaceholderColor: string;
  inputGlowColor: string;

  // ── Labels ────────────────────────────────────────────────────────────────
  labelColor: string;
  labelLetterSpacing: number;
  labelFontWeight: '400' | '700' | '900';

  // ── Mode Toggle ───────────────────────────────────────────────────────────
  modeToggleBg: string;
  modeToggleBorderColor: string;
  modeToggleBorderRadius: number;
  modeActiveBg: string;
  modeActiveBorderColor: string;
  modeTextColor: string;
  modeActiveTextColor: string;

  // ── Botón CTA ─────────────────────────────────────────────────────────────
  btnBg: string;
  btnTextColor: string;
  btnBorderColor: string;
  btnBorderRadius: number;
  btnElevation: number;
  btnLetterSpacing: number;

  // ── Error / Feedback ──────────────────────────────────────────────────────
  errorColor: string;

  // ── Sistema ───────────────────────────────────────────────────────────────
  statusBarStyle: 'dark-content' | 'light-content';
  /** Ancho de borde del modal (Win95 = 3, otros = 1) */
  modalBorderWidth: number;

  // ── Decoradores por tema ──────────────────────────────────────────────────
  /** Win95: aplica bordes biselados (Win95Raised/Win95Sunken) */
  hasBevel: boolean;
  /** Neon: aplica decoradores de scanlines */
  hasScanlines: boolean;
  /** Metal: aplica efecto de texto grabado */
  hasEngravedText: boolean;
}

// ─── Definiciones por tema ────────────────────────────────────────────────────

export const Themes: Record<string, ThemeConfig> = {

  'theme-win95': {
    // — Backward compat —
    background: '#c0c0c0',
    primary: '#000080',
    text: '#000',
    inputBg: '#fff',
    card: '#c0c0c0',
    font: 'System',

    // — Pantalla —
    screenBg: '#008080',

    // — Cards —
    cardBorderColor: '#fff',
    cardBorderWidth: 2,
    cardBorderRadius: 0,
    cardElevation: 6,
    cardShadowColor: '#000',

    // — Header —
    headerBg: '#000080',
    headerTextColor: '#fff',
    headerLetterSpacing: 0,
    headerFontWeight: '700',
    headerTextTransform: 'none',
    headerBorderBottomColor: '#808080',
    headerBorderBottomWidth: 2,

    // — Inputs —
    inputBorderColor: '#808080',
    inputBorderWidth: 2,
    inputBorderRadius: 0,
    inputTextColor: '#000',
    inputPlaceholderColor: '#808080',
    inputGlowColor: 'transparent',

    // — Labels —
    labelColor: '#000',
    labelLetterSpacing: 0,
    labelFontWeight: '700',

    // — Mode toggle —
    modeToggleBg: '#c0c0c0',
    modeToggleBorderColor: '#808080',
    modeToggleBorderRadius: 0,
    modeActiveBg: '#000080',
    modeActiveBorderColor: '#fff',
    modeTextColor: '#000',
    modeActiveTextColor: '#fff',

    // — Button —
    btnBg: '#c0c0c0',
    btnTextColor: '#000',
    btnBorderColor: '#fff',
    btnBorderRadius: 0,
    btnElevation: 2,
    btnLetterSpacing: 0,

    // — Error —
    errorColor: '#800000',

    // — Sistema —
    statusBarStyle: 'dark-content',
    modalBorderWidth: 3,

    // — Decoradores —
    hasBevel: true,
    hasScanlines: false,
    hasEngravedText: false,
  },

  'theme-neon': {
    // — Backward compat —
    background: '#000',
    primary: '#00f3ff',
    text: '#0ff',
    inputBg: 'transparent',
    card: 'rgba(10,10,20,0.9)',
    font: 'System',

    // — Pantalla —
    screenBg: '#050510',

    // — Cards —
    cardBorderColor: '#0ff',
    cardBorderWidth: 1,
    cardBorderRadius: 0,
    cardElevation: 0,
    cardShadowColor: '#0ff',

    // — Header —
    headerBg: '#0ff',
    headerTextColor: '#000',
    headerLetterSpacing: 3,
    headerFontWeight: '900',
    headerTextTransform: 'uppercase',
    headerBorderBottomColor: '#f0f',
    headerBorderBottomWidth: 1,

    // — Inputs —
    inputBorderColor: '#0ff',
    inputBorderWidth: 1,
    inputBorderRadius: 0,
    inputTextColor: '#0ff',
    inputPlaceholderColor: 'rgba(0,255,255,0.4)',
    inputGlowColor: '#0ff',

    // — Labels —
    labelColor: '#f0f',
    labelLetterSpacing: 2,
    labelFontWeight: '700',

    // — Mode toggle —
    modeToggleBg: 'transparent',
    modeToggleBorderColor: '#0ff',
    modeToggleBorderRadius: 0,
    modeActiveBg: '#0ff',
    modeActiveBorderColor: '#0ff',
    modeTextColor: '#0ff',
    modeActiveTextColor: '#000',

    // — Button —
    btnBg: 'transparent',
    btnTextColor: '#0ff',
    btnBorderColor: '#0ff',
    btnBorderRadius: 0,
    btnElevation: 0,
    btnLetterSpacing: 3,

    // — Error —
    errorColor: '#f0f',

    // — Sistema —
    statusBarStyle: 'light-content',
    modalBorderWidth: 1,

    // — Decoradores —
    hasBevel: false,
    hasScanlines: true,
    hasEngravedText: false,
  },

  'theme-metal': {
    // — Backward compat —
    background: '#2c3e50',
    primary: '#ffd700',
    text: '#e0e5ec',
    inputBg: 'rgba(0,0,0,0.15)',
    card: '#34495e',
    font: 'System',
    variants: [
      { id: 'steel', label: 'Acero', color: '#bdc3c7' },
      { id: 'gold',  label: 'Oro',   color: '#ffd700' },
      { id: 'bronze',label: 'Bronce',color: '#cd7f32' },
    ],

    // — Pantalla —
    screenBg: '#1a2535',

    // — Cards —
    cardBorderColor: 'rgba(255,255,255,0.15)',
    cardBorderWidth: 1,
    cardBorderRadius: 6,
    cardElevation: 12,
    cardShadowColor: '#000',

    // — Header —
    headerBg: 'rgba(0,0,0,0.2)',
    headerTextColor: '#e0e5ec',
    headerLetterSpacing: 3,
    headerFontWeight: '900',
    headerTextTransform: 'uppercase',
    headerBorderBottomColor: 'rgba(0,0,0,0.5)',
    headerBorderBottomWidth: 2,

    // — Inputs —
    inputBorderColor: 'rgba(0,0,0,0.5)',
    inputBorderWidth: 1,
    inputBorderRadius: 4,
    inputTextColor: '#e0e5ec',
    inputPlaceholderColor: 'rgba(224,229,236,0.4)',
    inputGlowColor: 'transparent',

    // — Labels —
    labelColor: '#e0e5ec',
    labelLetterSpacing: 2,
    labelFontWeight: '900',

    // — Mode toggle —
    modeToggleBg: 'rgba(0,0,0,0.1)',
    modeToggleBorderColor: 'rgba(255,255,255,0.2)',
    modeToggleBorderRadius: 3,
    modeActiveBg: '#ffd700',
    modeActiveBorderColor: 'rgba(255,255,255,0.4)',
    modeTextColor: 'rgba(224,229,236,0.6)',
    modeActiveTextColor: '#000',

    // — Button —
    btnBg: '#ffd700',
    btnTextColor: '#000',
    btnBorderColor: 'rgba(255,255,255,0.4)',
    btnBorderRadius: 4,
    btnElevation: 8,
    btnLetterSpacing: 2,

    // — Error —
    errorColor: '#ff6b6b',

    // — Sistema —
    statusBarStyle: 'light-content',
    modalBorderWidth: 1,

    // — Decoradores —
    hasBevel: false,
    hasScanlines: false,
    hasEngravedText: true,
  },
};

export type ThemeKey = keyof typeof Themes;