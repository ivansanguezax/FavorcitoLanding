import { motion } from "framer-motion";
import { FlipWords } from "../common/FlipWords";

const words = [
  "las filas",
  "limpieza",
  "mudanza",
  "tu carro",
  "catering",
  "maquillaje",
  "ejercicios",
];

export const Hero = () => {
  return (
    <section className="w-full  pt-24 md:pt-32 pb-12 relative overflow-hidden">
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
                className="h-[1.25em] inline-block mx-1 "
              /> ahora y deja que un universitario te ayude.
            </motion.p>

            {/* CTA Button */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="flex justify-center lg:justify-start"
            >
              {/* <button className="bg-primary-dark text-white px-8 py-3 rounded-full font-medium hover:bg-opacity-90 transition-all duration-300 transform hover:scale-105">
                Quiero un favorcito
              </button> */}
            </motion.div>
          </motion.div>

          {/* Right Image */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="relative h-full min-h-[400px] lg:min-h-[600px]"
          >
            <div className="absolute inset-0 flex items-center justify-center">
              {/* Gradient overlay for bottom fade effect */}
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-neutral-light opacity-100 z-10" />

              <img
                src="https://res.cloudinary.com/dfgjenml4/image/upload/v1738006441/heroImages_vzvddp.png"
                alt="Hero"
                className="w-full h-full object-contain object-center relative z-0"
              />

              {/* Texto superpuesto en la parte inferior */}
              <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 z-20 w-[36rem] max-w-[90%]">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8, duration: 0.5 }}
                  className="bg-primary-dark px-8 py-3 rounded-full text-center"
                >
                  <p className="text-primary-light text-sm sm:text-lg md:text-xl font-medium ">
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

<div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 w-[36rem] max-w-[90%]">
  <div className="bg-primary-dark px-8 py-3 rounded-full text-center"></div>
</div>;
