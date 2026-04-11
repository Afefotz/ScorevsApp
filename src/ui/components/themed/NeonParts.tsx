/**
 * NeonParts.tsx
 * Micro-componentes decorativos estilo Neon/CRT.
 * React.memo: contenido estático → sin re-renders.
 */
import React from 'react';
import { View, Text, Platform } from 'react-native';

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

/** Fila decorativa superior "// SCORE.SYSTEM.v2 //" */
export const NeonDecoRow = React.memo(() => (
  <View style={{ marginBottom: 10, alignItems: 'center' }}>
    <Text
      style={{
        color: 'rgba(0,255,255,0.35)',
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
export const NeonFooter = React.memo(() => (
  <Text
    style={{
      color: 'rgba(0,255,255,0.3)',
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
