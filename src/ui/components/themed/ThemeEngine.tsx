import React from 'react';
import { ThemeKey } from '../../../config/Themes';
import { NotebookGridBackground, NotebookMarginLine, BlueprintGridBackground, ParchmentBackground, NotebookHolesDecor, PaperCardDecor } from './PaperParts';
import { NeonDecoRow, NeonFooter, NeonCircuitBackground, NeonCardDecor } from './NeonParts';
import { Win95StatusBar } from './Win95Parts';
import { PastelConfettiDecor, PastelPolkaDotBackground, PastelShapesBackground } from './PastelParts';
import { StoneSlabDecor, StoneBrickBackground, MossyStoneBackground, StoneCardDecor } from './StoneParts';
import { LaserBeamDecor, LaserScannerBackground, LaserGridBackground, LaserGlowBackground, LaserCardDecor } from './LaserParts';
import { ModernPillDecor, ModernGlowBackground, ModernTechGridBackground, ModernCardDecor } from './ModernParts';
import { MetalStripDecor, MetalPanelBackground, MetalCardDecor } from './MetalParts';

interface ThemeDispatcherProps {
  theme: ThemeKey;
  variant?: string;
  hasScanlines?: boolean;
  hasBevel?: boolean;
  hasEngravedText?: boolean;
  primaryColor?: string;
}

/** 
 * Despacha el componente de fondo base según el tema y la variante seleccionada.
 */
export const ThemeBackground = React.memo(({ theme, variant, primaryColor }: ThemeDispatcherProps) => {
  if (theme === 'theme-modern' || theme === 'theme-modern-light') {
    return (
      <>
        <ModernGlowBackground color={primaryColor || '#ffffff'} />
        {theme === 'theme-modern' && <ModernTechGridBackground />}
      </>
    );
  }
  if (theme === 'theme-paper') {
    switch (variant) {
      case 'Plano Arquitectónico':
        return <BlueprintGridBackground />;
      case 'Pergamino Antiguo':
        return <ParchmentBackground />;
      case 'Nota Adhesiva':
        return null; // Fondo liso definido por los tokens principales
      case 'Hoja de Cuaderno':
      default:
        return (
          <>
            <NotebookGridBackground />
            <NotebookMarginLine />
          </>
        );
    }
  }
  if (theme === 'theme-pastel') {
    switch (variant) {
      case 'Rosa Fresa':
      case 'Naranja Durazno':
        return <PastelShapesBackground color={primaryColor || '#ffb2cc'} />;
      case 'Amarillo Vainilla':
      case 'Verde Menta':
        return <PastelPolkaDotBackground color={primaryColor || '#ebe75d'} />;
      default:
        return null;
    }
  }
  if (theme === 'theme-neon') {
    return <NeonCircuitBackground color={primaryColor || '#00ffff'} />;
  }
  if (theme === 'theme-metal') {
    return <MetalPanelBackground color={primaryColor || '#bdc3c7'} />;
  }
  if (theme === 'theme-stone') {
    switch (variant) {
      case 'Rojo Ladrillo':
        return <StoneBrickBackground />;
      case 'Verde Musgo':
        return <MossyStoneBackground />;
      case 'Gris Volcánico (Original)':
      default:
        return null;
    }
  }
  if (theme === 'theme-laser') {
    switch (variant) {
      case 'Rojo Peligro':
        return <LaserScannerBackground />;
      case 'Verde Radiactivo':
        return <LaserGridBackground color={primaryColor || '#00ff00'} />;
      case 'Morado Galáctico':
        return <LaserGlowBackground color={primaryColor || '#bf00ff'} />;
      case 'Amarillo Precaución':
      default:
        return null;
    }
  }
  return null;
});

/**
 * Despacha decoradores internos específicos para las tarjetas de jugadores.
 */
export const ThemeCardDecor = React.memo(({ theme, variant, primaryColor }: ThemeDispatcherProps) => {
  switch (theme) {
    case 'theme-paper':
      return <PaperCardDecor />;
    case 'theme-metal':
      return <MetalCardDecor />;
    case 'theme-neon':
      return <NeonCardDecor color={primaryColor || '#00ffff'} />;
    case 'theme-laser':
      return <LaserCardDecor color={primaryColor || '#ff0000'} />;
    case 'theme-stone':
      return <StoneCardDecor />;
    case 'theme-modern':
    case 'theme-modern-light':
      return <ModernCardDecor />;
    default:
      return null;
  }
});

/**
 * Despacha decoradores frontales/superiores que se muestran al inicio del ScrollView.
 */
export const ThemeHeaderDecor = React.memo(({ theme, variant, hasScanlines, hasEngravedText, primaryColor }: ThemeDispatcherProps) => {
  if (hasScanlines) return <NeonDecoRow color={primaryColor} />;
  if (hasEngravedText) return <MetalStripDecor />;
  
  switch (theme) {
    case 'theme-pastel': return <PastelConfettiDecor primaryColor={primaryColor || ''} />;
    case 'theme-stone': return <StoneSlabDecor />;
    case 'theme-laser': return <LaserBeamDecor primaryColor={primaryColor || ''} />;
    case 'theme-paper':
      // El Plano y el Pergamino no llevan agujeros de cuaderno
      if (variant === 'Plano Arquitectónico' || variant === 'Pergamino Antiguo') return null;
      return <NotebookHolesDecor />;
    case 'theme-modern':
    case 'theme-modern-light':
      return <ModernPillDecor />;
    default: return null;
  }
});

/**
 * Despacha decoradores frontales/inferiores que se muestran al final del ScrollView.
 */
export const ThemeFooterDecor = React.memo(({ theme, variant, hasScanlines, hasBevel, hasEngravedText, primaryColor }: ThemeDispatcherProps) => {
  if (hasScanlines) return <NeonFooter color={primaryColor} />;
  if (hasBevel) return <Win95StatusBar />;
  if (hasEngravedText) return <MetalStripDecor />;
  
  switch (theme) {
    case 'theme-pastel': return <PastelConfettiDecor primaryColor={primaryColor || ''} />;
    case 'theme-stone': return <StoneSlabDecor />;
    case 'theme-laser': return <LaserBeamDecor primaryColor={primaryColor || ''} />;
    case 'theme-paper':
      if (variant === 'Plano Arquitectónico' || variant === 'Pergamino Antiguo') return null;
      return <NotebookHolesDecor />;
    case 'theme-modern':
    case 'theme-modern-light':
      return <ModernPillDecor />;
    default: return null;
  }
});
