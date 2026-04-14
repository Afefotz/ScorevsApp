import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, StatusBar, LayoutAnimation } from 'react-native';
import { ScreenWrapper } from '../components/ScreenWrapper';
import { dbService, PlayerData, SettingsData } from '../../services/DatabaseService';
import { Themes, ThemeKey } from '../../config/Themes';
import { useTheme } from '../../hooks/useTheme';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { PlayerCard } from '../components/PlayerCard';
import { OverlaySettingsModal } from '../components/OverlaySettingsModal';

interface DashboardScreenProps {
  roomId: string;
  theme: ThemeKey;
  onLogout: () => void;
  onThemeChange: (theme: ThemeKey) => void;
}

export const DashboardScreen = ({ roomId, theme, onLogout, onThemeChange }: DashboardScreenProps) => {
  const [roomData, setRoomData] = useState<{
    p1: PlayerData;
    p2: PlayerData;
    settings: SettingsData;
  } | null>(null);
  const [isSettingsVisible, setIsSettingsVisible] = useState(false);

  useEffect(() => {
    const reference = dbService.listenToRoom(roomId, (data) => { setRoomData(data); });
    return () => reference();
  }, [roomId]);

  // --- LÓGICA DE TEMA DINÁMICO ---
  const activeThemeKey = (roomData?.settings?.theme && Themes[roomData.settings.theme as ThemeKey])
    ? (roomData.settings.theme as ThemeKey)
    : theme;

  const tk = useTheme(activeThemeKey);

  // Persistir el tema si cambió en Firebase y notificar al App
  useEffect(() => {
    if (activeThemeKey) {
      // Transición suave al cambiar el tema (evita "saltos" visuales)
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      
      AsyncStorage.setItem('@versus_selected_theme', activeThemeKey);
      onThemeChange(activeThemeKey);
    }
  }, [activeThemeKey, onThemeChange]);

  const handleNameChange  = (playerId: string, newName: string) =>
    dbService.updatePlayerName(roomId, playerId, newName);

  const handleScoreChange = (playerId: string, change: number, currentScore: number) =>
    dbService.updateScore(roomId, playerId, currentScore, change);

  if (!roomData) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: tk.screenBg }]}>
        <Text style={{ color: tk.text, fontSize: 18, fontWeight: 'bold' }}>
          Sincronizando sala...
        </Text>
      </View>
    );
  }

  return (
    <ScreenWrapper style={{ backgroundColor: tk.screenBg }}>
      <StatusBar barStyle={tk.statusBarStyle} backgroundColor={tk.headerBg} />
      
      {/* 
          Contenedor principal con KEY vinculada al tema activo.
          Esto fuerza un re-montado limpio, eliminando residuos visuales (colores, bordes)
          que a veces persisten por caché de estilos de la plataforma.
      */}
      <View key={activeThemeKey} style={{ flex: 1 }}>
        {/* HEADER */}
        <View style={[styles.header, { 
          borderBottomColor: tk.primary,
          backgroundColor: tk.headerBg,
          borderBottomWidth: tk.headerBorderBottomWidth,
        }]}>
          <View>
            <Text style={[styles.roomLabel, { color: tk.text }]}>SALA ACTIVA</Text>
            <Text style={[styles.roomInfo,  { color: tk.primary }]}>{roomId}</Text>
          </View>
          <View style={styles.headerRight}>
            <TouchableOpacity
              onPress={() => setIsSettingsVisible(true)}
              style={[styles.settingsBtn, { borderColor: tk.primary, backgroundColor: tk.inputBg }]}
            >
              <Text style={[styles.settingsIcon, { color: tk.text }]}>⚙️</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={onLogout} style={[styles.logoutBtn, { backgroundColor: tk.errorColor }]}>
              <Text style={styles.logoutText}>SALIR</Text>
            </TouchableOpacity>
          </View>
        </View>

      <OverlaySettingsModal
        isVisible={isSettingsVisible}
        onClose={() => setIsSettingsVisible(false)}
        roomId={roomId}
        currentThemeKey={activeThemeKey}
      />

      {/* MARCADORES */}
      <ScrollView contentContainerStyle={styles.content}>
        <PlayerCard
          playerId="p1"
          name={roomData.p1?.name  || 'Jugador 1'}
          score={roomData.p1?.score || 0}
          photo={roomData.p1?.photo}
          showPhotos={roomData.settings?.showPhotos ?? true}
          theme={activeThemeKey}
          onNameChange={(newName) => handleNameChange('p1', newName)}
          onScoreChange={(change) => handleScoreChange('p1', change, roomData.p1?.score || 0)}
        />

        <View style={styles.vsContainer}>
          <Text style={[styles.vsText, { color: tk.text }]}>VS</Text>
        </View>

        <PlayerCard
          playerId="p2"
          name={roomData.p2?.name  || 'Jugador 2'}
          score={roomData.p2?.score || 0}
          photo={roomData.p2?.photo}
          showPhotos={roomData.settings?.showPhotos ?? true}
          theme={activeThemeKey}
          onNameChange={(newName) => handleNameChange('p2', newName)}
          onScoreChange={(change) => handleScoreChange('p2', change, roomData.p2?.score || 0)}
        />
        </ScrollView>
      </View>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    padding: 15,
  },
  roomLabel:   { fontSize: 10, fontWeight: 'bold', opacity: 0.6, letterSpacing: 1 },
  roomInfo:    { fontSize: 18, fontWeight: '900', textTransform: 'uppercase' },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  settingsBtn: {
    padding: 8, borderRadius: 8, borderWidth: 1,
  },
  settingsIcon: { fontSize: 20 },
  logoutBtn: {
    paddingVertical: 8, paddingHorizontal: 15,
    borderRadius: 8, elevation: 3,
  },
  logoutText: { color: '#fff', fontWeight: 'bold', fontSize: 13 },
  content:    { padding: 20, flexGrow: 1, justifyContent: 'center' },
  vsContainer:{ alignItems: 'center', marginVertical: 5 },
  vsText: {
    fontSize: 28, fontWeight: '900', fontStyle: 'italic',
    textShadowOffset: { width: 1, height: 1 }, textShadowRadius: 3,
  },
});
