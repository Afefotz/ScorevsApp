import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { ScreenWrapper } from '../components/ScreenWrapper';
import { dbService, PlayerData, SettingsData } from '../../services/DatabaseService';
import { ThemeKey } from '../../config/Themes';
import { useTheme } from '../../hooks/useTheme';
import { PlayerCard } from '../components/PlayerCard';
import { OverlaySettingsModal } from '../components/OverlaySettingsModal';

interface DashboardScreenProps {
  roomId: string;
  theme: ThemeKey;
  onLogout: () => void;
}

export const DashboardScreen = ({ roomId, theme, onLogout }: DashboardScreenProps) => {
  const tk = useTheme(theme);
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
      {/* HEADER */}
      <View style={[styles.header, { borderBottomColor: tk.primary }]}>
        <View>
          <Text style={[styles.roomLabel, { color: tk.text }]}>SALA ACTIVA</Text>
          <Text style={[styles.roomInfo,  { color: tk.primary }]}>{roomId}</Text>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity
            onPress={() => setIsSettingsVisible(true)}
            style={[styles.settingsBtn, { borderColor: tk.primary }]}
          >
            <Text style={[styles.settingsIcon, { color: tk.text }]}>⚙️</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onLogout} style={styles.logoutBtn}>
            <Text style={styles.logoutText}>SALIR</Text>
          </TouchableOpacity>
        </View>
      </View>

      <OverlaySettingsModal
        isVisible={isSettingsVisible}
        onClose={() => setIsSettingsVisible(false)}
        roomId={roomId}
        currentThemeKey={theme}
      />

      {/* MARCADORES */}
      <ScrollView contentContainerStyle={styles.content}>
        <PlayerCard
          playerId="p1"
          name={roomData.p1?.name  || 'Jugador 1'}
          score={roomData.p1?.score || 0}
          photo={roomData.p1?.photo}
          showPhotos={roomData.settings?.showPhotos ?? true}
          theme={theme}
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
          theme={theme}
          onNameChange={(newName) => handleNameChange('p2', newName)}
          onScoreChange={(change) => handleScoreChange('p2', change, roomData.p2?.score || 0)}
        />
      </ScrollView>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    padding: 15, borderBottomWidth: 2, backgroundColor: 'rgba(0,0,0,0.1)',
  },
  roomLabel:   { fontSize: 12, fontWeight: 'bold', opacity: 0.8 },
  roomInfo:    { fontSize: 18, fontWeight: '900', textTransform: 'uppercase' },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  settingsBtn: {
    padding: 8, borderRadius: 8, borderWidth: 1,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  settingsIcon: { fontSize: 20 },
  logoutBtn: {
    paddingVertical: 8, paddingHorizontal: 15,
    backgroundColor: '#ff4444', borderRadius: 8, elevation: 3,
  },
  logoutText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  content:    { padding: 20, flexGrow: 1, justifyContent: 'center' },
  vsContainer:{ alignItems: 'center', marginVertical: 5 },
  vsText: {
    fontSize: 28, fontWeight: '900', fontStyle: 'italic',
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 1, height: 1 }, textShadowRadius: 3,
  },
});
