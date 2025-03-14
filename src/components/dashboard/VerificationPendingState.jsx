import { useState, useEffect } from "react";
import { Button } from "primereact/button";
import PropTypes from "prop-types";

const VerificationPendingState = ({ onRefresh }) => {
  const [randomQuote, setRandomQuote] = useState("");
  const [lastRefresh, setLastRefresh] = useState(new Date());
  
  const funnyQuotes = [
    "Estamos revisando tu matrícula con más atención que cuando buscas tu nombre en la lista de aprobados.",
    "Verificando que seas estudiante real y no alguien intentando revivir su época universitaria.",
    "Procesando tu información académica... sin el estrés de esperar notas finales.",
    "Tu carnet está en revisión, más rápido que un estudiante terminando una tarea 5 minutos antes del plazo.",
    "Asegurándonos de que eres estudiante, no un maestro infiltrado buscando descuentos.",
    "Dale un momento, esto es más rápido que encontrar un compañero que quiera hacer la parte difícil del trabajo en grupo.",
  ];


  // Mensajes para WhatsApp
  const whatsappMessages = [
    "¡Ayuda! Mi verificación va más lenta que la fila de la cafetería a la hora pico 🍔",
    "Necesito una mano con mi verificación, ¡casi tan urgente como entregar un trabajo final! 📚",
    "¿Me pueden ayudar con mi verificación? Prometo no dejar todo para último minuto como mis trabajos 😅"
  ];

  // Seleccionar un mensaje aleatorio para WhatsApp
  const getRandomWhatsappMessage = () => {
    const randomIndex = Math.floor(Math.random() * whatsappMessages.length);
    return encodeURIComponent(whatsappMessages[randomIndex]);
  };

  useEffect(() => {
    // Establecer una cita aleatoria cuando el componente se monta o cuando lastRefresh cambia
    const randomIndex = Math.floor(Math.random() * funnyQuotes.length);
    setRandomQuote(funnyQuotes[randomIndex]);
  }, [lastRefresh]);

  // Manejar la actualización del estado sin recargar todo el componente
  const handleRefresh = () => {
    setLastRefresh(new Date());
    // Llamar al callback del padre si existe
    if (onRefresh) {
      onRefresh();
    }
  };

  // Abrir WhatsApp con un mensaje divertido
  const openWhatsApp = () => {
    const message = getRandomWhatsappMessage();
    window.open(`https://wa.me/59168619814?text=${message}`, "_blank");
  };

  return (
    <div className="flex flex-col md:flex-row items-center bg-white rounded-xl border border-yellow-200 shadow-sm overflow-hidden">
      {/* Layout para desktop */}
      <div className="hidden md:block w-1/2 h-full">
        <iframe
          src="https://lottie.host/embed/afb63843-983f-46c7-b15d-b85da4faa390/GANP3b98vy.lottie"
          className="w-full h-96"
          title="Animación de verificación"
        ></iframe>
      </div>

      <div className="md:w-1/2 p-6 md:p-8">
        {/* Layout para mobile - animación más pequeña */}
        <div className="md:hidden w-full h-40 mb-4">
          <iframe
            src="https://lottie.host/embed/afb63843-983f-46c7-b15d-b85da4faa390/GANP3b98vy.lottie"
            className="w-full h-full"
            title="Animación de verificación"
          ></iframe>
        </div>

        <h2 className="text-xl md:text-2xl font-medium text-yellow-700 mb-3 text-center md:text-left">
          Verificando tu cuenta
        </h2>

        {/* Tarjeta de información con nueva estructura */}
        <div className="bg-yellow-50 px-4 md:px-6 py-3 md:py-4 rounded-lg border border-yellow-200 mb-4 md:mb-5">
          <div className="flex items-start mb-3">
            <span className="pi pi-info-circle text-yellow-600 mt-1 mr-2"></span>
            <p className="text-base text-neutral-dark italic">{randomQuote}</p>
          </div>
          
          <div className="flex items-start">
            <span className="pi pi-clock text-yellow-600 mt-1 mr-2"></span>
            <p className="text-sm text-yellow-700">
              Estamos verificando tu información académica para asegurarnos que
              cumples con los requisitos. Esto puede tomar hasta 24 horas hábiles.
            </p>
          </div>
        </div>

        {/* Última actualización */}
        <p className="text-xs text-gray-500 mb-3 text-center">
          Última actualización: {lastRefresh.toLocaleTimeString()}
        </p>

        <div className="flex flex-col space-y-3 w-full">
          <Button
            label="Actualizar estado"
            icon="pi pi-refresh"
            className="bg-yellow-600 text-white rounded-lg px-4 py-2 hover:bg-yellow-700"
            onClick={handleRefresh}
          />

          <Button
            label="¿Necesitas ayuda?"
            icon="pi pi-whatsapp"
            className="bg-transparent text-yellow-700 border border-yellow-500 rounded-lg px-4 py-2 hover:bg-yellow-50"
            onClick={openWhatsApp}
          />
        </div>
      </div>
    </div>
  );
};

VerificationPendingState.propTypes = {
  onRefresh: PropTypes.func.isRequired,
};

export default VerificationPendingState;