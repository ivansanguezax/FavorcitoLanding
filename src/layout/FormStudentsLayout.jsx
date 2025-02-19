import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Helmet } from "react-helmet-async";
import PersonalInfo from "../components/students/PersonalInfo";
import AcademicInfo from "../components/students/AcademicInfo";
import SkillsAvailability from "../components/students/SkillsAvailability";
import Verification from "../components/students/Verification";
import { studentsService } from "../services/studentsService";
import PropTypes from "prop-types";

// Stepper component
const Stepper = ({ activeIndex, onStepClick }) => {
  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const steps = [
    {
      label: width > 768 ? "Habilidades" : "",
      icon: "pi pi-star",
    },
    {
      label: width > 768 ? "Información Académica" : "",
      icon: "pi pi-book",
    },
    {
      label: width > 768 ? "Información Personal" : "",
      icon: "pi pi-user",
    },
    {
      label: width > 768 ? "Verificación" : "",
      icon: "pi pi-check",
    },
  ];

  const handleClick = (index) => {
    if (index < activeIndex) {
      onStepClick(index);
    }
  };

  return (
    <div className="w-full px-4 py-6">
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

            {/* Label */}
            {width > 768 && (
              <span
                className={`
                  absolute -bottom-8 text-sm font-medium whitespace-nowrap
                  transition-colors duration-300
                  ${
                    index <= activeIndex
                      ? "text-primary-dark"
                      : "text-neutral-gray"
                  }
                `}
              >
                {step.label}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export const FormStudentsLayout = () => {
  const navigate = useNavigate();
  const [activeIndex, setActiveIndex] = useState(0);
  const [formData, setFormData] = useState({
    fullName: "",
    bornDate: null,
    email: "",
    phone: "",
    city: "",
    province: "",
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
    // Scroll to top after step change
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handlePrevious = () => {
    setActiveIndex((prev) => Math.max(0, prev - 1));
    // Scroll to top after step change
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = async () => {
    // Return a promise so the Verification component can handle UI states
    return new Promise(async (resolve, reject) => {
      try {
        // Crear copia del formData para no modificar el estado original
        const dataToSend = { ...formData };

        // Eliminar campos innecesarios si existen
        delete dataToSend.freeHours;
        delete dataToSend.availableDays;

        // Asegurar que todos los días de la semana estén presentes en availability
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

        // Añadir arrays vacíos para los días que faltan
        allDays.forEach((day) => {
          if (!dataToSend.availability[day]) {
            dataToSend.availability[day] = [];
          }
        });

        // Si no hay QR Code, usar un valor por defecto
        if (!dataToSend.qrCode) {
          dataToSend.qrCode = "pending-generation";
        }

        // Si el teléfono no tiene el formato requerido por la API, añadirlo
        if (dataToSend.phone && /^\d{8}$/.test(dataToSend.phone)) {
          dataToSend.phone = `+591-${dataToSend.phone}`;
        }

        // Generar classSchedule a partir de availability
        const daysWithTimes = Object.entries(dataToSend.availability)
          .filter(([_, times]) => times && times.length > 0)
          .map(([day, times]) => `${day} de ${times.join(", ")}`)
          .join("; ");

        dataToSend.classSchedule = daysWithTimes || "Sin horario especificado";

        // Asegurar formato de fecha correcto
        if (dataToSend.bornDate instanceof Date) {
          dataToSend.bornDate = dataToSend.bornDate.toISOString().split("T")[0];
        }

        console.log("Enviando datos:", dataToSend);

        await studentsService.registerStudent(dataToSend);

        // Limpiar localStorage después del registro exitoso
        localStorage.removeItem("studentFormData");

        // Set timeout to redirect
        setTimeout(() => {
          navigate("/");
        }, 5000);

        resolve(); // Resolve the promise when successful
      } catch (error) {
        console.error("Error completo:", error);
        reject(error); // Reject with error for Verification component to handle
      }
    });
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
    <div className="min-h-screen bg-slate-100 flex flex-col">
      {/* SEO Metadata - Solo afecta el head del documento, no la UI */}
      <Helmet>
        <title>Favorcito para Estudiantes | Gana dinero haciendo favores</title>
        <meta name="description" content="Regístrate como estudiante en Favorcito y comienza a ganar dinero haciendo favores en tu tiempo libre. Conectamos estudiantes con personas que necesitan ayuda." />
        <meta name="keywords" content="favorcito, estudiantes, ganar dinero, favores, trabajos para estudiantes, ingresos extra" />
        <meta property="og:title" content="Favorcito para Estudiantes | Gana dinero haciendo favores" />
        <meta property="og:description" content="Regístrate como estudiante en Favorcito y comienza a ganar dinero haciendo favores en tu tiempo libre." />
        <meta property="og:image" content="https://res.cloudinary.com/dfgjenml4/image/upload/v1739928890/cover_1_mn55ax.png" />
        <meta property="og:type" content="website" />
        <link rel="canonical" href="https://favorcito.app/registrar-estudiante" />
      </Helmet>

      <header className="w-full bg-white border-b border-neutral-gray/10 sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto pb-5 md:pb-10 px-4 md:px-8">
          {/* Logo section */}
          <div className="flex justify-center py-3 border-b border-neutral-gray/10">
            <img
              src="https://res.cloudinary.com/dfgjenml4/image/upload/v1737657583/logoDark_uvqsz9.png"
              alt="Favorcito Logo"
              className="h-8 md:h-6 object-contain"
            />
          </div>

          {/* Stepper below logo with proper padding */}
          <div className="max-w-4xl mx-auto">
            <Stepper
              activeIndex={activeIndex}
              onStepClick={(index) =>
                index < activeIndex && setActiveIndex(index)
              }
            />
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-6">
        <div className="w-full max-w-5xl mx-auto">
          <div className="rounded-2xl bg-slate-100 border border-neutral-gray/10 p-6 md:p-8">
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
              >
                {renderStep()}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </main>
    </div>
  );
};

export default FormStudentsLayout;

Stepper.propTypes = {
  activeIndex: PropTypes.number.isRequired,
  onStepClick: PropTypes.func.isRequired,
};