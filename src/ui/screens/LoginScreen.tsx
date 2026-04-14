/**
 * LoginScreen.tsx
 *
 * Refactorizado: sin if/isWin95/isNeon/isMetal en el cuerpo del FC.
 * La lógica visual vive en sub-componentes definidos FUERA del FC
 * (regla rerender-no-inline-components) y lee flags semánticos del ThemeConfig
 * (hasBevel / hasScanlines / hasEngravedText).
 *
 * NOTA: Los sub-componentes NO usan React.memo intencionalmente.
 * `tk` proviene de `Themes[key]` — misma referencia por tema. Memo con
 * comparación por referencia de objeto sería ineficaz aquí. Los componentes
 * son ligeros y su re-render está atado al render del padre (cambio de tema
 * o formulario), por lo que el overhead es insignificante.
 */
import React, { useState, useCallback, useMemo } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, ScrollView, Alert, StatusBar, Platform,
} from 'react-native';
import { ScreenWrapper } from '../components/ScreenWrapper';
import { ThemeConfig, ThemeKey, Themes } from '../../config/Themes';
import { useTheme } from '../../hooks/useTheme';
import { dbService } from '../../services/DatabaseService';
import { ThemeSelectorGrid } from '../components/ThemeSelectorGrid';
import { Win95Raised, Win95Sunken, Win95StatusBar } from '../components/themed/Win95Parts';
import { NeonScanline, NeonDecoRow, NeonFooter } from '../components/themed/NeonParts';

// ─── Interfaz compartida de props temáticas ───────────────────────────────────
interface TKProps { tk: ThemeConfig }

// ─── LoginTitleBar ────────────────────────────────────────────────────────────
const LoginTitleBar = ({ tk }: TKProps) => {
  if (tk.hasBevel) {
    return (
      <View style={[styles.titleBar, {
        backgroundColor: tk.headerBg,
        borderBottomWidth: tk.headerBorderBottomWidth,
        borderBottomColor: tk.headerBorderBottomColor,
      }]}>
        <Text style={{ color: tk.headerTextColor, fontWeight: '700', fontSize: 14 }}>
          📺 ScoreVS Mobile — RoomCreator.exe
        </Text>
      </View>
    );
  }

  if (tk.hasScanlines) {
    return (
      <View style={[styles.titleBar, { backgroundColor: tk.headerBg }]}>
        <Text style={{
          color: tk.headerTextColor, fontWeight: '900', fontSize: 14,
          letterSpacing: tk.headerLetterSpacing, textTransform: 'uppercase',
          textAlign: 'center',
        }}>
          ⚡ SCOREVS MOBILE ⚡
        </Text>
      </View>
    );
  }

  // Metal
  return (
    <View style={[styles.titleBar, {
      backgroundColor: tk.headerBg,
      borderBottomWidth: tk.headerBorderBottomWidth,
      borderBottomColor: tk.headerBorderBottomColor,
      borderTopWidth: 1,
      borderTopColor: 'rgba(255,255,255,0.3)',
    }]}>
      <Text style={{
        color: tk.headerTextColor,
        fontWeight: tk.headerFontWeight,
        fontSize: 16,
        letterSpacing: tk.headerLetterSpacing,
        textTransform: tk.headerTextTransform,
        textAlign: 'center',
        textShadowColor: 'rgba(255,255,255,0.5)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 1,
      }}>
        ⚙ SCOREVS MOBILE
      </Text>
    </View>
  );
};

// ─── LoginModeToggle ──────────────────────────────────────────────────────────
interface ModeToggleProps extends TKProps {
  mode: 'join' | 'create';
  onChange: (m: 'join' | 'create') => void;
}

