export type VoiceCommand =
  | { action: 'addText'; text: string }
  | { action: 'addVideo'; src: string }
  | { action: 'addImage'; src: string }
  | { action: 'injectHTML'; html: string }
  | { action: 'setCSS'; selector: string; css: Record<string, string> }
  | { action: 'navigate'; path: string };

