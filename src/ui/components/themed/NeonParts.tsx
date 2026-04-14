/**
 * NeonParts.tsx
 * Micro-componentes decorativos estilo Neon/CRT.
 * React.memo: contenido estático → sin re-renders.
 */
import React from 'react';
import { View, Text, Platform, StyleSheet } from 'react-native';

const MONO_FONT = Platform.OS === 'android' ? 'monospace' : 'Courier New';

/** Línea horizontal con glow de color */
export const NeonScanline = React.memo<{ color: string }>(({ color }) => (
  <View
    style={{
      height: 1,
      backgroundColor: color,
      opacity: 0.3,
      marginVertical: 6,
      shadowColor: color,
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.8,
      shadowRadius: 4,
    }}
  />
));

/** Fondo de Circuitos / Rejilla CRT */
export const NeonCircuitBackground = React.memo(({ color }: { color: string }) => (
  <View style={StyleSheet.absoluteFill} pointerEvents="none">
    {/* Líneas horizontales sutiles (look CRT) */}
    {[...Array(30)].map((_, i) => (
      <View key={`crt-${i}`} style={[styles.scanlineFixed, { top: `${i * 3.33}%` }]} />
    ))}
    {/* Micro-circuitos en las esquinas */}
    <View style={[styles.node, { top: 40, left: 20, borderColor: color }]} />
    <View style={[styles.node, { bottom: 60, right: 30, borderColor: color }]} />
  </View>
));

/** Fila decorativa superior "// SCORE.SYSTEM.v2 //" */
export const NeonDecoRow = React.memo<{ color?: string }>(({ color = 'rgba(0,255,255,0.35)' }) => (
  <View style={{ marginBottom: 10, alignItems: 'center' }}>
    <Text
      style={{
        color: color,
        opacity: 0.4,
        fontSize: 11,
        letterSpacing: 2,
        fontFamily: MONO_FONT,
      }}
    >
      {'// SCORE.SYSTEM.v2 //'}
    </Text>
  </View>
));

/** Pie decorativo "[ SCALAR OVERLAY SYSTEM ]" */
export const NeonFooter = React.memo<{ color?: string }>(({ color = 'rgba(0,255,255,0.3)' }) => (
  <Text
    style={{
      color: color,
      opacity: 0.3,
      fontSize: 10,
      letterSpacing: 2,
      textAlign: 'center',
      marginTop: 14,
      fontFamily: MONO_FONT,
    }}
  >
    {'[ SCALAR OVERLAY SYSTEM ]'}
  </Text>
));

/** Decorador interno para tarjetas Neón (borde interno brillante sutil) */
export const NeonCardDecor = React.memo(({ color }: { color: string }) => (
  <View style={StyleSheet.absoluteFill} pointerEvents="none">
    <View style={[styles.innerGlow, { borderColor: color, shadowColor: color }]} />
  </View>
));

const styles = StyleSheet.create({
  scanlineFixed: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: 'rgba(0, 255, 255, 0.03)',
  },
  node: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderWidth: 0.5,
    opacity: 0.1,
    transform: [{ rotate: '45deg' }],
  },
  innerGlow: {
    ...StyleSheet.absoluteFillObject,
    borderWidth: 1,
    opacity: 0.2,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
  }
});
