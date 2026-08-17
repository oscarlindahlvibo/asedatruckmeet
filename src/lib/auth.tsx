import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import type { Session, User } from '@supabase/supabase-js';
import { supabase, supabaseAuth } from '@/lib/supabase';

interface AuthContextValue {
  session: Session | null;
  user: User | null;
  loading: boolean;
  isAdmin: boolean;
  adminLoading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signUpFirstAdmin: (email: string, password: string) => Promise<{ error: string | null; confirmationRequired: boolean }>;
  claimFirstAdmin: () => Promise<{ claimed: boolean; error: string | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function explainAuthError(message: string) {
  if (/invalid schema.*truckmeet/i.test(message)) {
    return 'Supabase API exponerar inte schemat truckmeet ännu. Lägg till truckmeet i PGRST_DB_SCHEMAS och starta om Supabase.';
  }
  return message;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminLoading, setAdminLoading] = useState(true);

  const refreshAdminRole = async (nextSession: Session | null) => {
    if (!nextSession) {
      setIsAdmin(false);
      setAdminLoading(false);
      return;
    }

    setAdminLoading(true);
    const { data, error } = await supabase
      .from('admin_users')
      .select('role')
      .eq('user_id', nextSession.user.id)
      .maybeSingle();
    setIsAdmin(!error && Boolean(data?.role));
    setAdminLoading(false);
  };

  useEffect(() => {
    supabaseAuth.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
      void refreshAdminRole(data.session);
    });

    const { data: listener } = supabaseAuth.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
      setLoading(false);
      void refreshAdminRole(newSession);
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabaseAuth.auth.signInWithPassword({ email, password });
    return { error: error ? explainAuthError(error.message) : null };
  };

  const claimFirstAdmin = async (sessionToRefresh = session) => {
    const { data, error } = await supabase.rpc('claim_first_admin');
    if (!error) {
      const currentSession = sessionToRefresh ?? (await supabaseAuth.auth.getSession()).data.session;
      await refreshAdminRole(currentSession);
    }
    return { claimed: data === true, error: error ? explainAuthError(error.message) : null };
  };

  const signUpFirstAdmin = async (email: string, password: string) => {
    const { data, error } = await supabaseAuth.auth.signUp({ email, password });
    if (error) return { error: explainAuthError(error.message), confirmationRequired: false };
    if (!data.session) return { error: null, confirmationRequired: true };

    setSession(data.session);
    const result = await claimFirstAdmin(data.session);
    return { error: result.error ?? (result.claimed ? null : 'Första admin är redan skapad.'), confirmationRequired: false };
  };

  const signOut = async () => {
    await supabaseAuth.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ session, user: session?.user ?? null, loading, isAdmin, adminLoading, signIn, signUpFirstAdmin, claimFirstAdmin, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
