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
    <div className="w-full max-w-[448px] min-h-dvh bg-white flex flex-col relative ring-1 ring-black/4 shadow-card">
      <div className="flex-1 flex flex-col items-center justify-center py-12 px-6 pb-[calc(3rem+env(safe-area-inset-bottom))] bg-white">
        <div className="animate-splash-pop">
          <TeleoLogo size={140} />
        </div>
      </div>
    </div>
  );
};

export default SplashScreen;
