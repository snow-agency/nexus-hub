import { useCallback, useEffect, useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { Card } from '../ui/Card';
import { api, getApiErrorMessage } from '../../services/api.js';
import { BMC_LABELS } from './bmcLabels.js';

export function BmcGrid({ projectId }) {
  const [blocks, setBlocks] = useState([]);
  const [filled, setFilled] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [editing, setEditing] = useState(null);
  const [draft, setDraft] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const load = useCallback(async () => {
    if (!projectId) return;
    try {
      const response = await api.get(`/bmc/project/${projectId}`);
      setBlocks(response.data.blocks);
      setFilled(response.data.filled);
      setError('');
    } catch (loadError) {
      setError(getApiErrorMessage(loadError));
    } finally {
      setIsLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    setIsLoading(true);
    load();
  }, [load]);

  function openEditor(block) {
    setEditing(block.block);
    setDraft(block.content);
  }

  async function handleSave(event) {
    event.preventDefault();
    setIsSaving(true);
    try {
      await api.put(`/bmc/project/${projectId}/${editing}`, { content: draft });
      setEditing(null);
      await load();
    } catch (saveError) {
      setError(getApiErrorMessage(saveError));
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <Card className="space-y-5 rounded-3xl border border-gray-200/60 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-extrabold text-gray-900">Business Model Canvas</h3>
        <span className="text-xs font-medium text-gray-400">{filled}/9 blocs complétés</span>
      </div>

      {error && (
        <p aria-live="polite" className="text-xs font-medium text-red-700">
          {error}
        </p>
      )}

      {isLoading ? (
        <p className="text-xs text-gray-400">Chargement...</p>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {blocks.map((block) => (
            <button
              key={block.block}
              className={`space-y-1 rounded-2xl p-4 text-left transition-colors ${
                block.content
                  ? 'bg-bg-light hover:bg-primary/10'
                  : 'border border-dashed border-gray-300 hover:border-primary/40'
              }`}
              onClick={() => openEditor(block)}
              type="button"
            >
              <p className="text-[11px] font-bold text-gray-900">{BMC_LABELS[block.block]}</p>
              <p
                className={`whitespace-pre-line text-xs ${block.content ? 'text-gray-500' : 'text-gray-400'}`}
              >
                {block.content || 'À compléter'}
              </p>
            </button>
          ))}
        </div>
      )}

      <Dialog.Root open={editing !== null} onOpenChange={(open) => !open && setEditing(null)}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-40 bg-dark/40 backdrop-blur-[1px]" />
          <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-gray-200 bg-white p-6 shadow-xl focus:outline-none">
            <div className="flex items-start justify-between gap-4">
              <div>
                <Dialog.Title className="text-lg font-extrabold text-gray-900">
                  {editing ? BMC_LABELS[editing] : ''}
                </Dialog.Title>
                <Dialog.Description className="mt-1 text-sm text-gray-600">
                  Décris ce bloc en quelques lignes. Laisse vide pour l'effacer.
                </Dialog.Description>
              </div>
              <Dialog.Close asChild>
                <button
                  aria-label="Fermer"
                  className="rounded-full p-2 text-gray-500 hover:bg-gray-100"
                  type="button"
                >
                  <X aria-hidden="true" size={18} />
                </button>
              </Dialog.Close>
            </div>
            <form className="mt-5 space-y-4" onSubmit={handleSave}>
              <textarea
                autoFocus
                className="min-h-[140px] w-full rounded-lg border border-gray-300 bg-white p-3 text-sm text-gray-900 outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
                maxLength={1000}
                onChange={(event) => setDraft(event.target.value)}
                value={draft}
              />
              <div className="flex justify-end gap-2">
                <Dialog.Close asChild>
                  <button
                    className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                    type="button"
                  >
                    Annuler
                  </button>
                </Dialog.Close>
                <button
                  className="rounded-lg bg-accent px-4 py-2.5 text-sm font-bold text-dark hover:bg-accent-hover disabled:opacity-60"
                  disabled={isSaving}
                  type="submit"
                >
                  {isSaving ? 'Enregistrement...' : 'Enregistrer'}
                </button>
              </div>
            </form>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </Card>
  );
}
