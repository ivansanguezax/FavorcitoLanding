import { Button } from "primereact/button";
import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Mixpanel } from "../../services/mixpanel";

const IncomeResults = ({ 
  calculatedIncome, 
  selectedSkills, 
  city, 
  currentUser, 
  userExists,
  onStartOver,
  onDashboard
}) => {
  useEffect(() => {
    // Track view of results
    Mixpanel.track("Income_Results_View", {
      is_logged_in: !!currentUser,
      is_registered: userExists,
      monthly_min: calculatedIncome.monthly.min,
      monthly_max: calculatedIncome.monthly.max,
      skills_count: selectedSkills.length
    });
  }, []);

  // Formatear para mostrar como moneda boliviana
  const formatCurrency = (value) => {
    return `Bs. ${value.toLocaleString()}`;
  };

  // Calcular el ingreso total estimado (promedio entre min y max)
  const calcularIngresoTotal = () => {
    const promedioMensual = (calculatedIncome.monthly.min + calculatedIncome.monthly.max) / 2;
    return Math.round(promedioMensual);
  };

  // Mapeo de iconos para los servicios seleccionados
  const getIconForSkill = (skillName) => {
    const iconMap = {
      "Clases particulares": "pi pi-book",
      "Trámites y diligencias": "pi pi-file",
      "Compras en el mercado": "pi pi-shopping-cart",
      "Montar muebles y arreglos basicos del hogar": "pi pi-wrench",
      "Cuidado y paseo de mascotas": "pi pi-heart-fill",
      "Cuidado de adultos mayores": "pi pi-heart",
      "Cocinero a domicilio": "pi pi-stop",
      "Manicure y pedicure": "pi pi-star",
      "Reparaciones simples": "pi pi-cog",
      "Jardinería": "pi pi-inbox",
      "Configuracion de dispositivos electronicos": "pi pi-desktop",
      "Entrenamiento personal": "pi pi-user",
      "Fotografía": "pi pi-camera",
      "Técnico instalador": "pi pi-mobile",
      "Mesero para eventos": "pi pi-users",
      "Desarrollo web": "pi pi-globe",
      "Creación de contenido": "pi pi-video",
      "Edición de videos": "pi pi-camera",
      "Diseño gráfico": "pi pi-pencil",
      "Otros servicios": "pi pi-bolt",
      "Transporte de paquetes pequeños": "pi pi-car"
    };
    
    return iconMap[skillName] || "pi pi-check";
  };

  return (
    <div className="max-w-4xl mx-auto bg-gradient-to-b from-white to-primary-light/5 rounded-2xl p-5 md:p-8">
      <div className="text-center mb-6">
        <h2 className="text-2xl md:text-3xl font-medium text-primary-dark mb-2">✨ Tu potencial en {city} ✨</h2>
        <p className="text-neutral-dark/80 text-base mb-2">
          Con tus {selectedSkills.length} {selectedSkills.length === 1 ? 'habilidad' : 'habilidades'} puedes ganar:
        </p>
      </div>

      {/* Ingreso Total - Nuevo elemento */}
      <div className="bg-gradient-to-r from-primary-dark to-primary-dark/90 text-white rounded-xl p-4 shadow-md mb-6">
        <div className="flex flex-col items-center text-center">
          <p className="text-white/90 text-sm mb-1">Ingreso mensual promedio</p>
          <h3 className="text-3xl font-medium mb-1">{formatCurrency(calcularIngresoTotal())}</h3>
          <p className="text-xs text-white/80">Un servicio por semana</p>
        </div>
      </div>

      {/* Monthly estimation highlight - Cards with visual elements */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="flex-1 bg-gradient-to-br from-primary-light/20 to-primary-light/40 rounded-2xl p-4 md:p-6 text-center transform transition-all hover:scale-105 hover:shadow-md">
          <div className="flex justify-center mb-2">
            <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-primary-light/30 flex items-center justify-center">
              <i className="pi pi-wallet text-xl md:text-2xl text-primary-dark"></i>
            </div>
          </div>
          <p className="text-base md:text-lg text-neutral-dark mb-1">Mínimo Mensual</p>
          <h3 className="text-2xl md:text-4xl font-medium text-primary-dark mb-1">{formatCurrency(calculatedIncome.monthly.min)}</h3>
          <p className="text-xs md:text-sm text-neutral-dark/70">1 servicio por semana</p>
        </div>
        
        <div className="flex-1 bg-gradient-to-br from-primary-dark to-primary-dark/80 text-white rounded-2xl p-4 md:p-6 text-center shadow-xl transform transition-all hover:scale-105">
          <div className="flex justify-center mb-2">
            <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-white/20 flex items-center justify-center">
              <i className="pi pi-chart-line text-xl md:text-2xl text-white"></i>
            </div>
          </div>
          <p className="text-base md:text-lg mb-1">Máximo Mensual</p>
          <h3 className="text-2xl md:text-4xl font-medium mb-1">{formatCurrency(calculatedIncome.monthly.max)}</h3>
          <p className="text-xs md:text-sm text-white/70">1 servicio por semana</p>
        </div>
      </div>

      {/* Income Breakdowns - Visual Cards Instead of Table */}
      <div className="mb-8">
        <h3 className="text-lg md:text-xl font-medium text-primary-dark mb-4 flex items-center">
          <i className="pi pi-dollar text-primary-dark/70 mr-2"></i>
          Desglose de ingresos
        </h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
          <div className="bg-white rounded-xl p-4 shadow-sm border-l-4 border-primary-light">
            <div className="flex items-center mb-2">
              <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-primary-light/20 flex items-center justify-center mr-2 md:mr-3">
                <i className="pi pi-briefcase text-sm md:text-base text-primary-dark"></i>
              </div>
              <span className="text-base md:text-lg text-neutral-dark">Por Servicio</span>
            </div>
            <div className="flex justify-between mt-2">
              <div>
                <p className="text-xs text-neutral-dark/60">Mínimo</p>
                <p className="text-base md:text-lg font-medium text-primary-dark">{formatCurrency(calculatedIncome.perService.min)}</p>
              </div>
              <div>
                <p className="text-xs text-neutral-dark/60">Máximo</p>
                <p className="text-base md:text-lg font-medium text-primary-dark">{formatCurrency(calculatedIncome.perService.max)}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-4 shadow-sm border-l-4 border-primary-light/70">
            <div className="flex items-center mb-2">
              <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-primary-light/20 flex items-center justify-center mr-2 md:mr-3">
                <i className="pi pi-calendar text-sm md:text-base text-primary-dark"></i>
              </div>
              <span className="text-base md:text-lg text-neutral-dark">Semanal</span>
            </div>
            <div className="flex justify-between mt-2">
              <div>
                <p className="text-xs text-neutral-dark/60">Mínimo</p>
                <p className="text-base md:text-lg font-medium text-primary-dark">{formatCurrency(calculatedIncome.weekly.min)}</p>
              </div>
              <div>
                <p className="text-xs text-neutral-dark/60">Máximo</p>
                <p className="text-base md:text-lg font-medium text-primary-dark">{formatCurrency(calculatedIncome.weekly.max)}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-primary-dark/5 rounded-xl p-4 shadow-md border-l-4 border-primary-dark sm:col-span-2 md:col-span-1">
            <div className="flex items-center mb-2">
              <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-primary-dark/20 flex items-center justify-center mr-2 md:mr-3">
                <i className="pi pi-money-bill text-sm md:text-base text-primary-dark"></i>
              </div>
              <span className="text-base md:text-lg font-medium text-primary-dark">Mensual</span>
            </div>
            <div className="flex justify-between mt-2">
              <div>
                <p className="text-xs text-neutral-dark/60">Mínimo</p>
                <p className="text-base md:text-lg font-medium text-primary-dark">{formatCurrency(calculatedIncome.monthly.min)}</p>
              </div>
              <div>
                <p className="text-xs text-neutral-dark/60">Máximo</p>
                <p className="text-base md:text-lg font-medium text-primary-dark">{formatCurrency(calculatedIncome.monthly.max)}</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-3 text-sm text-neutral-dark/70 flex items-center">
          <i className="pi pi-info-circle mr-2 text-primary-dark/50"></i>
          <p>Estimaciones basadas en un servicio por semana</p>
        </div>
      </div>

      {/* Selected Skills - Visual Tags/Pills */}
      <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 md:p-6 mb-8 shadow-sm">
        <h3 className="text-lg md:text-xl font-medium text-primary-dark mb-3 flex items-center">
          <i className="pi pi-star text-yellow-500 mr-2"></i>
          Tus habilidades
        </h3>
        <div className="flex flex-wrap gap-2 md:gap-3">
          {selectedSkills.map((skill, index) => (
            <div key={index} className="flex items-center bg-gradient-to-r from-primary-light/40 to-primary-light/20 rounded-full py-1 px-3 shadow-sm transition-all hover:shadow-md hover:translate-y-[-2px]">
              <div className="w-5 h-5 md:w-6 md:h-6 rounded-full bg-white flex items-center justify-center mr-1 md:mr-2">
                <i className={`${getIconForSkill(skill)} text-xs text-primary-dark`}></i>
              </div>
              <span className="text-xs md:text-sm font-medium text-primary-dark">{skill}</span>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section - Para dashboard */}
      <div className="bg-gradient-to-r from-primary-dark to-primary-dark/80 rounded-xl p-4 md:p-6 mb-6 shadow-lg text-white">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="mb-4 md:mb-0 md:mr-8 flex items-start">
            <i className="pi pi-bolt text-2xl md:text-3xl text-yellow-300 mr-3 mt-1"></i>
            <div>
              <h3 className="text-xl md:text-2xl font-medium mb-1">
                Completa tu perfil
              </h3>
              <p className="text-sm text-white/80">
                Ve a tu dashboard para comenzar a ofrecer tus servicios
              </p>
            </div>
          </div>
          <Button
            label="Mi Perfil"
            icon="pi pi-th-large"
            onClick={onDashboard}
            className="w-full md:w-auto px-5 py-2 bg-white text-primary-dark font-medium hover:bg-white/90 rounded-full shadow-md transition-all hover:shadow-lg"
          />
        </div>
      </div>

      {/* Bottom Actions - Simplified */}
      <div className="flex justify-center mt-4">
        <Button
          label="Calcular de nuevo"
          icon="pi pi-refresh"
          onClick={onStartOver}
          className="px-4 py-2 text-sm bg-transparent text-primary-dark border border-primary-dark hover:bg-primary-light/10 rounded-full transition-all"
        />
      </div>
    </div>
  );
};

IncomeResults.propTypes = {
  calculatedIncome: PropTypes.object.isRequired,
  selectedSkills: PropTypes.array.isRequired,
  city: PropTypes.string.isRequired,
  currentUser: PropTypes.object,
  userExists: PropTypes.bool,
  onStartOver: PropTypes.func.isRequired,
  onDashboard: PropTypes.func.isRequired
};

export default IncomeResults;