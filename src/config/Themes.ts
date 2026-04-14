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

/**
 * Mapea los tokens de un tema y acento a la estructura JSON esperada por el overlay web.
 * (Evita el "residuo" de colores del tema anterior en la web).
 */
export const mapThemeToWebColors = (tk: ThemeConfig, accentColor: string) => ({
  bg: tk.screenBg,
  primary: accentColor,
  score: '#ffffff', // Valor por defecto consistente con samples
  secondary: tk.background,
  text: tk.text,
  window: tk.card,
});

/**
 * Obtiene los valores por defecto (variante y acento) para un tema dado.
 */
export const getThemeDefaultSettings = (themeKey: string) => {
  const tk = Themes[themeKey as ThemeKey] || Themes['theme-win95'];
  const hasVariants = tk.variants && tk.variants.length > 0;
  const variant = hasVariants ? tk.variants![0].id : 'default';
  const accentColor = hasVariants ? tk.variants![0].color : tk.primary;
  
  return {
    variant,
    accentColor,
    colors: mapThemeToWebColors(tk, accentColor),
  };
};

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
    variants: [
      { id: 'Clásico Win95', label: 'Clásico Win95', color: '#c0c0c0' },
    ],
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
    variants: [
      { id: 'Cian (Por defecto)', label: 'Cian', color: '#00ffff' },
      { id: 'Rosa Neón', label: 'Rosa', color: '#ff00ff' },
      { id: 'Verde Tóxico', label: 'Verde', color: '#39ff14' },
    ],
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
      { id: 'Acero Plateado', label: 'Acero', color: '#bdc3c7' },
      { id: 'Oro Imperial',  label: 'Oro',   color: '#ffd700' },
      { id: 'Bronce Antiguo',label: 'Bronce',color: '#cd7f32' },
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
  
  'theme-modern': {
    // — Backward compat —
    background: '#1e1e1e',
    primary: '#e0e0e0',
    text: '#ffffff',
    inputBg: '#2d2d2d',
    card: '#252528',
    font: 'System',
    variants: [
      { id: 'Gris Claro (Por defecto)', label: 'Gris Claro', color: '#e0e0e0' },
      { id: 'Verde Cyber', label: 'Verde Cyber', color: '#00e676' },
      { id: 'Amarillo Eléctrico', label: 'Amarillo', color: '#ffea00' },
      { id: 'Naranja Fuego', label: 'Naranja', color: '#ff9100' },
    ],

    // — Pantalla —
    screenBg: '#121212',

    // — Cards —
    cardBorderColor: 'rgba(255,255,255,0.08)',
    cardBorderWidth: 1,
    cardBorderRadius: 16,
    cardElevation: 4,
    cardShadowColor: '#000',

    // — Header —
    headerBg: '#1e1e1e',
    headerTextColor: '#ffffff',
    headerLetterSpacing: 1,
    headerFontWeight: '700',
    headerTextTransform: 'none',
    headerBorderBottomColor: 'rgba(255,255,255,0.1)',
    headerBorderBottomWidth: 1,

    // — Inputs —
    inputBorderColor: 'rgba(255,255,255,0.15)',
    inputBorderWidth: 1,
    inputBorderRadius: 10,
    inputTextColor: '#ffffff',
    inputPlaceholderColor: 'rgba(255,255,255,0.4)',
    inputGlowColor: 'transparent',

    // — Labels —
    labelColor: 'rgba(255,255,255,0.7)',
    labelLetterSpacing: 0.5,
    labelFontWeight: '400',

    // — Mode toggle —
    modeToggleBg: '#2c2c2c',
    modeToggleBorderColor: 'rgba(255,255,255,0.05)',
    modeToggleBorderRadius: 20,
    modeActiveBg: '#e0e0e0',
    modeActiveBorderColor: '#ffffff',
    modeTextColor: '#ffffff',
    modeActiveTextColor: '#121212',

    // — Button —
    btnBg: '#e0e0e0',
    btnTextColor: '#121212',
    btnBorderColor: '#ffffff',
    btnBorderRadius: 12,
    btnElevation: 2,
    btnLetterSpacing: 1,

    // — Error —
    errorColor: '#ff5252',

    // — Sistema —
    statusBarStyle: 'light-content',
    modalBorderWidth: 1,

    // — Decoradores —
    hasBevel: false,
    hasScanlines: false,
    hasEngravedText: false,
  },

  'theme-modern-light': {
    // — Backward compat —
    background: '#ffffff',
    primary: '#333333',
    text: '#1d1d1f',
    inputBg: '#f2f2f7',
    card: '#ffffff',
    font: 'System',
    variants: [
      { id: 'Gris Oscuro (Por defecto)', label: 'Gris Oscuro', color: '#333333' },
      { id: 'Azul Rey', label: 'Azul Rey', color: '#2979ff' },
      { id: 'Morado Profundo', label: 'Morado', color: '#651fff' },
    ],

    // — Pantalla —
    screenBg: '#f5f5f7',

    // — Cards —
    cardBorderColor: 'rgba(0,0,0,0.05)',
    cardBorderWidth: 1,
    cardBorderRadius: 16,
    cardElevation: 8,
    cardShadowColor: '#000',

    // — Header —
    headerBg: '#ffffff',
    headerTextColor: '#1d1d1f',
    headerLetterSpacing: 1,
    headerFontWeight: '700',
    headerTextTransform: 'none',
    headerBorderBottomColor: 'rgba(0,0,0,0.05)',
    headerBorderBottomWidth: 1,

    // — Inputs —
    inputBorderColor: 'rgba(0,0,0,0.1)',
    inputBorderWidth: 1,
    inputBorderRadius: 10,
    inputTextColor: '#1d1d1f',
    inputPlaceholderColor: 'rgba(0,0,0,0.4)',
    inputGlowColor: 'transparent',

    // — Labels —
    labelColor: 'rgba(0,0,0,0.6)',
    labelLetterSpacing: 0.5,
    labelFontWeight: '400',

    // — Mode toggle —
    modeToggleBg: '#e5e5ea',
    modeToggleBorderColor: 'rgba(0,0,0,0.05)',
    modeToggleBorderRadius: 20,
    modeActiveBg: '#333333',
    modeActiveBorderColor: '#1d1d1f',
    modeTextColor: '#1d1d1f',
    modeActiveTextColor: '#ffffff',

    // — Button —
    btnBg: '#333333',
    btnTextColor: '#ffffff',
    btnBorderColor: '#1d1d1f',
    btnBorderRadius: 12,
    btnElevation: 4,
    btnLetterSpacing: 1,

    // — Error —
    errorColor: '#ff3b30',

    // — Sistema —
    statusBarStyle: 'dark-content',
    modalBorderWidth: 1,

    // — Decoradores —
    hasBevel: false,
    hasScanlines: false,
    hasEngravedText: false,
  },

  'theme-pastel': {
    // — Backward compat —
    background: '#ffffff',
    primary: '#ffb2cc',
    text: '#5a4b4b',
    inputBg: '#fdf9f9',
    card: '#ffffff',
    font: 'System',
    variants: [
      { id: 'Rosa Fresa', label: 'Rosa Fresa', color: '#ffb2cc' },
      { id: 'Amarillo Vainilla', label: 'Vainilla', color: '#ebe75d' },
      { id: 'Naranja Durazno', label: 'Durazno', color: '#fccfaf' },
      { id: 'Verde Menta', label: 'Menta', color: '#b5ead7' },
    ],

    // — Pantalla —
    screenBg: '#fefaf1',

    // — Cards —
    cardBorderColor: '#ffe4e1',
    cardBorderWidth: 2,
    cardBorderRadius: 24,
    cardElevation: 6,
    cardShadowColor: '#ffb2cc',

    // — Header —
    headerBg: '#ffb2cc',
    headerTextColor: '#ffffff',
    headerLetterSpacing: 1,
    headerFontWeight: '900',
    headerTextTransform: 'uppercase',
    headerBorderBottomColor: '#ffc0cb',
    headerBorderBottomWidth: 3,

    // — Inputs —
    inputBorderColor: '#ffc0cb',
    inputBorderWidth: 2,
    inputBorderRadius: 15,
    inputTextColor: '#5a4b4b',
    inputPlaceholderColor: 'rgba(90,75,75,0.4)',
    inputGlowColor: 'transparent',

    // — Labels —
    labelColor: '#d4a5a5',
    labelLetterSpacing: 1,
    labelFontWeight: '900',

    // — Mode toggle —
    modeToggleBg: '#fdf0f0',
    modeToggleBorderColor: '#ffc0cb',
    modeToggleBorderRadius: 25,
    modeActiveBg: '#ffb2cc',
    modeActiveBorderColor: '#ffffff',
    modeTextColor: '#ffb2cc',
    modeActiveTextColor: '#ffffff',

    // — Button —
    btnBg: '#ffb2cc',
    btnTextColor: '#ffffff',
    btnBorderColor: '#ffffff',
    btnBorderRadius: 20,
    btnElevation: 4,
    btnLetterSpacing: 1,

    // — Error —
    errorColor: '#ff8fa3',

    // — Sistema —
    statusBarStyle: 'dark-content',
    modalBorderWidth: 1,

    // — Decoradores —
    hasBevel: false,
    hasScanlines: false,
    hasEngravedText: false,
  },

  'theme-stone': {
    // — Backward compat —
    background: '#2b2b2b',
    primary: '#666666',
    text: '#e0e5ec',
    inputBg: 'rgba(0,0,0,0.2)',
    card: '#3d3d3d',
    font: 'System',
    variants: [
      { id: 'Gris Volcánico (Original)', label: 'Gris', color: '#666666' },
      { id: 'Rojo Ladrillo', label: 'Ladrillo', color: '#cc5544' },
      { id: 'Verde Musgo', label: 'Musgo', color: '#4a5d23' },
    ],

    // — Pantalla —
    screenBg: '#1a1a1a',

    // — Cards —
    cardBorderColor: '#4a4a4a',
    cardBorderWidth: 4,
    cardBorderRadius: 4,
    cardElevation: 10,
    cardShadowColor: '#000',

    // — Header —
    headerBg: '#1a1a1a',
    headerTextColor: '#e0e5ec',
    headerLetterSpacing: 2,
    headerFontWeight: '900',
    headerTextTransform: 'uppercase',
    headerBorderBottomColor: '#333333',
    headerBorderBottomWidth: 4,

    // — Inputs —
    inputBorderColor: '#555555',
    inputBorderWidth: 2,
    inputBorderRadius: 0,
    inputTextColor: '#e0e5ec',
    inputPlaceholderColor: 'rgba(224,229,236,0.3)',
    inputGlowColor: 'transparent',

    // — Labels —
    labelColor: '#999999',
    labelLetterSpacing: 1.5,
    labelFontWeight: '900',

    // — Mode toggle —
    modeToggleBg: 'rgba(0,0,0,0.3)',
    modeToggleBorderColor: '#444444',
    modeToggleBorderRadius: 2,
    modeActiveBg: '#666666',
    modeActiveBorderColor: '#999999',
    modeTextColor: '#666666',
    modeActiveTextColor: '#ffffff',

    // — Button —
    btnBg: '#666666',
    btnTextColor: '#ffffff',
    btnBorderColor: '#888888',
    btnBorderRadius: 0,
    btnElevation: 6,
    btnLetterSpacing: 2,

    // — Error —
    errorColor: '#a52a2a',

    // — Sistema —
    statusBarStyle: 'light-content',
    modalBorderWidth: 2,

    // — Decoradores —
    hasBevel: false,
    hasScanlines: false,
    hasEngravedText: false,
  },

  'theme-laser': {
    // — Backward compat —
    background: '#000000',
    primary: '#ff0000',
    text: '#ffffff',
    inputBg: 'rgba(255,0,0,0.05)',
    card: 'rgba(10,0,0,0.95)',
    font: 'System',
    variants: [
      { id: 'Rojo Peligro', label: 'Rojo', color: '#ff0000' },
      { id: 'Verde Radiactivo', label: 'Verde', color: '#00ff00' },
      { id: 'Amarillo Precaución', label: 'Amarillo', color: '#ffff00' },
      { id: 'Morado Galáctico', label: 'Morado', color: '#bf00ff' },
    ],

    // — Pantalla —
    screenBg: '#000000',

    // — Cards —
    cardBorderColor: '#ff0000',
    cardBorderWidth: 1,
    cardBorderRadius: 0,
    cardElevation: 0,
    cardShadowColor: '#ff0000',

    // — Header —
    headerBg: '#000000',
    headerTextColor: '#ffffff',
    headerLetterSpacing: 4,
    headerFontWeight: '900',
    headerTextTransform: 'uppercase',
    headerBorderBottomColor: '#ff0000',
    headerBorderBottomWidth: 1,

    // — Inputs —
    inputBorderColor: '#ff0000',
    inputBorderWidth: 1,
    inputBorderRadius: 0,
    inputTextColor: '#ffffff',
    inputPlaceholderColor: 'rgba(255,255,255,0.3)',
    inputGlowColor: '#ff0000',

    // — Labels —
    labelColor: '#ff0000',
    labelLetterSpacing: 2,
    labelFontWeight: '900',

    // — Mode toggle —
    modeToggleBg: 'transparent',
    modeToggleBorderColor: '#ff0000',
    modeToggleBorderRadius: 0,
    modeActiveBg: '#ff0000',
    modeActiveBorderColor: '#ffffff',
    modeTextColor: '#ff0000',
    modeActiveTextColor: '#ffffff',

    // — Button —
    btnBg: 'transparent',
    btnTextColor: '#ffffff',
    btnBorderColor: '#ff0000',
    btnBorderRadius: 0,
    btnElevation: 0,
    btnLetterSpacing: 3,

    // — Error —
    errorColor: '#ff0000',

    // — Sistema —
    statusBarStyle: 'light-content',
    modalBorderWidth: 1,

    // — Decoradores —
    hasBevel: false,
    hasScanlines: false,
    hasEngravedText: false,
  },

  'theme-paper': {
    // — Backward compat —
    background: '#ffffff',
    primary: '#1e548f',
    text: '#333333',
    inputBg: '#f8f8f8',
    card: '#fdfdfd',
    font: 'System',
    variants: [
      { id: 'Hoja de Cuaderno', label: 'Cuaderno', color: '#fdfdfd' },
      { id: 'Pergamino Antiguo', label: 'Pergamino', color: '#f4e8c1' },
      { id: 'Nota Adhesiva', label: 'Nota', color: '#fef178' },
      { id: 'Plano Arquitectónico', label: 'Plano', color: '#1e548f' },
    ],

    // — Pantalla —
    screenBg: '#e0e0e0',

    // — Cards —
    cardBorderColor: 'rgba(0,0,0,0.05)',
    cardBorderWidth: 1,
    cardBorderRadius: 4,
    cardElevation: 3,
    cardShadowColor: 'rgba(0,0,0,0.2)',

    // — Header —
    headerBg: '#1e548f',
    headerTextColor: '#ffffff',
    headerLetterSpacing: 1,
    headerFontWeight: '700',
    headerTextTransform: 'none',
    headerBorderBottomColor: 'rgba(0,0,0,0.1)',
    headerBorderBottomWidth: 1,

    // — Inputs —
    inputBorderColor: 'rgba(0,0,0,0.1)',
    inputBorderWidth: 1,
    inputBorderRadius: 4,
    inputTextColor: '#333333',
    inputPlaceholderColor: 'rgba(0,0,0,0.3)',
    inputGlowColor: 'transparent',

    // — Labels —
    labelColor: '#666666',
    labelLetterSpacing: 1,
    labelFontWeight: '400',

    // — Mode toggle —
    modeToggleBg: '#dcdcdc',
    modeToggleBorderColor: 'rgba(0,0,0,0.1)',
    modeToggleBorderRadius: 4,
    modeActiveBg: '#1e548f',
    modeActiveBorderColor: '#ffffff',
    modeTextColor: '#1e548f',
    modeActiveTextColor: '#ffffff',

    // — Button —
    btnBg: '#1e548f',
    btnTextColor: '#ffffff',
    btnBorderColor: 'rgba(0,0,0,0.1)',
    btnBorderRadius: 4,
    btnElevation: 4,
    btnLetterSpacing: 1,

    // — Error —
    errorColor: '#b22222',

    // — Sistema —
    statusBarStyle: 'dark-content',
    modalBorderWidth: 1,

    // — Decoradores —
    hasBevel: false,
    hasScanlines: false,
    hasEngravedText: false,
  },
};

export type ThemeKey = keyof typeof Themes;