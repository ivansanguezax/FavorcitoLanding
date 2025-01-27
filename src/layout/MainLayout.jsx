import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Categories } from "../components/Main/Categories";
import Footer from "../components/Main/Footer";
import { Hero } from "../components/Main/Hero";
import { Navbar } from "../components/Main/Navbar";
import Popular from "../components/Main/Popular";
import StepByStep from "../components/Main/StepByStep";
import Loader from "../components/Main/Loader";

export const MainLayout = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Función para precargar imágenes
    const preloadImages = async () => {
      const imageUrls = [
        "https://res.cloudinary.com/dfgjenml4/image/upload/v1737657600/logoLigth_gbv7ds.png",
        "https://res.cloudinary.com/dfgjenml4/image/upload/v1737657583/logoDark_uvqsz9.png",
        // Agrega aquí todas las URLs de imágenes que necesites precargar
      ];

      try {
        const loadImage = (url) => {
          return new Promise((resolve, reject) => {
            const img = new Image();
            img.src = url;
            img.onload = resolve;
            img.onerror = reject;
          });
        };

        await Promise.all(imageUrls.map(loadImage));
        
        // Añade un pequeño delay para mostrar el loader
        setTimeout(() => {
          setIsLoading(false);
        }, 3000);
      } catch (error) {
        console.error("Error loading images:", error);
        setIsLoading(false);
      }
    };

    preloadImages();
  }, []);

  return (
    <>
      <AnimatePresence mode="wait">
        {isLoading ? (
          <Loader key="loader" />
        ) : (
          <motion.div
            key="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="min-h-screen bg-neutral-light"
          >
            <Navbar />
            <Hero />
            <Categories />
            <Popular />
            <StepByStep />
            <Footer />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};