import database from '@react-native-firebase/database';

export interface PlayerData {
  name: string;
  score: number;
  photo?: string;
}

export interface SettingsData {
  theme: string;
  variant: string;
  theme_variant?: string;
  accentColor: string;
  opacity: number;
  verticalMode: boolean;
  showPhotos: boolean;
  swapPlayers: boolean;
  customTitle: string;
  colors?: {
    bg: string;
    primary: string;
    score: string;
    secondary: string;
    text: string;
    window: string;
  };
}

class DatabaseService {
  private db = database();
  
  private normalizeSettings(settings: any, roomRoot?: any): SettingsData {
    if (!settings && !roomRoot) return {} as SettingsData;
    
    const s = settings || {};
    return {
      ...s,
      // Normalization bridge: prefer theme_variant if present (from web, either root or settings)
      variant: roomRoot?.theme_variant || s.theme_variant || s.variant || 'default',
    };
  }

  listenToPlayers(roomId: string, callback: (players: any) => void) {
    const reference = this.db.ref(`/rooms/${roomId}`);
    reference.on('value', snapshot => {
      const data = snapshot.val();
      if (data && (data.p1 || data.p2)) {
        callback({ p1: data.p1, p2: data.p2 });
      }
    });

    return () => reference.off('value');
  }

  listenToRoom(roomId: string, callback: (data: any) => void) {
    const reference = this.db.ref(`/rooms/${roomId}`);
    reference.on('value', snapshot => {
      const data = snapshot.val();
      if (data) {
        data.settings = this.normalizeSettings(data.settings, data);
      }
      callback(data);
    });
    return () => reference.off('value');
  }

  async checkRoomExists(roomId: string): Promise<boolean> {
    const snapshot = await this.db.ref(`/rooms/${roomId}`).once('value');
    return snapshot.exists();
  }

  public initializeRoom(roomId: string) {
    this.db.ref(`/rooms/${roomId}`).update({
      p1: { name: 'Jugador 1', score: 0, photo: "" },
      p2: { name: 'Jugador 2', score: 0, photo: "" }
    });
  }

  updatePlayerName(roomId: string, playerId: string, newName: string) {
    return this.db.ref(`/rooms/${roomId}/${playerId}`).update({
      name: newName,
    });
  }

  updatePlayerPhoto(roomId: string, playerId: string, photoData: string) {
    return this.db.ref(`/rooms/${roomId}/${playerId}`).update({
      photo: photoData,
    });
  }

  updateScore(roomId: string, playerId: string, currentScore: number, change: number) {
    const newScore = Math.max(0, currentScore + change);
    return this.db.ref(`/rooms/${roomId}/${playerId}`).update({
      score: newScore,
    });
  }


  // Escuchar cambios en la configuración (por si alguien cambia el tema desde la web)
  listenToSettings(roomId: string, callback: (settings: SettingsData) => void) {
    const reference = this.db.ref(`/rooms/${roomId}/settings`);
    reference.on('value', snapshot => {
      const data = snapshot.val();
      // En este listener solo tenemos acceso al nodo settings,
      // pero normalizeSettings manejará el fallback interno.
      callback(this.normalizeSettings(data));
    });
    return () => reference.off('value');
  }

  // Actualizar cualquier ajuste de la sala (tema, opacidad, orientación, etc.)
  updateSettings(roomId: string, settings: Partial<SettingsData>) {
    return this.db.ref(`/rooms/${roomId}/settings`).update(settings);
  }

  // Actualizar el tema visual (usando el nuevo método genérico)
  updateTheme(roomId: string, newTheme: string) {
    return this.updateSettings(roomId, { theme: newTheme });
  }

  // Obtener el tema actual de una sala desde Firebase
  async getRoomTheme(roomId: string): Promise<string | null> {
    const snapshot = await this.db.ref(`/rooms/${roomId}/settings/theme`).once('value');
    return snapshot.exists() ? snapshot.val() : null;
  }
}

export const dbService = new DatabaseService();