/**
 * Win95Parts.tsx
 * Micro-componentes de bisel estilo Windows 95.
 * Definidos fuera de cualquier FC para cumplir rerender-no-inline-components.
 * React.memo: no dependen de estado de formulario → sin re-renders innecesarios.
 */
import React from 'react';
import { View, Text, ViewStyle } from 'react-native';

interface BevelProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

/** Borde elevado: arista superior/izquierda clara, inferior/derecha oscura */
export const Win95Raised = React.memo<BevelProps>(({ children, style }) => (
  <View
    style={[
      {
        borderTopWidth: 2,    borderLeftWidth: 2,
        borderRightWidth: 2,  borderBottomWidth: 2,
        borderTopColor: '#fff',   borderLeftColor: '#fff',
        borderRightColor: '#808080', borderBottomColor: '#808080',
      },
      style,
    ]}
  >
    {children}
  </View>
));

/** Borde hundido: arista superior/izquierda oscura, inferior/derecha clara */
export const Win95Sunken = React.memo<BevelProps>(({ children, style }) => (
  <View
    style={[
      {
        borderTopWidth: 2,    borderLeftWidth: 2,
        borderRightWidth: 2,  borderBottomWidth: 2,
        borderTopColor: '#808080', borderLeftColor: '#808080',
        borderRightColor: '#fff',  borderBottomColor: '#fff',
      },
      style,
    ]}
  >
    {children}
  </View>
));

/** Barra de estado inferior estilo Win95 */
export const Win95StatusBar = React.memo(() => (
  <View
    style={{
      marginTop: 14,
      borderTopWidth: 1,
      borderTopColor: '#808080',
      paddingTop: 5,
      paddingHorizontal: 4,
      flexDirection: 'row',
    }}
  >
    <Text style={{ fontSize: 11, color: '#000' }}>Listo</Text>
  </View>
));
