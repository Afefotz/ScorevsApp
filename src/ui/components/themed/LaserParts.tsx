/**
 * LaserParts.tsx
 * Micro-componentes decorativos de estilo Láser (líneas brillantes, sci-fi intenso).
 * React.memo: contenido estático → sin re-renders.
 */
import React from 'react';
import { View, StyleSheet } from 'react-native';

/** Haz de láser horizontal con núcleo brillante y aura de color */
export const LaserBeamDecor = React.memo<{ primaryColor: string }>(({ primaryColor }) => (
  <View style={styles.container}>
    {/* Aura exterior (Glow) */}
    <View style={[
      styles.beam,
      { backgroundColor: primaryColor, shadowColor: primaryColor }
    ]} />
    {/* Núcleo caliente del láser (blanco puro) */}
    <View style={styles.core} />
  </View>
));

/** Fondo de Escaneo Láser (Rojo) */
export const LaserScannerBackground = React.memo(() => (
  <View style={StyleSheet.absoluteFill} pointerEvents="none">
    <View style={[styles.scannerLine, { top: '30%' }]} />
    <View style={[styles.scannerLine, { top: '60%' }]} />
  </View>
));

/** Fondo de Cuadrícula Tecnológica (Verde) */
export const LaserGridBackground = React.memo(({ color }: { color: string }) => (
  <View style={StyleSheet.absoluteFill} pointerEvents="none">
    {[...Array(10)].map((_, i) => (
      <View key={`lg-h-${i}`} style={[styles.gridLineH, { top: `${i * 10}%`, backgroundColor: color }]} />
    ))}
    {[...Array(6)].map((_, i) => (
      <View key={`lg-v-${i}`} style={[styles.gridLineV, { left: `${(i + 1) * 15}%`, backgroundColor: color }]} />
    ))}
  </View>
));

/** Fondo de Resplandor Galáctico (Morado) */
export const LaserGlowBackground = React.memo(({ color }: { color: string }) => (
  <View style={StyleSheet.absoluteFill} pointerEvents="none">
    <View style={[styles.glowPoint, { top: '20%', left: '10%', backgroundColor: color }]} />
    <View style={[styles.glowPoint, { bottom: '20%', right: '10%', backgroundColor: color }]} />
  </View>
));

/** Decorador interno para tarjetas Láser (brackets de HUD / mira en las esquinas) */
export const LaserCardDecor = React.memo(({ color }: { color: string }) => (
  <View style={StyleSheet.absoluteFill} pointerEvents="none">
    <View style={[styles.hudCorner, { top: 6, left: 6, borderTopWidth: 1, borderLeftWidth: 1, borderColor: color }]} />
    <View style={[styles.hudCorner, { top: 6, right: 6, borderTopWidth: 1, borderRightWidth: 1, borderColor: color }]} />
    <View style={[styles.hudCorner, { bottom: 6, left: 6, borderBottomWidth: 1, borderLeftWidth: 1, borderColor: color }]} />
    <View style={[styles.hudCorner, { bottom: 6, right: 6, borderBottomWidth: 1, borderRightWidth: 1, borderColor: color }]} />
  </View>
));

const styles = StyleSheet.create({
  container: {
    marginVertical: 14,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  beam: {
    height: 3,
    width: '70%',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 8,
  },
  core: {
    position: 'absolute',
    height: 1,
    width: '60%',
    backgroundColor: '#ffffff',
    shadowColor: '#ffffff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 2,
  },
  scannerLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: 'rgba(255, 0, 0, 0.5)',
    shadowColor: '#ff0000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
  },
  gridLineH: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 0.5,
    opacity: 0.15,
  },
  gridLineV: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 0.5,
    opacity: 0.15,
  },
  glowPoint: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    opacity: 0.1,
  },
  hudCorner: {
    position: 'absolute',
    width: 10,
    height: 10,
    opacity: 0.8,
  }
});
