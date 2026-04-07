import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { ScreenWrapper } from '../components/ScreenWrapper';
import { dbService, PlayerData } from '../../services/DatabaseService';
import { ThemeKey, Themes } from '../../config/Themes';
import { PlayerCard } from '../components/PlayerCard';

interface DashboardScreenProps {
  roomId: string;
  theme: ThemeKey;
  onLogout: () => void;
}

export const DashboardScreen = ({ roomId, theme, onLogout }: DashboardScreenProps) => {
  const currentTheme = Themes[theme] || Themes['theme-win95'];
  const [players, setPlayers] = useState<{ p1: PlayerData, p2: PlayerData } | null>(null);

  useEffect(() => {
    const unsubscribePlayers = dbService.listenToPlayers(roomId, (data) => {
      setPlayers(data);
    });

    return () => {
      unsubscribePlayers();
    };
  }, [roomId]);

  const handleNameChange = (playerId: string, newName: string) => {
    dbService.updatePlayerName(roomId, playerId, newName);
  };

  const handleScoreChange = (playerId: string, change: number, currentScore: number) => {
    dbService.updateScore(roomId, playerId, currentScore, change);
  };

  if (!players) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: currentTheme.background }]}>
        <Text style={{ color: currentTheme.text, fontSize: 18, fontWeight: 'bold' }}>Sincronizando sala...</Text>
      </View>
    );
  }

  return (
    <ScreenWrapper style={{ backgroundColor: currentTheme.background }}>
      {/* HEADER DE LA SALA */}
      <View style={[styles.header, { borderBottomColor: currentTheme.primary }]}>
        <View>
          <Text style={[styles.roomLabel, { color: currentTheme.text }]}>SALA ACTIVA</Text>
          <Text style={[styles.roomInfo, { color: currentTheme.primary }]}>{roomId}</Text>
        </View>
        <TouchableOpacity onPress={onLogout} style={styles.logoutBtn}>
          <Text style={styles.logoutText}>SALIR</Text>
        </TouchableOpacity>
      </View>

      {/* CUERPO PRINCIPAL {marcadores} */}
      <ScrollView contentContainerStyle={styles.content}>
        <PlayerCard
          playerId="p1"
          name={players.p1?.name || 'Jugador 1'}
          score={players.p1?.score || 0}
          theme={theme}
          onNameChange={(newName) => handleNameChange('p1', newName)}
          onScoreChange={(change) => handleScoreChange('p1', change, players.p1?.score || 0)}
        />

        <View style={styles.vsContainer}>
          <Text style={[styles.vsText, { color: currentTheme.text }]}>VS</Text>
        </View>

        <PlayerCard
          playerId="p2"
          name={players.p2?.name || 'Jugador 2'}
          score={players.p2?.score || 0}
          theme={theme}
          onNameChange={(newName) => handleNameChange('p2', newName)}
          onScoreChange={(change) => handleScoreChange('p2', change, players.p2?.score || 0)}
        />
      </ScrollView>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 2,
    backgroundColor: 'rgba(0,0,0,0.1)'
  },
  roomLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    opacity: 0.8,
  },
  roomInfo: {
    fontSize: 18,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  logoutBtn: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    backgroundColor: '#ff4444',
    borderRadius: 8,
    elevation: 3,
  },
  logoutText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  content: {
    padding: 20,
    flexGrow: 1,
    justifyContent: 'center',
  },
  vsContainer: {
    alignItems: 'center',
    marginVertical: 5,
  },
  vsText: {
    fontSize: 28,
    fontWeight: '900',
    fontStyle: 'italic',
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  }
});
