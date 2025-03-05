import PropTypes from "prop-types";
import { Button } from "primereact/button";
import { formatCurrency, formatDate } from "../../utils/formatters";

const FavorCard = ({ favor, onViewDetails }) => {
  const {
    ID,
    "Tipo de favor": tipoFavor,
    Monto: monto,
    Ciudad: ciudad,
    Zona: zona,
    "Fecha de inicio": fechaInicio,
    "Rango de tiempo": rangoTiempo,
  } = favor;

  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 border border-neutral-gray/20 h-full flex flex-col">
      <div className="bg-primary-dark px-4 py-3 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="bg-primary-light/30 p-1.5 rounded-full">
            <i className="pi pi-briefcase text-white"></i>
          </div>
          <h3 className="font-medium text-white text-sm sm:text-base m-0">
            {tipoFavor}
          </h3>
        </div>
        <div className="bg-white/20 px-2 py-1 rounded-full">
          <span className="text-white text-xs sm:text-sm font-medium">
            #{ID}
          </span>
        </div>
      </div>

      {/* Content with improved spacing and visual hierarchy */}
      <div className="p-3 sm:p-4 flex-1 flex flex-col">
        {/* Location */}
        <div className="flex items-center mb-3">
          <i className="pi pi-map-marker text-secondary-coral mr-2"></i>
          <span className="text-neutral-dark text-sm sm:text-base">
            {ciudad}
            {zona ? `, ${zona}` : ""}
          </span>
        </div>

        {/* Date and time stacked in mobile and compressed views */}
        <div className="flex flex-col space-y-2 mt-auto">
          <div className="flex items-center bg-neutral-light/70 p-2 rounded-lg">
            <div className="bg-white/80 p-1.5 rounded-md mr-2">
              <i className="pi pi-calendar text-primary-dark text-xs sm:text-sm"></i>
            </div>
            <span className="text-xs sm:text-sm text-neutral-dark">
              {formatDate(fechaInicio)}
            </span>
          </div>

          <div className="flex items-center bg-neutral-light/70 p-2 rounded-lg">
            <div className="bg-white/80 p-1.5 rounded-md mr-2">
              <i className="pi pi-clock text-primary-dark text-xs sm:text-sm"></i>
            </div>
            <span className="text-xs sm:text-sm text-neutral-dark">
              {rangoTiempo}
            </span>
          </div>
        </div>
      </div>

      {/* Footer with price and button */}
      <div className="mt-auto">
        <div className="p-3 sm:p-4 bg-white border-t border-neutral-gray/30">
          <div className="flex justify-between items-center mb-3">
            <span className="text-xs uppercase tracking-wider text-neutral-dark font-medium">
              Pago ofrecido
            </span>
            <div className="bg-primary-light px-3 py-1 rounded-lg">
              <span className="text-base sm:text-lg font-bold text-primary-dark">
                {formatCurrency(monto)}
              </span>
            </div>
          </div>

          <Button
            label="Ver detalles"
            icon="pi pi-arrow-right"
            iconPos="right"
            className="w-full bg-primary-dark hover:bg-primary-dark/90 text-white text-sm sm:text-base font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex justify-between items-center"
            onClick={() => onViewDetails(ID)}
          />
        </div>
      </div>
    </div>
  );
};

FavorCard.propTypes = {
  favor: PropTypes.object.isRequired,
  onViewDetails: PropTypes.func.isRequired,
};

export default FavorCard;
