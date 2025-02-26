import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
// Eliminamos la importación de Helmet
import PersonalInfo from "../components/students/PersonalInfo";
import AcademicInfo from "../components/students/AcademicInfo";
import SkillsAvailability from "../components/students/SkillsAvailability";
import Verification from "../components/students/Verification";
import Onboarding from "../components/students/Onboarding";
import Loader from "../components/Main/Loader";
import { studentsService } from "../services/studentsService";
import PropTypes from "prop-types";

// Componente de confirmación para salir - REDISEÑADO
const ExitConfirmation = ({ onCancel, onConfirm }) => {
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <motion.div 
        initial={{ opacity: 0, y: 10, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 10, scale: 0.95 }}
        transition={{ duration: 0.2 }}
        className="bg-white rounded-2xl shadow-2xl max-w-sm w-full overflow-hidden"
      >
        <div className="p-6 pb-4">
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center mb-1">
              <i className="pi pi-exclamation-triangle text-amber-500 text-xl"></i>
            </div>
          </div>
          <h3 className="text-xl text-center font-semibold text-neutral-dark mb-3">¿Seguro que quieres abandonar?</h3>
          <p className="text-neutral-gray text-center mb-4">
            Estás muy cerca de formar parte de Favorcito y comenzar a generar ingresos extra en tu tiempo libre.
          </p>
        </div>
        
        <div className="flex border-t border-neutral-gray/10">
          <button 
            onClick={onConfirm} 
            className="flex-1 py-4 text-neutral-gray hover:bg-neutral-50 transition-colors font-medium"
          >
            Abandonar
          </button>
          <div className="w-px bg-neutral-gray/10"></div>
          <button 
            onClick={onCancel} 
            className="flex-1 py-4 text-primary-dark font-medium hover:bg-primary-dark/5 transition-colors"
          >
            Continuar
          </button>
        </div>
      </motion.div>
    </div>
  );
};

