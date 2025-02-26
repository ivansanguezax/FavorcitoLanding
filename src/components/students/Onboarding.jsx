import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import PropTypes from "prop-types";

const OnboardingStep = ({ step, onNext, onPrevious, onComplete, isLastStep }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col w-full"
    >
      {/* Banner de imagen sin texto superpuesto */}
      <div className="w-full mb-6 relative">
        <img 
          src={step.image} 
          alt={step.title} 
          className="w-full h-48 sm:h-56 object-cover rounded-t-xl"
        />
      </div>

      {/* Contenido principal */}
      <div className="px-6 sm:px-8">
        {/* Título principal bajo la imagen */}
        <h2 className="text-xl sm:text-2xl font-bold text-primary-dark mb-4">
          {step.title}
        </h2>

        {/* Descripción con mejor contraste */}
        <p className="text-neutral-dark text-base sm:text-lg mb-8 leading-relaxed">
          {step.description}
        </p>

        {/* Indicador de pasos mejorado */}
        <div className="flex justify-center space-x-3 mb-8">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className={`transition-all duration-300 ${
                i === step.index 
                ? "w-10 h-3 bg-primary-dark rounded-full" 
                : "w-3 h-3 bg-neutral-gray/40 rounded-full"
              }`}
            />
          ))}
        </div>

        {/* Botones de navegación mejorados */}
        <div className="flex justify-between w-full mt-6 mb-2">
          {step.index > 0 ? (
            <button
              onClick={onPrevious}
              className="py-3 px-6 rounded-lg font-medium text-neutral-dark hover:bg-neutral-gray/10 transition-all duration-200 flex items-center"
            >
              <span className="mr-2">←</span>
              Atrás
            </button>
          ) : (
            <div className="w-24"></div> 
          )}
          
          <button
            onClick={isLastStep ? onComplete : onNext}
            className="py-3 px-8 bg-primary-dark text-white rounded-lg font-medium shadow-sm hover:bg-primary-dark/90 transition-all duration-200 flex items-center"
          >
            {isLastStep ? "Comenzar" : "Continuar"}
            <span className="ml-2">→</span>
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
      description: "Conecta con personas que necesitan ayuda para tareas cotidianas: montar muebles, hacer reparaciones, cuidar mascotas, dar clases particulares y más. ¡Gana dinero extra mientras estudias!",
      buttonText: "Siguiente",
      image: "https://res.cloudinary.com/dfgjenml4/image/upload/v1740540344/1_yjahjg.jpg"
    },
    {
      index: 1,
      title: "Flexibilidad total, tú eliges cuándo y dónde ⏰",
      description: "Acepta tareas según tu disponibilidad y habilidades. Trabaja en tu tiempo libre sin descuidar tus estudios. ¡Tú controlas tu horario!",
      buttonText: "Siguiente",
      image: "https://res.cloudinary.com/dfgjenml4/image/upload/v1740540343/2_cdfqzw.jpg"
    },
    {
      index: 2,
      title: "¿Por qué llenar este formulario? 📝",
      description: "Completa tu registro para acceder a tareas cercanas a ti y recibir pagos. Mientras más detalles brindes, mejores oportunidades recibirás.",
      buttonText: "Comenzar",
      image: "https://res.cloudinary.com/dfgjenml4/image/upload/v1740542139/1_baiygp.jpg"
    }
  ];

  // Precargar imágenes
  useEffect(() => {
    // Función para precargar una imagen
    const preloadImage = (url) => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = url;
        img.onload = () => resolve();
        img.onerror = reject;
      });
    };

    // Precargar todas las imágenes
    const preloadAll = async () => {
      try {
        await Promise.all(steps.map(step => preloadImage(step.image)));
        setTimeout(() => {
          setIsLoading(false);
        }, 800); // Tiempo reducido para mejor experiencia
      } catch (err) {
        console.error("Error al cargar las imágenes:", err);
        setIsLoading(false);
      }
    };

    preloadAll();
  }, []);

  // Funciones para navegar entre pasos
  const handleNext = () => {
    setCurrentStep(prev => Math.min(prev + 1, steps.length - 1));
  };
  
  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 0));
  };

  if (isLoading) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4 sm:px-6">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.4, type: "spring", damping: 25 }}
        className="bg-white rounded-xl shadow-2xl overflow-hidden w-full max-w-md sm:max-w-lg mx-auto relative"
      >
        {/* Botón cerrar en header */}
        <button
          onClick={onComplete}
          className="absolute top-4 right-4 z-10 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-white/20 transition-all duration-200"
          aria-label="Cerrar"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
    buttonText: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired
  }).isRequired,
  onNext: PropTypes.func.isRequired,
  onPrevious: PropTypes.func.isRequired,
  onComplete: PropTypes.func.isRequired,
  isLastStep: PropTypes.bool.isRequired
};

Onboarding.propTypes = {
  onComplete: PropTypes.func.isRequired
};

export default Onboarding;