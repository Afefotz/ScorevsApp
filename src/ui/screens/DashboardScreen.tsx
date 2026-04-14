import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, StatusBar, LayoutAnimation } from 'react-native';
import { ScreenWrapper } from '../components/ScreenWrapper';
import { dbService, PlayerData, SettingsData } from '../../services/DatabaseService';
import { Themes, ThemeKey } from '../../config/Themes';
import { useTheme } from '../../hooks/useTheme';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { PlayerCard } from '../components/PlayerCard';
import { OverlaySettingsModal } from '../components/OverlaySettingsModal';
import { EngravedText } from '../components/themed/EngravedText';
import { ThemeBackground, ThemeHeaderDecor, ThemeFooterDecor } from '../components/themed/ThemeEngine';

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

  const activeVariant = roomData?.settings?.variant || '';
  const tk = useTheme(activeThemeKey, activeVariant);

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
      <View key={`${activeThemeKey}-${activeVariant}`} style={{ flex: 1 }}>
        <ThemeBackground theme={activeThemeKey} variant={activeVariant} primaryColor={tk.primary} />
        {/* HEADER */}
        <View style={[styles.header, { 
          borderBottomColor: tk.headerBorderBottomColor || tk.primary,
          backgroundColor: tk.headerBg,
          borderBottomWidth: tk.headerBorderBottomWidth,
        }]}>
          <View>
            <Text style={[styles.roomLabel, { 
              color: tk.headerTextColor, 
              opacity: 0.8,
              letterSpacing: tk.headerLetterSpacing,
              fontWeight: tk.headerFontWeight,
              textTransform: tk.headerTextTransform,
            }]}>
              SALA ACTIVA
            </Text>
            <Text style={[styles.roomInfo, { 
              color: tk.headerTextColor,
              fontWeight: '900',
              letterSpacing: tk.headerLetterSpacing,
              textTransform: 'uppercase',
            }]}>
              {roomId}
            </Text>
          </View>
          <View style={styles.headerRight}>
            <TouchableOpacity
              onPress={() => setIsSettingsVisible(true)}
              style={[styles.settingsBtn, { 
                borderColor: tk.headerTextColor, 
                backgroundColor: 'rgba(255,255,255,0.1)',
                borderWidth: tk.hasBevel ? 2 : 1,
              }]}
            >
              <Text style={[styles.settingsIcon, { color: tk.headerTextColor }]}>⚙️</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              onPress={onLogout} 
              style={[styles.logoutBtn, { 
                backgroundColor: tk.errorColor,
                borderWidth: tk.hasBevel ? 2 : 0,
                borderColor: '#fff',
              }]}
            >
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
          {/* Decoradores Superiores */}
          <ThemeHeaderDecor 
            theme={activeThemeKey} 
            variant={activeVariant}
            hasScanlines={tk.hasScanlines}
            hasEngravedText={tk.hasEngravedText}
            primaryColor={tk.primary}
          />
          
          <PlayerCard
            playerId="p1"
            name={roomData.p1?.name  || 'Jugador 1'}
            score={roomData.p1?.score || 0}
            photo={roomData.p1?.photo}
            showPhotos={roomData.settings?.showPhotos ?? true}
            theme={activeThemeKey}
            variant={activeVariant}
            onNameChange={(newName) => handleNameChange('p1', newName)}
            onScoreChange={(change) => handleScoreChange('p1', change, roomData.p1?.score || 0)}
          />

          <View style={styles.vsContainer}>
            {tk.hasEngravedText ? (
              <EngravedText 
                text="VS"
                textStyle={[styles.vsText, { color: tk.text, fontSize: 32 }]}
              />
            ) : (
              <Text style={[styles.vsText, { 
                color: tk.text,
                textShadowColor: tk.hasScanlines ? tk.primary : 'rgba(0,0,0,0.3)',
              }]}>VS</Text>
            )}
          </View>

          <PlayerCard
            playerId="p2"
            name={roomData.p2?.name  || 'Jugador 2'}
            score={roomData.p2?.score || 0}
            photo={roomData.p2?.photo}
            showPhotos={roomData.settings?.showPhotos ?? true}
            theme={activeThemeKey}
            variant={activeVariant}
            onNameChange={(newName) => handleNameChange('p2', newName)}
            onScoreChange={(change) => handleScoreChange('p2', change, roomData.p2?.score || 0)}
          />

          {/* Decoradores Inferiores */}
          <ThemeFooterDecor 
            theme={activeThemeKey} 
            variant={activeVariant}
            hasScanlines={tk.hasScanlines}
            hasBevel={tk.hasBevel}
            hasEngravedText={tk.hasEngravedText}
            primaryColor={tk.primary}
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
