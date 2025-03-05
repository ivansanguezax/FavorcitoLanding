import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { MainLayout } from "./layout/MainLayout";
import { FormStudentsLayout } from "./layout/FormStudentsLayout";
import { HelmetProvider } from "react-helmet-async";
import NotFound from "./components/Main/NotFound";
import { AuthProvider } from "./context/AuthContext";
import Dashboard from "./layout/DashboardLayout";
import { useAuth } from "./context/AuthContext";
import AuthPage from "./layout/AuthPage";
import PropTypes from "prop-types";

const PrivateRoute = ({ children }) => {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-slate-100">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-primary-dark"></div>
      </div>
    );
  }

  if (!currentUser) {
    return <Navigate to="/auth" replace />;
  }

  return children;
};

PrivateRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

const RegisterRoute = ({ children }) => {
  const { currentUser, userExists, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-slate-100">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-primary-dark"></div>
      </div>
    );
  }

  if (currentUser && userExists) {
    return <Navigate to="/dashboard" replace />;
  }

  if (!currentUser) {
    return <Navigate to="/auth" replace />;
  }

  return children;
};

RegisterRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

const HomeRoute = ({ children }) => {
  const { currentUser, userExists, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-slate-100">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-primary-dark"></div>
      </div>
    );
  }

  if (currentUser && userExists) {
    return <Navigate to="/dashboard" replace />;
  }

  if (currentUser && !userExists) {
    return <Navigate to="/estudiante" replace />;
  }

  return children;
};

HomeRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

function AppWithAuth() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <HomeRoute>
            <MainLayout />
          </HomeRoute>
        }
      />

      <Route path="/auth" element={<AuthPage />} />

      <Route
        path="/estudiante/*"
        element={
          <RegisterRoute>
            <FormStudentsLayout />
          </RegisterRoute>
        }
      />

      <Route
        path="/dashboard/*"
        element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        }
      />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

function App() {
  return (
    <HelmetProvider>
      <Router>
        <AuthProvider>
          <AppWithAuth />
        </AuthProvider>
      </Router>
    </HelmetProvider>
  );
}

export default App;
