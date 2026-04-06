export const Themes = {
    'theme-win95': {
        background: '#c0c0c0',
        primary: '#000080',
        text: '#000',
        inputBg: '#fff',
        card: '#c0c0c0',
        font: 'System', // ***Aquí cargaremos fuentes personalizadas luego
    },
    'theme-metal': {
        background: '#2c3e50',
        primary: '#ffd700', // Oro
        text: '#fff',
        inputBg: 'rgba(255,255,255,0.1)',
        card: '#34495e',
        font: 'System',
    },
    'theme-neon': {
        background: '#000',
        primary: '#00f3ff',
        text: '#fff',
        inputBg: '#1a1a1a',
        card: '#111',
        font: 'System',
    },
    // Agregaremos el resto progresivamente...
};

export type ThemeKey = keyof typeof Themes;