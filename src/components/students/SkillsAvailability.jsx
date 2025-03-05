import { useState, useEffect } from "react";
import { InputTextarea } from "primereact/inputtextarea";
import { Button } from "primereact/button";
import { MultiSelect } from "primereact/multiselect";
import PropTypes from "prop-types";
import { Mixpanel } from "../../services/mixpanel";

const SkillsAvailability = ({ formData, updateFormData, onNext, onPrevious }) => {
  const [showAdditionalFields, setShowAdditionalFields] = useState(false);
  const [showOtherSkills, setShowOtherSkills] = useState(false);
  const [menuRef, setMenuRef] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('todos');
  const [showOnlySelected, setShowOnlySelected] = useState(false);

  useEffect(() => {
    const hasSelectedSkills = formData.skills?.length > 0;
    setShowAdditionalFields(hasSelectedSkills);
    setShowOtherSkills(
      hasSelectedSkills && formData.skills.includes("Otros servicios")
    );
  }, [formData.skills]);

  useEffect(() => {
    localStorage.setItem("studentFormData", JSON.stringify(formData));
  }, [formData]);

  useEffect(() => {
    const savedData = localStorage.getItem("studentFormData");
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        if (parsedData && Object.keys(parsedData).length > 0) {
          updateFormData(parsedData);
        }
      } catch (error) {
        console.error("Error parsing saved form data:", error);
      }
    }
  }, []);

  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 6; hour <= 22; hour++) {
      const formattedHour = hour.toString().padStart(2, "0");
      const nextHour = (hour + 1).toString().padStart(2, "0");
      slots.push({
        label: `${formattedHour}:00 - ${nextHour}:00`,
        value: `${formattedHour}:00`,
      });
    }
    return slots;
  };

  const timeSlots = generateTimeSlots();

  // Categorizar servicios
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

  const weekDays = [
    { id: 1, name: "Lunes", short: "L", value: "Lunes" },
    { id: 2, name: "Martes", short: "M", value: "Martes" },
    { id: 3, name: "Miércoles", short: "X", value: "Miercoles" },
    { id: 4, name: "Jueves", short: "J", value: "Jueves" },
    { id: 5, name: "Viernes", short: "V", value: "Viernes" },
    { id: 6, name: "Sábado", short: "S", value: "Sabado" },
    { id: 7, name: "Domingo", short: "D", value: "Domingo" },
  ];

  const handleSkillSelect = (skill) => {
    const currentSkills = formData.skills || [];
    let updatedSkillValues;
  
    if (currentSkills.includes(skill.value)) {
      updatedSkillValues = currentSkills.filter((s) => s !== skill.value);
      
      Mixpanel.track("Skill_Removed", {
        skill_name: skill.value,
        skills_total: updatedSkillValues.length - 1,
        is_last_skill: updatedSkillValues.length === 1
      });
    } else {
      updatedSkillValues = [...currentSkills, skill.value];
      
      Mixpanel.track("Skill_Added", {
        skill_name: skill.value,
        skills_total: updatedSkillValues.length,
        is_first_skill: currentSkills.length === 0
      });
    }
  
    updateFormData({
      skills: updatedSkillValues,
      ...(updatedSkillValues.length === 0 && {
        availability: {},
        otherSkills: "",
      }),
    });
  };

  const isSkillSelected = (skillValue) => {
    return formData.skills?.includes(skillValue) || false;
  };

  const handleDaySelect = (day) => {
    const dayName = day.value;
    const currentAvailability = formData.availability || {};

    if (currentAvailability[dayName]) {
      const { [dayName]: removed, ...restDays } = currentAvailability;
      updateFormData({
        availability: restDays,
      });
    } else {
      updateFormData({
        availability: {
          ...currentAvailability,
          [dayName]: [],
        },
      });
    }
  };

  const handleTimeSelect = (dayName, selectedTimes) => {
    const currentAvailability = formData.availability || {};

    updateFormData({
      availability: {
        ...currentAvailability,
        [dayName]: selectedTimes,
      },
    });
  };

  const clearDayTimes = (dayName) => {
    const currentAvailability = formData.availability || {};

    // Deseleccionar el día completamente (eliminarlo de la disponibilidad)
    const { [dayName]: removed, ...restDays } = currentAvailability;

    updateFormData({
      availability: restDays,
    });
  };

  const handleDuplicateTimes = (sourceDay, targetDay) => {
    if (!formData.availability?.[sourceDay]) return;

    const currentAvailability = formData.availability || {};
    updateFormData({
      availability: {
        ...currentAvailability,
        [targetDay]: [...currentAvailability[sourceDay]],
      },
    });
    setMenuRef(null);
  };

  const isDaySelected = (dayValue) => {
    return formData.availability && dayValue in formData.availability;
  };

  const getSelectedTimes = (dayValue) => {
    return formData.availability?.[dayValue] || [];
  };

  const getDaysWithSchedules = (currentDay) => {
    return Object.keys(formData.availability || {}).filter(
      (day) => day !== currentDay && formData.availability[day]?.length > 0
    );
  };

  const isFormValid = () => {
    // Si seleccionó "Otros servicios" y no escribió nada
    if (
      formData.skills?.includes("Otros servicios") &&
      (!formData.otherSkills || formData.otherSkills.trim() === "")
    ) {
      return false;
    }
    return formData.skills?.length > 0;
  };

  const getHeaderContent = (options) => {
    const dayName = options.context.day;
    const daysWithSchedules = getDaysWithSchedules(dayName);

    if (daysWithSchedules.length === 0) {
      return <div className="p-3 font-medium text-primary-dark">Selecciona horarios</div>;
    }

    return (
      <div className="p-4">
        <div className="font-medium mb-3 text-primary-dark">Selecciona horarios</div>
        <div className="border-t border-neutral-gray/20 pt-4 mb-3">
          <div className="text-sm font-medium mb-3 flex items-center text-primary-dark">
            <i className="pi pi-copy mr-2 text-primary-dark"></i>
            Copiar horarios de:
          </div>
          <div className="flex flex-wrap gap-3 px-1">
            {daysWithSchedules.map((day) => (
              <Button
                key={day}
                label={day}
                icon="pi pi-calendar"
                className="p-button-sm bg-white text-primary-dark border border-neutral-gray/20 shadow-sm hover:bg-neutral-light/50 transition-all duration-150 py-2 px-3"
                onClick={() => handleDuplicateTimes(day, dayName)}
              />
            ))}
          </div>
        </div>
      </div>
    );
  };

  const panelTemplate = (options) => {
    const dayName = options.context.day;
    const hasTimes = getSelectedTimes(dayName).length > 0;

    return (
      <div className="p-3 flex justify-end">
        {hasTimes && (
          <Button
            icon="pi pi-trash"
            label="Borrar todos"
            className="p-button-sm bg-white text-red-600 border border-red-100 hover:bg-red-50"
            onClick={(e) => {
              e.stopPropagation();
              clearDayTimes(dayName);
            }}
          />
        )}
      </div>
    );
  };

  // Filtrar servicios por categoría y por selección si está activa
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
    <div className="flex flex-col space-y-8 max-w-full">
      <div className="text-center">
        <h2 className="text-2xl font-semibold text-primary-dark">
          Habilidades y Disponibilidad
        </h2>
        <p className="text-neutral-dark/70 mt-2 max-w-xl mx-auto">
          Selecciona los servicios que puedes ofrecer y tus horarios disponibles
        </p>
      </div>

      <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-neutral-gray/10">
{/* Versión mejorada de los filtros */}
<div className="bg-neutral-100 p-2 rounded-lg mb-5">
  <div className="flex flex-wrap gap-2">
    {categories.map(category => (
      <button 
        key={category.name}
        onClick={() => {
          setSelectedCategory(category.name);
          setShowOnlySelected(false);
        }}
        className={`px-3 py-2 text-sm rounded-lg transition-all duration-200 flex items-center gap-2 ${
          selectedCategory === category.name && !showOnlySelected
            ? 'bg-primary-dark text-white font-medium' 
            : 'text-neutral-dark bg-gray-200  hover:bg-gray-400'
        }`}
      >
        <i className={`${category.icon} text-sm`}></i>
        {category.label}
      </button>
    ))}
    
    {/* Botón para mostrar solo seleccionados */}
    <button 
      onClick={toggleShowSelected}
      className={`px-3 py-2 text-sm rounded-lg transition-all duration-200 flex items-center gap-2 ${
        showOnlySelected
          ? 'bg-primary-dark text-white shadow-sm font-medium' 
          : 'text-neutral-dark bg-gray-200  hover:bg-white/70'
      }`}
    >
      <i className="pi pi-check-square text-sm"></i>
      Seleccionados
    </button>
  </div>
