import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Button } from "primereact/button";

const TopBanner = () => {
  const [currentPhrase, setCurrentPhrase] = useState(null);
  const navigate = useNavigate();

  // Banner phrases that change on each load
  const bannerPhrases = [
    {
      title: "Calcula cuánto podrías ganar",
      description: "Descubre en segundos cuánto vale tu tiempo y tus habilidades"
    },
    {
      title: "Tu tiempo es dinero",
      description: "Mira cuánto podrías estar ganando cada mes con tareas simples"
    },
    {
      title: "No dejes pasar esta oportunidad",
      description: "Haz el cálculo y empieza a ganar con lo que ya sabes hacer"
    },
    {
      title: "Gana más sin descuidar la U",
      description: "Aprovecha tu tiempo libre y genera ingresos sin complicaciones"
    }
  ];
  

  // Select a random phrase on component mount
  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * bannerPhrases.length);
    setCurrentPhrase(bannerPhrases[randomIndex]);
  }, []);

  const handleCalculatorClick = () => {
    navigate("/calculadora");
  };

  if (!currentPhrase) return null;

  return (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: "48px", opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="fixed top-0 left-0 right-0 bg-gradient-to-r from-primary-dark to-primary-dark/90 z-[55] w-full"
    >
      <div className="max-w-screen-xl mx-auto flex items-center justify-between px-3 sm:px-4 h-full">
        {/* Left content - icon and text */}
        <div className="flex items-center overflow-hidden">
          <div className="flex-shrink-0 flex items-center justify-center bg-accent h-6 w-6 rounded-full mr-2">
            <i className="pi pi-bolt text-primary-dark text-xs"></i>
          </div>
          
          {/* Show only title on mobile, show title and description on larger screens */}
          <div className="text-white truncate">
            <span className="text-xs sm:text-sm font-medium">{currentPhrase.title}</span>
            <span className="hidden sm:inline text-xs sm:text-sm text-white/80 ml-2 truncate">
              {currentPhrase.description}
            </span>
          </div>
        </div>
        
        {/* Button with no label on smallest screens */}
        <Button
          label={window.innerWidth < 375 ? "" : "Calcular"}
          icon="pi pi-calculator"
          onClick={handleCalculatorClick}
          className="p-button-sm bg-white text-primary-dark text-xs font-medium hover:bg-white/90 rounded-full px-2 sm:px-3 py-1 shadow-sm flex-shrink-0"
        />
      </div>
    </motion.div>
  );
};

export default TopBanner;