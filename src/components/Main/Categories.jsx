import { useState } from 'react'
import { motion } from 'framer-motion'

const categories = [
  // Primera fila - Categorías más demandadas
  {
    id: 1,
    title: "Clases\nParticulares",
    icon: "pi pi-book",
    description: "Apoyo escolar y universitario",
    popular: true
  },
  {
    id: 2,
    title: "Sistemas y\nComputación",
    icon: "pi pi-desktop",
    description: "Soporte técnico y programación",
    popular: true
  },
  {
    id: 3,
    title: "Desarrollo\nWeb",
    icon: "pi pi-code",
    description: "Páginas web y sistemas",
    popular: true
  },
  {
    id: 4,
    title: "Trámites y\nGestiones",
    icon: "pi pi-file",
    description: "Servicios administrativos",
    popular: true
  },
  {
    id: 5,
    title: "Chef a\nDomicilio",
    icon: "pi pi-stop",
    description: "Comida casera y eventos",
    popular: true
  },
  // Categorías adicionales
  {
    id: 6,
    title: "Transporte y\nMudanza",
    icon: "pi pi-truck",
    description: "Fletes, mudanzas y envíos"
  },
  {
    id: 7,
    title: "Maestro\nAlbañil",
    icon: "pi pi-wrench",
    description: "Reparaciones y arreglos"
  },
  {
    id: 8,
    title: "Cuidado\nPersonal",
    icon: "pi pi-heart",
    description: "Cuidado de adultos mayores"
  },
  {
    id: 9,
    title: "Jardinería",
    icon: "pi pi-inbox",
    description: "Mantenimiento de jardines"
  },
  {
    id: 10,
    title: "Mascotas",
    icon: "pi pi-heart-fill",
    description: "Cuidado y paseo"
  },
  {
    id: 11,
    title: "Música y\nEventos",
    icon: "pi pi-volume-up",
    description: "DJ y animación"
  },
  {
    id: 12,
    title: "Técnico\nElectrónico",
    icon: "pi pi-mobile",
    description: "Reparación de equipos"
  },
  {
    id: 13,
    title: "Servicio\nDoméstico",
    icon: "pi pi-home",
    description: "Limpieza y organización"
  },
  {
    id: 14,
    title: "Personal\nTrainer",
    icon: "pi pi-user",
    description: "Entrenamiento personalizado"
  },
  {
    id: 15,
    title: "Arquitectura",
    icon: "pi pi-building",
    description: "Diseño y planos"
  },
  {
    id: 16,
    title: "Fotografía",
    icon: "pi pi-camera",
    description: "Sesiones y edición"
  },
  {
    id: 17,
    title: "Diseño",
    icon: "pi pi-pencil",
    description: "Gráfico y digital"
  },
  {
    id: 18,
    title: "Modelaje",
    icon: "pi pi-video",
    description: "Promociones y eventos"
  },
  {
    id: 19,
    title: "Otros",
    icon: "pi pi-bolt",
    description: "Servicios varios"
  },
  {
    id: 20,
    title: "Contabilidad",
    icon: "pi pi-calculator",
    description: "Servicios contables"
  }
]

export const Categories = () => {
  const [showAll, setShowAll] = useState(false)
  
  const visibleCategories = showAll 
    ? categories 
    : categories.filter(cat => cat.popular)

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
            {showAll ? "Mostrar menos" : "Ver más categorías"}
          </button>
        </motion.div>
      </div>
    </section>
  )
}