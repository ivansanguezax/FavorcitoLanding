import { useState, useEffect, useRef } from "react";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { InputMask } from "primereact/inputmask";
import { Dropdown } from "primereact/dropdown";
import { Calendar } from "primereact/calendar";
import { Toast } from "primereact/toast";
import { Dialog } from "primereact/dialog";
import PropTypes from "prop-types";
import zonasData from "../../utils/zonas.json";
import { useAuth } from "../../context/AuthContext";
import { Mixpanel } from "../../services/mixpanel";

const PersonalInfo = ({ formData, updateFormData, onNext }) => {
  const { currentUser, signOut } = useAuth();
  const [minDate, setMinDate] = useState(new Date());
  const [maxDate, setMaxDate] = useState(new Date());
  const toast = useRef(null);
  const [customZona, setCustomZona] = useState("");
  const [showCustomZona, setShowCustomZona] = useState(false);
  const [showSwitchAccountDialog, setShowSwitchAccountDialog] = useState(false);
  const [welcomeShown, setWelcomeShown] = useState(false);

  const cities = Object.keys(zonasData.Bolivia).map((city) => ({
    label: city,
    value: city,
  }));

  const getZonasOptions = () => {
    if (!formData.city) return [];

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

  const applyCustomZona = () => {
    if (customZona.trim()) {
      updateFormData({
        ...formData,
        zona: customZona.trim(),
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

  const handleSwitchAccount = async () => {
    try {
      await signOut();
      Mixpanel.track("User_Switch_Account");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  useEffect(() => {
    const twentyFiveYearsAgo = new Date();
    twentyFiveYearsAgo.setFullYear(twentyFiveYearsAgo.getFullYear() - 25);
    twentyFiveYearsAgo.setHours(0, 0, 0, 0);

    const eighteenYearsAgo = new Date();
    eighteenYearsAgo.setFullYear(eighteenYearsAgo.getFullYear() - 18);
    eighteenYearsAgo.setHours(23, 59, 59, 999);

    setMinDate(twentyFiveYearsAgo);
    setMaxDate(eighteenYearsAgo);
  }, []);

  useEffect(() => {
    if (currentUser && !welcomeShown && toast.current) {
      updateFormData({
        ...formData,
        fullName: currentUser.displayName || formData.fullName,
        email: currentUser.email || formData.email,
      });

      setWelcomeShown(true);
    }
  }, [currentUser, welcomeShown]);

  useEffect(() => {
    if (Object.keys(formData).length > 0) {
      localStorage.setItem("studentFormData", JSON.stringify(formData));
    }
  }, [formData]);

  const formatDate = (date) => {
    if (!date) return null;

    if (typeof date === "string" && date.match(/^\d{4}-\d{2}-\d{2}$/)) {
      const [year, month, day] = date.split("-").map(Number);
      const formattedDate = new Date(Date.UTC(year, month - 1, day));
      return formattedDate;
    }

    const d = new Date(date);
    if (isNaN(d.getTime())) return null;
    return d;
  };

  const validatePersonalInfo = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.fullName || formData.fullName.trim() === "") {
      showError("Nombre completo es requerido");
      return false;
    }

    if (!formData.bornDate) {
      showError("Fecha de nacimiento es requerida");
      return false;
    }

    const birthDate = new Date(formData.bornDate);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    const ageInYears =
      m < 0 || (m === 0 && today.getDate() < birthDate.getDate())
        ? age - 1
        : age;

    if (ageInYears < 18 || ageInYears > 25) {
      showError("La edad debe estar entre 18 y 25 años");
      return false;
    }

    if (!formData.email || !emailRegex.test(formData.email)) {
      showError("Correo electrónico inválido");
      return false;
    }

    if (!formData.city) {
      showError("Ciudad es requerida");
      return false;
    }

    if (!formData.zona) {
      showError("Zona es requerida");
      return false;
    }

    return true;
  };

  const showError = (message) => {
    toast.current.show({
      severity: "error",
      summary: "Error de validación",
      detail: message,
      life: 3000,
    });
  };

  const handleNext = () => {
    if (validatePersonalInfo()) {
      const phoneRegex = /^\d{8}$/;

      if (!formData.phone || !phoneRegex.test(formData.phone)) {
        showError("Número de teléfono inválido (debe tener 8 dígitos)");
        return false;
      }

      let formattedDate = formData.bornDate;

      if (formData.bornDate instanceof Date) {
        const d = new Date(formData.bornDate);
        formattedDate = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
          2,
          "0"
        )}-${String(d.getDate()).padStart(2, "0")}`;
      }

      const updatedData = {
        ...formData,
        fullName: formData.fullName,
        bornDate: formattedDate,
        email: formData.email,
        phone: formData.phone,
        city: formData.city,
        zona: formData.zona,
        address: formData.zona,
      };

      Mixpanel.track("Personal_Info_Completed", {
        city: formData.city,
        has_google_info: !!currentUser,
      });

      updateFormData(updatedData);

      localStorage.setItem("studentFormData", JSON.stringify(updatedData));

      onNext();
    }
  };

  if (!currentUser) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-primary-dark"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col space-y-8">
      <Toast ref={toast} />

      {/* Header con foto de perfil y título */}
      <div className="flex flex-col items-center">
        <div className="mb-4 relative">
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary-light to-primary-dark opacity-20 blur-md"></div>
          <div className="relative z-10">
            <img
              src={
                currentUser?.photoURL ||
                "https://res.cloudinary.com/dfgjenml4/image/upload/v1739926023/Mask_group_rvnwra.png"
              }
              alt="Perfil de estudiante"
              className="w-24 h-24 object-cover rounded-full border-4 border-white shadow-md"
              onError={(e) => {
                e.target.src =
                  "https://res.cloudinary.com/dfgjenml4/image/upload/v1739926023/Mask_group_rvnwra.png";
              }}
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <h2 className="text-2xl font-semibold text-primary-dark">
            Información Personal
          </h2>
          <Button
            icon="pi pi-users"
            rounded
            tooltip="Cambiar cuenta"
            className="bg-primary-dark text-white hover:bg-primary-dark/90 p-2 shadow-sm"
            onClick={() => setShowSwitchAccountDialog(true)}
          />
        </div>

        <p className="text-center text-neutral-dark/70 mt-2 max-w-md">
          Estos datos nos ayudarán a personalizar tu experiencia
        </p>
      </div>

      {/* Mensaje de bienvenida */}
      <div className="bg-gradient-to-r from-primary-light/20 to-primary-light/10 rounded-xl p-5 flex items-start gap-4 border border-primary-dark/10 shadow-sm">
        <div className="w-10 h-10 rounded-full bg-primary-dark/10 flex items-center justify-center flex-shrink-0">
          <i className="pi pi-info-circle text-primary-dark"></i>
        </div>
        <div>
          <h3 className="font-medium text-primary-dark mb-1">
            ¡Hola {currentUser.displayName || "Estudiante"}!
          </h3>
          <p className="text-neutral-dark text-sm">
            Ya hemos obtenido algunos datos de tu cuenta de Google. Por favor,
            completa la información restante para continuar con tu registro como
            prestador de servicios.
          </p>
        </div>
      </div>

      {/* Formulario principal */}
      <div className="space-y-8 bg-white rounded-xl shadow-sm border border-neutral-gray/10 p-6">
        {/* Nombre y correo (lado a lado en desktop) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
          <div className="flex flex-col space-y-2">
            <label
              htmlFor="fullName"
              className="text-neutral-dark font-medium flex items-center"
            >
              Nombre completo <span className="text-red-500 ml-1">*</span>
              <span className="ml-auto bg-green-50 px-2 py-0.5 rounded-full text-xs text-green-700 flex items-center">
                <i className="pi pi-check text-xs mr-1"></i>Verificado
              </span>
            </label>
            <div className="relative">
              <InputText
                id="fullName"
                value={formData.fullName || ""}
                onChange={(e) =>
                  updateFormData({
                    ...formData,
                    fullName: e.target.value,
                  })
                }
                className="w-full border-2 bg-neutral-light/50 border-neutral-gray/30 rounded-lg px-4 py-2.5 h-12"
                placeholder="Ingresa tu nombre completo"
                disabled={true}
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <i className="pi pi-check-circle text-green-500"></i>
              </div>
            </div>
            <p className="text-xs text-neutral-dark/60">
              Obtenido de tu cuenta de Google
            </p>
          </div>

          <div className="flex flex-col space-y-2">
            <label
              htmlFor="email"
              className="text-neutral-dark font-medium flex items-center"
            >
              Correo electrónico <span className="text-red-500 ml-1">*</span>
              <span className="ml-auto bg-green-50 px-2 py-0.5 rounded-full text-xs text-green-700 flex items-center">
                <i className="pi pi-check text-xs mr-1"></i>Verificado
              </span>
            </label>
            <div className="relative">
              <InputText
                id="email"
                value={formData.email || ""}
                onChange={(e) =>
                  updateFormData({
                    ...formData,
                    email: e.target.value,
                  })
                }
                className="w-full border-2 bg-neutral-light/50 border-neutral-gray/30 rounded-lg px-4 py-2.5 h-12"
                placeholder="correo@ejemplo.com"
                type="email"
                disabled={true}
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <i className="pi pi-check-circle text-green-500"></i>
              </div>
            </div>
            <p className="text-xs text-neutral-dark/60">
              Obtenido de tu cuenta de Google
            </p>
          </div>
        </div>

        {/* Fecha de nacimiento y teléfono (lado a lado en desktop) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
          <div className="flex flex-col space-y-2">
            <label
              htmlFor="bornDate"
              className="text-neutral-dark font-medium flex items-center"
            >
              Fecha de nacimiento <span className="text-red-500 ml-1">*</span>
            </label>
            <div className="relative">
              <Calendar
                id="bornDate"
                value={formatDate(formData.bornDate)}
                onChange={(e) =>
                  updateFormData({
                    ...formData,
                    bornDate: e.value,
                  })
                }
                showIcon
                minDate={minDate}
                maxDate={maxDate}
                dateFormat="dd/mm/yy"
                className="w-full"
                inputClassName="w-full border-2 border-neutral-gray rounded-lg px-4 py-2.5 h-12"
                panelClassName="border border-neutral-gray rounded-xl shadow-lg p-2"
                view="date"
                viewDate={new Date(new Date().getFullYear() - 20, 0, 1)}
                yearNavigator
                yearRange={`${new Date().getFullYear() - 25}:${
                  new Date().getFullYear() - 18
                }`}
              />
            </div>
            <p className="text-xs text-neutral-dark/60">
              Debes tener entre 18 y 25 años para registrarte
            </p>
          </div>

          <div className="flex flex-col space-y-2">
            <label
              htmlFor="phone"
              className="text-neutral-dark font-medium flex items-center"
            >
              Número de teléfono <span className="text-red-500 ml-1">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-dark/70 flex items-center">
                +591
                <span className="mx-2 h-4 w-px bg-neutral-gray/30"></span>
              </span>
              <InputMask
                id="phone"
                value={formData.phone || ""}
                onChange={(e) =>
                  updateFormData({
                    ...formData,
                    phone: e.target.value,
                  })
                }
                mask="99999999"
                placeholder="75528888"
                className="w-full border-2 border-neutral-gray rounded-lg pl-20 pr-4 py-2.5 h-12"
              />
            </div>
            <p className="text-xs text-neutral-dark/60">
              Ingresa solo los 8 dígitos sin código de país
            </p>
          </div>
        </div>

        {/* Ciudad y zona (lado a lado en desktop) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 pt-2">
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
              onChange={(e) =>
                updateFormData({
                  ...formData,
                  city: e.value,
                  zona: null, // Reset zona when city changes
                })
              }
              options={cities}
              placeholder="Selecciona tu ciudad"
              className="w-full border-2 border-neutral-gray rounded-lg"
              filter
              filterInputAutoFocus
              showFilterClear
              panelClassName="border border-neutral-gray rounded-xl shadow-lg"
            />
            <p className="text-xs text-neutral-dark/60">
              Elige la ciudad donde brindarás tus servicios
            </p>
          </div>

          {/* Zona */}
          <div className="flex flex-col space-y-2">
            <div className="flex justify-between items-center">
              <label
                htmlFor="zona"
                className="text-neutral-dark font-medium flex items-center"
              >
                Zona <span className="text-red-500 ml-1">*</span>
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
                {formData.zona &&
                !getZonasOptions().some(
                  (option) => option.value === formData.zona
                ) ? (
                  <div className="w-full border-2 border-neutral-gray rounded-lg px-4 py-2.5 h-12 flex items-center justify-between">
                    <span>{formData.zona}</span>
                    <Button
                      icon="pi pi-pencil"
                      className="p-button-text p-button-sm"
                      onClick={() => {
                        setCustomZona(formData.zona);
                        setShowCustomZona(true);
                      }}
                    />
                  </div>
                ) : (
                  <Dropdown
                    id="zona"
                    value={formData.zona || ""}
                    onChange={(e) =>
                      updateFormData({
                        ...formData,
                        zona: e.value,
                      })
                    }
                    options={getZonasOptions()}
                    placeholder={
                      formData.city
                        ? "Selecciona tu zona"
                        : "Primero selecciona una ciudad"
                    }
                    className="w-full border-2 border-neutral-gray rounded-lg"
                    filter={true}
                    filterInputAutoFocus={true}
                    showFilterClear={true}
                    panelClassName="border border-neutral-gray rounded-xl shadow-lg"
                    disabled={!formData.city}
                  />
                )}
              </div>
            ) : (
              <div className="flex gap-2">
                <InputText
                  value={customZona}
                  onChange={(e) => setCustomZona(e.target.value)}
                  placeholder="Ingresa el nombre de tu zona"
                  className="flex-1 border-2 border-neutral-gray rounded-lg px-4 py-2.5 h-12"
                />
                <Button
                  icon="pi pi-check"
                  onClick={applyCustomZona}
                  className="px-4 py-2 bg-primary-dark text-white hover:bg-primary-dark/90 transition-colors rounded-lg"
                  disabled={!customZona.trim()}
                />
                <Button
                  icon="pi pi-times"
                  onClick={() => setShowCustomZona(false)}
                  className="px-4 py-2 border border-neutral-gray text-neutral-dark hover:bg-gray-100 transition-colors rounded-lg"
                />
              </div>
            )}
            <p className="text-xs text-neutral-dark/60">
              Selecciona la zona donde ofreces tus servicios
            </p>
          </div>
        </div>
      </div>

      {/* Botón continuar (a la derecha en desktop, full width en mobile) */}
      <div className="flex justify-end mt-2">
        <Button
          label="Continuar"
          icon="pi pi-arrow-right"
          iconPos="right"
          onClick={handleNext}
          className="w-full sm:w-auto px-10 py-3 bg-primary-dark text-white hover:bg-primary-dark/90 transition-all duration-200 rounded-lg shadow-sm"
        />
      </div>

      {/* Diálogo para cambiar de cuenta */}
      <Dialog
        visible={showSwitchAccountDialog}
        onHide={() => setShowSwitchAccountDialog(false)}
        header="Cambiar cuenta"
        className="w-full max-w-md rounded-xl shadow-lg overflow-hidden"
        headerClassName="bg-white border-b border-neutral-gray/10 p-4"
        contentClassName="p-0"
        footer={
          <div className="flex justify-end gap-3 p-4 border-t border-neutral-gray/10 bg-neutral-light/30">
            <Button
              label="Cancelar"
              className="px-4 py-2 border border-neutral-gray text-neutral-dark font-medium rounded-lg hover:bg-neutral-light"
              onClick={() => setShowSwitchAccountDialog(false)}
            />
            <Button
              label="Cambiar cuenta"
              icon="pi pi-sign-out"
              className="px-4 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700"
              onClick={handleSwitchAccount}
            />
          </div>
        }
      >
        <div className="p-6">
          <div className="mb-6 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-red-50 rounded-full mb-4">
              <i className="pi pi-user-minus text-red-500 text-2xl"></i>
            </div>
            <h3 className="text-lg font-semibold text-neutral-dark mb-1">
              ¿Cambiar de cuenta?
            </h3>
            <p className="text-sm text-neutral-dark/70 max-w-xs mx-auto">
              Esto cerrará la sesión actual e iniciará con otra cuenta de Google
            </p>
          </div>

          <div className="bg-neutral-light/40 rounded-lg p-4 flex items-center gap-4 border border-neutral-gray/20">
            <img
              src={currentUser.photoURL || "https://via.placeholder.com/40"}
              alt="Current account"
              className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm"
            />
            <div>
              <p className="font-medium text-neutral-dark">
                {currentUser.displayName}
              </p>
              <p className="text-sm text-neutral-dark/70">
                {currentUser.email}
              </p>
            </div>
          </div>

          <div className="mt-4 flex items-start gap-3 bg-blue-50 p-3 rounded-lg border border-blue-100">
            <i className="pi pi-info-circle text-blue-500 mt-0.5"></i>
            <p className="text-sm text-blue-700">
              Todos los datos ingresados se guardarán automáticamente y estarán
              disponibles cuando vuelvas a iniciar sesión.
            </p>
          </div>
        </div>
      </Dialog>
    </div>
  );
};

PersonalInfo.propTypes = {
  formData: PropTypes.object.isRequired,
  updateFormData: PropTypes.func.isRequired,
  onNext: PropTypes.func.isRequired,
};

export default PersonalInfo;
