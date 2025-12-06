import { Crown, RotateCcw, Shuffle } from 'lucide-react';

const ResultsScreen = ({ gameState, isHost, backToLobby, nextRound }: any) => {
  const eliminated = gameState.lastEliminated;
  const winner = gameState.winner;

  const sortedPlayers = [...gameState.players].sort((a, b) => b.votes - a.votes);

  return (
    <main className="flex-1 p-6 flex flex-col items-center justify-center max-w-lg mx-auto w-full text-center">
      
      <div className="mb-6 w-full">
        {eliminated ? (
          <>
            <h2 className="text-2xl text-slate-300 mb-4">El más votado fue:</h2>
            <div className="bg-slate-800 p-8 rounded-3xl border border-slate-700 inline-block w-full shadow-xl">
              <div className="text-3xl font-bold mb-2 text-white">{eliminated.name}</div>
              <div className={`text-xl font-mono px-4 py-2 rounded-lg inline-block ${eliminated.isImpostor ? 'bg-red-500/20 text-red-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
                {eliminated.isImpostor ? 'ERA IMPOSTOR' : 'ERA INOCENTE'}
              </div>
            </div>
          </>
        ) : (
          !winner && ( 
            <div className="bg-slate-800 p-6 rounded-2xl text-xl text-slate-400 border border-slate-700">
              Empate. Nadie fue eliminado.
            </div>
          )
        )}
      </div>

      {winner ? (
        <div className="animate-bounce-in mb-8">
          <div className="flex justify-center mb-4">
             <Crown size={80} className={`${winner === 'crew' ? 'text-emerald-400' : 'text-red-500'}`} />
          </div>
          <h1 className="text-4xl font-black mb-2 uppercase text-white">
            {winner === 'crew' ? 'Ganan los Civiles' : 'Ganan los Impostores'}
          </h1>
          <p className="text-slate-400">La partida ha terminado.</p>
        </div>
      ) : (
        <div className="w-full animate-fade-in">         
           <div className="bg-slate-800/50 rounded-xl p-4 mb-6 border border-slate-700 w-full text-left">
             <h3 className="text-sm font-bold text-slate-400 uppercase mb-3 text-center">Resultados de la votación</h3>
             <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
                {sortedPlayers.map((player: any) => (
                    player.votes > 0 && (
                        <div key={player.id} className="flex flex-col bg-slate-900/50 p-3 rounded-lg border border-slate-700/50">
                            <div className="flex justify-between items-center mb-1">
                                <span className="font-bold text-slate-200">{player.name}</span>
                                <span className="bg-slate-700 text-white text-xs px-2 py-1 rounded-full">{player.votes} votos</span>
                            </div>
                            <div className="text-xs text-slate-500 flex flex-wrap gap-1">
                                Votado por: 
                                {player.voters && player.voters.map((voterName: string, idx: number) => (
                                    <span key={idx} className="text-orange-400/80">{voterName}{idx < player.voters.length - 1 ? ',' : ''}</span>
                                ))}
                            </div>
                        </div>
                    )
                ))}
             </div>
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
              className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 rounded-xl font-bold text-white flex items-center justify-center gap-2 transition shadow-lg shadow-emerald-900/50"
            >
              <RotateCcw size={20} /> NUEVA PARTIDA
            </button>
          ) : (
            <button 
              onClick={nextRound}
              className="w-full py-4 bg-blue-600 hover:bg-blue-500 rounded-xl font-bold text-white flex items-center justify-center gap-2 transition shadow-lg shadow-blue-900/50"
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