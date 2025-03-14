import { useState, useRef, useEffect } from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { Steps } from "primereact/steps";
import { Toast } from "primereact/toast";
import PropTypes from "prop-types";
import studentsService from "../../services/studentsService";
import AcademicUploadStep from "./AcademicUploadStep";
import LocationAvailabilityStep from "./LocationAvailabilityStep";
import { Mixpanel } from "../../services/mixpanel";

// Hook para detectar tamaño de ventana
const useWindowSize = () => {
  const [windowSize, setWindowSize] = useState({
    width: undefined,
    height: undefined,
    isMobile: false,
  });

  useEffect(() => {
    // Función para actualizar el estado con las dimensiones de la ventana
    function handleResize() {
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      setWindowSize({
        width,
        height,
        isMobile: width < 768, // Considerar como móvil si ancho es menor a 768px
      });
    }

    // Establecer el estado inicial
    handleResize();
    
    // Agregar listener para resize
    window.addEventListener("resize", handleResize);
    
    // Limpiar listener al desmontar
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return windowSize;
};

const CompleteProfileDialog = ({ visible, onHide, studentData }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [formData, setFormData] = useState({
    university: "",
    degree: "",
    year: 1,
    uniID: "",
    city: studentData?.city || "",
    province: "",
    address: "",
    availability: studentData?.availability || {
      "Lunes": [],
      "Martes": [],
      "Miercoles": [],
      "Jueves": [],
      "Viernes": [],
      "Sabado": [],
      "Domingo": []
    },
    classSchedule: ""
  });
  
  const toast = useRef(null);
  const { isMobile } = useWindowSize();
  
  // Pasos del formulario
  const steps = [
    { 
      label: isMobile ? "1" : "Información Académica",
      icon: isMobile ? null : "pi pi-id-card"
    },
    { 
      label: isMobile ? "2" : "Ubicación y Disponibilidad",
      icon: isMobile ? null : "pi pi-map-marker" 
    }
  ];
  
  // Actualizar el formData con los datos del estudiante si cambian
  useEffect(() => {
    if (studentData) {
      setFormData(prevData => ({
        ...prevData,
        city: studentData.city || prevData.city,
        availability: studentData.availability || prevData.availability
      }));
    }
  }, [studentData]);
  
  const updateFormData = (newData) => {
    setFormData(prevData => ({
      ...prevData,
      ...newData
    }));
  };
  
  const handleNext = () => {
    if (activeStep === 0) {
      // Validar Paso 1
      if (!formData.uniID) {
        toast.current.show({
          severity: "error",
          summary: "Error",
          detail: "Por favor sube tu carnet universitario o matrícula",
          life: 3000
        });
        return;
      }
    }
    
    if (activeStep < steps.length - 1) {
      setActiveStep(activeStep + 1);
    } else {
      // Último paso, enviar datos
      handleSubmit();
    }
  };
  
  const handlePrevious = () => {
    if (activeStep > 0) {
      setActiveStep(activeStep - 1);
    }
  };
  
  const handleSubmit = async () => {
    // Validar Paso 2
    if (!formData.city || !formData.province || !formData.address) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Por favor completa toda la información de ubicación",
        life: 3000
      });
      return;
    }
    
    // Verificar que hay al menos un horario seleccionado
    const hasAvailability = Object.values(formData.availability).some(
      daySlots => daySlots.length > 0
    );
    
    if (!hasAvailability) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Por favor selecciona al menos un horario disponible",
        life: 3000
      });
      return;
    }
    
    try {
      setIsProcessing(true);
      
      // Formatear horarios para guardar en classSchedule
      const availabilityText = Object.entries(formData.availability)
        .filter(([_, slots]) => slots.length > 0)
        .map(([day, slots]) => `${day} de ${slots.join(", ")}`)
        .join("; ");
      
      const updateData = {
        university: formData.university || "Universidad pendiente",
        degree: formData.degree || "Universidad pendiente",
        year: formData.year || 1,
        uniID: formData.uniID,
        city: formData.city,
        province: formData.province,
        address: formData.address,
        availability: formData.availability,
        classSchedule: availabilityText,
        verified: false // Para que pase a estado de verificación
      };
      
      // Verificar que tenemos un ID válido para el estudiante
      if (!studentData?.id) {
        console.error("ID del estudiante no encontrado en:", studentData);
        throw new Error("No se encontró un ID válido para el estudiante");
      }
      
      // Enviar actualización utilizando el ID correcto
      await studentsService.updateStudent(studentData.id, updateData);
      
      // Registrar evento en Mixpanel
      try {
        Mixpanel.track("Profile_Completed_From_Calculator", {
          city: formData.city
        });
      } catch (mixpanelError) {
        console.warn("Error registrando evento en Mixpanel:", mixpanelError);
      }
      
      // Mostrar mensaje de éxito
      toast.current.show({
        severity: "success",
        summary: "¡Perfil completado!",
        detail: "Tu información ha sido actualizada. Ahora está en proceso de verificación.",
        life: 5000
      });
      
      setCompleted(true);
      
      // Cerrar diálogo después de 3 segundos
      setTimeout(() => {
        onHide();
      }, 3000);
      
    } catch (error) {
      console.error("Error actualizando perfil:", error);
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: `No se pudo actualizar tu perfil: ${error.message}`,
        life: 5000
      });
    } finally {
      setIsProcessing(false);
    }
  };
  
  // Renderizar contenido según el paso activo
  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return (
          <AcademicUploadStep
            formData={formData}
            updateFormData={updateFormData}
          />
        );
      case 1:
        return (
          <LocationAvailabilityStep
            formData={formData}
            updateFormData={updateFormData}
          />
        );
      default:
        return null;
    }
  };
  
