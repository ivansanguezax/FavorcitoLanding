import { useState, useEffect, useRef } from "react";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { ProgressSpinner } from "primereact/progressspinner";
import { Toast } from "primereact/toast";
import PropTypes from "prop-types";
import { fileService } from "../../services/fileService";

const AcademicUploadStep = ({ formData, updateFormData }) => {
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
    // Si ya tiene un ID de carnet subido, mostrar mensaje de previamente cargado
    if (formData.uniID && formData.uniID !== "Calculadora") {
      setPreview("Archivo cargado previamente");
      setUploadSuccess(true);
    }
  }, [formData.uniID]);

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
      <div className="flex justify-end gap-2 p-3 bg-gray-50 rounded-b-lg border-t border-gray-100">
        <Button
          label="Cancelar"
          icon="pi pi-times"
          onClick={() => !isUploading && closeDialog()}
          className="px-3 py-2 border border-neutral-gray text-neutral-dark hover:bg-gray-100 transition-colors rounded-lg text-sm"
        />

        <Button
          label="Subir"
          icon="pi pi-upload"
          onClick={confirmUpload}
          className="px-3 py-2 bg-primary-dark text-white hover:bg-primary-dark/90 transition-colors rounded-lg shadow-sm text-sm"
          disabled={!selectedFile}
        />
      </div>
    );
  };

  return (
    <div className="flex flex-col space-y-4">
      <Toast ref={toast} />

      <div className="w-full px-2">
        <div className="flex flex-col space-y-4">
          {/* Card con instrucciones más compacta */}
          <div className="bg-gradient-to-r from-blue-50 to-primary-light/20 rounded-lg overflow-hidden shadow-sm border border-primary-dark/10">
            <div className="flex items-center p-3 border-b border-primary-dark/10 bg-white/80">
              <div className="w-8 h-8 rounded-full bg-primary-dark/10 flex items-center justify-center mr-2">
                <i className="pi pi-info-circle text-primary-dark text-sm"></i>
              </div>
              <h3 className="text-base font-medium text-primary-dark">
                Información importante
              </h3>
            </div>

            <div className="p-3">
              <p className="text-sm text-neutral-dark mb-2">
                Para agilizar tu registro, necesitamos una{" "}
                <strong>foto clara</strong> de tu carnet universitario donde se vea:
              </p>

              <div className="grid grid-cols-2 gap-2 mb-3">
                <div className="flex items-start p-2 bg-white/80 rounded-lg border border-primary-dark/10">
                  <i className="pi pi-building text-primary-dark text-sm mt-0.5 mr-1.5"></i>
                  <div>
                    <h4 className="font-medium text-primary-dark text-xs">
                      Universidad
                    </h4>
                  </div>
                </div>

                <div className="flex items-start p-2 bg-white/80 rounded-lg border border-primary-dark/10">
                  <i className="pi pi-book text-primary-dark text-sm mt-0.5 mr-1.5"></i>
                  <div>
                    <h4 className="font-medium text-primary-dark text-xs">
                      Carrera
                    </h4>
                  </div>
                </div>

                <div className="flex items-start p-2 bg-white/80 rounded-lg border border-primary-dark/10">
                  <i className="pi pi-calendar text-primary-dark text-sm mt-0.5 mr-1.5"></i>
                  <div>
                    <h4 className="font-medium text-primary-dark text-xs">
                      Año
                    </h4>
                  </div>
                </div>

                <div className="flex items-start p-2 bg-white/80 rounded-lg border border-primary-dark/10">
                  <i className="pi pi-user text-primary-dark text-sm mt-0.5 mr-1.5"></i>
                  <div>
                    <h4 className="font-medium text-primary-dark text-xs">
                      Tu nombre
                    </h4>
                  </div>
                </div>
              </div>

              <div className="flex items-center bg-white/90 p-2 rounded-lg border border-yellow-200 text-xs">
                <i className="pi pi-check-circle text-yellow-600 mr-1.5"></i>
                <p className="text-neutral-dark">
                  Nuestro equipo validará esta información para activar tu cuenta.
                </p>
              </div>
            </div>
          </div>

          {/* Área de carga simplificada */}
          <div className="flex flex-col space-y-2">
            <label className="text-neutral-dark font-medium text-sm flex items-center">
              Carnet universitario <span className="text-red-500 ml-1">*</span>
            </label>

            <div
              ref={dropZoneRef}
              onClick={handleIdCardBoxClick}
              className={`border-2 border-dashed rounded-lg p-4 cursor-pointer transition-all ${
                dragActive
                  ? "border-primary-dark bg-primary-light/10"
                  : "border-neutral-gray hover:border-primary-dark hover:bg-primary-light/5"
              }`}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
            >
              {formData.uniID && formData.uniID !== "Calculadora" ? (
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 bg-green-50 rounded-full flex items-center justify-center shadow-sm flex-shrink-0">
                    <i className="pi pi-check-circle text-xl text-green-500"></i>
                  </div>
                  <div className="flex-1">
                    <span className="text-sm text-neutral-dark font-medium">
                      Archivo cargado correctamente
                    </span>
                    <p className="text-xs text-neutral-dark/70">
                      Toca para cambiar el archivo
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-4">
                  <div className="w-12 h-12 rounded-full bg-primary-light/20 flex items-center justify-center mb-2">
                    <i className="pi pi-upload text-2xl text-primary-dark"></i>
                  </div>
                  <p className="text-sm font-medium text-neutral-dark mb-1">
                    Subir carnet universitario
                  </p>
                  <p className="text-xs text-neutral-dark/70 mb-2">
                    Toca para seleccionar archivo
                  </p>
                </div>
              )}
            </div>

            <div className="flex items-center text-neutral-dark/70 text-xs">
              <i className="pi pi-info-circle mr-1 text-primary-dark/80 text-xs"></i>
              <p>
                Puedes usar constancia de estudios si no tienes carnet.
              </p>
            </div>
          </div>
        </div>
      </div>

      <Dialog
        visible={showUploadModal}
        onHide={closeDialog}
        header={uploadSuccess ? null : "Subir carnet"}
        footer={renderDialogFooter()}
        closable={!isUploading && !uploadSuccess}
        showHeader={!uploadSuccess}
        contentClassName="p-0"
        headerClassName="bg-white border-b border-neutral-gray p-3"
        className="w-full max-w-md"
        breakpoints={{ "960px": "85vw", "640px": "90vw" }}
        style={{ width: '90vw', maxWidth: '480px' }}
      >
        {isUploading ? (
          <div className="flex flex-col items-center justify-center p-6 bg-white">
            <ProgressSpinner
              style={{ width: "50px", height: "50px" }}
              strokeWidth="4"
              animationDuration=".5s"
            />
            <p className="mt-4 text-center text-neutral-dark font-medium text-sm">
              Subiendo archivo...
            </p>
            <p className="mt-1 text-center text-neutral-gray text-xs">
              Esto puede tomar unos segundos
            </p>
          </div>
        ) : uploadSuccess ? (
          <div className="flex flex-col items-center justify-center p-6 bg-green-50">
            <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center mb-3 shadow-md">
              <i className="pi pi-check-circle text-3xl text-green-500"></i>
            </div>
            <h3 className="text-lg font-medium text-green-800 mb-1">
              ¡Archivo subido con éxito!
            </h3>
            <p className="text-center text-green-700 text-sm">
              Tu carnet ha sido cargado correctamente
            </p>
          </div>
        ) : (
          <div className="p-3 bg-white">
            <div
              ref={fileInputRef}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              className={`relative border-2 border-dashed rounded-lg p-4 transition-colors
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
                    <div className="relative mb-3 p-2 bg-white shadow-md rounded-lg border border-neutral-gray/20">
                      <img
                        src={preview}
                        alt="Vista previa"
                        className="max-h-40 max-w-full object-contain rounded"
                      />
                      <div className="absolute top-1 right-1">
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
                    <div className="w-full p-4 mb-3 bg-gray-50 border border-neutral-gray rounded-lg text-center">
                      <i className="pi pi-file-pdf text-3xl text-primary-dark"></i>
                      <p className="mt-2 text-sm text-neutral-dark font-medium">
                        PDF seleccionado
                      </p>
                      <p className="mt-1 text-xs text-neutral-gray">
                        {selectedFile?.name}
                      </p>
                      <Button
                        icon="pi pi-times"
                        label="Cambiar"
                        className="p-button-text p-button-sm mt-2 text-xs"
                        onClick={(e) => {
                          e.stopPropagation();
                          setPreview(null);
                          setSelectedFile(null);
                        }}
                      />
                    </div>
                  )}
                  <div className="flex items-center justify-center gap-1 bg-primary-light/20 p-2 rounded-lg text-xs">
                    <i className="pi pi-check-circle text-green-600"></i>
                    <p className="text-neutral-dark">
                      Haz clic en &quot;Subir&quot; para continuar
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center text-center">
                  <div className="bg-primary-light/10 p-3 rounded-full mb-3">
                    <i className="pi pi-upload text-2xl text-primary-dark"></i>
                  </div>
                  <p className="text-sm font-medium text-neutral-dark mb-1">
                    Toca para seleccionar
                  </p>
                  <p className="text-xs text-neutral-gray mb-2">
                    o arrastra y suelta aquí
                  </p>
                  <div className="flex gap-2 mb-3">
                    <div className="flex items-center px-2 py-1 bg-gray-50 rounded-lg border border-gray-200">
                      <i className="pi pi-file-pdf text-red-500 mr-1 text-xs"></i>
                      <span className="text-xs">PDF</span>
                    </div>
                    <div className="flex items-center px-2 py-1 bg-gray-50 rounded-lg border border-gray-200">
                      <i className="pi pi-image text-blue-500 mr-1 text-xs"></i>
                      <span className="text-xs">JPG</span>
                    </div>
                    <div className="flex items-center px-2 py-1 bg-gray-50 rounded-lg border border-gray-200">
                      <i className="pi pi-image text-green-500 mr-1 text-xs"></i>
                      <span className="text-xs">PNG</span>
                    </div>
                  </div>

                  <div className="mt-1 p-2 bg-gradient-to-r from-blue-50 to-primary-light/10 rounded-lg border border-primary-dark/5 text-xs">
                    <h4 className="font-medium text-primary-dark mb-1 flex items-center">
                      <i className="pi pi-check-circle mr-1 text-primary-dark text-xs"></i>
                      Asegúrate que se vea:
                    </h4>
                    <div className="grid grid-cols-2 gap-1">
                      <div className="flex items-center">
                        <i className="pi pi-building text-primary-dark text-xs mr-1"></i>
                        <span className="text-xs text-neutral-dark">
                          Universidad
                        </span>
                      </div>
                      <div className="flex items-center">
                        <i className="pi pi-book text-primary-dark text-xs mr-1"></i>
                        <span className="text-xs text-neutral-dark">
                          Carrera
                        </span>
                      </div>
                      <div className="flex items-center">
                        <i className="pi pi-calendar text-primary-dark text-xs mr-1"></i>
                        <span className="text-xs text-neutral-dark">
                          Semestre
                        </span>
                      </div>
                      <div className="flex items-center">
                        <i className="pi pi-user text-primary-dark text-xs mr-1"></i>
                        <span className="text-xs text-neutral-dark">
                          Nombre
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

AcademicUploadStep.propTypes = {
  formData: PropTypes.object.isRequired,
  updateFormData: PropTypes.func.isRequired
};

export default AcademicUploadStep;