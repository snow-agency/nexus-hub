import Anthropic from '@anthropic-ai/sdk';
import { GoogleGenerativeAI } from '@google/generative-ai';

let anthropicClient: Anthropic | null = null;
let googleClient: GoogleGenerativeAI | null = null;

async function askAnthropic(prompt: string): Promise<string> {
  if (!process.env.ANTHROPIC_API_KEY) {
    throw new Error('ANTHROPIC_API_KEY absente.');
  }
  if (!anthropicClient) {
    anthropicClient = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  }

  const response = await anthropicClient.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 300,
    messages: [{ role: 'user', content: prompt }],
  });

  const textBlock = response.content.find((block) => block.type === 'text');
  return textBlock && 'text' in textBlock ? textBlock.text : '';
}

async function askGoogle(prompt: string): Promise<string> {
  if (!process.env.GOOGLE_AI_API_KEY) {
    throw new Error('GOOGLE_AI_API_KEY absente.');
  }
  if (!googleClient) {
    googleClient = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY);
  }

  const model = googleClient.getGenerativeModel({ model: 'gemini-3.8-flash' });
  const result = await model.generateContent(prompt);
  return result.response.text();
}

export async function askClaude(prompt: string): Promise<string> {
  try {
    return await askAnthropic(prompt);
  } catch (err) {
    console.log(
      'Anthropic indisponible, bascule sur Google AI Studio.',
      err instanceof Error ? err.message : err,
    );
  }

  try {
    return await askGoogle(prompt);
  } catch (err) {
    console.log('Google AI Studio indisponible aussi.', err instanceof Error ? err.message : err);
  }

  console.log('Aucune IA disponible : réponse simulée utilisée (mode test).');
  return `Titre : Vérifier la situation détectée
Raison : Un signal a été détecté sur ce projet et nécessite ton attention.
Impact : Permet d'éviter que le problème ne s'aggrave.`;
}
