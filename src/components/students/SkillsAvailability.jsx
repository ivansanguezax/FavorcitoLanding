import { useState, useEffect } from "react";
import { InputTextarea } from "primereact/inputtextarea";
import { Button } from "primereact/button";
import { MultiSelect } from "primereact/multiselect";
import PropTypes from "prop-types";
import { Mixpanel } from "../../services/mixpanel";

const SkillsAvailability = ({ formData, updateFormData, onNext }) => {
  const [showAdditionalFields, setShowAdditionalFields] = useState(false);
  const [showOtherSkills, setShowOtherSkills] = useState(false);
  const [menuRef, setMenuRef] = useState(null);

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

  const services = [
    {
      id: 1,
      title: "Clases\nParticulares",
      icon: "pi pi-book",
      value: "Clases particulares",
    },
    {
      id: 2,
      title: "Trámites y\nDiligencias",
      icon: "pi pi-file",
      value: "Trámites y diligencias",
    },
    {
      id: 3,
      title: "Compras en el\nMercado",
      icon: "pi pi-shopping-cart",
      value: "Compras en el mercado",
    },
    {
      id: 4,
      title: "Mil\nOficios",
      icon: "pi pi-wrench",
      value: "Montar muebles y arreglos basicos del hogar",
    },
    {
      id: 5,
      title: "Paseo de\nMascotas",
      icon: "pi pi-heart-fill",
      value: "Cuidado y paseo de mascotas",
    },
    {
      id: 6,
      title: "Cuidado de\nAbuelitos",
      icon: "pi pi-heart",
      value: "Cuidado de adultos mayores",
    },
    {
      id: 7,
      title: "Cocinero a\nDomicilio",
      icon: "pi pi-stop",
      value: "Cocinero a domicilio",
    },
    {
      id: 8,
      title: "Manicure y\nPedicure",
      icon: "pi pi-star",
      value: "Manicure y pedicure",
    },
    {
      id: 9,
      title: "Mecánico\nCasero",
      icon: "pi pi-cog",
      value: "Reparaciones simples",
    },
    {
      id: 10,
      title: "Jardinero",
      icon: "pi pi-inbox",
      value: "Jardinería",
    },
    {
      id: 11,
      title: "Técnico de\nComputadoras",
      icon: "pi pi-desktop",
      value: "Configuracion de dispositivos electronicos",
    },
    {
      id: 12,
      title: "Entrenador\nPersonal",
      icon: "pi pi-user",
      value: "Entrenamiento personal",
    },
    {
      id: 13,
      title: "Fotógrafo",
      icon: "pi pi-camera",
      value: "Fotografía",
    },
    {
      id: 14,
      title: "Técnico\nInstalador",
      icon: "pi pi-mobile",
      value: "Técnico instalador",
    },
    {
      id: 15,
      title: "Mesero\nEventos",
      icon: "pi pi-users",
      value: "Mesero para eventos",
    },
    {
      id: 16,
      title: "Páginas\nWeb",
      icon: "pi pi-globe",
      value: "Desarrollo web",
    },
    {
      id: 17,
      title: "Creador de\nContenido",
      icon: "pi pi-video",
      value: "Creación de contenido",
    },
    {
      id: 18,
      title: "Editor de\nVideos",
      icon: "pi pi-camera",
      value: "Edición de videos",
    },
    {
      id: 19,
      title: "Diseñador\nGráfico",
      icon: "pi pi-pencil",
      value: "Diseño gráfico",
    },
    {
      id: 20,
      title: "Otros\nServicios",
      icon: "pi pi-bolt",
      value: "Otros servicios",
    },
    {
      id: 21,
      title: "Transporte de\nPaquetes",
      icon: "pi pi-car",
      value: "Transporte de paquetes pequeños",
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
    return true;
  };

  const getHeaderContent = (options) => {
    const dayName = options.context.day;
    const daysWithSchedules = getDaysWithSchedules(dayName);

    if (daysWithSchedules.length === 0) {
      return <div className="p-3 font-medium">Selecciona horarios</div>;
    }

    return (
      <div className="p-4">
        <div className="font-medium mb-3">Selecciona horarios</div>
        <div className="border-t border-neutral-gray pt-4 mb-3">
          <div className="text-sm font-medium mb-3 flex items-center">
            <i className="pi pi-copy mr-2 text-primary-dark"></i>
            Copiar horarios de:
          </div>
          <div className="flex flex-wrap gap-3 px-1">
            {daysWithSchedules.map((day) => (
              <Button
                key={day}
                label={day}
                icon="pi pi-calendar"
                className="p-button-sm bg-white text-primary-dark border border-gray-200 shadow-sm hover:bg-gray-50 transition-all duration-150 py-2 px-3"
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
            className="p-button-sm p-button-danger p-button-text"
            onClick={(e) => {
              e.stopPropagation();
              clearDayTimes(dayName);
            }}
          />
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col space-y-8">
      <h2 className="text-2xl font-semibold text-center text-neutral-dark">
        Habilidades y Disponibilidad
      </h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-6 gap-3">
        {services.map((service) => (
          <div
            key={service.id}
            onClick={() => handleSkillSelect(service)}
            className={`flex flex-col justify-center items-center p-3 h-24 rounded-lg cursor-pointer transition-all duration-200 
              ${
                isSkillSelected(service.value)
                  ? "bg-primary-dark"
                  : "border border-neutral-gray hover:border-primary-dark"
              }`}
          >
            <i
              className={`${service.icon} text-xl mb-2 ${
                isSkillSelected(service.value)
                  ? "text-primary-light"
                  : "text-primary-dark"
              }`}
            ></i>
            <p
              className={`text-xs sm:text-sm font-light text-center whitespace-pre-line leading-tight ${
                isSkillSelected(service.value)
                  ? "text-primary-light"
                  : "text-neutral-dark"
              }`}
            >
              {service.title}
            </p>
          </div>
        ))}
      </div>

      {showAdditionalFields && (
        <div className="space-y-6">
          {showOtherSkills && (
            <div className="flex flex-col space-y-2">
              <InputTextarea
                value={formData.otherSkills || ""}
                onChange={(e) =>
                  updateFormData({ otherSkills: e.target.value })
                }
                rows={2}
                placeholder="Cuéntanos qué otros servicios puedes ofrecer"
                className="w-full border border-neutral-gray rounded-lg p-2"
              />
            </div>
          )}

          <div className="space-y-4">
            <label className="text-neutral-dark font-medium block">
              Días y horarios disponibles
            </label>

            <div className="border border-neutral-gray rounded-lg p-4">
              {/* Updated days selection section */}
              <div className="grid grid-cols-7 gap-2 mb-6">
                {weekDays.map((day) => (
                  <div
                    key={day.id}
                    onClick={() => handleDaySelect(day)}
                    className={`flex flex-col items-center justify-center py-2 px-1 rounded cursor-pointer transition-all duration-200 w-full
                      ${
                        isDaySelected(day.value)
                          ? "bg-primary-dark text-primary-light shadow-md"
                          : "border border-neutral-gray hover:border-primary-dark hover:bg-gray-50"
                      }`}
                  >
                    <span className="block md:hidden text-sm font-medium">
                      {day.short}
                    </span>
                    <span className="hidden md:block text-sm font-medium">
                      {day.name}
                    </span>
                  </div>
                ))}
              </div>

              {Object.keys(formData.availability || {}).length > 0 && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.keys(formData.availability || {}).map((dayName) => (
                      <div key={dayName} className="mb-4 relative">
                        <div className="flex justify-between items-center mb-1">
                          <label className="block text-sm font-medium text-neutral-dark">
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
                            className={`w-full border border-neutral-gray rounded-lg ${
                              getSelectedTimes(dayName).length > 0
                                ? "hide-dropdown-icon"
                                : ""
                            }`}
                            panelClassName="mt-2"
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
                          />
                          {getSelectedTimes(dayName).length > 0 && (
                            <Button
                              icon="pi pi-times"
                              className="p-button-text p-button-rounded p-button-sm absolute right-1 top-1/2 -translate-y-1/2 z-10"
                              onClick={() => clearDayTimes(dayName)}
                              tooltip="Deseleccionar día"
                            />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <Button
              label="Siguiente"
              icon="pi pi-arrow-right"
              onClick={onNext}
              disabled={!isFormValid()}
              className={`px-6 py-3 ${
                !isFormValid()
                  ? "bg-gray-300 text-gray-600 border-2 border-gray-300 cursor-not-allowed"
                  : "text-primary-dark border-2 border-primary-dark hover:bg-primary-dark hover:text-white transition-all duration-200"
              }`}
            />
          </div>
        </div>
      )}
    </div>
  );
};

SkillsAvailability.propTypes = {
  formData: PropTypes.object.isRequired,
  updateFormData: PropTypes.func.isRequired,
  onNext: PropTypes.func.isRequired,
};

export default SkillsAvailability;