// Footer del diálogo con el estilo específico solicitado
const renderFooter = () => {
    if (completed) {
      return (
        <div className="p-4 bg-green-50 rounded-b-lg flex justify-center">
          <div className="text-center">
            <i className="pi pi-check-circle text-3xl text-green-500 mb-2"></i>
            <p className="text-green-700 font-medium">Redirigiendo...</p>
          </div>
        </div>
      );
    }
    
    return (
      <div className="px-3 py-4 bg-gray-50 rounded-b-lg border-t border-gray-100">
        <div className="flex flex-col-reverse sm:flex-row justify-between gap-3">
          <Button
            label="Atrás"
            icon="pi pi-arrow-left"
            onClick={handlePrevious}
            disabled={activeStep === 0 || isProcessing}
            className={`px-6 py-3 text-primary-dark border-2 border-primary-dark hover:bg-primary-dark hover:text-white transition-all duration-200 rounded-lg ${
              activeStep === 0 || isProcessing ? "opacity-50 cursor-not-allowed" : ""
            }`}
          />
          
          {activeStep === steps.length - 1 ? (
            <Button
              label="Completar"
              icon="pi pi-check"
              iconPos="left"
              onClick={handleNext}
              loading={isProcessing}
              className="px-6 py-3 bg-primary-dark text-white border-2 border-primary-dark hover:bg-primary-dark/90 transition-all duration-200 rounded-lg"
            />
          ) : (
            <Button
              label="Siguiente"
              icon="pi pi-arrow-right"
              iconPos="right"
              onClick={handleNext}
              loading={isProcessing}
              className="px-6 py-3 bg-primary-dark text-white border-2 border-primary-dark hover:bg-primary-dark/90 transition-all duration-200 rounded-lg"
            />
          )}
        </div>
      </div>
    );
  };
  
  useEffect(() => {
    // Imprimir información sobre el studentData cuando cambia
    if (studentData) {
      console.log("StudentData recibido:", studentData);
      console.log("Tipo de ID:", typeof studentData.id);
    }
  }, [studentData]);
  
  return (
    <Dialog
      visible={visible}
      onHide={onHide}
      header="Completa tu perfil"
      footer={renderFooter()}
      className="w-full max-w-3xl"
      dismissableMask={!isProcessing && !completed}
      closable={!isProcessing && !completed}
      modal
      style={{ width: '95vw', maxWidth: '900px' }}
    >
      <Toast ref={toast} />
      
      <div className="">
        {!isMobile ? (
          <Steps
            model={steps}
            activeIndex={activeStep}
            readOnly={true}
            className="mb-5"
          />
        ) : (
          <div className="flex justify-center mb-5">
            <div className="flex items-center gap-2 bg-primary-light/20 px-4 py-2 rounded-full">
              {steps.map((step, i) => (
                <div
                  key={i}
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    i === activeStep
                      ? "bg-primary-dark text-white font-medium"
                      : i < activeStep
                      ? "bg-green-100 text-green-600 border border-green-200"
                      : "bg-gray-200 text-gray-500"
                  }`}
                >
                  {i < activeStep ? (
                    <i className="pi pi-check text-xs" />
                  ) : (
                    <span className="text-sm">{i + 1}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
        
        <div className="mt-4">
          {renderStepContent()}
        </div>
      </div>
    </Dialog>
  );
};

CompleteProfileDialog.propTypes = {
  visible: PropTypes.bool.isRequired,
  onHide: PropTypes.func.isRequired,
  studentData: PropTypes.object.isRequired
};

export default CompleteProfileDialog;