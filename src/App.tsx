// App.tsx — Router shell + lazy-loaded page routes
// All page-level views are lazy-loaded per MVVM convention

import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// ── Lazy-loaded page views ─────────────────────────────────
const AppShell = lazy(
  () => import('./features/shell/views/AppShell')
);
const SplashScreen = lazy(
  () => import('./features/splash/views/SplashScreen')
);
const WelcomePage = lazy(
  () => import('./features/welcome/views/WelcomePage')
);
const LoginPage = lazy(
  () => import('./features/auth/views/LoginPage')
);

const RegisterPage = lazy(
  () => import('./features/register/views/RegisterPage')
);
const CreatePrayerView = lazy(
  () => import('./features/prayer-wall/views/CreatePrayerView')
);
const PrayerDetailsView = lazy(
  () => import('./features/prayer-wall/views/PrayerDetailsView')
);

// ── Minimal loading fallback ───────────────────────────────
const PageLoader: React.FC = () => (
  <div className="w-full max-w-[448px] min-h-dvh bg-white flex flex-col relative ring-1 ring-black/4 shadow-card">
    <div className="flex-1 flex flex-col items-center justify-center py-12 px-6 pb-[calc(3rem+env(safe-area-inset-bottom))] bg-white">
      <div className="inline-block w-9 h-9 border-[3px] border-navy/15 border-t-navy rounded-full animate-spin" aria-label="Loading" />
    </div>
  </div>
);

// ── App ────────────────────────────────────────────────────
function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* Step 1: Splash — auto-routes to /welcome */}
          <Route path="/" element={<SplashScreen />} />

          {/* Step 2: Welcome / Landing */}
          <Route path="/welcome" element={<WelcomePage />} />

          {/* Step 3a: Login via Email */}
          <Route path="/login" element={<LoginPage />} />

          {/* Step 3b: Registration */}
          <Route path="/register" element={<RegisterPage />} />

          {/* Step 4: Dashboard (post-auth / guest) */}
          <Route path="/dashboard" element={<AppShell />} />

          {/* Prayer request composer */}
          <Route path="/prayer-request" element={<CreatePrayerView />} />
          <Route path="/prayer/:prayerId" element={<PrayerDetailsView />} />

          {/* Fallback — redirect any unknown route to splash */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
