import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle, Lock, Mail, Loader2, ShieldCheck, Truck, AlertCircle } from 'lucide-react';
import { useAuth } from '@/lib/auth';

export default function AdminSetupPage() {
  const { signUpFirstAdmin } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [existingAccount, setExistingAccount] = useState(false);
  const openAdminSignup = import.meta.env.VITE_ALLOW_ADMIN_SIGNUP === 'true';

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setMessage(null);
    setError(null);
    setExistingAccount(false);
    const result = await signUpFirstAdmin(email, password);
    setLoading(false);
    if (result.error) {
      if (/already registered|already exists|user exists/i.test(result.error)) {
        window.localStorage.setItem('truckmeet:first-admin-email', email.trim().toLowerCase());
        setExistingAccount(true);
      }
      setError(result.error);
      return;
    }
    if (result.confirmationRequired) {
      window.localStorage.setItem('truckmeet:first-admin-email', email.trim().toLowerCase());
      setMessage('Kontot är skapat. Bekräfta e-postadressen och logga sedan in för att slutföra adminaktiveringen.');
      return;
    }
    navigate('/admin');
  };

  return (
    <div className="min-h-screen bg-ink-900 flex items-center justify-center px-4 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-amber-500/5 rounded-full blur-[120px]" />
      <div className="relative z-10 w-full max-w-md">
        <Link to="/admin/login" className="inline-flex items-center gap-2 text-sm text-white/50 hover:text-amber-400 transition-colors mb-8">
          <ArrowLeft className="w-4 h-4" /> Till admininloggning
        </Link>
        <div className="glass-card p-8 md:p-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-diesel-600 flex items-center justify-center"><Truck className="w-7 h-7 text-ink-900" /></div>
            <div><h1 className="font-heading font-bold text-xl text-white">Första admin</h1><p className="text-sm text-white/50">Åseda Truckmeet</p></div>
          </div>
          <div className="flex gap-2 items-start text-sm text-white/60 leading-relaxed mb-7"><ShieldCheck className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />{openAdminSignup ? 'Tillfälligt öppet läge: alla nya konton får adminåtkomst. Stäng av VITE_ALLOW_ADMIN_SIGNUP efter registreringen.' : 'Detta fungerar endast så länge ingen admin ännu är skapad. Därefter stängs funktionen automatiskt.'}</div>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div><label className="text-sm font-medium text-white/70 mb-2 block">E-post</label><div className="relative"><Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" /><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:border-amber-500/50 focus:outline-none" placeholder="admin@asedatruckmeet.se" /></div></div>
            <div><label className="text-sm font-medium text-white/70 mb-2 block">Lösenord</label><div className="relative"><Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" /><input type="password" value={password} onChange={(e) => setPassword(e.target.value)} minLength={8} required className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:border-amber-500/50 focus:outline-none" placeholder="Minst 8 tecken" /></div></div>
            {error && <div className="flex items-center gap-2 text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3"><AlertCircle className="w-4 h-4 shrink-0" />{error}</div>}
            {existingAccount && <Link to="/admin/login?setup=1" className="block text-center text-sm text-amber-400 hover:text-amber-300">Logga in med det befintliga kontot och aktivera första admin</Link>}
            {message && <div className="flex items-center gap-2 text-sm text-green-400 bg-green-500/10 border border-green-500/20 rounded-xl px-4 py-3"><CheckCircle className="w-4 h-4 shrink-0" />{message}</div>}
            <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-50">{loading ? <><Loader2 className="w-5 h-5 animate-spin" /> Skapar konto...</> : openAdminSignup ? 'Skapa admin' : 'Skapa första admin'}</button>
          </form>
        </div>
      </div>
    </div>
  );
}
