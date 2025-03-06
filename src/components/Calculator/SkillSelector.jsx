import { useState } from "react";
import { Button } from "primereact/button";
import PropTypes from "prop-types";

const SkillSelector = ({ selectedSkills, setSelectedSkills }) => {
  const [selectedCategory, setSelectedCategory] = useState('todos');
  const [showOnlySelected, setShowOnlySelected] = useState(false);

  const categories = [
    { name: 'todos', label: 'Todos', icon: 'pi pi-th-large' },
    { name: 'hogar', label: 'Hogar', icon: 'pi pi-home' },
    { name: 'tecnología', label: 'Tecnología', icon: 'pi pi-desktop' },
    { name: 'educación', label: 'Educación', icon: 'pi pi-book' },
    { name: 'cuidados', label: 'Cuidados', icon: 'pi pi-heart' },
    { name: 'eventos', label: 'Eventos', icon: 'pi pi-calendar' },
  ];

  const services = [
    {
      id: 1,
      title: "Clases Particulares",
      icon: "pi pi-book",
      value: "Clases particulares",
      category: "educación",
    },
    {
      id: 2,
      title: "Trámites y Diligencias",
      icon: "pi pi-file",
      value: "Trámites y diligencias",
      category: "hogar",
    },
    {
      id: 3,
      title: "Compras en Mercado",
      icon: "pi pi-shopping-cart",
      value: "Compras en el mercado",
      category: "hogar",
    },
    {
      id: 4,
      title: "Mil Oficios",
      icon: "pi pi-wrench",
      value: "Montar muebles y arreglos basicos del hogar",
      category: "hogar",
    },
    {
      id: 5,
      title: "Paseo de Mascotas",
      icon: "pi pi-heart-fill",
      value: "Cuidado y paseo de mascotas",
      category: "cuidados",
    },
    {
      id: 6,
      title: "Cuidado de Abuelitos",
      icon: "pi pi-heart",
      value: "Cuidado de adultos mayores",
      category: "cuidados",
    },
    {
      id: 7,
      title: "Cocinero a Domicilio",
      icon: "pi pi-stop",
      value: "Cocinero a domicilio",
      category: "hogar",
    },
    {
      id: 8,
      title: "Manicure y Pedicure",
      icon: "pi pi-star",
      value: "Manicure y pedicure",
      category: "cuidados",
    },
    {
      id: 9,
      title: "Mecánico Casero",
      icon: "pi pi-cog",
      value: "Reparaciones simples",
      category: "hogar",
    },
    {
      id: 10,
      title: "Jardinero",
      icon: "pi pi-inbox",
      value: "Jardinería",
      category: "hogar",
    },
    {
      id: 11,
      title: "Técnico de Computadoras",
      icon: "pi pi-desktop",
      value: "Configuracion de dispositivos electronicos",
      category: "tecnología",
    },
    {
      id: 12,
      title: "Entrenador Personal",
      icon: "pi pi-user",
      value: "Entrenamiento personal",
      category: "cuidados",
    },
    {
      id: 13,
      title: "Fotógrafo",
      icon: "pi pi-camera",
      value: "Fotografía",
      category: "eventos",
    },
    {
      id: 14,
      title: "Técnico Instalador",
      icon: "pi pi-mobile",
      value: "Técnico instalador",
      category: "tecnología",
    },
    {
      id: 15,
      title: "Mesero Eventos",
      icon: "pi pi-users",
      value: "Mesero para eventos",
      category: "eventos",
    },
    {
      id: 16,
      title: "Páginas Web",
      icon: "pi pi-globe",
      value: "Desarrollo web",
      category: "tecnología",
    },
    {
      id: 17,
      title: "Creador de Contenido",
      icon: "pi pi-video",
      value: "Creación de contenido",
      category: "tecnología",
    },
    {
      id: 18,
      title: "Editor de Videos",
      icon: "pi pi-camera",
      value: "Edición de videos",
      category: "tecnología",
    },
    {
      id: 19,
      title: "Diseñador Gráfico",
      icon: "pi pi-pencil",
      value: "Diseño gráfico",
      category: "tecnología",
    },
    {
      id: 20,
      title: "Otros Servicios",
      icon: "pi pi-bolt",
      value: "Otros servicios",
      category: "todos",
    },
    {
      id: 21,
      title: "Transporte de Paquetes",
      icon: "pi pi-car",
      value: "Transporte de paquetes pequeños",
      category: "hogar",
    },
  ];

  const handleSkillSelect = (skill) => {
    if (selectedSkills.includes(skill.value)) {
      setSelectedSkills(selectedSkills.filter((s) => s !== skill.value));
    } else {
      setSelectedSkills([...selectedSkills, skill.value]);
    }
  };

  const isSkillSelected = (skillValue) => {
    return selectedSkills.includes(skillValue);
  };

  // Filtrar servicios por categoría y por selección
  const getFilteredServices = () => {
    let result = services;
    
    // Primero filtrar por categoría si no es "todos"
    if (selectedCategory !== 'todos') {
      result = result.filter(service => service.category === selectedCategory);
    }
    
    // Luego filtrar por seleccionados si está activado
    if (showOnlySelected) {
      result = result.filter(service => isSkillSelected(service.value));
    }
    
    return result;
  };

  const toggleShowSelected = () => {
    setShowOnlySelected(!showOnlySelected);
    setSelectedCategory('todos');
  };

  return (
    <div>


      {/* Skills Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {getFilteredServices().map((service) => (
          <div
            key={service.id}
            onClick={() => handleSkillSelect(service)}
            className={`flex flex-col justify-center items-center p-3 h-28 rounded-xl cursor-pointer transition-all duration-200 relative overflow-hidden group
              ${
                isSkillSelected(service.value)
                  ? "bg-gradient-to-br from-primary-dark to-primary-dark/90 shadow-md"
                  : "border border-neutral-gray hover:border-primary-dark/50 hover:bg-primary-light/5"
              }`}
          >
            {/* Efecto hover */}
            <div className={`absolute inset-0 bg-primary-dark/10 opacity-0 group-hover:opacity-100 transition-opacity duration-200 ${isSkillSelected(service.value) ? 'hidden' : ''}`}></div>
            
            <div 
              className={`w-12 h-12 rounded-full flex items-center justify-center mb-3
                ${
                  isSkillSelected(service.value)
                    ? "bg-white/20" 
                    : "bg-primary-light/20"
                }`}
            >
              <i
                className={`${service.icon} text-lg ${
                  isSkillSelected(service.value)
                    ? "text-white"
                    : "text-primary-dark"
                }`}
              ></i>
            </div>
            <p
              className={`text-xs font-light text-center line-clamp-2 w-full ${
                isSkillSelected(service.value)
                  ? "text-white"
                  : "text-neutral-dark"
              }`}
            >
              {service.title}
            </p>
            
            {/* Checkmark for selected items */}
            {isSkillSelected(service.value) && (
              <div className="absolute top-2 right-2 w-5 h-5 bg-white/30 rounded-full flex items-center justify-center">
                <i className="pi pi-check text-white text-xs"></i>
              </div>
            )}
          </div>
        ))}
      </div>


    </div>
  );
};

SkillSelector.propTypes = {
  selectedSkills: PropTypes.array.isRequired,
  setSelectedSkills: PropTypes.func.isRequired,
};

export default SkillSelector;