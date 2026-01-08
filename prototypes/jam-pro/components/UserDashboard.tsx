
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Song } from '../types';

interface UserDashboardProps {
  currentSong: Song | null;
  userQueue: Song[];
}

const InstrumentIcon = ({ instrument, size = "22" }: { instrument: string, size?: string }) => {
  const norm = instrument?.toLowerCase() || '';
  
  // Vocal / Mic
  if (norm.includes('vocal') || norm.includes('voz') || norm.includes('mic')) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" x2="12" y1="19" y2="22"/>
      </svg>
    );
  }
  // Teclado
  if (norm.includes('teclado') || norm.includes('piano') || norm.includes('keys')) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="5" width="20" height="14" rx="2"/><path d="M6 5v14"/><path d="M10 5v14"/><path d="M14 5v14"/><path d="M18 5v14"/><path d="M2 14h20"/>
      </svg>
    );
  }
  // Bateria
  if (norm.includes('bateria') || norm.includes('drums')) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <ellipse cx="12" cy="12" rx="10" ry="5"/><path d="M2 12v7c0 2.8 4.5 5 10 5s10-2.2 10-5v-7"/><path d="M7 15l-3-3"/><path d="M17 15l3-3"/>
      </svg>
    );
  }
  // Baixo
  if (norm.includes('baixo') || norm.includes('bass')) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>
      </svg>
    );
  }
  // Guitarra Elétrica
  if (norm.includes('guitarra')) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="m16 2 4 4"/><path d="m21 3-3 3"/><path d="m5 13 5-5"/><path d="m8 10-5 5v6h6l5-5"/><circle cx="15.5" cy="8.5" r="2.5"/>
      </svg>
    );
  }
  // Violão (Acoustic)
  if (norm.includes('violão') || norm.includes('acoustic')) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 7c0-5-6-5-6 0v10c0 5 6 5 6 0V7Z"/><path d="M12 7c0-5-6-5-6 0v10c0 5 6 5 6 0V7Z"/><circle cx="12" cy="12" r="2"/>
      </svg>
    );
  }
  // Metais (Horns)
  if (norm.includes('metais') || norm.includes('horns') || norm.includes('trumpet')) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 12h10l4-4h4v8h-4l-4-4H3z"/><path d="M7 12v4"/><path d="M10 12v4"/>
      </svg>
    );
  }
  // Percussão
  if (norm.includes('percussão') || norm.includes('conga') || norm.includes('pandeiro')) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="9"/><path d="M12 3v18"/><path d="M3 12h18"/><path d="m4.93 4.93 14.14 14.14"/><path d="m19.07 4.93-14.14 14.14"/>
      </svg>
    );
  }

  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><path d="M12 8v8"/><path d="M8 12h8"/>
    </svg>
  );
};

const DraftSlot = ({ type, count, selected, onSelect }: { type: string, count: number, selected: boolean, onSelect: () => void }) => (
  <button 
    onClick={onSelect}
    className={`relative w-12 h-12 md:w-14 md:h-14 flex items-center justify-center border rounded-lg transition-all duration-300 ${
      selected 
      ? 'bg-blue-600/20 border-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.3)]' 
      : 'bg-white/5 border-white/10 hover:border-white/30'
    }`}
  >
    <div className={`${selected ? 'text-blue-400' : 'text-gray-400'}`}>
      <InstrumentIcon instrument={type} size="22" />
    </div>
    {count > 0 && (
      <div className={`absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full flex items-center justify-center border border-[#121212] transition-colors ${
        selected ? 'bg-blue-600 text-white' : 'bg-gray-600 text-white/90'
      }`}>
        <span className="text-[10px] font-black leading-none">{count}</span>
      </div>
    )}
  </button>
);

