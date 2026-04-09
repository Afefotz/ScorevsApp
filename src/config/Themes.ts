export interface ThemeVariant {
    id: string;
    label: string;
    color: string;
}

export interface ThemeConfig {
    background: string;
    primary: string;
    text: string;
    inputBg: string;
    card: string;
    font: string;
    variants?: ThemeVariant[];
}

export const Themes: Record<string, ThemeConfig> = {
    'theme-win95': {
        background: '#c0c0c0',
        primary: '#000080',
        text: '#000',
        inputBg: '#fff',
        card: '#c0c0c0',
        font: 'System',
    },
    'theme-metal': {
        background: '#2c3e50',
        primary: '#ffd700', // Oro
        text: '#fff',
        inputBg: 'rgba(255,255,255,0.1)',
        card: '#34495e',
        font: 'System',
        variants: [
            { id: 'steel', label: 'Acero', color: '#bdc3c7' },
            { id: 'gold', label: 'Oro', color: '#ffd700' },
            { id: 'bronze', label: 'Bronce', color: '#cd7f32' },
        ]
    },
    'theme-neon': {
        background: '#000',
        primary: '#00f3ff',
        text: '#fff',
        inputBg: '#1a1a1a',
        card: '#111',
        font: 'System',
    },
};

export type ThemeKey = keyof typeof Themes;