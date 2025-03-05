import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const fixedCategories = [
  {
    id: 1,
    title: "Clases\nParticulares",
    icon: "pi pi-book",
    description: "Apoyo escolar y preuniversitario",
    popular: true,
  },
  {
    id: 2,
    title: "Trámites y\nDiligencias",
    icon: "pi pi-file",
    description: "Servicios en instituciones públicas",
    popular: true,
  },
  {
    id: 3,
    title: "Compras en el\nMercado",
    icon: "pi pi-shopping-cart",
    description: "Mandados y entregas a domicilio",
    popular: true,
  },
  {
    id: 4,
    title: "Mil\nOficios",
    icon: "pi pi-wrench",
    description: "Todo tipo de chambas y arreglos",
    popular: true,
  },
  {
    id: 5,
    title: "Paseo de\nMascotas",
    icon: "pi pi-heart-fill",
    description: "Cuidado y atención de mascotas",
    popular: true,
  },
];

const dynamicCategories = [
  {
    id: 6,
    title: "Cuidado de\nAbuelitos",
    icon: "pi pi-heart",
    description: "Acompañamiento y atención",
  },
  {
    id: 7,
    title: "Cocinero a\nDomicilio",
    icon: "pi pi-stop",
    description: "Comida casera y eventos",
  },
  {
    id: 8,
    title: "Manicure y\nPedicure",
    icon: "pi pi-star",
    description: "Arreglo de uñas a domicilio",
  },
  {
    id: 9,
    title: "Mecánico\nCasero",
    icon: "pi pi-cog",
    description: "Reparación de vehículos",
  },
  {
    id: 10,
    title: "Jardinero",
    icon: "pi pi-inbox",
    description: "Arreglo de jardines y plantas",
  },
  {
    id: 11,
    title: "Técnico de\nComputadoras",
    icon: "pi pi-desktop",
    description: "Reparación de PCs y laptops",
  },
  {
    id: 12,
    title: "Entrenador\nPersonal",
    icon: "pi pi-user",
    description: "Rutinas y ejercicios",
  },
  {
    id: 13,
    title: "Fotógrafo",
    icon: "pi pi-camera",
    description: "Fotos para eventos y documentos",
  },
  {
    id: 14,
    title: "Técnico\nInstalador",
    icon: "pi pi-mobile",
    description: "Instalación de equipos",
  },
  {
    id: 15,
    title: "Mesero\nEventos",
    icon: "pi pi-users",
    description: "Atención en fiestas y eventos",
  },
  {
    id: 16,
    title: "Páginas\nWeb",
    icon: "pi pi-globe",
    description: "Desarrollo de sitios web",
  },
  {
    id: 17,
    title: "Creador de\nContenido",
    icon: "pi pi-video",
    description: "Videos para redes sociales",
  },
  {
    id: 18,
    title: "Editor de\nVideos",
    icon: "pi pi-camera",
    description: "Edición semi-profesional",
  },
  {
    id: 19,
    title: "Diseñador\nGráfico",
    icon: "pi pi-pencil",
    description: "Logos y material publicitario",
  },
  {
    id: 20,
    title: "Otros\nServicios",
    icon: "pi pi-bolt",
    description: "Servicios varios",
    isLast: true,
  },
];

export const Categories = () => {
  const [showAll, setShowAll] = useState(false);
  const [shuffledCategories, setShuffledCategories] = useState([]);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };

    checkMobile();

    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    const othersCategory = dynamicCategories.find((cat) => cat.isLast);
    const categoriesToShuffle = dynamicCategories.filter((cat) => !cat.isLast);

    const shuffled = [...categoriesToShuffle];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    setShuffledCategories([...shuffled, othersCategory]);
  }, []);

  let visibleCategories;

  if (showAll) {
    visibleCategories = [...fixedCategories, ...shuffledCategories];
  } else {
    if (isMobile) {
      visibleCategories = [...fixedCategories, shuffledCategories[0]];
    } else {
      visibleCategories = fixedCategories;
    }
  }

  return (
    <section className="py-16 px-4 md:px-8 bg-neutral-light">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-primary-dark mb-4">
            Servicios populares
          </h2>
          <p className="text-lg text-neutral-dark">
            Encuentra el universitario ideal para tu necesidad
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4"
          layout
        >
          {visibleCategories.map((category) => (
            <motion.div
              key={category.id}
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="bg-white p-4 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 cursor-pointer group"
            >
              <div className="flex flex-col items-center text-center space-y-3">
                <div className="w-12 h-12 flex items-center justify-center bg-primary-light rounded-full text-primary-dark group-hover:bg-primary-dark group-hover:text-primary-light transition-colors duration-300">
                  <i className={`${category.icon} text-2xl`}></i>
                </div>
                <h3 className="font-medium text-neutral-dark whitespace-pre-line">
                  {category.title}
                </h3>
                <p className="text-sm text-neutral-gray hidden md:block">
                  {category.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          className="text-center mt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <button
            onClick={() => setShowAll(!showAll)}
            className="bg-white text-primary-dark border-2 border-primary-dark px-6 py-2 rounded-full font-medium hover:bg-primary-dark hover:text-white transition-colors duration-300"
          >
            {showAll ? "Mostrar menos" : "Ver más servicios"}
          </button>
        </motion.div>
      </div>
    </section>
  );
};
