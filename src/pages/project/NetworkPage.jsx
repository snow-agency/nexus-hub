import { useCallback, useEffect, useMemo, useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { AppSidebar } from '../../components/layout/AppSidebar.jsx';
import { AppHeader } from '../../components/layout/AppHeader.jsx';
import { Card } from '../../components/ui/Card';
import { useProject } from '../../context/ProjectContext.jsx';
import { api, getApiErrorMessage } from '../../services/api.js';
import {
  CalendarDays,
  ExternalLink,
  Mail,
  Pencil,
  Phone,
  Plus,
  Search,
  Sparkles,
  Trash2,
  X,
} from 'lucide-react';

const CONTACT_TYPES = {
  MENTOR: 'Mentor',
  PARTENAIRE: 'Partenaire',
  INVESTISSEUR: 'Investisseur',
  CLIENT: 'Client',
  FOURNISSEUR: 'Fournisseur',
  AUTRE: 'Autre',
};

const OPPORTUNITY_KINDS = {
  FINANCEMENT: 'Financement',
  INCUBATION: 'Incubation',
  FORMATION: 'Formation',
  EVENEMENT: 'Événement',
  AUTRE: 'Autre',
};

const OPPORTUNITY_STATUSES = {
  A_EXPLORER: 'À explorer',
  EN_COURS: 'En cours',
  OBTENUE: 'Obtenue',
  ECARTEE: 'Écartée',
};

const STATUS_STYLES = {
  A_EXPLORER: 'bg-gray-100 text-gray-600',
  EN_COURS: 'bg-warning/20 text-warning-hover',
  OBTENUE: 'bg-success/10 text-success-hover',
  ECARTEE: 'bg-gray-100 text-gray-400',
};

const DAY_MS = 24 * 60 * 60 * 1000;

const inputClass =
  'h-11 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-900 outline-none focus:border-primary focus:ring-2 focus:ring-primary/10';

function initialsOf(name) {
  return (name ?? '?')
    .split(' ')
    .filter(Boolean)
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

function isDeadlineSoon(deadline) {
  if (!deadline) return false;
  const diff = new Date(deadline).getTime() - Date.now();
  return diff >= 0 && diff <= 14 * DAY_MS;
}

function isExpired(deadline) {
  return Boolean(deadline) && new Date(deadline).getTime() < Date.now();
}

function toDateInput(value) {
  return value ? new Date(value).toISOString().slice(0, 10) : '';
}

const EMPTY_CONTACT = {
  name: '',
  organization: '',
  type: 'MENTOR',
  email: '',
  phone: '',
  notes: '',
};
const EMPTY_OPPORTUNITY = {
  title: '',
  description: '',
  kind: 'FINANCEMENT',
  status: 'A_EXPLORER',
  deadline: '',
  url: '',
};

function Field({ label, children }) {
  return (
    <label className="block space-y-1.5">
      <span className="text-sm font-semibold text-gray-800">{label}</span>
      {children}
    </label>
  );
}

function FormDialog({ open, onOpenChange, title, description, onSubmit, error, children }) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-40 bg-dark/40 backdrop-blur-[1px]" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-2xl border border-gray-200 bg-white p-6 shadow-xl focus:outline-none sm:p-7">
          <div className="flex items-start justify-between gap-4">
            <div>
              <Dialog.Title className="text-lg font-extrabold text-gray-900">{title}</Dialog.Title>
              <Dialog.Description className="mt-1 text-sm text-gray-600">
                {description}
              </Dialog.Description>
            </div>
            <Dialog.Close asChild>
              <button
                aria-label="Fermer"
                className="rounded-full p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900"
                type="button"
              >
                <X aria-hidden="true" size={18} />
              </button>
            </Dialog.Close>
          </div>

          <form className="mt-6 space-y-4" onSubmit={onSubmit}>
            {children}
            {error && (
              <p aria-live="polite" className="text-xs font-medium text-red-700">
                {error}
              </p>
            )}
            <div className="flex justify-end gap-2 border-t border-gray-100 pt-4">
              <Dialog.Close asChild>
                <button
                  className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                  type="button"
                >
                  Annuler
                </button>
              </Dialog.Close>
              <button
                className="rounded-lg bg-warning px-4 py-2.5 text-sm font-bold text-gray-900 hover:bg-warning-hover"
                type="submit"
              >
                Enregistrer
              </button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export default function NetworkPage() {
  const { currentProjectId } = useProject();

  const [contacts, setContacts] = useState([]);
  const [opportunities, setOpportunities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const [contactDialog, setContactDialog] = useState({ open: false, id: null });
  const [contactForm, setContactForm] = useState(EMPTY_CONTACT);
  const [contactError, setContactError] = useState('');

  const [oppDialog, setOppDialog] = useState({ open: false, id: null });
  const [oppForm, setOppForm] = useState(EMPTY_OPPORTUNITY);
  const [oppError, setOppError] = useState('');

  const loadNetwork = useCallback(async () => {
    if (!currentProjectId) return;
    try {
      const response = await api.get(`/network/project/${currentProjectId}`);
      setContacts(response.data.contacts);
      setOpportunities(response.data.opportunities);
      setError('');
    } catch (loadError) {
      setError(getApiErrorMessage(loadError));
    } finally {
      setIsLoading(false);
    }
  }, [currentProjectId]);

  useEffect(() => {
    setIsLoading(true);
    loadNetwork();
  }, [loadNetwork]);

  function openContactDialog(contact) {
    setContactError('');
    setContactForm(
      contact
        ? {
            name: contact.name,
            organization: contact.organization ?? '',
            type: contact.type,
            email: contact.email ?? '',
            phone: contact.phone ?? '',
            notes: contact.notes ?? '',
          }
        : EMPTY_CONTACT,
    );
    setContactDialog({ open: true, id: contact?.id ?? null });
  }

  function openOppDialog(opportunity) {
    setOppError('');
    setOppForm(
      opportunity
        ? {
            title: opportunity.title,
            description: opportunity.description ?? '',
            kind: opportunity.kind,
            status: opportunity.status,
            deadline: toDateInput(opportunity.deadline),
            url: opportunity.url ?? '',
          }
        : EMPTY_OPPORTUNITY,
    );
    setOppDialog({ open: true, id: opportunity?.id ?? null });
  }

  async function submitContact(event) {
    event.preventDefault();
    setContactError('');
    const payload = {
      name: contactForm.name,
      organization: contactForm.organization || null,
      type: contactForm.type,
      email: contactForm.email || null,
      phone: contactForm.phone || null,
      notes: contactForm.notes || null,
    };
    try {
      if (contactDialog.id) {
        await api.patch(`/network/contacts/${contactDialog.id}`, payload);
      } else {
        await api.post('/network/contacts', { projectId: currentProjectId, ...payload });
      }
      setContactDialog({ open: false, id: null });
      await loadNetwork();
    } catch (submitError) {
      setContactError(getApiErrorMessage(submitError));
    }
  }

  async function submitOpportunity(event) {
    event.preventDefault();
    setOppError('');
    const payload = {
      title: oppForm.title,
      description: oppForm.description || null,
      kind: oppForm.kind,
      status: oppForm.status,
      deadline: oppForm.deadline ? new Date(oppForm.deadline).toISOString() : null,
      url: oppForm.url || null,
    };
    try {
      if (oppDialog.id) {
        await api.patch(`/network/opportunities/${oppDialog.id}`, payload);
      } else {
        await api.post('/network/opportunities', { projectId: currentProjectId, ...payload });
      }
      setOppDialog({ open: false, id: null });
      await loadNetwork();
    } catch (submitError) {
      setOppError(getApiErrorMessage(submitError));
    }
  }

  async function removeItem(path, label) {
    if (!window.confirm(`Supprimer « ${label} » ?`)) return;
    try {
      await api.delete(path);
      await loadNetwork();
    } catch (removeError) {
      setError(getApiErrorMessage(removeError));
    }
  }

  async function changeOppStatus(opportunity, status) {
    try {
      await api.patch(`/network/opportunities/${opportunity.id}`, { status });
      await loadNetwork();
    } catch (statusError) {
      setError(getApiErrorMessage(statusError));
    }
  }

  const query = search.trim().toLowerCase();

  const visibleContacts = useMemo(
    () =>
      contacts.filter(
        (contact) =>
          (!typeFilter || contact.type === typeFilter) &&
          (!query ||
            [contact.name, contact.organization, contact.email, contact.notes]
              .filter(Boolean)
              .some((value) => value.toLowerCase().includes(query))),
      ),
    [contacts, typeFilter, query],
  );

  const visibleOpportunities = useMemo(
    () =>
      opportunities.filter(
        (opportunity) =>
          (!statusFilter || opportunity.status === statusFilter) &&
          (!query ||
            [opportunity.title, opportunity.description]
              .filter(Boolean)
              .some((value) => value.toLowerCase().includes(query))),
      ),
    [opportunities, statusFilter, query],
  );

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-bg-light">
        <p className="text-sm text-gray-500">Chargement...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-light flex text-gray-900 font-sans p-4 md:p-6">
      <div className="max-w-[1440px] mx-auto w-full flex gap-6">
        <AppSidebar activePage="network" />

        <main className="flex-1 min-w-0 space-y-6">
          <AppHeader />

          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
            <div className="space-y-1 max-w-2xl">
              <p className="text-[11px] font-bold tracking-wider text-gray-400 uppercase">RÉSEAU</p>
              <h1 className="text-3xl md:text-4xl font-black text-gray-900 leading-tight">
                Les bonnes connexions accélèrent les bons projets.
              </h1>
              <p className="text-xs md:text-sm text-gray-600 leading-relaxed pt-1">
                Garde tes mentors, partenaires et opportunités de financement au même endroit.
              </p>
            </div>
            <div className="flex flex-wrap gap-2 self-start">
              <button
                className="flex items-center gap-2 rounded-full bg-warning px-5 py-2.5 font-bold text-black shadow-sm transition-colors hover:bg-warning-hover"
                onClick={() => openContactDialog(null)}
                type="button"
              >
                <Plus size={18} strokeWidth={2.5} /> Contact
              </button>
              <button
                className="flex items-center gap-2 rounded-full bg-dark px-5 py-2.5 font-bold text-white shadow-sm transition-colors hover:bg-dark-soft"
                onClick={() => openOppDialog(null)}
                type="button"
              >
                <Plus size={18} strokeWidth={2.5} /> Opportunité
              </button>
            </div>
          </div>

          {error && (
            <p aria-live="polite" className="text-xs font-medium text-red-700">
              {error}
            </p>
          )}

          <div className="relative max-w-md">
            <Search
              aria-hidden="true"
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={16}
            />
            <input
              aria-label="Rechercher dans le réseau"
              className="h-11 w-full rounded-full border border-gray-200/80 bg-white pl-10 pr-4 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Rechercher un contact ou une opportunité"
              type="search"
              value={search}
            />
          </div>

          <section className="space-y-4" aria-labelledby="contacts-title">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 id="contacts-title" className="text-sm font-extrabold text-gray-900">
                Contacts ({visibleContacts.length})
              </h2>
              <select
                aria-label="Filtrer les contacts par type"
                className="rounded-full border border-gray-200/80 bg-white px-3 py-1.5 text-xs font-semibold text-gray-700"
                onChange={(event) => setTypeFilter(event.target.value)}
                value={typeFilter}
              >
                <option value="">Tous les types</option>
                {Object.entries(CONTACT_TYPES).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>

            {visibleContacts.length === 0 ? (
              <Card className="rounded-3xl border border-dashed border-gray-300 p-6 text-xs text-gray-500">
                {contacts.length === 0
                  ? 'Aucun contact pour l’instant. Ajoute ton premier mentor, partenaire ou client avec le bouton « Contact ».'
                  : 'Aucun contact ne correspond à ta recherche.'}
              </Card>
            ) : (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                {visibleContacts.map((contact) => (
                  <Card
                    key={contact.id}
                    className="space-y-3 rounded-3xl border border-gray-200/60 bg-white p-5 shadow-sm"
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-dark text-xs font-bold text-white">
                        {initialsOf(contact.name)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-bold text-gray-900">{contact.name}</p>
                        {contact.organization && (
                          <p className="truncate text-xs text-gray-500">{contact.organization}</p>
                        )}
                      </div>
                      <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-[10px] font-bold text-primary">
                        {CONTACT_TYPES[contact.type] ?? contact.type}
                      </span>
                    </div>

                    <div className="space-y-1 text-xs text-gray-600">
                      {contact.email && (
                        <p className="flex items-center gap-2 break-all">
                          <Mail aria-hidden="true" size={13} className="flex-shrink-0" />
                          {contact.email}
                        </p>
                      )}
                      {contact.phone && (
                        <p className="flex items-center gap-2">
                          <Phone aria-hidden="true" size={13} className="flex-shrink-0" />
                          {contact.phone}
                        </p>
                      )}
                      {contact.notes && <p className="text-gray-500">{contact.notes}</p>}
                    </div>

                    <div className="flex justify-end gap-1 border-t border-gray-100 pt-2">
                      <button
                        aria-label={`Modifier ${contact.name}`}
                        className="rounded-full p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900"
                        onClick={() => openContactDialog(contact)}
                        type="button"
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        aria-label={`Supprimer ${contact.name}`}
                        className="rounded-full p-2 text-gray-500 hover:bg-gray-100 hover:text-danger"
                        onClick={() => removeItem(`/network/contacts/${contact.id}`, contact.name)}
                        type="button"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </section>

          <section className="space-y-4" aria-labelledby="opportunities-title">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 id="opportunities-title" className="text-sm font-extrabold text-gray-900">
                Opportunités ({visibleOpportunities.length})
              </h2>
              <select
                aria-label="Filtrer les opportunités par statut"
                className="rounded-full border border-gray-200/80 bg-white px-3 py-1.5 text-xs font-semibold text-gray-700"
                onChange={(event) => setStatusFilter(event.target.value)}
                value={statusFilter}
              >
                <option value="">Tous les statuts</option>
                {Object.entries(OPPORTUNITY_STATUSES).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>

            {visibleOpportunities.length === 0 ? (
              <Card className="rounded-3xl border border-dashed border-gray-300 p-6 text-xs text-gray-500">
                {opportunities.length === 0
                  ? 'Aucune opportunité suivie. Ajoute un fonds, un programme d’incubation ou une formation avec le bouton « Opportunité ».'
                  : 'Aucune opportunité ne correspond à ta recherche.'}
              </Card>
            ) : (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {visibleOpportunities.map((opportunity) => {
                  const soon = isDeadlineSoon(opportunity.deadline);
                  const expired =
                    isExpired(opportunity.deadline) &&
                    ['A_EXPLORER', 'EN_COURS'].includes(opportunity.status);

                  return (
                    <Card
                      key={opportunity.id}
                      className="space-y-3 rounded-3xl border border-gray-200/60 bg-white p-5 shadow-sm"
                    >
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-full bg-bg-light px-2.5 py-0.5 text-[10px] font-bold text-gray-600">
                          {OPPORTUNITY_KINDS[opportunity.kind] ?? opportunity.kind}
                        </span>
                        {opportunity.aiSuggested && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-accent/20 px-2.5 py-0.5 text-[10px] font-bold text-accent-hover">
                            <Sparkles aria-hidden="true" size={11} />
                            Suggestion IA — à vérifier
                          </span>
                        )}
                      </div>

                      <div>
                        <p className="text-sm font-bold text-gray-900">{opportunity.title}</p>
                        {opportunity.description && (
                          <p className="mt-1 text-xs leading-relaxed text-gray-500">
                            {opportunity.description}
                          </p>
                        )}
                      </div>

                      {opportunity.deadline && (
                        <p
                          className={`flex items-center gap-1.5 text-[11px] font-semibold ${
                            soon ? 'text-warning-hover' : expired ? 'text-danger' : 'text-gray-400'
                          }`}
                        >
                          <CalendarDays aria-hidden="true" size={13} />
                          {expired ? 'Échéance dépassée · ' : soon ? 'Bientôt · ' : 'Avant le '}
                          {new Date(opportunity.deadline).toLocaleDateString('fr-FR')}
                        </p>
                      )}

                      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-gray-100 pt-3">
                        <select
                          aria-label={`Statut de ${opportunity.title}`}
                          className={`rounded-full border-0 px-3 py-1 text-[11px] font-bold ${STATUS_STYLES[opportunity.status]}`}
                          onChange={(event) => changeOppStatus(opportunity, event.target.value)}
                          value={opportunity.status}
                        >
                          {Object.entries(OPPORTUNITY_STATUSES).map(([value, label]) => (
                            <option key={value} value={value}>
                              {label}
                            </option>
                          ))}
                        </select>

                        <div className="flex items-center gap-1">
                          {opportunity.url && (
                            <a
                              aria-label={`Ouvrir le lien de ${opportunity.title}`}
                              className="rounded-full p-2 text-gray-500 hover:bg-gray-100 hover:text-primary"
                              href={opportunity.url}
                              rel="noopener noreferrer"
                              target="_blank"
                            >
                              <ExternalLink size={14} />
                            </a>
                          )}
                          <button
                            aria-label={`Modifier ${opportunity.title}`}
                            className="rounded-full p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900"
                            onClick={() => openOppDialog(opportunity)}
                            type="button"
                          >
                            <Pencil size={14} />
                          </button>
                          <button
                            aria-label={`Supprimer ${opportunity.title}`}
                            className="rounded-full p-2 text-gray-500 hover:bg-gray-100 hover:text-danger"
                            onClick={() =>
                              removeItem(
                                `/network/opportunities/${opportunity.id}`,
                                opportunity.title,
                              )
                            }
                            type="button"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            )}
          </section>
        </main>
      </div>

      <FormDialog
        description="Mentor, partenaire, client… garde les coordonnées utiles à portée de main."
        error={contactError}
        onOpenChange={(open) => setContactDialog((previous) => ({ ...previous, open }))}
        onSubmit={submitContact}
        open={contactDialog.open}
        title={contactDialog.id ? 'Modifier le contact' : 'Nouveau contact'}
      >
        <Field label="Nom">
          <input
            autoFocus
            className={inputClass}
            maxLength={120}
            onChange={(event) => setContactForm({ ...contactForm, name: event.target.value })}
            required
            value={contactForm.name}
          />
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Organisation">
            <input
              className={inputClass}
              maxLength={120}
              onChange={(event) =>
                setContactForm({ ...contactForm, organization: event.target.value })
              }
              value={contactForm.organization}
            />
          </Field>
          <Field label="Type">
            <select
              className={inputClass}
              onChange={(event) => setContactForm({ ...contactForm, type: event.target.value })}
              value={contactForm.type}
            >
              {Object.entries(CONTACT_TYPES).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </Field>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="E-mail">
            <input
              className={inputClass}
              onChange={(event) => setContactForm({ ...contactForm, email: event.target.value })}
              type="email"
              value={contactForm.email}
            />
          </Field>
          <Field label="Téléphone">
            <input
              className={inputClass}
              maxLength={40}
              onChange={(event) => setContactForm({ ...contactForm, phone: event.target.value })}
              type="tel"
              value={contactForm.phone}
            />
          </Field>
        </div>
        <Field label="Notes">
          <textarea
            className={`${inputClass} h-24 py-2`}
            maxLength={1000}
            onChange={(event) => setContactForm({ ...contactForm, notes: event.target.value })}
            value={contactForm.notes}
          />
        </Field>
      </FormDialog>

      <FormDialog
        description="Fonds, incubateur, formation… suis l’avancement de chaque piste."
        error={oppError}
        onOpenChange={(open) => setOppDialog((previous) => ({ ...previous, open }))}
        onSubmit={submitOpportunity}
        open={oppDialog.open}
        title={oppDialog.id ? 'Modifier l’opportunité' : 'Nouvelle opportunité'}
      >
        <Field label="Titre">
          <input
            autoFocus
            className={inputClass}
            maxLength={160}
            onChange={(event) => setOppForm({ ...oppForm, title: event.target.value })}
            required
            value={oppForm.title}
          />
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Type">
            <select
              className={inputClass}
              onChange={(event) => setOppForm({ ...oppForm, kind: event.target.value })}
              value={oppForm.kind}
            >
              {Object.entries(OPPORTUNITY_KINDS).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Statut">
            <select
              className={inputClass}
              onChange={(event) => setOppForm({ ...oppForm, status: event.target.value })}
              value={oppForm.status}
            >
              {Object.entries(OPPORTUNITY_STATUSES).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </Field>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Échéance">
            <input
              className={inputClass}
              onChange={(event) => setOppForm({ ...oppForm, deadline: event.target.value })}
              type="date"
              value={oppForm.deadline}
            />
          </Field>
          <Field label="Lien">
            <input
              className={inputClass}
              maxLength={500}
              onChange={(event) => setOppForm({ ...oppForm, url: event.target.value })}
              placeholder="https://..."
              type="url"
              value={oppForm.url}
            />
          </Field>
        </div>
        <Field label="Description">
          <textarea
            className={`${inputClass} h-24 py-2`}
            maxLength={1000}
            onChange={(event) => setOppForm({ ...oppForm, description: event.target.value })}
            value={oppForm.description}
          />
        </Field>
      </FormDialog>
    </div>
  );
}
