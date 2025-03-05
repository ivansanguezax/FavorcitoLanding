import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <>
      <Helmet>
        <title>Página no encontrada | Favorcito</title>
        <meta
          name="description"
          content="Lo sentimos, la página que buscas no existe. Explora los servicios disponibles de Favorcito."
        />
      </Helmet>

      <div className="min-h-screen flex flex-col items-center justify-center bg-neutral-light px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-md w-full mx-auto text-center"
        >
          <motion.img
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            src="https://res.cloudinary.com/dfgjenml4/image/upload/v1740757375/icon404_oaeerr.png"
            alt="Página no encontrada"
            className="w-40 h-40 mx-auto mb-8"
          />

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <h1 className="text-3xl font-bold text-primary-dark mb-4">
              ¡Ups! Este favorcito no está disponible 😬
            </h1>

            <p className="text-neutral-dark mb-8">
              Parece que esta página se tomó un descanso… pero no te preocupes,
              aún hay muchos estudiantes listos para ayudarte.
            </p>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/")}
              className="px-6 py-3 bg-primary-dark text-white rounded-full font-medium hover:bg-opacity-90 transition-all duration-300 flex items-center justify-center gap-2 mx-auto"
            >
              <span>✨ Ver favorcitos disponibles</span>
              <i className="pi pi-arrow-right"></i>
            </motion.button>
          </motion.div>
        </motion.div>
      </div>
    </>
  );
};

export default NotFound;
