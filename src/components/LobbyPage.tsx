import { User, Crown, Play } from 'lucide-react';

const LobbyScreen = ({ gameState, startGame, isHost }: any) => {
  return (
    <main className="flex-1 p-6 flex flex-col items-center max-w-2xl mx-auto w-full">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2">Sala de Espera</h2>
        <p className="text-slate-400">Esperando jugadores... ({gameState.players.length})</p>
        {isHost && <p className="text-sm text-emerald-400 mt-2">Tú eres el Host. Inicia cuando estéis todos.</p>}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 w-full mb-8">
        {gameState.players.map((player: any) => (
          <div key={player.id} className="bg-slate-800 p-4 rounded-xl flex flex-col items-center border border-slate-700 relative">
            <div className="w-12 h-12 bg-slate-700 rounded-full flex items-center justify-center mb-2">
              <User size={24} className="text-slate-400" />
            </div>
            <span className="font-medium truncate w-full text-center">{player.name}</span>
            {player.id === gameState.hostId && (
              <span className="absolute top-2 right-2 text-yellow-500">
                <Crown size={14}/>
              </span>
            )}
          </div>
        ))}
      </div>

      {isHost ? (
        <button 
          onClick={startGame}
          className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 rounded-xl font-bold text-lg shadow-lg shadow-emerald-900/50 flex items-center justify-center gap-2 transition transform active:scale-95"
        >
          <Play size={24} /> COMENZAR PARTIDA
        </button>
      ) : (
        <div className="animate-pulse text-slate-500 bg-slate-800/50 px-6 py-3 rounded-full border border-slate-700">
          El anfitrión iniciará la partida pronto...
        </div>
      )}
    </main>
  );
};

export default LobbyScreen;