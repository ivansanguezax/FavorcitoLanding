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
import IncomeCalculatorPage from "./layout/IncomeCalculatorPage";
import PropTypes from "prop-types";
import Loader from "./components/Main/Loader";

const PrivateRoute = ({ children }) => {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return <Loader />;
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

  useEffect(() => {
    if (currentUser && userExists) {
      navigate("/dashboard", { replace: true });
    }
  }, [currentUser, userExists, navigate]);

  if (loading) {
    return <Loader />;
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
    return <Loader />;
  }

  if (currentUser && userExists) {
    return <Navigate to="/dashboard" replace />;
  }

  if (currentUser && !userExists) {
    return <Navigate to="/registro" replace />;
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
        const restrictedPaths = ["/auth", "/registro", "/unete", "/comienza"];
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
        window.location.pathname.includes("/registro") ||
        window.location.pathname.includes("/unete") ||
        window.location.pathname.includes("/comienza");

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
        
        {/* Ruta para la calculadora de ingresos */}
        <Route path="/calculadora" element={<IncomeCalculatorPage />} />

        {/* Rutas de registro */}
        <Route
          path="/registro/*"
          element={
            <RegisterRoute>
              <FormStudentsLayout />
            </RegisterRoute>
          }
        />

        <Route
          path="/unete/*"
          element={
            <RegisterRoute>
              <FormStudentsLayout />
            </RegisterRoute>
          }
        />

        <Route
          path="/comienza/*"
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