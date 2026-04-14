import {
  View,
  Text,
  Pressable,
  StyleSheet,
  LayoutAnimation,
  Platform,
  UIManager,
} from 'react-native';
import React, { useCallback } from 'react';
import { Themes, ThemeKey, ThemeConfig } from '../../config/Themes';

// Enable LayoutAnimation on Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

// ─── Per-theme metadata ───────────────────────────────────────────────────────
const THEME_ICONS: Record<string, string> = {
  'theme-win95': '🖥️',
  'theme-metal': '⚙️',
  'theme-neon': '⚡',
  'theme-pastel': '🧁',
  'theme-stone': '🪨',
  'theme-laser': '🎯',
  'theme-paper': '📜',
  'theme-modern': '📱',
  'theme-modern-light': '☀️',
};

const THEME_LABELS: Record<string, string> = {
  'theme-win95': 'WIN 95',
  'theme-metal': 'METAL',
  'theme-neon': 'NEON',
  'theme-pastel': 'PASTEL',
  'theme-stone': 'STONE',
  'theme-laser': 'LASER',
  'theme-paper': 'PAPER',
  'theme-modern': 'MODERN',
  'theme-modern-light': 'LIGHT',
};

// ─── Visual style per theme key ───────────────────────────────────────────────
type CellTheme = 'win95' | 'neon' | 'metal' | 'pastel' | 'stone' | 'laser' | 'paper' | 'modern' | 'modern-light' | 'default';

const getCellTheme = (key: string): CellTheme => {
  if (key === 'theme-win95') return 'win95';
  if (key === 'theme-neon') return 'neon';
  if (key === 'theme-metal') return 'metal';
  if (key === 'theme-pastel') return 'pastel';
  if (key === 'theme-stone') return 'stone';
  if (key === 'theme-laser') return 'laser';
  if (key === 'theme-paper') return 'paper';
  if (key === 'theme-modern') return 'modern';
  if (key === 'theme-modern-light') return 'modern-light';
  return 'default';
};

// ─── Types ────────────────────────────────────────────────────────────────────
interface ThemeSelectorGridProps {
  selectedTheme: ThemeKey;
  onSelectTheme: (theme: ThemeKey) => void;
  accentColor: string;
  textColor: string;
}

interface ThemeCellProps {
  themeKey: ThemeKey;
  config: ThemeConfig;
  isSelected: boolean;
  accentColor: string;
  /** Visual mode driven by the CURRENTLY ACTIVE theme (not this cell's theme) */
  activeMode: CellTheme;
  onPress: (theme: ThemeKey) => void;
}

