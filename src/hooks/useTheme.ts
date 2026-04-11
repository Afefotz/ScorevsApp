import { useMemo } from 'react';
import { Themes, ThemeKey, ThemeConfig } from '../config/Themes';

/**
 * Resuelve el ThemeConfig activo para la clave dada.
 * useMemo garantiza referencia estable mientras la clave no cambie
 * (regla rerender-memo — evita re-renders innecesarios en consumidores).
 */
export const useTheme = (key: ThemeKey): ThemeConfig =>
  useMemo(() => Themes[key] ?? Themes['theme-metal'], [key]);
