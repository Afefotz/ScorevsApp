/**
 * MetalParts.tsx
 * Micro-componentes decorativos de metal (remaches, grabados, etc).
 * React.memo: contenido estático → sin re-renders.
 */
import React from 'react';
import { View, StyleSheet } from 'react-native';

/** Remache o tornillo metálico individual */
export const MetalRivet = React.memo(() => (
  <View style={styles.rivet}>
    <View style={styles.rivetInner} />
  </View>
));

/** Tira decorativa de metal para separar elementos (como entre los marcadores) */
export const MetalStripDecor = React.memo(() => (
  <View style={styles.decorContainer}>
    <MetalRivet />
    <View style={styles.line} />
    <MetalRivet />
  </View>
));

/** Fondo de Panel Metálico (con textura cepillada y remaches) */
export const MetalPanelBackground = React.memo(({ color }: { color: string }) => (
  <View style={StyleSheet.absoluteFill} pointerEvents="none">
    {/* Textura de metal cepillado (líneas sutiles) */}
    {[...Array(40)].map((_, i) => (
      <View 
        key={`brushed-${i}`} 
        style={[
          styles.brushedLine, 
          { top: `${i * 2.5}%`, backgroundColor: color, opacity: 0.05 }
        ]} 
      />
    ))}
    {/* Remaches en las esquinas */}
    <View style={{ position: 'absolute', top: 10, left: 10 }}><MetalRivet /></View>
    <View style={{ position: 'absolute', top: 10, right: 10 }}><MetalRivet /></View>
    <View style={{ position: 'absolute', bottom: 10, left: 10 }}><MetalRivet /></View>
    <View style={{ position: 'absolute', bottom: 10, right: 10 }}><MetalRivet /></View>
  </View>
));

/** Decorador interno para tarjetas metálicas (remaches en las esquinas interiores) */
export const MetalCardDecor = React.memo(() => (
  <View style={StyleSheet.absoluteFill} pointerEvents="none">
    <View style={[styles.cornerRivet, { top: 8, left: 8 }]}><MetalRivet /></View>
    <View style={[styles.cornerRivet, { top: 8, right: 8 }]}><MetalRivet /></View>
    <View style={[styles.cornerRivet, { bottom: 8, left: 8 }]}><MetalRivet /></View>
    <View style={[styles.cornerRivet, { bottom: 8, right: 8 }]}><MetalRivet /></View>
  </View>
));

const styles = StyleSheet.create({
  decorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 12,
    gap: 15,
    opacity: 0.8,
  },
  line: {
    height: 2,
    width: 100,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.3)',
  },
  rivet: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#95a5a6',
    borderTopWidth: 1.5,
    borderLeftWidth: 1.5,
    borderBottomWidth: 1.5,
    borderRightWidth: 1.5,
    borderTopColor: 'rgba(0,0,0,0.7)',
    borderLeftColor: 'rgba(0,0,0,0.7)',
    borderBottomColor: 'rgba(255,255,255,0.6)',
    borderRightColor: 'rgba(255,255,255,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.5,
    shadowRadius: 1,
  },
  rivetInner: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: '#2c3e50',
    borderBottomWidth: 1,
    borderRightWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.4)',
    borderRightColor: 'rgba(255,255,255,0.4)',
  },
  brushedLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 1,
  },
  cornerRivet: {
    position: 'absolute',
    transform: [{ scale: 0.7 }], // Más pequeños para la tarjeta
    opacity: 0.6,
  }
});
