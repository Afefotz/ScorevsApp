import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, ScrollView, Alert, StatusBar,
} from 'react-native';
import { ScreenWrapper } from '../components/ScreenWrapper';
import { Themes, ThemeKey } from '../../config/Themes';
import { dbService } from '../../services/DatabaseService';

interface LoginScreenProps {
  onLogin: (roomId: string, theme: ThemeKey) => void;
  defaultTheme?: ThemeKey;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin, defaultTheme = 'theme-win95' }) => {
  const [username, setUsername] = useState('');
  const [roomCode, setRoomCode] = useState('');
  const [selectedTheme, setSelectedTheme] = useState<ThemeKey>(defaultTheme);
  const [mode, setMode] = useState<'join' | 'create'>('join');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const currentTheme = Themes[selectedTheme];

  const generateRoomCode = () => {
    return Math.random().toString(36).substring(2, 6);
  };

  const showError = (msg: string) => {
    setErrorMsg(msg);
    setTimeout(() => setErrorMsg(null), 3000);
  };

  const handleAction = async () => {
    if (!username.trim()) {
      Alert.alert("Usuario necesario", "Por favor ingresa tu nombre de usuario.");
      return;
    }

    if (mode === 'join' && !roomCode.trim()) {
      Alert.alert("Código necesario", "Por favor ingresa el código de la sala.");
      return;
    }

    const finalRoomCode = mode === 'create' ? generateRoomCode() : roomCode.trim().toLowerCase();
    const fullRoomId = `${username.trim().toLowerCase()}-${finalRoomCode}`;

    if (mode === 'join') {
      const exists = await dbService.checkRoomExists(fullRoomId);
      if (!exists) {
        Alert.alert(
          "Sala no encontrada",
          `La sala "${fullRoomId}" no existe. ¿Deseas crearla con este código?`,
          [
            { text: "Cancelar", style: "cancel" },
            {
              text: "Crear Sala",
              onPress: async () => {
                await dbService.initializeRoom(fullRoomId);
                onLogin(fullRoomId, selectedTheme);
              }
            }
          ]
        );
        return;
      }
    } else {
      // En modo 'create' inicializamos la sala antes de entrar
      await dbService.initializeRoom(fullRoomId);
    }

    onLogin(fullRoomId, selectedTheme);
  };

  return (
    <>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle={currentTheme.text === '#fff' ? 'light-content' : 'dark-content'}
      />
      <ScreenWrapper style={{ backgroundColor: currentTheme.background }}>
        <ScrollView contentContainerStyle={styles.loginContent}>
          <Text style={[styles.title, { color: currentTheme.text }]}>ScoreVS Mobile</Text>

          <View style={[styles.card, { backgroundColor: currentTheme.card }]}>

            {/* Selector de Modo */}
            <View style={styles.modeToggleContainer}>
              <TouchableOpacity
                onPress={() => setMode('join')}
                style={[
                  styles.modeBtn,
                  mode === 'join' && { borderBottomColor: currentTheme.primary, borderBottomWidth: 3 }
                ]}
              >
                <Text style={[styles.modeBtnText, { color: currentTheme.text, opacity: mode === 'join' ? 1 : 0.5 }]}>UNIRSE</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setMode('create')}
                style={[
                  styles.modeBtn,
                  mode === 'create' && { borderBottomColor: currentTheme.primary, borderBottomWidth: 3 }
                ]}
              >
                <Text style={[styles.modeBtnText, { color: currentTheme.text, opacity: mode === 'create' ? 1 : 0.5 }]}>CREAR</Text>
              </TouchableOpacity>
            </View>

            <Text style={[styles.label, { color: currentTheme.text }]}>Usuario:</Text>
            <TextInput
              style={[styles.input, { backgroundColor: currentTheme.inputBg, color: currentTheme.text }]}
              placeholder="Ej: fefemz"
              placeholderTextColor="#888"
              value={username}
              onChangeText={(text) => {
                if (/[^a-zA-Z0-9]/.test(text)) showError("*Solo letras y números permitidos");
                setUsername(text.replace(/[^a-zA-Z0-9]/g, '').toLowerCase());
              }}
              autoCapitalize="none"
            />

            {mode === 'join' && (
              <>
                <Text style={[styles.label, { color: currentTheme.text }]}>Código de Sala:</Text>
                <TextInput
                  style={[styles.input, { backgroundColor: currentTheme.inputBg, color: currentTheme.text }]}
                  placeholder="Ej: 9k1d"
                  placeholderTextColor="#888"
                  value={roomCode}
                  onChangeText={(text) => {
                    if (/[^a-zA-Z0-9]/.test(text)) showError("*No se permiten caracteres especiales");
                    if (text.length > 4) showError("*Máximo 4 caracteres permitidos");
                    setRoomCode(text.replace(/[^a-zA-Z0-9]/g, '').toLowerCase().substring(0, 4));
                  }}
                  autoCapitalize="none"
                />
              </>
            )}

            {errorMsg && (
              <Text style={styles.errorText}>{errorMsg}</Text>
            )}

            <Text style={[styles.label, { color: currentTheme.text, marginTop: 10 }]}>Selecciona un Estilo:</Text>
            <View style={styles.themeSelector}>
              {(Object.keys(Themes) as ThemeKey[]).map((t) => (
                <TouchableOpacity
                  key={t}
                  style={[
                    styles.themeBtn,
                    {
                      borderColor: selectedTheme === t ? currentTheme.primary : 'transparent',
                      backgroundColor: Themes[t].background
                    }
                  ]}
                  onPress={() => setSelectedTheme(t)}
                >
                  <View style={[styles.themeIndicator, { backgroundColor: Themes[t].primary }]} />
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity
              style={[styles.mainBtn, { backgroundColor: currentTheme.primary }]}
              onPress={handleAction}
            >
              <Text style={[styles.btnText, { color: currentTheme.text === '#fff' ? '#fff' : '#000' }]}>
                {mode === 'join' ? 'ENTRAR A LA SALA' : 'GENERAR SALA'}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </ScreenWrapper>
    </>
  );
};

const styles = StyleSheet.create({
  loginContent: { flexGrow: 1, justifyContent: 'center', padding: 25 },
  title: { fontSize: 36, fontWeight: '900', textAlign: 'center', marginBottom: 30, letterSpacing: -1 },
  card: { padding: 25, borderRadius: 20, elevation: 8, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 6 },
  modeToggleContainer: { flexDirection: 'row', marginBottom: 25, gap: 20, justifyContent: 'center' },
  modeBtn: { paddingVertical: 5, paddingHorizontal: 10 },
  modeBtnText: { fontSize: 16, fontWeight: 'bold' },
  label: { fontSize: 13, fontWeight: 'bold', marginBottom: 8, textTransform: 'uppercase', opacity: 0.8 },
  input: { borderRadius: 12, padding: 15, marginBottom: 15, fontSize: 16, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  themeSelector: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 25, marginTop: 5 },
  themeBtn: { width: 45, height: 45, borderWidth: 2, borderRadius: 12, justifyContent: 'center', alignItems: 'center', overflow: 'hidden' },
  themeIndicator: { width: '100%', height: '30%', position: 'absolute', bottom: 0 },
  mainBtn: { padding: 18, borderRadius: 15, alignItems: 'center', marginTop: 10, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 4 },
  btnText: { fontWeight: '900', fontSize: 17, letterSpacing: 0.5 },
  errorText: { color: '#ff4444', fontSize: 12, fontWeight: 'bold', textAlign: 'center', marginBottom: 15, textTransform: 'uppercase' },
});
