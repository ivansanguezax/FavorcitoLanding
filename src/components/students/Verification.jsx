import { useEffect, useState } from "react";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { Mixpanel } from "../../services/mixpanel";
import { useAuth } from "../../context/AuthContext";

const Verification = ({ formData, onPrevious, onSubmit }) => {
  const { currentUser } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showProcessingDialog, setShowProcessingDialog] = useState(false);
  const navigate = useNavigate();

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

  const formatDate = (dateString) => {
    if (!dateString) return "No especificado";

    try {
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
          timeZone: "UTC",
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

  const handleSubmitWithFeedback = async () => {
    // Prevent multiple submissions
    if (isSubmitting) return;

    setIsSubmitting(true);
    setShowProcessingDialog(true);

    Mixpanel.track("Form_Submit_Attempt", {
      total_skills: formData.skills?.length || 0,
      total_days: Object.keys(formData.availability || {}).length,
    });

    try {
      await onSubmit();

      Mixpanel.track("Form_Submit_Success", {
        university: formData.university,
        city: formData.city,
        total_skills: formData.skills?.length || 0,
      });

      setTimeout(() => {
        setShowProcessingDialog(false);
        navigate("/dashboard");
      }, 1500);
    } catch (error) {
      console.error("Error al enviar la solicitud:", error);

      // Trackear el evento de error en el envío
      Mixpanel.track("Form_Submit_Error", {
        error_message: error.message || "Unknown error",
      });

      setShowProcessingDialog(false);
      setIsSubmitting(false);
    }
  };

  const renderProcessingDialog = () => (
    <Dialog
      visible={showProcessingDialog}
      closable={false}
      showHeader={false}
      className="border-none shadow-xl"
      contentClassName="p-0"
      style={{
        width: "100%",
        maxWidth: "450px",
        borderRadius: "16px",
        overflow: "hidden",
      }}
    >
      <div className="bg-gradient-to-br from-white to-primary-light/10 py-10 px-8 flex flex-col items-center">
        {/* Spinner de carga elegante */}
        <div className="relative w-24 h-24 mb-8">
          {/* Anillo exterior */}
          <div className="absolute inset-0 border-4 border-gray-100 rounded-full"></div>

          {/* Anillo de progreso giratorio */}
          <div className="absolute inset-0 border-4 border-transparent border-t-primary-dark rounded-full animate-spin"></div>

          {/* Segundo anillo de progreso giratorio (más lento) */}
          <div
            className="absolute inset-0 border-4 border-transparent border-r-primary-dark/30 rounded-full animate-spin"
            style={{ animationDuration: "3s" }}
          ></div>

          {/* Círculo central */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-sm">
              <i className="pi pi-clock text-xl text-primary-dark"></i>
            </div>
          </div>
        </div>

        <h3 className="text-2xl font-semibold text-primary-dark mb-3 text-center">
          Procesando
        </h3>

        <p className="text-center text-neutral-dark mb-6 max-w-xs">
          Estamos verificando y procesando tu información. Esto solo tomará unos
          momentos.
        </p>

        {/* Barra de progreso horizontal con animación */}
        <div className="w-full max-w-xs h-2 bg-gray-100 rounded-full overflow-hidden shadow-inner">
          <div className="relative w-full h-full">
            <div
              className="absolute h-full bg-gradient-to-r from-primary-dark/80 to-primary-dark rounded-full"
              style={{
                width: "30%",
                animation: "indeterminateProgress 1.5s infinite ease-in-out",
              }}
            ></div>
          </div>
        </div>

        <style>{`
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

  return (
    <div className="flex flex-col space-y-8">
      <h2 className="text-2xl font-semibold text-center text-neutral-dark">
        Verificación de Datos
      </h2>

      <p className="text-center text-neutral-dark/80 -mt-4 max-w-md mx-auto">
        Revisa tu información antes de confirmar el registro
      </p>

      <div className="bg-white rounded-xl shadow-md overflow-hidden max-w-3xl mx-auto border border-neutral-gray/10">
        {/* Header con gradiente y avatar */}
        <div className="bg-gradient-to-r from-primary-dark/5 to-primary-light/30 p-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            {/* Imagen de perfil con mejor sombra y borde */}
            <div className="flex-shrink-0">
              <div className="w-24 h-24 rounded-full relative">
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary-light to-primary-dark opacity-30 blur-md"></div>
                <img
                  src={
                    currentUser?.photoURL ||
                    "https://res.cloudinary.com/dfgjenml4/image/upload/v1739926023/Mask_group_rvnwra.png"
                  }
                  alt="Perfil de estudiante"
                  className="w-24 h-24 object-cover rounded-full border-2 border-white shadow-md relative z-10"
                  onError={(e) => {
                    e.target.src =
                      "https://res.cloudinary.com/dfgjenml4/image/upload/v1739926023/Mask_group_rvnwra.png";
                  }}
                />
              </div>
            </div>

            {/* Información principal */}
            <div className="flex-1 text-center sm:text-left">
              <h3 className="text-xl font-bold text-primary-dark">
                {formData.fullName || "Estudiante"}
              </h3>
              <p className="text-neutral-dark/90 mt-2">
                Carrera en proceso de validación
              </p>
              <div className="mt-3 flex flex-wrap justify-center sm:justify-start gap-2">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary-dark/10 text-primary-dark border border-primary-dark/10">
                  <i className="pi pi-map-marker mr-1"></i>
                  {formData.city || "Ciudad"}
                </span>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-50 text-yellow-800 border border-yellow-200">
                  <i className="pi pi-clock mr-1"></i>
                  En proceso de verificación
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Banner de verificación */}
        <div className="bg-gradient-to-r from-blue-50 to-primary-light/10 py-3 px-4 border-y border-primary-dark/10">
          <div className="flex items-center justify-center">
            <i className="pi pi-info-circle text-primary-dark mr-2"></i>
            <p className="text-sm text-neutral-dark">
              Validaremos tu información académica en las próximas 24 horas
            </p>
          </div>
        </div>

        {/* Detalles del perfil en tarjetas */}
        <div className="p-6 space-y-6">
          {/* Resumen de información */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Tarjeta de información personal */}
            <div className="bg-white rounded-xl border border-neutral-gray/15 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <div className="bg-neutral-light/30 px-4 py-3 border-b border-neutral-gray/10">
                <h4 className="text-sm font-medium text-primary-dark flex items-center">
                  <i className="pi pi-user text-primary-dark mr-2"></i>
                  Información Personal
                </h4>
              </div>
              <div className="p-4 space-y-3">
                <div className="flex flex-col">
                  <span className="text-xs text-neutral-dark/70">
                    Fecha de nacimiento
                  </span>
                  <span className="text-sm font-medium text-neutral-dark">
                    {formatDate(formData.bornDate)}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-neutral-dark/70">Teléfono</span>
                  <span className="text-sm font-medium text-neutral-dark">
                    {formData.phone || "No especificado"}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-neutral-dark/70">Email</span>
                  <span className="text-sm font-medium text-neutral-dark break-all">
                    {formData.email || "No especificado"}
                  </span>
                </div>
                <div className="flex flex-col pt-1">
                  <span className="text-xs text-neutral-dark/70">
                    Ubicación
                  </span>
                  <span className="text-sm font-medium text-neutral-dark">
                    {formData.city || "Ciudad no especificada"}
                    {formData.zona ? `, ${formData.zona}` : ""}
                  </span>
                </div>
              </div>
            </div>

            {/* Tarjeta de servicios y disponibilidad */}
            <div className="bg-white rounded-xl border border-neutral-gray/15 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <div className="bg-neutral-light/30 px-4 py-3 border-b border-neutral-gray/10">
                <h4 className="text-sm font-medium text-primary-dark flex items-center">
                  <i className="pi pi-briefcase text-primary-dark mr-2"></i>
                  Servicios y Disponibilidad
                </h4>
              </div>

              <div className="p-4 space-y-4">
                <div>
                  <span className="text-xs text-neutral-dark/70 block mb-1">
                    Servicios que ofreces
                  </span>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {formData.skills && formData.skills.length > 0 ? (
                      formData.skills.slice(0, 5).map((skill, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-primary-light/30 text-primary-dark border border-primary-dark/10"
                        >
                          {skill}
                        </span>
                      ))
                    ) : (
                      <span className="text-sm text-neutral-dark">
                        No especificados
                      </span>
                    )}

                    {formData.skills && formData.skills.length > 5 && (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-primary-light/10 text-primary-dark">
                        +{formData.skills.length - 5} más
                      </span>
                    )}
                  </div>
                </div>

                <div>
                  <span className="text-xs text-neutral-dark/70 block mb-1">
                    Días disponibles
                  </span>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {Object.keys(formData.availability || {}).length > 0 ? (
                      Object.keys(formData.availability).map((day, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-blue-50 text-blue-700 border border-blue-100"
                        >
                          <i className="pi pi-calendar text-xs mr-1"></i>
                          {day}
                        </span>
                      ))
                    ) : (
                      <span className="text-sm text-neutral-dark">
                        No especificados
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer con mensaje de confirmación */}
        <div className="bg-neutral-light/40 p-4 border-t border-neutral-gray/10">
          <div className="flex items-center justify-center">
            <i className="pi pi-check-circle text-primary-dark mr-2"></i>
            <p className="text-sm text-neutral-dark">
              Podrás editar esta información después en tu perfil
            </p>
          </div>
        </div>
      </div>

      <div className="px-3 py-4 flex flex-col-reverse sm:flex-row justify-between gap-3 rounded-lg max-w-3xl mx-auto">
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
          className="px-6 py-3 bg-primary-dark text-white hover:bg-primary-dark/90 transition-all duration-200 w-full sm:w-auto shadow-sm"
        />
      </div>

      {/* Processing Dialog */}
      {renderProcessingDialog()}
    </div>
  );
};

Verification.propTypes = {
  formData: PropTypes.object.isRequired,
  onPrevious: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

export default Verification;
