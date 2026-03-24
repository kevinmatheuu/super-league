import Lottie from 'lottie-react';
import footballAnimation from '../assets/football-loader.json';
import { Loader2 } from 'lucide-react';

export function Loader({ 
  text = "Loading...", 
  fullScreen = false, 
  variant = 'spinner', // 'spinner' | 'football'
  className = "" 
}) {
  return (
    <div className={`flex flex-col items-center justify-center ${fullScreen ? "min-h-[60vh]" : "p-8 w-full h-full"} ${className}`}>
      {variant === 'football' ? (
        <div className="w-24 h-24 mb-4 drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]">
          <Lottie animationData={footballAnimation} loop={true} />
        </div>
      ) : (
        <Loader2 className="w-8 h-8 md:w-12 md:h-12 mb-4 animate-spin text-white/20" />
      )}
      
      {text && (
        <span className={`font-black tracking-[0.3em] uppercase animate-pulse ${variant === 'football' ? 'text-xl sm:text-2xl text-white/90' : 'text-xs sm:text-sm text-zinc-500'}`}>
          {text}
        </span>
      )}
    </div>
  );
}
