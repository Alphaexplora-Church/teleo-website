// features/splash/views/SplashScreen.tsx
// View: Splash screen — white canvas, centered logo, auto-transitions to /welcome

import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TeleoLogo from '../../../shared/components/TeleoLogo';
import { useSplashViewModel } from '../viewModels/useSplashViewModel';

const SplashScreen: React.FC = () => {
  const { isReady } = useSplashViewModel();
  const navigate = useNavigate();

  // Navigate to welcome when the timer fires
  useEffect(() => {
    if (isReady) {
      navigate('/welcome', { replace: true });
    }
  }, [isReady, navigate]);

  return (
    <div className="w-full min-h-dvh flex items-center justify-center bg-[#001739] lg:bg-[#001739]">
      {/* Subtle radial glow behind the logo */}
      <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(255,255,255,0.06) 0%, transparent 70%)' }} />
      <div className="animate-splash-pop flex flex-col items-center gap-4 relative z-10">
        <TeleoLogo size={140} />
        <span className="text-[28px] font-black tracking-[8px] text-white/90 leading-none font-sans">TELEO</span>
      </div>
    </div>
  );
};

export default SplashScreen;
