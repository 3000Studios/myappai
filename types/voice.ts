// Voice Command Types
export interface VoicePayload {
  action?: 'update' | 'query';
  target?: string;
  payload?: Record<string, unknown>;
  key?: string;
  value?: unknown;
  transcript?: string;
}

export interface VoiceAction {
  type: string;
  value: string;
}

export interface VoiceResult {
  ok?: boolean;
  actions?: VoiceAction[];
  summary?: string;
  media?: Record<string, unknown>;
  registry?: Record<string, unknown>;
  error?: string;
  details?: string;
}

export interface PexelsVideoFile {
  link: string;
  quality: string;
}

export interface PexelsVideo {
  video_files: PexelsVideoFile[];
}

export interface PexelsPhoto {
  src: {
    large2x: string;
    original: string;
  };
}

export interface PexelsVideoResponse {
  videos?: PexelsVideo[];
}

export interface PexelsPhotoResponse {
  photos?: PexelsPhoto[];
}

export type PexelsResponse = PexelsVideoResponse | PexelsPhotoResponse;

