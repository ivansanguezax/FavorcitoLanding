import PropTypes from "prop-types";
import { Button } from "primereact/button";
import { useState, useEffect } from "react";

const EmptyState = ({
  title = "No hay datos disponibles",
  actionLabel = "",
  onAction = null,
}) => {
  const [randomQuote, setRandomQuote] = useState("");

  const funnyQuotes = [
    "¡Oops! Parece que nuestros favores están de vacaciones. ",
    "No hay favores disponibles, pero tenemos abrazos virtuales gratis. ",
    "Nuestros favores están más perdidos que billete en fin de mes. ",
    "Hoy los favores están en modo ninja... invisibles. ",
    "Favorcito está en huelga... bueno, más bien tomando una siesta.",
    "No hay favores por ahora, pero sí buenas vibras. ¡Toma una! "
  ];

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * funnyQuotes.length);
    setRandomQuote(funnyQuotes[randomIndex]);
  }, []);

  return (
    <div className="flex flex-col items-center pt-5 justify-center  px-4 text-center bg-neutral-light rounded-xl border border-neutral-gray/15">
      <div className="w-28 h-28 mb-5 relative">
        <img 
          src="https://res.cloudinary.com/dfgjenml4/image/upload/v1740757375/icon404_oaeerr.png" 
          alt="Estado vacío" 
          className="w-full h-full object-contain"
        />
      </div>

      <h3 className="text-xl font-semibold text-primary-dark mb-2">{title}</h3>

      
      <div className="bg-white px-5 py-3 rounded-lg border border-primary-dark/10 mb-6 max-w-sm">
        <p className="text-sm text-neutral-dark/80 italic">
          &quot;{randomQuote}&quot;
        </p>
      </div>

      {actionLabel && onAction && (
        <Button
          label={actionLabel}
          icon="pi pi-refresh"
          className="bg-primary-dark text-white border-none px-4 py-2 rounded-lg hover:bg-primary-dark/90"
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