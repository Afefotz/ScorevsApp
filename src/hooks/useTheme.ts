import { useMemo } from 'react';
import { Themes, ThemeKey, ThemeConfig } from '../config/Themes';

/**
 * Resuelve el ThemeConfig activo para la clave dada.
 * useMemo garantiza referencia estable mientras la clave no cambie
 * (regla rerender-memo — evita re-renders innecesarios en consumidores).
 */
export const useTheme = (key: ThemeKey, variantId?: string): ThemeConfig => {
  return useMemo(() => {
    const baseTheme = Themes[key] ?? Themes['theme-metal'];
    
    // Si no hay variantId, usar los defaults de la base
    if (!variantId || !baseTheme.variants) {
      return baseTheme;
    }

    const matchedVariant = baseTheme.variants.find(v => v.id === variantId);
    
    // Si la variante tiene overrides, los fusionamos sobre el tema base
    if (matchedVariant && matchedVariant.overrides) {
      return { ...baseTheme, ...matchedVariant.overrides };
    }
    
    return baseTheme;
  }, [key, variantId]);
};
