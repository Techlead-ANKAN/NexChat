import { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useAuthStore } from "./store/useAuthStore";
import { useThemeStore } from "./store/useThemeStore";

// Layout
import Navbar from "./components/layout/Navbar";
import LoadingSpinner from "./components/ui/LoadingSpinner";

// Pages
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import ProfilePage from "./pages/ProfilePage";
import SettingsPage from "./pages/SettingsPage";
import AdminDashboard from "./pages/AdminDashboard";

function AppContent() {
  const { authUser, checkAuth, isCheckingAuth } = useAuthStore();
  const { initTheme } = useThemeStore();
  const location = useLocation();

  // Only check auth on protected routes
  const isPublicRoute = ['/login', '/signup'].includes(location.pathname);

  useEffect(() => {
    initTheme();
    // Only check auth if not on public routes
    if (!isPublicRoute) {
      checkAuth();
    }
  }, [checkAuth, initTheme, isPublicRoute]);

  // Show loading only on protected routes
  if (isCheckingAuth && !authUser && !isPublicRoute) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-wild-950 via-nature-950 to-wild-900 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-wild-950 via-nature-950 to-wild-900 nature-pattern">
      <Navbar />
      
      <main className="pt-20">
        <Routes>
          <Route 
            path="/" 
            element={authUser ? <HomePage /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/signup" 
            element={!authUser ? <SignUpPage /> : <Navigate to="/" />} 
          />
          <Route 
            path="/login" 
            element={!authUser ? <LoginPage /> : <Navigate to="/" />} 
          />
          <Route 
            path="/profile" 
            element={authUser ? <ProfilePage /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/settings" 
            element={authUser ? <SettingsPage /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/admin" 
            element={authUser && authUser.role === "admin" ? <AdminDashboard /> : <Navigate to="/" />} 
          />
        </Routes>
      </main>

      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: 'hsl(20 14.3% 4.1%)',
            color: 'hsl(60 9.1% 97.8%)',
            border: '1px solid hsl(142 76% 36%)',
          },
          success: {
            iconTheme: {
              primary: 'hsl(142 76% 36%)',
              secondary: 'hsl(60 9.1% 97.8%)',
            },
          },
          error: {
            iconTheme: {
              primary: 'hsl(0 62.8% 30.6%)',
              secondary: 'hsl(60 9.1% 97.8%)',
            },
          },
        }}
      />
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
