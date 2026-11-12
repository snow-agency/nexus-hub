import Anthropic from '@anthropic-ai/sdk';
import { GoogleGenerativeAI } from '@google/generative-ai';

let anthropicClient: Anthropic | null = null;
let googleClient: GoogleGenerativeAI | null = null;

const RODIUM_DEFAULT_URL = 'https://api.rodiumai.io/v1';
const RODIUM_DEFAULT_MODEL = 'anthropic/claude-sonnet-5';

interface RodiumResponse {
  choices?: Array<{ message?: { content?: string } }>;
}

async function askRodium(prompt: string): Promise<string> {
  const apiKey = process.env.RODIUM_API_KEY;

  if (!apiKey) {
    throw new Error('RODIUM_API_KEY absente.');
  }

  const baseUrl = process.env.RODIUM_API_URL || RODIUM_DEFAULT_URL;
  const model = process.env.RODIUM_MODEL || RODIUM_DEFAULT_MODEL;

  const response = await fetch(`${baseUrl}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      max_tokens: 300,
      messages: [{ role: 'user', content: prompt }],
    }),
  });

  if (!response.ok) {
    throw new Error(`Rodium AI a répondu ${response.status} : ${await response.text()}`);
  }

  const data = (await response.json()) as RodiumResponse;
  return data.choices?.[0]?.message?.content ?? '';
}

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

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function askGoogleWithRetry(prompt: string): Promise<string> {
  try {
    return await askGoogle(prompt);
  } catch (err) {
    console.log(
      'Google AI Studio a échoué, nouvel essai dans 2 secondes.',
      err instanceof Error ? err.message : err,
    );
    await wait(2000);
    return askGoogle(prompt);
  }
}

/**
 * Renvoie le texte de l'IA, ou null si aucune IA n'est disponible.
 * Le contrôleur décide alors quoi faire (garder le texte existant).
 * Ordre de priorité : Rodium AI > Anthropic (direct) > Google AI Studio.
 */
export async function askClaude(prompt: string): Promise<string | null> {
  try {
    return await askRodium(prompt);
  } catch (err) {
    console.log(
      'Rodium AI indisponible, bascule sur Anthropic.',
      err instanceof Error ? err.message : err,
    );
  }

  try {
    return await askAnthropic(prompt);
  } catch (err) {
    console.log(
      'Anthropic indisponible, bascule sur Google AI Studio.',
      err instanceof Error ? err.message : err,
    );
  }

  try {
    return await askGoogleWithRetry(prompt);
  } catch (err) {
    console.log('Google AI Studio indisponible aussi.', err instanceof Error ? err.message : err);
  }

  console.log('Aucune IA disponible : le texte existant est conservé.');
  return null;
}
