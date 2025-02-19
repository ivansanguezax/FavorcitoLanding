import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Helmet } from "react-helmet-async";
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
      <Helmet>
        <title>Favorcito | Conecta con Estudiantes Universitarios para Tareas Diarias</title>
        <meta name="description" content="Favorcito - Conectamos estudiantes universitarios con personas que necesitan ayuda. Servicios de mudanza, desarrollo web, reparaciones y más. La mejor plataforma de microtrabajos en Bolivia." />
        <meta name="keywords" content="Favorcito, favores Bolivia, microtrabajos, estudiantes universitarios, ayuda universitaria, servicios estudiantiles, ganar dinero estudiando, tareas Bolivia" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Favorcito" />
        <meta property="og:title" content="Favorcito | Ayuda Universitaria a Tu Alcance" />
        <meta property="og:description" content="Conectamos estudiantes universitarios con personas que necesitan ayuda. Servicios confiables y económicos para tus tareas diarias. ¡Apoya el talento universitario!" />
        <meta property="og:image" content="https://res.cloudinary.com/dfgjenml4/image/upload/v1738023031/banner_ojqkje.png" />
        <meta property="og:image:alt" content="Favorcito - Plataforma de servicios universitarios" />
        <meta property="og:url" content="https://tufavorcito.com" />
        <meta property="og:locale" content="es_BO" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@favorcito" />
        <meta name="twitter:title" content="Favorcito | Servicios Universitarios en Bolivia" />
        <meta name="twitter:description" content="Encuentra ayuda confiable de estudiantes universitarios para tus tareas. Mudanzas, desarrollo web, reparaciones y más. ¡Apoya el talento joven!" />
        <meta name="twitter:image" content="https://res.cloudinary.com/dfgjenml4/image/upload/v1738023031/banner_ojqkje.png" />
        <meta name="twitter:image:alt" content="Favorcito - Servicios universitarios" />
        <link rel="canonical" href="https://tufavorcito.com" />
        <script type="application/ld+json">{`
          {
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": "Favorcito",
            "url": "https://tufavorcito.com",
            "description": "Plataforma que conecta estudiantes universitarios con personas que necesitan ayuda en tareas cotidianas.",
            "applicationCategory": "Servicios",
            "operatingSystem": "Web",
            "offers": {
              "@type": "Offer",
              "description": "Servicios de ayuda por estudiantes universitarios"
            },
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": "4.8",
              "ratingCount": "1250"
            }
          }
        `}</script>
      </Helmet>

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

export default MainLayout;