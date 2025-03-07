import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { FlipWords } from "../common/FlipWords";
import { Button } from "primereact/button";
import { useState, useEffect } from "react";

const words = [
  "las filas",
  "limpieza",
  "mudanza",
  "tu carro",
  "catering",
  "maquillaje",
  "ejercicios",
];

// Array de diferentes CTAs para el botón
const ctaVariations = [
  {
    label: "Ganar dinero con mis habilidades",
    icon: "pi pi-briefcase"
  },
  {
    label: "Registrarme como estudiante",
    icon: "pi pi-user-check"
  },
  {
    label: "Empezar a hacer favores",
    icon: "pi pi-check-circle"
  },
  {
    label: "Ver trabajos para estudiantes",
    icon: "pi pi-search"
  }
];


export const Hero = () => {
  const navigate = useNavigate();
  const [currentCta, setCurrentCta] = useState(null);

  // Seleccionar una CTA aleatoria al cargar el componente
  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * ctaVariations.length);
    setCurrentCta(ctaVariations[randomIndex]);
  }, []);

  const handleStudentRegister = () => {
    navigate('/auth');
  };

  // No renderizar hasta que tengamos una CTA seleccionada
  if (!currentCta) return null;

  return (
    <section className="w-full pt-28 md:pt-36 pb-12 relative overflow-hidden">
      <div className="container mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="space-y-6 max-w-2xl text-center lg:text-left mx-auto lg:mx-0"
          >
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight text-primary-dark">
              ¿Necesitas ayuda con{" "}
              <span className="inline-flex">
                <FlipWords
                  words={words}
                  className="text-primary-dark font-bold"
                  duration={2500}
                />
              </span>
              ?
            </h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="text-lg md:text-xl text-neutral-dark leading-relaxed inline-flex items-center justify-center lg:justify-start flex-wrap gap-1"
            >
              Pide tu
              <img
                src="https://res.cloudinary.com/dfgjenml4/image/upload/v1738003319/favButtton_kxmrya.png"
                alt="Favorcito"
                className="h-[1.25em] inline-block mx-1"
              /> ahora y deja que un universitario te ayude.
            </motion.p>

            {/* CTA Buttons - Uno en desktop, dos en mobile */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mt-8 mb-4 sm:my-4"
            >
              <Button
                onClick={handleStudentRegister}
                className="border-2 border-[#02533C] text-[#02533C] hover:bg-[#02533C] hover:text-white transition-all duration-300 px-6 py-2 rounded-full font-light flex items-center gap-2"
                label={currentCta.label}
                icon={currentCta.icon}
                iconPos="right"
              />
              <Button
                onClick={() => window.location.href = "https://app.tufavorcito.com"}
                className="sm:hidden bg-[#02533C] text-white hover:bg-[#02533C]/90 border-2 border-transparent hover:border-[#02533C] transition-all duration-300 px-6 py-2 rounded-full font-light flex items-center gap-2"
                label="Quiero un favorcito"
                icon="pi pi-arrow-up-right"
                iconPos="right"
              />
            </motion.div>
          </motion.div>

          {/* Right Image */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="relative h-full min-h-[350px] lg:min-h-[600px]"
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-neutral-light opacity-100 z-10" />

              <img
                src="https://res.cloudinary.com/dfgjenml4/image/upload/v1738006441/heroImages_vzvddp.png"
                alt="Hero"
                className="w-full h-full object-contain object-center relative z-0"
              />

              <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 z-20 w-[36rem] max-w-[90%]">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8, duration: 0.5 }}
                  className="bg-primary-dark px-8 py-3 rounded-full text-center"
                >
                  <p className="text-primary-light text-sm sm:text-lg md:text-xl font-medium">
                    Convierte tu talento en ingresos
                  </p>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Background decoration */}
      <motion.div
        className="absolute -top-1/2 -right-1/4 w-96 h-96 bg-primary-light rounded-full filter blur-3xl opacity-30"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.3 }}
        transition={{ duration: 1.5 }}
      />
    </section>
  );
};