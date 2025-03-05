import PropTypes from "prop-types";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { Tag } from "primereact/tag";
import { formatCurrency, formatDate } from "../../utils/formatters";
import { useState, useEffect, useRef } from "react";
import { Toast } from "primereact/toast";

const FavorDetailDialog = ({ visible, favor, onHide }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [showScrollIndicator, setShowScrollIndicator] = useState(true);
  const contentRef = useRef(null);
  const toast = useRef(null);
  
  useEffect(() => {
    // Reset states when dialog becomes visible
    if (visible) {
      setIsSubmitting(false);
      setShowSuccessMessage(false);
      setImageError(false);
      setShowScrollIndicator(true);
    }
  }, [visible]);
  
  // Control scroll indicator visibility
  useEffect(() => {
    if (!contentRef.current) return;
    
    const checkScrollPosition = () => {
      const { scrollTop, scrollHeight, clientHeight } = contentRef.current;
      
      // Show indicator if there's content to scroll (more than 20px)
      const hasScrollableContent = scrollHeight > clientHeight + 20;
      
      // Hide indicator when we're near the bottom
      const isNearBottom = scrollTop + clientHeight >= scrollHeight - 30;
      
      setShowScrollIndicator(hasScrollableContent && !isNearBottom);
    };
    
    // Check initially
    checkScrollPosition();
    
    // Add scroll event listener
    const currentRef = contentRef.current;
    currentRef.addEventListener('scroll', checkScrollPosition);
    
    // Cleanup
    return () => {
      if (currentRef) {
        currentRef.removeEventListener('scroll', checkScrollPosition);
      }
    };
  }, [visible, showSuccessMessage]);
  
  if (!favor) return null;

  const {
    "Tipo de favor": tipoFavor,
    Descripcion: descripcion,
    Monto: monto,
    Ciudad: ciudad,
    Zona: zona,
    Direccion: direccion,
    "Fecha de inicio": fechaInicio,
    "Rango de tiempo": rangoTiempo,
    Urgencia: urgencia,
    Foto: foto,
  } = favor;

  const getUrgencyProps = (urgencia) => {
    switch (urgencia) {
      case "Urgente":
        return { 
          severity: "danger", 
          icon: "pi pi-exclamation-circle",
          bgColor: "bg-red-50",
          textColor: "text-red-700",
          borderColor: "border-red-200"
        };
      case "Alta":
        return { 
          severity: "warning", 
          icon: "pi pi-exclamation-triangle",
          bgColor: "bg-orange-50",
          textColor: "text-orange-700",
          borderColor: "border-orange-200"
        };
      case "Media":
        return { 
          severity: "info", 
          icon: "pi pi-info-circle",
          bgColor: "bg-blue-50",
          textColor: "text-blue-700",
          borderColor: "border-blue-200"
        };
      case "Baja":
      case "Flexible":
      default:
        return { 
          severity: "success", 
          icon: "pi pi-check-circle",
          bgColor: "bg-green-50",
          textColor: "text-green-700",
          borderColor: "border-green-200"
        };
    }
  };

  const urgencyProps = getUrgencyProps(urgencia);
  
  const handlePostulacion = () => {
    setIsSubmitting(true);
    
    // Simulación de envío
    setTimeout(() => {
      setIsSubmitting(false);
      setShowSuccessMessage(true);
      
      // Cerrar después de mostrar mensaje de éxito
      setTimeout(() => {
        onHide();
      }, 2000);
    }, 1500);
  };

  const isValidImageUrl = (url) => {
    if (!url) return false;
    return url.match(/\.(jpeg|jpg|gif|png)$/) !== null || url.startsWith('http');
  };

  const headerContent = (
    <div className="relative w-full py-3 px-4 sm:py-4 sm:px-6 border-b border-neutral-gray/10">
      <div className="flex items-center">
        <div className="p-2 bg-primary-dark/10 rounded-full mr-3 flex-shrink-0">
          <i className="pi pi-bookmark text-primary-dark"></i>
        </div>
        <div>
          <h2 className="text-lg font-medium text-primary-dark m-0">Detalle del Favor</h2>
          <p className="text-xs text-neutral-dark/60 mt-1">Revisa y postula a este favor</p>
        </div>
      </div>
      
      {/* Tag de urgencia flotante */}
      <div className="absolute top-4 right-4 hidden sm:block">
        <Tag
          value={urgencia}
          severity={urgencyProps.severity}
          icon={urgencyProps.icon}
          className="text-xs font-medium rounded-lg px-3 py-1.5"
        />
      </div>
    </div>
  );

  const footerContent = (
    <div className="border-t border-neutral-gray/10 p-4">
      <div className="flex flex-col sm:flex-row gap-3 justify-end w-full">
        <Button
          label="Cancelar"
          icon="pi pi-times"
          onClick={onHide}
          className="border border-neutral-gray bg-white text-neutral-dark px-4 py-2.5 rounded-lg hover:bg-neutral-light transition-colors w-full sm:w-auto order-2 sm:order-1"
          disabled={isSubmitting || showSuccessMessage}
        />
        <Button
          label={isSubmitting ? "Enviando..." : "Postular al favor"}
          icon={isSubmitting ? "pi pi-spin pi-spinner" : "pi pi-check"}
          onClick={handlePostulacion}
          disabled={isSubmitting || showSuccessMessage}
          className="bg-primary-dark text-white px-5 py-2.5 rounded-lg hover:bg-primary-dark/90 transition-colors w-full sm:w-auto order-1 sm:order-2 font-medium shadow-sm"
        />
      </div>
    </div>
  );

  return (
    <>
      <Toast ref={toast} />
      <Dialog
        header={headerContent}
        visible={visible}
        style={{ width: "95vw", maxWidth: "600px" }}
        onHide={onHide}
        footer={footerContent}
        breakpoints={{ "960px": "85vw", "641px": "95vw" }}
        className="border-0 rounded-xl overflow-hidden"
        contentClassName="p-0"
        closeIcon="pi pi-times"
        dismissableMask
      >
        {showSuccessMessage ? (
          <div className="p-6 flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <i className="pi pi-check-circle text-3xl text-green-600"></i>
            </div>
            <h3 className="text-xl font-bold text-primary-dark mb-2">¡Postulación enviada!</h3>
            <p className="text-neutral-dark mb-4">
              Hemos enviado tu perfil al solicitante del favor. 
              Te notificaremos cuando responda.
            </p>
            <div className="bg-primary-light/10 p-3 rounded-lg border border-primary-dark/10 max-w-sm">
              <p className="text-sm text-primary-dark">
                Recuerda mantener tu perfil actualizado para aumentar tus posibilidades.
              </p>
            </div>
          </div>
        ) : (
          <div className="relative">
            {/* Indicador de scroll - solo visible si hay contenido para desplazar y no estamos al final */}
            {showScrollIndicator && (
              <div className="absolute z-10 top-2 left-0 right-0 flex justify-center pointer-events-none">
                <div className="bg-white/90 px-3 py-1 rounded-full shadow-sm flex items-center text-xs text-primary-dark animate-pulse border border-primary-dark/10">
                  <i className="pi pi-arrow-down mr-1"></i>
                  Desliza para ver más detalles
                </div>
              </div>
            )}
            
            <div 
              ref={contentRef}
              className="p-4 sm:p-6 space-y-5 max-h-[70vh] overflow-y-auto"
            >
              {/* Header con tipo y monto */}
              <div className="flex flex-col">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-4">
                  <h2 className="text-xl font-bold text-primary-dark">{tipoFavor}</h2>
                  <div className="bg-gradient-to-r from-primary-light/30 to-primary-dark/20 px-4 py-2 rounded-lg shadow-sm self-start">
                    <span className="text-lg font-bold text-primary-dark">
                      {formatCurrency(monto)}
                    </span>
                  </div>
                </div>

                {/* Tags móviles (urgencia solo se muestra aquí en móvil) */}
                <div className="flex flex-wrap gap-2 mb-3">
                  <Tag
                    value={ciudad}
                    severity="info"
                    className="text-xs rounded-full px-3 py-1 font-normal"
                    icon="pi pi-map-marker"
                  />
                  {zona && (
                    <Tag
                      value={zona}
                      severity="secondary"
                      className="text-xs rounded-full px-3 py-1 font-normal"
                    />
                  )}
                  <div className="sm:hidden">
                    <Tag
                      value={urgencia}
                      severity={urgencyProps.severity}
                      icon={urgencyProps.icon}
                      className="text-xs rounded-full px-3 py-1 font-normal"
                    />
                  </div>
                </div>
              </div>

              {/* Imagen destacada */}
              {foto && isValidImageUrl(foto) && !imageError ? (
                <div className="rounded-xl overflow-hidden bg-white shadow-sm border border-neutral-gray/10">
                  <img
                    src={foto}
                    alt="Foto del favor"
                    className="w-full h-48 sm:h-64 object-cover"
                    onError={(e) => {
                      setImageError(true);
                    }}
                  />
                </div>
              ) : foto && (
                <div className="rounded-xl overflow-hidden bg-neutral-light/50 shadow-sm border border-neutral-gray/10 h-40 flex flex-col items-center justify-center">
                  <i className="pi pi-image text-3xl text-neutral-gray mb-2"></i>
                  <p className="text-sm text-neutral-dark">Imagen no disponible</p>
                </div>
              )}

              {/* Detalles principales */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Date and Time */}
                <div className={`${urgencyProps.bgColor} p-4 rounded-xl border ${urgencyProps.borderColor}`}>
                  <h3 className="text-xs font-semibold uppercase tracking-wider mb-3 flex items-center gap-2 text-primary-dark">
                    <i className={`pi pi-calendar ${urgencyProps.textColor}`}></i>
                    Fecha y Hora
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <div className={`w-8 h-8 bg-white rounded-lg flex items-center justify-center mr-3 shadow-sm`}>
                        <i className={`pi pi-calendar ${urgencyProps.textColor}`}></i>
                      </div>
                      <span className={`text-sm ${urgencyProps.textColor} font-medium`}>
                        {formatDate(fechaInicio)}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <div className={`w-8 h-8 bg-white rounded-lg flex items-center justify-center mr-3 shadow-sm`}>
                        <i className={`pi pi-clock ${urgencyProps.textColor}`}></i>
                      </div>
                      <span className={`text-sm ${urgencyProps.textColor} font-medium`}>{rangoTiempo}</span>
                    </div>
                  </div>
                </div>

                {/* Location */}
                <div className="bg-primary-light/15 p-4 rounded-xl border border-primary-dark/10">
                  <h3 className="text-xs font-semibold uppercase tracking-wider mb-3 flex items-center gap-2 text-primary-dark">
                    <i className="pi pi-map-marker"></i>
                    Ubicación
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center mr-3 shadow-sm">
                        <i className="pi pi-map-marker text-primary-dark"></i>
                      </div>
                      <span className="text-sm text-primary-dark font-medium">
                        {ciudad}
                        {zona ? `, ${zona}` : ""}
                      </span>
                    </div>
                    {direccion && (
                      <div className="flex items-start">
                        <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center mr-3 shadow-sm mt-0.5">
                          <i className="pi pi-home text-primary-dark"></i>
                        </div>
                        <span className="text-sm text-primary-dark">{direccion}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Descripción */}
              {descripcion && (
                <div className="bg-white p-5 rounded-xl border border-neutral-gray/20 shadow-sm">
                  <h3 className="text-sm font-medium text-primary-dark mb-3 flex items-center gap-2">
                    <i className="pi pi-info-circle text-primary-dark/70"></i>
                    Descripción del favor
                  </h3>
                  <p className="text-neutral-dark text-sm leading-relaxed">{descripcion}</p>
                </div>
              )}
              
              {/* Mensaje de advertencia/incentivo */}
              <div className="bg-gradient-to-r from-primary-light/10 to-primary-dark/5 p-4 rounded-xl border border-primary-dark/10 flex items-start gap-3">
                <i className="pi pi-bell text-primary-dark mt-0.5"></i>
                <div>
                  <p className="text-sm text-primary-dark font-medium">¡No pierdas esta oportunidad!</p>
                  <p className="text-xs text-neutral-dark/80 mt-1">
                    Los favores como este se completan rápidamente. Postúlate ahora y gana {formatCurrency(monto)}.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </Dialog>
    </>
  );
};

FavorDetailDialog.propTypes = {
  visible: PropTypes.bool.isRequired,
  favor: PropTypes.object,
  onHide: PropTypes.func.isRequired,
};

export default FavorDetailDialog;