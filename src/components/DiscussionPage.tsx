import { Users, Skull, MessageCircle } from 'lucide-react';

const DiscussionScreen = ({ gameState, isHost, startVoting }: any) => {
  return (
    <main className="flex-1 p-6 flex flex-col max-w-2xl mx-auto w-full">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-sky-400 mb-2 flex items-center justify-center gap-3">
            <MessageCircle size={32} /> DEBATE
        </h2>
        <p className="text-slate-400">Discutid quién es el impostor.</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
        {gameState.players.map((player: any) => (
          <div 
            key={player.id} 
            className={`p-4 rounded-xl border flex flex-col items-center justify-center text-center transition-all ${
              player.isDead 
                ? 'bg-slate-800/50 border-slate-700 opacity-50' 
                : 'bg-slate-800 border-slate-600'
            }`}
          >
            <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 ${player.isDead ? 'bg-slate-700' : 'bg-sky-900 text-sky-400'}`}>
               {player.isDead ? <Skull size={24} /> : <Users size={24} />}
            </div>
            <span className="font-bold truncate w-full">{player.name}</span>
            {player.isDead && <span className="text-xs text-red-400">Eliminado</span>}
          </div>
        ))}
      </div>

      {isHost ? (
        <div className="mt-auto w-full">
          <button 
            onClick={startVoting}
            className="w-full py-4 bg-orange-600 hover:bg-orange-500 rounded-xl font-bold text-white shadow-lg flex items-center justify-center gap-2 transition"
          >
            <Users size={24} /> INICIAR VOTACIÓN
          </button>
          <p className="text-center text-xs text-slate-500 mt-2">Pulsa cuando queráis dejar de hablar y votar.</p>
        </div>
      ) : (
         <div className="mt-auto text-center animate-pulse text-slate-500 bg-slate-800/50 px-6 py-3 rounded-full border border-slate-700">
           Esperando al anfitrión para votar...
         </div>
      )}
    </main>
  );
};

export default DiscussionScreen;