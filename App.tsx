import React, { useEffect, useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, ScrollView, Alert, StatusBar
} from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ScreenWrapper } from './src/ui/components/ScreenWrapper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Themes, ThemeKey } from './src/config/Themes';
import { DashboardScreen } from './src/ui/screens/DashboardScreen';
import { LoginScreen } from './src/ui/screens/LoginScreen';
import { dbService } from './src/services/DatabaseService';

const ROOM_KEY = '@versus_room_id';
const THEME_KEY = '@versus_selected_theme';

const MainContent = () => {

  const [selectedTheme, setSelectedTheme] = useState<ThemeKey>('theme-win95');
  const [roomId, setRoomId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

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

  const handleJoin = async (newRoomId: string, theme: ThemeKey) => {
    // Sincronizar el tema elegido con Firebase para que el dashboard lo use
    await dbService.updateTheme(newRoomId, theme);
    
    await AsyncStorage.setItem(ROOM_KEY, newRoomId);
    await AsyncStorage.setItem(THEME_KEY, theme);
    setRoomId(newRoomId);
    setSelectedTheme(theme);
  };

  const handleLogout = async () => {
    // Solo borramos la sala, preservamos el tema elegido para el login
    await AsyncStorage.removeItem(ROOM_KEY);
    setRoomId(null);
  };

  if (isLoading) return null;

  // --- VISTA: PANEL DE CONTROL (DASHBOARD) ---
  if (roomId) {
    return (
      <DashboardScreen
        roomId={roomId}
        theme={selectedTheme}
        onLogout={handleLogout}
        onThemeChange={setSelectedTheme}
      />
    );
  }

  // --- VISTA: LOGIN TEMATIZADO ---
  return (
    <LoginScreen 
      onLogin={handleJoin} 
      defaultTheme={selectedTheme} 
    />
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