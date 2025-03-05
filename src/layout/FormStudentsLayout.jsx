import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import PersonalInfo from "../components/students/PersonalInfo";
import AcademicInfo from "../components/students/AcademicInfo";
import SkillsAvailability from "../components/students/SkillsAvailability";
import Verification from "../components/students/Verification";
import Onboarding from "../components/students/Onboarding";
import Loader from "../components/Main/Loader";
import { studentsService } from "../services/studentsService";
import PropTypes from "prop-types";
import { Mixpanel } from "../services/mixpanel";
import Stepper from "../components/common/Stepper";
import { useAuth } from "../context/AuthContext";

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
          <h3 className="text-xl text-center font-semibold text-neutral-dark mb-3">
            ¿Seguro que quieres abandonar?
          </h3>
          <p className="text-neutral-gray text-center mb-4">
            Estás muy cerca de formar parte de Favorcito y comenzar a generar
            ingresos extra en tu tiempo libre.
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

ExitConfirmation.propTypes = {
  onCancel: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
};

export const FormStudentsLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeIndex, setActiveIndex] = useState(0);
  const [width, setWidth] = useState(window.innerWidth);
  const isMobile = width <= 1000;
  const [isLoading, setIsLoading] = useState(true);
  const [contentVisible, setContentVisible] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [pageKey, setPageKey] = useState(Date.now());
  const [showExitConfirmation, setShowExitConfirmation] = useState(false);
  const unloadAttempted = useRef(false);
  const { signOut } = useAuth();

  useEffect(() => {
    setPageKey(Date.now());
  }, [location.pathname]);

  useEffect(() => {
    Mixpanel.track("Form_Load", {
      referrer: document.referrer,
      device: isMobile ? "mobile" : "desktop",
      timestamp: Date.now(),
    });
  }, [pageKey]);

  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (activeIndex < 3) {
        const message =
          "¿Estás seguro que deseas salir? Perderás tu progreso en el registro.";
        e.returnValue = message;
        unloadAttempted.current = true;
        return message;
      }
    };

    const handleRouteChange = (e) => {
      if (activeIndex < 3 && location.pathname.includes("/students/form")) {
        e.preventDefault();
        setShowExitConfirmation(true);
      }
    };

    if (activeIndex < 3) {
      window.addEventListener("beforeunload", handleBeforeUnload);
      window.addEventListener("popstate", handleRouteChange);
    }

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("popstate", handleRouteChange);
    };
  }, [activeIndex, location.pathname]);

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);

    document.body.style.overflow = "hidden";

    const loadingTimer = setTimeout(() => {
      setIsLoading(false);

      setTimeout(() => {
        setContentVisible(true);
        setShowOnboarding(true);
        document.body.style.overflow = "";
      }, 300);
    }, 2500);

    return () => {
      window.removeEventListener("resize", handleResize);
      clearTimeout(loadingTimer);
      document.body.style.overflow = "";
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
    const currentStepName = getStepName(activeIndex);
    const nextStepName = getStepName(activeIndex + 1);

    Mixpanel.track("Step_Change", {
      from: currentStepName,
      to: nextStepName,
      direction: "next",
    });

    setActiveIndex((prev) => Math.min(3, prev + 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handlePrevious = () => {
    const currentStepName = getStepName(activeIndex);
    const prevStepName = getStepName(activeIndex - 1);

    Mixpanel.track("Step_Change", {
      from: currentStepName,
      to: prevStepName,
      direction: "previous",
    });

    setActiveIndex((prev) => Math.max(0, prev - 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const getStepName = (index) => {
    const stepNames = [
      "Habilidades y Disponibilidad",
      "Información Académica",
      "Información Personal",
      "Verificación",
    ];
    return stepNames[index] || `Step_${index}`;
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

  const handleExitAttempt = () => {
    setShowExitConfirmation(true);
  };

  const handleConfirmExit = async () => {
    try {
      await signOut();
      navigate("/Auth");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);

      navigate("/Auth");
    }
  };

  const handleCancelExit = () => {
    setShowExitConfirmation(false);
  };

  const renderStep = () => {
    const steps = {
      0: (
        <PersonalInfo
          formData={formData}
          updateFormData={updateFormData}
          onNext={handleNext}
          onPrevious={handlePrevious}
        />
      ),
      1: (
        <SkillsAvailability
          formData={formData}
          updateFormData={updateFormData}
          onNext={handleNext}
          onPrevious={handlePrevious}
        />
      ),
      2: (
        <AcademicInfo
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
      <AnimatePresence>{isLoading && <Loader />}</AnimatePresence>

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

      {/* Contenido principal - Solo visible después de cargar */}
      {contentVisible && (
        <>
          {/* Solo en móvil: Header con logo y stepper horizontal */}
          {isMobile && (
            <header className="w-full bg-white border-b border-neutral-gray/10 sticky top-0 z-40 shadow-sm">
              <div className="container mx-auto px-4 py-3">
                {/* Logo section */}
                <div className="flex items-center py-2 border-b border-neutral-gray/10">
                  {/* Botón atrás más visible y alineado a la izquierda */}
                  <button
                    onClick={handleExitAttempt}
                    className="flex items-center justify-center bg-primary-dark text-white hover:bg-primary-dark/90 transition-all duration-200 p-2 rounded-full shadow-md"
                  >
                    <i className="pi pi-arrow-left text-lg"></i>
                  </button>

                  {/* Logo centrado */}
                  <div className="flex-1 flex justify-center">
                    <img
                      src="https://res.cloudinary.com/dfgjenml4/image/upload/v1737657583/logoDark_uvqsz9.png"
                      alt="Favorcito Logo"
                      className="h-7 object-contain"
                    />
                  </div>

                  {/* Espacio reservado para mantener equilibrio */}
                  <div className="w-8"></div>
                </div>
                <Stepper
                  activeIndex={activeIndex}
                  onStepClick={(index) =>
                    index < activeIndex && setActiveIndex(index)
                  }
                />
              </div>
            </header>
          )}

          {/* Contenido principal */}
          <main className="flex-1 flex">
            <div className="w-full flex h-full">
              {/* Layout para desktop - MEJORADO para eliminar scroll */}
              {!isMobile ? (
                <div className="flex w-full h-full">
                  {/* Stepper vertical en desktop - Cambiado a overflow-hidden */}
                  <div className="w-80 bg-white border-r border-neutral-gray/10 flex-shrink-0 fixed h-screen overflow-hidden shadow-md flex flex-col">
                    {/* Botón de salir en desktop - Rediseñado */}
                    <div className="flex justify-between items-center px-6 pt-6 pb-2">
                      <button
                        onClick={handleExitAttempt}
                        className="flex items-center justify-center bg-primary-dark text-white hover:bg-primary-dark/90 transition-all duration-200 w-10 h-10 rounded-full shadow-md"
                      >
                        <i className="pi pi-arrow-left text-lg"></i>
                      </button>
                    </div>

                    {/* Stepper ahora ocupa toda la altura disponible con flex-1 */}
                    <div className="flex-1 flex flex-col overflow-hidden">
                      <Stepper
                        activeIndex={activeIndex}
                        onStepClick={(index) =>
                          index < activeIndex && setActiveIndex(index)
                        }
                      />
                    </div>
                  </div>

                  {/* Contenido principal - Mejorado en responsividad */}
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
                // Layout para móvil (sin cambios)
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
        </>
      )}
    </div>
  );
};

export default FormStudentsLayout;
