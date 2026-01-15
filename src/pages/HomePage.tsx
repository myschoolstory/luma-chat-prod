import React, { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Toaster } from '@/components/ui/sonner';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useChatStore } from '@/lib/store';
import { AuthView } from '@/components/chat/AuthView';
import { ChatInterface } from '@/components/chat/ChatInterface';
import { Loader2 } from 'lucide-react';
export function HomePage() {
  const token = useChatStore((s) => s.token);
  const isInitialized = useChatStore((s) => s.isInitialized);
  const setInitialized = useChatStore((s) => s.setInitialized);
  const logout = useChatStore((s) => s.logout);
  useEffect(() => {
    // Validate session on mount if token exists
    const validateSession = async () => {
      if (token) {
        try {
          const res = await fetch('/api/auth/me', {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          if (!res.ok) logout();
        } catch {
          // Keep local if network fails, let retry handle it
        }
      }
      setInitialized();
    };
    validateSession();
  }, [token, setInitialized, logout]);
  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }
  return (
    <div className="relative min-h-screen bg-background font-sans selection:bg-indigo-100 selection:text-indigo-900 overflow-hidden">
      {/* Dynamic Background Mesh */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-200/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-200/10 blur-[120px] rounded-full" />
      </div>
      <ThemeToggle />
      <main className="relative z-10">
        <AnimatePresence mode="wait">
          {!token ? (
            <motion.div
              key="auth"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
            >
              <AuthView />
            </motion.div>
          ) : (
            <motion.div
              key="chat"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
            >
              <ChatInterface />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
      <Toaster richColors position="top-center" />
    </div>
  );
}