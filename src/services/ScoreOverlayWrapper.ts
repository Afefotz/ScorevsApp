import { NativeModules, NativeEventEmitter } from 'react-native';
import { dbService } from './DatabaseService';

const { FloatingScoreModule } = NativeModules;
// Use null safe check in case NativeModule is not yet built properly
const floatingScoreEmitter = FloatingScoreModule ? new NativeEventEmitter(FloatingScoreModule) : null;

export interface OverlayConfig {
  roomId: string;
  p1: { name: string; score: number; photo?: string | null };
  p2: { name: string; score: number; photo?: string | null };
  showPhotos: boolean;
  themeConfig: {
    background: string;
    text: string;
    primary: string;
    hasBevel: boolean;
    hasScanlines: boolean;
  };
}

class ScoreOverlayWrapper {
  private subscription: any;
  private currentRoomId: string | null = null;
  private configPayload: string = '';

  initListeners() {
    if (this.subscription || !floatingScoreEmitter) return;
    
    this.subscription = floatingScoreEmitter.addListener('onScoreUpdate', (event) => {
      if (this.currentRoomId) {
        // Optimistic sync back to Firebase when pressing native UI buttons
        dbService.updateScore(this.currentRoomId, event.playerId, event.currentScore, event.change);
      }
    });
  }

  startOverlay(config: OverlayConfig) {
    if (!FloatingScoreModule) return;
    this.currentRoomId = config.roomId;
    this.configPayload = JSON.stringify(config);
    try {
      FloatingScoreModule.showOverlay(this.configPayload);
    } catch (e) {
      console.warn("Error starting overlay, NativeModule might be missing", e);
    }
  }

  updateOverlay(config: OverlayConfig) {
    if (!FloatingScoreModule) return;
    this.configPayload = JSON.stringify(config);
    try {
      FloatingScoreModule.updateOverlay(this.configPayload);
    } catch (e) {
      console.warn("Error updating overlay", e);
    }
  }

  stopOverlay() {
    if (!FloatingScoreModule) return;
    try {
      FloatingScoreModule.hideOverlay();
    } catch (e) {
      console.warn("Error stopping overlay", e);
    }
    this.currentRoomId = null;
  }
}

export const scoreOverlayWrapper = new ScoreOverlayWrapper();
