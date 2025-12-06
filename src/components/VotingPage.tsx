import { Skull, User } from 'lucide-react';

const VotingScreen = ({ gameState, user, myPlayer, isHost, castVote, endVoting }: any) => {
  const isMyTurnToVote = !myPlayer.isDead && !myPlayer.hasVoted;

  return (
    <main className="flex-1 p-6 flex flex-col max-w-2xl mx-auto w-full">
      <h2 className="text-2xl font-bold text-center mb-2 text-orange-500 animate-pulse">¡VOTACIÓN!</h2>
      <p className="text-center text-slate-400 mb-6">Selecciona al sospechoso.</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
        {gameState.players.map((player: any) => {
          const isMe = player.id === user.uid;
          const isTarget = player.id !== user.uid && !player.isDead;
          
          return (
            <button
              key={player.id}
              disabled={!isMyTurnToVote || !isTarget}
              onClick={() => castVote(player.id)}
              className={`p-4 rounded-xl border flex items-center justify-between transition-all ${
                player.isDead 
                  ? 'bg-slate-800/50 border-slate-700 opacity-50 cursor-not-allowed' 
                  : isMe 
                    ? 'bg-slate-800 border-slate-600 cursor-default'
                    : isMyTurnToVote
                      ? 'bg-slate-800 border-slate-600 hover:bg-orange-900/30 hover:border-orange-500 active:scale-95 cursor-pointer'
                      : 'bg-slate-800 border-slate-700 cursor-default opacity-60'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${player.isDead ? 'bg-slate-700' : 'bg-emerald-900 text-emerald-400'}`}>
                  {player.isDead ? <Skull size={20} /> : <User size={20} />}
                </div>
                <div className="text-left">
                  <div className="font-bold">{player.name} {isMe && '(Tú)'}</div>
                  {player.isDead && <div className="text-xs text-red-400">Eliminado</div>}
                </div>
              </div>
              {player.hasVoted && !player.isDead && <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" title="Ya ha votado"></div>}
            </button>
          );
        })}
      </div>

      <div className="mt-auto">
         {!isMyTurnToVote && !myPlayer.isDead && (
           <div className="text-center bg-emerald-900/30 text-emerald-400 p-4 rounded-lg mb-4 border border-emerald-500/30">
             ¡Voto registrado! Esperando al resto...
           </div>
         )}
         {myPlayer.isDead && (
           <div className="text-center bg-red-900/30 text-red-400 p-4 rounded-lg mb-4 border border-red-500/30">
             Los muertos no votan...
           </div>
         )}

         {isHost && (
          <button 
            onClick={endVoting}
            className="w-full py-4 bg-red-600 hover:bg-red-500 rounded-xl font-bold text-white shadow-lg flex items-center justify-center gap-2 transition"
          >
            <Skull size={24} /> FINALIZAR VOTACIÓN
          </button>
         )}
      </div>
    </main>
  );
};

export default VotingScreen;