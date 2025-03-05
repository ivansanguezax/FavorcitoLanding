import { useState, useEffect, useRef } from "react";
import { Button } from "primereact/button";
import PropTypes from "prop-types";
import { Dialog } from "primereact/dialog";
import { ProgressSpinner } from "primereact/progressspinner";
import { Toast } from "primereact/toast";
import { fileService } from "../../services/fileService";

const AcademicInfo = ({ formData, updateFormData, onNext, onPrevious }) => {
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [preview, setPreview] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const toast = useRef(null);
  const fileInputRef = useRef(null);
  const dropZoneRef = useRef(null);

  useEffect(() => {
    const savedData = localStorage.getItem("studentFormData");
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        if (parsedData && Object.keys(parsedData).length > 0) {
          updateFormData(parsedData);

          if (parsedData.uniID) {
            setPreview("Archivo cargado previamente");
          }
        }
      } catch (error) {
        console.error("Error parsing saved form data:", error);
      }
    }
  }, []);

  useEffect(() => {
    if (Object.keys(formData).length > 0) {
      localStorage.setItem("studentFormData", JSON.stringify(formData));
    }
  }, [formData]);

  const handleFile = (file) => {
    if (file) {
      setSelectedFile(file);
      setUploadSuccess(false);

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

      updateFormData({
        ...formData,
        university: "Universidad pendiente",
        degree: "Universidad pendiente",
        year: 1,
        uniID: imageUrl,
      });

      setUploadSuccess(true);

      setTimeout(() => {
        setShowUploadModal(false);
        toast.current.show({
          severity: "success",
          summary: "Carga exitosa",
          detail: "Tu carnet universitario se ha cargado correctamente",
          life: 3000,
        });
      }, 1500);
    } catch (error) {
      console.error("Error uploading file:", error);
      toast.current.show({
        severity: "error",
        summary: "Error en la carga",
        detail:
          "No se pudo cargar tu carnet universitario. Por favor, intenta nuevamente.",
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
      setShowUploadModal(true);
    }
  };

  const closeDialog = () => {
    if (!isUploading) {
      setShowUploadModal(false);
      if (!uploadSuccess) {
        setSelectedFile(null);
        setPreview(null);
      }
    }
  };

  const validateForm = () => {
    if (!formData.uniID) {
      toast.current.show({
        severity: "error",
        summary: "Carnet universitario requerido",
        detail:
          "Por favor sube una imagen de tu carnet universitario para continuar",
        life: 3000,
      });
      return false;
    }
    return true;
  };

  const handleNext = () => {
    if (validateForm()) {
      const updatedFormData = {
        ...formData,
        university: "Universidad pendiente",
        degree: "Universidad pendiente",
        year: 1,
        uniID: formData.uniID,
      };

      updateFormData(updatedFormData);

      localStorage.setItem("studentFormData", JSON.stringify(updatedFormData));

      onNext();
    }
  };

  const handleIdCardBoxClick = () => {
    setSelectedFile(null);
    setPreview(null);
    setUploadSuccess(false);
    setIsUploading(false);
    setShowUploadModal(true);
  };

  const renderDialogFooter = () => {
    if (isUploading) return null;
    if (uploadSuccess) return null;

    return (
      <div className="flex justify-end gap-3 p-4 bg-gray-50 rounded-b-lg border-t border-gray-100">
        <Button
          label="Cancelar"
          icon="pi pi-times"
          onClick={() => !isUploading && closeDialog()}
          className="px-4 py-2 border border-neutral-gray text-neutral-dark hover:bg-gray-100 transition-colors rounded-lg"
        />

        <Button
          label="Subir archivo"
          icon="pi pi-upload"
          onClick={confirmUpload}
          className="px-4 py-2 bg-primary-dark text-white hover:bg-primary-dark/90 transition-colors rounded-lg shadow-sm"
          disabled={!selectedFile}
        />
      </div>
    );
  };

  return (
    <div className="flex flex-col space-y-8">
      <Toast ref={toast} />

      <h2 className="text-2xl font-semibold text-center text-neutral-dark mb-2">
        Información Académica
      </h2>

      <div className="mx-auto max-w-xl w-full px-4">
        <div className="flex flex-col space-y-6">
          {/* Card con instrucciones más visual */}
          <div className="bg-gradient-to-r from-blue-50 to-primary-light/20 rounded-xl overflow-hidden shadow-sm border border-primary-dark/10">
            <div className="flex items-center p-4 border-b border-primary-dark/10 bg-white/80">
              <div className="w-10 h-10 rounded-full bg-primary-dark/10 flex items-center justify-center mr-3">
                <i className="pi pi-info-circle text-primary-dark"></i>
              </div>
              <h3 className="text-lg font-medium text-primary-dark">
                Información importante
              </h3>
            </div>

            <div className="p-5">
              <p className="text-neutral-dark mb-3">
                Para agilizar tu registro, necesitamos que subas una{" "}
                <strong>foto clara</strong> de tu carnet universitario donde se
                vea:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                <div className="flex items-start p-3 bg-white/80 rounded-lg border border-primary-dark/10">
                  <div className="w-8 h-8 rounded-full bg-primary-dark/10 flex items-center justify-center mr-3 flex-shrink-0">
                    <i className="pi pi-building text-primary-dark text-sm"></i>
                  </div>
                  <div>
                    <h4 className="font-medium text-primary-dark text-sm">
                      Nombre de tu universidad
                    </h4>
                    <p className="text-xs text-neutral-dark/80 mt-1">
                      El nombre completo de tu institución educativa
                    </p>
                  </div>
                </div>

                <div className="flex items-start p-3 bg-white/80 rounded-lg border border-primary-dark/10">
                  <div className="w-8 h-8 rounded-full bg-primary-dark/10 flex items-center justify-center mr-3 flex-shrink-0">
                    <i className="pi pi-book text-primary-dark text-sm"></i>
                  </div>
                  <div>
                    <h4 className="font-medium text-primary-dark text-sm">
                      Tu carrera
                    </h4>
                    <p className="text-xs text-neutral-dark/80 mt-1">
                      La carrera o programa que estás cursando
                    </p>
                  </div>
                </div>

                <div className="flex items-start p-3 bg-white/80 rounded-lg border border-primary-dark/10">
                  <div className="w-8 h-8 rounded-full bg-primary-dark/10 flex items-center justify-center mr-3 flex-shrink-0">
                    <i className="pi pi-calendar text-primary-dark text-sm"></i>
                  </div>
                  <div>
                    <h4 className="font-medium text-primary-dark text-sm">
                      Semestre o año
                    </h4>
                    <p className="text-xs text-neutral-dark/80 mt-1">
                      El semestre o año académico actual
                    </p>
                  </div>
                </div>

                <div className="flex items-start p-3 bg-white/80 rounded-lg border border-primary-dark/10">
                  <div className="w-8 h-8 rounded-full bg-primary-dark/10 flex items-center justify-center mr-3 flex-shrink-0">
                    <i className="pi pi-user text-primary-dark text-sm"></i>
                  </div>
                  <div>
                    <h4 className="font-medium text-primary-dark text-sm">
                      Tu nombre completo
                    </h4>
                    <p className="text-xs text-neutral-dark/80 mt-1">
                      Tu nombre tal como aparece en el documento
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center bg-white/90 p-3 rounded-lg border border-yellow-200 text-sm">
                <i className="pi pi-check-circle text-yellow-600 mr-2"></i>
                <p className="text-neutral-dark">
                  Nuestro equipo validará esta información manualmente para
                  activar tu cuenta.
                </p>
              </div>
            </div>
          </div>

          {/* Área de carga mejorada */}
          <div className="flex flex-col space-y-3">
            <label className="text-neutral-dark font-medium flex items-center">
              Carnet universitario <span className="text-red-500 ml-1">*</span>
            </label>

            <div
              ref={dropZoneRef}
              onClick={handleIdCardBoxClick}
              className={`border-2 border-dashed rounded-xl p-6 cursor-pointer transition-all ${
                dragActive
                  ? "border-primary-dark bg-primary-light/10"
                  : "border-neutral-gray hover:border-primary-dark hover:bg-primary-light/5"
              }`}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
            >
              {formData.uniID ? (
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center shadow-sm">
                    <i className="pi pi-check-circle text-2xl text-green-500"></i>
                  </div>
                  <div className="flex-1">
                    <span className="text-neutral-dark font-medium">
                      Archivo cargado correctamente
                    </span>
                    <p className="text-xs text-neutral-dark/70 mt-1">
                      Haz clic para cambiar el archivo si lo necesitas
                    </p>
                  </div>
                  <Button
                    icon="pi pi-pencil"
                    className="p-button-rounded p-button-outlined"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedFile(null);
                      setPreview(null);
                      setUploadSuccess(false);
                      setIsUploading(false);
                      setShowUploadModal(true);
                    }}
                  />
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8">
                  <div className="w-16 h-16 rounded-full bg-primary-light/20 flex items-center justify-center mb-4">
                    <i className="pi pi-upload text-3xl text-primary-dark"></i>
                  </div>
                  <p className="text-lg font-medium text-neutral-dark mb-2">
                    Subir carnet universitario
                  </p>
                  <p className="text-sm text-neutral-dark/70 mb-4">
                    Arrastra y suelta o haz clic para seleccionar
                  </p>
                  <div className="flex gap-3">
                    <span className="inline-flex items-center px-3 py-1.5 bg-gray-50 rounded-full text-xs font-medium text-neutral-dark border border-gray-200">
                      <i className="pi pi-file-pdf text-red-500 mr-1.5"></i>
                      PDF
                    </span>
                    <span className="inline-flex items-center px-3 py-1.5 bg-gray-50 rounded-full text-xs font-medium text-neutral-dark border border-gray-200">
                      <i className="pi pi-image text-blue-500 mr-1.5"></i>
                      JPG
                    </span>
                    <span className="inline-flex items-center px-3 py-1.5 bg-gray-50 rounded-full text-xs font-medium text-neutral-dark border border-gray-200">
                      <i className="pi pi-image text-green-500 mr-1.5"></i>
                      PNG
                    </span>
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center text-neutral-dark/70 text-xs">
              <i className="pi pi-info-circle mr-2 text-primary-dark/80"></i>
              <p>
                Si aún no tienes el carnet universitario, puedes subir tu
                factura de pago del semestre o una constancia de estudios.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="px-3 py-4 flex flex-col-reverse sm:flex-row justify-between gap-3 max-w-xl mx-auto w-full">
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
        onHide={closeDialog}
        header={uploadSuccess ? null : "Subir carnet universitario"}
        footer={renderDialogFooter()}
        closable={!isUploading && !uploadSuccess}
        showHeader={!uploadSuccess}
        contentClassName="p-0"
        headerClassName="bg-white border-b border-neutral-gray p-4"
        className="w-full max-w-xl"
        breakpoints={{ "960px": "90vw", "640px": "95vw" }}
      >
        {isUploading ? (
          <div className="flex flex-col items-center justify-center p-8 bg-white">
            <ProgressSpinner
              style={{ width: "60px", height: "60px" }}
              strokeWidth="4"
              animationDuration=".5s"
            />
            <p className="mt-6 text-center text-neutral-dark font-medium">
              Subiendo tu archivo, por favor espera...
            </p>
            <p className="mt-2 text-center text-neutral-gray text-sm">
              Esto puede tomar unos segundos
            </p>
          </div>
        ) : uploadSuccess ? (
          <div className="flex flex-col items-center justify-center p-8 bg-green-50">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-4 shadow-md">
              <i className="pi pi-check-circle text-4xl text-green-500"></i>
            </div>
            <h3 className="text-xl font-medium text-green-800 mb-2">
              ¡Archivo subido con éxito!
            </h3>
            <p className="text-center text-green-700 mb-6">
              Tu carnet universitario ha sido cargado correctamente
            </p>
          </div>
        ) : (
          <div className="p-6 bg-white">
            <div
              ref={fileInputRef}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              className={`relative border-2 border-dashed rounded-xl p-8 transition-colors
                ${
                  dragActive
                    ? "border-primary-dark bg-primary-light/10"
                    : "border-neutral-gray"
                }`}
            >
              <input
                type="file"
                accept="image/*,application/pdf"
                onChange={handleChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              {preview ? (
                <div className="flex flex-col items-center">
                  {preview.startsWith("data:image") ? (
                    <div className="relative mb-4 p-3 bg-white shadow-md rounded-lg border border-neutral-gray/20">
                      <img
                        src={preview}
                        alt="Vista previa"
                        className="max-h-64 max-w-full object-contain rounded"
                      />
                      <div className="absolute top-2 right-2">
                        <Button
                          icon="pi pi-times"
                          className="p-button-rounded p-button-danger p-button-sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            setPreview(null);
                            setSelectedFile(null);
                          }}
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="w-full p-6 mb-4 bg-gray-50 border border-neutral-gray rounded-lg text-center">
                      <i className="pi pi-file-pdf text-4xl text-primary-dark"></i>
                      <p className="mt-3 text-neutral-dark font-medium">
                        Archivo PDF seleccionado
                      </p>
                      <p className="mt-1 text-sm text-neutral-gray">
                        {selectedFile?.name}
                      </p>
                      <Button
                        icon="pi pi-times"
                        label="Cambiar archivo"
                        className="p-button-text p-button-sm mt-3"
                        onClick={(e) => {
                          e.stopPropagation();
                          setPreview(null);
                          setSelectedFile(null);
                        }}
                      />
                    </div>
                  )}
                  <div className="flex items-center justify-center gap-2 bg-primary-light/20 p-3 rounded-lg mt-2">
                    <i className="pi pi-check-circle text-green-600"></i>
                    <p className="text-sm text-neutral-dark">
                      Haz clic en &quot;Subir archivo&quot; para cargar este
                      documento
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center text-center">
                  <div className="bg-primary-light/10 p-4 rounded-full mb-4">
                    <i className="pi pi-upload text-4xl text-primary-dark"></i>
                  </div>
                  <p className="text-lg font-medium text-neutral-dark mb-2">
                    Arrastra y suelta tu archivo aquí
                  </p>
                  <p className="text-sm text-neutral-gray mb-4">
                    o haz clic para seleccionar
                  </p>
                  <div className="flex gap-3 mb-4">
                    <div className="flex items-center px-3 py-2 bg-gray-50 rounded-lg border border-gray-200">
                      <i className="pi pi-file-pdf text-red-500 mr-2"></i>
                      <span className="text-sm">PDF</span>
                    </div>
                    <div className="flex items-center px-3 py-2 bg-gray-50 rounded-lg border border-gray-200">
                      <i className="pi pi-image text-blue-500 mr-2"></i>
                      <span className="text-sm">JPG</span>
                    </div>
                    <div className="flex items-center px-3 py-2 bg-gray-50 rounded-lg border border-gray-200">
                      <i className="pi pi-image text-green-500 mr-2"></i>
                      <span className="text-sm">PNG</span>
                    </div>
                  </div>
                  <p className="text-xs text-neutral-gray mt-2 mb-4">
                    Tamaño máximo: 10MB
                  </p>

                  <div className="mt-2 p-4 bg-gradient-to-r from-blue-50 to-primary-light/10 rounded-lg border border-primary-dark/5 shadow-sm">
                    <h4 className="text-sm font-medium text-primary-dark mb-2 flex items-center">
                      <i className="pi pi-check-circle mr-2 text-primary-dark"></i>
                      Asegúrate que se vea claramente:
                    </h4>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="flex items-center">
                        <div className="w-6 h-6 rounded-full bg-primary-dark/10 flex items-center justify-center mr-2">
                          <i className="pi pi-building text-primary-dark text-xs"></i>
                        </div>
                        <span className="text-xs text-neutral-dark">
                          Universidad
                        </span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-6 h-6 rounded-full bg-primary-dark/10 flex items-center justify-center mr-2">
                          <i className="pi pi-book text-primary-dark text-xs"></i>
                        </div>
                        <span className="text-xs text-neutral-dark">
                          Carrera
                        </span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-6 h-6 rounded-full bg-primary-dark/10 flex items-center justify-center mr-2">
                          <i className="pi pi-calendar text-primary-dark text-xs"></i>
                        </div>
                        <span className="text-xs text-neutral-dark">
                          Semestre/año
                        </span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-6 h-6 rounded-full bg-primary-dark/10 flex items-center justify-center mr-2">
                          <i className="pi pi-user text-primary-dark text-xs"></i>
                        </div>
                        <span className="text-xs text-neutral-dark">
                          Tu nombre
                        </span>
                      </div>
                    </div>
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

AcademicInfo.propTypes = {
  formData: PropTypes.object.isRequired,
  updateFormData: PropTypes.func.isRequired,
  onNext: PropTypes.func.isRequired,
  onPrevious: PropTypes.func.isRequired,
};

export default AcademicInfo;
