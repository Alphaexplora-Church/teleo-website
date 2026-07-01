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
    <div className="teleo-shell">
      <div className="splash-container">
        <div className="splash-logo-wrapper">
          <TeleoLogo size={140} />
        </div>
      </div>
    </div>
  );
};

export default SplashScreen;