// Componente Stepper
const Stepper = ({ activeIndex, onStepClick }) => {
  const [width, setWidth] = useState(window.innerWidth);
  const isMobile = width <= 1000;

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const steps = [
    {
      label: "Habilidades",
      icon: "pi pi-star",
      description: "Selecciona los servicios que puedes ofrecer"
    },
    {
      label: "Información Académica",
      icon: "pi pi-book",
      description: "Datos de tu universidad y carrera"
    },
    {
      label: "Información Personal",
      icon: "pi pi-user",
      description: "Tus datos personales y de contacto"
    },
    {
      label: "Verificación",
      icon: "pi pi-check",
      description: "Confirma la información ingresada"
    },
  ];

  const handleClick = (index) => {
    if (index < activeIndex) {
      onStepClick(index);
    }
  };

  if (isMobile) {
    // Stepper horizontal para móvil
    return (
      <div className="w-full px-4 py-4">
        <div className="relative flex justify-between items-center">
          {/* Progress Line */}
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-0.5 bg-neutral-gray">
            <div
              className="h-full bg-primary-dark transition-all duration-300"
              style={{ width: `${(activeIndex / (steps.length - 1)) * 100}%` }}
            />
          </div>

          {/* Steps */}
          {steps.map((step, index) => (
            <div
              key={index}
              className="relative flex flex-col items-center"
              onClick={() => handleClick(index)}
            >
              {/* Step Circle */}
              <div
                className={`
                  w-10 h-10 rounded-full flex items-center justify-center 
                  cursor-pointer transition-all duration-300 z-10
                  ${
                    index <= activeIndex
                      ? "bg-primary-dark text-white"
                      : "bg-white border-2 border-neutral-gray text-neutral-gray"
                  }
                  ${index < activeIndex && "hover:opacity-80"}
                `}
              >
                <i className={`${step.icon} text-lg`} />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  } else {
    // Stepper vertical para desktop
    return (
      <div className="h-full py-8 px-6 flex flex-col">
        {/* Logo arriba de los steps */}
        <div className="flex justify-center mb-12">
          <img
            src="https://res.cloudinary.com/dfgjenml4/image/upload/v1737657583/logoDark_uvqsz9.png"
            alt="Favorcito Logo"
            className="h-10 object-contain transition-all duration-300 hover:opacity-90"
          />
        </div>

        <div className="relative flex flex-col flex-grow">
          {/* Línea vertical de progreso - CORREGIDA */}
          <div className="absolute left-5 top-7 bottom-24 w-0.5 bg-neutral-gray -z-10">
            <div
              className="w-full bg-primary-dark transition-all duration-300"
              style={{
                height: activeIndex === 0
                  ? '0%'
                  : activeIndex === 1
                    ? '33%'
                    : activeIndex === 2
                      ? '66%'
                      : activeIndex === 3
                        ? '100%'
                        : '0%'
              }}
            />
          </div>

          {/* Pasos verticales */}
          <div className="space-y-12">
            {steps.map((step, index) => (
              <div
                key={index}
                className={`
                  relative flex items-start cursor-pointer
                  ${index < activeIndex ? "hover:opacity-90 hover:translate-x-1" : ""}
                  pl-14 pr-4 py-3 rounded-xl transition-all duration-200 
                  ${index === activeIndex ? "  px-10" : ""}
                `}
                onClick={() => handleClick(index)}
              >
                {/* Círculo del paso */}
                <div
                  className={`
                    absolute left-0 w-10 h-10 rounded-full flex items-center justify-center 
                    transition-all duration-300 z-10 shadow-sm
                    ${
                      index <= activeIndex
                        ? "bg-primary-dark text-white"
                        : "bg-white border-2 border-neutral-gray text-neutral-gray"
                    }
                    ${index === activeIndex ? "ring-4 ring-primary-dark/20" : ""}
                  `}
                >
                  <i className={`${step.icon} text-lg`} />
                </div>

                {/* Contenido del paso */}
                <div className="flex flex-col">
                  <span
                    className={`
                      font-medium text-base transition-colors duration-300
                      ${
                        index <= activeIndex
                          ? "text-neutral-dark"
                          : "text-neutral-gray"
                      }
                    `}
                  >
                    {step.label}
                  </span>
                  <span className="text-sm text-neutral-gray mt-1 opacity-90">
                    {step.description}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Indicador de progreso en bottom */}
        <div className="mt-auto pt-6 text-center text-sm text-neutral-gray">
          {activeIndex + 1} de {steps.length}
        </div>
      </div>
    );
  }
};

// PropTypes para ExitConfirmation
ExitConfirmation.propTypes = {
  onCancel: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
};

// PropTypes para Stepper
Stepper.propTypes = {
  activeIndex: PropTypes.number.isRequired,
  onStepClick: PropTypes.func.isRequired,
};

export const FormStudentsLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeIndex, setActiveIndex] = useState(0);
  const [width, setWidth] = useState(window.innerWidth);
  const isMobile = width <= 1000;
  const [isLoading, setIsLoading] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [pageKey, setPageKey] = useState(Date.now());
  const [showExitConfirmation, setShowExitConfirmation] = useState(false);

  // Efecto para detectar cuando la página se carga nuevamente (después de navegación)
  useEffect(() => {
    setPageKey(Date.now());
  }, [location.pathname]);

  // Efecto para manejar el evento de salida
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      const message = "¿Estás seguro que deseas salir? Perderás tu progreso en el registro.";
      e.returnValue = message;
      return message;
    };

    // Sólo añadir el evento si no estamos en el paso final
    if (activeIndex < 3) {
      window.addEventListener('beforeunload', handleBeforeUnload);
    }

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [activeIndex]);

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    
    // Simular tiempo de carga
    const timer = setTimeout(() => {
      setIsLoading(false);
      setShowOnboarding(true);
    }, 2500);
    
    return () => {
      window.removeEventListener("resize", handleResize);
      clearTimeout(timer);
    };
  }, [pageKey]);

  const [formData, setFormData] = useState({
    fullName: "",
    bornDate: null,
    email: "",
    phone: "",
    city: "",
    zona: "",
    address: "",
    university: "",
    degree: "",
    year: null,
    uniID: "",
    skills: [],
    otherSkills: "",
    availability: {},
    qrCode: "",
  });

  const updateFormData = (newData) => {
    setFormData((prev) => ({ ...prev, ...newData }));
  };

  const handleNext = () => {
    setActiveIndex((prev) => Math.min(3, prev + 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handlePrevious = () => {
    setActiveIndex((prev) => Math.max(0, prev - 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = async () => {
    return new Promise(async (resolve, reject) => {
      try {
        const dataToSend = { ...formData };

        delete dataToSend.freeHours;
        delete dataToSend.availableDays;

        const allDays = [
          "Lunes",
          "Martes",
          "Miercoles",
          "Jueves",
          "Viernes",
          "Sabado",
          "Domingo",
        ];

        if (!dataToSend.availability) {
          dataToSend.availability = {};
        }

        allDays.forEach((day) => {
          if (!dataToSend.availability[day]) {
            dataToSend.availability[day] = [];
          }
        });

        if (!dataToSend.qrCode) {
          dataToSend.qrCode = "pending-generation";
        }

        if (dataToSend.phone && /^\d{8}$/.test(dataToSend.phone)) {
          dataToSend.phone = `+591-${dataToSend.phone}`;
        }

        const daysWithTimes = Object.entries(dataToSend.availability)
          .filter(([_, times]) => times && times.length > 0)
          .map(([day, times]) => `${day} de ${times.join(", ")}`)
          .join("; ");

        dataToSend.classSchedule = daysWithTimes || "Sin horario especificado";

        if (dataToSend.bornDate instanceof Date) {
          dataToSend.bornDate = dataToSend.bornDate.toISOString().split("T")[0];
        }

        console.log("Enviando datos:", dataToSend);

        await studentsService.registerStudent(dataToSend);
        localStorage.removeItem("studentFormData");

        resolve();
      } catch (error) {
        console.error("Error completo:", error);
        reject(error);
      }
    });
  };

  const handleOnboardingComplete = () => {
    setShowOnboarding(false);
  };

  // Función para manejar intentos de salir
  const handleExitAttempt = () => {
    setShowExitConfirmation(true);
  };

  // Función para confirmar salida
  const handleConfirmExit = () => {
    navigate('/'); // Redirigir a la página de inicio
  };

  // Función para cancelar salida
  const handleCancelExit = () => {
    setShowExitConfirmation(false);
  };

  const renderStep = () => {
    const steps = {
      0: (
        <SkillsAvailability
          formData={formData}
          updateFormData={updateFormData}
          onNext={handleNext}
        />
      ),
      1: (
        <AcademicInfo
          formData={formData}
          updateFormData={updateFormData}
          onNext={handleNext}
          onPrevious={handlePrevious}
        />
      ),
      2: (
        <PersonalInfo
          formData={formData}
          updateFormData={updateFormData}
          onNext={handleNext}
          onPrevious={handlePrevious}
        />
      ),
      3: (
        <Verification
          formData={formData}
          onPrevious={handlePrevious}
          onSubmit={handleSubmit}
        />
      ),
    };
    return steps[activeIndex];
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-100" key={pageKey}>

      {/* Loader */}
      <AnimatePresence>
        {isLoading && <Loader />}
      </AnimatePresence>

      {/* Onboarding */}
      <AnimatePresence>
        {showOnboarding && !isLoading && (
          <Onboarding onComplete={handleOnboardingComplete} />
        )}
      </AnimatePresence>

      {/* Diálogo de confirmación de salida */}
      <AnimatePresence>
        {showExitConfirmation && (
          <ExitConfirmation 
            onCancel={handleCancelExit} 
            onConfirm={handleConfirmExit} 
          />
        )}
      </AnimatePresence>

      {/* Solo en móvil: Header con logo y stepper horizontal */}
      {isMobile && (
        <header className="w-full bg-white border-b border-neutral-gray/10 sticky top-0 z-40 shadow-sm">
          <div className="container mx-auto px-4 py-3">
            {/* Logo section */}
            <div className="flex justify-between items-center py-2 border-b border-neutral-gray/10">
              <button 
                onClick={handleExitAttempt}
                className="text-neutral-gray hover:text-neutral-dark transition-colors"
              >
                <i className="pi pi-arrow-left text-lg"></i>
              </button>
              <img
                src="https://res.cloudinary.com/dfgjenml4/image/upload/v1737657583/logoDark_uvqsz9.png"
                alt="Favorcito Logo"
                className="h-8 object-contain"
              />
              <div className="w-8"></div> {/* Espacio para mantener centrado el logo */}
            </div>
            <Stepper
              activeIndex={activeIndex}
              onStepClick={(index) => index < activeIndex && setActiveIndex(index)}
            />
          </div>
        </header>
      )}

      {/* Contenido principal */}
      <main className="flex-1 flex">
        <div className="w-full flex h-full">
          {/* Layout para desktop */}
          {!isMobile ? (
            <div className="flex w-full h-full">
              {/* Stepper vertical en desktop */}
              <div className="w-80 bg-white border-r border-neutral-gray/10 flex-shrink-0 fixed h-screen overflow-hidden shadow-md">
                {/* Botón de salir en desktop */}
                <button 
                  onClick={handleExitAttempt}
                  className="absolute top-6 left-6 text-neutral-gray hover:text-neutral-dark transition-colors z-10"
                >
                  <i className="pi pi-arrow-left text-lg"></i>
                </button>
                
                <Stepper
                  activeIndex={activeIndex}
                  onStepClick={(index) => index < activeIndex && setActiveIndex(index)}
                />
              </div>

              {/* Contenido principal */}
              <div className="flex-1 px-3 py-4 ml-80">
                <div className="max-w-3xl mx-auto">
                  <div className="bg-white rounded-lg shadow-sm border border-neutral-gray/10 p-8 h-full">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={activeIndex}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{
                          type: "spring",
                          stiffness: 300,
                          damping: 30,
                        }}
                        className="pb-6"
                      >
                        {renderStep()}
                      </motion.div>
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            // Layout para móvil
            <div className="w-full p-4">
              <div className="bg-white rounded-lg shadow-sm border border-neutral-gray/10 p-5 h-full">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeIndex}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{
                      type: "spring",
                      stiffness: 300,
                      damping: 30,
                    }}
                  >
                    {renderStep()}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default FormStudentsLayout;