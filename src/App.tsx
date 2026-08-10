// App.tsx — Router shell + lazy-loaded page routes
// All page-level views are lazy-loaded per MVVM convention

import { lazy, Suspense, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ensureCurrentUserLoaded } from './shared/models/authService';

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
const PrayerHistoryView = lazy(
  () => import('./features/prayer-wall/views/PrayerHistoryView')
);

// ── Minimal loading fallback ───────────────────────────────
const PageLoader: React.FC = () => (
  <div className="w-full max-w-md min-h-dvh bg-white flex flex-col relative ring-1 ring-black/4 shadow-card">
    <div className="flex-1 flex flex-col items-center justify-center py-12 px-6 pb-[calc(3rem+env(safe-area-inset-bottom))] bg-white">
      <div className="inline-block w-9 h-9 border-[3px] border-navy/15 border-t-navy rounded-full animate-spin" aria-label="Loading" />
    </div>
  </div>
);

// ── App ────────────────────────────────────────────────────
function App() {
  // Rehydrate the in-memory user id from the session cookie after a page reload.
  useEffect(() => {
    ensureCurrentUserLoaded();
  }, []);

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

          {/* Dashboard and Main Navigation */}
          <Route path="/home" element={<AppShell />} />
          <Route path="/services" element={<AppShell />} />
          <Route path="/prayer-wall" element={<AppShell />} />
          <Route path="/content" element={<AppShell />} />
          <Route path="/giving" element={<AppShell />} />
          <Route path="/chat" element={<AppShell />} />

          {/* Profile and Sub-pages */}
          <Route path="/profile" element={<AppShell />} />
          <Route path="/find-my-church" element={<AppShell />} />
          <Route path="/account-information" element={<AppShell />} />
          <Route path="/edit-profile-picture" element={<AppShell />} />
          <Route path="/security" element={<AppShell />} />
          <Route path="/change-email" element={<AppShell />} />
          <Route path="/verify-email" element={<AppShell />} />
          <Route path="/change-number" element={<AppShell />} />
          <Route path="/verify-number" element={<AppShell />} />
          <Route path="/change-password" element={<AppShell />} />
          <Route path="/privacy-policy" element={<AppShell />} />
          <Route path="/notifications" element={<AppShell />} />
          <Route path="/help" element={<AppShell />} />
          <Route path="/church-profile" element={<AppShell />} />
          <Route path="/select-church" element={<AppShell />} />
          <Route path="/booking" element={<AppShell />} />
          <Route path="/booking-schedule" element={<AppShell />} />

          {/* Prayer request composer */}
          <Route path="/prayer-request" element={<CreatePrayerView />} />
          <Route path="/prayer/:prayerId" element={<PrayerDetailsView />} />
          <Route path="/prayer-history" element={<PrayerHistoryView />} />

          {/* Fallback — redirect any unknown route to splash */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
