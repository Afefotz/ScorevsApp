import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { ThemeKey, Themes } from '../../config/Themes';

interface PlayerCardProps {
  playerId: string;
  name: string;
  score: number;
  photo?: string;
  showPhotos?: boolean;
  theme: ThemeKey;
  onNameChange: (newName: string) => void;
  onScoreChange: (change: number) => void;
}

export const PlayerCard = ({ playerId, name, score, photo, showPhotos, theme, onNameChange, onScoreChange }: PlayerCardProps) => {
  const currentTheme = Themes[theme];
  const [localName, setLocalName] = useState(name);

  // Sincronizar el nombre si cambió desde el exterior (Firebase)
  useEffect(() => {
    setLocalName(name);
  }, [name]);

  const handleNameSubmit = () => {
    if (localName.trim() !== name) {
      onNameChange(localName.trim() || `Jugador ${playerId === 'p1' ? '1' : '2'}`);
    }
  };

  return (
    <View style={[styles.card, { backgroundColor: currentTheme.card, borderColor: currentTheme.primary }]}>
      {showPhotos && photo ? (
        <View style={[styles.photoContainer, { borderColor: currentTheme.primary }]}>
          <Image 
            key={`photo-${showPhotos}`}
            source={{ uri: photo }} 
            style={styles.playerPhoto} 
            resizeMode="cover"
          />
        </View>
      ) : null}
      
      <TextInput
        style={[styles.nameInput, { color: currentTheme.text, backgroundColor: currentTheme.inputBg }]}
        value={localName}
        onChangeText={setLocalName}
        onEndEditing={handleNameSubmit}
        selectTextOnFocus
      />
      
      <View style={styles.scoreContainer}>
        <TouchableOpacity 
          style={[styles.scoreBtn, { backgroundColor: currentTheme.primary }]}
          onPress={() => onScoreChange(-1)}
        >
          <Text style={[styles.btnText, { color: currentTheme.background }]}>-1</Text>
        </TouchableOpacity>
        
        <Text style={[styles.scoreText, { color: currentTheme.text }]}>{score}</Text>
        
        <TouchableOpacity 
          style={[styles.scoreBtn, { backgroundColor: currentTheme.primary }]}
          onPress={() => onScoreChange(1)}
        >
          <Text style={[styles.btnText, { color: currentTheme.background }]}>+1</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 20,
    borderRadius: 12,
    borderWidth: 2,
    marginBottom: 20,
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  nameInput: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    width: '100%',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  photoContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    marginBottom: 15,
    overflow: 'hidden',
    backgroundColor: 'rgba(0,0,0,0.1)',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  playerPhoto: {
    width: '100%',
    height: '100%',
  },
  scoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scoreBtn: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 15,
  },
  btnText: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  scoreText: {
    fontSize: 70,
    fontWeight: 'bold',
    minWidth: 90,
    textAlign: 'center',
  }
});