// ─── ThemeCell ────────────────────────────────────────────────────────────────
const ThemeCell: React.FC<ThemeCellProps> = React.memo(
  ({ themeKey, config, isSelected, accentColor, activeMode, onPress }) => {
    const handlePress = useCallback(() => {
      LayoutAnimation.configureNext({
        duration: 220,
        create: { type: 'easeInEaseOut', property: 'opacity' },
        update: { type: 'spring', springDamping: 0.72 },
      });
      onPress(themeKey);
    }, [themeKey, onPress]);

    const icon = THEME_ICONS[themeKey] ?? '🎨';
    const label = THEME_LABELS[themeKey] ?? themeKey.replace('theme-', '').toUpperCase();
    const palette: string[] = [config.background, config.primary, config.card];

    // ── Per active-mode cell appearance ────────────────────────────────────
    const getCellStyle = () => {
      switch (activeMode) {
        case 'win95':
          return {
            // In Win95 mode, buttons are ALWAYS gray (#c0c0c0) unless selected.
            // Using config.background (black for neon) makes it invisible.
            backgroundColor: isSelected ? '#000080' : '#c0c0c0',
            borderRadius: 0,
            borderTopWidth: 2, borderLeftWidth: 2, borderRightWidth: 2, borderBottomWidth: 2,
            borderTopColor: isSelected ? '#808080' : '#fff',
            borderLeftColor: isSelected ? '#808080' : '#fff',
            borderRightColor: isSelected ? '#fff' : '#808080',
            borderBottomColor: isSelected ? '#fff' : '#808080',
            elevation: isSelected ? 0 : 2,
            shadowColor: 'transparent',
          };
        case 'neon':
          return {
            backgroundColor: isSelected ? 'rgba(0,255,255,0.08)' : 'rgba(10,10,20,0.95)',
            borderRadius: 0,
            borderWidth: 1,
            borderColor: isSelected ? config.primary : 'rgba(0,255,255,0.15)',
            shadowColor: isSelected ? config.primary : 'transparent',
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: isSelected ? 0.9 : 0,
            shadowRadius: isSelected ? 12 : 0,
            elevation: 0,
          };
        case 'metal':
          return {
            backgroundColor: isSelected ? 'rgba(255, 215, 0, 0.1)' : '#34495e',
            borderRadius: 6,
            borderWidth: 1,
            borderColor: isSelected ? config.primary : 'rgba(0,0,0,0.4)',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: isSelected ? 4 : 2 },
            shadowOpacity: isSelected ? 0.55 : 0.3,
            shadowRadius: isSelected ? 8 : 4,
            elevation: isSelected ? 8 : 3,
          };
        case 'pastel':
          return {
            backgroundColor: isSelected ? 'rgba(255, 178, 204, 0.15)' : '#ffffff',
            borderRadius: 20,
            borderWidth: 2,
            borderColor: isSelected ? config.primary : '#ffe4e1',
            shadowColor: config.primary,
            shadowOffset: { width: 0, height: isSelected ? 4 : 2 },
            shadowOpacity: isSelected ? 0.3 : 0.1,
            shadowRadius: isSelected ? 8 : 4,
            elevation: isSelected ? 4 : 2,
          };
        case 'stone':
          return {
            backgroundColor: isSelected ? '#4a4a4a' : '#2b2b2b',
            borderRadius: 4,
            borderTopWidth: 2,
            borderLeftWidth: 2,
            borderBottomWidth: 4,
            borderRightWidth: 3,
            borderTopColor: isSelected ? '#777' : '#555',
            borderLeftColor: isSelected ? '#777' : '#555',
            borderBottomColor: '#111',
            borderRightColor: '#1a1a1a',
            elevation: isSelected ? 8 : 4,
          };
        case 'laser':
          return {
            backgroundColor: '#000000',
            borderRadius: 0,
            borderWidth: 1,
            borderColor: isSelected ? config.primary : 'rgba(255,255,255,0.15)',
            shadowColor: isSelected ? config.primary : 'transparent',
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: isSelected ? 1 : 0,
            shadowRadius: isSelected ? 12 : 0,
            elevation: 0,
          };
        case 'paper':
          return {
            backgroundColor: isSelected ? '#ffffff' : '#f4e8c1',
            borderRadius: 2,
            borderWidth: 1,
            borderColor: isSelected ? config.primary : 'rgba(0,0,0,0.1)',
            shadowColor: '#000',
            shadowOffset: { width: 1, height: isSelected ? 4 : 2 },
            shadowOpacity: isSelected ? 0.3 : 0.15,
            shadowRadius: isSelected ? 6 : 2,
            elevation: isSelected ? 6 : 2,
          };
        case 'modern':
          return {
            backgroundColor: config.card,
            borderRadius: 16,
            borderWidth: isSelected ? 2 : 1,
            borderColor: isSelected ? config.primary : 'rgba(255,255,255,0.08)',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: isSelected ? 0.3 : 0.1,
            shadowRadius: 4,
            elevation: isSelected ? 4 : 2,
          };
        case 'modern-light':
          return {
            backgroundColor: config.card,
            borderRadius: 16,
            borderWidth: isSelected ? 2 : 1,
            borderColor: isSelected ? config.primary : 'rgba(0,0,0,0.05)',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: isSelected ? 0.15 : 0.05,
            shadowRadius: 4,
            elevation: isSelected ? 4 : 2,
          };
        default:
          return {
            backgroundColor: config.card,
            borderRadius: 14,
            borderWidth: isSelected ? 2.5 : 2,
            borderColor: isSelected ? accentColor : 'transparent',
            elevation: isSelected ? 10 : 4,
          };
      }
    };

    const getLabelStyle = () => {
      switch (activeMode) {
        case 'win95':
          return {
            color: isSelected ? '#fff' : '#000',
            fontSize: 9,
            letterSpacing: 0.1,
            fontWeight: '700' as const,
          };
        case 'neon':
          return {
            color: isSelected ? config.primary : 'rgba(0,255,255,0.5)',
            fontSize: 9,
            letterSpacing: 1.2,
            fontWeight: '900' as const,
            textShadowColor: isSelected ? config.primary : 'transparent',
            textShadowOffset: { width: 0, height: 0 },
            textShadowRadius: isSelected ? 6 : 0,
            fontFamily: Platform.OS === 'android' ? 'monospace' : 'Courier New',
          };
        case 'metal':
          return {
            color: isSelected ? config.primary : '#e0e5ec',
            fontSize: 9,
            letterSpacing: 1,
            fontWeight: '900' as const,
            textShadowColor: isSelected ? 'rgba(255,215,0,0.3)' : 'rgba(255,255,255,0.1)',
            textShadowOffset: { width: 1, height: 1 },
            textShadowRadius: 1,
          };
        case 'pastel':
          return {
            color: isSelected ? '#5a4b4b' : '#d4a5a5',
            fontSize: 9,
            letterSpacing: 1,
            fontWeight: '900' as const,
          };
        case 'stone':
          return {
            color: isSelected ? config.primary : '#999',
            fontSize: 9,
            letterSpacing: 1.5,
            fontWeight: '900' as const,
            textShadowColor: 'rgba(0,0,0,0.8)',
            textShadowOffset: { width: 1, height: 1 },
            textShadowRadius: 0,
          };
        case 'laser':
          return {
            color: isSelected ? config.primary : 'rgba(255,255,255,0.4)',
            fontSize: 9,
            letterSpacing: 2,
            fontWeight: '900' as const,
            textShadowColor: isSelected ? config.primary : 'transparent',
            textShadowOffset: { width: 0, height: 0 },
            textShadowRadius: isSelected ? 8 : 0,
          };
        case 'paper':
          return {
            color: isSelected ? config.primary : '#666',
            fontSize: 10,
            letterSpacing: 0,
            fontWeight: '600' as const,
            fontStyle: 'italic',
            fontFamily: Platform.OS === 'ios' ? 'Palatino' : 'serif',
          };
        case 'modern':
        case 'modern-light':
          return {
            color: isSelected ? config.primary : config.text,
            fontSize: 9,
            letterSpacing: 0.5,
            fontWeight: isSelected ? '700' as const : '400' as const,
            opacity: isSelected ? 1 : 0.7,
          };
        default:
          return {
            color: config.text,
            fontSize: 9,
            letterSpacing: 0.8,
            fontWeight: isSelected ? '900' as const : '600' as const,
          };
      }
    };

    const cellStyle = getCellStyle();
    const labelStyle = getLabelStyle();

    // Neon prefix
    const displayLabel = activeMode === 'neon' ? `>${label}` : label;

    return (
      <Pressable
        onPress={handlePress}
        style={({ pressed }) => [
          styles.cell,
          cellStyle,
          pressed && styles.cellPressed,
          !isSelected && activeMode !== 'win95' && styles.cellUnselected,
        ]}
        accessibilityRole="button"
        accessibilityLabel={`Seleccionar tema ${label}`}
        accessibilityState={{ selected: isSelected }}
      >
        {/* Neon: selected top accent bar */}
        {activeMode === 'neon' && isSelected && (
          <View style={styles.neonAccentBar} />
        )}

        {/* Metal: inner highlight top stripe */}
        {activeMode === 'metal' && (
          <View style={styles.metalHighlightStripe} />
        )}

        {/* Glow overlay for neon/metal selected */}
        {isSelected && (activeMode === 'neon' || activeMode === 'metal') && (
          <View style={[
            styles.glowOverlay,
            {
              backgroundColor: accentColor,
              opacity: activeMode === 'neon' ? 0.07 : 0.1,
            },
          ]} />
        )}

        {/* Icon */}
        <Text style={[styles.cellIcon, activeMode === 'neon' && !isSelected && { opacity: 0.4 }]}>
          {icon}
        </Text>

        {/* Label */}
        <Text style={[styles.cellLabel, labelStyle]} numberOfLines={1}>
          {displayLabel}
        </Text>

        {/* Palette strip */}
        <View style={[
          styles.paletteRow,
          activeMode === 'win95' && { borderTopWidth: 1, borderTopColor: '#808080', borderRadius: 0, height: 8 },
          activeMode === 'neon' && { borderTopWidth: 1, borderTopColor: 'rgba(0,255,255,0.2)', borderRadius: 0 },
        ]}>
          {palette.map((color, idx) => (
            <View key={idx} style={[
              styles.paletteChip,
              { backgroundColor: color },
              activeMode === 'win95' && { borderRadius: 0 },
            ]} />
          ))}
        </View>

        {/* Win95: active checkmark */}
        {activeMode === 'win95' && isSelected && (
          <View style={styles.win95Check}>
            <Text style={{ color: '#fff', fontSize: 8, fontWeight: '900' }}>✓</Text>
          </View>
        )}

        {/* Neon: active dot */}
        {activeMode === 'neon' && isSelected && (
          <View style={[styles.activeDot, { backgroundColor: '#0ff', shadowColor: '#0ff', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 1, shadowRadius: 4 }]} />
        )}

        {/* Metal: active dot */}
        {activeMode === 'metal' && isSelected && (
          <View style={[styles.activeDot, { backgroundColor: accentColor }]} />
        )}

        {/* Pastel: active dot */}
        {activeMode === 'pastel' && isSelected && (
          <View style={[styles.activeDot, { backgroundColor: config.primary, borderRadius: 5, width: 10, height: 10, right: 8, top: 8 }]} />
        )}

        {/* Stone: active heavy block */}
        {activeMode === 'stone' && isSelected && (
          <View style={[styles.activeDot, { backgroundColor: config.primary, borderRadius: 0, width: 8, height: 8, right: 6, top: 6, borderWidth: 1, borderColor: '#111' }]} />
        )}

        {/* Laser: lower glowing line */}
        {activeMode === 'laser' && isSelected && (
          <View style={[styles.activeDot, { backgroundColor: '#ffffff', borderRadius: 0, width: '100%', height: 2, right: 0, bottom: 0, top: undefined, shadowColor: config.primary, shadowOffset: { width:0, height:0}, shadowOpacity: 1, shadowRadius: 6 }]} />
        )}

        {/* Paper: folded corner effect */}
        {activeMode === 'paper' && isSelected && (
          <View style={{ position: 'absolute', top: 0, right: 0, width: 0, height: 0, borderBottomWidth: 12, borderRightWidth: 12, borderRightColor: 'transparent', borderBottomColor: 'rgba(0,0,0,0.1)' }} />
        )}

        {/* Modern/Light: active subtle dot */}
        {(activeMode === 'modern' || activeMode === 'modern-light') && isSelected && (
          <View style={[styles.activeDot, { backgroundColor: config.primary, borderRadius: 3, width: 6, height: 6, right: 10, top: 10 }]} />
        )}
      </Pressable>
    );
  },
);

