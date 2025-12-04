import React from 'react';
import { Fingerprint, LogOut } from 'lucide-react';

// Definimos props como 'any' para evitar errores estrictos
const Header = ({ gameCode, onExit }: any) => (
  <header className="bg-slate-800 p-4 flex justify-between items-center shadow-md border-b border-slate-700">
    <div className="flex items-center gap-2">
      <div className="bg-emerald-500/20 p-2 rounded-lg">
        <Fingerprint className="text-emerald-400" size={24} />
      </div>
      <div>
        <h2 className="font-bold text-white leading-tight">IMPOSTOR</h2>
        <p className="text-xs text-slate-400">Código: <span className="text-emerald-400 font-mono text-lg">{gameCode}</span></p>
      </div>
    </div>
    <button onClick={onExit} className="text-slate-400 hover:text-white transition-colors">
      <LogOut size={20} />
    </button>
  </header>
);

export default Header;