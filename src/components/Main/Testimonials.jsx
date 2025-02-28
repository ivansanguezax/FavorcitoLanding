// src/components/Main/Testimonials.jsx
"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import PropTypes from "prop-types";

export const Testimonials = ({ autoplay = true }) => {
  const testimonials = [
    {
      quote:
        "El estudiante hizo mi mudanza mucho más fácil. Fue muy organizado, dedicado y resolvió cada detalle con profesionalismo. ¡Un gran apoyo!",
      name: "Silvana Gutierrez",
      designation: "",
      service: "Mudanza",
      icon: "pi pi-truck",
      src: "https://res.cloudinary.com/dfgjenml4/image/upload/v1740753756/sil_efarw9.jpg",
    },
    {
      quote:
        "El servicio fue rápido y eficiente, me ahorró mucho tiempo en mis trámites. ¡Definitivamente volvería a usarlo, muy recomendado!",
      name: "Sara Salazar",
      designation: "Servicio: Trámites y Diligencias",
      service: "Trámites y Diligencias",
      icon: "pi pi-file",
      src: "https://res.cloudinary.com/dfgjenml4/image/upload/v1740753755/sara_a8zfin.jpg",
    },
    {
      quote:
        "El estudiante hizo un excelente trabajo con mi computadora, fue detallista y dejó todo funcionando perfectamente. Un servicio técnico de calidad.",
      name: "Carla Alejo",
      designation: "Servicio: Técnico de Computadoras",
      service: "Técnico de Computadoras",
      icon: "pi pi-desktop",
      src: "https://res.cloudinary.com/dfgjenml4/image/upload/v1740753755/carla_z2fzhi.jpg",
    },
    {
      quote:
        "Me encantó el servicio, no tuve que perder horas en la fila y todo se resolvió sin complicaciones. ¡Muy útil y 100% recomendable!",
      name: "Viviana Coloma",
      designation: "Servicio: Fila en Tramite",
      service: "Fila en Trámite",
      icon: "pi pi-users",
      src: "https://res.cloudinary.com/dfgjenml4/image/upload/v1740753869/SCR-20250228-jtnb_zmetew.png",
    },
  ];

  // Establecer un testimonio aleatorio como inicio
  const [active, setActive] = useState(() => {
    return Math.floor(Math.random() * testimonials.length);
  });

  const handleNext = () => {
    setActive((prev) => (prev + 1) % testimonials.length);
  };

  const handlePrev = () => {
    setActive((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const isActive = (index) => {
    return index === active;
  };

  useEffect(() => {
    if (autoplay) {
      // Aumentar el tiempo a 8 segundos para dar más tiempo de lectura
      const interval = setInterval(handleNext, 8000);
      return () => clearInterval(interval);
    }
  }, [autoplay]);

  const randomRotateY = () => {
    return Math.floor(Math.random() * 21) - 10;
  };

  return (
    <section className="py-16 bg-neutral-light">
      <div className="container mx-auto px-4">
        {/* Título y subtítulo mejorados */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-primary-dark mb-3">
            Testimonios de clientes
          </h2>
          <p className="text-lg text-neutral-dark max-w-2xl mx-auto">
            Descubre las experiencias reales de quienes han confiado en nuestros estudiantes universitarios
          </p>
        </div>

        <div className="max-w-sm md:max-w-4xl mx-auto antialiased font-sans px-4 md:px-8 lg:px-12">
          <div className="relative grid grid-cols-1 md:grid-cols-2 gap-20">
            <div>
              <div className="relative h-80 w-full">
                <AnimatePresence>
                  {testimonials.map((testimonial, index) => (
                    <motion.div
                      key={testimonial.name}
                      initial={{
                        opacity: 0,
                        scale: 0.9,
                        z: -100,
                        rotate: randomRotateY(),
                      }}
                      animate={{
                        opacity: isActive(index) ? 1 : 0.7,
                        scale: isActive(index) ? 1 : 0.95,
                        z: isActive(index) ? 0 : -100,
                        rotate: isActive(index) ? 0 : randomRotateY(),
                        zIndex: isActive(index)
                          ? 999
                          : testimonials.length + 2 - index,
                        y: isActive(index) ? [0, -80, 0] : 0,
                      }}
                      exit={{
                        opacity: 0,
                        scale: 0.9,
                        z: 100,
                        rotate: randomRotateY(),
                      }}
                      transition={{
                        duration: 0.4,
                        ease: "easeInOut",
                      }}
                      className="absolute inset-0 origin-bottom"
                    >
                      <img
                        src={testimonial.src}
                        alt={testimonial.name}
                        className="h-full w-full rounded-3xl object-cover object-center"
                        draggable={false}
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
            <div className="flex justify-between flex-col py-4">
              <motion.div
                key={active}
                initial={{
                  y: 20,
                  opacity: 0,
                }}
                animate={{
                  y: 0,
                  opacity: 1,
                }}
                exit={{
                  y: -20,
                  opacity: 0,
                }}
                transition={{
                  duration: 0.2,
                  ease: "easeInOut",
                }}
              >
                <h3 className="text-2xl font-bold text-black">
                  {testimonials[active].name}
                </h3>
                
                {/* Servicio con icono */}
                <div className="flex items-center mt-1 space-x-2">
                  <div className="w-6 h-6 flex items-center justify-center bg-primary-light rounded-full text-primary-dark">
                    <i className={`${testimonials[active].icon} text-sm`}></i>
                  </div>
                  <p className="text-sm text-primary-dark font-medium">
                    {testimonials[active].service}
                  </p>
                </div>
                
                <motion.p className="text-lg text-gray-500 mt-6">
                  {testimonials[active].quote.split(" ").map((word, index) => (
                    <motion.span
                      key={index}
                      initial={{
                        filter: "blur(10px)",
                        opacity: 0,
                        y: 5,
                      }}
                      animate={{
                        filter: "blur(0px)",
                        opacity: 1,
                        y: 0,
                      }}
                      transition={{
                        duration: 0.2,
                        ease: "easeInOut",
                        delay: 0.02 * index,
                      }}
                      className="inline-block"
                    >
                      {word}&nbsp;
                    </motion.span>
                  ))}
                </motion.p>
              </motion.div>
              <div className="flex gap-4 pt-12 md:pt-0">
                <button
                  onClick={handlePrev}
                  className="h-8 w-8 rounded-full  bg-primary-dark flex items-center justify-center group/button hover:bg-primary-light transition-colors duration-300"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-white group-hover/button:text-black  group-hover/button:rotate-12 transition-all duration-300"
                    viewBox="0 0 24 24"
                    strokeWidth="2"
                    stroke="currentColor"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                    <path d="M5 12l14 0" />
                    <path d="M5 12l6 6" />
                    <path d="M5 12l6 -6" />
                  </svg>
                </button>
                <button
                  onClick={handleNext}
                  className="h-8 w-8 rounded-full  bg-primary-dark flex items-center justify-center group/button hover:bg-primary-light transition-colors duration-300"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-white group-hover/button:text-black  group-hover/button:-rotate-12 transition-all duration-300"
                    viewBox="0 0 24 24"
                    strokeWidth="2"
                    stroke="currentColor"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                    <path d="M5 12l14 0" />
                    <path d="M13 18l6 -6" />
                    <path d="M13 6l6 6" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;

Testimonials.propTypes = {
  autoplay: PropTypes.bool,
};