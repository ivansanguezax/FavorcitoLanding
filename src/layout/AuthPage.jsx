import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "primereact/button";
import { useAuth } from "../context/AuthContext";
import { Mixpanel } from "../services/mixpanel";

const AuthPage = () => {
  const { currentUser, userExists, loading, signInWithGoogle } = useAuth();
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [authLoading, setAuthLoading] = useState(false);

  const carouselData = [
    {
      title: "Te ayudamos con tu mudanza",
      description:
        "¡Mudarte nunca fue tan fácil! Estudiantes experimentados te ayudarán a empacar, cargar y organizar tus pertenencias.",
      image:
        "https://res.cloudinary.com/dfgjenml4/image/upload/v1738017524/mudanza_de_taman%CC%83o_mediano_oi6ajn.png",
    },
    {
      title: "Chef a domicilio para tus eventos",
      description:
        "Estudiantes de gastronomía a tu servicio. Prepara tu evento especial con chefs estudiantes talentosos.",
      image:
        "https://res.cloudinary.com/dfgjenml4/image/upload/v1738017523/cocina_de_taman%CC%83o_mediano_mz4mwo.png",
    },
    {
      title: "Mantenimiento de tu carro",
      description:
        "Mecánicos en formación a tu alcance. Estudiantes de mecánica automotriz te ayudan con el mantenimiento básico de tu carro.",
      image:
        "https://res.cloudinary.com/dfgjenml4/image/upload/v1738017524/mecanico_de_taman%CC%83o_mediano_daqfyg.png",
    },
    {
      title: "Limpieza profesional de tu auto",
      description:
        "Tu auto brillará como nuevo. Servicio de lavado y detallado por estudiantes comprometidos.",
      image:
        "https://res.cloudinary.com/dfgjenml4/image/upload/v1738017524/lavar_de_taman%CC%83o_mediano_tupp47.png",
    },
    {
      title: "Diseño y desarrollo web personalizado",
      description:
        "Tu presencia digital en manos expertas. Estudiantes de programación crearán tu sitio web con las últimas tecnologías.",
      image:
        "https://res.cloudinary.com/dfgjenml4/image/upload/v1738017524/web_de_taman%CC%83o_mediano_i9vfw7.png",
    },
    {
      title: "Soluciones para el hogar",
      description:
        "Resuelve cualquier problema del hogar. Estudiantes multifacéticos para reparaciones, instalaciones y mantenimiento general.",
      image:
        "https://res.cloudinary.com/dfgjenml4/image/upload/v1738017523/luz_de_taman%CC%83o_mediano_nvzogf.png",
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselData.length);
    }, 8000);
    return () => clearInterval(interval);
  }, [carouselData.length]);

  useEffect(() => {
    if (!loading) {
      if (currentUser) {
        if (userExists) {
          navigate("/dashboard");
        } else {
          navigate("/estudiante");
        }
      }
    }
  }, [currentUser, userExists, loading, navigate]);

  const handleLoginWithGoogle = async (isRegistration = false) => {
    try {
      setAuthLoading(true);
      Mixpanel.track(
        isRegistration ? "Register_Attempt_Landing" : "Login_Success_Landing"
      );

      const user = await signInWithGoogle();

      if (user) {
        Mixpanel.track("Google_Login_Success", {
          email: user.email,
        });

        if (isRegistration) {
          navigate("/estudiante");
        }
      }
    } catch (error) {
      console.error("Login error:", error);
      Mixpanel.track("Google_Login_Error", {
        error: error.message,
      });
    } finally {
      setAuthLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-neutral-100">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-primary-dark"></div>
      </div>
    );
  }

  const renderCarouselIndicators = () => {
    return (
      <div className="flex space-x-2 mt-6">
        {carouselData.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              currentSlide === index ? "bg-white w-6" : "bg-white/40"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="flex flex-col md:flex-row h-screen w-full overflow-hidden bg-white md:bg-white">
      {/* Mobile Layout (only visible on mobile) */}
      <div className="md:hidden flex flex-col h-screen bg-neutral-100">
        {/* Top image carousel - 60% of screen height */}
        <div className="h-[60%] relative overflow-hidden bg-neutral-800">
          <div className="absolute inset-0 transition-opacity duration-1000">
            <img
              src={carouselData[currentSlide].image}
              alt={carouselData[currentSlide].title}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Bottom auth content with curved top and shadow */}
        <div className="h-[50%] flex flex-col px-6 bg-primary-dark rounded-t-3xl shadow-xl relative -mt-4 z-10">
          {/* Logo */}
          <div className="flex justify-center mt-8 mb-6">
            <img
              src="https://res.cloudinary.com/dfgjenml4/image/upload/v1737657600/logoLigth_gbv7ds.png"
              alt="Favorcito Logo"
              className="h-6"
            />
          </div>

          {/* Welcome Message */}
          <div className="text-center mb-8">
            <h1 className="text-xl mb-2 text-white font-light">
              ¡Comparte tus habilidades!
            </h1>
            <p className="text-white text-xs">
              Únete como estudiante y comienza a ofrecer tus servicios
            </p>
          </div>

          {/* Google Sign in button */}
          <div className="mt-auto mb-12">
            <Button
              onClick={() => handleLoginWithGoogle(true)}
              disabled={authLoading}
              className="p-button-secondary w-full flex items-center justify-center gap-2 bg-primary-light text-primary-dark border-none rounded-lg p-2.5 hover:bg-opacity-90 transition-colors font-medium"
            >
              {authLoading ? (
                <i className="pi pi-spin pi-spinner mr-2"></i>
              ) : (
                <img
                  src="https://cdn-icons-png.flaticon.com/512/2991/2991148.png"
                  alt="Google"
                  className="w-5 h-5 bg-white p-0.5 rounded-full font-light mr-2"
                />
              )}
              <span>
                {authLoading ? "Cargando..." : "¡Comienza con Google!"}
              </span>
            </Button>

            <div className="text-center mt-4">
              <p className="text-sm font-light text-white">
                ¿Ya tienes una cuenta?
                <Button
                  onClick={() => handleLoginWithGoogle(false)}
                  disabled={authLoading}
                  className="p-button-text p-button-plain text-primary-light font-light hover:underline p-0"
                  label={authLoading ? "Cargando..." : "Iniciar sesión"}
                />
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Left Side - Desktop Carousel (hidden on mobile) */}
      <div className="hidden md:flex md:w-1/2 bg-neutral-800 text-white relative overflow-hidden">
        <div className="absolute inset-0 z-0 transition-opacity duration-1000">
          <img
            src={carouselData[currentSlide].image}
            alt={carouselData[currentSlide].title}
            className="w-full h-full object-cover opacity-30"
          />
        </div>

        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          {/* Content */}
          <div className="mt-auto">
            <div className="text-4xl font-bold mb-3 flex items-center transition-all duration-700">
              {carouselData[currentSlide].title}
            </div>

            <p className="text-sm text-white/70 mb-6 transition-all duration-700">
              {carouselData[currentSlide].description}
            </p>

            {renderCarouselIndicators()}
          </div>
        </div>
      </div>

      {/* Right side - Desktop Auth form (hidden on mobile) */}
      <div className="hidden md:flex md:w-1/2 items-center justify-center p-6">
        <div className="w-full max-w-md flex flex-col items-center">
          {/* Logo */}
          <div className="flex justify-center mb-10">
            <img
              src="https://res.cloudinary.com/dfgjenml4/image/upload/v1737657583/logoDark_uvqsz9.png"
              alt="Favorcito Logo"
              className="h-10"
            />
          </div>

          {/* Welcome Message */}
          <div className="text-center mb-10">
            <h1 className="text-2xl font-light mb-2 text-primary-dark">
              ¡Comparte tus habilidades!
            </h1>
            <p className="text-gray-500">
              Únete como estudiante y comienza a ofrecer tus servicios
            </p>
          </div>

          {/* Google Sign in and sign up */}
          <div className="space-y-6 w-full">
            <Button
              onClick={() => handleLoginWithGoogle(true)}
              disabled={authLoading}
              className="p-button-primary w-full flex items-center justify-center gap-3 bg-primary-dark text-white border-none rounded-lg p-3.5 hover:bg-opacity-90 transition-colors font-medium"
            >
              {authLoading ? (
                <i className="pi pi-spin pi-spinner mr-2"></i>
              ) : (
                <img
                  src="https://cdn-icons-png.flaticon.com/512/2991/2991148.png"
                  alt="Google"
                  className="w-5 h-5 bg-white p-0.5 rounded-full mr-2"
                />
              )}
              <span>
                {authLoading ? "Cargando..." : "¡Comienza ahora con Google!"}
              </span>
            </Button>

            <div className="text-center mt-8">
              <p className="text-sm text-neutral-dark">
                ¿Ya tienes una cuenta?
                <Button
                  onClick={() => handleLoginWithGoogle(false)}
                  disabled={authLoading}
                  className="p-button-text p-button-plain text-primary-dark font-medium hover:underline p-0"
                  label={authLoading ? "Cargando..." : "Iniciar sesión"}
                />
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
