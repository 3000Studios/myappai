import { openai } from './openai';

export const agents = {
  router: openai('gpt-4o'),
  coder: openai('gpt-4-turbo'),
  researcher: openai('gpt-4o'),
  writer: openai('gpt-4o-mini'),
  system: openai('gpt-4o'),
};

