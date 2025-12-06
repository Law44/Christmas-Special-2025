import { useState, useEffect } from 'react';
import { signInAnonymously, onAuthStateChanged } from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc, onSnapshot, arrayUnion } from 'firebase/firestore';
import { auth, db } from './config/firebase';
import { DICTIONARIES } from './utils/dictionaries';

// Importación de componentes
import Header from './components/Header';
import WelcomeScreen from './components/WelcomePage';
import LobbyScreen from './components/LobbyPage';
import GameScreen from './components/GamePage';
import VotingScreen from './components/VotingPage';
import ResultsScreen from './components/ResultsPage';

export default function App() {
  const [user, setUser] = useState<any | null>(null);
  const [gameCode, setGameCode] = useState('');
  const [playerName, setPlayerName] = useState('');
  const [gameState, setGameState] = useState<any>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Settings locales
  const [numImpostors, setNumImpostors] = useState(1);
  const [dictionary, setDictionary] = useState('Normal');

  // --- 1. AUTENTICACIÓN ---
  useEffect(() => {
    signInAnonymously(auth).catch((err) => console.error("Error auth:", err));
    const unsubscribe = onAuthStateChanged(auth, (u) => setUser(u));
    return () => unsubscribe();
  }, []);

  // --- 2. CONEXIÓN REAL-TIME ---
  useEffect(() => {
    if (!user || !gameCode) return;

    const gameRef = doc(db, 'games', `game_${gameCode.toUpperCase()}`);

    const unsubscribe = onSnapshot(gameRef, (snapshot) => {
      if (snapshot.exists()) {
        setGameState(snapshot.data());
        setError('');
      } else {
        setGameState(null);
        if (gameState) setError("La partida ha sido cerrada o no existe.");
      }
    }, (err) => {
      console.error("Error fetching game:", err);
      setError("Error de conexión con la partida.");
    });

    return () => unsubscribe();
  }, [user, gameCode]);

  // --- LÓGICA ---
  const generateRoomCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let result = '';
    for (let i = 0; i < 4; i++) result += chars.charAt(Math.floor(Math.random() * chars.length));
    return result;
  };

  const createGame = async () => {
    if (!user) return;
    if (!playerName.trim()) { setError("Necesitas un nombre."); return; }
    setLoading(true);
    const code = generateRoomCode();

    const newGame = {
      code,
      hostId: user.uid,
      status: 'lobby',
      settings: { numImpostors, dictionary },
      currentWord: '',
      players: [{
        id: user.uid,
        name: playerName,
        isImpostor: false,
        isDead: false,
        votes: 0,
        hasVoted: false
      }],
      lastEliminated: null,
      winner: null,
      createdAt: new Date()
    };

    try {
      await setDoc(doc(db, 'games', `game_${code}`), newGame);
      setGameCode(code);
      setError('');
    } catch (e) {
      console.error(e);
      setError("Error creando partida.");
    }
    setLoading(false);
  };

  const joinGame = async (codeToJoin: string) => {
    if (!user) return;
    if (!playerName.trim()) { setError("Necesitas un nombre."); return; }
    if (!codeToJoin) { setError("Introduce un código."); return; }
    setLoading(true);
    const code = codeToJoin.toUpperCase();
    const gameRef = doc(db, 'games', `game_${code}`);

    try {
      const docSnap = await getDoc(gameRef);
      if (docSnap.exists()) {
        const game = docSnap.data();
        if (game.status !== 'lobby') {
          setError("La partida ya ha comenzado.");
        } else {
          const playerExists = game.players.find((p: any) => p.id === user.uid);
          if (!playerExists) {
            const newPlayer = {
              id: user.uid,
              name: playerName,
              isImpostor: false,
              isDead: false,
              votes: 0,
              hasVoted: false
            };
            await updateDoc(gameRef, { players: arrayUnion(newPlayer) });
          }
          setGameCode(code);
          setError('');
        }
      } else {
        setError("Partida no encontrada.");
      }
    } catch (e) {
      console.error(e);
      setError("Error uniéndose a la partida.");
    }
    setLoading(false);
  };

  const startGame = async () => {
    if (!gameState) return;
    
    const dict = DICTIONARIES[gameState.settings.dictionary];
    const word = dict[Math.floor(Math.random() * dict.length)];
    
    let currentPlayers = [...gameState.players];
    
    currentPlayers = currentPlayers.map(p => ({
      ...p, 
      isImpostor: false, 
      isDead: false, 
      votes: 0, 
      voters: [], 
      hasVoted: false
    }));

    let impostorCount = 0;
    const maxImpostors = Math.min(gameState.settings.numImpostors, Math.floor(currentPlayers.length / 2));
    
    while (impostorCount < maxImpostors) {
      const randomIndex = Math.floor(Math.random() * currentPlayers.length);
      if (!currentPlayers[randomIndex].isImpostor) {
        currentPlayers[randomIndex].isImpostor = true;
        impostorCount++;
      }
    }

    const gameRef = doc(db, 'games', `game_${gameCode.toUpperCase()}`);
    await updateDoc(gameRef, {
      status: 'playing',
      currentWord: word,
      players: currentPlayers,
      winner: null,
      lastEliminated: null
    });
  };

  const startVoting = async () => {
    const gameRef = doc(db, 'games', `game_${gameCode.toUpperCase()}`);
    await updateDoc(gameRef, { status: 'voting' });
  };

  const castVote = async (targetPlayerId: string) => {
    if (!gameState || !user) return;
    const me = gameState.players.find((p: any) => p.id === user.uid);
    if (me.isDead || me.hasVoted) return;

    const voterName = me.name;

    const newPlayers = gameState.players.map((p: any) => {
      if (p.id === targetPlayerId) {
        return {
          ...p,
          votes: p.votes + 1,
          voters: [...(p.voters || []), voterName]
        };
      }
      if (p.id === user.uid) return { ...p, hasVoted: true };
      return p;
    });

    const gameRef = doc(db, 'games', `game_${gameCode.toUpperCase()}`);
    await updateDoc(gameRef, { players: newPlayers });
  };

  const endVoting = async () => {
    if (!gameState) return;

    let maxVotes = -1;
    let eliminated: any = null;
    let tie = false;

    gameState.players.forEach((p: any) => {
      if (!p.isDead) {
        if (p.votes > maxVotes) {
          maxVotes = p.votes;
          eliminated = p;
          tie = false;
        } else if (p.votes === maxVotes) {
          tie = true;
        }
      }
    });

    let newPlayers = [...gameState.players];
    let winner = null;

    if (eliminated && !tie) {
      newPlayers = newPlayers.map((p: any) => p.id === eliminated.id ? { ...p, isDead: true } : p);
    } else {
      eliminated = null;
    }

    const impostorsAlive = newPlayers.filter((p: any) => p.isImpostor && !p.isDead).length;
    const crewAlive = newPlayers.filter((p: any) => !p.isImpostor && !p.isDead).length;

    if (impostorsAlive === 0) winner = 'crew';
    else if (impostorsAlive >= crewAlive) winner = 'impostors';

    const gameRef = doc(db, 'games', `game_${gameCode.toUpperCase()}`);
    await updateDoc(gameRef, {
      status: 'results',
      players: newPlayers,
      lastEliminated: eliminated,
      winner: winner
    });
  };

  const nextRound = async () => {
    if (!gameState) return;

    const playersReset = gameState.players.map((p: any) => ({
      ...p,
      votes: 0,     
      voters: [],     
      hasVoted: false 
    }));

    const gameRef = doc(db, 'games', `game_${gameCode.toUpperCase()}`);
    await updateDoc(gameRef, { 
        status: 'playing',
        players: playersReset,
        lastEliminated: null 
    });
  };

  const backToLobby = async () => {
    const gameRef = doc(db, 'games', `game_${gameCode.toUpperCase()}`);
    await updateDoc(gameRef, { status: 'lobby', winner: null, lastEliminated: null });
  };

  // --- RENDERIZADO ---

  if (!gameCode || !gameState) {
    return (
      <WelcomeScreen
        playerName={playerName}
        setPlayerName={setPlayerName}
        joinGame={joinGame}
        createGame={createGame}
        numImpostors={numImpostors}
        setNumImpostors={setNumImpostors}
        dictionary={dictionary}
        setDictionary={setDictionary}
        loading={loading}
        error={error}
        dictionaries={DICTIONARIES}
      />
    );
  }

  const isHost = user && gameState.hostId === user.uid;
  const myPlayer = user && gameState.players.find((p: any) => p.id === user.uid) || {};

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col font-sans">
      <Header gameCode={gameCode} onExit={() => setGameCode('')} />

      {gameState.status === 'lobby' && (
        <LobbyScreen
          gameState={gameState}
          user={user}
          startGame={startGame}
          isHost={isHost}
        />
      )}

      {gameState.status === 'playing' && (
        <GameScreen
          gameState={gameState}
          myPlayer={myPlayer}
          isHost={isHost}
          startVoting={startVoting}
        />
      )}

      {gameState.status === 'voting' && (
        <VotingScreen
          gameState={gameState}
          user={user}
          myPlayer={myPlayer}
          isHost={isHost}
          castVote={castVote}
          endVoting={endVoting}
        />
      )}

      {gameState.status === 'results' && (
        <ResultsScreen
          gameState={gameState}
          isHost={isHost}
          backToLobby={backToLobby}
          nextRound={nextRound}
        />
      )}
    </div>
  );
}