const UserDashboard: React.FC<UserDashboardProps> = ({ currentSong, userQueue }) => {
  const [selectedDraftSlots, setSelectedDraftSlots] = useState<Record<number, number>>({});

  const drafts = [
    { 
      title: 'SMELLS LIKE TEEN SPIRIT', 
      artist: 'NIRVANA', 
      status: 'waiting', 
      slots: [
        { type: 'vocal', count: 1 },
        { type: 'guitarra', count: 1 },
        { type: 'baixo', count: 0 },
        { type: 'bateria', count: 1 }
      ] 
    },
    { 
      title: 'GIRL FROM IPANEMA', 
      artist: 'TOM JOBIM', 
      status: 'open', 
      slots: [
        { type: 'vocal', count: 0 },
        { type: 'violão', count: 1 },
        { type: 'metais', count: 1 },
        { type: 'percussão', count: 0 }
      ] 
    },
    { 
      title: 'SUPERSTITION', 
      artist: 'STEVIE WONDER', 
      status: 'waiting', 
      slots: [
        { type: 'teclado', count: 1 },
        { type: 'metais', count: 2 },
        { type: 'baixo', count: 1 }
      ] 
    }
  ];

  const handleSelectSlot = (draftIdx: number, slotIdx: number) => {
    setSelectedDraftSlots(prev => ({
      ...prev,
      [draftIdx]: slotIdx
    }));
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full h-full overflow-y-auto px-4 py-6 md:px-10 md:py-8 bg-[#050505] scrollbar-hide pb-32"
    >
      {/* Header Premium */}
      <header className="flex justify-between items-center mb-10 border-b border-white/5 pb-6">
        <div>
          <h1 className="text-white font-oswald font-black italic text-3xl tracking-tighter uppercase leading-none">
            JAM <span className="text-blue-600">DASHBOARD</span>
          </h1>
          <p className="text-gray-500 text-[10px] font-bold tracking-[0.2em] uppercase mt-1">Sessão: Ativa</p>
        </div>
        
        <div className="flex items-center gap-4 border-l border-white/10 pl-6">
          <div className="text-right">
            <p className="text-white font-oswald font-bold text-xs uppercase italic">Convidado</p>
            <p className="text-blue-500 font-black text-[8px] uppercase tracking-widest">Participante</p>
          </div>
          <div className="w-10 h-10 rounded-full border-2 border-blue-600 p-0.5 overflow-hidden shadow-[0_0_15px_rgba(37,99,235,0.3)]">
            <img src="https://picsum.photos/seed/user-jam/100" className="w-full h-full rounded-full object-cover" alt="Profile" />
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto space-y-10">
        
        {/* 1 - NO PALCO AGORA */}
        <section>
          <div className="flex items-center gap-2 mb-3">
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_#10b981]"></span>
            <h2 className="text-gray-400 font-oswald font-bold uppercase tracking-widest text-[10px]">NO PALCO AGORA</h2>
          </div>
          {currentSong && (
            <div className="bg-[#121212] rounded-xl p-6 border-l-[6px] border-emerald-500 shadow-2xl relative overflow-hidden">
              <div className="relative z-10">
                <h3 className="text-white font-oswald font-black italic text-4xl uppercase tracking-tighter leading-tight">
                  {currentSong.title}
                </h3>
                <p className="text-gray-500 font-bold uppercase text-xs tracking-widest mt-1">{currentSong.artist}</p>
              </div>
            </div>
          )}
        </section>

        {/* 2 - MINHA ESCALAÇÃO */}
        <section>
          <h2 className="text-gray-400 font-oswald font-bold uppercase tracking-widest text-[10px] mb-4">MINHA ESCALAÇÃO</h2>
          <div className="space-y-4">
            {userQueue.length > 0 ? userQueue.slice(0, 3).map((song, i) => {
              const userInSong = song.singers[0]; 
              
              return (
                <motion.div 
                  key={song.id} 
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-[#121212] rounded-2xl p-3 flex items-center gap-4 border border-white/5 group hover:border-yellow-500/20 transition-all shadow-lg overflow-hidden"
                >
                  <div className="flex items-stretch shrink-0 gap-1.5">
                    <div className="w-14 h-14 md:w-16 md:h-16 flex items-center justify-center bg-yellow-500 text-black rounded-xl shadow-[inset_0_0_10px_rgba(0,0,0,0.2)]">
                      <span className="font-oswald font-black italic text-2xl md:text-3xl leading-none">#{i + 2}</span>
                    </div>
                    <div className="w-14 h-14 md:w-16 md:h-16 flex items-center justify-center bg-yellow-500/10 border border-yellow-500/30 text-yellow-500 rounded-xl">
                      <InstrumentIcon instrument={userInSong?.instrument || ''} />
                    </div>
                  </div>
                  
                  <div className="flex-grow min-w-0 ml-1">
                    <div className="flex flex-col">
                      <h4 className="text-white font-oswald font-black italic text-xl md:text-3xl truncate uppercase leading-none tracking-tighter mb-1.5 group-hover:text-yellow-500 transition-colors">
                        {song.title}
                      </h4>
                      <p className="text-yellow-500 font-oswald font-bold text-[10px] md:text-sm uppercase tracking-[0.15em] italic">
                        {song.artist}
                      </p>
                    </div>
                  </div>

                  <div className="hidden sm:flex gap-1.5 pr-4 shrink-0">
                     {[1,2,3].map(dot => (
                       <div key={dot} className={`w-2 h-2 rounded-full ${dot <= 2 ? 'bg-yellow-500/60 shadow-[0_0_8px_rgba(234,179,8,0.3)]' : 'bg-white/5'}`}></div>
                     ))}
                  </div>
                </motion.div>
              );
            }) : (
              <div className="border-2 border-dashed border-white/5 rounded-2xl p-10 text-center">
                <p className="text-gray-600 font-oswald uppercase italic tracking-widest text-sm">Nenhuma música na sua fila.</p>
              </div>
            )}
          </div>
        </section>

        {/* 3 - DISPONÍVEIS */}
        <section>
          <div className="flex justify-between items-end mb-4">
            <h2 className="text-gray-400 font-oswald font-bold uppercase tracking-widest text-[10px]">DISPONÍVEIS</h2>
            <span className="text-blue-500 font-black text-[9px] uppercase tracking-widest cursor-pointer hover:underline">VER TODOS</span>
          </div>
          <div className="grid grid-cols-1 gap-4">
            {drafts.map((draft, i) => {
              const selectedIdx = selectedDraftSlots[i];
              const isAnySelected = selectedIdx !== undefined;

              return (
                <div 
                  key={i} 
                  className={`bg-[#121212] border border-white/5 rounded-xl overflow-hidden shadow-xl transition-all group relative ${
                    draft.status === 'waiting' ? 'border-t-4 border-t-yellow-500' : 'border-t-4 border-t-blue-500'
                  }`}
                >
                  <div className="p-5 md:p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-grow min-w-0 pr-4">
                        <h3 className="text-white font-oswald font-black text-2xl md:text-3xl uppercase tracking-tighter leading-none mb-1 group-hover:text-blue-400 transition-colors truncate">
                          {draft.title}
                        </h3>
                        <p className="text-gray-400 text-[10px] md:text-xs font-bold uppercase tracking-widest">{draft.artist}</p>
                      </div>
                      
                      <div className={`px-3 py-1 rounded-md border text-[10px] font-black uppercase tracking-widest leading-none shrink-0 ${
                        draft.status === 'waiting' 
                        ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/30' 
                        : 'bg-blue-500/10 text-blue-500 border-blue-500/30'
                      }`}>
                        {draft.status}
                      </div>
                    </div>

                    <div className="flex items-end justify-between">
                      <div className="flex flex-wrap gap-2 md:gap-3">
                        {draft.slots.map((slot, si) => (
                          <DraftSlot 
                            key={si} 
                            type={slot.type} 
                            count={slot.count} 
                            selected={selectedIdx === si}
                            onSelect={() => handleSelectSlot(i, si)}
                          />
                        ))}
                      </div>

                      <button className={`px-6 md:px-10 py-2.5 rounded-lg text-[11px] font-black uppercase italic tracking-tighter transition-all active:scale-95 shadow-lg ${
                        !isAnySelected 
                        ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                        : draft.status === 'waiting'
                          ? 'bg-yellow-600 hover:bg-yellow-500 text-white shadow-yellow-600/10'
                          : 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-600/10'
                      }`}>
                        {isAnySelected ? 'ENTRAR' : 'ESCOLHA'}
                      </button>
                    </div>
                    
                    <div className="mt-5 w-full h-[1px] bg-white/5"></div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </motion.div>
  );
};

export default UserDashboard;
