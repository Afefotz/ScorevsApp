import React, { useEffect, useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, ScrollView, Alert
} from 'react-native';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Themes, ThemeKey } from './src/config/Themes';
import { DashboardScreen } from './src/ui/screens/DashboardScreen';

const ROOM_KEY = '@versus_room_id';
const THEME_KEY = '@versus_selected_theme';

const MainContent = () => {
  const insets = useSafeAreaInsets();
  console.log('Márgenes medidos:', insets); // <-- Revisar márgenes del dispositivo

  const [username, setUsername] = useState('');
  const [roomCode, setRoomCode] = useState('');
  const [selectedTheme, setSelectedTheme] = useState<ThemeKey>('theme-win95');
  const [roomId, setRoomId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const currentTheme = Themes[selectedTheme];

  useEffect(() => {
    const loadSession = async () => {
      const savedRoom = await AsyncStorage.getItem(ROOM_KEY);
      const savedTheme = await AsyncStorage.getItem(THEME_KEY);
      if (savedRoom) setRoomId(savedRoom);
      if (savedTheme) setSelectedTheme(savedTheme as ThemeKey);
      setIsLoading(false);
    };
    loadSession();
  }, []);

  const handleJoin = async () => {
    if (!username || !roomCode) {
      Alert.alert("Campos incompletos", "Por favor ingresa tu usuario y el código de sala.");
      return;
    }
    const fullRoomId = `${username.trim().toLowerCase()}-${roomCode.trim().toLowerCase()}`;

    await AsyncStorage.setItem(ROOM_KEY, fullRoomId);
    await AsyncStorage.setItem(THEME_KEY, selectedTheme);
    setRoomId(fullRoomId);
  };

  const handleLogout = async () => {
    await AsyncStorage.clear();
    setRoomId(null);
    setUsername('');
    setRoomCode('');
  };

  if (isLoading) return null;

  // --- VISTA: PANEL DE CONTROL (DASHBOARD) ---
  if (roomId) {
    return (
      <DashboardScreen
        roomId={roomId}
        theme={selectedTheme}
        onLogout={handleLogout}
      />
    );
  }

  // --- VISTA: LOGIN TEMATIZADO ---
  return (
    <View style={[
      styles.container,
      {
        backgroundColor: currentTheme.background,
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
        paddingLeft: insets.left,
        paddingRight: insets.right
      }
    ]}>
      <ScrollView contentContainerStyle={styles.loginContent}>
        <Text style={[styles.title, { color: currentTheme.text }]}>ScoreVS Mobile</Text>

        <View style={[styles.card, { backgroundColor: currentTheme.card }]}>
          <Text style={[styles.label, { color: currentTheme.text }]}>Usuario:</Text>
          <TextInput
            style={[styles.input, { backgroundColor: currentTheme.inputBg, color: currentTheme.text }]}
            placeholder="fefemz"
            placeholderTextColor="#888"
            value={username}
            onChangeText={setUsername}
          />

          <Text style={[styles.label, { color: currentTheme.text }]}>Código de Sala:</Text>
          <TextInput
            style={[styles.input, { backgroundColor: currentTheme.inputBg, color: currentTheme.text }]}
            placeholder="9k1d"
            placeholderTextColor="#888"
            value={roomCode}
            onChangeText={setRoomCode}
          />

          <Text style={[styles.label, { color: currentTheme.text }]}>Selecciona tu Estilo:</Text>
          <View style={styles.themeSelector}>
            {(Object.keys(Themes) as ThemeKey[]).map((t) => (
              <TouchableOpacity
                key={t}
                style={[
                  styles.themeBtn,
                  { borderColor: selectedTheme === t ? currentTheme.primary : 'transparent' }
                ]}
                onPress={() => setSelectedTheme(t)}
              >
                <Text style={{ color: currentTheme.text, fontSize: 12 }}>
                  {t.replace('theme-', '').toUpperCase()}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity
            style={[styles.mainBtn, { backgroundColor: currentTheme.primary }]}
            onPress={handleJoin}
          >
            <Text style={styles.btnText}>ENTRAR A LA SALA</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const App = () => {
  return (
    <SafeAreaProvider>
      <MainContent />
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  loginContent: { flexGrow: 1, justifyContent: 'center', padding: 25 },
  title: { fontSize: 32, fontWeight: 'bold', textAlign: 'center', marginBottom: 30 },
  card: { padding: 20, borderRadius: 15, elevation: 5, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 3.84 },
  label: { fontSize: 14, fontWeight: 'bold', marginBottom: 8 },
  input: { borderRadius: 8, padding: 12, marginBottom: 20, fontSize: 16 },
  themeSelector: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 25 },
  themeBtn: { padding: 8, borderWidth: 2, borderRadius: 8, backgroundColor: 'rgba(255,255,255,0.05)' },
  mainBtn: { padding: 15, borderRadius: 10, alignItems: 'center', marginTop: 10 },
  btnText: { color: '#000', fontWeight: 'bold', fontSize: 16 },
  header: { flexDirection: 'row', justifyContent: 'space-between', padding: 20, borderBottomWidth: 2 },
  roomInfo: { fontSize: 16, fontWeight: 'bold' }
});

export default App;