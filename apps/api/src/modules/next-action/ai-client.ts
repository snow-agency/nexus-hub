import Anthropic from '@anthropic-ai/sdk';
import { GoogleGenerativeAI } from '@google/generative-ai';

let anthropicClient: Anthropic | null = null;
let googleClient: GoogleGenerativeAI | null = null;

const RODIUM_DEFAULT_URL = 'https://api.rodiumai.io/v1';
const RODIUM_DEFAULT_MODEL = 'anthropic/claude-sonnet-5';
const REQUEST_TIMEOUT_MS = 45_000;

export interface ChatTurn {
  role: 'user' | 'assistant';
  content: string;
}

export interface ChatRequest {
  system?: string;
  messages: ChatTurn[];
  maxTokens?: number;
}

interface RodiumResponse {
  choices?: Array<{ message?: { content?: string }; finish_reason?: string }>;
}

const MAX_TOKENS_CEILING = 12_000;

/**
 * Le modèle peut consommer une partie du budget en raisonnement interne : si la réponse est coupée
 * (finish_reason "length"), on retente une fois avec un budget triplé.
 */
async function chatRodium(request: ChatRequest): Promise<string> {
  const budget = request.maxTokens ?? 2000;
  const first = await rodiumRequest(request, budget);

  if (first.truncated) {
    const second = await rodiumRequest(request, Math.min(budget * 3, MAX_TOKENS_CEILING));
    return second.text;
  }

  return first.text;
}

async function rodiumRequest(
  { system, messages }: ChatRequest,
  maxTokens: number,
): Promise<{ text: string; truncated: boolean }> {
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
      max_tokens: maxTokens,
      messages: system ? [{ role: 'system', content: system }, ...messages] : messages,
    }),
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
  });

  if (!response.ok) {
    throw new Error(`Rodium AI a répondu ${response.status} : ${await response.text()}`);
  }

  const data = (await response.json()) as RodiumResponse;
  const choice = data.choices?.[0];

  return {
    text: choice?.message?.content ?? '',
    truncated: choice?.finish_reason === 'length',
  };
}

async function chatAnthropic({ system, messages, maxTokens = 2000 }: ChatRequest): Promise<string> {
  if (!process.env.ANTHROPIC_API_KEY) {
    throw new Error('ANTHROPIC_API_KEY absente.');
  }
  if (!anthropicClient) {
    anthropicClient = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  }

  const response = await anthropicClient.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: maxTokens,
    ...(system ? { system } : {}),
    messages,
  });

  const textBlock = response.content.find((block) => block.type === 'text');
  return textBlock && 'text' in textBlock ? textBlock.text : '';
}

async function chatGoogle({ system, messages }: ChatRequest): Promise<string> {
  if (!process.env.GOOGLE_AI_API_KEY) {
    throw new Error('GOOGLE_AI_API_KEY absente.');
  }
  if (!googleClient) {
    googleClient = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY);
  }

  const model = googleClient.getGenerativeModel({
    model: 'gemini-3.8-flash',
    ...(system ? { systemInstruction: system } : {}),
  });
  const result = await model.generateContent({
    contents: messages.map((turn) => ({
      role: turn.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: turn.content }],
    })),
  });
  return result.response.text();
}

function nonEmpty(text: string): string {
  if (text.trim() === '') {
    throw new Error('Réponse vide.');
  }
  return text;
}

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function chatGoogleWithRetry(request: ChatRequest): Promise<string> {
  try {
    return await chatGoogle(request);
  } catch (err) {
    console.log(
      'Google AI Studio a échoué, nouvel essai dans 2 secondes.',
      err instanceof Error ? err.message : err,
    );
    await wait(2000);
    return chatGoogle(request);
  }
}

/**
 * Conversation multi-tours. Renvoie le texte de l'IA, ou null si aucune IA n'est disponible.
 * Ordre de priorité : Rodium AI > Anthropic (direct) > Google AI Studio.
 */
export async function chatComplete(request: ChatRequest): Promise<string | null> {
  try {
    return nonEmpty(await chatRodium(request));
  } catch (err) {
    console.log(
      'Rodium AI indisponible, bascule sur Anthropic.',
      err instanceof Error ? err.message : err,
    );
  }

  try {
    return nonEmpty(await chatAnthropic(request));
  } catch (err) {
    console.log(
      'Anthropic indisponible, bascule sur Google AI Studio.',
      err instanceof Error ? err.message : err,
    );
  }

  try {
    return nonEmpty(await chatGoogleWithRetry(request));
  } catch (err) {
    console.log('Google AI Studio indisponible aussi.', err instanceof Error ? err.message : err);
  }

  console.log('Aucune IA disponible.');
  return null;
}

/**
 * Question unique (utilisée par Next Action). Renvoie null si aucune IA n'est disponible :
 * le contrôleur décide alors quoi faire (garder le texte existant).
 */
export async function askClaude(prompt: string): Promise<string | null> {
  return chatComplete({ messages: [{ role: 'user', content: prompt }], maxTokens: 2000 });
}
