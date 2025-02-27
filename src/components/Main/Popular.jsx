import { useEffect, useRef, useState, createContext, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowLeft, ArrowRight } from "lucide-react";
import PropTypes from "prop-types";

const CarouselContext = createContext({
  onCardClose: (index) => {},
  currentIndex: 0,
});

const useOutsideClick = (ref, callback) => {
  useEffect(() => {
    const listener = (event) => {
      if (!ref.current || ref.current.contains(event.target)) return;
      callback(event);
    };

    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener);

    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
    };
  }, [ref, callback]);
};

const Popular = () => {
  const data = [
    {
      category: "Mudanza",
      title: "Te ayudamos con tu mudanza",
      src: "https://res.cloudinary.com/dfgjenml4/image/upload/v1738017524/mudanza_de_taman%CC%83o_mediano_oi6ajn.png",
      content: (
        <div className="bg-neutral-light p-8 md:p-14 rounded-3xl mb-4">
          <p className="text-neutral-dark text-sm md:text-base max-w-3xl mx-auto">
            <span className="font-medium text-primary-dark">
              ¡Mudarte nunca fue tan fácil!
            </span>{" "}
            Estudiantes experimentados te ayudarán a empacar, cargar y organizar
            tus pertenencias. Servicio seguro y eficiente para que tu mudanza
            sea sin estrés.
          </p>
        </div>
      ),
    },
    {
      category: "Cocina",
      title: "Chef a domicilio para tus eventos",
      src: "https://res.cloudinary.com/dfgjenml4/image/upload/v1738017523/cocina_de_taman%CC%83o_mediano_mz4mwo.png",
      content: (
        <div className="bg-neutral-100 dark:bg-neutral-800 p-8 md:p-14 rounded-3xl mb-4">
          <p className="text-neutral-600 dark:text-neutral-400 text-sm md:text-base max-w-3xl mx-auto">
            <span className="font-medium text-neutral-700 dark:text-neutral-200">
              Estudiantes de gastronomía a tu servicio
            </span>{" "}
            Prepara tu evento especial con chefs estudiantes talentosos. Menús
            personalizados y servicio profesional a precios accesibles.
          </p>
        </div>
      ),
    },
    {
      category: "Mecánica",
      title: "Mantenimiento de tu carro",
      src: "https://res.cloudinary.com/dfgjenml4/image/upload/v1738017524/mecanico_de_taman%CC%83o_mediano_daqfyg.png",
      content: (
        <div className="bg-neutral-100 dark:bg-neutral-800 p-8 md:p-14 rounded-3xl mb-4">
          <p className="text-neutral-600 dark:text-neutral-400 text-sm md:text-base max-w-3xl mx-auto">
            <span className="font-medium text-neutral-700 dark:text-neutral-200">
              Mecánicos en formación a tu alcance
            </span>{" "}
            Estudiantes de mecánica automotriz te ayudan con el mantenimiento
            básico de tu carro. Diagnósticos precisos y soluciones efectivas.
          </p>
        </div>
      ),
    },
    {
      category: "Lavado",
      title: "Limpieza profesional de tu auto",
      src: "https://res.cloudinary.com/dfgjenml4/image/upload/v1738017524/lavar_de_taman%CC%83o_mediano_tupp47.png",
      content: (
        <div className="bg-neutral-100 dark:bg-neutral-800 p-8 md:p-14 rounded-3xl mb-4">
          <p className="text-neutral-600 dark:text-neutral-400 text-sm md:text-base max-w-3xl mx-auto">
            <span className="font-medium text-neutral-700 dark:text-neutral-200">
              Tu auto brillará como nuevo
            </span>{" "}
            Servicio de lavado y detallado por estudiantes comprometidos.
            Interior y exterior, utilizando productos de calidad.
          </p>
        </div>
      ),
    },
    {
      category: "Desarrollo Web",
      title: "Diseño y desarrollo web personalizado",
      src: "https://res.cloudinary.com/dfgjenml4/image/upload/v1738017524/web_de_taman%CC%83o_mediano_i9vfw7.png",
      content: (
        <div className="bg-neutral-100 dark:bg-neutral-800 p-8 md:p-14 rounded-3xl mb-4">
          <p className="text-neutral-600 dark:text-neutral-400 text-sm md:text-base max-w-3xl mx-auto">
            <span className="font-medium text-neutral-700 dark:text-neutral-200">
              Tu presencia digital en manos expertas
            </span>{" "}
            Estudiantes de programación crearán tu sitio web con las últimas
            tecnologías. Diseños modernos y funcionales a precios estudiantiles.
          </p>
        </div>
      ),
    },
    {
      category: "Servicios Generales",
      title: "Soluciones para el hogar",
      src: "https://res.cloudinary.com/dfgjenml4/image/upload/v1738017523/luz_de_taman%CC%83o_mediano_nvzogf.png",
      content: (
        <div className="bg-neutral-100 dark:bg-neutral-800 p-8 md:p-14 rounded-3xl mb-4">
          <p className="text-neutral-600 dark:text-neutral-400 text-sm md:text-base max-w-3xl mx-auto">
            <span className="font-medium text-neutral-700 dark:text-neutral-200">
              Resuelve cualquier problema del hogar
            </span>{" "}
            Estudiantes multifacéticos para reparaciones, instalaciones y
            mantenimiento general. Servicios confiables y económicos.
          </p>
        </div>
      ),
    },
  ];

  return (
    <div className="w-full h-full py-5">
      <h2 className="max-w-7xl pl-4 mx-auto text-xl md:text-4xl font-bold text-primary-dark">
        Lo más popular
      </h2>
      <Carousel
        items={data.map((card, index) => (
          <Card key={card.src} card={card} index={index} />
        ))}
      />
    </div>
  );
};

