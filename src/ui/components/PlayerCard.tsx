import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, ActivityIndicator } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import { ThemeKey } from '../../config/Themes';
import { useTheme } from '../../hooks/useTheme';
import { EngravedText } from './themed/EngravedText';
import { ThemeCardDecor } from './themed/ThemeEngine';

interface PlayerCardProps {
  playerId: string;
  name: string;
  score: number;
  photo?: string;
  showPhotos?: boolean;
  theme: ThemeKey;
  variant: string;
  onNameChange: (newName: string) => void;
  onScoreChange: (change: number) => void;
  onPhotoChange?: (newPhoto: string) => void;
}

export const PlayerCard = ({
  playerId, name, score, photo, showPhotos, theme, variant, onNameChange, onScoreChange, onPhotoChange
}: PlayerCardProps) => {
  const tk = useTheme(theme, variant);
  const [localName, setLocalName] = useState(name);
  const [isUploading, setIsUploading] = useState(false);

  // Sincronizar si cambió desde Firebase
  useEffect(() => { setLocalName(name); }, [name]);

  const handleNameSubmit = () => {
    if (localName.trim() !== name) {
      onNameChange(localName.trim() || `Jugador ${playerId === 'p1' ? '1' : '2'}`);
    }
  };

  const handlePhotoUpload = async () => {
    if (!onPhotoChange) return;

    try {
      setIsUploading(true);
      const result = await launchImageLibrary({
        mediaType: 'photo',
        includeBase64: true,
        maxWidth: 300,
        maxHeight: 300,
        quality: 0.5,
      });

      if (result.didCancel) {
        setIsUploading(false);
        return;
      }

      if (result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        if (asset.base64) {
          const mimeType = asset.type || 'image/jpeg';
          const dataUri = `data:${mimeType};base64,${asset.base64}`;
          onPhotoChange(dataUri);
        }
      }
    } catch (error) {
      console.log('Error seleccionando imagen:', error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <View style={[
      styles.card,
      {
        backgroundColor: tk.card,
        borderColor: tk.primary,
        borderRadius: tk.cardBorderRadius,
        elevation: tk.cardElevation,
        shadowColor: tk.cardShadowColor,
      },
    ]}>
      <ThemeCardDecor theme={theme} variant={variant} primaryColor={tk.primary} />
      
      {showPhotos ? (
        <TouchableOpacity 
          style={[
            styles.photoContainer, 
            { 
              borderColor: tk.primary, 
              backgroundColor: tk.inputBg,
              shadowColor: tk.cardShadowColor 
            }
          ]}
          onPress={handlePhotoUpload}
          disabled={isUploading}
        >
          {isUploading ? (
            <ActivityIndicator size="small" color={tk.primary} style={{ marginTop: 25 }} />
          ) : photo ? (
            <Image
              key={`photo-${showPhotos}`}
              source={{ uri: photo }}
              style={styles.playerPhoto}
              resizeMode="cover"
            />
          ) : (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <Text style={{ color: tk.text, opacity: 0.6, fontSize: 10, textAlign: 'center', fontWeight: 'bold' }}>
                AÑADIR{'\n'}FOTO
              </Text>
            </View>
          )}
        </TouchableOpacity>
      ) : null}

      <TextInput
        style={[styles.nameInput, { 
          color: tk.text, 
          backgroundColor: tk.inputBg,
          fontFamily: tk.fontFamily,
          textTransform: tk.textTransform,
          textShadowColor: tk.textShadowColor,
          textShadowOffset: tk.textShadowOffset,
          textShadowRadius: tk.textShadowRadius,
          ...(tk.hasEngravedText && {
            borderTopWidth: 2, borderLeftWidth: 2,
            borderBottomWidth: 1, borderRightWidth: 1,
            borderTopColor: 'rgba(0,0,0,0.85)',
            borderLeftColor: 'rgba(0,0,0,0.85)',
            borderBottomColor: 'rgba(255,255,255,0.2)',
            borderRightColor: 'rgba(255,255,255,0.2)',
          }),
        }]}
        value={tk.textTransform === 'uppercase' ? localName.toUpperCase() : localName}
        onChangeText={setLocalName}
        onEndEditing={handleNameSubmit}
        selectTextOnFocus
      />

      <View style={styles.scoreContainer}>
        <TouchableOpacity
          style={[styles.scoreBtn, { 
            backgroundColor: tk.primary,
            ...(tk.hasEngravedText && {
              borderTopWidth: 2, borderLeftWidth: 2, borderBottomWidth: 3, borderRightWidth: 2,
              borderTopColor: 'rgba(255,255,255,0.6)', borderLeftColor: 'rgba(255,255,255,0.6)',
              borderBottomColor: 'rgba(0,0,0,0.8)', borderRightColor: 'rgba(0,0,0,0.8)',
            }),
          }]}
          onPress={() => onScoreChange(-1)}
        >
          {tk.hasEngravedText ? (
            <EngravedText 
              text="-1" 
              textStyle={[styles.btnText, { color: tk.background, fontFamily: tk.fontFamily, textTransform: tk.textTransform }]} 
            />
          ) : (
            <Text style={[
              styles.btnText, 
              { 
                color: tk.background, 
                fontFamily: tk.fontFamily, 
                textTransform: tk.textTransform,
                textShadowColor: tk.textShadowColor,
                textShadowOffset: tk.textShadowOffset,
                textShadowRadius: tk.textShadowRadius,
              }
            ]}>-1</Text>
          )}
        </TouchableOpacity>

        {tk.hasEngravedText ? (
          <EngravedText 
            text={String(score)} 
            textStyle={[styles.scoreText, { color: tk.text, fontFamily: tk.fontFamily, textTransform: tk.textTransform }]} 
          />
        ) : (
          <Text style={[
            styles.scoreText, 
            { 
              color: tk.text, 
              fontFamily: tk.fontFamily, 
              textTransform: tk.textTransform,
              textShadowColor: tk.textShadowColor,
              textShadowOffset: tk.textShadowOffset,
              textShadowRadius: tk.textShadowRadius,
            }
          ]}>{score}</Text>
        )}

        <TouchableOpacity
          style={[styles.scoreBtn, { 
            backgroundColor: tk.primary,
            ...(tk.hasEngravedText && {
              borderTopWidth: 2, borderLeftWidth: 2, borderBottomWidth: 3, borderRightWidth: 2,
              borderTopColor: 'rgba(255,255,255,0.6)', borderLeftColor: 'rgba(255,255,255,0.6)',
              borderBottomColor: 'rgba(0,0,0,0.8)', borderRightColor: 'rgba(0,0,0,0.8)',
            }),
          }]}
          onPress={() => onScoreChange(1)}
        >
          {tk.hasEngravedText ? (
            <EngravedText 
              text="+1" 
              textStyle={[styles.btnText, { color: tk.background, fontFamily: tk.fontFamily, textTransform: tk.textTransform }]} 
            />
          ) : (
            <Text style={[
              styles.btnText, 
              { 
                color: tk.background, 
                fontFamily: tk.fontFamily, 
                textTransform: tk.textTransform,
                textShadowColor: tk.textShadowColor,
                textShadowOffset: tk.textShadowOffset,
                textShadowRadius: tk.textShadowRadius,
              }
            ]}>+1</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 20,
    borderWidth: 2,
    marginBottom: 20,
    alignItems: 'center',
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
    elevation: 4,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  playerPhoto: { width: '100%', height: '100%' },
  scoreContainer: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
  },
  scoreBtn: {
    width: 60, height: 60, borderRadius: 30,
    justifyContent: 'center', alignItems: 'center', marginHorizontal: 15,
  },
  btnText:   { fontSize: 24, fontWeight: 'bold' },
  scoreText: { fontSize: 70, fontWeight: 'bold', minWidth: 90, textAlign: 'center' },
});
