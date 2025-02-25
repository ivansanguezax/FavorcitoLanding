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
  const isMobile = width <= 1000; // Ajustado a 1000px como solicitado

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
    // Stepper vertical para desktop - AJUSTADO
    return (
      <div className="h-full py-8 px-6 flex flex-col">
        {/* Logo arriba de los steps - centrado y mejorado */}
        <div className="flex justify-center mb-12">
          <img
            src="https://res.cloudinary.com/dfgjenml4/image/upload/v1737657583/logoDark_uvqsz9.png"
            alt="Favorcito Logo"
            className="h-10 object-contain transition-all duration-300 hover:opacity-90"
          />
        </div>

        <div className="relative flex flex-col flex-grow">
          {/* Línea vertical de progreso - CORREGIDA para calcular correctamente */}
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

          {/* Pasos verticales - MEJORADOS */}
          <div className="space-y-12">
            {steps.map((step, index) => (
              <div
                key={index}
                className={`
                  relative flex items-start cursor-pointer
                  ${index < activeIndex ? "hover:opacity-90 hover:translate-x-1" : ""}
                  pl-14 pr-4 py-3 rounded-xl transition-all duration-200 
                  ${index === activeIndex ? "bg-slate-50 shadow-sm px-10" : ""}
                `}
                onClick={() => handleClick(index)}
              >
                {/* Círculo del paso - MEJORADO */}
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

                {/* Contenido del paso - MEJORADO */}
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

        {/* Añadido: Indicador de progreso en bottom */}
        <div className="mt-auto pt-6 text-center text-sm text-neutral-gray">
          {activeIndex + 1} de {steps.length}
        </div>
      </div>
    );
  }
};

export const FormStudentsLayout = () => {
  const navigate = useNavigate();
  const [activeIndex, setActiveIndex] = useState(0);
  const [width, setWidth] = useState(window.innerWidth);
  const isMobile = width <= 1000; // Ajustado a 1000px

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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
    <div className="min-h-screen flex flex-col bg-slate-100">
      {/* SEO Metadata */}
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

      {/* Solo en móvil: Header con logo y stepper horizontal */}
      {isMobile && (
        <header className="w-full bg-white border-b border-neutral-gray/10 sticky top-0 z-50 shadow-sm">
          <div className="container mx-auto px-4 py-3">
            {/* Logo section */}
            <div className="flex justify-center py-2 border-b border-neutral-gray/10">
              <img
                src="https://res.cloudinary.com/dfgjenml4/image/upload/v1737657583/logoDark_uvqsz9.png"
                alt="Favorcito Logo"
                className="h-8 object-contain"
              />
            </div>
            <Stepper
              activeIndex={activeIndex}
              onStepClick={(index) => index < activeIndex && setActiveIndex(index)}
            />
          </div>
        </header>
      )}

      {/* Contenido principal adaptado a la altura de la pantalla */}
      <main className="flex-1 flex">
        <div className="w-full flex h-full">
          {/* Layout para desktop - MODIFICADO */}
          {!isMobile ? (
            <div className="flex w-full h-full">
              {/* Stepper vertical en desktop - AJUSTADO PARA QUEDARSE FIJO */}
              <div className="w-80 bg-white border-r border-neutral-gray/10 flex-shrink-0 fixed h-screen overflow-hidden shadow-md">
                <Stepper
                  activeIndex={activeIndex}
                  onStepClick={(index) => index < activeIndex && setActiveIndex(index)}
                />
              </div>

              {/* Contenido principal - AJUSTADO para compensar el stepper fijo */}
              <div className="flex-1 px-3 py-4 ml-60">

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
                        className="pb-6" // Espacio reducido ya que no hay botones fijos
                      >
                        {renderStep()}
                      </motion.div>
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            // Layout para móvil - Contenido a pantalla completa
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

      {/* Botones de navegación eliminados, ya que los componentes internos tienen sus propios controles */}
    </div>
  );
};

export default FormStudentsLayout;

Stepper.propTypes = {
  activeIndex: PropTypes.number.isRequired,
  onStepClick: PropTypes.func.isRequired,
};