// ─── ThemeSelectorGrid ────────────────────────────────────────────────────────
export const ThemeSelectorGrid: React.FC<ThemeSelectorGridProps> = ({
  selectedTheme,
  onSelectTheme,
  accentColor,
  textColor,
}) => {
  const themeKeys = Object.keys(Themes) as ThemeKey[];
  const activeMode = getCellTheme(selectedTheme);

  const getSectionLabelStyle = () => {
    switch (activeMode) {
      case 'win95': return {
        color: '#000', fontSize: 12, fontWeight: '700' as const,
        letterSpacing: 0, textTransform: 'none' as const, opacity: 1,
      };
      case 'neon': return {
        color: '#f0f', fontSize: 10, fontWeight: '700' as const,
        letterSpacing: 2, textTransform: 'uppercase' as const,
        textShadowColor: '#f0f', textShadowOffset: { width: 0, height: 0 }, textShadowRadius: 6,
        fontFamily: Platform.OS === 'android' ? 'monospace' : 'Courier New',
      };
      case 'metal': return {
        color: '#e0e5ec', fontSize: 10, fontWeight: '900' as const,
        letterSpacing: 2, textTransform: 'uppercase' as const,
        textShadowColor: 'rgba(255,255,255,0.5)',
        textShadowOffset: { width: 1, height: 1 }, textShadowRadius: 1,
      };
      case 'pastel': return {
        color: '#ff8fa3', fontSize: 11, fontWeight: '900' as const,
        letterSpacing: 1, textTransform: 'uppercase' as const, opacity: 0.9,
      };
      case 'stone': return {
        color: '#a5a5a5', fontSize: 11, fontWeight: '900' as const,
        letterSpacing: 2, textTransform: 'uppercase' as const,
        textShadowColor: '#000', textShadowOffset: { width: 1, height: 1 }, textShadowRadius: 0,
      };
      case 'laser': return {
        color: textColor, fontSize: 11, fontWeight: '900' as const,
        letterSpacing: 4, textTransform: 'uppercase' as const,
        textShadowColor: accentColor, textShadowOffset: { width: 0, height: 0 }, textShadowRadius: 8,
      };
      case 'paper': return {
        color: '#444444', fontSize: 14, fontWeight: '600' as const,
        letterSpacing: 0, textTransform: 'capitalize' as const, opacity: 0.8,
        fontFamily: Platform.OS === 'ios' ? 'Palatino' : 'serif', fontStyle: 'italic',
      };
      case 'modern': 
      case 'modern-light': 
        return {
          color: textColor, fontSize: 11, fontWeight: '700' as const,
          letterSpacing: 1, textTransform: 'uppercase' as const, opacity: 0.9,
        };
      default: return {
        color: textColor, fontSize: 11, fontWeight: '700' as const,
        letterSpacing: 1.5, textTransform: 'uppercase' as const, opacity: 0.7,
      };
    }
  };

  const sectionLabel = activeMode === 'win95'
    ? 'Selecciona un estilo de ventana:'
    : activeMode === 'neon'
    ? '// SELECCIONA TEMA'
    : activeMode === 'pastel'
    ? 'Elige tu sabor 🧁'
    : activeMode === 'stone'
    ? 'TALLA TU TABLERO 🪨'
    : activeMode === 'laser'
    ? 'FIJA TU OBJETIVO 🎯'
    : activeMode === 'paper'
    ? 'Redacta tu historia 📜'
    : activeMode === 'modern' || activeMode === 'modern-light'
    ? 'UX MINIMALISTA 📱'
    : 'SELECCIONAR ESTILO';

  return (
    <View style={[
      styles.container,
      activeMode === 'neon' && {
        borderTopWidth: 1,
        borderTopColor: 'rgba(0,255,255,0.2)',
        paddingTop: 12,
      },
      activeMode === 'metal' && {
        borderTopWidth: 1,
        borderTopColor: 'rgba(0,0,0,0.4)',
        // Simulated top inner highlight
        shadowColor: 'rgba(255,255,255,0.3)',
        paddingTop: 14,
      },
    ]}>
      <Text style={[styles.sectionLabel, getSectionLabelStyle()]}>
        {sectionLabel}
      </Text>

      <View style={[
        styles.grid,
        activeMode === 'win95' && { gap: 6 },
        activeMode === 'neon' && { gap: 8 },
        activeMode === 'metal' && { gap: 10 },
      ]}>
        {themeKeys.map((key) => (
          <ThemeCell
            key={key}
            themeKey={key}
            config={Themes[key]}
            isSelected={selectedTheme === key}
            accentColor={accentColor}
            activeMode={activeMode}
            onPress={onSelectTheme}
          />
        ))}
      </View>
    </View>
  );
};

