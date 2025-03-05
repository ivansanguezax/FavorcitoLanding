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
      label: "Información Personal",
      icon: "pi pi-user",
      description: "Tus datos personales y de contacto",
    },
    {
      label: "Habilidades",
      icon: "pi pi-star",
      description: "Selecciona los servicios que puedes ofrecer",
    },
    {
      label: "Información Académica",
      icon: "pi pi-book",
      description: "Datos de tu universidad y carrera",
    },
    {
      label: "Verificación",
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
    return (
      <div className="h-full flex flex-col py-8 px-6 overflow-hidden">
        {/* Logo arriba de los steps */}
        <div className="flex justify-center mb-8">
          <img
            src="https://res.cloudinary.com/dfgjenml4/image/upload/v1737657583/logoDark_uvqsz9.png"
            alt="Favorcito Logo"
            className="h-8 object-contain transition-all duration-300 hover:opacity-90"
          />
        </div>

        {/* Contenedor principal con overflow hidden para eliminar el scroll */}
        <div className="flex-grow flex flex-col justify-between overflow-hidden">
          <div className="relative" ref={stepsContainerRef}>
            {/* Línea vertical de progreso - Calculada dinámicamente */}
            {lineHeight > 0 && (
              <div
                className="absolute left-5 top-5 w-0.5 bg-neutral-gray -z-10"
                style={{
                  height: `${lineHeight}px`,
                }}
              >
                <div
                  className="w-full bg-primary-dark transition-all duration-300"
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

            {/* Pasos verticales */}
            <div className="space-y-12">
              {steps.map((step, index) => (
                <div
                  key={index}
                  className={`
                    relative flex items-start cursor-pointer
                    ${
                      index < activeIndex
                        ? "hover:opacity-90 hover:translate-x-1"
                        : ""
                    }
                    pl-14 pr-4 py-3 rounded-xl transition-all duration-200 
                    ${index === activeIndex ? "px-10" : ""}
                  `}
                  onClick={() => handleClick(index)}
                >
                  {/* Círculo del paso */}
                  <div
                    className={`
                      step-circle
                      absolute left-0 w-10 h-10 rounded-full flex items-center justify-center 
                      transition-all duration-300 z-10 shadow-sm
                      ${
                        index <= activeIndex
                          ? "bg-primary-dark text-white"
                          : "bg-white border-2 border-neutral-gray text-neutral-gray"
                      }
                      ${
                        index === activeIndex
                          ? "ring-4 ring-primary-dark/20"
                          : ""
                      }
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

          <div className="mt-8 flex flex-col items-center">
            {/* Indicador de progreso */}
            <div className="text-sm text-neutral-gray mb-4">
              {activeIndex + 1} de {steps.length}
            </div>

            {/* Link de "Ya tengo una cuenta" con mejor UI */}
            <div className="flex items-center mt-2">
              <div className="h-px w-16 bg-neutral-gray/20"></div>
              <button
                onClick={handleLoginClick}
                className="mx-3 text-primary-dark font-medium text-sm hover:text-primary-dark/80 transition-colors"
              >
                Ya tengo una cuenta
              </button>
              <div className="h-px w-16 bg-neutral-gray/20"></div>
            </div>
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
