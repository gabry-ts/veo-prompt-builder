/**
 * TypeScript types for Veo JSON prompt structure
 * Based on Google Veo video generation API
 */

export type CameraType =
  | 'static'
  | 'handheld'
  | 'drone'
  | 'selfie-stick'
  | 'crane'
  | 'steadicam'
  | 'gimbal';

export type CameraAngle =
  | 'eye level'
  | 'slightly below eye level'
  | 'slightly above eye level'
  | "bird's eye view"
  | 'low angle'
  | 'high angle'
  | 'dutch angle';

export type CameraMovement =
  | 'static'
  | 'pan left'
  | 'pan right'
  | 'tilt up'
  | 'tilt down'
  | 'zoom in'
  | 'zoom out'
  | 'dolly in'
  | 'dolly out'
  | 'truck left'
  | 'truck right'
  | 'pedestal up'
  | 'pedestal down'
  | 'arc left'
  | 'arc right';

export type LightingStyle =
  | 'natural'
  | 'studio'
  | 'cinematic'
  | 'dramatic'
  | 'soft'
  | 'hard'
  | 'golden hour'
  | 'blue hour'
  | 'neon'
  | 'low-key'
  | 'high-key';

export type ShotSize =
  | 'extreme close-up'
  | 'close-up'
  | 'medium close-up'
  | 'medium shot'
  | 'medium long shot'
  | 'long shot'
  | 'extreme long shot'
  | 'full shot';

export interface VeoCamera {
  type?: CameraType;
  angle?: CameraAngle;
  movement?: CameraMovement;
  shotSize?: ShotSize;
}

export interface VeoLighting {
  style?: LightingStyle;
  description?: string;
  temperature?: string;
  intensity?: string;
}

export interface VeoSubject {
  description: string;
  action?: string;
  position?: string;
  appearance?: string;
}

export interface VeoEnvironment {
  location?: string;
  time?: string;
  weather?: string;
  atmosphere?: string;
}

export interface VeoAudio {
  music?: string;
  soundEffects?: string;
  ambience?: string;
  dialogue?: string;
}

export interface VeoVisualStyle {
  filmGrain?: boolean;
  colorGrading?: string;
  aspectRatio?: string;
  fps?: number;
  resolution?: string;
}

export interface VeoScene {
  camera?: VeoCamera;
  lighting?: VeoLighting;
  subject?: VeoSubject;
  environment?: VeoEnvironment;
  audio?: VeoAudio;
  visualStyle?: VeoVisualStyle;
  description?: string;
  duration?: number;
  transition?: string;
}

export interface VeoSceneData {
  scene: VeoScene;
  metadata?: {
    sceneNumber?: number;
    notes?: string;
    version?: string;
  };
}

export interface VeoPromptData {
  [sceneKey: string]: VeoSceneData;
}
