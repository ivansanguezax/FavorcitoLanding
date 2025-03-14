import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import PropTypes from "prop-types";

const OnboardingStep = ({
  step,
  onNext,
  onPrevious,
  onComplete,
  isLastStep,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.15, ease: "easeOut" }}
      className="flex flex-col w-full"
    >
      {/* Banner de imagen mejorado */}
      <div className="w-full relative">
        {/* Overlay con gradiente para mejorar la legibilidad */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent z-10"></div>

        <img
          src={step.image}
          alt={step.title}
          className="w-full h-56 sm:h-64 object-cover"
        />

        {/* Número del paso en círculo */}
        <div className="absolute top-4 left-4 z-10 w-8 h-8 rounded-full bg-white flex items-center justify-center">
          <span className="font-bold text-primary-dark">{step.index + 1}</span>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="px-6 sm:px-8 pt-6 pb-8">
        {/* Título principal */}
        <h2 className="text-2xl sm:text-3xl font-bold text-primary-dark mb-4">
          {step.title}
        </h2>

        {/* Descripción con mejor contraste */}
        <p className="text-neutral-dark text-base sm:text-lg mb-8 leading-relaxed">
          {step.description}
        </p>

        {/* Indicador de pasos mejorado */}
        <div className="flex justify-center space-x-3 mb-8">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              animate={{
                width: i === step.index ? "2rem" : "0.75rem",
                backgroundColor: i === step.index ? "#02533C" : "#CACCCF",
              }}
              transition={{
                duration: 0.2,
                type: "spring",
                stiffness: 500,
                damping: 30,
              }}
              className="h-3 rounded-full transition-all"
            />
          ))}
        </div>

        {/* Botones de navegación mejorados */}
        <div className="flex justify-between w-full mt-6">
          {step.index > 0 ? (
            <button
              onClick={onPrevious}
              className="py-3 px-6 rounded-lg font-medium text-neutral-dark hover:bg-neutral-light transition-all duration-200 flex items-center"
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Atrás
            </button>
          ) : (
            <div className="w-24"></div>
          )}

          <button
            onClick={isLastStep ? onComplete : onNext}
            className="py-3 px-8 bg-primary-dark text-white rounded-lg font-medium shadow-md hover:bg-primary-dark/90 active:transform active:scale-95 transition-all duration-200 flex items-center"
          >
            {isLastStep ? "Comenzar" : "Continuar"}
            <svg
              className="w-5 h-5 ml-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>
      </div>
    </motion.div>
  );
};

const Onboarding = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const steps = [
    {
      index: 0,
      title: "Gana dinero haciendo tareas simples 💸",
      description:
        "Conecta con personas que necesitan ayuda para tareas cotidianas: montar muebles, hacer reparaciones, cuidar mascotas, dar clases particulares y más. ¡Gana dinero extra mientras estudias!",
      buttonText: "Siguiente",
      image:
        "https://res.cloudinary.com/dfgjenml4/image/upload/v1740540344/1_yjahjg.jpg",
    },
    {
      index: 1,
      title: "Flexibilidad total, tú eliges cuándo y dónde ⏰",
      description:
        "Acepta tareas según tu disponibilidad y habilidades. Trabaja en tu tiempo libre sin descuidar tus estudios. ¡Tú controlas tu horario!",
      buttonText: "Siguiente",
      image:
        "https://res.cloudinary.com/dfgjenml4/image/upload/v1740540343/2_cdfqzw.jpg",
    },
    {
      index: 2,
      title: "¿Por qué llenar este formulario? 📝",
      description:
        "Completa tu registro para acceder a tareas cercanas a ti y recibir pagos. Mientras más detalles brindes, mejores oportunidades recibirás.",
      buttonText: "Comenzar",
      image:
        "https://res.cloudinary.com/dfgjenml4/image/upload/v1740542139/1_baiygp.jpg",
    },
  ];

  useEffect(() => {
    const preloadImage = (url) => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = url;
        img.onload = () => resolve();
        img.onerror = reject;
      });
    };

    const preloadAll = async () => {
      try {
        await Promise.all(steps.map((step) => preloadImage(step.image)));
        // Reducir el timeout de 800ms a 200ms
        setTimeout(() => {
          setIsLoading(false);
        }, 200);
      } catch (err) {
        console.error("Error al cargar las imágenes:", err);
        setIsLoading(false);
      }
    };

    preloadAll();
  }, []);

  const handleNext = () => {
    setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
  };

  const handlePrevious = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
        <div className="w-16 h-16 border-4 border-primary-light border-t-primary-dark rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 px-4 sm:px-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.2, type: "spring", damping: 35, stiffness: 400 }}
        className="bg-white rounded-2xl shadow-2xl overflow-hidden w-full max-w-md sm:max-w-lg mx-auto relative"
      >
        {/* Botón cerrar */}
        <button
          onClick={onComplete}
          className="absolute top-4 right-4 z-20 bg-white/90 rounded-full w-8 h-8 flex items-center justify-center hover:bg-white transition-all duration-200 shadow-md"
          aria-label="Cerrar"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M18 6L6 18M6 6l12 12"></path>
          </svg>
        </button>

        <AnimatePresence mode="wait">
          <OnboardingStep
            key={currentStep}
            step={steps[currentStep]}
            onNext={handleNext}
            onPrevious={handlePrevious}
            onComplete={onComplete}
            isLastStep={currentStep === steps.length - 1}
          />
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

OnboardingStep.propTypes = {
  step: PropTypes.shape({
    index: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    buttonText: PropTypes.string,
    image: PropTypes.string.isRequired,
  }).isRequired,
  onNext: PropTypes.func.isRequired,
  onPrevious: PropTypes.func.isRequired,
  onComplete: PropTypes.func.isRequired,
  isLastStep: PropTypes.bool.isRequired,
};

Onboarding.propTypes = {
  onComplete: PropTypes.func.isRequired,
};

export default Onboarding;