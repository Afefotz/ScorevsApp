import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { 
  View, 
  Text, 
  Modal, 
  StyleSheet, 
  Pressable, 
  ScrollView, 
  Switch,
  TextInput,
  PanResponder,
  Animated,
  Dimensions
} from 'react-native';
import { ThemeKey, Themes } from '../../config/Themes';
import { dbService, SettingsData } from '../../services/DatabaseService';

interface OverlaySettingsModalProps {
  isVisible: boolean;
  onClose: () => void;
  roomId: string;
  currentThemeKey: ThemeKey;
}

// COMPONENTE: Custom Slider para Opacidad
const CustomSlider = ({ value, onValueChange, theme }: { value: number, onValueChange: (val: number) => void, theme: any }) => {
  const [containerWidth, setContainerWidth] = useState(Dimensions.get('window').width - 80);
  const animatedValue = useRef(new Animated.Value(value)).current;

  useEffect(() => {
    animatedValue.setValue(value);
  }, [value]);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (evt, gestureState) => {
        // Obtenemos la posición relativa al contenedor
        const touchX = gestureState.moveX - (Dimensions.get('window').width - containerWidth) / 2;
        let newValue = touchX / containerWidth;
        newValue = Math.min(Math.max(newValue, 0), 1);
        const roundedValue = Math.round(newValue * 100);
        onValueChange(roundedValue);
      },
      onPanResponderRelease: () => {}
    })
  ).current;

  const thumbPosition = animatedValue.interpolate({
    inputRange: [0, 100],
    outputRange: [0, containerWidth],
    extrapolate: 'clamp'
  });

  return (
    <View 
      style={styles.sliderWrapper}
      onLayout={(e) => setContainerWidth(e.nativeEvent.layout.width)}
    >
      <View style={[styles.sliderTrack, { backgroundColor: 'rgba(150,150,150,0.15)' }]} />
      <Animated.View 
        style={[
          styles.sliderTrackActive, 
          { 
            backgroundColor: theme.primary,
            width: thumbPosition 
          }
        ]} 
      />
      <Animated.View
        {...panResponder.panHandlers}
        style={[
          styles.sliderThumb,
          {
            backgroundColor: theme.primary,
            borderColor: theme.background,
            transform: [{ translateX: thumbPosition }]
          }
        ]}
      >
        <View style={[styles.sliderValueBadge, { backgroundColor: theme.primary }]}>
            <Text style={[styles.sliderValueText, { color: theme.background }]}>{value}</Text>
        </View>
      </Animated.View>
    </View>
  );
};

