/**
 * PaperParts.tsx
 * Micro-componentes decorativos de estilo Papel / Cuaderno.
 * React.memo: contenido estático → sin re-renders.
 */
import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

/** Fila de agujeros de carpeta o espiral de cuaderno */
export const NotebookHolesDecor = React.memo(() => (
  <View style={styles.container}>
    {[...Array(12)].map((_, i) => (
      <View key={i} style={styles.holeLine}>
        <View style={styles.hole} />
        <View style={styles.innerShadow} />
      </View>
    ))}
  </View>
));

/** Fondo de cuadrícula (Grid) */
export const NotebookGridBackground = React.memo(() => {
  const gridSize = 30; // Tamaño del cuadro
  const horizontalLines = Math.ceil(SCREEN_HEIGHT / gridSize);
  const verticalLines = Math.ceil(SCREEN_WIDTH / gridSize);

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {/* Líneas Horizontales */}
      {[...Array(horizontalLines)].map((_, i) => (
        <View
          key={`h-${i}`}
          style={[
            styles.gridLineH,
            { top: i * gridSize }
          ]}
        />
      ))}
      {/* Líneas Verticales */}
      {[...Array(verticalLines)].map((_, i) => (
        <View
          key={`v-${i}`}
          style={[
            styles.gridLineV,
            { left: i * gridSize }
          ]}
        />
      ))}
    </View>
  );
});

/** Línea roja de margen lateral */
export const NotebookMarginLine = React.memo(() => (
  <View style={styles.marginLine} pointerEvents="none" />
));

/** Fondo de Cuadrícula para Plano Arquitectónico (Blueprint) */
export const BlueprintGridBackground = React.memo(() => {
  const gridSize = 40; // Cuadros un poco más grandes para planos
  const horizontalLines = Math.ceil(SCREEN_HEIGHT / gridSize);
  const verticalLines = Math.ceil(SCREEN_WIDTH / gridSize);

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <View style={[StyleSheet.absoluteFill, { backgroundColor: '#1e3a8a' }]} />
      {/* Líneas Horizontales */}
      {[...Array(horizontalLines)].map((_, i) => (
        <View
          key={`bp-h-${i}`}
          style={[
            styles.blueprintLineH,
            { top: i * gridSize, height: i % 5 === 0 ? 1.5 : 0.5 }
          ]}
        />
      ))}
      {/* Líneas Verticales */}
      {[...Array(verticalLines)].map((_, i) => (
        <View
          key={`bp-v-${i}`}
          style={[
            styles.blueprintLineV,
            { left: i * gridSize, width: i % 5 === 0 ? 1.5 : 0.5 }
          ]}
        />
      ))}
    </View>
  );
});

/** Fondo liso envejecido para Pergamino Antiguo */
export const ParchmentBackground = React.memo(() => (
  <View style={[StyleSheet.absoluteFill, styles.parchmentBg]} pointerEvents="none" />
));

/** Decorador interno para tarjetas de papel (agujeros de libreta alineados a la izquierda) */
export const PaperCardDecor = React.memo(() => (
  <View style={StyleSheet.absoluteFill} pointerEvents="none">
    {[...Array(6)].map((_, i) => (
      <View key={`ch-${i}`} style={[styles.cardHole, { top: 30 + i * 25 }]} />
    ))}
    <View style={styles.cardMarginLine} />
  </View>
));

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    marginVertical: 12,
    width: '100%',
    paddingHorizontal: 10,
  },
  holeLine: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 20,
    height: 20,
  },
  hole: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: 'rgba(0,0,0,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.04)',
    elevation: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },
  innerShadow: {
    position: 'absolute',
    top: 5,
    width: 10,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
  gridLineH: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: 'rgba(0, 150, 255, 0.12)', // Azul cuadernillo suave
  },
  gridLineV: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 1,
    backgroundColor: 'rgba(0, 150, 255, 0.12)',
  },
  marginLine: {
    position: 'absolute',
    left: 45, // Un poco después de los agujeros
    top: 0,
    bottom: 0,
    width: 2,
    backgroundColor: 'rgba(255, 0, 0, 0.25)', // Rojo margen clásico
    zIndex: 1,
  },
  blueprintLineH: {
    position: 'absolute',
    left: 0,
    right: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.3)', // Color blanco tiza suave
  },
  blueprintLineV: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  parchmentBg: {
    backgroundColor: '#e6d5a1', // Mismo que overrides en Themes.ts para unificación
    opacity: 0.8, // Para no oscurecer del todo si el fondo principal es diferente
  },
  cardHole: {
    position: 'absolute',
    left: 10,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(0,0,0,0.08)',
    borderWidth: 0.5,
    borderColor: 'rgba(0,0,0,0.03)',
  },
  cardMarginLine: {
    position: 'absolute',
    left: 28,
    top: 10,
    bottom: 10,
    width: 1,
    backgroundColor: 'rgba(255,0,0,0.15)',
  }
});
