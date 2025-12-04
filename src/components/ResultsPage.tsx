import React from 'react';
import { Crown, RotateCcw, Shuffle } from 'lucide-react';

const ResultsScreen = ({ gameState, isHost, backToLobby, nextRound }: any) => {
  const eliminated = gameState.lastEliminated;
  const winner = gameState.winner;

  return (
    <main className="flex-1 p-6 flex flex-col items-center justify-center max-w-lg mx-auto w-full text-center">
      
      {winner ? (
        <div className="animate-bounce-in">
          <Crown size={80} className={`mx-auto mb-6 ${winner === 'crew' ? 'text-emerald-400' : 'text-red-500'}`} />
          <h1 className="text-4xl font-black mb-2 uppercase text-white">
            {winner === 'crew' ? 'Ganan los Civiles' : 'Ganan los Impostores'}
          </h1>
          <p className="text-slate-400 mb-8">La partida ha terminado.</p>
        </div>
      ) : (
        <div>
          <div className="mb-8">
            <h2 className="text-2xl text-slate-300 mb-4">El más votado fue:</h2>
            {eliminated ? (
               <div className="bg-slate-800 p-8 rounded-3xl border border-slate-700 inline-block w-full">
                  <div className="text-3xl font-bold mb-2 text-white">{eliminated.name}</div>
                  <div className={`text-xl font-mono px-4 py-2 rounded-lg inline-block ${eliminated.isImpostor ? 'bg-red-500/20 text-red-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
                    {eliminated.isImpostor ? 'ERA IMPOSTOR' : 'ERA INOCENTE'}
                  </div>
               </div>
            ) : (
              <div className="bg-slate-800 p-6 rounded-2xl text-xl text-slate-400 border border-slate-700">
                Empate. Nadie fue eliminado.
              </div>
            )}
          </div>
          
          <div className="bg-slate-800/50 p-4 rounded-xl mb-8 border border-slate-700">
            <h3 className="text-sm font-bold text-slate-400 uppercase mb-2">Estado de la Misión</h3>
            <div className="flex justify-between items-center px-4">
                <span className="text-red-400 font-bold">Impostores vivos: {gameState.players.filter((p: any) => p.isImpostor && !p.isDead).length}</span>
                <span className="text-emerald-400 font-bold">Civiles vivos: {gameState.players.filter((p: any) => !p.isImpostor && !p.isDead).length}</span>
            </div>
          </div>
        </div>
      )}

      {isHost && (
        <div className="w-full space-y-3">
          {winner ? (
            <button 
              onClick={backToLobby}
              className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 rounded-xl font-bold text-white flex items-center justify-center gap-2 transition"
            >
              <RotateCcw size={20} /> NUEVA PARTIDA
            </button>
          ) : (
            <button 
              onClick={nextRound}
              className="w-full py-4 bg-blue-600 hover:bg-blue-500 rounded-xl font-bold text-white flex items-center justify-center gap-2 transition"
            >
              <Shuffle size={20} /> SIGUIENTE RONDA
            </button>
          )}
        </div>
      )}
      
      {!isHost && (
        <p className="text-slate-500 animate-pulse mt-4">Esperando al anfitrión...</p>
      )}

    </main>
  );
};

export default ResultsScreen;