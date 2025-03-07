import { Button } from "primereact/button";
import PropTypes from "prop-types";
import { useState, useEffect } from "react";

const LoginPrompt = ({ onLogin, loading, calculatedIncome }) => {
  const [funnyMessage, setFunnyMessage] = useState("");

  const funnyMessages = [
    "¡Tu billetera ya está sonriendo!",
    "Spoiler: Tus ahorros están a punto de crecer",
    "Estás a un click de decirle adiós a los fideos instantáneos",
    "Tu futuro yo dice: '¡Gracias por registrarte!'",
    "Mientras dudas, otro estudiante ya está ganando",
    "Comienza hoy, agradécete mañana",
  ];

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * funnyMessages.length);
    setFunnyMessage(funnyMessages[randomIndex]);
  }, []);

  const formatCurrencyBlurred = (value) => {
    const formatted = `Bs. ${value.toLocaleString()}`;
    return formatted.replace(/\d/g, "✱");
  };

  return (
    <div className="flex flex-col items-center p-4">
      {calculatedIncome && (
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-5 mb-6 w-full text-center shadow-md relative overflow-hidden">
          <div className="absolute inset-0 bg-white/10 backdrop-blur-sm flex items-center justify-center z-10">
            <div className="bg-primary-dark/90 text-white px-4 py-2 rounded-full text-sm font-medium transform -rotate-2 shadow-lg">
              ¡Regístrate para ver tus resultados!
            </div>
          </div>

          <p className="text-sm text-neutral-dark mb-1">Podrías ganar hasta</p>
          <h3 className="text-3xl font-bold text-primary-dark filter blur-sm">
            {formatCurrencyBlurred(calculatedIncome.monthly.max)}
          </h3>
          <p className="text-xs text-neutral-dark/60 mt-1">
            mensuales compartiendo tus habilidades
          </p>
        </div>
      )}

      <div className="text-center mb-4">
        <h3 className="text-xl font-semibold text-primary-dark mb-2">
          ¡Estás a un paso de conocer tu potencial!
        </h3>
      </div>

      {/* Mensaje divertido con animación */}
      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3 mb-6 w-full rounded-r-lg">
        <p className="text-sm text-neutral-dark flex items-center">
          <i className="pi pi-bolt text-yellow-500 mr-2"></i>
          <span className="italic">{funnyMessage}</span>
        </p>
      </div>

      <Button
        onClick={onLogin}
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 bg-primary-dark text-white rounded-lg p-4 hover:bg-primary-dark/90 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1 text-sm font-light"
      >
        {loading ? (
          <i className="pi pi-spin pi-spinner mr-2"></i>
        ) : (
          <img
            src="https://cdn-icons-png.flaticon.com/512/2991/2991148.png"
            alt="Google"
            className="w-6 h-6 bg-white p-0.5 rounded-full mr-2"
          />
        )}
        <span>
          {loading ? "Procesando..." : "¡Descubre cuánto puedes ganar!"}
        </span>
      </Button>

      <div className="mt-6 text-sm text-neutral-dark/60 text-center flex flex-col items-center space-y-2">
        <p className="text-xs mt-2 text-neutral-dark/40">
          Al continuar, aceptas los Términos y Condiciones de Favorcito
        </p>
      </div>
    </div>
  );
};

LoginPrompt.propTypes = {
  onLogin: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  calculatedIncome: PropTypes.object,
};

export default LoginPrompt;