const Carousel = ({ items, initialScroll = 0 }) => {
  const carouselRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (carouselRef.current) {
      carouselRef.current.scrollLeft = initialScroll;
      checkScrollability();
    }
  }, [initialScroll]);

  const checkScrollability = () => {
    if (carouselRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;

      setCanScrollLeft(scrollLeft > 10); // Usando un pequeño valor de umbral

      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  const scrollLeft = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: -300, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: 300, behavior: "smooth" });
    }
  };

  useEffect(() => {
    const handleResize = () => {
      checkScrollability();
    };

    window.addEventListener("resize", handleResize);

    checkScrollability();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleCardClose = (index) => {
    if (carouselRef.current) {
      const cardWidth = window.innerWidth < 768 ? 230 : 384;
      const gap = window.innerWidth < 768 ? 16 : 32;
      const scrollPosition = (cardWidth + gap) * (index + 1);
      carouselRef.current.scrollTo({
        left: scrollPosition,
        behavior: "smooth",
      });
      setCurrentIndex(index);
    }
  };

  return (
    <CarouselContext.Provider
      value={{ onCardClose: handleCardClose, currentIndex }}
    >
      <div className="relative w-full">
        <div
          className="flex w-full overflow-x-scroll py-10 md:py-20 scroll-smooth [scrollbar-width:none] relative"
          ref={carouselRef}
          onScroll={checkScrollability}
        >
          <div className="flex flex-row justify-start gap-4 pl-4 max-w-7xl mx-auto">
            {items.map((item, index) => (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{
                  opacity: 1,
                  y: 0,
                  transition: {
                    duration: 0.5,
                    delay: 0.2 * index,
                  },
                }}
                key={`card-${index}`}
                className="last:pr-[5%] md:last:pr-[33%] rounded-3xl"
              >
                {item}
              </motion.div>
            ))}
          </div>
        </div>
        <div className="flex justify-end gap-2 mr-4 md:mr-10 mb-4">
          <button
            className={`relative z-40 h-10 w-10 rounded-full flex items-center justify-center transition-all duration-200 ${
              canScrollLeft
                ? "bg-[#02533C] hover:bg-[#02533C]/90 cursor-pointer shadow-md"
                : "bg-gray-300 cursor-not-allowed"
            }`}
            onClick={scrollLeft}
            disabled={!canScrollLeft}
            aria-label="Desplazar a la izquierda"
          >
            <ArrowLeft
              className={`h-6 w-6 ${
                canScrollLeft ? "text-white" : "text-gray-500"
              }`}
            />
          </button>
          <button
            className={`relative z-40 h-10 w-10 rounded-full flex items-center justify-center transition-all duration-200 ${
              canScrollRight
                ? "bg-[#02533C] hover:bg-[#02533C]/90 cursor-pointer shadow-md"
                : "bg-gray-300 cursor-not-allowed"
            }`}
            onClick={scrollRight}
            disabled={!canScrollRight}
            aria-label="Desplazar a la derecha"
          >
            <ArrowRight
              className={`h-6 w-6 ${
                canScrollRight ? "text-white" : "text-gray-500"
              }`}
            />
          </button>
        </div>
      </div>
    </CarouselContext.Provider>
  );
};

const Card = ({ card, index }) => {
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);
  const { onCardClose } = useContext(CarouselContext);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        handleClose();
      }
    };

    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open]);

  useOutsideClick(containerRef, () => handleClose());

  const handleClose = () => {
    setOpen(false);
    onCardClose(index);
  };

  return (
    <>
      <AnimatePresence>
        {open && (
          <div className="fixed inset-0 h-screen z-50 overflow-auto">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="bg-black/80 backdrop-blur-lg h-full w-full fixed inset-0"
            />
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              ref={containerRef}
              className="max-w-5xl mx-auto bg-white dark:bg-neutral-900 h-fit z-[60] my-10 p-4 md:p-10 rounded-3xl relative"
            >
              <button
                className="sticky top-4 h-8 w-8 right-0 ml-auto bg-black dark:bg-white rounded-full flex items-center justify-center"
                onClick={handleClose}
              >
                <X className="h-6 w-6 text-neutral-100 dark:text-neutral-900" />
              </button>
              <p className="text-base font-medium text-black dark:text-white">
                {card.category}
              </p>
              <p className="text-2xl md:text-4xl font-medium text-neutral-700 mt-4 dark:text-white">
                {card.title}
              </p>
              <div className="py-10">{card.content}</div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      <motion.button
        onClick={() => setOpen(true)}
        className="rounded-3xl bg-neutral-light h-80 w-48 md:h-[36rem] md:w-80 overflow-hidden flex flex-col items-start justify-start relative"
      >
        <div className="absolute h-full top-0 inset-x-0 bg-gradient-to-b from-black/50 via-transparent to-transparent z-20" />
        <div className="relative z-30 p-8">
          <p className="text-white text-xs md:text-sm font-medium text-left">
            {card.category}
          </p>
          <p className="text-white text-base md:text-lg font-medium max-w-xs text-left mt-2 md:block hidden">
            {card.title}
          </p>
        </div>
        <img
          src={card.src}
          alt={card.title}
          className="object-cover absolute inset-0 w-full h-full z-10"
        />
      </motion.button>
    </>
  );
};

export default Popular;

Carousel.propTypes = {
  items: PropTypes.array.isRequired,
  initialScroll: PropTypes.number,
};

Card.propTypes = {
  card: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired,
};
