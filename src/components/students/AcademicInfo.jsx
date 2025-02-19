import React, { useState, useEffect, useRef } from 'react';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import PropTypes from 'prop-types';
import { Dialog } from 'primereact/dialog';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Toast } from 'primereact/toast';
import { fileService } from '../../services/fileService';

const AcademicInfo = ({ formData, updateFormData, onNext, onPrevious }) => {
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [preview, setPreview] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [otherUniversity, setOtherUniversity] = useState('');
  const [selectedUniversityType, setSelectedUniversityType] = useState('');
  const toast = useRef(null);
  const fileInputRef = useRef(null);
  const dropZoneRef = useRef(null);

  const universities = [
    { label: 'Universidad Mayor de San Andrés (UMSA)', value: 'UMSA' },
    { label: 'Universidad Mayor de San Simón (UMSS)', value: 'UMSS' },
    { label: 'Universidad Católica Boliviana (UCB)', value: 'UCB' },
    { label: 'Universidad Privada Boliviana (UPB)', value: 'UPB' },
    { label: 'Universidad Mayor de San Francisco Xavier (USFX)', value: 'USFX' },
    { label: 'Universidad Técnica de Oruro (UTO)', value: 'UTO' },
    { label: 'Universidad Autónoma Gabriel René Moreno (UAGRM)', value: 'UAGRM' },
    { label: 'Universidad Pública de El Alto (UPEA)', value: 'UPEA' },
    { label: 'Universidad Nacional Siglo XX (UNSXX)', value: 'UNSXX' },
    { label: 'Universidad Amazónica de Pando (UAP)', value: 'UAP' },
    { label: 'Escuela Militar de Ingeniería (EMI)', value: 'EMI' },
    { label: 'Universidad Andina Simón Bolívar (UASB)', value: 'UASB' },
    { label: 'Universidad NUR', value: 'NUR' },
    { label: 'Universidad del Valle (UNIVALLE)', value: 'UNIVALLE' },
    { label: 'Otra', value: 'Otra' }
  ];

  const years = [
    { label: '1er año', value: 1 },
    { label: '2do año', value: 2 },
    { label: '3er año', value: 3 },
    { label: '4to año', value: 4 },
    { label: '5to año', value: 5 }
  ];

  useEffect(() => {
    // Load data from localStorage if available
    const savedData = localStorage.getItem('studentFormData');
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        if (parsedData && Object.keys(parsedData).length > 0) {
          updateFormData(parsedData);
          
          // Si la universidad guardada es "Otra", restaura el valor personalizado
          if (parsedData.university && parsedData.university !== 'Otra' && 
              !universities.some(uni => uni.value === parsedData.university)) {
            setOtherUniversity(parsedData.university);
          }
          
          // If there's a uniID URL already saved, update the preview state
          if (parsedData.uniID) {
            setPreview('Archivo cargado previamente');
          }
        }
      } catch (error) {
        console.error('Error parsing saved form data:', error);
      }
    }
  }, []);

  // Save to localStorage whenever formData changes
  useEffect(() => {
    if (Object.keys(formData).length > 0) {
      localStorage.setItem('studentFormData', JSON.stringify(formData));
    }
  }, [formData]);

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
        severity: 'warn',
        summary: 'No hay archivo',
        detail: 'Por favor selecciona un archivo primero',
        life: 3000
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
        uniID: imageUrl
      });
      
      setUploadSuccess(true);
      
      // Wait 1.5 seconds to show success message before closing
      setTimeout(() => {
        setShowUploadModal(false);
        toast.current.show({
          severity: 'success',
          summary: 'Carga exitosa',
          detail: 'Tu carnet universitario se ha cargado correctamente',
          life: 3000
        });
      }, 1500);
      
    } catch (error) {
      console.error('Error uploading file:', error);
      toast.current.show({
        severity: 'error',
        summary: 'Error en la carga',
        detail: 'No se pudo cargar tu carnet universitario. Por favor, intenta nuevamente.',
        life: 5000
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

  const handleUniversityChange = (e) => {
    const newValue = e.value;
    
    setSelectedUniversityType(newValue);
    
    if (newValue === 'Otra') {
      updateFormData({
        ...formData,
        university: newValue
      });
      setOtherUniversity('');
    } else {
      updateFormData({
        ...formData,
        university: newValue
      });
      setOtherUniversity('');
    }
  };

  const handleOtherUniversityChange = (e) => {
    const value = e.target.value;
    setOtherUniversity(value);
    updateFormData({
      ...formData,
      university: value || 'Otra' // Mantiene 'Otra' si el campo está vacío
    });
  };

  const validateForm = () => {
    if (!formData.university || !formData.degree || !formData.year || !formData.uniID) {
      toast.current.show({
        severity: 'error',
        summary: 'Campos incompletos',
        detail: 'Por favor completa todos los campos obligatorios incluyendo la carga de tu carnet universitario',
        life: 3000
      });
      return false;
    }
    return true;
  };

  const handleNext = () => {
    if (validateForm()) {
      // Ensure we're maintaining the correct structure for the API call
      // This preserves all previously entered data and ensures compatibility with expected format
      const updatedFormData = {
        ...formData,
        university: formData.university,
        degree: formData.degree,
        year: formData.year,
        uniID: formData.uniID
      };
      
      // Update with improved data structure
      updateFormData(updatedFormData);
      
      // Save to localStorage
      localStorage.setItem('studentFormData', JSON.stringify(updatedFormData));
      
      // Proceed to next step
      onNext();
    }
  };

  const handleIdCardBoxClick = () => {
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
          label="Subir archivo" 
          icon="pi pi-upload" 
          onClick={confirmUpload}
          className="px-4 py-2 bg-primary-dark text-white hover:bg-primary-dark/90 transition-colors rounded-lg"
          disabled={!selectedFile}
        />
      </div>
    );
  };

  // Custom styles for the dropdown
  const dropdownClassName = "w-full border-2 border-neutral-gray rounded-lg focus:border-primary-dark";

  return (
    <div className="flex flex-col space-y-8">
      <Toast ref={toast} />
      
      <h2 className="text-2xl font-semibold text-center text-neutral-dark">
        Información Académica
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex flex-col space-y-2">
          <label htmlFor="university" className="text-neutral-dark font-medium">
            Universidad <span className="text-red-500">*</span>
          </label>
          <div className="relative w-full">
            <Dropdown
  id="university"
  value={selectedUniversityType || formData.university}
  onChange={handleUniversityChange}
  options={universities}
              placeholder="Selecciona tu universidad"
              className={dropdownClassName}
              filter
              filterInputAutoFocus
              showFilterClear
              panelClassName="border border-neutral-gray rounded-lg shadow-lg"
            />
          </div>
          {selectedUniversityType === 'Otra' && (
  <InputText
    placeholder="Especifica tu universidad"
    className="w-full border-2 border-neutral-gray rounded-lg p-2 mt-2"
    value={otherUniversity}
    onChange={handleOtherUniversityChange}
  />
)}
        </div>

        <div className="flex flex-col space-y-2">
          <label htmlFor="year" className="text-neutral-dark font-medium">
            Año de estudio <span className="text-red-500">*</span>
          </label>
          <Dropdown
            id="year"
            value={formData.year}
            onChange={(e) => updateFormData({
              ...formData, 
              year: e.value 
            })}
            options={years}
            placeholder="Selecciona tu año"
            className={dropdownClassName}
            panelClassName="border border-neutral-gray rounded-lg shadow-lg"
          />
        </div>

        <div className="flex flex-col space-y-2 md:col-span-2">
          <label htmlFor="degree" className="text-neutral-dark font-medium">
            Carrera que estudias <span className="text-red-500">*</span>
          </label>
          <InputText
            id="degree"
            value={formData.degree || ''}
            onChange={(e) => updateFormData({
              ...formData,
              degree: e.target.value
            })}
            className="w-full border-2 border-neutral-gray rounded-lg p-2"
            placeholder="Ingresa tu carrera"
          />
        </div>

        <div className="flex flex-col space-y-2 md:col-span-2">
          <label className="text-neutral-dark font-medium">
            Carnet universitario <span className="text-red-500">*</span>
          </label>
          <div 
            ref={dropZoneRef}
            onClick={handleIdCardBoxClick}
            className="border-2 border-dashed border-neutral-gray rounded-lg p-4 cursor-pointer hover:border-primary-dark hover:bg-primary-light/5 transition-all"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
          >
            {formData.uniID ? (
              <div className="flex items-center space-x-4">
                <div className="bg-green-50 p-2 rounded-full">
                  <i className="pi pi-check-circle text-2xl text-green-500"></i>
                </div>
                <div className="flex-1">
                  <span className="text-neutral-dark font-medium">Archivo cargado correctamente</span>
                  <p className="text-xs text-neutral-gray mt-1">Haz clic para cambiar el archivo si lo necesitas</p>
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
                <i className="pi pi-upload text-4xl text-neutral-gray mb-2"></i>
                <p className="text-neutral-dark font-medium">Subir carnet universitario</p>
                <p className="text-sm text-neutral-gray mt-1">
                  Arrastra y suelta o haz clic para seleccionar
                </p>
              </div>
            )}
          </div>
          <p className="text-xs text-neutral-gray mt-1">
            * Si aún no tienes el carnet universitario, puedes subir tu factura de pago del semestre
          </p>
        </div>
      </div>

      <div className="bg-neutral-gray/10 px-6 py-4 flex flex-col sm:flex-row justify-between gap-3">
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
        onHide={() => !isUploading && !uploadSuccess && setShowUploadModal(false)}
        header={uploadSuccess ? null : "Subir carnet universitario"}
        footer={renderDialogFooter()}
        className="w-full max-w-2xl overflow-hidden rounded-lg"
        closable={!isUploading && !uploadSuccess}
        showHeader={!uploadSuccess}
        contentClassName="p-0"
        headerClassName="bg-white border-b border-neutral-gray p-4"
      >
        {isUploading ? (
          <div className="flex flex-col items-center justify-center p-8 bg-white">
            <ProgressSpinner style={{width: '60px', height: '60px'}} strokeWidth="4" animationDuration=".5s" />
            <p className="mt-6 text-center text-neutral-dark font-medium">
              Subiendo tu archivo, por favor espera...
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
            <h3 className="text-xl font-medium text-green-800 mb-2">¡Archivo subido con éxito!</h3>
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
              className={`relative border-2 border-dashed rounded-lg p-8 transition-colors
                ${dragActive ? 'border-primary-dark bg-primary-light/10' : 'border-neutral-gray'}`}
            >
              <input
                type="file"
                accept="image/*,application/pdf"
                onChange={handleChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              {preview ? (
                <div className="flex flex-col items-center">
                  {preview.startsWith('data:image') ? (
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
                          }}
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="w-full p-6 mb-4 bg-gray-50 border border-neutral-gray rounded-lg text-center">
                      <i className="pi pi-file-pdf text-4xl text-primary-dark"></i>
                      <p className="mt-3 text-neutral-dark font-medium">Archivo PDF seleccionado</p>
                      <p className="mt-1 text-sm text-neutral-gray">{selectedFile?.name}</p>
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
                  <p className="text-sm text-neutral-dark text-center">
                    Haz clic en "Subir archivo" para cargar este documento
                  </p>
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
                    <div className="flex items-center px-3 py-2 bg-gray-50 rounded-lg">
                      <i className="pi pi-file-pdf text-red-500 mr-2"></i>
                      <span className="text-sm">PDF</span>
                    </div>
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
                      Tu información académica es confidencial y solo será utilizada para verificar tu condición de estudiante.
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

AcademicInfo.propTypes = {
  formData: PropTypes.object.isRequired,
  updateFormData: PropTypes.func.isRequired,
  onNext: PropTypes.func.isRequired,
  onPrevious: PropTypes.func.isRequired
};

export default AcademicInfo;