export const OverlaySettingsModal = ({ 
  isVisible, 
  onClose, 
  roomId, 
  currentThemeKey 
}: OverlaySettingsModalProps) => {
  const currentTheme = Themes[currentThemeKey];
  const [settings, setSettings] = useState<SettingsData | null>(null);

  useEffect(() => {
    if (isVisible) {
      const unsubscribe = dbService.listenToSettings(roomId, (data) => {
        // Asegurar valores por defecto si no existen
        const dbOpacity = data?.opacity ?? 100;
        // Mapeo inverso: 65-100 DB => 0-100 UI
        const uiOpacity = Math.round(((dbOpacity - 65) / 35) * 100);

        setSettings({
          theme: data?.theme || 'theme-win95',
          variant: data?.variant || 'default',
          accentColor: data?.accentColor || currentTheme.primary,
          opacity: Math.max(0, Math.min(100, uiOpacity)),
          verticalMode: data?.verticalMode ?? false,
          showPhotos: data?.showPhotos ?? true,
          swapPlayers: data?.swapPlayers ?? false,
          customTitle: data?.customTitle || '',
        });
      });
      return () => unsubscribe();
    }
  }, [isVisible, roomId, currentTheme.primary]);

  const handleUpdate = useCallback((key: keyof SettingsData, value: any) => {
    if (!settings) return;
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);

    // Si es opacidad, mapeamos 0-100 UI => 65-100 DB
    let dataToSave = value;
    if (key === 'opacity') {
      dataToSave = Math.round(65 + (value / 100) * 35);
    }

    dbService.updateSettings(roomId, { [key]: dataToSave });
  }, [roomId, settings]);

  const handleVariantSelect = useCallback((variantId: string, color: string) => {
    if (!settings) return;
    const updates = { variant: variantId, accentColor: color };
    setSettings({ ...settings, ...updates });
    dbService.updateSettings(roomId, updates);
  }, [roomId, settings]);

  const selectedThemeConfig = useMemo(() => {
    return settings ? Themes[settings.theme as ThemeKey] : currentTheme;
  }, [settings, currentTheme]);

  if (!settings) return null;

  return (
    <Modal transparent visible={isVisible} animationType="fade" onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={[
          styles.modalContainer, 
          { backgroundColor: currentTheme.background, borderColor: currentTheme.primary, borderWidth: currentThemeKey === 'theme-win95' ? 3 : 1 }
        ]}>
          {/* HEADER */}
          <View style={[styles.header, { backgroundColor: currentTheme.primary }]}>
            <Text style={[styles.headerTitle, { color: currentTheme.background }]}>CONTROL DE OVERLAY</Text>
            <Pressable onPress={onClose} style={styles.closeBtn}>
              <Text style={{ color: currentTheme.background, fontWeight: 'bold', fontSize: 20 }}>✕</Text>
            </Pressable>
          </View>

          <ScrollView contentContainerStyle={styles.content}>
            
            {/* TÍTULO */}
            <View style={styles.section}>
              <Text style={[styles.label, { color: currentTheme.text }]}>TÍTULO DEL EVENTO</Text>
              <TextInput
                style={[styles.input, { backgroundColor: currentTheme.inputBg, color: currentTheme.text, borderColor: currentTheme.primary }]}
                value={settings.customTitle}
                onChangeText={(text) => handleUpdate('customTitle', text)}
                placeholder="Ej: Torneo Verano 2024..."
                placeholderTextColor="rgba(150,150,150,0.5)"
              />
            </View>

            {/* THEME SELECTOR */}
            <View style={styles.section}>
              <Text style={[styles.label, { color: currentTheme.text }]}>SISTEMA VISUAL (THEME)</Text>
              <View style={styles.optionsGrid}>
                {Object.keys(Themes).map((key) => (
                  <Pressable
                    key={key}
                    style={[styles.optionBtn, { backgroundColor: settings.theme === key ? currentTheme.primary : currentTheme.inputBg, borderColor: currentTheme.primary }]}
                    onPress={() => handleUpdate('theme', key)}
                  >
                    <Text style={[styles.optionText, { color: settings.theme === key ? currentTheme.background : currentTheme.text }]}>
                      {key.replace('theme-', '').toUpperCase()}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>

            {/* VARIANTES */}
            {selectedThemeConfig?.variants && (
              <View style={styles.section}>
                <Text style={[styles.label, { color: currentTheme.text }]}>ACENTO / VARIANTE</Text>
                <View style={styles.variantContainer}>
                  {selectedThemeConfig.variants.map((v) => (
                    <Pressable
                      key={v.id}
                      style={[styles.variantBtn, { backgroundColor: v.color, borderColor: settings.variant === v.id ? currentTheme.text : 'transparent', borderWidth: settings.variant === v.id ? 3 : 0 }]}
                      onPress={() => handleVariantSelect(v.id, v.color)}
                    >
                      {settings.variant === v.id && <View style={[styles.activeDot, { backgroundColor: currentTheme.background }]} />}
                    </Pressable>
                  ))}
                </View>
              </View>
            )}

            {/* OPACIDAD CON SLIDER */}
            <View style={styles.section}>
              <View style={styles.row}>
                <Text style={[styles.label, { color: currentTheme.text, marginBottom: 0 }]}>OPACIDAD DEL FONDO</Text>
                <Text style={[styles.valueDisplay, { color: currentTheme.text, backgroundColor: currentTheme.inputBg, borderColor: currentTheme.primary, borderWidth: 1 }]}>
                    {settings.opacity}%
                </Text>
              </View>
              <View style={styles.sliderContainer}>
                <CustomSlider 
                  value={settings.opacity} 
                  onValueChange={(val) => handleUpdate('opacity', val)}
                  theme={currentTheme}
                />
              </View>
            </View>

            {/* CONTROLES TÉCNICOS */}
            <View style={styles.controlGrid}>
              <View style={styles.controlItem}>
                <Text style={[styles.smallLabel, { color: currentTheme.text }]}>MODO VERTICIAL (TikTok)</Text>
                <Switch value={settings.verticalMode} onValueChange={(val) => handleUpdate('verticalMode', val)} trackColor={{ false: '#767577', true: currentTheme.primary }} thumbColor={settings.verticalMode ? '#fff' : '#f4f3f4'} />
              </View>

              <View style={styles.controlItem}>
                <Text style={[styles.smallLabel, { color: currentTheme.text }]}>MOSTRAR FOTOS</Text>
                <Switch value={settings.showPhotos} onValueChange={(val) => handleUpdate('showPhotos', val)} trackColor={{ false: '#767577', true: currentTheme.primary }} thumbColor={settings.showPhotos ? '#fff' : '#f4f3f4'} />
              </View>

              <View style={styles.controlItem}>
                <Text style={[styles.smallLabel, { color: currentTheme.text }]}>INVERTIR LADOS (SWAP)</Text>
                <Switch value={settings.swapPlayers} onValueChange={(val) => handleUpdate('swapPlayers', val)} trackColor={{ false: '#767577', true: currentTheme.primary }} thumbColor={settings.swapPlayers ? '#fff' : '#f4f3f4'} />
              </View>
            </View>

          </ScrollView>

          <Pressable style={[styles.saveBtn, { backgroundColor: currentTheme.primary }]} onPress={onClose}>
            <Text style={[styles.saveBtnText, { color: currentTheme.background }]}>GUARDAR Y CERRAR</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.85)', justifyContent: 'center', alignItems: 'center', padding: 15 },
  modalContainer: { width: '100%', maxHeight: '90%', borderRadius: 12, overflow: 'hidden', elevation: 25 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16 },
  headerTitle: { fontWeight: '900', fontSize: 13, letterSpacing: 1.5 },
  closeBtn: { padding: 5 },
  content: { padding: 20, paddingBottom: 40 },
  section: { marginBottom: 25 },
  label: { fontSize: 10, fontWeight: '900', marginBottom: 12, textTransform: 'uppercase', letterSpacing: 1, opacity: 0.6 },
  input: { padding: 12, borderRadius: 8, borderWidth: 1, fontSize: 16 },
  optionsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  optionBtn: { paddingVertical: 10, paddingHorizontal: 10, borderRadius: 6, borderWidth: 1, flex: 1, minWidth: '30%', alignItems: 'center' },
  optionText: { fontSize: 10, fontWeight: '900' },
  variantContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  variantBtn: { width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center', elevation: 4 },
  activeDot: { width: 12, height: 12, borderRadius: 6 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  valueDisplay: { paddingHorizontal: 12, paddingVertical: 4, borderRadius: 8, fontWeight: '900', fontSize: 12 },
  sliderContainer: { height: 40, justifyContent: 'center', marginTop: 10 },
  sliderWrapper: { height: 30, justifyContent: 'center' },
  sliderTrack: { height: 6, borderRadius: 3, position: 'absolute', width: '100%' },
  sliderTrackActive: { height: 6, borderRadius: 3, position: 'absolute' },
  sliderThumb: { width: 28, height: 28, borderRadius: 14, borderWidth: 3, position: 'absolute', left: -14, top: 1, elevation: 6, shadowColor: '#000', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.3, shadowRadius: 3, justifyContent: 'center', alignItems: 'center' },
  sliderValueBadge: { position: 'absolute', top: -35, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  sliderValueText: { fontSize: 11, fontWeight: 'bold' },
  controlGrid: { borderTopWidth: 1, borderBottomWidth: 1, borderColor: 'rgba(150,150,150,0.1)', marginVertical: 10, paddingVertical: 10 },
  controlItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 8 },
  smallLabel: { fontSize: 10, fontWeight: 'bold', textTransform: 'uppercase' },
  saveBtn: { padding: 20, alignItems: 'center' },
  saveBtnText: { fontWeight: '900', fontSize: 16, letterSpacing: 2 }
});
