import { useState } from 'react'
import { KeyRound, Mail, Loader2, Zap } from 'lucide-react'

interface LoginProps {
  onLoginSuccess: (token: string) => void;
}

export function Login({ onLoginSuccess }: LoginProps) {
  const [email, setEmail] = useState('admin@example.com')
  const [password, setPassword] = useState('123456')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) throw new Error('Credenciais inválidas');

      const data = await response.json();
      onLoginSuccess(data.access_token);
      
    } catch (err) {
      setError('Acesso negado. Verifique suas credenciais.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-800 to-slate-900 p-4 relative overflow-hidden">
      {/* Elementos de Fundo Decorativos */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute top-10 left-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-10 right-10 w-72 h-72 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="bg-white/10 backdrop-blur-lg border border-white/20 p-8 rounded-2xl shadow-2xl w-full max-w-md z-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-500 mb-4 shadow-lg">
            <Zap className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">GDASH</h1>
          <p className="text-indigo-200 text-sm">Plataforma de Monitoramento Climático</p>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-500/20 border border-red-500/50 text-red-100 text-sm rounded-lg text-center backdrop-blur-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="group">
            <label className="block text-xs font-medium text-indigo-200 mb-1 ml-1 uppercase tracking-wide">Email Corporativo</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-5 w-5 text-indigo-300 group-focus-within:text-white transition-colors" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-900/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
                placeholder="nome@gdash.io"
                required
              />
            </div>
          </div>

          <div className="group">
            <label className="block text-xs font-medium text-indigo-200 mb-1 ml-1 uppercase tracking-wide">Senha de Acesso</label>
            <div className="relative">
              <KeyRound className="absolute left-3 top-3 h-5 w-5 text-indigo-300 group-focus-within:text-white transition-colors" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-900/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
                placeholder="••••••"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-indigo-900/20 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed mt-4"
          >
            {loading ? <Loader2 className="animate-spin h-5 w-5" /> : 'Acessar Dashboard'}
          </button>
        </form>
        
        <div className="mt-8 text-center">
          <p className="text-xs text-indigo-300/60">
            Acesso Restrito &copy; 2025 GDASH Energy
          </p>
        </div>
      </div>
    </div>
  )
}