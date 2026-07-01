// features/splash/viewModels/useSplashViewModel.ts
// ViewModel: manages the 2–3s boot timer then signals readiness

import { useState, useEffect } from 'react';

interface SplashViewModel {
  isReady: boolean;
}

export const useSplashViewModel = (): SplashViewModel => {
  const [isReady, setIsReady] = useState<boolean>(false);

  useEffect(() => {
    // Auto-route to /welcome after 2.5 seconds
    const timer = setTimeout(() => {
      setIsReady(true);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  return { isReady };
};
