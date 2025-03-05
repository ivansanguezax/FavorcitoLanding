import { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useNavigate,
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
  const navigate = useNavigate();

  // Este useEffect impedirá que un usuario registrado vuelva a la página de registro
  useEffect(() => {
    // Si el usuario ya está registrado y trata de acceder a la ruta de registro
    if (currentUser && userExists) {
      // Reemplazar la entrada en el historial para que no pueda volver al formulario
      navigate("/dashboard", { replace: true });
    }
  }, [currentUser, userExists, navigate]);

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

const NavigationController = () => {
  const { currentUser, userExists } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handlePopState = () => {
      if (currentUser && userExists) {
        const restrictedPaths = ["/estudiante", "/auth"];
        const currentPath = window.location.pathname;

        if (restrictedPaths.some((path) => currentPath.includes(path))) {
          navigate("/dashboard", { replace: true });
        }
      }
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [currentUser, userExists, navigate]);

  return null;
};

function AppWithAuth() {
  const { currentUser, userExists } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleNavigation = () => {
      const isRegistrationPage =
        window.location.pathname.includes("/estudiante");

      if (isRegistrationPage && currentUser && userExists) {
        navigate("/dashboard", { replace: true });
      }
    };

    handleNavigation();

    window.addEventListener("popstate", handleNavigation);

    return () => {
      window.removeEventListener("popstate", handleNavigation);
    };
  }, [currentUser, userExists, navigate]);

  return (
    <>
      <NavigationController />
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
    </>
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
