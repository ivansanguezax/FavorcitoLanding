import { useState, useRef, useEffect } from "react";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { MultiSelect } from "primereact/multiselect";
import { Toast } from "primereact/toast";
import PropTypes from "prop-types";
import zonasData from "../../utils/zonas.json";

// Horarios disponibles para seleccionar
const AVAILABLE_HOURS = [
  "08:00",
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
  "18:00",
  "19:00",
  "20:00",
];

const DAYS_OF_WEEK = [
  { id: 1, name: "Lunes", short: "L", value: "Lunes" },
  { id: 2, name: "Martes", short: "M", value: "Martes" },
  { id: 3, name: "Miércoles", short: "X", value: "Miércoles" },
  { id: 4, name: "Jueves", short: "J", value: "Jueves" },
  { id: 5, name: "Viernes", short: "V", value: "Viernes" },
  { id: 6, name: "Sábado", short: "S", value: "Sábado" },
  { id: 7, name: "Domingo", short: "D", value: "Domingo" },
];

const LocationAvailabilityStep = ({ formData, updateFormData }) => {
  const [customZona, setCustomZona] = useState("");
  const [showCustomZona, setShowCustomZona] = useState(false);
  const toast = useRef(null);

  // Obtener listado de ciudades desde el JSON
  const cities = Object.keys(zonasData.Bolivia || {}).map((city) => ({
    label: city,
    value: city,
  }));

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    scrollToTop();
  }, []);

  // Provincias disponibles para la ciudad seleccionada
  const [provinces, setProvinces] = useState([]);

  // Al cambiar la ciudad, actualizar las provincias disponibles
  useEffect(() => {
    if (formData.city) {
      // Esto es un ejemplo, deberías adaptar según la estructura real de tu JSON
      // Si tu JSON no tiene provincias, puedes crear valores predeterminados
      const defaultProvinces = [
        { label: "Centro", value: "Centro" },
        { label: "Norte", value: "Norte" },
        { label: "Sur", value: "Sur" },
        { label: "Este", value: "Este" },
        { label: "Oeste", value: "Oeste" },
        { label: "Andrés Ibáñez", value: "Andrés Ibáñez" },
        { label: "Otra", value: "Otra" },
      ];

      setProvinces(defaultProvinces);
    } else {
      setProvinces([]);
    }
  }, [formData.city]);

  // Log para debugging
  useEffect(() => {
    console.log("LocationAvailabilityStep - formData:", formData);
  }, [formData]);

  // Obtener zonas para la ciudad seleccionada
  const getZonasOptions = () => {
    if (!formData.city || !zonasData.Bolivia) return [];

    const zonasForCity = zonasData.Bolivia[formData.city] || [];

    if (typeof zonasForCity === "object" && !Array.isArray(zonasForCity)) {
      const flattenedZonas = [];

      Object.values(zonasForCity).forEach((distritos) => {
        Object.entries(distritos).forEach(([distrito, zonas]) => {
          if (Array.isArray(zonas)) {
            zonas.forEach((zona) => {
              flattenedZonas.push(`${distrito} - ${zona}`);
            });
          }
        });
      });

      return flattenedZonas.map((zona) => ({
        label: zona,
        value: zona,
      }));
    }

    return Array.isArray(zonasForCity)
      ? zonasForCity.map((zona) => ({
          label: zona,
          value: zona,
        }))
      : [];
  };

  // Aplicar zona personalizada
  const applyCustomZona = () => {
    if (customZona.trim()) {
      updateFormData({
        ...formData,
        address: customZona.trim(),
      });
      setShowCustomZona(false);
      setCustomZona("");
    } else {
      toast.current.show({
        severity: "warn",
        summary: "Campo vacío",
        detail: "Por favor ingresa el nombre de la zona",
        life: 3000,
      });
    }
  };

  // Actualizar la disponibilidad para un día
  const updateAvailability = (day, selectedHours) => {
    const updatedAvailability = {
      ...formData.availability,
      [day]: selectedHours,
    };

    updateFormData({
      ...formData,
      availability: updatedAvailability,
    });
  };

  // Manejar la selección de un día
  const handleDaySelect = (day) => {
    const dayName = day.value;
    const currentAvailability = formData.availability || {};

    if (currentAvailability[dayName]) {
      const { [dayName]: removed, ...restDays } = currentAvailability;
      updateFormData({
        ...formData,
        availability: restDays,
      });
    } else {
      updateFormData({
        ...formData,
        availability: {
          ...currentAvailability,
          [dayName]: [],
        },
      });
    }
  };

  // Manejar la selección de horarios para un día
  const handleTimeSelect = (dayName, selectedTimes) => {
    const currentAvailability = formData.availability || {};

    updateFormData({
      ...formData,
      availability: {
        ...currentAvailability,
        [dayName]: selectedTimes,
      },
    });
  };

  // Limpiar los horarios de un día
  const clearDayTimes = (dayName) => {
    const currentAvailability = formData.availability || {};

    // Deseleccionar el día completamente (eliminarlo de la disponibilidad)
    const { [dayName]: removed, ...restDays } = currentAvailability;

    updateFormData({
      ...formData,
      availability: restDays,
    });
  };

  // Duplicar horarios de un día a otro
  const handleDuplicateTimes = (sourceDay, targetDay) => {
    if (!formData.availability?.[sourceDay]) return;

    const currentAvailability = formData.availability || {};
    updateFormData({
      ...formData,
      availability: {
        ...currentAvailability,
        [targetDay]: [...currentAvailability[sourceDay]],
      },
    });
  };

  // Verificar si un día está seleccionado
  const isDaySelected = (dayValue) => {
    return formData.availability && dayValue in formData.availability;
  };

  // Obtener los horarios seleccionados para un día
  const getSelectedTimes = (dayValue) => {
    return formData.availability?.[dayValue] || [];
  };

  // Obtener días que tienen horarios configurados (para duplicar)
  const getDaysWithSchedules = (currentDay) => {
    return Object.keys(formData.availability || {}).filter(
      (day) => day !== currentDay && formData.availability[day]?.length > 0
    );
  };

  // Renderizar el encabezado del panel de MultiSelect
  const getHeaderContent = (options) => {
    const dayName = options.context.day;
    const daysWithSchedules = getDaysWithSchedules(dayName);

    if (daysWithSchedules.length === 0) {
      return (
        <div className="p-3 font-medium text-primary-dark">
          Selecciona horarios
        </div>
      );
    }

    return (
      <div className="p-4">
        <div className="font-medium mb-3 text-primary-dark">
          Selecciona horarios
        </div>
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

  // Renderizar el pie del panel de MultiSelect
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

  // Renderizar selector de horas para cada día
  const renderDayScheduleSelector = (dayName) => {
    return (
      <div
        key={dayName}
        className="mb-4 relative border border-neutral-gray/10 rounded-lg p-3 bg-white"
      >
        <div className="flex justify-between items-center mb-2">
          <label className="text-sm font-medium text-primary-dark flex items-center">
            <i className="pi pi-calendar-plus text-primary-dark/70 mr-2 text-sm"></i>
            {dayName}
          </label>
          <div className="flex gap-2">
            <Button
              icon="pi pi-check"
              className="p-button-text p-button-sm p-button-success"
              tooltip="Seleccionar todas"
              onClick={() => updateAvailability(dayName, [...AVAILABLE_HOURS])}
            />
            <Button
              icon="pi pi-trash"
              className="p-button-text p-button-sm p-button-danger"
              tooltip="Deseleccionar día"
              onClick={() => clearDayTimes(dayName)}
            />
          </div>
        </div>

        <MultiSelect
          value={getSelectedTimes(dayName)}
          options={AVAILABLE_HOURS.map((hour) => ({
            label: hour,
            value: hour,
          }))}
          onChange={(e) => handleTimeSelect(dayName, e.value)}
          placeholder="Selecciona horarios disponibles"
          filter
          showClear
          className="w-full"
          display="chip"
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
        />
      </div>
    );
  };

  return (
    <div className="flex flex-col space-y-6">
      <Toast ref={toast} />

      {/* Información de ubicación */}
      <div className="bg-gradient-to-r from-blue-50 to-primary-light/20 rounded-xl p-4 space-y-4 border border-primary-dark/10">
        <div className="flex items-center mb-2">
          <div className="w-10 h-10 rounded-full bg-primary-dark/10 flex items-center justify-center mr-3">
            <i className="pi pi-map-marker text-primary-dark"></i>
          </div>
          <h3 className="text-lg font-medium text-primary-dark">
            Ubicación de servicio
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
          {/* Ciudad */}
          <div className="flex flex-col space-y-2">
            <label
              htmlFor="city"
              className="text-neutral-dark font-medium flex items-center"
            >
              Ciudad <span className="text-red-500 ml-1">*</span>
            </label>
            <Dropdown
              id="city"
              value={formData.city || ""}
              onChange={(e) => {
                updateFormData({
                  ...formData,
                  city: e.value,
                  province: "", // Reset provincia when city changes
                  address: "", // Reset zona when city changes
                });
              }}
              options={cities}
              placeholder="Selecciona tu ciudad"
              className="w-full"
              filter
              emptyFilterMessage="No se encontraron ciudades"
            />
            <p className="text-xs text-neutral-dark/60">
              Elige la ciudad donde brindarás tus servicios
            </p>
          </div>

          {/* Provincia/Distrito */}
          <div className="flex flex-col space-y-2">
            <label
              htmlFor="province"
              className="text-neutral-dark font-medium flex items-center"
            >
              Provincia/Distrito <span className="text-red-500 ml-1">*</span>
            </label>
            <Dropdown
              id="province"
              value={formData.province || ""}
              onChange={(e) => {
                updateFormData({
                  ...formData,
                  province: e.value,
                });
              }}
              options={provinces}
              placeholder={
                formData.city
                  ? "Selecciona la provincia"
                  : "Primero selecciona una ciudad"
              }
              className="w-full"
              disabled={!formData.city}
            />
            <p className="text-xs text-neutral-dark/60">
              Selecciona la provincia o distrito dentro de la ciudad
            </p>
          </div>

          {/* Zona */}
          <div className="flex flex-col space-y-2 md:col-span-2">
            <div className="flex justify-between items-center">
              <label
                htmlFor="zona"
                className="text-neutral-dark font-medium flex items-center"
              >
                Zona/Barrio <span className="text-red-500 ml-1">*</span>
              </label>
              {!showCustomZona && (
                <button
                  type="button"
                  onClick={() => setShowCustomZona(true)}
                  className="text-xs text-primary-dark font-medium flex items-center"
                >
                  <i className="pi pi-plus-circle mr-1"></i>
                  No encuentro mi zona
                </button>
              )}
            </div>

            {!showCustomZona ? (
              <div className="relative">
                {formData.address &&
                getZonasOptions().length > 0 &&
                !getZonasOptions().some(
                  (option) => option.value === formData.address
                ) ? (
                  <div className="w-full border rounded-lg px-4 py-2.5 h-12 flex items-center justify-between">
                    <span>{formData.address}</span>
                    <Button
                      icon="pi pi-pencil"
                      className="p-button-text p-button-sm"
                      onClick={() => {
                        setCustomZona(formData.address);
                        setShowCustomZona(true);
                      }}
                    />
                  </div>
                ) : (
                  <Dropdown
                    id="zona"
                    value={formData.address || ""}
                    onChange={(e) => {
                      updateFormData({
                        ...formData,
                        address: e.value,
                      });
                    }}
                    options={getZonasOptions()}
                    placeholder={
                      formData.city
                        ? "Selecciona tu zona"
                        : "Primero selecciona una ciudad"
                    }
                    className="w-full"
                    filter
                    emptyFilterMessage="No se encontraron zonas"
                    emptyMessage={
                      formData.city
                        ? "No hay zonas disponibles, usa 'No encuentro mi zona'"
                        : "Selecciona una ciudad primero"
                    }
                    disabled={!formData.city}
                  />
                )}
              </div>
            ) : (
              <div className="flex gap-2">
                <InputText
                  value={customZona}
                  onChange={(e) => setCustomZona(e.target.value)}
                  placeholder="Ingresa el nombre de tu zona o barrio"
                  className="flex-1"
                />
                <Button
                  icon="pi pi-check"
                  onClick={applyCustomZona}
                  className="p-button-success"
                  disabled={!customZona.trim()}
                />
                <Button
                  icon="pi pi-times"
                  onClick={() => setShowCustomZona(false)}
                  className="p-button-secondary"
                />
              </div>
            )}
            <p className="text-xs text-neutral-dark/60">
              Especifica la zona o barrio donde prestarás servicios
            </p>
          </div>
        </div>
      </div>

      {/* Horarios disponibles */}
      <div className="bg-gradient-to-r from-green-50 to-primary-light/20 rounded-xl p-4 space-y-4 border border-primary-dark/10">
        <div className="flex items-center mb-2">
          <div className="w-10 h-10 rounded-full bg-primary-dark/10 flex items-center justify-center mr-3">
            <i className="pi pi-calendar text-primary-dark"></i>
          </div>
          <div>
            <h3 className="text-lg font-medium text-primary-dark">
              Horarios disponibles
            </h3>
            <p className="text-sm text-neutral-dark/70">
              Selecciona los horarios en los que puedes ofrecer tus servicios
            </p>
          </div>
        </div>

        {/* Información sobre selección mínima */}
        <div className="border border-neutral-gray/20 rounded-xl p-3 bg-neutral-light/20 mb-4">
          <i className="pi pi-info-circle text-yellow-600 mr-2"></i>
          <p className="text-neutral-dark">
            Selecciona al menos un horario. Cuantos más horarios selecciones,
            más posibilidades tendrás de recibir solicitudes.
          </p>
        </div>

        {/* Days selection section */}
        <div className="border border-neutral-gray/20 rounded-xl p-4 bg-neutral-light/20 mb-4">
          <p className="text-sm font-medium text-neutral-dark mb-3">
            Selecciona los días disponibles:
          </p>

          <div className="grid grid-cols-7 gap-1 sm:gap-2 mb-4">
            {DAYS_OF_WEEK.map((day) => (
              <div
                key={day.id}
                onClick={() => handleDaySelect(day)}
                className={`flex flex-col items-center justify-center py-2 px-0.5 sm:px-2 rounded-lg cursor-pointer transition-all duration-200 w-full
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
        </div>

        {/* Selectores de horario para cada día */}
        {Object.keys(formData.availability || {}).length > 0 ? (
          <div className="max-h-80 overflow-y-auto pr-2">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {Object.keys(formData.availability || {})
                .sort((a, b) => {
                  // Obtener el índice de cada día en el array DAYS_OF_WEEK
                  const indexA = DAYS_OF_WEEK.findIndex(
                    (day) => day.value === a
                  );
                  const indexB = DAYS_OF_WEEK.findIndex(
                    (day) => day.value === b
                  );
                  // Ordenar por índice
                  return indexA - indexB;
                })
                .map((dayName) => renderDayScheduleSelector(dayName))}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-6 bg-white/50 rounded-lg border border-dashed border-neutral-gray/30">
            <div className="w-12 h-12 rounded-full bg-primary-light/20 flex items-center justify-center mb-3">
              <i className="pi pi-calendar text-primary-dark"></i>
            </div>
            <p className="text-neutral-dark font-medium mb-1">
              Sin días seleccionados
            </p>
            <p className="text-neutral-dark/70 text-sm text-center">
              Haz clic en los días en los que puedes brindar tus servicios
            </p>
          </div>
        )}

        {/* Resumen de disponibilidad */}
        {Object.entries(formData.availability || {}).some(
          ([_, slots]) => slots.length > 0
        ) && (
          <div className="mt-3 bg-white/90 p-3 rounded-lg border border-green-200">
            <h4 className="text-sm font-medium text-green-700 mb-2">
              Resumen de disponibilidad
            </h4>
            <div className="text-xs text-neutral-dark">
              <ul className="space-y-1">
                {Object.entries(formData.availability || {})
                  .filter(([_, slots]) => slots.length > 0)
                  .map(([day, slots]) => (
                    <li key={day} className="flex items-start">
                      <span className="font-medium">{day}:</span>
                      <span className="ml-1">{slots.join(", ")}</span>
                    </li>
                  ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

LocationAvailabilityStep.propTypes = {
  formData: PropTypes.object.isRequired,
  updateFormData: PropTypes.func.isRequired,
};

export default LocationAvailabilityStep;
