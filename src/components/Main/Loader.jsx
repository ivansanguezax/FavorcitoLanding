import  { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const Loader = () => {
  const [currentPhrase, setCurrentPhrase] = useState(0);
  
  const phrases = [
    "Buscando al universitario perfecto",
    "Cargando favores con dedicación estudiantil",
    "En un momento conectamos la ayuda que necesitas",
    "¿Sabías que cada Favorcito ayuda a un estudiante a crecer?",
    "Haciendo match entre tu tarea y el talento joven"
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPhrase((prev) => (prev + 1) % phrases.length);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="fixed inset-0 bg-[#02533C] flex flex-col items-center justify-center z-50 px-4"
    >
      <motion.img
        initial={{ scale: 0.9, opacity: 0, y: 10 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ 
          duration: 0.8,
          ease: "easeOut",
          opacity: { duration: 0.4 }
        }}
        src="https://res.cloudinary.com/dfgjenml4/image/upload/v1737657600/logoLigth_gbv7ds.png"
        alt="Logo"
        className="h-12 sm:h-14 md:h-16 lg:h-20 w-auto mb-6 md:mb-8"
      />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ 
          duration: 0.5,
          delay: 0.3
        }}
        className="text-center max-w-[280px] sm:max-w-sm md:max-w-md lg:max-w-lg"
      >
        <motion.p
          key={currentPhrase}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="text-primary-light text-sm sm:text-base md:text-lg lg:text-xl font-light"
        >
          {phrases[currentPhrase]}
        </motion.p>
      </motion.div>
    </motion.div>
  );
};

export default Loader;