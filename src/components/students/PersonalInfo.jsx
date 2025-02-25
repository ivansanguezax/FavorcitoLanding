import { useState, useEffect, useRef } from "react";
import { InputText } from "primereact/inputtext";
import { Calendar } from "primereact/calendar";
import { Button } from "primereact/button";
import { InputMask } from "primereact/inputmask";
import { Dropdown } from "primereact/dropdown";
import { Toast } from "primereact/toast";
import { Dialog } from "primereact/dialog";
import { ProgressSpinner } from "primereact/progressspinner";
import PropTypes from "prop-types";
import fileService from "../../services/fileService";
import zonasData from "../../utils/zonas.json"; // Importamos las zonas desde el JSON

const PersonalInfo = ({ formData, updateFormData, onNext, onPrevious }) => {
  const [minDate, setMinDate] = useState(new Date());
  const [maxDate, setMaxDate] = useState(new Date());
  const toast = useRef(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [preview, setPreview] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const fileInputRef = useRef(null);
  const dropZoneRef = useRef(null);

  // Definimos las ciudades usando las que están en el JSON
  const cities = Object.keys(zonasData.Bolivia).map((city) => ({
    label: city,
    value: city,
  }));

  // Las zonas ahora se cargan desde el archivo JSON
  const getZonasOptions = () => {
    if (!formData.city) return [];

    // Obtener las zonas para la ciudad seleccionada desde el JSON
    const zonasForCity = zonasData.Bolivia[formData.city] || [];

    // Convertir el array de strings a array de objetos para Dropdown
    return zonasForCity.map((zona) => ({
      label: zona,
      value: zona,
    }));
  };

  useEffect(() => {
    // Calcular fecha mínima (exactamente 25 años atrás)
    const twentyFiveYearsAgo = new Date();
    twentyFiveYearsAgo.setFullYear(twentyFiveYearsAgo.getFullYear() - 25);
    twentyFiveYearsAgo.setHours(0, 0, 0, 0);

    // Calcular fecha máxima (exactamente 18 años atrás)
    const eighteenYearsAgo = new Date();
    eighteenYearsAgo.setFullYear(eighteenYearsAgo.getFullYear() - 18);
    eighteenYearsAgo.setHours(23, 59, 59, 999);

    // Guardar ambas fechas en el estado
    setMinDate(twentyFiveYearsAgo);
    setMaxDate(eighteenYearsAgo);

    // Cargar datos del localStorage si están disponibles
    const savedData = localStorage.getItem("studentFormData");
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        if (parsedData && Object.keys(parsedData).length > 0) {
          updateFormData(parsedData);

          // Si ya hay un QR cargado, actualizar el estado
          if (parsedData.qrCode) {
            setPreview("Archivo cargado previamente");
          }
        }
      } catch (error) {
        console.error("Error parsing saved form data:", error);
      }
    }
  }, []);

  // Save to localStorage whenever formData changes
  useEffect(() => {
    if (Object.keys(formData).length > 0) {
      localStorage.setItem("studentFormData", JSON.stringify(formData));
    }
  }, [formData]);

  const formatDate = (date) => {
    if (!date) return null;

    if (typeof date === "string" && date.match(/^\d{4}-\d{2}-\d{2}$/)) {
      const [year, month, day] = date.split("-").map(Number);
      return new Date(year, month - 1, day);
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
      // Cambiamos province por zona
      showError("Zona es requerida");
      return false;
    }

    if (!formData.address || formData.address.trim() === "") {
      showError("Dirección es requerida");
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

      // Arreglar el manejo de la fecha para evitar problemas de zona horaria
      let formattedDate = formData.bornDate;

      if (formData.bornDate instanceof Date) {
        // Crear una fecha que preserva el día, mes y año exactos sin ajuste de zona horaria
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
        zona: formData.zona, // Usamos zona en lugar de province
        address: formData.address,
      };

      // Update form data
      updateFormData(updatedData);

      // Save to localStorage
      localStorage.setItem("studentFormData", JSON.stringify(updatedData));

      // Move to next step
      onNext();
    }
  };

  // QR Upload handlers
  const handleFile = (file) => {
    if (file) {
      setSelectedFile(file);
      setUploadSuccess(false);

      // Show preview of selected file
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const confirmUpload = async () => {
    if (!selectedFile) {
      toast.current.show({
        severity: "warn",
        summary: "No hay archivo",
        detail: "Por favor selecciona un archivo primero",
        life: 3000,
      });
      return;
    }

    try {
      setIsUploading(true);
      // Generate unique ID for the file name
      const uniqueId = Date.now().toString();

      // Convert to base64 and upload
      const base64String = await fileService.fileToBase64(selectedFile);
      const imageUrl = await fileService.uploadImage(base64String, uniqueId);

      // Update form data with the returned URL
      updateFormData({
        ...formData,
        qrCode: imageUrl,
      });

      setUploadSuccess(true);

      // Wait 1.5 seconds to show success message before closing
      setTimeout(() => {
        setShowUploadModal(false);
        toast.current.show({
          severity: "success",
          summary: "Carga exitosa",
          detail: "Tu código QR se ha cargado correctamente",
          life: 3000,
        });
      }, 1500);
    } catch (error) {
      console.error("Error uploading file:", error);
      toast.current.show({
        severity: "error",
        summary: "Error en la carga",
        detail:
          "No se pudo cargar tu código QR. Por favor, intenta nuevamente.",
        life: 5000,
      });
      setIsUploading(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
      // Abre el popup modal para mostrar la vista previa
      setShowUploadModal(true);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
      // Abre el popup si se selecciona un archivo
      setShowUploadModal(true);
    }
  };

  const handleQRBoxClick = () => {
    setShowUploadModal(true);
  };

  // Custom footer for the upload dialog
  const renderDialogFooter = () => {
    if (isUploading) return null;
    if (uploadSuccess) return null;

    return (
      <div className="flex justify-end gap-3 p-3 bg-gray-50 rounded-b-lg">
        <Button
          label="Cancelar"
          icon="pi pi-times"
          onClick={() => !isUploading && setShowUploadModal(false)}
          className="px-4 py-2 border border-neutral-gray text-neutral-dark hover:bg-gray-100 transition-colors rounded-lg"
        />
        <Button
          label="Subir código QR"
          icon="pi pi-upload"
          onClick={confirmUpload}
          className="px-4 py-2 bg-primary-dark text-white hover:bg-primary-dark/90 transition-colors rounded-lg"
          disabled={!selectedFile}
        />
      </div>
    );
  };

  // Custom styles for dropdowns
  const dropdownClassName =
    "w-full border-2 border-neutral-gray rounded-lg focus:border-primary-dark";

  return (
    <div className="flex flex-col space-y-8">
      <Toast ref={toast} />

      <h2 className="text-2xl font-semibold text-center text-neutral-dark">
        Información Personal
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
        <div className="flex flex-col space-y-2">
          <label htmlFor="fullName" className="text-neutral-dark font-medium">
            Nombre completo <span className="text-red-500">*</span>
          </label>
          <InputText
            id="fullName"
            value={formData.fullName || ""}
            onChange={(e) =>
              updateFormData({
                ...formData,
                fullName: e.target.value,
              })
            }
            className="w-full border-2 border-neutral-gray rounded-lg px-4 py-2.5 h-12"
            placeholder="Ingresa tu nombre completo"
          />
        </div>

        <div className="flex flex-col space-y-2">
          <label htmlFor="bornDate" className="text-neutral-dark font-medium">
            Fecha de nacimiento <span className="text-red-500">*</span>
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
              panelClassName="border border-neutral-gray rounded-lg shadow-lg p-2"
              view="date"
              viewDate={new Date(new Date().getFullYear() - 20, 0, 1)}
              yearNavigator
              yearRange={`${new Date().getFullYear() - 25}:${
                new Date().getFullYear() - 18
              }`}
            />
          </div>
        </div>

        <div className="flex flex-col space-y-2">
          <label htmlFor="email" className="text-neutral-dark font-medium">
            Correo electrónico <span className="text-red-500">*</span>
          </label>
          <InputText
            id="email"
            value={formData.email || ""}
            onChange={(e) =>
              updateFormData({
                ...formData,
                email: e.target.value,
              })
            }
            className="w-full border-2 border-neutral-gray rounded-lg px-4 py-2.5 h-12"
            placeholder="correo@ejemplo.com"
            type="email"
          />
        </div>

        <div className="flex flex-col space-y-2">
          <label htmlFor="phone" className="text-neutral-dark font-medium">
            Número de teléfono <span className="text-red-500">*</span>
          </label>
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
            className="w-full border-2 border-neutral-gray rounded-lg px-4 py-2.5 h-12"
          />
        </div>

        <div className="flex flex-col space-y-2">
          <label htmlFor="city" className="text-neutral-dark font-medium">
            Ciudad <span className="text-red-500">*</span>
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
            className={dropdownClassName}
            filter
            filterInputAutoFocus
            showFilterClear
            panelClassName="border border-neutral-gray rounded-lg shadow-lg"
          />
        </div>

        <div className="flex flex-col space-y-2">
          <label htmlFor="zona" className="text-neutral-dark font-medium">
            Zona <span className="text-red-500">*</span>
          </label>
          <Dropdown
            id="zona"
            value={formData.zona || ""} // Cambiamos province por zona
            onChange={(e) =>
              updateFormData({
                ...formData,
                zona: e.value, // Cambiamos province por zona
              })
            }
            options={getZonasOptions()}
            placeholder={
              formData.city
                ? "Selecciona tu zona"
                : "Primero selecciona una ciudad"
            }
            className={dropdownClassName}
            filter={true}
            filterInputAutoFocus={true}
            showFilterClear={true}
            panelClassName="border border-neutral-gray rounded-lg shadow-lg"
            disabled={!formData.city}
          />
        </div>

        <div className="flex flex-col space-y-2 md:col-span-2">
          <label htmlFor="address" className="text-neutral-dark font-medium">
            Dirección <span className="text-red-500">*</span>
          </label>
          <InputText
            id="address"
            value={formData.address || ""}
            onChange={(e) =>
              updateFormData({
                ...formData,
                address: e.target.value,
              })
            }
            className="w-full border-2 border-neutral-gray rounded-lg px-4 py-2.5 h-12"
            placeholder="Dirección exacta (calle, número, zona)"
          />
          <p className="text-xs text-neutral-gray mt-1">
            * Tu dirección se usará para conectarte con solicitudes de servicios
            cercanos a tu ubicación
          </p>
        </div>

        <div className="flex flex-col space-y-2 md:col-span-2 mt-4">
          <label className="text-neutral-dark font-medium">
            QR de pago <span className="text-neutral-gray">(opcional)</span>
          </label>
          <div
            ref={dropZoneRef}
            onClick={handleQRBoxClick}
            className="border-2 border-dashed border-neutral-gray rounded-lg p-4 cursor-pointer hover:border-primary-dark hover:bg-primary-light/5 transition-all"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
          >
            {formData.qrCode ? (
              <div className="flex items-center space-x-4">
                <div className="bg-green-50 p-2 rounded-full">
                  <i className="pi pi-credit-card text-2xl text-green-500"></i>
                </div>
                <div className="flex-1">
                  <span className="text-neutral-dark font-medium">
                    Código QR cargado correctamente
                  </span>
                  <p className="text-xs text-neutral-gray mt-1">
                    Haz clic para cambiar el código si lo necesitas
                  </p>
                </div>
                <Button
                  icon="pi pi-pencil"
                  className="p-button-rounded p-button-outlined p-button-sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowUploadModal(true);
                  }}
                />
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-4">
                <i className="pi pi-credit-card text-4xl text-neutral-gray mb-2"></i>
                <p className="text-neutral-dark font-medium">
                  Subir QR para recibir pagos
                </p>
                <p className="text-sm text-neutral-gray mt-1">
                  Arrastra y suelta o haz clic para seleccionar
                </p>
              </div>
            )}
          </div>
          <p className="text-xs text-neutral-gray mt-1">
            * Sube el QR de tu cuenta bancaria o billetera móvil para recibir
            pagos por tus servicios
          </p>
        </div>
      </div>

      <div className=" px-3 py-4 flex flex-col-reverse sm:flex-row justify-between gap-3">
        <Button
          label="Atrás"
          icon="pi pi-arrow-left"
          onClick={onPrevious}
          className="px-6 py-3 text-primary-dark border-2 border-primary-dark hover:bg-primary-dark hover:text-white transition-all duration-200"
        />
        <Button
          label="Siguiente"
          icon="pi pi-arrow-right"
          onClick={handleNext}
          className="px-6 py-3 text-primary-dark border-2 border-primary-dark hover:bg-primary-dark hover:text-white transition-all duration-200"
        />
      </div>

      <Dialog
        visible={showUploadModal}
        onHide={() =>
          !isUploading && !uploadSuccess && setShowUploadModal(false)
        }
        header={uploadSuccess ? null : "Subir código QR de pago"}
        footer={renderDialogFooter()}
        className="w-full max-w-2xl overflow-hidden rounded-lg"
        closable={!isUploading && !uploadSuccess}
        showHeader={!uploadSuccess}
        contentClassName="p-0"
        headerClassName="bg-white border-b border-neutral-gray p-4"
      >
        {isUploading ? (
          <div className="flex flex-col items-center justify-center p-8 bg-white">
            <ProgressSpinner
              style={{ width: "60px", height: "60px" }}
              strokeWidth="4"
              animationDuration=".5s"
            />
            <p className="mt-6 text-center text-neutral-dark font-medium">
              Subiendo tu código QR, por favor espera...
            </p>
            <p className="mt-2 text-center text-neutral-gray text-sm">
              Esto puede tomar unos segundos
            </p>
          </div>
        ) : uploadSuccess ? (
          <div className="flex flex-col items-center justify-center p-8 bg-green-50">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-4">
              <i className="pi pi-check-circle text-4xl text-green-500"></i>
            </div>
            <h3 className="text-xl font-medium text-green-800 mb-2">
              ¡Código QR subido con éxito!
            </h3>
            <p className="text-center text-green-700 mb-6">
              Tu código de pago ha sido cargado correctamente
            </p>
          </div>
        ) : (
          <div className="p-6 bg-white">
            <div
              ref={fileInputRef}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              className={`relative border-2 border-dashed rounded-lg p-8 transition-colors
                ${
                  dragActive
                    ? "border-primary-dark bg-primary-light/10"
                    : "border-neutral-gray"
                }`}
            >
              <input
                type="file"
                accept="image/*"
                onChange={handleChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              {preview ? (
                <div className="flex flex-col items-center">
                  <div className="relative mb-4 p-2 bg-white shadow-md rounded-lg">
                    <img
                      src={preview}
                      alt="Vista previa"
                      className="max-h-56 max-w-full object-contain rounded"
                    />
                    <div className="absolute top-2 right-2">
                      <Button
                        icon="pi pi-times"
                        className="p-button-rounded p-button-danger p-button-sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          setPreview(null);
                          setSelectedFile(null);
                          toast.current.show({
                            severity: "info",
                            summary: "Archivo eliminado",
                            detail:
                              "Asegúrate de mostrar el lado donde está tu código QR cuando agregues un nuevo documento",
                            life: 5000,
                          });
                        }}
                      />
                    </div>
                  </div>
                  <p className="text-sm text-neutral-dark text-center">
                    Haz clic en "Subir código QR" para cargar esta imagen
                  </p>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center text-center">
                  <div className="bg-primary-light/10 p-4 rounded-full mb-4">
                    <i className="pi pi-credit-card text-4xl text-primary-dark"></i>
                  </div>
                  <p className="text-lg font-medium text-neutral-dark mb-2">
                    Arrastra y suelta tu código QR aquí
                  </p>
                  <p className="text-sm text-neutral-gray mb-4">
                    o haz clic para seleccionar
                  </p>
                  <div className="flex gap-3 mb-4">
                    <div className="flex items-center px-3 py-2 bg-gray-50 rounded-lg">
                      <i className="pi pi-image text-blue-500 mr-2"></i>
                      <span className="text-sm">JPG</span>
                    </div>
                    <div className="flex items-center px-3 py-2 bg-gray-50 rounded-lg">
                      <i className="pi pi-image text-green-500 mr-2"></i>
                      <span className="text-sm">PNG</span>
                    </div>
                  </div>
                  <p className="text-xs text-neutral-gray mt-2">
                    Tamaño máximo: 25MB
                  </p>
                  <div className="mt-6 p-3 bg-blue-50 rounded-lg max-w-sm">
                    <p className="text-xs text-blue-700">
                      <i className="pi pi-info-circle mr-1"></i>
                      Asegúrate de que tu código QR es legible y corresponde a
                      la cuenta donde quieres recibir los pagos
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </Dialog>
    </div>
  );
};

PersonalInfo.propTypes = {
  formData: PropTypes.object.isRequired,
  updateFormData: PropTypes.func.isRequired,
  onNext: PropTypes.func.isRequired,
  onPrevious: PropTypes.func.isRequired,
};

export default PersonalInfo;