</div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-6 gap-3">
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
              
              {/* Checkmark para elementos seleccionados */}
              {isSkillSelected(service.value) && (
                <div className="absolute top-2 right-2 w-5 h-5 bg-white/30 rounded-full flex items-center justify-center">
                  <i className="pi pi-check text-white text-xs"></i>
                </div>
              )}
            </div>
          ))}
        </div>
        
        {formData.skills?.length > 0 && (
          <div className="mt-5 flex flex-col sm:flex-row items-start sm:items-center justify-between border border-primary-light/20 rounded-lg p-3 bg-primary-light/5">
  <div className="flex items-center w-full mb-2 sm:mb-0">
    <div className="w-8 h-8 shrink-0 rounded-full bg-primary-dark/10 flex items-center justify-center mr-3">
      <i className="pi pi-check text-primary-dark"></i>
    </div>
    <p className="text-sm text-neutral-dark break-words">
      Has seleccionado <span className="font-medium">{formData.skills.length}</span> servicios
    </p>
  </div>
  
  <div className="flex w-full sm:w-auto justify-end">
    {formData.skills.length > 0 && !showOnlySelected && (
      <Button
        label={window.innerWidth < 640 ? "" : "Seleccionados"}
        icon="pi pi-eye"
        className="p-button-text p-button-sm text-primary-dark"
        onClick={toggleShowSelected}
      />
    )}
    
    {showOnlySelected && (
      <Button
        label={window.innerWidth < 640 ? "" : "Ver todos"}
        icon="pi pi-list"
        className="p-button-text p-button-sm text-primary-dark"
        onClick={() => {
          setShowOnlySelected(false);
          setSelectedCategory('todos');
        }}
      />
    )}
  </div>
</div>
        )}
      </div>

      {showAdditionalFields && (
        <div className="space-y-6">
          {showOtherSkills && (
            <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-neutral-gray/10">
              <h3 className="text-lg font-medium text-primary-dark mb-4 flex items-center">
                <i className="pi pi-bolt text-primary-dark mr-2"></i>
                Detalla tus otros servicios
              </h3>
              
              <InputTextarea
                value={formData.otherSkills || ""}
                onChange={(e) =>
                  updateFormData({ otherSkills: e.target.value })
                }
                rows={3}
                placeholder="Describe qué otros servicios puedes ofrecer y cuál es tu experiencia"
                className="w-full border-2 border-neutral-gray rounded-lg p-3"
              />
            </div>
          )}

          <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-neutral-gray/10">
            <h3 className="text-lg font-medium text-primary-dark mb-4 flex items-center">
              <i className="pi pi-calendar text-primary-dark mr-2"></i>
              Días y horarios disponibles
            </h3>

            <p className="text-neutral-dark/70 text-sm mb-4">
              Selecciona los días y horarios en los que puedes brindar tus servicios
            </p>

            <div className="border border-neutral-gray/20 rounded-xl p-3 sm:p-5 bg-neutral-light/20">
              {/* Days selection section */}
              <div className="grid grid-cols-7 gap-1 sm:gap-2 mb-6">
                {weekDays.map((day) => (
                  <div
                    key={day.id}
                    onClick={() => handleDaySelect(day)}
                    className={`flex flex-col items-center justify-center py-2 px-3 rounded-lg cursor-pointer transition-all duration-200 w-full
                      ${
                        isDaySelected(day.value)
                          ? "bg-primary-dark text-white shadow-md"
                          : "border border-neutral-gray hover:border-primary-dark/50 hover:bg-primary-light/5"
                      }`}
                  >
                    <span className="block md:hidden text-sm font-light">
                      {day.short}
                    </span>
                    <span className="hidden md:block text-xs font-light">
                      {day.name}
                    </span>
                  </div>
                ))}
              </div>

              {Object.keys(formData.availability || {}).length > 0 ? (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {Object.keys(formData.availability || {}).map((dayName) => (
                      <div key={dayName} className="mb-4 relative">
                        <div className="flex justify-between items-center mb-2">
                          <label className="text-sm font-medium text-primary-dark flex items-center">
                            <i className="pi pi-calendar-plus text-primary-dark/70 mr-2 text-sm"></i>
                            {dayName}
                          </label>
                        </div>

                        <div className="relative">
  <MultiSelect
    value={getSelectedTimes(dayName)}
    options={timeSlots}
    onChange={(e) => handleTimeSelect(dayName, e.value)}
    optionLabel="label"
    placeholder="Selecciona horarios"
    display="chip"
    className="w-full border-2 border-neutral-gray rounded-lg"
    panelClassName="mt-2 shadow-lg border border-neutral-gray/20 rounded-lg bg-white"
    panelHeaderTemplate={(options) =>
      getHeaderContent({
        ...options,
        context: { ...options.context, day: dayName },
      })
    }
    panelFooterTemplate={(options) =>
      panelTemplate({
        ...options,
        context: { ...options.context, day: dayName },
      })
    }
    hideSelectedOptions={false}
    style={{ "--panel-header-bg": "#fff", "--panel-color": "#333" }}
  />
  {/* El botón de X ahora aparece separado del control */}
  {getSelectedTimes(dayName).length > 0 && (
    <Button
      icon="pi pi-trash"
      className="p-button-text p-button-rounded p-button-sm text-neutral-dark/70 absolute -top-10 right-0"
      onClick={() => clearDayTimes(dayName)}
      tooltip="Deseleccionar día"
    />
  )}
</div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center p-6 bg-white/50 rounded-lg border border-dashed border-neutral-gray/30">
                  <div className="w-12 h-12 rounded-full bg-primary-light/20 flex items-center justify-center mb-3">
                    <i className="pi pi-calendar text-primary-dark"></i>
                  </div>
                  <p className="text-neutral-dark font-medium mb-1">Sin días seleccionados</p>
                  <p className="text-neutral-dark/70 text-sm text-center">
                    Haz clic en los días en los que puedes brindar tus servicios
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="px-3 py-4 flex flex-col-reverse sm:flex-row justify-between gap-3">
        <Button
          label="Atrás"
          icon="pi pi-arrow-left"
          onClick={onPrevious}
          className="px-6 py-3 text-primary-dark border-2 border-primary-dark hover:bg-primary-dark hover:text-white transition-all duration-200 rounded-lg"
        />
        <Button
          label="Siguiente"
          icon="pi pi-arrow-right"
          onClick={onNext}
          disabled={!isFormValid()}
          className={`px-6 py-3 rounded-lg ${
            !isFormValid()
              ? "bg-gray-300 text-gray-600 border-2 border-gray-300 cursor-not-allowed"
              : "text-primary-dark border-2 border-primary-dark hover:bg-primary-dark hover:text-white transition-all duration-200"
          }`}
        />
      </div>
    </div>
  );
};

SkillsAvailability.propTypes = {
  formData: PropTypes.object.isRequired,
  updateFormData: PropTypes.func.isRequired,
  onNext: PropTypes.func.isRequired,
  onPrevious: PropTypes.func.isRequired,
};

export default SkillsAvailability;