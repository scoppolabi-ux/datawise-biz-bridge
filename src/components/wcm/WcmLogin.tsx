import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Lock, Loader2 } from 'lucide-react';

/**
 * Invite-only sign in for the private Mission Control area.
 * No public signup: accounts are provisioned by the owner.
 */
const WcmLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setInfo(null);
    setSubmitting(true);
    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
    if (signInError) setError('Credenziali non valide.');
    setSubmitting(false);
  };

  const handleReset = async () => {
    setError(null);
    setInfo(null);
    if (!email) {
      setError('Inserisci prima la tua email.');
      return;
    }
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/wcm`,
    });
    setInfo(
      resetError
        ? 'Richiesta non riuscita. Riprova più tardi.'
        : 'Se l’indirizzo è abilitato, riceverai un link per impostare la password.',
    );
  };

  return (
    <div className="wcm-grid flex min-h-screen items-center justify-center px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm rounded-xl border border-wcm-line bg-wcm-surface/70 p-6 shadow-xl sm:p-8"
      >
        <div className="flex items-center gap-2 text-wcm-strong">
          <Lock className="h-4 w-4 text-wcm-accent" />
          <h1 className="text-sm font-semibold uppercase tracking-[0.2em]">WCM Mission Control</h1>
        </div>
        <p className="mt-2 text-xs text-wcm-dim">Area riservata. Accesso su invito.</p>

        <div className="mt-6 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="wcm-email" className="text-wcm-text">Email</Label>
            <Input
              id="wcm-email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border-wcm-line-strong bg-wcm-bg text-wcm-strong"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="wcm-password" className="text-wcm-text">Password</Label>
            <Input
              id="wcm-password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border-wcm-line-strong bg-wcm-bg text-wcm-strong"
            />
          </div>
        </div>

        {error && <p className="mt-4 text-sm text-wcm-alert-fg">{error}</p>}
        {info && <p className="mt-4 text-sm text-wcm-muted">{info}</p>}

        <Button type="submit" disabled={submitting} className="mt-6 w-full">
          {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Accedi
        </Button>

        <button
          type="button"
          onClick={handleReset}
          className="mt-4 w-full text-center text-xs text-wcm-dim underline-offset-4 hover:text-wcm-accent hover:underline"
        >
          Prima attivazione o password dimenticata
        </button>
      </form>
    </div>
  );
};

export default WcmLogin;
