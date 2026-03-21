import React, { useEffect, useState } from 'react';
import { useLeague } from '../context/LeagueContext';
import { ArrowLeft, Loader2, Shield, Hexagon } from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

const getStatColor = (val) => {
  if (val >= 80) return 'bg-[#00e676]';
  if (val >= 70) return 'bg-[#ffc400]';
  if (val >= 60) return 'bg-[#ff9100]';
  return 'bg-[#ff1744]';
};

// Simplified fallback data
const defaultAttributes = {
  bio: { preferredFoot: "Right" },
  stats: {
    Pace: { total: 0 },
    Shooting: { total: 0 },
    Passing: { total: 0 },
    Dribbling: { total: 0 },
    Defending: { total: 0 },
    Physicality: { total: 0 }
  },
  playStyles: []
};

export default function PlayerProfile() {
  const { setView } = useLeague();
  const [player, setPlayer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const raw = sessionStorage.getItem('selectedPlayer');
    if (!raw) { setView('teams'); return; }

    const base = JSON.parse(raw);

    fetch(`${API_BASE_URL}/players/${base.id}`)
      .then(r => r.json())
      .then(res => {
        if (res.success) setPlayer(res.data);
        else setError('Failed to load player.');
      })
      .catch(() => setError('Failed to load player.'))
      .finally(() => setLoading(false));
  }, []);

  const handleBack = () => {
    sessionStorage.removeItem('selectedPlayer');
    setView('teams'); 
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-zinc-500 animate-pulse space-y-4">
        <Loader2 className="w-12 h-12 animate-spin text-white/20" />
        <span className="font-black tracking-[0.3em] uppercase text-sm">Loading Player...</span>
      </div>
    );
  }

  if (error || !player) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-zinc-500 space-y-4">
        <Shield className="w-12 h-12 text-zinc-700" />
        <span className="font-black tracking-[0.3em] uppercase text-sm">{error || 'Player not found'}</span>
        <button onClick={handleBack} className="text-xs text-zinc-400 hover:text-white uppercase tracking-widest font-bold transition-colors">
          Back to Teams
        </button>
      </div>
    );
  }

  const attrs = player.attributes || defaultAttributes;
  const stats = attrs.stats || defaultAttributes.stats;
  const bio = attrs.bio || defaultAttributes.bio;
  const styles = attrs.playStyles || [];

  return (
    <div className="w-full bg-[#0F0E13] min-h-screen text-white p-4 md:p-8 font-sans pb-20 animate-in fade-in duration-300">
      
      <button onClick={handleBack} className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-6 group">
        <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
        Back to Squad
      </button>

      <div className="flex flex-col xl:flex-row gap-8 max-w-7xl mx-auto">
        
        {/* LEFT COLUMN: The Gold Card & Bio */}
        <div className="flex flex-col lg:flex-row xl:flex-col gap-6 w-full xl:w-1/3">
          
          <div className="flex gap-6 items-start">
            {/* The Gold Card */}
            <div className="w-48 h-64 rounded-xl bg-gradient-to-br from-[#E8C881] via-[#C9A050] to-[#966E2D] p-1 shadow-2xl relative overflow-hidden shrink-0 flex flex-col items-center">
              
              {/* Rating & Position */}
              <div className="absolute top-3 left-3 flex flex-col items-center text-[#2A1E04]">
                <span className="text-3xl font-black leading-none">{player.overall_rating || 50}</span>
                <span className="text-sm font-bold">{player.position || 'RES'}</span>
              </div>
              
              {/* Centered & Shrunk Player Image */}
              <div className="absolute inset-0 flex items-center justify-center pt-4">
                {player.image_url ? (
                   <img src={player.image_url} alt={player.name} className="w-28 h-28 object-contain drop-shadow-xl" />
                ) : (
                   <Shield className="w-20 h-20 text-[#2A1E04]/30" />
                )}
              </div>
             
              {/* Bottom Base Stats */}
              <div className="absolute bottom-2 w-full flex justify-center gap-2 text-[#2A1E04] font-bold text-[10px] uppercase">
                <div className="flex flex-col items-center"><span>PAC</span><span>{stats.Pace?.total || 0}</span></div>
                <div className="flex flex-col items-center"><span>SHO</span><span>{stats.Shooting?.total || 0}</span></div>
                <div className="flex flex-col items-center"><span>PAS</span><span>{stats.Passing?.total || 0}</span></div>
                <div className="flex flex-col items-center"><span>DRI</span><span>{stats.Dribbling?.total || 0}</span></div>
                <div className="flex flex-col items-center"><span>DEF</span><span>{stats.Defending?.total || 0}</span></div>
                <div className="flex flex-col items-center"><span>PHY</span><span>{stats.Physicality?.total || 0}</span></div>
              </div>
            </div>

            {/* Name Details */}
            <div className="flex flex-col mt-4">
              <span className="text-3xl font-bold text-gray-300 leading-tight">{player.first_name}</span>
              <span className="text-5xl font-black leading-none">{player.last_name}</span>
            </div>
          </div>

          {/* Bio Data Panel (Stripped down to just 2 fields) */}
          <div className="bg-[#1A1820] rounded-2xl p-6 grid grid-cols-2 gap-y-6 border border-white/5">
            <div>
              <p className="text-xs text-gray-400 mb-1">Position</p>
              <span className="bg-white/10 px-2 py-1 rounded text-sm font-bold">{player.position || '—'}</span>
            </div>
            <div>
              <p className="text-xs text-gray-400 mb-1">Preferred Foot</p>
              <p className="font-bold">{bio.preferredFoot || 'Right'}</p>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: The Main 6 Attributes & Playstyles */}
        <div className="flex-1 flex flex-col gap-6">
          <div className="bg-[#1A1820] rounded-2xl p-6 border border-white/5">
            <h3 className="text-xl font-black uppercase tracking-widest mb-6 border-b border-white/10 pb-4">Core Attributes</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
              {['Pace', 'Shooting', 'Passing', 'Dribbling', 'Defending', 'Physicality'].map(category => {
                // Handle missing stats safely
                const val = stats[category]?.total || 0;
                
                return (
                  <div key={category} className="flex flex-col gap-2 text-sm">
                    <div className="flex justify-between text-gray-300 font-bold uppercase tracking-wider">
                      <span>{category}</span>
                      <span className="text-white text-lg">{val}</span>
                    </div>
                    {/* Progress Line */}
                    <div className="w-full h-1.5 bg-gray-700 rounded-full overflow-hidden">
                      <div className={`h-full ${getStatColor(val)}`} style={{ width: `${val}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* PlayStyles Section */}
          {styles.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {styles.map(style => (
                <div key={style.name} className="bg-[#1A1820] rounded-xl p-5 border border-white/5 flex flex-col gap-2 hover:bg-white/5 transition-colors">
                  <div className="flex items-center gap-2">
                    <Hexagon size={20} className="text-[#E8C881]" />
                    <span className="font-bold uppercase tracking-widest text-[#E8C881]">{style.name}</span>
                  </div>
                  {/* description fallback just in case your database schema used a different key */}
                  <p className="text-sm text-gray-400 leading-relaxed mt-1">
                    {style.description || style.desc || `Grants the player unique capabilities and precision regarding ${style.name.toLowerCase()} mechanics on the pitch.`}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}