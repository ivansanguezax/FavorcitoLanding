import { useEffect, useState } from "react";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import PropTypes from "prop-types";

const Verification = ({ formData, onPrevious, onSubmit }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showProcessingDialog, setShowProcessingDialog] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [countdown, setCountdown] = useState(30);

  useEffect(() => {
    const savedData = localStorage.getItem("studentFormData");
    if (savedData) {
      try {
        JSON.parse(savedData);
      } catch (error) {
        console.error("Error al parsear datos guardados:", error);
      }
    }
  }, []);

  useEffect(() => {
    let timer;
    if (showSuccessDialog && countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 3000);
    }
    return () => clearTimeout(timer);
  }, [showSuccessDialog, countdown]);

  const formatDate = (dateString) => {
    if (!dateString) return "No especificado";

    try {
      // Si es una fecha en formato YYYY-MM-DD
      if (
        typeof dateString === "string" &&
        dateString.match(/^\d{4}-\d{2}-\d{2}$/)
      ) {
        const [year, month, day] = dateString.split("-").map(Number);
        // Crear la fecha usando UTC para evitar problemas de zona horaria
        const date = new Date(Date.UTC(year, month - 1, day));
        return date.toLocaleDateString("es-BO", {
          year: "numeric",
          month: "long",
          day: "numeric",
          timeZone: "UTC", // Importante para preservar el día exacto
        });
      }

      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "Fecha inválida";

      return date.toLocaleDateString("es-BO", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch (error) {
      console.error("Error al formatear fecha:", error);
      return dateString;
    }
  };

  // Mostrar solo los días con horarios asignados
  const getAvailabilityHighlights = () => {
    if (
      !formData.availability ||
      Object.keys(formData.availability).length === 0
    ) {
      return "No especificada";
    }

    // Filtrar solo días con horarios asignados
    const daysWithSchedules = Object.entries(formData.availability)
      .filter(([_, times]) => times.length > 0)
      .map(([day]) => day)
      .slice(0, 3); // Mostrar solo los primeros 3 días

    if (daysWithSchedules.length === 0) return "No especificada";

    const displayText = daysWithSchedules.join(", ");
    const hasMore = Object.keys(formData.availability).length > 3;

    return hasMore ? `${displayText} y más` : displayText;
  };

  // Obtener solo las primeras N habilidades
  const getSkillsHighlights = () => {
    if (!formData.skills || formData.skills.length === 0) {
      return "No especificadas";
    }

    const displaySkills = formData.skills.slice(0, 3);
    const hasMore = formData.skills.length > 3;

    return hasMore
      ? `${displaySkills.join(", ")} y más`
      : displaySkills.join(", ");
  };

  // Handle the submission with better UI flow
  const handleSubmitWithFeedback = async () => {
    // Prevent multiple submissions
    if (isSubmitting) return;

    setIsSubmitting(true);
    setShowProcessingDialog(true);

    try {
      await onSubmit();

      // Show success after processing (with small delay for better UX)
      setTimeout(() => {
        setShowProcessingDialog(false);
        setShowSuccessDialog(true);
      }, 1500);
    } catch (error) {
      // In case of error, hide processing dialog and allow retry
      setShowProcessingDialog(false);
      setIsSubmitting(false);
    }
  };

  const renderProcessingDialog = () => (
    <Dialog
      visible={showProcessingDialog}
      closable={false}
      showHeader={false}
      className="border-none"
      contentClassName="p-0"
      style={{ 
        width: "100%", 
        maxWidth: "450px",
        borderRadius: "16px",
        overflow: "hidden",
        boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.05)"
      }}
    >
      <div className="bg-white py-10 px-8 flex flex-col items-center">
        {/* Spinner de carga elegante */}
        <div className="relative w-20 h-20 mb-8">
          {/* Anillo exterior */}
          <div className="absolute inset-0 border-4 border-gray-100 rounded-full"></div>
          
          {/* Anillo de progreso giratorio */}
          <div className="absolute inset-0 border-4 border-transparent border-t-primary-dark rounded-full animate-spin"></div>
          
          {/* Círculo central */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-12 h-12 bg-primary-dark/5 rounded-full flex items-center justify-center">
              <i className="pi pi-clock text-xl text-primary-dark"></i>
            </div>
          </div>
        </div>
        
        <h3 className="text-2xl font-semibold text-gray-800 mb-3 text-center">
          Procesando
        </h3>
        
        <p className="text-center text-gray-600 mb-6 max-w-xs">
          Estamos verificando y procesando tu información. 
          Esto solo tomará unos momentos.
        </p>
        
        {/* Barra de progreso horizontal con animación */}
        <div className="w-full max-w-xs h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <div className="relative w-full h-full">
            <div 
              className="absolute h-full bg-primary-dark rounded-full"
              style={{
                width: "30%",
                animation: "indeterminateProgress 1.5s infinite ease-in-out"
              }}
            ></div>
          </div>
        </div>
        
        <style jsx>{`
          @keyframes indeterminateProgress {
            0% {
              left: -30%;
            }
            100% {
              left: 100%;
            }
          }
        `}</style>
      </div>
    </Dialog>
  );
  
  // Diálogo de éxito completamente rediseñado
  const renderSuccessDialog = () => (
    <Dialog
      visible={showSuccessDialog}
      closable={false}
      showHeader={false}
      className="border-none"
      contentClassName="p-0"
      style={{ 
        width: "100%", 
        maxWidth: "480px",
        borderRadius: "16px",
        overflow: "hidden",
        boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.05)"
      }}
    >
      <div className="bg-white">
        {/* Encabezado con icono de éxito */}
        <div className="pt-10 pb-6 px-8 flex justify-center">
          <div className="relative">
            {/* Círculo base */}
            <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center">
              {/* Círculo decorativo externo */}
              <div className="absolute w-full h-full rounded-full border-8 border-green-100"></div>
              
              {/* Icono de éxito */}
              <i className="pi pi-check text-3xl text-green-500"></i>
            </div>
            
            {/* Elementos decorativos alrededor */}
            <span className="absolute top-0 right-0 w-4 h-4 bg-green-100 rounded-full transform translate-x-1/2 -translate-y-1/2"></span>
            <span className="absolute bottom-1 left-0 w-3 h-3 bg-green-200 rounded-full transform -translate-x-1/2 translate-y-1/4"></span>
          </div>
        </div>
        
        {/* Línea divisoria sutil */}
        <div className="w-24 h-px bg-gray-200 mx-auto"></div>
        
        {/* Contenido principal */}
        <div className="pt-6 pb-4 px-8">
          <h2 className="text-2xl font-bold text-gray-800 text-center mb-4">
            ¡Registro completado!
          </h2>
          
          <p className="text-center text-gray-600 mb-6 max-w-md mx-auto">
            Hemos recibido tu solicitud correctamente. Nuestro equipo revisará tu
            información y activará tu cuenta lo antes posible.
          </p>
          
          <div className="bg-gray-50 border border-gray-100 rounded-xl p-5 mb-6">
            <div className="flex items-start mb-4">
              <div className="flex-shrink-0 w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center mr-4">
                <i className="pi pi-envelope text-blue-500"></i>
              </div>
              <div>
                <h4 className="text-base font-medium text-gray-800 mb-1">Notificación por email</h4>
                <p className="text-sm text-gray-600">
                  Te enviaremos un correo electrónico cuando tu cuenta esté activa y lista para usar.
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="flex-shrink-0 w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center mr-4">
                <i className="pi pi-compass text-blue-500"></i>
              </div>
              <div>
                <h4 className="text-base font-medium text-gray-800 mb-1">Mientras tanto</h4>
                <p className="text-sm text-gray-600">
                  Puedes explorar los servicios disponibles en nuestra plataforma.
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Pie del diálogo con contador */}
        <div className="bg-gray-50 py-4 px-8 border-t border-gray-100">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500">
              Serás redirigido automáticamente
            </div>
            
            <div className="flex items-center">
              <div className="w-16 h-16 relative mr-2">
                <svg className="w-full h-full" viewBox="0 0 100 100">
                  {/* Círculo base */}
                  <circle 
                    cx="50" cy="50" r="40" 
                    fill="none" 
                    stroke="#e5e7eb" 
                    strokeWidth="10"
                  />
                  
                  {/* Círculo de progreso animado */}
                  <circle 
                    cx="50" cy="50" r="40" 
                    fill="none" 
                    stroke="#2563eb" 
                    strokeWidth="10"
                    strokeLinecap="round"
                    strokeDasharray="251.2"
                    strokeDashoffset={251.2 * (1 - countdown / 10)}
                    transform="rotate(-90 50 50)"
                    style={{
                      transition: "stroke-dashoffset 1s linear"
                    }}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-sm font-medium text-gray-700">{countdown}</span>
                </div>
              </div>
              
              <button 
                className="py-2 px-4 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors"
                onClick={() => {
                  // Lógica para redirección inmediata
                  setCountdown(0);
                }}
              >
                Continuar
              </button>
            </div>
          </div>
        </div>
      </div>
    </Dialog>
  );

  return (
    <div className="flex flex-col space-y-8">
      <h2 className="text-2xl font-semibold text-center text-neutral-dark">
        Verificación de Datos
      </h2>

      <div className="bg-white rounded-xl shadow-md overflow-hidden max-w-3xl mx-auto">
        <div className="bg-slate-300 p-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            {/* Imagen de perfil */}
            <div className="flex-shrink-0">
              <img
                src="https://res.cloudinary.com/dfgjenml4/image/upload/v1739926023/Mask_group_rvnwra.png"
                alt="Perfil de estudiante"
                className="w-24 h-24 object-cover rounded-full border-2 border-white shadow-md"
              />
            </div>

            {/* Información principal */}
            <div className="flex-1 text-center sm:text-left">
              <h3 className="text-xl font-bold text-neutral-dark">
                {formData.fullName || "Estudiante"}
              </h3>
              <p className="text-black mt-1">
                {formData.university || "Universidad"} •{" "}
                {formData.year ? `${formData.year}° año` : ""}
              </p>
              <p className="text-neutral-dark mt-1">
                {formData.degree || "Carrera no especificada"}
              </p>
              <div className="mt-3 flex flex-wrap justify-center sm:justify-start gap-2">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary-dark/10 text-primary-dark">
                  <i className="pi pi-map-marker mr-1"></i>
                  {formData.city || "Ciudad"}
                </span>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                  <i className="pi pi-clock mr-1"></i>
                  En proceso de verificación
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Detalles del perfil */}
        <div className="p-6 space-y-6">
          {/* Resumen de información */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-neutral-gray mb-1 flex items-center">
                  <i className="pi pi-user mr-2 text-primary-dark"></i>
                  Información Personal
                </h4>
                <div className="pl-6 space-y-2">
                  <div className="flex flex-col">
                    <span className="text-neutral-gray text-sm">
                      Fecha de nacimiento:
                    </span>
                    <span className="text-neutral-dark font-medium">
                      {formatDate(formData.bornDate)}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-neutral-gray text-sm">Teléfono:</span>
                    <span className="text-neutral-dark font-medium">
                      {formData.phone || "No especificado"}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-neutral-gray text-sm">Email:</span>
                    <span className="text-neutral-dark font-medium break-all">
                      {formData.email || "No especificado"}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-neutral-gray mb-1 flex items-center">
                  <i className="pi pi-map mr-2 text-primary-dark"></i>
                  Ubicación
                </h4>
                <p className="pl-6 text-neutral-dark">
                  {formData.address || "Dirección no especificada"}
                  {formData.zona ? `, ${formData.zona}` : ""}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-neutral-gray mb-1 flex items-center">
                  <i className="pi pi-briefcase mr-2 text-primary-dark"></i>
                  Servicios
                </h4>
                <p className="pl-6 text-neutral-dark">
                  {getSkillsHighlights()}
                </p>
              </div>

              <div>
                <h4 className="text-sm font-medium text-neutral-gray mb-1 flex items-center">
                  <i className="pi pi-calendar mr-2 text-primary-dark"></i>
                  Disponibilidad
                </h4>
                <p className="pl-6 text-neutral-dark">
                  {getAvailabilityHighlights()}
                </p>
              </div>

              <div>
                <h4 className="text-sm font-medium text-neutral-gray mb-1 flex items-center">
                  <i className="pi pi-wallet mr-2 text-primary-dark"></i>
                  Método de pago
                </h4>
                <p className="pl-6 text-neutral-dark flex items-center">
                  {formData.qrCode ? (
                    <>
                      <i className="pi pi-check-circle text-green-500 mr-1"></i>
                      <span>QR de pago registrado</span>
                    </>
                  ) : (
                    "QR de pago no registrado"
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className=" px-3 py-4 flex flex-col-reverse sm:flex-row justify-between gap-3 rounded-lg max-w-3xl mx-auto">
  <Button
    label="Modificar datos"
    icon="pi pi-arrow-left"
    onClick={onPrevious}
    disabled={isSubmitting}
    className="px-6 py-3 text-primary-dark border-2 border-primary-dark hover:bg-primary-dark hover:text-white transition-all duration-200 w-full sm:w-auto"
  />
  <Button
    label={isSubmitting ? "Procesando..." : "Confirmar registro"}
    icon={isSubmitting ? "pi pi-spin pi-spinner" : "pi pi-check"}
    onClick={handleSubmitWithFeedback}
    disabled={isSubmitting}
    className="px-6 py-3 bg-primary-dark text-white hover:bg-primary-dark/90 transition-all duration-200 w-full sm:w-auto"
  />
</div>

      {/* Processing Dialog */}
      {renderProcessingDialog()}

      {/* Success Dialog */}
      {renderSuccessDialog()}
    </div>
  );
};

Verification.propTypes = {
  formData: PropTypes.object.isRequired,
  onPrevious: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

export default Verification;
