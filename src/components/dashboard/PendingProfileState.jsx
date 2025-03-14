import { useState, useEffect } from "react";
import { Button } from "primereact/button";
import PropTypes from "prop-types";
import CompleteProfileDialog from "./CompleteProfileDialog";

const PendingProfileState = ({ studentData, onRefresh }) => {
  const [randomQuote, setRandomQuote] = useState("");
  const [showCompleteProfile, setShowCompleteProfile] = useState(false);
  
  const funnyQuotes = [
    "Dale un toque, esto carga más rápido que decir 'profe, puede repetir'.",
    "Esperá un rato, no es tan lento como inscribirse en la U.",
    "Ya casi, esto va más rápido que decidir qué comer con 10 pesos.",
    "Tranquilo, esto avanza, no como tus ganas de hacer la tesis.",
    "Un cachito, esto no tarda tanto como una fila en la UMSA.",
    "Dale un rato, que esto se arma mejor que grupo para trabajo final."
  ];

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * funnyQuotes.length);
    setRandomQuote(funnyQuotes[randomIndex]);
  }, []);

  const handleCompleteProfileClick = () => {
    setShowCompleteProfile(true);
  };

  const handleCloseDialog = () => {
    setShowCompleteProfile(false);
    // Refrescar los datos después de cerrar el diálogo
    onRefresh();
  };

  return (
    <>
      <div className="flex flex-col md:flex-row items-center bg-white rounded-xl border border-primary-light/30 shadow-sm overflow-hidden">
        {/* Layout para desktop */}
        <div className="hidden md:block w-1/2 h-full bg-primary-light/5">
          <iframe
            src="https://lottie.host/embed/666d09ae-4ac2-4d8c-84d6-4415974fcff8/ph6bIbKrVA.lottie"
            className="w-full h-96"
            title="Animación de espera"
          ></iframe>
        </div>
        
        <div className="md:w-1/2 p-6 md:p-8">
          {/* Layout para mobile - animación más pequeña */}
          <div className="md:hidden w-full h-40 mb-4">
            <iframe
              src="https://lottie.host/embed/666d09ae-4ac2-4d8c-84d6-4415974fcff8/ph6bIbKrVA.lottie"
              className="w-full h-full"
              title="Animación de espera"
            ></iframe>
          </div>
          
          <h2 className="text-xl md:text-2xl font-medium text-primary-dark mb-3 text-center md:text-left">
            ¡Casi listo para empezar!
          </h2>
          
          <div className="bg-primary-light/10 px-4 md:px-6 py-3 md:py-4 rounded-lg border border-primary-light/20 mb-4 md:mb-5">
            <p className="text-base text-neutral-dark mb-2">
              {randomQuote}
            </p>
            <p className="text-sm text-primary-dark/80">
              Detectamos que iniciaste sesión usando la calculadora de ingresos.
              Para acceder a los favores disponibles, necesitas completar tu perfil de estudiante.
            </p>
          </div>
          
          <div className="flex flex-col space-y-3 w-full">
            <Button
              label="Completar mi perfil"
              icon="pi pi-user-edit"
              className="bg-primary-dark text-white rounded-lg px-4 py-2 hover:bg-primary-dark/90"
              onClick={handleCompleteProfileClick}
            />
            
            <Button
              label="Actualizar estado"
              icon="pi pi-refresh"
              className="bg-transparent text-primary-dark border border-primary-dark/50 rounded-lg px-4 py-2 hover:bg-primary-light/10"
              onClick={onRefresh}
            />
            
            <Button
              label="¿Necesitas ayuda?"
              icon="pi pi-question-circle"
              className="bg-transparent text-primary-dark/70 border border-primary-dark/30 rounded-lg px-4 py-2 hover:bg-primary-light/10"
              onClick={() => window.location.href = "mailto:soporte@favorcito.com"}
            />
          </div>
        </div>
      </div>
      
      {/* Diálogo para completar el perfil */}
      {showCompleteProfile && (
        <CompleteProfileDialog 
          visible={showCompleteProfile}
          onHide={handleCloseDialog}
          studentData={studentData}
        />
      )}
    </>
  );
};

PendingProfileState.propTypes = {
  studentData: PropTypes.object.isRequired,
  onRefresh: PropTypes.func.isRequired
};

export default PendingProfileState;