import { Skull, Fingerprint, Users } from 'lucide-react';

const GameScreen = ({ gameState, myPlayer, isHost, startVoting }: any) => {
  return (
    <main className="flex-1 p-6 flex flex-col items-center justify-center max-w-md mx-auto w-full">
      {!myPlayer.isDead ? (
        <div className={`w-full aspect-[3/4] rounded-3xl p-8 flex flex-col items-center justify-center text-center shadow-2xl transition-all duration-500 ${
          myPlayer.isImpostor 
            ? 'bg-gradient-to-br from-red-900 to-slate-900 border-2 border-red-500/50' 
            : 'bg-gradient-to-br from-emerald-900 to-slate-900 border-2 border-emerald-500/50'
        }`}>
          <div className="mb-6">
            {myPlayer.isImpostor ? <Skull size={64} className="text-red-500" /> : <Fingerprint size={64} className="text-emerald-500" />}
          </div>
          
          <h3 className="text-xl text-slate-300 uppercase tracking-widest mb-2">Tu palabra</h3>
          
          {myPlayer.isImpostor ? (
            <>
              <h1 className="text-4xl font-black text-red-500 mb-4">IMPOSTOR</h1>
              <p className="text-slate-400">No conoces la palabra secreta.</p>
              <p className="text-slate-400 mt-2 text-sm">Finge. Miente. Sobrevive.</p>
            </>
          ) : (
            <>
              <h1 className="text-4xl font-black text-emerald-400 mb-4">{gameState.currentWord}</h1>
              <p className="text-slate-400">Eres un Civil.</p>
              <p className="text-slate-400 mt-2 text-sm">Encuentra al impostor que no sabe esta palabra.</p>
            </>
          )}
        </div>
      ) : (
         <div className="w-full aspect-[3/4] bg-slate-800 rounded-3xl p-8 flex flex-col items-center justify-center text-center opacity-70 border border-slate-700">
            <Skull size={48} className="text-slate-500 mb-4" />
            <h2 className="text-2xl font-bold text-slate-400">ESTÁS MUERTO</h2>
            <p className="text-slate-500">Espera a que termine la ronda.</p>
         </div>
      )}

      {isHost && (
        <div className="mt-8 w-full">
          <button 
            onClick={startVoting}
            className="w-full py-4 bg-orange-600 hover:bg-orange-500 rounded-xl font-bold text-white shadow-lg flex items-center justify-center gap-2 transition"
          >
            <Users size={24} /> INICIAR VOTACIÓN
          </button>
          <p className="text-center text-xs text-slate-500 mt-2">Pulsa cuando el debate haya terminado.</p>
        </div>
      )}
    </main>
  );
};

export default GameScreen;