import PropTypes from "prop-types";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { Tag } from "primereact/tag";
import { formatCurrency, formatDate } from "../../utils/formatters";

const FavorDetailDialog = ({ visible, favor, onHide }) => {
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
        return { severity: "danger", icon: "pi pi-exclamation-circle" };
      case "Alta":
        return { severity: "warning", icon: "pi pi-exclamation-triangle" };
      case "Media":
        return { severity: "info", icon: "pi pi-info-circle" };
      case "Baja":
      case "Flexible":
      default:
        return { severity: "success", icon: "pi pi-check-circle" };
    }
  };

  const urgencyProps = getUrgencyProps(urgencia);

  const headerContent = (
    <div className="flex items-center">
      <div className="p-2 bg-primary-dark/10 rounded-full mr-2">
        <i className="pi pi-bookmark text-primary-dark"></i>
      </div>
      <h2 className="text-lg font-medium text-primary-dark m-0">
        Detalles del Favor
      </h2>
    </div>
  );

  const footerContent = (
    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-end w-full">
      <Button
        label="Aceptar Favor"
        icon="pi pi-check"
        className="bg-primary-dark text-white px-4 py-2 rounded-lg hover:bg-primary-dark/90 transition-colors w-full sm:w-auto order-2 sm:order-1"
      />
      <Button
        label="Cerrar"
        icon="pi pi-times"
        onClick={onHide}
        className="border border-neutral-gray bg-white text-neutral-dark px-4 py-2 rounded-lg hover:bg-neutral-light transition-colors w-full sm:w-auto order-1 sm:order-2"
      />
    </div>
  );

  return (
    <Dialog
      header={headerContent}
      visible={visible}
      style={{ width: "95vw", maxWidth: "550px" }}
      onHide={onHide}
      footer={footerContent}
      breakpoints={{ "960px": "80vw", "641px": "95vw" }}
      className="border-0 shadow-lg"
      contentClassName="p-0"
    >
      <div className="p-4 space-y-5">
        <div className="flex flex-col">
          <div className="flex justify-between items-start gap-4 mb-3">
            <h2 className="text-xl font-bold text-neutral-dark">{tipoFavor}</h2>
            <div className="bg-primary-light/50 px-3 py-1.5 rounded-lg">
              <span className="text-lg font-bold text-primary-dark">
                {formatCurrency(monto)}
              </span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mb-2">
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
            <Tag
              value={urgencia}
              severity={urgencyProps.severity}
              icon={urgencyProps.icon}
              className="text-xs rounded-full px-3 py-1 font-normal"
            />
          </div>
        </div>

        {descripcion && (
          <div className="bg-neutral-light/50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-primary-dark mb-2">
              Descripción
            </h3>
            <p className="text-neutral-dark text-sm leading-relaxed">
              {descripcion}
            </p>
          </div>
        )}

        {foto && (
          <div className="rounded-lg overflow-hidden bg-white">
            <img
              src={foto}
              alt="Foto del favor"
              className="w-full h-48 object-cover rounded-lg"
              onError={(e) => {
                e.target.src =
                  "https://via.placeholder.com/400x200?text=Imagen+no+disponible";
              }}
            />
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {/* Date and Time */}
          <div className="bg-neutral-light/30 p-4 rounded-lg">
            <h3 className="text-xs font-medium text-primary-dark uppercase tracking-wider mb-3">
              Fecha y Hora
            </h3>
            <div className="space-y-3">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-white rounded-md flex items-center justify-center mr-3 shadow-sm">
                  <i className="pi pi-calendar text-primary-dark text-sm"></i>
                </div>
                <span className="text-sm text-neutral-dark">
                  {formatDate(fechaInicio)}
                </span>
              </div>
              <div className="flex items-center">
                <div className="w-8 h-8 bg-white rounded-md flex items-center justify-center mr-3 shadow-sm">
                  <i className="pi pi-clock text-primary-dark text-sm"></i>
                </div>
                <span className="text-sm text-neutral-dark">{rangoTiempo}</span>
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="bg-neutral-light/30 p-4 rounded-lg">
            <h3 className="text-xs font-medium text-primary-dark uppercase tracking-wider mb-3">
              Ubicación
            </h3>
            <div className="space-y-3">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-white rounded-md flex items-center justify-center mr-3 shadow-sm">
                  <i className="pi pi-map-marker text-secondary-coral text-sm"></i>
                </div>
                <span className="text-sm text-neutral-dark">
                  {ciudad}
                  {zona ? `, ${zona}` : ""}
                </span>
              </div>
              {direccion && (
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-white rounded-md flex items-center justify-center mr-3 shadow-sm mt-0.5">
                    <i className="pi pi-home text-primary-dark text-sm"></i>
                  </div>
                  <span className="text-sm text-neutral-dark">{direccion}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Dialog>
  );
};

FavorDetailDialog.propTypes = {
  visible: PropTypes.bool.isRequired,
  favor: PropTypes.object,
  onHide: PropTypes.func.isRequired,
};

export default FavorDetailDialog;
