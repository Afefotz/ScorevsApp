/**
 * EngravedText.tsx
 * Texto con efecto grabado metálico (aproximado con doble sombra en RN).
 * Reutilizable en LoginScreen, DashboardScreen, etc.
 */
import React from 'react';
import { View, Text, ViewStyle, TextStyle } from 'react-native';

interface EngravedTextProps {
  text: string;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const EngravedText = React.memo<EngravedTextProps>(
  ({ text, style, textStyle }) => (
    <View style={style}>
      {/* Highlight layer (top-left) */}
      <Text
        style={[
          textStyle,
          { position: 'absolute', color: 'rgba(255,255,255,0.55)', top: 1, left: 1 },
        ]}
        aria-hidden
      >
        {text}
      </Text>
      {/* Shadow layer (bottom-right) */}
      <Text
        style={[
          textStyle,
          { position: 'absolute', color: 'rgba(0,0,0,0.55)', top: -1, left: -1 },
        ]}
        aria-hidden
      >
        {text}
      </Text>
      {/* Main text */}
      <Text style={textStyle}>{text}</Text>
    </View>
  ),
);
