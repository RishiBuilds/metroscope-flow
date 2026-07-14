import { createBrowserRouter, RouterProvider, Outlet, useLocation } from 'react-router';
import { motion, AnimatePresence, MotionConfig } from 'motion/react';
import { AuthProvider } from './context/AuthContext.jsx';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import ErrorBoundary from './components/ErrorBoundary.jsx';
import { ToastProvider } from './components/ui.jsx';
import { EASE } from './lib/motion.js';

import HomePage from './pages/HomePage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import SignupPage from './pages/SignupPage.jsx';
import ComparePage from './pages/ComparePage.jsx';
import SavedPage from './pages/SavedPage.jsx';
import ProfilePage from './pages/ProfilePage.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';
import VisaPredictorPage from './pages/VisaPredictorPage.jsx';
import VisaTimelinePage from './pages/VisaTimelinePage.jsx';
import CultureGuidePage from './pages/CultureGuidePage.jsx';
import ChecklistPage from './pages/ChecklistPage.jsx';

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
        <Outlet />
      </motion.div>
    </AnimatePresence>
  );
}

function RootLayout() {
  return (
    <AuthProvider>
      <ToastProvider>
      <ErrorBoundary>
        <a href="#main-content" className="skip-link">Skip to main content</a>
        <div className="flex flex-col min-h-dvh">
          <Navbar />
          <div id="main-content" tabIndex={-1} className="flex flex-col flex-1 focus:outline-none">
            <AnimatedOutlet />
          </div>
          <Footer />
        </div>
      </ErrorBoundary>
      </ToastProvider>
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
