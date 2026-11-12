import { useCallback, useEffect, useRef, useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { Send, Sparkles, Trash2, X } from 'lucide-react';
import { api, getApiErrorMessage } from '../../services/api.js';
import { useProject } from '../../context/ProjectContext.jsx';
import { useProposals } from '../../hooks/useProposals.js';
import { ProposalCard } from '../proposals/ProposalCard.jsx';

const SUGGESTIONS = [
  'Que dois-je faire cette semaine ?',
  'Analyse mon budget',
  'Propose-moi un plan de lancement',
  'Quelles sont mes priorités ?',
];

export function ChatPanel({ open, onOpenChange }) {
  const { currentProject, currentProjectId } = useProject();
  const [messages, setMessages] = useState([]);
  const [draft, setDraft] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const bottomRef = useRef(null);

  const proposals = useProposals(currentProjectId, { enabled: open });

  const loadHistory = useCallback(async () => {
    if (!currentProjectId) return;
    setIsLoading(true);
    try {
      const response = await api.get(`/chat/project/${currentProjectId}`);
      setMessages(response.data.messages);
    } catch (loadError) {
      setError(getApiErrorMessage(loadError));
    } finally {
      setIsLoading(false);
    }
  }, [currentProjectId]);

  useEffect(() => {
    if (open) loadHistory();
  }, [open, loadHistory]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [messages, isSending, proposals.proposals.length]);

  async function send(text) {
    const content = text.trim();
    if (!content || isSending || !currentProjectId) return;

    setError('');
    setDraft('');
    setIsSending(true);
    setMessages((previous) => [
      ...previous,
      { id: `pending-${Date.now()}`, role: 'USER', content },
    ]);

    try {
      const response = await api.post(`/chat/project/${currentProjectId}`, { message: content });
      setMessages((previous) => [
        ...previous.filter((message) => !String(message.id).startsWith('pending-')),
        response.data.userMessage,
        response.data.assistantMessage,
      ]);
      await proposals.reload();
    } catch (sendError) {
      setMessages((previous) =>
        previous.filter((message) => !String(message.id).startsWith('pending-')),
      );
      setDraft(content);
      setError(getApiErrorMessage(sendError));
    } finally {
      setIsSending(false);
    }
  }

  async function clearHistory() {
    if (!currentProjectId) return;
    try {
      await api.delete(`/chat/project/${currentProjectId}`);
      setMessages([]);
    } catch (clearError) {
      setError(getApiErrorMessage(clearError));
    }
  }

  function handleKeyDown(event) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      send(draft);
    }
  }

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-40 bg-dark/40 backdrop-blur-[1px]" />
        <Dialog.Content
          aria-describedby={undefined}
          className="fixed right-0 top-0 z-50 flex h-dvh w-full max-w-md flex-col border-l border-gray-200 bg-bg-light shadow-2xl focus:outline-none"
        >
          <div className="flex items-center justify-between gap-3 border-b border-gray-200/70 bg-white px-5 py-4">
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-accent text-dark">
                <Sparkles size={17} />
              </span>
              <div>
                <Dialog.Title className="text-sm font-extrabold text-gray-900">
                  Ton copilote
                </Dialog.Title>
                <p className="text-[11px] text-gray-500">
                  {currentProject ? `Projet · ${currentProject.name}` : 'Nexus Hub'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              {messages.length > 0 && (
                <button
                  aria-label="Effacer la conversation"
                  className="rounded-full p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700"
                  onClick={clearHistory}
                  type="button"
                >
                  <Trash2 size={16} />
                </button>
              )}
              <Dialog.Close asChild>
                <button
                  aria-label="Fermer"
                  className="rounded-full p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900"
                  type="button"
                >
                  <X size={18} />
                </button>
              </Dialog.Close>
            </div>
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto px-5 py-4">
            {isLoading && messages.length === 0 && (
              <p className="text-xs text-gray-400">Chargement...</p>
            )}

            {!isLoading && messages.length === 0 && (
              <div className="space-y-3">
                <p className="text-sm leading-relaxed text-gray-700">
                  Salut ! Je connais ton projet : budget, tâches, stratégie, équipe. Demande-moi un
                  conseil, une analyse ou un plan — je peux aussi te proposer des actions à
                  appliquer en un clic.
                </p>
                <div className="flex flex-wrap gap-2">
                  {SUGGESTIONS.map((suggestion) => (
                    <button
                      className="rounded-full border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 transition-colors hover:border-primary/40 hover:text-primary"
                      key={suggestion}
                      onClick={() => send(suggestion)}
                      type="button"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((message) => (
              <div
                className={`flex ${message.role === 'USER' ? 'justify-end' : 'justify-start'}`}
                key={message.id}
              >
                <p
                  className={`max-w-[88%] whitespace-pre-wrap rounded-2xl px-4 py-2.5 text-[13px] leading-relaxed ${
                    message.role === 'USER'
                      ? 'rounded-br-md bg-dark text-white'
                      : 'rounded-bl-md border border-gray-200/70 bg-white text-gray-800'
                  }`}
                >
                  {message.content}
                </p>
              </div>
            ))}

            {isSending && (
              <div className="flex justify-start">
                <p className="rounded-2xl rounded-bl-md border border-gray-200/70 bg-white px-4 py-2.5 text-[13px] text-gray-400">
                  Le copilote réfléchit...
                </p>
              </div>
            )}

            {proposals.proposals.length > 0 && (
              <div className="space-y-2 pt-2">
                <div className="flex items-center justify-between">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
                    Propositions à appliquer
                  </p>
                  {proposals.proposals.length > 1 && (
                    <button
                      className="text-[11px] font-bold text-primary hover:underline disabled:opacity-60"
                      disabled={proposals.busy}
                      onClick={proposals.acceptAll}
                      type="button"
                    >
                      Tout appliquer
                    </button>
                  )}
                </div>
                {proposals.proposals.map((proposal) => (
                  <ProposalCard
                    busy={proposals.busy}
                    key={proposal.id}
                    onAccept={proposals.accept}
                    onReject={proposals.reject}
                    proposal={proposal}
                  />
                ))}
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          {(error || proposals.error) && (
            <p aria-live="polite" className="px-5 pb-2 text-xs font-medium text-red-700">
              {error || proposals.error}
            </p>
          )}

          <form
            className="flex items-end gap-2 border-t border-gray-200/70 bg-white px-4 py-3"
            onSubmit={(event) => {
              event.preventDefault();
              send(draft);
            }}
          >
            <textarea
              aria-label="Ton message"
              className="max-h-32 min-h-[44px] flex-1 resize-none rounded-xl border border-gray-200 bg-bg-light px-3 py-2.5 text-sm text-gray-900 outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
              disabled={isSending}
              maxLength={2000}
              onChange={(event) => setDraft(event.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Pose ta question..."
              rows={1}
              value={draft}
            />
            <button
              aria-label="Envoyer"
              className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-accent text-dark transition-colors hover:bg-accent-hover disabled:opacity-50"
              disabled={isSending || !draft.trim()}
              type="submit"
            >
              <Send size={17} />
            </button>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
