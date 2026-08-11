import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Lock, Loader2 } from 'lucide-react';

const WcmLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
    if (signInError) {
      setError('Credenziali non valide.');
    }
    setSubmitting(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-slate-950">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm rounded-xl border border-slate-800 bg-slate-900/70 p-6 sm:p-8 shadow-xl"
      >
        <div className="flex items-center gap-2 text-slate-100">
          <Lock className="h-4 w-4 text-slate-400" />
          <h1 className="text-sm font-semibold tracking-[0.2em] uppercase">WCM Mission Control</h1>
        </div>
        <p className="mt-2 text-xs text-slate-400">Area riservata. Accesso su invito.</p>

        <div className="mt-6 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="wcm-email" className="text-slate-300">Email</Label>
            <Input
              id="wcm-email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-slate-950 border-slate-800 text-slate-100"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="wcm-password" className="text-slate-300">Password</Label>
            <Input
              id="wcm-password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-slate-950 border-slate-800 text-slate-100"
            />
          </div>
        </div>

        {error && <p className="mt-4 text-sm text-red-400">{error}</p>}

        <Button type="submit" disabled={submitting} className="mt-6 w-full">
          {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Accedi
        </Button>
      </form>
    </div>
  );
};

export default WcmLogin;
