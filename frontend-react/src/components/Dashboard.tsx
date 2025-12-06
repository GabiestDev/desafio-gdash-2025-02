import { useState, useEffect } from "react"
import { 
  CloudSun, Wind, Droplets, Thermometer, LogOut, BrainCircuit, 
  AlertTriangle, Info, TrendingUp, Download, RefreshCw, 
  MapPin, CalendarClock, ArrowUpRight, ArrowDownRight, Activity
} from "lucide-react"

interface WeatherLog {
  _id: string;
  timestamp: string;
  temperature_c: number;
  apparent_temperature_c: number;
  wind_speed_kph: number;
  precipitation_mm: number;
  rain_mm: number;
  cloud_cover_percent: number;
  source: string;
}

interface Insight {
  type: "alert" | "info" | "trend";
  title: string;
  description: string;
  severity: "low" | "medium" | "high";
}

interface DashboardProps {
  onLogout: () => void;
}

export function Dashboard({ onLogout }: DashboardProps) {
  const [logs, setLogs] = useState<WeatherLog[]>([]);
  const [insights, setInsights] = useState<Insight[]>([]);
  const [loading, setLoading] = useState(true);
  
  // RELÓGIO DINÂMICO
  const [now, setNow] = useState(new Date());

  const fetchData = async () => {
    try {
      const resLogs = await fetch("http://localhost:3000/api/weather/logs");
      if (resLogs.ok) setLogs(await resLogs.json());

      const resInsights = await fetch("http://localhost:3000/api/weather/insights");
      if (resInsights.ok) setInsights(await resInsights.json());
    } catch (error) {
      console.error("Erro ao buscar dados", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // Atualiza dados a cada 10s
    const dataInterval = setInterval(fetchData, 10000); 
    // Atualiza relógio a cada 1s
    const clockInterval = setInterval(() => setNow(new Date()), 1000);

    return () => {
        clearInterval(dataInterval);
        clearInterval(clockInterval);
    };
  }, []);

  const handleExport = () => {
    window.open("http://localhost:3000/api/weather/export", "_blank");
  };

  const current = logs[0];

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-12">
      <nav className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-tr from-indigo-600 to-purple-600 p-2 rounded-lg shadow-md shadow-indigo-200">
                <CloudSun className="w-5 h-5 text-white" />
              </div>
              <div className="leading-none">
                <h1 className="text-lg font-bold text-slate-800 tracking-tight">GDASH<span className="text-indigo-600">Monitor</span></h1>
                <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mt-0.5">Analytics v2.0</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="hidden md:flex flex-col items-end text-xs text-slate-500 mr-2 border-r border-slate-200 pr-4">
                <span className="flex items-center gap-1 font-medium"><MapPin className="w-3 h-3 text-indigo-500" /> Triunfo, RS</span>
                {/* RELÓGIO DINÂMICO AQUI */}
                <span className="flex items-center gap-1 font-mono"><CalendarClock className="w-3 h-3" /> {now.toLocaleTimeString()}</span>
              </div>
              <button onClick={handleExport} className="hidden sm:flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-indigo-700 bg-indigo-50 border border-indigo-100 rounded-lg hover:bg-indigo-100 transition">
                <Download className="w-3 h-3" /> CSV
              </button>
              <button onClick={onLogout} className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition">
                <LogOut className="w-3 h-3" /> Sair
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {loading && logs.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[60vh] text-slate-400 animate-pulse">
            <RefreshCw className="w-16 h-16 mb-4 animate-spin text-indigo-500" />
            <p className="text-xl font-medium text-slate-600">Sincronizando pipeline...</p>
          </div>
        ) : !current ? (
          <div className="bg-white border-l-4 border-amber-500 rounded-r-xl p-8 shadow-sm flex items-center gap-6">
            <div className="p-4 bg-amber-50 rounded-full">
                <AlertTriangle className="w-8 h-8 text-amber-500" />
            </div>
            <div>
                <h2 className="text-xl font-bold text-slate-800">Aguardando Dados</h2>
                <p className="text-slate-600">O sistema está conectado. Aguarde o próximo ciclo do coletor.</p>
            </div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl p-8 text-white shadow-xl shadow-indigo-900/20 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -mr-16 -mt-16 blur-3xl"></div>
                    <div className="absolute bottom-0 left-0 w-40 h-40 bg-purple-400 opacity-10 rounded-full -ml-10 -mb-10 blur-2xl"></div>
                    <div className="relative z-10 flex flex-col md:flex-row justify-between items-center h-full">
                        <div>
                            <div className="flex items-center gap-2 mb-1 opacity-80">
                                <Activity className="w-4 h-4" />
                                <span className="text-sm font-medium tracking-wider uppercase">Status Atual</span>
                            </div>
                            <div className="flex items-start">
                                <span className="text-8xl font-bold tracking-tighter">{current.temperature_c.toFixed(0)}</span>
                                <span className="text-4xl font-light mt-2 opacity-80">°C</span>
                            </div>
                            <p className="text-lg font-medium opacity-90 mt-2">
                                Sensação Térmica de {current.apparent_temperature_c.toFixed(1)}°C
                            </p>
                        </div>
                        <div className="mt-6 md:mt-0 flex flex-col items-center md:items-end gap-2">
                            <div className="p-4 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/10">
                                <CloudSun className="w-16 h-16 text-yellow-300" />
                            </div>
                            <span className="text-sm font-medium bg-white/20 px-3 py-1 rounded-full">
                                {current.cloud_cover_percent > 50 ? "Nublado" : "Céu Limpo"}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="font-bold text-slate-800 flex items-center gap-2">
                            <BrainCircuit className="w-5 h-5 text-purple-600" />
                            Análise de IA
                        </h2>
                        <span className="text-[10px] font-bold bg-purple-50 text-purple-700 px-2 py-1 rounded border border-purple-100">AUTO</span>
                    </div>
                    <div className="flex-1 space-y-3 overflow-y-auto max-h-[220px] pr-2 custom-scrollbar">
                        {insights.length > 0 ? insights.map((insight, idx) => (
                            <div key={idx} className={`p-3 rounded-xl border-l-4 text-sm ${
                                insight.severity === "high" ? "bg-red-50 border-l-red-500 text-red-900" : 
                                insight.severity === "medium" ? "bg-amber-50 border-l-amber-500 text-amber-900" : 
                                "bg-slate-50 border-l-blue-500 text-slate-700"
                            }`}>
                                <div className="flex items-center gap-2 font-bold mb-1">
                                    {insight.type === "alert" ? <AlertTriangle className="w-3.5 h-3.5" /> :
                                     insight.type === "trend" ? <TrendingUp className="w-3.5 h-3.5" /> :
                                     <Info className="w-3.5 h-3.5" />}
                                    {insight.title}
                                </div>
                                <p className="opacity-90 leading-snug text-xs">{insight.description}</p>
                            </div>
                        )) : (
                            <div className="h-full flex flex-col items-center justify-center text-slate-400 text-center text-sm border-2 border-dashed border-slate-100 rounded-xl">
                                <BrainCircuit className="w-8 h-8 mb-2 opacity-20" />
                                <p>Processando...</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <section>
                <h2 className="text-lg font-bold text-slate-700 mb-4 mt-8 flex items-center gap-2">
                    <Thermometer className="w-5 h-5 text-indigo-500" />
                    Telemetria em Tempo Real
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <DetailCard 
                        label="Vento" 
                        value={`${current.wind_speed_kph.toFixed(1)}`} 
                        unit="km/h"
                        sub="Direção Variável"
                        icon={<Wind className="w-5 h-5 text-cyan-600" />}
                        trend="flat"
                    />
                    <DetailCard 
                        label="Precipitação" 
                        value={`${current.precipitation_mm.toFixed(1)}`} 
                        unit="mm"
                        sub="Volume na última hora"
                        icon={<Droplets className="w-5 h-5 text-blue-600" />}
                        trend={current.precipitation_mm > 0 ? "up" : "flat"}
                    />
                    <DetailCard 
                        label="Nebulosidade" 
                        value={`${current.cloud_cover_percent.toFixed(0)}`} 
                        unit="%"
                        sub="Cobertura total"
                        icon={<CloudSun className="w-5 h-5 text-yellow-600" />}
                        trend={current.cloud_cover_percent > 50 ? "up" : "down"}
                    />
                    <DetailCard 
                        label="Fonte de Dados" 
                        value={current.source} 
                        unit=""
                        sub="Latência: < 100ms"
                        icon={<Activity className="w-5 h-5 text-emerald-600" />}
                        trend="flat"
                    />
                </div>
            </section>

            <section className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mt-6">
              <div className="px-6 py-5 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-50/50">
                <div>
                  <h3 className="text-base font-bold text-slate-800">Histórico de Registros</h3>
                  <p className="text-xs text-slate-500">Log detalhado das últimas 50 coletas</p>
                </div>
                <button onClick={handleExport} className="sm:hidden flex items-center justify-center gap-2 px-4 py-2 text-xs font-bold text-indigo-600 bg-indigo-50 border border-indigo-100 rounded-lg">
                  <Download className="w-3 h-3" /> BAIXAR CSV
                </button>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-white text-slate-400 font-medium border-b border-slate-100 text-xs uppercase tracking-wider">
                    <tr>
                      <th className="px-6 py-4">Horário</th>
                      <th className="px-6 py-4">Temperatura</th>
                      <th className="px-6 py-4 hidden sm:table-cell">Sensação</th>
                      <th className="px-6 py-4 hidden sm:table-cell">Vento</th>
                      <th className="px-6 py-4 hidden md:table-cell">Chuva</th>
                      <th className="px-6 py-4 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {logs.map((log) => (
                      <tr key={log._id} className="hover:bg-indigo-50/30 transition-colors duration-150 group">
                        <td className="px-6 py-3.5 font-mono text-slate-500 font-medium">
                          {new Date(log.timestamp).toLocaleTimeString([], {hour: "2-digit", minute:"2-digit"})}
                        </td>
                        <td className="px-6 py-3.5">
                          <span className="font-bold text-slate-700">{log.temperature_c.toFixed(1)}°C</span>
                        </td>
                        <td className="px-6 py-3.5 text-slate-500 hidden sm:table-cell">{log.apparent_temperature_c.toFixed(1)}°C</td>
                        <td className="px-6 py-3.5 text-slate-500 hidden sm:table-cell">{log.wind_speed_kph.toFixed(1)} km/h</td>
                        <td className="px-6 py-3.5 text-slate-500 hidden md:table-cell">
                          {log.precipitation_mm > 0 ? 
                            <span className="text-blue-600 font-bold flex items-center gap-1"><Droplets className="w-3 h-3" /> {log.precipitation_mm.toFixed(1)}</span> : 
                            <span className="text-slate-300">-</span>
                          }
                        </td>
                        <td className="px-6 py-3.5 text-right">
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-emerald-100 text-emerald-800">
                                OK
                            </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </>
        )}
      </main>
    </div>
  )
}

function DetailCard({ label, value, unit, sub, icon, trend }: any) {
  return (
    <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 hover:border-indigo-300 hover:shadow-md transition-all duration-300 group">
      <div className="flex justify-between items-start mb-3">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{label}</span>
        <div className={`p-2 rounded-lg bg-slate-50 group-hover:bg-indigo-50 transition-colors`}>
            {icon}
        </div>
      </div>
      <div className="flex items-end gap-1">
        <span className="text-2xl font-bold text-slate-800">{value}</span>
        <span className="text-sm font-medium text-slate-400 mb-1">{unit}</span>
      </div>
      <div className="flex items-center gap-2 mt-2">
        {trend === "up" && <ArrowUpRight className="w-3 h-3 text-red-500" />}
        {trend === "down" && <ArrowDownRight className="w-3 h-3 text-emerald-500" />}
        <p className="text-[10px] text-slate-400 font-medium truncate">{sub}</p>
      </div>
    </div>
  )
}