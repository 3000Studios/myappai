/// <reference types="google.maps" />

declare module 'canvas-confetti' {
  interface Options {
    particleCount?: number;
    spread?: number;
    origin?: { x?: number; y?: number };
    zIndex?: number;
    startVelocity?: number;
    decay?: number;
    gravity?: number;
    drift?: number;
    ticks?: number;
    colors?: string[];
    shapes?: Array<'square' | 'circle'>;
    scalar?: number;
    disableForReducedMotion?: boolean;
  }

  type ConfettiFunction = (options?: Options) => Promise<null>;

  const confetti: ConfettiFunction & {
    reset: () => void;
    create: (canvas: HTMLCanvasElement, globalOptions?: { resize?: boolean }) => ConfettiFunction;
  };

  export default confetti;
}

declare module '@tensorflow-models/blazeface' {
  interface BlazeFacePrediction {
    topLeft: [number, number];
    topRight: [number, number];
    bottomLeft: [number, number];
    bottomRight: [number, number];
    probability: number[];
    landmarks: Array<[number, number]>;
  }

  interface BlazeFaceModel {
    estimateFaces: (
      input: HTMLVideoElement | HTMLImageElement | HTMLCanvasElement | ImageData,
      returnTensors?: boolean
    ) => Promise<BlazeFacePrediction[]>;
  }

  export function load(): Promise<BlazeFaceModel>;
}

export {};

