import { useState, useEffect } from "react"
import { Login } from "./components/Login"
import { Dashboard } from "./components/Dashboard"
import { PokemonZone } from "./components/PokemonZone"
import { Gamepad2 } from "lucide-react"

function App() {
  const [token, setToken] = useState<string | null>(null);
  const [view, setView] = useState<"dashboard" | "pokemon">("dashboard");

  useEffect(() => {
    const savedToken = localStorage.getItem("gdash_token");
    if (savedToken) setToken(savedToken);
  }, []);

  const handleLogin = (newToken: string) => {
    localStorage.setItem("gdash_token", newToken);
    setToken(newToken);
  };

  const handleLogout = () => {
    localStorage.removeItem("gdash_token");
    setToken(null);
    setView("dashboard");
  };

  if (!token) {
    return <Login onLoginSuccess={handleLogin} />;
  }

  if (view === "pokemon") {
    return <PokemonZone onBack={() => setView("dashboard")} />;
  }

  return (
    <div>
      <Dashboard onLogout={handleLogout} />
      
      {/* Botão Flutuante para Bónus */}
      <div className="fixed bottom-6 right-6 z-50">
        <button 
          onClick={() => setView("pokemon")}
          className="bg-yellow-400 hover:bg-yellow-500 text-yellow-900 p-4 rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-110 flex items-center gap-2 font-bold"
        >
          <Gamepad2 className="w-6 h-6" />
          <span className="hidden md:inline">Explorar API Bónus</span>
        </button>
      </div>
    </div>
  );
}

export default App