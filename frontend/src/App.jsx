import { lazy, Suspense } from 'react';
import { createBrowserRouter, RouterProvider, Outlet, useLocation } from 'react-router';
import { motion, AnimatePresence, MotionConfig } from 'motion/react';
import { AuthProvider } from './context/AuthContext.jsx';
import { CurrencyProvider } from './context/CurrencyContext.jsx';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import ErrorBoundary from './components/ErrorBoundary.jsx';
import { ToastProvider } from './components/ui.jsx';
import { EASE } from './lib/motion.js';

import HomePage from './pages/HomePage.jsx';

const LoginPage = lazy(() => import('./pages/LoginPage.jsx'));
const SignupPage = lazy(() => import('./pages/SignupPage.jsx'));
const ComparePage = lazy(() => import('./pages/ComparePage.jsx'));
const SavedPage = lazy(() => import('./pages/SavedPage.jsx'));
const ProfilePage = lazy(() => import('./pages/ProfilePage.jsx'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage.jsx'));
const VisaPredictorPage = lazy(() => import('./pages/VisaPredictorPage.jsx'));
const VisaTimelinePage = lazy(() => import('./pages/VisaTimelinePage.jsx'));
const CultureGuidePage = lazy(() => import('./pages/CultureGuidePage.jsx'));
const ChecklistPage = lazy(() => import('./pages/ChecklistPage.jsx'));
const SharePage = lazy(() => import('./pages/SharePage.jsx'));
const DiscoverPage = lazy(() => import('./pages/DiscoverPage.jsx'));

function PageFallback() {
  return (
    <div className="flex-1 flex items-center justify-center min-h-[50vh]">
      <div className="w-8 h-8 border-2 border-brand-400/30 border-t-brand-400 rounded-full animate-spin" />
    </div>
  );
}

function AnimatedOutlet() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={location.key}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25, ease: EASE }}
        style={{ display: 'contents' }}
      >
        <Suspense fallback={<PageFallback />}>
          <Outlet />
        </Suspense>
      </motion.div>
    </AnimatePresence>
  );
}

function RootLayout() {
  return (
    <AuthProvider>
      <CurrencyProvider>
        <ToastProvider>
        <ErrorBoundary>
          <a href="#main-content" className="skip-link">Skip to main content</a>
          <div className="flex flex-col min-h-dvh relative">
            <div className="bg-mesh-glow" aria-hidden="true" />
            <Navbar />
            <div id="main-content" tabIndex={-1} className="flex flex-col flex-1 focus:outline-none">
              <AnimatedOutlet />
            </div>
            <Footer />
          </div>
        </ErrorBoundary>
        </ToastProvider>
      </CurrencyProvider>
    </AuthProvider>
  );
}

const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      { path: '/',        element: <HomePage /> },
      { path: '/login',   element: <LoginPage /> },
      { path: '/signup',  element: <SignupPage /> },
      { path: '/compare', element: <ComparePage /> },

      {
        path: '/saved',
        element: (
          <ProtectedRoute>
            <SavedPage />
          </ProtectedRoute>
        ),
      },
      {
        path: '/profile',
        element: (
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        ),
      },
      { path: '/visa-predictor', element: <ProtectedRoute><VisaPredictorPage /></ProtectedRoute> },
      { path: '/visa-timeline', element: <ProtectedRoute><VisaTimelinePage /></ProtectedRoute> },
      { path: '/culture-guide', element: <ProtectedRoute><CultureGuidePage /></ProtectedRoute> },
      { path: '/checklist', element: <ProtectedRoute><ChecklistPage /></ProtectedRoute> },
      { path: '/share/:token', element: <SharePage /> },
      { path: '/discover', element: <DiscoverPage /> },

      { path: '*', element: <NotFoundPage /> },
    ],
  },
]);

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <RouterProvider router={router} />
    </MotionConfig>
  );
}
