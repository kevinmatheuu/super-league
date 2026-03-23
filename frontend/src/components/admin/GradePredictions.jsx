import React, { useState } from 'react';
import { useApi } from '../../hooks/useApi';
import { Calculator, Loader2, CheckCircle } from 'lucide-react';
import { supabase } from '../../lib/supabase';

export default function GradePredictions() {
  const [division, setDivision] = useState('mens');
  // Fetch ONLY completed matches
  const { data: resp, refetch, loading: fetchLoading } = useApi(`/admin/matches?status=completed&division=${division}`);
  const matches = resp?.data || [];
  
  const [gradingId, setGradingId] = useState(null);

  const handleGrade = async (matchId, matchName) => {
    if (!confirm(`Are you sure you want to grade predictions for ${matchName}?`)) return;
    
    setGradingId(matchId);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const API_URL = import.meta.env.VITE_API_URL || '/api';
      
      const res = await fetch(`${API_URL}/admin/predictions/grade`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${session?.access_token}` },
        body: JSON.stringify({ match_id: matchId })
      });
      
      const result = await res.json();
      if (result.success) {
        alert("✅ " + result.message);
      } else {
        alert("❌ Error: " + result.message);
      }
    } catch (err) {
      console.error(err);
      alert("Grading failed. Check console.");
    } finally {
      setGradingId(null);
    }
  };

  return (
    <div className="p-6 space-y-8 animate-in fade-in duration-500">
      
      <div className="flex justify-center mb-4">
        <div className="bg-black/50 p-1 rounded-full border border-white/10 flex">
          <button onClick={() => setDivision('mens')} className={`px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest transition-all ${division === 'mens' ? 'bg-white text-black' : 'text-zinc-500 hover:text-white'}`}>Men's</button>
          <button onClick={() => setDivision('womens')} className={`px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest transition-all ${division === 'womens' ? 'bg-white text-black' : 'text-zinc-500 hover:text-white'}`}>Women's</button>
        </div>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 sm:p-8">
        <div className="flex items-center gap-3 mb-6 border-b border-white/10 pb-4">
          <Calculator className="text-[#E8C881]" size={24} />
          <div>
            <h2 className="text-xl font-black uppercase tracking-widest text-white">Grade Fantasy Predictions</h2>
            <p className="text-zinc-400 text-xs font-bold uppercase tracking-widest mt-1">Run point calculations for completed matches</p>
          </div>
        </div>

        {fetchLoading ? (
           <div className="flex justify-center py-10"><Loader2 className="animate-spin text-zinc-500" /></div>
        ) : matches.length === 0 ? (
          <div className="text-center py-12 border border-white/5 rounded-2xl bg-black/40">
            <span className="text-zinc-500 font-bold uppercase tracking-widest text-sm">No completed matches to grade.</span>
          </div>
        ) : (
          <div className="space-y-4">
            {matches.map(m => (
              <div key={m.id} className="bg-black/50 border border-white/10 rounded-xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-white/5 transition-colors">
                
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <span className="text-[10px] bg-green-500/20 text-green-400 px-2 py-0.5 rounded uppercase font-black tracking-widest">Completed</span>
                    <span className="text-xs text-zinc-500 font-mono">{new Date(m.date).toLocaleDateString()}</span>
                  </div>
                  <h3 className="text-lg font-black text-white">
                    {m.home_team_name} <span className="text-[#E8C881] mx-1">{m.home_score} - {m.away_score}</span> {m.away_team_name}
                  </h3>
                </div>

                <button 
                  onClick={() => handleGrade(m.id, `${m.home_team_name} vs ${m.away_team_name}`)}
                  disabled={gradingId !== null}
                  className="flex items-center justify-center gap-2 bg-[#E8C881] hover:bg-[#F9D992] text-black px-6 py-3 rounded-lg font-black uppercase tracking-widest text-xs transition-colors disabled:opacity-50 min-w-[180px]"
                >
                  {gradingId === m.id ? (
                    <><Loader2 size={16} className="animate-spin" /> Calculating...</>
                  ) : (
                    <><Calculator size={16} /> Grade Match</>
                  )}
                </button>

              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}