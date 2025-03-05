import PropTypes from "prop-types";
import { Button } from "primereact/button";

const EmptyState = ({
  icon = "pi-inbox",
  title = "No hay datos disponibles",
  message = "No se encontraron resultados que mostrar.",
  actionLabel = "",
  onAction = null,
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center bg-white rounded-lg border border-gray-100 shadow-sm">
      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-6">
        <i className={`pi ${icon} text-4xl text-gray-400`}></i>
      </div>

      <h3 className="text-xl font-semibold text-neutral-dark mb-2">{title}</h3>

      <p className="text-neutral-gray max-w-md mb-6">{message}</p>

      {actionLabel && onAction && (
        <Button
          label={actionLabel}
          className="p-button-outlined"
          onClick={onAction}
        />
      )}
    </div>
  );
};

EmptyState.propTypes = {
  icon: PropTypes.string,
  title: PropTypes.string,
  message: PropTypes.string,
  actionLabel: PropTypes.string,
  onAction: PropTypes.func,
};

export default EmptyState;
