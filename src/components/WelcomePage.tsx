import { Fingerprint, Crown } from 'lucide-react';

const WelcomeScreen = ({ 
  playerName, setPlayerName, joinGame, createGame, 
  numImpostors, setNumImpostors, dictionary, setDictionary, loading, error, dictionaries 
}: any) => {

  // Comprobamos si hay nombre escrito (quitando espacios en blanco)
  const hasName = playerName && playerName.trim().length > 0;

  // Lógica para el input de código: solo busca partida al llegar a 4 letras
  const handleJoinChange = (e: any) => {
    const code = e.target.value.toUpperCase();
    
    // Solo si tiene 4 caracteres llamamos a la base de datos
    if (code.length === 4) {
      joinGame(code);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <Fingerprint size={64} className="text-emerald-400" />
          </div>
          <h1 className="text-4xl font-bold tracking-wider text-emerald-400">IMPOSTOR</h1>
          <p className="mt-2 text-slate-400">Encuentra al espía antes de que sea tarde.</p>
        </div>

        <div className="bg-slate-800 p-6 rounded-2xl shadow-xl space-y-6 border border-slate-700">
          
          {/* INPUT DE NOMBRE */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Tu Nombre</label>
            <input
              type="text"
              value={playerName}
              onChange={(e: any) => setPlayerName(e.target.value)}
              className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg focus:ring-2 focus:ring-emerald-500 text-white outline-none transition placeholder-slate-500"
              placeholder="Ej. Capitán Alex"
            />
          </div>

          <div className="space-y-4">
            
            {/* SECCIÓN UNIRSE */}
            <div className="pt-4 border-t border-slate-700">
              <h3 className={`text-lg font-semibold mb-3 transition-colors ${hasName ? 'text-white' : 'text-slate-600'}`}>
                Unirse a Partida
              </h3>
              <div className="flex gap-2">
                <input
                  type="text"
                  disabled={!hasName} // Bloqueado si no hay nombre
                  onChange={handleJoinChange} // Usamos la nueva función
                  className={`flex-1 px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg uppercase outline-none transition ${
                    !hasName 
                      ? 'opacity-50 cursor-not-allowed placeholder-slate-600' 
                      : 'text-white placeholder-slate-500 focus:border-emerald-500'
                  }`}
                  placeholder={hasName ? "CÓDIGO (4 LETRAS)" : "PON TU NOMBRE PRIMERO"}
                  maxLength={4}
                />
              </div>
            </div>

            {/* SECCIÓN CREAR (HOST) */}
            <div className="pt-4 border-t border-slate-700">
              <h3 className={`text-lg font-semibold mb-3 transition-colors ${hasName ? 'text-white' : 'text-slate-600'}`}>
                Crear Partida (Host)
              </h3>
              
              {/* Opciones de configuración (Visualmente deshabilitadas si no hay nombre) */}
              <div className={`grid grid-cols-2 gap-4 mb-4 transition-opacity ${!hasName ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
                <div>
                  <label className="text-xs text-slate-400">Impostores</label>
                  <input 
                    type="number" 
                    min="1" 
                    max="3" 
                    value={numImpostors} 
                    onChange={(e: any) => setNumImpostors(parseInt(e.target.value))}
                    className="w-full mt-1 px-3 py-2 bg-slate-700 rounded text-white border border-slate-600 focus:border-emerald-500 outline-none"
                    disabled={!hasName}
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400">Diccionario</label>
                  <select 
                    value={dictionary} 
                    onChange={(e: any) => setDictionary(e.target.value)}
                    className="w-full mt-1 px-3 py-2 bg-slate-700 rounded text-white border border-slate-600 focus:border-emerald-500 outline-none"
                    disabled={!hasName}
                  >
                    {Object.keys(dictionaries).map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
              </div>

              {/* Botón Crear */}
              <button
                onClick={createGame}
                disabled={!hasName || loading} // Bloqueado si no hay nombre o está cargando
                className={`w-full py-3 rounded-lg font-bold transition flex items-center justify-center gap-2 ${
                  !hasName || loading
                    ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
                    : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg'
                }`}
              >
                {loading ? 'Creando...' : <><Crown size={20} /> Crear Nueva Partida</>}
              </button>
            </div>
          </div>
          
          {error && <p className="text-red-400 text-center text-sm bg-red-900/20 p-2 rounded animate-pulse">{error}</p>}
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreen;