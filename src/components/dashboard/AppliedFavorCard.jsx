import PropTypes from "prop-types";
import { Card } from "primereact/card";
import { Tag } from "primereact/tag";
import { formatCurrency, formatDate } from "../../utils/formatters";

const AppliedFavorCard = ({ favor }) => {
  if (!favor) return null;

  const {
    "Tipo de favor": tipoFavor,
    Monto: monto,
    Ciudad: ciudad,
    Zona: zona,
    "Fecha de inicio": fechaInicio,
    "Rango de tiempo": rangoTiempo,
    Urgencia: urgencia,
    Estado: estado
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

  const getStatusProps = (status) => {
    switch (status) {
      case "Asignado":
        return { severity: "success", icon: "pi pi-check-circle", label: "Asignado" };
      case "Rechazado":
        return { severity: "danger", icon: "pi pi-times-circle", label: "Rechazado" };
      case "En espera":
      case "Sin asignar":
      default:
        return { severity: "info", icon: "pi pi-clock", label: "En espera" };
    }
  };

  const urgencyProps = getUrgencyProps(urgencia);
  const statusProps = getStatusProps(estado || "Sin asignar");

  return (
    <Card className="p-0 border border-neutral-gray/20 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-200">
      <div className="p-3">
        {/* Status badge */}
        <div className="flex justify-between items-center mb-3">
          <Tag
            value={statusProps.label}
            severity={statusProps.severity}
            icon={statusProps.icon}
            className="text-xs font-medium rounded-lg px-2 py-1"
          />
          <Tag
            value={urgencia}
            severity={urgencyProps.severity}
            icon={urgencyProps.icon}
            className="text-xs font-medium rounded-lg px-2 py-1"
          />
        </div>

        {/* Titulo y Monto */}
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-base font-semibold text-primary-dark line-clamp-2 m-0 flex-1">
            {tipoFavor}
          </h3>
          <div className="bg-primary-light/20 px-2 py-1 rounded-md ml-2">
            <span className="text-sm font-bold text-primary-dark">
              {formatCurrency(monto)}
            </span>
          </div>
        </div>
        
        {/* Detalles */}
        <div className="space-y-2">
          <div className="flex items-center text-sm text-neutral-dark">
            <i className="pi pi-map-marker mr-2 text-primary-dark/70"></i>
            <span>
              {ciudad}
              {zona ? `, ${zona}` : ""}
            </span>
          </div>
          
          <div className="flex items-center text-sm text-neutral-dark">
            <i className="pi pi-calendar mr-2 text-primary-dark/70"></i>
            <span>{formatDate(fechaInicio)}</span>
          </div>
          
          <div className="flex items-center text-sm text-neutral-dark">
            <i className="pi pi-clock mr-2 text-primary-dark/70"></i>
            <span>{rangoTiempo}</span>
          </div>
        </div>
      </div>
    </Card>
  );
};

AppliedFavorCard.propTypes = {
  favor: PropTypes.object.isRequired,
};

export default AppliedFavorCard;