/**
 * PastelParts.tsx
 * Micro-componentes decorativos de estilo pastel (burbujas, formas suaves).
 * React.memo: contenido estático → sin re-renders.
 */
import React from 'react';
import { View, StyleSheet } from 'react-native';

/** Burbuja suave o pompón */
const SoftBubble = React.memo<{ size: number; color: string; style?: any }>(({ size, color, style }) => (
  <View style={[
    styles.bubble,
    { width: size, height: size, borderRadius: size / 2, backgroundColor: color },
    style
  ]} />
));

/** Tira decorativa con diseño pastel (como confeti suave) */
export const PastelConfettiDecor = React.memo<{ primaryColor: string }>(({ primaryColor }) => (
  <View style={styles.decorContainer}>
    <SoftBubble size={12} color={primaryColor} style={{ opacity: 0.6 }} />
    <SoftBubble size={8} color="#ffe4e1" style={{ opacity: 0.8, marginTop: -8 }} />
    <SoftBubble size={16} color={primaryColor} style={{ opacity: 0.4 }} />
    <SoftBubble size={10} color="#ffc0cb" style={{ opacity: 0.9, marginTop: 4 }} />
    <SoftBubble size={14} color={primaryColor} style={{ opacity: 0.5, marginBottom: -6 }} />
  </View>
));

/** Fondo de Puntos (Polka Dots) Suaves */
export const PastelPolkaDotBackground = React.memo(({ color }: { color: string }) => (
  <View style={StyleSheet.absoluteFill} pointerEvents="none">
    <SoftBubble size={100} color={color} style={{ position: 'absolute', top: '5%', left: '10%', opacity: 0.05 }} />
    <SoftBubble size={150} color={color} style={{ position: 'absolute', top: '30%', right: '5%', opacity: 0.03 }} />
    <SoftBubble size={80} color={color} style={{ position: 'absolute', bottom: '20%', left: '15%', opacity: 0.04 }} />
    <SoftBubble size={120} color={color} style={{ position: 'absolute', bottom: '5%', right: '15%', opacity: 0.05 }} />
  </View>
));

/** Fondo de Formas Suaves / Burbujas */
export const PastelShapesBackground = React.memo(({ color }: { color: string }) => (
  <View style={StyleSheet.absoluteFill} pointerEvents="none">
    <SoftBubble size={200} color={color} style={{ position: 'absolute', top: '-5%', right: '-10%', opacity: 0.04 }} />
    <SoftBubble size={250} color={color} style={{ position: 'absolute', bottom: '-10%', left: '-10%', opacity: 0.03 }} />
    <SoftBubble size={100} color="#ffffff" style={{ position: 'absolute', top: '25%', left: '15%', opacity: 0.2 }} />
  </View>
));

const styles = StyleSheet.create({
  decorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 14,
    gap: 12,
  },
  bubble: {
    elevation: 0,
  }
});
