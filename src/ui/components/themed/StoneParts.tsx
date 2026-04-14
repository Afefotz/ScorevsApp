/**
 * StoneParts.tsx
 * Micro-componentes decorativos de estilo Piedra/Roca (bloques pesados, grabados profundos).
 * React.memo: contenido estático → sin re-renders.
 */
import React from 'react';
import { View, StyleSheet } from 'react-native';

/** Un solo bloque de piedra cincelada */
const StoneBlock = React.memo<{ width: number; height?: number }>(({ width, height = 8 }) => (
  <View style={[styles.block, { width, height }]} />
));

/** Separador decorativo que parece un muro bajo de adoquines */
export const StoneSlabDecor = React.memo(() => (
  <View style={styles.container}>
    <StoneBlock width={24} />
    <StoneBlock width={40} height={10} />
    <StoneBlock width={16} />
    <StoneBlock width={30} height={7} />
  </View>
));

/** Fondo de Pared de Ladrillos (Rojo Ladrillo) */
export const StoneBrickBackground = React.memo(() => {
  const brickWidth = 60;
  const brickHeight = 30;
  const rows = 25;
  const cols = 8;

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {[...Array(rows)].map((_, r) => (
        <View key={`row-${r}`} style={{ flexDirection: 'row', marginLeft: r % 2 === 0 ? 0 : -brickWidth / 2 }}>
          {[...Array(cols)].map((_, c) => (
            <View 
              key={`brick-${r}-${c}`} 
              style={[
                styles.brick, 
                { width: brickWidth, height: brickHeight }
              ]} 
            />
          ))}
        </View>
      ))}
    </View>
  );
});

/** Fondo de Piedra con Musgo (Verde Musgo) */
export const MossyStoneBackground = React.memo(() => (
  <View style={StyleSheet.absoluteFill} pointerEvents="none">
    <View style={[styles.mossPatch, { top: '10%', left: '5%', width: 120, height: 80 }]} />
    <View style={[styles.mossPatch, { top: '40%', right: '10%', width: 150, height: 100 }]} />
    <View style={[styles.mossPatch, { bottom: '15%', left: '15%', width: 200, height: 120 }]} />
  </View>
));

/** Decorador interno para tarjetas de Piedra (textura de grano / cincelado) */
export const StoneCardDecor = React.memo(() => (
  <View style={StyleSheet.absoluteFill} pointerEvents="none">
    <View style={styles.stoneGrain} />
  </View>
));

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    marginVertical: 14,
    gap: 3,
  },
  block: {
    backgroundColor: '#3d3d3d',
    borderBottomWidth: 3,
    borderRightWidth: 2,
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderTopColor: '#555555',
    borderLeftColor: '#555555',
    borderBottomColor: '#111111',
    borderRightColor: '#1a1a1a',
    borderRadius: 2,
  },
  brick: {
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.3)',
    backgroundColor: 'rgba(204, 85, 68, 0.2)', // Tono ladrillo translúcido
  },
  mossPatch: {
    position: 'absolute',
    backgroundColor: 'rgba(74, 93, 35, 0.2)', // Tono musgo
    borderRadius: 50,
    transform: [{ scaleX: 1.5 }],
  }
});