// ─── Styles ───────────────────────────────────────────────────────────────────
const CELL_SIZE = 90;

const styles = StyleSheet.create({
  container: {
    marginTop: 8,
    marginBottom: 20,
  },
  sectionLabel: {
    marginBottom: 10,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  cell: {
    width: CELL_SIZE,
    height: CELL_SIZE,
    padding: 8,
    justifyContent: 'space-between',
    overflow: 'hidden',
  },
  cellUnselected: {
    opacity: 0.6,
  },
  cellPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.95 }],
  },
  glowOverlay: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    borderRadius: 4,
  },
  neonAccentBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: '#0ff',
    shadowColor: '#0ff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 6,
  },
  metalHighlightStripe: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  cellIcon: {
    fontSize: 24,
    textAlign: 'center',
  },
  cellLabel: {
    textAlign: 'center',
    textTransform: 'uppercase',
  },
  paletteRow: {
    flexDirection: 'row',
    height: 7,
    borderRadius: 3,
    overflow: 'hidden',
    gap: 2,
  },
  paletteChip: {
    flex: 1,
    borderRadius: 2,
  },
  activeDot: {
    position: 'absolute',
    top: 5,
    right: 5,
    width: 7,
    height: 7,
    borderRadius: 4,
  },
  win95Check: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 14,
    height: 14,
    backgroundColor: '#000080',
    borderWidth: 1,
    borderColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
