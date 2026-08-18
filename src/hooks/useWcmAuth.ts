import { useEffect, useState } from 'react';
import type { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

export type WcmRole = 'owner' | 'admin' | null;

export type WcmAuthState = {
  loading: boolean;
  session: Session | null;
  user: User | null;
  role: WcmRole;
  isAuthorized: boolean;
  roleChecked: boolean;
  signOut: () => Promise<void>;
};

/**
 * Auth state for the private WCM Mission Control area.
 * Authorization is enforced server-side by RLS; this hook only drives the UI.
 */
export const useWcmAuth = (): WcmAuthState => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState<WcmRole>(null);
  const [roleChecked, setRoleChecked] = useState(false);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      setLoading(false);
      setRoleChecked(false);
    });

    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!session?.user) {
      setRole(null);
      setRoleChecked(true);
      return;
    }

    let cancelled = false;

    const checkRole = async () => {
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', session.user.id)
        .in('role', ['owner', 'admin']);

      if (cancelled) return;
      const roles = (data ?? []).map((r) => r.role as string);
      setRole(!error && roles.includes('owner') ? 'owner' : roles.includes('admin') ? 'admin' : null);
      setRoleChecked(true);
    };

    void checkRole();

    return () => {
      cancelled = true;
    };
  }, [session]);

  return {
    loading,
    session,
    user: session?.user ?? null,
    role,
    isAuthorized: role === 'owner' || role === 'admin',
    roleChecked,
    signOut: async () => {
      await supabase.auth.signOut();
    },
  };
};
