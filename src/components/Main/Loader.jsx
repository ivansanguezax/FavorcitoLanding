import React, { useState, useEffect } from 'react';
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
      className="fixed inset-0 bg-[#02533C] flex flex-col items-center justify-center z-50"
    >
      <motion.img
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        src="https://res.cloudinary.com/dfgjenml4/image/upload/v1737657600/logoLigth_gbv7ds.png"
        alt="Logo"
        className="h-16 md:h-20 w-auto mb-8"
      />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <motion.p
          key={currentPhrase}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="text-primary-light text-lg md:text-xl font-light"
        >
          {phrases[currentPhrase]}
        </motion.p>
      </motion.div>
    </motion.div>
  );
};

export default Loader;