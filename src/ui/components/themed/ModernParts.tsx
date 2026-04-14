/**
 * ModernParts.tsx
 * Micro-componentes decorativos de estilo Moderno (Flat, minimalista, limpio).
 * React.memo: contenido estático → sin re-renders.
 */
import React from 'react';
import { View, StyleSheet } from 'react-native';

/** Indicador limpio estilo píldora (tipo iOS home bar / drag handle) */
export const ModernPillDecor = React.memo<{ color?: string }>(({ color = 'rgba(150,150,150,0.25)' }) => (
  <View style={styles.container}>
    <View style={[styles.pill, { backgroundColor: color }]} />
  </View>
));

/** Fondo de Auras de Color (Glassmorphism look) */
export const ModernGlowBackground = React.memo(({ color }: { color: string }) => (
  <View style={StyleSheet.absoluteFill} pointerEvents="none">
    <View style={[styles.glow, { top: '-10%', left: '-15%', backgroundColor: color, opacity: 0.05 }]} />
    <View style={[styles.glow, { bottom: '-5%', right: '-10%', backgroundColor: color, opacity: 0.04 }]} />
  </View>
));

/** Fondo de Micro-Grilla Técnica (Minimalista Dark) */
export const ModernTechGridBackground = React.memo(() => (
  <View style={StyleSheet.absoluteFill} pointerEvents="none">
    {[...Array(20)].map((_, i) => (
      <View key={`mtg-${i}`} style={[styles.gridLine, { top: `${i * 5}%` }]} />
    ))}
  </View>
));

/** Decorador interno para tarjetas Modernas (efecto Glassmorphism / brillo especular) */
export const ModernCardDecor = React.memo(() => (
  <View style={StyleSheet.absoluteFill} pointerEvents="none">
    <View style={styles.specular} />
  </View>
));

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 14,
    width: '100%',
  },
  pill: {
    width: 35,
    height: 4,
    borderRadius: 2,
  },
  glow: {
    position: 'absolute',
    width: 400,
    height: 400,
    borderRadius: 200,
  },
  gridLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 0.5,
    backgroundColor: 'rgba(255,255,255,0.03)',
  },
  specular: {
    position: 'absolute',
    top: -50,
    left: -50,
    width: 200,
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.08)',
    transform: [{ rotate: '-45deg' }, { scale: 5 }],
  }
});
