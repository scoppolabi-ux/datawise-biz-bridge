import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { KeyRound, Loader2 } from 'lucide-react';

/** Shown after an invite/recovery link so the account owner chooses a password. */
const WcmSetPassword = ({ onDone }: { onDone: () => void }) => {
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (password.length < 10) {
      setError('La password deve avere almeno 10 caratteri.');
      return;
    }
    if (password !== confirm) {
      setError('Le due password non coincidono.');
      return;
    }
    setSubmitting(true);
    const { error: updateError } = await supabase.auth.updateUser({ password });
    setSubmitting(false);
    if (updateError) {
      setError('Impostazione password non riuscita. Richiedi un nuovo link.');
      return;
    }
    onDone();
  };

  return (
    <div className="wcm-grid flex min-h-screen items-center justify-center px-4">
      <form
        onSubmit={submit}
        className="w-full max-w-sm rounded-xl border border-wcm-line bg-wcm-surface/70 p-6 shadow-xl sm:p-8"
      >
        <div className="flex items-center gap-2 text-wcm-strong">
          <KeyRound className="h-4 w-4 text-wcm-accent" />
          <h1 className="text-sm font-semibold uppercase tracking-[0.2em]">Imposta password</h1>
        </div>
        <p className="mt-2 text-xs text-wcm-dim">
          Scegli la password del tuo account Mission Control.
        </p>

        <div className="mt-6 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="wcm-new-password" className="text-wcm-text">Nuova password</Label>
            <Input
              id="wcm-new-password"
              type="password"
              autoComplete="new-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border-wcm-line-strong bg-wcm-bg text-wcm-strong"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="wcm-confirm-password" className="text-wcm-text">Conferma password</Label>
            <Input
              id="wcm-confirm-password"
              type="password"
              autoComplete="new-password"
              required
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className="border-wcm-line-strong bg-wcm-bg text-wcm-strong"
            />
          </div>
        </div>

        {error && <p className="mt-4 text-sm text-wcm-alert-fg">{error}</p>}

        <Button type="submit" disabled={submitting} className="mt-6 w-full">
          {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Salva password
        </Button>
      </form>
    </div>
  );
};

export default WcmSetPassword;
