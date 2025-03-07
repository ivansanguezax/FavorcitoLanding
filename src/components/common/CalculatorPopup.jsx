import { Button } from "primereact/button";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { useState, useEffect } from "react";

// Text variations for different loads
const popupTexts = [
    {
      title: "¿Cuánta trabajo estás dejando pasar?",
      earnings: "Bs 1.500 al mes",
      description: "Aprovecha tu tiempo libre y convierte tus habilidades en dinero.",
      button: "Calcular ahora"
    },
    {
      title: "Si otros están ganando, ¿por qué tú no?",
      earnings: "Bs 1.800 al mes",
      description: "Haz favores rápidos y empieza a generar ingresos extra.",
      button: "Ver cuánto puedo ganar"
    },
    {
      title: "Deja de buscar, aquí hay trabajo fácil",
      earnings: "Bs 1.300 al mes",
      description: "Solo necesitas tu tiempo y ganas de hacer favores para ganar dinero.",
      button: "Descubre cómo"
    },
    {
      title: "La oportunidad está aquí, ¿te animas?",
      earnings: "Bs 1.700 al mes",
      description: "Ayuda a otros con tareas simples y llévate tu recompensa.",
      button: "Probar la calculadora"
    }
  ];
  

const CalculatorPopup = ({ onClose }) => {
  const navigate = useNavigate();
  // State to store the selected text variation
  const [textVariation, setTextVariation] = useState(null);

  // On component mount, select a random text variation
  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * popupTexts.length);
    setTextVariation(popupTexts[randomIndex]);
  }, []);

  const handleCalculatorClick = () => {
    navigate("/calculadora");
    onClose();
  };

  // Don't render until we have selected a text variation
  if (!textVariation) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="relative w-full max-w-md rounded-xl overflow-hidden shadow-xl">
        {/* Close button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-10 text-neutral-light/90 hover:text-neutral-light w-8 h-8 rounded-full flex items-center justify-center transition-colors"
          aria-label="Cerrar"
        >
          <i className="pi pi-times text-sm"></i>
        </button>
        
        {/* Student badge - repositioned for better visibility */}
        <div className="absolute top-0 left-0 z-10">
          <span className="inline-block bg-accent text-primary-dark text-xs font-normal tracking-wide px-3 py-1.5 rounded-br-lg">
            PARA UNIVERSITARIOS
          </span>
        </div>

        {/* Main content */}
        <div className="bg-gradient-to-br from-primary-dark to-primary-dark/90 p-6 sm:p-8">
          {/* Calculator icon */}
          <div className="mx-auto w-14 h-14 mb-6 bg-primary-light rounded-lg flex items-center justify-center">
            <i className="pi pi-calculator text-primary-dark text-xl"></i>
          </div>

          {/* Dynamic title */}
          <h2 className="text-xl sm:text-2xl font-medium text-neutral-light mb-6 text-center leading-snug">
            {textVariation.title}
          </h2>

          {/* Earnings highlight with dynamic text */}
          <div className="bg-white/8 py-4 px-4 rounded-lg mb-6 border border-white/10">
            <p className="text-neutral-light text-sm font-light mb-2 text-center">
              Los estudiantes están ganando:
            </p>
            <div className="text-2xl sm:text-3xl font-bold text-accent mb-2 text-center">
              {textVariation.earnings}
            </div>
            <p className="text-neutral-light/70 text-xs font-light text-center">
              {textVariation.description}
            </p>
          </div>

          {/* Action buttons with dynamic text */}
          <div className="flex flex-col-reverse sm:flex-row justify-between gap-3 mt-6">

            <Button
              label={textVariation.button}
              icon="pi pi-arrow-right"
              iconPos="right"
              onClick={handleCalculatorClick}
              className="bg-primary-light w-full hover:bg-primary-light/90 text-primary-dark px-5 py-2.5 rounded-full font-medium text-sm"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

CalculatorPopup.propTypes = {
  onClose: PropTypes.func.isRequired,
};

export default CalculatorPopup;