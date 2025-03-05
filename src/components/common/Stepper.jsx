import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { useAuth } from "../../context/AuthContext";

const Stepper = ({ activeIndex, onStepClick }) => {
  const [width, setWidth] = useState(window.innerWidth);
  const [height, setHeight] = useState(window.innerHeight);
  const isMobile = width <= 1000;
  const navigate = useNavigate();
  const stepsContainerRef = useRef(null);
  const [lineHeight, setLineHeight] = useState(0);
  const { signOut } = useAuth();

  useEffect(() => {
    const handleResize = () => {
      setWidth(window.innerWidth);
      setHeight(window.innerHeight);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (stepsContainerRef.current && !isMobile) {
      const stepsContainer = stepsContainerRef.current;
      const stepCircles = stepsContainer.querySelectorAll(".step-circle");

      if (stepCircles.length >= 2) {
        const firstCircle = stepCircles[0];
        const lastCircle = stepCircles[stepCircles.length - 1];

        const firstCircleTop = firstCircle.getBoundingClientRect().top;
        const lastCircleTop = lastCircle.getBoundingClientRect().top;

        const calculatedHeight = lastCircleTop - firstCircleTop;
        setLineHeight(calculatedHeight);
      }
    }
  }, [width, height, isMobile, activeIndex]);

  const steps = [
    {
      icon: "pi pi-user",
      description: "Tus datos personales y de contacto",
    },
    {
      icon: "pi pi-star",
      description: "Selecciona los servicios que puedes ofrecer",
    },
    {
      icon: "pi pi-book",
      description: "Datos de tu universidad y carrera",
    },
    {
      icon: "pi pi-check",
      description: "Confirma la información ingresada",
    },
  ];

  const handleClick = (index) => {
    if (index < activeIndex) {
      onStepClick(index);
    }
  };

  const handleLoginClick = async () => {
    try {
      await signOut();
      navigate("/Auth");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
      navigate("/Auth");
    }
  };

  if (isMobile) {
    return (
      <div className="w-full px-4 py-4">
        <div className="relative flex justify-between items-center">
          {/* Progress Line */}
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-0.5 bg-neutral-gray/30">
            <div
              className="h-full bg-primary-dark transition-all duration-500 ease-in-out"
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
              <div
                className={`
                  w-10 h-10 rounded-full flex items-center justify-center 
                  cursor-pointer transition-all duration-300 z-10
                  ${
                    index < activeIndex
                      ? "bg-primary-dark text-white"
                      : index === activeIndex
                      ? "bg-primary-dark text-white ring-4 ring-primary-dark/20"
                      : "bg-white border-2 border-neutral-gray/40 text-neutral-gray/70"
                  }
                  ${index < activeIndex && "hover:bg-primary-dark/90 scale-95 hover:scale-100"}
                  shadow-sm
                `}
              >
                <i className={`${step.icon} text-lg`} />
              </div>
              
              {/* Mobile tooltip for description - visible on touch */}
              <div className="absolute top-12 left-1/2 -translate-x-1/2 bg-white p-2 rounded-md shadow-md text-xs text-center w-24 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                {step.description}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  } else {
    return (
      <div className="h-full flex flex-col py-4 px-6">
        {/* Logo arriba de los steps */}
        <div className="flex justify-center mb-6">
          <img
            src="https://res.cloudinary.com/dfgjenml4/image/upload/v1737657583/logoDark_uvqsz9.png"
            alt="Favorcito Logo"
            className="h-8 object-contain transition-all duration-300 hover:opacity-90"
          />
        </div>

        {/* Contenedor principal con altura máxima para evitar scrolling */}
        <div className="flex-grow flex flex-col justify-between max-h-full">
          {/* Contenedor de steps con scroll interno si es necesario */}
          <div className="relative flex-grow overflow-y-auto pr-1" ref={stepsContainerRef}>
            {/* Línea vertical de progreso - Calculada dinámicamente */}
            {lineHeight > 0 && (
              <div
                className="absolute left-5 top-5 w-0.5 bg-neutral-gray/30 -z-10"
                style={{
                  height: `${lineHeight}px`,
                }}
              >
                <div
                  className="w-full bg-primary-dark transition-all duration-500 ease-in-out"
                  style={{
                    height:
                      activeIndex === 0
                        ? "0%"
                        : activeIndex === 1
                        ? "33%"
                        : activeIndex === 2
                        ? "66%"
                        : activeIndex === 3
                        ? "100%"
                        : "0%",
                  }}
                />
              </div>
            )}

            {/* Pasos verticales con espaciado reducido para pantallas pequeñas */}
            <div className="space-y-8 md:space-y-10">
              {steps.map((step, index) => (
                <div
                  key={index}
                  className={`
                    relative flex items-center cursor-pointer group
                    ${
                      index < activeIndex
                        ? "hover:opacity-95 hover:translate-x-1"
                        : ""
                    }
                    pl-14 pr-4 py-1 rounded-xl transition-all duration-200 
                    ${index === activeIndex ? "bg-primary-dark/5 backdrop-blur-sm" : ""}
                  `}
                  onClick={() => handleClick(index)}
                >
                  {/* Círculo del paso con animación suave */}
                  <div
                    className={`
                      step-circle
                      absolute left-0 w-10 h-10 rounded-full flex items-center justify-center 
                      transition-all duration-300 z-10 
                      ${
                        index < activeIndex
                          ? "bg-primary-dark text-white scale-90 group-hover:scale-95"
                          : index === activeIndex
                          ? "bg-primary-dark text-white scale-100 ring-4 ring-primary-dark/20"
                          : "bg-white border-2 border-neutral-gray/40 text-neutral-gray/70"
                      }
                      shadow-md
                    `}
                  >
                    <i className={`${step.icon} text-lg`} />
                  </div>

                  {/* Solo descripción con fuente ligera */}
                  <div className="flex flex-col py-2">
                    <span 
                      className={`
                        text-sm font-light transition-colors duration-300
                        ${
                          index <= activeIndex
                            ? "text-neutral-dark"
                            : "text-neutral-gray/70"
                        }
                      `}
                    >
                      {step.description}
                    </span>
                  </div>
                  
                  {/* Indicador de completado para pasos anteriores */}
                  {index < activeIndex && (
                    <div className="ml-auto">
                      <i className="pi pi-check-circle text-primary-dark/80 text-sm"></i>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Footer siempre visible con diseño mejorado */}
          <div className="mt-4 flex flex-col items-center pt-3 pb-2 bg-white border-t border-neutral-gray/10">
            {/* Indicador de progreso con estilo mejorado */}
            <div className="flex items-center space-x-2 mb-3">
              <div className="h-1 w-16 rounded-full bg-neutral-gray/20 overflow-hidden">
                <div 
                  className="h-full bg-primary-dark transition-all duration-500 ease-in-out rounded-full"
                  style={{ width: `${(activeIndex / (steps.length - 1)) * 100}%` }}
                ></div>
              </div>
              <span className="text-xs text-neutral-gray">
                {activeIndex + 1} de {steps.length}
              </span>
            </div>

            {/* Link de "Ya tengo una cuenta" con mejor UI */}
            <button
              onClick={handleLoginClick}
              className="text-primary-dark font-medium text-xs hover:text-primary-dark/80 transition-colors py-1 px-4 rounded-full border border-primary-dark/20 hover:border-primary-dark/40 hover:bg-primary-dark/5"
            >
              Ya tengo una cuenta
            </button>
          </div>
        </div>
      </div>
    );
  }
};

Stepper.propTypes = {
  activeIndex: PropTypes.number.isRequired,
  onStepClick: PropTypes.func.isRequired,
};

export default Stepper;