export function StoryBeats(emotion: string) {
  const beats: Record<string, string> = {
    happy: 'rise',
    angry: 'climax',
    sad: 'fall',
    surprised: 'build',
    neutral: 'idle',
  };

  const recommendedScene: Record<string, string> = {
    happy: 'victory_hall',
    angry: 'fire_core',
    sad: 'ocean_room',
    surprised: 'pulse_zone',
    neutral: 'lobby',
  };

  return {
    storyBeat: beats[emotion] ?? 'idle',
    recommendedScene: recommendedScene[emotion] ?? 'lobby',
  };
}

