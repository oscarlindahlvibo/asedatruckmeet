import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/lib/auth';
import { Truck, Mail, Lock, Loader2, AlertCircle, ArrowLeft, UserPlus } from 'lucide-react';

export default function LoginPage() {
  const { signIn, claimFirstAdmin } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const hasSetupError = new URLSearchParams(window.location.search).get('error') === 'not-admin';
  const setupMode = new URLSearchParams(window.location.search).get('setup') === '1';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const { error } = await signIn(email, password);
    setLoading(false);
    if (error) {
      setError(error);
    } else {
      if (setupMode || window.localStorage.getItem('truckmeet:first-admin-email') === email.trim().toLowerCase()) {
        const claim = await claimFirstAdmin();
        if (claim.error || !claim.claimed) {
          setError(claim.error ?? 'Första admin är redan skapad.');
          return;
        }
        window.localStorage.removeItem('truckmeet:first-admin-email');
      }
      navigate('/admin');
    }
  };

  return (
    <div className="min-h-screen bg-ink-900 flex items-center justify-center px-4 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-amber-500/5 rounded-full blur-[120px]" />

      <div className="relative z-10 w-full max-w-md">
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-white/50 hover:text-amber-400 transition-colors mb-8">
          <ArrowLeft className="w-4 h-4" />
          Tillbaka till hemsidan
        </Link>

        <div className="glass-card p-8 md:p-10">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-diesel-600 flex items-center justify-center">
              <Truck className="w-7 h-7 text-ink-900" strokeWidth={2.5} />
            </div>
            <div>
              <h1 className="font-heading font-bold text-xl text-white">Admin</h1>
              <p className="text-sm text-white/50">Åseda Truckmeet</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {hasSetupError && <div className="text-sm text-amber-300 bg-amber-500/10 border border-amber-500/20 rounded-xl px-4 py-3">Kontot saknar adminbehörighet.</div>}
            <div>
              <label className="text-sm font-medium text-white/70 mb-2 block">E-post</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:border-amber-500/50 focus:outline-none focus:ring-1 focus:ring-amber-500/30 transition-all"
                  placeholder="admin@asedatruckmeet.se"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-white/70 mb-2 block">Lösenord</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:border-amber-500/50 focus:outline-none focus:ring-1 focus:ring-amber-500/30 transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Loggar in...
                </>
              ) : (
                'Logga in'
              )}
            </button>
          </form>

          <div className="mt-7 pt-6 border-t border-white/10 text-center">
            <p className="text-sm text-white/50 mb-3">Första gången på sidan?</p>
            <Link to="/admin/setup" className="inline-flex items-center gap-2 text-sm text-amber-400 hover:text-amber-300">
              <UserPlus className="w-4 h-4" /> Skapa första admin
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