const LoginModeToggle = ({ tk, mode, onChange }: ModeToggleProps) => {
  if (tk.hasBevel) {
    return (
      <View style={[styles.modeRow, { gap: 8, justifyContent: 'center' }]}>
        {(['join', 'create'] as const).map((m) => {
          const active = mode === m;
          return (
            <Win95Raised
              key={m}
              style={active ? {
                borderTopColor: '#808080', borderLeftColor: '#808080',
                borderRightColor: '#fff', borderBottomColor: '#fff',
              } : undefined}
            >
              <TouchableOpacity
                onPress={() => onChange(m)}
                style={[styles.modeBtn, {
                  backgroundColor: active ? '#000080' : '#c0c0c0',
                  paddingHorizontal: 18, paddingVertical: 6,
                }]}
              >
                <Text style={{ color: active ? '#fff' : '#000', fontWeight: '700', fontSize: 13 }}>
                  {m === 'join' ? 'Unirse' : 'Crear'}
                </Text>
              </TouchableOpacity>
            </Win95Raised>
          );
        })}
      </View>
    );
  }

  if (tk.hasScanlines) {
    return (
      <View style={[styles.modeRow, { gap: 0, borderWidth: 1, borderColor: tk.modeToggleBorderColor }]}>
        {(['join', 'create'] as const).map((m, i) => {
          const active = mode === m;
          return (
            <TouchableOpacity
              key={m}
              onPress={() => onChange(m)}
              style={[styles.modeBtn, {
                flex: 1,
                backgroundColor: active ? tk.modeActiveBg : tk.modeToggleBg,
                borderRightWidth: i === 0 ? 1 : 0,
                borderRightColor: tk.modeToggleBorderColor,
                paddingVertical: 10,
              }]}
            >
              <Text style={{
                color: active ? tk.modeActiveTextColor : tk.modeTextColor,
                fontWeight: '900', fontSize: 12,
                letterSpacing: tk.labelLetterSpacing,
                textAlign: 'center', textTransform: 'uppercase',
              }}>
                {m === 'join' ? 'UNIRSE' : 'CREAR'}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    );
  }

  // Metal (y cualquier otro tema futuro)
  return (
    <View style={[styles.modeRow, {
      gap: 10, justifyContent: 'center',
    }]}>
      {(['join', 'create'] as const).map((m) => {
        const active = mode === m;
        return (
          <TouchableOpacity
            key={m}
            onPress={() => onChange(m)}
            style={[styles.modeBtn, {
              backgroundColor: active ? tk.modeActiveBg : tk.modeToggleBg,
              borderWidth: 1,
              borderColor: active ? tk.modeActiveBorderColor : tk.modeToggleBorderColor,
              borderRadius: tk.modeToggleBorderRadius,
              paddingHorizontal: 22, paddingVertical: 9,
              ...(active && {
                shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.5, shadowRadius: 4, elevation: 4,
              }),
            }]}
          >
            <Text style={{
              color: active ? tk.modeActiveTextColor : tk.modeTextColor,
              fontWeight: '900', fontSize: 12,
              letterSpacing: tk.labelLetterSpacing,
              textTransform: 'uppercase',
            }}>
              {m === 'join' ? 'UNIRSE' : 'CREAR'}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

// ─── LoginFieldInput ──────────────────────────────────────────────────────────
interface FieldInputProps extends TKProps {
  label: string;
  value: string;
  placeholder: string;
  onChange: (text: string) => void;
}

const LoginFieldInput = ({ tk, label, value, placeholder, onChange }: FieldInputProps) => {
  const inputEl = (
    <TextInput
      style={[styles.input, {
        backgroundColor: tk.inputBg,
        color: tk.inputTextColor,
        borderWidth: tk.inputBorderWidth,
        borderColor: tk.inputBorderColor,
        borderRadius: tk.inputBorderRadius,
        ...(tk.hasScanlines && {
          shadowColor: tk.inputGlowColor,
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 0.7,
          shadowRadius: 6,
          elevation: 0,
        }),
      }]}
      placeholder={placeholder}
      placeholderTextColor={tk.inputPlaceholderColor}
      value={value}
      onChangeText={onChange}
      autoCapitalize="none"
    />
  );

  if (tk.hasBevel) {
    return (
      <View style={styles.fieldWrapper}>
        <Text style={[styles.label, {
          color: tk.labelColor,
          letterSpacing: tk.labelLetterSpacing,
          fontWeight: tk.labelFontWeight,
        }]}>
          {label}
        </Text>
        <Win95Sunken>{inputEl}</Win95Sunken>
      </View>
    );
  }

  if (tk.hasScanlines) {
    return (
      <View style={styles.fieldWrapper}>
        <Text style={[styles.label, {
          color: tk.labelColor,
          letterSpacing: tk.labelLetterSpacing,
          fontWeight: tk.labelFontWeight,
          textShadowColor: '#f0f',
          textShadowOffset: { width: 0, height: 0 },
          textShadowRadius: 6,
        }]}>
          {label}
        </Text>
        <NeonScanline color="#f0f" />
        {inputEl}
      </View>
    );
  }

  // Metal
  return (
    <View style={styles.fieldWrapper}>
      <Text style={[styles.label, {
        color: tk.labelColor,
        letterSpacing: tk.labelLetterSpacing,
        fontWeight: tk.labelFontWeight,
      }]}>
        {label}
      </Text>
      {inputEl}
    </View>
  );
};

// ─── LoginCTAButton ──────────────────────────────────────────────────────────
interface CTAButtonProps extends TKProps {
  label: string;
  onPress: () => void;
}

const LoginCTAButton = ({ tk, label, onPress }: CTAButtonProps) => {
  if (tk.hasBevel) {
    return (
      <Win95Raised style={{ marginTop: 12 }}>
        <TouchableOpacity
          style={[styles.mainBtn, {
            backgroundColor: tk.btnBg,
            borderRadius: tk.btnBorderRadius,
            paddingVertical: 10,
          }]}
          onPress={onPress}
          activeOpacity={0.9}
        >
          <Text style={[styles.btnText, {
            color: tk.btnTextColor,
            letterSpacing: tk.btnLetterSpacing,
            fontSize: 14,
          }]}>
            ▶ {label}
          </Text>
        </TouchableOpacity>
      </Win95Raised>
    );
  }

  if (tk.hasScanlines) {
    return (
      <TouchableOpacity
        style={[styles.mainBtn, {
          backgroundColor: tk.btnBg,
          borderRadius: tk.btnBorderRadius,
          borderWidth: 1,
          borderColor: tk.btnBorderColor,
          marginTop: 12,
          shadowColor: tk.btnBorderColor,
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 0.6,
          shadowRadius: 10,
          elevation: 0,
        }]}
        onPress={onPress}
        activeOpacity={0.7}
      >
        <Text style={[styles.btnText, {
          color: tk.btnTextColor,
          letterSpacing: tk.btnLetterSpacing,
          textShadowColor: tk.btnTextColor,
          textShadowOffset: { width: 0, height: 0 },
          textShadowRadius: 8,
        }]}>
          ⚡ {label}
        </Text>
      </TouchableOpacity>
    );
  }

  // Metal
  return (
    <TouchableOpacity
      style={[styles.mainBtn, {
        backgroundColor: tk.btnBg,
        borderRadius: tk.btnBorderRadius,
        borderWidth: 1,
        borderColor: tk.btnBorderColor,
        marginTop: 12,
        elevation: tk.btnElevation,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.5,
        shadowRadius: 6,
      }]}
      onPress={onPress}
      activeOpacity={0.85}
    >
      <Text style={[styles.btnText, {
        color: tk.btnTextColor,
        letterSpacing: tk.btnLetterSpacing,
        textShadowColor: 'rgba(255,255,255,0.4)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 1,
      }]}>
        ⚙ {label}
      </Text>
    </TouchableOpacity>
  );
};

// ─── LoginErrorText ───────────────────────────────────────────────────────────
const LoginErrorText = ({ tk, msg }: TKProps & { msg: string }) => (
  <Text style={[styles.errorText, {
    color: tk.errorColor,
    ...(tk.hasScanlines && {
      textShadowColor: '#f0f',
      textShadowOffset: { width: 0, height: 0 },
      textShadowRadius: 6,
    }),
  }]}>
    {msg}
  </Text>
);

// ─── Card style factory ───────────────────────────────────────────────────────
const buildCardStyle = (tk: ThemeConfig) => ({
  backgroundColor: tk.card,
  borderRadius: tk.cardBorderRadius,
  borderWidth: tk.cardBorderWidth,
  borderColor: tk.cardBorderColor,
  elevation: tk.cardElevation,
  shadowColor: tk.cardShadowColor,
  ...(tk.hasScanlines && {
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 20,
  }),
  ...(tk.hasEngravedText && {
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
  }),
});

// ─────────────────────────────────────────────────────────────────────────────
// Main Screen
// ─────────────────────────────────────────────────────────────────────────────
interface LoginScreenProps {
  onLogin: (roomId: string, theme: ThemeKey, mode: 'join' | 'create') => void;
  defaultTheme?: ThemeKey;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({
  onLogin,
  defaultTheme = 'theme-win95',
}) => {
  const [username, setUsername] = useState('');
  const [roomCode, setRoomCode] = useState('');
  const [selectedTheme, setSelectedTheme] = useState<ThemeKey>(defaultTheme);
  const [mode, setMode] = useState<'join' | 'create'>('join');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Fuente única de tokens — estable por tema
  const tk = useTheme(selectedTheme);

  // cardStyle se recalcula solo cuando tk cambia (por cambio de tema)
  const cardStyle = useMemo(() => buildCardStyle(tk), [tk]);

  // Labels y placeholders derivados de flags del tema
  const ctaLabel = mode === 'join' ? 'ENTRAR A LA SALA' : 'GENERAR SALA';
  const userLabel = tk.hasBevel ? 'Usuario:' : 'USUARIO';
  const roomLabel = tk.hasBevel ? 'Código de Sala:' : 'CÓDIGO DE SALA';
  const userPlaceholder = tk.hasScanlines ? '> fefemz_' : 'Ej: fefemz';
  const roomPlaceholder = tk.hasScanlines ? '> 9k1d_' : 'Ej: 9k1d';

  const showError = (msg: string) => {
    setErrorMsg(msg);
    setTimeout(() => setErrorMsg(null), 3000);
  };

  // Callbacks estables para evitar re-renders innecesarios en inputs activos
  const handleUsernameChange = useCallback((text: string) => {
    if (/[^a-zA-Z0-9]/.test(text)) showError('*Solo letras y números');
    setUsername(text.replace(/[^a-zA-Z0-9]/g, '').toLowerCase());
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleRoomCodeChange = useCallback((text: string) => {
    if (/[^a-zA-Z0-9]/.test(text)) showError('*No se permiten caracteres especiales');
    if (text.length > 4) showError('*Máximo 4 caracteres');
    setRoomCode(text.replace(/[^a-zA-Z0-9]/g, '').toLowerCase().substring(0, 4));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleAction = async () => {
    if (!username.trim()) {
      Alert.alert('Usuario necesario', 'Por favor ingresa tu nombre de usuario.');
      return;
    }
    if (mode === 'join' && !roomCode.trim()) {
      Alert.alert('Código necesario', 'Por favor ingresa el código de la sala.');
      return;
    }

    const finalRoomCode = mode === 'create'
      ? Math.random().toString(36).substring(2, 6)
      : roomCode.trim().toLowerCase();
    const fullRoomId = `${username.trim().toLowerCase()}-${finalRoomCode}`;

    if (mode === 'join') {
      const exists = await dbService.checkRoomExists(fullRoomId);
      if (!exists) {
        Alert.alert(
          'Sala no encontrada',
          `La sala "${fullRoomId}" no existe. ¿Deseas crearla con este código?`,
          [
            { text: 'Cancelar', style: 'cancel' },
            {
              text: 'Crear Sala',
              onPress: async () => {
                await dbService.initializeRoom(fullRoomId);
                onLogin(fullRoomId, selectedTheme, 'create'); // Se vuelve 'create' al aceptar crear
              },
            },
          ],
        );
        return;
      }
    } else {
      await dbService.initializeRoom(fullRoomId);
    }

    onLogin(fullRoomId, selectedTheme, mode);
  };

  return (
    <>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle={tk.statusBarStyle}
      />
      <ScreenWrapper style={{ backgroundColor: tk.screenBg }}>
        {/* backgroundColor en ScrollView garantiza que el fondo se pinte hasta los bordes */}
        <ScrollView
          contentContainerStyle={[styles.loginContent, { backgroundColor: tk.screenBg }]}
          keyboardShouldPersistTaps="handled"
        >
          {tk.hasScanlines && <NeonDecoRow />}

          {/* key={selectedTheme} fuerza re-mount de la tarjeta al cambiar tema,
              garantizando que todos los estilos se apliquen limpiamente */}
          <View key={selectedTheme} style={[styles.card, cardStyle]}>

            <LoginTitleBar tk={tk} />

            <View style={[styles.cardBody, { paddingTop: tk.hasBevel ? 15 : 20 }]}>

              <LoginModeToggle tk={tk} mode={mode} onChange={setMode} />

              <View style={{ height: 18 }} />

              <LoginFieldInput
                tk={tk}
                label={userLabel}
                value={username}
                placeholder={userPlaceholder}
                onChange={handleUsernameChange}
              />

              {mode === 'join' && (
                <LoginFieldInput
                  tk={tk}
                  label={roomLabel}
                  value={roomCode}
                  placeholder={roomPlaceholder}
                  onChange={handleRoomCodeChange}
                />
              )}

              {errorMsg && <LoginErrorText tk={tk} msg={errorMsg} />}

              {mode === 'create' && (
                <ThemeSelectorGrid
                  selectedTheme={selectedTheme}
                  onSelectTheme={setSelectedTheme}
                  accentColor={Themes[selectedTheme].primary}
                  textColor={tk.labelColor}
                />
              )}

              <LoginCTAButton tk={tk} label={ctaLabel} onPress={handleAction} />

              {tk.hasScanlines && <NeonFooter />}
              {tk.hasBevel && <Win95StatusBar />}

            </View>
          </View>

        </ScrollView>
      </ScreenWrapper>
    </>
  );
};

// ─── Estilos base (estáticos — sin valores de tema) ───────────────────────────
const styles = StyleSheet.create({
  loginContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  card: {
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
  },
  titleBar: { paddingHorizontal: 14, paddingVertical: 8, justifyContent: 'center' },
  cardBody: { padding: 18 },
  fieldWrapper: { marginBottom: 15 },
  modeRow: { flexDirection: 'row' },
  modeBtn: { alignItems: 'center', justifyContent: 'center' },
  label: { fontSize: 11, fontWeight: '700', marginBottom: 6, textTransform: 'uppercase' },
  input: { padding: Platform.OS === 'ios' ? 13 : 11, fontSize: 15, fontWeight: '500' },
  mainBtn: { padding: 15, alignItems: 'center' },
  btnText: { fontWeight: '900', fontSize: 14, letterSpacing: 0.5, textTransform: 'uppercase' },
  errorText: {
    fontSize: 11, fontWeight: '700', textAlign: 'center',
    marginBottom: 12, textTransform: 'uppercase', letterSpacing: 1,
  },
});
