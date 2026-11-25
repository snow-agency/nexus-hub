import { useCallback, useEffect, useRef, useState } from 'react';
import { api, getApiErrorMessage } from '../services/api.js';

const autoTriggered = new Set();

export function useProposals(projectId, { auto = false, enabled = true, onApplied } = {}) {
  const [proposals, setProposals] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const onAppliedRef = useRef(onApplied);

  useEffect(() => {
    onAppliedRef.current = onApplied;
  }, [onApplied]);

  const reload = useCallback(async () => {
    if (!projectId) return;
    try {
      const response = await api.get(`/proposals/project/${projectId}`);
      setProposals(response.data.proposals);
    } catch (loadError) {
      setError(getApiErrorMessage(loadError));
    }
  }, [projectId]);

  useEffect(() => {
    if (!projectId || !enabled) return;

    let cancelled = false;

    async function init() {
      setIsLoading(true);
      try {
        const shouldAuto = auto && !autoTriggered.has(projectId);
        if (shouldAuto) autoTriggered.add(projectId);

        const response = shouldAuto
          ? await api.post(`/proposals/project/${projectId}/auto`)
          : await api.get(`/proposals/project/${projectId}`);

        if (!cancelled) setProposals(response.data.proposals);
      } catch (initError) {
        if (!cancelled) setError(getApiErrorMessage(initError));
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    init();

    return () => {
      cancelled = true;
    };
  }, [projectId, auto, enabled]);

  const decide = useCallback(
    async (id, action) => {
      setBusy(true);
      setError('');
      try {
        await api.post(`/proposals/${id}/${action}`);
        setProposals((previous) => previous.filter((proposal) => proposal.id !== id));
        if (action === 'accept') await onAppliedRef.current?.();
      } catch (decideError) {
        setError(getApiErrorMessage(decideError));
        await reload();
      } finally {
        setBusy(false);
      }
    },
    [reload],
  );

  const acceptAll = useCallback(async () => {
    if (!projectId) return;
    setBusy(true);
    setError('');
    try {
      await api.post(`/proposals/project/${projectId}/accept-all`);
      setProposals([]);
      await onAppliedRef.current?.();
    } catch (acceptError) {
      setError(getApiErrorMessage(acceptError));
    } finally {
      setBusy(false);
    }
  }, [projectId]);

  const generate = useCallback(async () => {
    if (!projectId) return;
    setBusy(true);
    setError('');
    try {
      const response = await api.post(`/proposals/project/${projectId}/generate`);
      setProposals(response.data.proposals);
    } catch (generateError) {
      setError(getApiErrorMessage(generateError));
    } finally {
      setBusy(false);
    }
  }, [projectId]);

  return {
    proposals,
    isLoading,
    busy,
    error,
    reload,
    generate,
    acceptAll,
    accept: (id) => decide(id, 'accept'),
    reject: (id) => decide(id, 'reject'),
  };
}
