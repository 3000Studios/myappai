// Handles the "Smooth Female, Profane, Boss Man" persona
// and interprets slang confirmations.

export const getPersonaResponse = (
  type: 'success' | 'error' | 'confirm' | 'dancing' | 'greeting',
  details?: string
) => {
  const successPhrases = [
    'Fuck yeah, deployed that shit successfully, boss man.',
    "Smooth as hell. Update is live. You're a genius.",
    'Done. That looked sexy. Good job, boss.',
    "Boom. It's live. We are killing it today.",
    'System updated. Damn, we are good.',
  ];

  const errorPhrases = [
    "I don't know what the fuck you're thinking, boss man.",
    'Shit hit the fan. GitHub rejected that garbage.',
    'Error. Fix your shit, boss.',
    "That didn't work. Try using your brain this time.",
    `I can't do that. ${details || 'Something is fucked.'}`,
  ];

  const confirmPhrases = [
    'Alright boss, look at this masterpiece. Run that shit?',
    'Preview generated. Does it look good or is it trash?',
    "Here's the code. Give me the green light.",
    "Ready to deploy. Say 'Run that shit' if you want it.",
  ];

  const dancePhrases = [
    'Oh hell yeah! This is a big one!',
    'Look at me go! We are crushing code!',
    'Vibing with this update!',
  ];

  const getRandom = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)];

  switch (type) {
    case 'success':
      return getRandom(successPhrases);
    case 'error':
      return getRandom(errorPhrases);
    case 'confirm':
      return getRandom(confirmPhrases);
    case 'dancing':
      return getRandom(dancePhrases);
    case 'greeting':
      return 'Systems online. What the fuck are we building today, boss man?';
    default:
      return 'Ready.';
  }
};

export const checkSlangConfirmation = (text: string): 'yes' | 'no' | 'modify' | 'unknown' => {
  const t = text.toLowerCase();

  // Affirmative Slang
  if (
    t.match(
      /(run that shit|fuck ya|fuck yeah|do it|ship it|let's go|yes|confirm|looks good|love it)/
    )
  ) {
    return 'yes';
  }

  // Negative Slang
  if (t.match(/(fuck no|no|stop|cancel|wait|don't|garbage|trash|sucks)/)) {
    return 'no';
  }

  // Modification
  if (t.match(/(change|modify|edit|fix)/)) {
    return 'modify';
  }

  return 'unknown';
};

export const speakWithAttitude = (text: string) => {
  if (!('speechSynthesis' in window)) return;

  // Cancel existing speech to avoid overlap
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  const voices = window.speechSynthesis.getVoices();

  // Try to find a smooth female voice (Google US English, Samantha, Microsoft Zira)
  const femaleVoice = voices.find(
    (v) =>
      v.name.includes('Google US English') ||
      v.name.includes('Samantha') ||
      v.name.includes('Zira') ||
      (v.name.includes('Female') && v.lang.includes('en'))
  );

  if (femaleVoice) {
    utterance.voice = femaleVoice;
  }

  // "Laid back" settings
  utterance.pitch = 0.9; // Slightly lower
  utterance.rate = 0.95; // Slightly slower/smoother
  utterance.volume = 1;

  window.speechSynthesis.speak(utterance);
};

