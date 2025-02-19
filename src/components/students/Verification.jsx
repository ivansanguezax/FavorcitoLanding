import { useEffect, useState } from 'react';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import PropTypes from 'prop-types';

const Verification = ({ formData, onPrevious, onSubmit }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showProcessingDialog, setShowProcessingDialog] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    // Cargar datos del localStorage si es necesario
    const savedData = localStorage.getItem('studentFormData');
    if (savedData) {
      try {
        JSON.parse(savedData);
        // No actualizamos formData porque solo estamos verificando
      } catch (error) {
        console.error('Error al parsear datos guardados:', error);
      }
    }
  }, []);

  // Countdown effect for redirect
  useEffect(() => {
    let timer;
    if (showSuccessDialog && countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [showSuccessDialog, countdown]);

  const formatDate = (dateString) => {
    if (!dateString) return 'No especificado';
    
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('es-BO', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      console.error('Error al formatear fecha:', error);
      return dateString;
    }
  };

  // Mostrar solo los días con horarios asignados
  const getAvailabilityHighlights = () => {
    if (!formData.availability || Object.keys(formData.availability).length === 0) {
      return 'No especificada';
    }
    
    // Filtrar solo días con horarios asignados
    const daysWithSchedules = Object.entries(formData.availability)
      .filter(([_, times]) => times.length > 0)
      .map(([day]) => day)
      .slice(0, 3); // Mostrar solo los primeros 3 días
    
    if (daysWithSchedules.length === 0) return 'No especificada';
    
    const displayText = daysWithSchedules.join(', ');
    const hasMore = Object.keys(formData.availability).length > 3;
    
    return hasMore ? `${displayText} y más` : displayText;
  };

  // Obtener solo las primeras N habilidades 
  const getSkillsHighlights = () => {
    if (!formData.skills || formData.skills.length === 0) {
      return 'No especificadas';
    }
    
    const displaySkills = formData.skills.slice(0, 3);
    const hasMore = formData.skills.length > 3;
    
    return hasMore ? `${displaySkills.join(', ')} y más` : displaySkills.join(', ');
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

  // Processing dialog content
  const renderProcessingDialog = () => (
    <Dialog
      visible={showProcessingDialog}
      closable={false}
      showHeader={false}
      className="border-round-xl overflow-hidden"
      contentClassName="p-0"
      style={{ width: '90%', maxWidth: '450px' }}
    >
      <div className="flex flex-column align-items-center p-6 bg-white">
        <div className="bg-primary-light/10 p-4 rounded-full mb-4">
          <i className="pi pi-spin pi-spinner text-4xl text-primary-dark"></i>
        </div>
        <h2 className="text-xl font-semibold text-neutral-dark mb-3">Procesando registro</h2>
        <p className="text-center text-neutral-gray mb-4">
          Estamos registrando tu información, por favor espera un momento...
        </p>
        <div className="flex gap-2 items-center">
          <span className="block w-2 h-2 rounded-full bg-primary-dark animate-pulse"></span>
          <span className="block w-2 h-2 rounded-full bg-primary-dark animate-pulse" style={{ animationDelay: '0.2s' }}></span>
          <span className="block w-2 h-2 rounded-full bg-primary-dark animate-pulse" style={{ animationDelay: '0.4s' }}></span>
        </div>
      </div>
    </Dialog>
  );

  // Success dialog content
  const renderSuccessDialog = () => (
    <Dialog
      visible={showSuccessDialog}
      closable={false}
      showHeader={false}
      className="border-round-xl overflow-hidden"
      contentClassName="p-0"
      style={{ width: '90%', maxWidth: '450px' }}
    >
      <div className="bg-green-50 py-6 px-4 flex justify-center">
        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-2">
          <i className="pi pi-check-circle text-4xl text-green-500"></i>
        </div>
      </div>
      <div className="p-6 bg-white">
        <h2 className="text-xl font-semibold text-neutral-dark text-center mb-3">
          ¡Registro completado!
        </h2>
        <p className="text-center text-neutral-gray mb-3">
          Hemos recibido tu solicitud correctamente. Nuestro equipo revisará tu información y activará tu cuenta lo antes posible.
        </p>
        <p className="text-center font-medium text-neutral-dark mb-4">
          Te enviaremos un correo electrónico cuando tu cuenta esté activa.
        </p>
        <div className="bg-blue-50 p-3 rounded-lg mb-4">
          <p className="text-sm text-blue-700 flex items-start">
            <i className="pi pi-info-circle mr-2 mt-0.5"></i>
            <span>Mientras tanto, puedes explorar los servicios disponibles en nuestra plataforma. Serás redirigido en <span className="font-bold">{countdown}</span> segundos.</span>
          </p>
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
                {formData.fullName || 'Estudiante'}
              </h3>
              <p className="text-black mt-1">
                {formData.university || 'Universidad'} • {formData.year ? `${formData.year}° año` : ''} 
              </p>
              <p className="text-neutral-dark mt-1">
                {formData.degree || 'Carrera no especificada'}
              </p>
              <div className="mt-3 flex flex-wrap justify-center sm:justify-start gap-2">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary-dark/10 text-primary-dark">
                  <i className="pi pi-map-marker mr-1"></i>
                  {formData.city || 'Ciudad'}
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
                    <span className="text-neutral-gray text-sm">Fecha de nacimiento:</span>
                    <span className="text-neutral-dark font-medium">{formatDate(formData.bornDate)}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-neutral-gray text-sm">Teléfono:</span>
                    <span className="text-neutral-dark font-medium">{formData.phone || 'No especificado'}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-neutral-gray text-sm">Email:</span>
                    <span className="text-neutral-dark font-medium break-all">{formData.email || 'No especificado'}</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-neutral-gray mb-1 flex items-center">
                  <i className="pi pi-map mr-2 text-primary-dark"></i>
                  Ubicación
                </h4>
                <p className="pl-6 text-neutral-dark">
                  {formData.address || 'Dirección no especificada'}
                  {formData.province ? `, ${formData.province}` : ''}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-neutral-gray mb-1 flex items-center">
                  <i className="pi pi-briefcase mr-2 text-primary-dark"></i>
                  Servicios
                </h4>
                <p className="pl-6 text-neutral-dark">{getSkillsHighlights()}</p>
              </div>

              <div>
                <h4 className="text-sm font-medium text-neutral-gray mb-1 flex items-center">
                  <i className="pi pi-calendar mr-2 text-primary-dark"></i>
                  Disponibilidad
                </h4>
                <p className="pl-6 text-neutral-dark">{getAvailabilityHighlights()}</p>
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
                  ) : 'QR de pago no registrado'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-neutral-gray/10 px-6 py-4 flex flex-col sm:flex-row justify-between gap-3 rounded-lg max-w-3xl mx-auto">
        <Button
          label="Modificar datos"
          icon="pi pi-arrow-left"
          onClick={onPrevious}
          disabled={isSubmitting}
          className="px-4 py-2 text-primary-dark border border-primary-dark hover:bg-primary-dark hover:text-white transition-all duration-200 rounded-lg w-full sm:w-auto"
        />
        <Button
          label={isSubmitting ? "Procesando..." : "Confirmar registro"}
          icon={isSubmitting ? "pi pi-spin pi-spinner" : "pi pi-check"}
          onClick={handleSubmitWithFeedback}
          disabled={isSubmitting}
          className="px-4 py-2 bg-primary-dark text-white hover:bg-primary-dark/90 transition-all duration-200 rounded-lg shadow-sm w-full sm:w-auto"
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
  onSubmit: PropTypes.func.isRequired
};

export default Verification;