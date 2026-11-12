import { createContext, useContext, useMemo, useState } from 'react';
import { MessageCircle } from 'lucide-react';
import { ChatPanel } from '../components/chat/ChatPanel.jsx';
import { useProject } from './ProjectContext.jsx';

const ChatContext = createContext(null);

export function ChatProvider({ children }) {
  const { hasProjects } = useProject();
  const [open, setOpen] = useState(false);

  const value = useMemo(() => ({ openChat: () => setOpen(true) }), []);

  return (
    <ChatContext.Provider value={value}>
      {children}
      {hasProjects && (
        <>
          <ChatPanel onOpenChange={setOpen} open={open} />
          <button
            aria-label="Discuter avec le copilote"
            className="fixed bottom-5 right-5 z-30 flex h-12 w-12 items-center justify-center rounded-full bg-accent text-dark shadow-lg transition-colors hover:bg-accent-hover lg:hidden"
            onClick={() => setOpen(true)}
            type="button"
          >
            <MessageCircle size={22} />
          </button>
        </>
      )}
    </ChatContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useChat() {
  const context = useContext(ChatContext);

  if (!context) {
    throw new Error('useChat doit être utilisé à l’intérieur de ChatProvider.');
  }

  return context;
}
