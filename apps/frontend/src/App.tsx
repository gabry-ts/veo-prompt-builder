import { Toaster } from 'react-hot-toast';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import DashboardPage from './pages/DashboardPage';
import LoginPage from './pages/LoginPage';
import ProfilePage from './pages/ProfilePage';
import PromptEditorPage from './pages/PromptEditorPage';
import AdminPage from './pages/AdminPage';
import SharedPromptPage from './pages/SharedPromptPage';
import { useAuthStore } from './store/authStore';

function PrivateRoute({ children }: { children: React.ReactNode }): JSX.Element {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
}

function AdminRoute({ children }: { children: React.ReactNode }): JSX.Element {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (user?.role !== 'ADMIN') {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}

function PublicRoute({ children }: { children: React.ReactNode }): JSX.Element {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  return !isAuthenticated ? <>{children}</> : <Navigate to="/dashboard" replace />;
}

function App(): JSX.Element {
  return (
    <BrowserRouter>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
            borderRadius: '12px',
            padding: '16px',
          },
          success: {
            iconTheme: {
              primary: '#10b981',
              secondary: '#fff',
            },
            style: {
              background: 'rgba(236, 253, 245, 0.95)',
              border: '1px solid #6ee7b7',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
            style: {
              background: 'rgba(254, 242, 242, 0.95)',
              border: '1px solid #fca5a5',
            },
          },
          loading: {
            style: {
              background: 'rgba(239, 246, 255, 0.95)',
              border: '1px solid #93c5fd',
            },
          },
        }}
      />
      <Routes>
        <Route
          path="/login"
          element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          }
        />
        <Route path="/shared/:token" element={<SharedPromptPage />} />
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Layout />
            </PrivateRoute>
          }
        >
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="prompts/new" element={<PromptEditorPage />} />
          <Route path="prompts/:id" element={<PromptEditorPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route
            path="admin"
            element={
              <AdminRoute>
                <AdminPage />
              </AdminRoute>
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
