import { aiProposalSchema, type AiProposal } from './proposal.schema.js';

export const MAX_PROPOSALS = 6;

function extractJsonCandidate(text: string): string | null {
  const tagged =
    text.match(/```proposals\s*([\s\S]*?)```/i) ?? text.match(/```json\s*([\s\S]*?)```/i);
  if (tagged) {
    return tagged[1].trim();
  }

  const start = text.indexOf('[');
  if (start === -1) {
    return null;
  }

  const end = text.lastIndexOf(']');
  return end > start ? text.slice(start, end + 1) : text.slice(start);
}

/** Parse du JSON ; si le tableau a été coupé (réponse tronquée), récupère les objets complets. */
function parseJsonLenient(candidate: string): unknown {
  try {
    return JSON.parse(candidate);
  } catch {
    // tronqué : on retente en refermant le tableau après chacune des dernières accolades
  }

  let end = candidate.lastIndexOf('}');
  for (let attempt = 0; attempt < 12 && end > 0; attempt += 1) {
    try {
      return JSON.parse(`${candidate.slice(0, end + 1)}]`);
    } catch {
      end = candidate.lastIndexOf('}', end - 1);
    }
  }

  return undefined;
}

/** Extrait et valide les propositions d'un texte d'IA ; ignore silencieusement les entrées invalides. */
export function parseProposals(text: string): AiProposal[] {
  const candidate = extractJsonCandidate(text);
  if (!candidate) {
    return [];
  }

  const raw = parseJsonLenient(candidate);
  if (raw === undefined) {
    return [];
  }

  const items = Array.isArray(raw) ? raw : [raw];
  const valid: AiProposal[] = [];

  for (const item of items) {
    const result = aiProposalSchema.safeParse(item);
    if (result.success) {
      valid.push(result.data);
    }
    if (valid.length >= MAX_PROPOSALS) {
      break;
    }
  }

  return valid;
}

/** Retire de la réponse le bloc de propositions (```proposals ... ```) pour ne garder que le texte lisible. */
export function stripProposalsBlock(text: string): string {
  return text
    .replace(/```(?:json|proposals)?\s*\[[\s\S]*?\]\s*```/gi, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

export function normalizeTitle(value: string): string {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}
