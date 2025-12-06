import { useState, useEffect } from "react"
import { ArrowLeft, RefreshCw, Sparkles, CloudLightning, Info } from "lucide-react"

interface PokemonData {
  name: string;
  id: number;
  type: string;
  image: string;
  reason: string;
  weather_context: {
    condition_match: string;
  };
}

interface Props {
  onBack: () => void;
}

export function PokemonZone({ onBack }: Props) {
  const [pokemon, setPokemon] = useState<PokemonData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchPokemon = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:3000/api/pokemon/daily");
      if (res.ok) {
        setPokemon(await res.json());
      }
    } catch (error) {
      console.error("Erro ao buscar pokemon", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPokemon();
  }, []);

  const typeColors: Record<string, string> = {
    fire: "from-orange-400 to-red-600",
    water: "from-blue-400 to-cyan-600",
    grass: "from-green-400 to-emerald-600",
    electric: "from-yellow-300 to-amber-500",
    ice: "from-cyan-200 to-blue-400",
    ghost: "from-purple-600 to-indigo-900",
    flying: "from-sky-300 to-indigo-400",
    normal: "from-slate-300 to-slate-500",
  };

  const bgGradient = pokemon && typeColors[pokemon.type] ? typeColors[pokemon.type] : "from-slate-400 to-slate-600";

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-5xl bg-slate-800 rounded-3xl overflow-hidden shadow-2xl border border-slate-700 flex flex-col md:flex-row min-h-[500px]">
        
        {}
        <div className="p-10 md:w-1/2 flex flex-col justify-between relative z-10">
          <div>
            <button onClick={onBack} className="flex items-center gap-2 text-slate-400 hover:text-white transition mb-8 group">
                <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" /> Voltar
            </button>
            
            <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
                <CloudLightning className="text-yellow-400 fill-yellow-400" /> Radar Pokémon
            </h1>
            
            {}
            {pokemon && (
                <div className="mt-6 mb-8 p-4 bg-slate-700/50 rounded-xl border border-slate-600">
                    <h3 className="text-slate-300 text-xs font-bold uppercase tracking-wider mb-1 flex items-center gap-2">
                        <Info className="w-3 h-3" /> Por que este Pokémon?
                    </h3>
                    <p className="text-slate-100 text-sm leading-relaxed">
                        {pokemon.reason}
                    </p>
                </div>
            )}

            {pokemon && (
                <div className="space-y-2">
                    <div className="inline-block px-3 py-1 rounded-full bg-white/10 text-white text-xs font-bold uppercase tracking-wide border border-white/10">
                        Tipo: {pokemon.type}
                    </div>
                    <h2 className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400 capitalize tracking-tighter">
                        {pokemon.name}
                    </h2>
                    <p className="text-slate-500 font-mono text-lg">#{pokemon.id.toString().padStart(4, "0")}</p>
                </div>
            )}
          </div>

          <div className="mt-8">
             <button 
                onClick={fetchPokemon} 
                disabled={loading}
                className="flex items-center gap-2 px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-bold transition disabled:opacity-50 shadow-lg shadow-indigo-900/50"
             >
                {loading ? <RefreshCw className="animate-spin w-5 h-5" /> : <Sparkles className="w-5 h-5" />}
                {loading ? "Sintonizando Radar..." : "Procurar Outro"}
             </button>
          </div>
        </div>

        {}
        <div className={`md:w-1/2 bg-gradient-to-br ${bgGradient} relative flex items-center justify-center overflow-hidden`}>
            <div className="absolute top-0 right-0 w-80 h-80 bg-white opacity-10 rounded-full blur-3xl -mr-20 -mt-20"></div>
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-black opacity-20 rounded-full blur-3xl -ml-20 -mb-20"></div>
            
            {loading ? (
                <div className="relative">
                    <div className="w-48 h-48 border-4 border-white/20 border-t-white rounded-full animate-spin"></div>
                </div>
            ) : pokemon ? (
                <img 
                    src={pokemon.image} 
                    alt={pokemon.name} 
                    className="w-96 h-96 object-contain relative z-10 drop-shadow-2xl animate-bounce-slow hover:scale-110 transition-transform duration-500 cursor-pointer"
                />
            ) : null}
        </div>

      </div>
    </div>
  )
}