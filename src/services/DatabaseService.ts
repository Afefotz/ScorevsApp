import database from '@react-native-firebase/database';

export interface PlayerData {
  name: string;
  score: number;
}

export interface SettingsData {
  theme: string;
  accentColor: string;
  // ***Aquí voy agregar opacidad, verticalMode, etc. en el futuro
}

class DatabaseService {
  private db = database();

  // Pedimos el roomId para saber a qué sala conectarnos
  listenToPlayers(roomId: string, callback: (players: any) => void) {
    const reference = this.db.ref(`/rooms/${roomId}`);
    reference.on('value', snapshot => {
      const data = snapshot.val();
      // Verificamos si realmente no hay datos, o si p1 y p2 no existen
      if (!data || (!data.p1 && !data.p2)) {
        this.initializeRoom(roomId);
      } else {
        // Le mandamos al componente solo los datos que espera
        callback({ p1: data.p1, p2: data.p2 });
      }
    });

    return () => reference.off('value');
  }

  initializeRoom(roomId: string) {
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
      if (snapshot.val()) {
        callback(snapshot.val());
      }
    });
    return () => reference.off('value');
  }

  // Actualizar el tema visual en Firebase para que OBS reaccione
  updateTheme(roomId: string, newTheme: string) {
    return this.db.ref(`/rooms/${roomId}/settings`).update({
      theme: newTheme,
    });
  }
}

export const dbService = new DatabaseService();