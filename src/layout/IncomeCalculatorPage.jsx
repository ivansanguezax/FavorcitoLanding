import { useState, useEffect, useRef } from "react";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { Dropdown } from "primereact/dropdown";
import { ProgressBar } from "primereact/progressbar";
import { Tooltip } from "primereact/tooltip";
import { InputText } from "primereact/inputtext";
import { InputMask } from "primereact/inputmask";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Mixpanel } from "../services/mixpanel";
import { calculatorAuthService } from "../services/calculatorAuthService";
import SkillSelector from "../components/Calculator/SkillSelector";
import IncomeResults from "../components/Calculator/IncomeResults";
import LoginPrompt from "../components/Calculator/LoginPrompt";
import Loader from "../components/Main/Loader";
import priceFavors from "../utils/priceFavors.json";

const IncomeCalculatorPage = () => {
  const [step, setStep] = useState(1);
  const [city, setCity] = useState("");
  const [otherCity, setOtherCity] = useState("");
  const [showOtherCity, setShowOtherCity] = useState(false);
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [calculatedIncome, setCalculatedIncome] = useState(null);
  const [loginLoading, setLoginLoading] = useState(false);
  const [registrationLoading, setRegistrationLoading] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const { currentUser, userExists, loading, setCurrentUser, setUserExists } = useAuth();
  const navigate = useNavigate();
  const mainContentRef = useRef(null);
  const otherCityInputRef = useRef(null);
  const phoneInputRef = useRef(null);

  useEffect(() => {
    if (loginLoading || registrationLoading) {
      const preventNavigation = (e) => {
        e.preventDefault();
        e.returnValue = '';
        return '';
      };
      
      window.addEventListener('beforeunload', preventNavigation);
      return () => window.removeEventListener('beforeunload', preventNavigation);
    }
  }, [loginLoading, registrationLoading]);

  useEffect(() => {
    Mixpanel.track("Income_Calculator_View");
    
    if (currentUser && userExists && calculatedIncome) {
      setStep(3);
    }
  }, [currentUser, userExists, calculatedIncome]);

  // Efecto para hacer scroll al contenido principal cuando cambia el paso
  useEffect(() => {
    if (mainContentRef.current) {
      mainContentRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [step]);

  // Efecto para enfocar el input de otra ciudad cuando se muestra (solo en desktop)
  useEffect(() => {
    if (showOtherCity && otherCityInputRef.current) {
      // Solo enfocar en dispositivos no móviles
      if (window.innerWidth >= 768) {
        setTimeout(() => {
          otherCityInputRef.current.focus();
        }, 100);
      }
    }
  }, [showOtherCity]);

  const cities = [
    { label: "La Paz", value: "La Paz" },
    { label: "Cochabamba", value: "Cochabamba" },
    { label: "Sucre", value: "Sucre" },
    { label: "No encuentro mi ciudad", value: "other" }
  ];

  const calculatePotentialIncome = () => {
    if (selectedSkills.length === 0) return null;

    // Si seleccionó "otra ciudad", usamos La Paz como referencia pero guardamos su ciudad
    const calculationCity = showOtherCity ? "La Paz" : city;
    
    let totalMinIncome = 0;
    let totalMaxIncome = 0;
    
    selectedSkills.forEach(skill => {
      const skillData = priceFavors.favores.find(
        favor => favor.nombre === skill
      );
      
      if (skillData && skillData.precios[calculationCity]) {
        totalMinIncome += skillData.precios[calculationCity][0];
        totalMaxIncome += skillData.precios[calculationCity][1];
      }
    });

    const weeklyMin = totalMinIncome;
    const weeklyMax = totalMaxIncome;
    const monthlyMin = weeklyMin * 4;
    const monthlyMax = weeklyMax * 4;

    return {
      perService: {
        min: totalMinIncome,
        max: totalMaxIncome
      },
      weekly: {
        min: weeklyMin,
        max: weeklyMax
      },
      monthly: {
        min: monthlyMin,
        max: monthlyMax
      }
    };
  };

  const handleCityChange = (e) => {
    if (e.value === "other") {
      setShowOtherCity(true);
      setCity("La Paz"); // Usamos La Paz como base para el cálculo
    } else {
      setShowOtherCity(false);
      setCity(e.value);
    }
  };

  const handleCalculate = () => {
    if (selectedSkills.length === 0 || 
        (!showOtherCity && !city) || 
        (showOtherCity && !otherCity) ||
        !phoneNumber || phoneNumber === "+591-") {
      return;
    }

    const income = calculatePotentialIncome();
    setCalculatedIncome(income);
    
    Mixpanel.track("Income_Calculated", {
      city: showOtherCity ? otherCity : city,
      skills_count: selectedSkills.length,
      skills: selectedSkills,
      estimated_monthly_min: income.monthly.min,
      estimated_monthly_max: income.monthly.max
    });

    if (!currentUser) {
      setShowLoginPrompt(true);
    } else if (!userExists) {
      handleRegistration(currentUser);
    } else {
      setStep(3);
    }
  };

  const handleRegistration = async (user) => {
    try {
      setRegistrationLoading(true);
      
      const response = await calculatorAuthService.registerStudentDirectly(
        user,
        showOtherCity ? otherCity : city,
        selectedSkills,
        phoneNumber
      );
      
      if (response && response.success) {
        Mixpanel.track("Student_Registration_Success", {
          email: user.email,
          skills_count: selectedSkills.length,
          source: "income_calculator",
          phone: phoneNumber
        });
        
        setUserExists(true);
        setStep(3);
      } else {
        console.warn("Registration response not successful:", response);
        // Continuar de todos modos al paso 3
        setStep(3);
      }
    } catch (error) {
      console.error("Registration error:", error);
      Mixpanel.track("Student_Registration_Error", {
        error: error.message
      });
      // Continuar de todos modos al paso 3
      setStep(3);
    } finally {
      setRegistrationLoading(false);
    }
  };

  const handleLoginWithGoogle = async () => {
    try {
      setLoginLoading(true);
      setShowLoginPrompt(false);
      Mixpanel.track("Calculator_Login_Attempt");
  
      const result = await calculatorAuthService.signInWithGoogleForCalculator(
        showOtherCity ? otherCity : city,
        selectedSkills,
        phoneNumber
      );
  
      if (result && result.user) {
        // Actualizar estado del usuario
        setCurrentUser(result.user);
        setUserExists(!!result.exists);
        
        // Esperar a que los estados se actualicen
        setTimeout(() => {
          if (calculatedIncome) {
            setStep(3);
          }
        }, 300);
        
        // Registrar éxito
        Mixpanel.track("Calculator_Login_Success", {
          email: result.user.email || 'unknown',
          phone: phoneNumber
        });
      }
    } catch (error) {
      console.error("Login error:", error);
      Mixpanel.track("Calculator_Login_Error", {
        error: error.message || 'unknown error',
      });
    } finally {
      setLoginLoading(false);
    }
  };

  if (loading || loginLoading || registrationLoading) {
    return <Loader />;
  }

  const stepIcons = [
    { icon: "pi pi-list-check", label: "Habilidades" },
    { icon: "pi pi-map-marker", label: "Ciudad" },
    { icon: "pi pi-chart-bar", label: "Resultados" }
  ];

  return (
    <div className="min-h-screen bg-slate-200 flex flex-col">
      <header className="bg-primary-dark text-white py-3 shadow-md sticky top-0 z-50">
        <div className="container mx-auto px-4 flex justify-center md:justify-between items-center">
          {/* Logo centrado en móvil, alineado a la izquierda en desktop */}
          <div className="flex items-center">
            <img
              src="https://res.cloudinary.com/dfgjenml4/image/upload/v1737657600/logoLigth_gbv7ds.png"
              alt="Favorcito Logo"
              className="h-6 md:h-7 transition-transform hover:scale-105"
              onClick={() => navigate('/')}
              style={{ cursor: "pointer" }}
            />
          </div>
          
          {/* Usuario NO logueado - solo visible en desktop */}
          {!currentUser && step !== 3 && (
            <div className="hidden md:block">
              <Button
                label="Iniciar sesión"
                icon="pi pi-user"
                onClick={() => setShowLoginPrompt(true)}
                className="p-button-sm bg-white text-primary-dark font-semibold border-none rounded-full px-4 py-1.5 hover:bg-gray-50 transition-colors shadow-sm hover:shadow-md transform hover:-translate-y-0.5 duration-200"
              />
            </div>
          )}
          
          {/* Usuario logueado - visible solo en desktop */}
          {(currentUser || step === 3) && (
            <div className="hidden md:flex items-center gap-2 bg-primary-dark/40 rounded-full px-3 py-1 border border-white/10 backdrop-blur-sm">
              <img 
                src={(currentUser && currentUser.photoURL) || "https://res.cloudinary.com/dfgjenml4/image/upload/v1739926023/Mask_group_rvnwra.png"}
                alt="Profile" 
                className="w-6 h-6 rounded-full border border-white/20 object-cover"
                onError={(e) => {
                  e.target.src = "https://res.cloudinary.com/dfgjenml4/image/upload/v1739926023/Mask_group_rvnwra.png";
                }}
              />
              <div className="block">
                <p className="text-xs font-light truncate max-w-[150px]">
                  {currentUser?.displayName || "Mi perfil"}
                </p>
              </div>
              {userExists && (
                <Button
                  icon="pi pi-th-large"
                  tooltip="Ir a dashboard"
                  tooltipOptions={{ position: 'bottom' }}
                  onClick={() => navigate('/dashboard')}
                  className="p-button-rounded p-button-text p-button-sm text-white"
                  aria-label="Dashboard"
                />
              )}
            </div>
          )}
        </div>
      </header>

      <main ref={mainContentRef} className="flex-grow container mx-auto px-4 py-6 md:py-8">
        <div className="max-w-4xl mx-auto">
        <div className="text-center mb-6 md:mb-10">
  <h1 className="text-2xl md:text-4xl font-bold text-primary-dark mb-3 md:mb-4 relative inline-block">
    Descubre cuánto puedes ganar
    <span className="absolute -top-2 right-0 md:-right-8 bg-gradient-to-r from-yellow-400 to-yellow-300 text-primary-dark text-xs px-3 py-0.5 rounded-md transform rotate-3 shadow-sm animate-pulse">
      ¡Nuevo!
    </span>
  </h1>
  <p className="text-neutral-dark/70 max-w-2xl mx-auto text-base md:text-lg font-light">
    <span className="inline-block">✨</span> Calcula tu potencial de ingresos compartiendo tus habilidades <span className="inline-block">💰</span>
  </p>
  <div className="w-20 h-1 bg-primary-dark/20 mx-auto mt-4 rounded-full"></div>
</div>

          <div className="mb-6 max-w-xl mx-auto">
            <div className="flex items-center justify-between mb-2 px-2">
              {stepIcons.map((stepInfo, index) => (
                <div key={index} className="flex flex-col items-center">
                  <Tooltip target={`.step-icon-${index}`} content={stepInfo.label} position="top" />
                  <div 
                    className={`step-icon-${index} w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center mb-1 transition-all duration-300 ${
                      step > index + 1 
                        ? "bg-green-100 text-green-600 border-2 border-green-200" 
                        : step === index + 1 
                          ? "bg-primary-dark text-white shadow-md transform scale-110" 
                          : "bg-neutral-100 text-neutral-400 border border-neutral-200"
                    }`}
                  >
                    <i className={`${stepInfo.icon} text-lg md:text-xl ${step > index + 1 ? "pi-check" : ""}`}></i>
                  </div>
                  <span className="text-xs text-neutral-dark/70 hidden md:block">{stepInfo.label}</span>
                </div>
              ))}
            </div>
            <ProgressBar 
              value={(step - 1) * 50} 
              showValue={false} 
              className="h-1"
              style={{ 
                backgroundColor: '#E2E8F0',
                borderRadius: '9999px'
              }}
              pt={{
                value: { style: { backgroundColor: '#14344D', borderRadius: '9999px' } }
              }}
            />
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-neutral-gray/10 overflow-hidden mb-8 transition-all duration-300 hover:shadow-md">
            <div className="p-4 md:p-6">
              {step === 1 && (
                <div className="max-w-3xl mx-auto">
                  <div className="flex items-center mb-4">
                    <div className="w-10 h-10 rounded-full bg-primary-dark/10 flex items-center justify-center mr-3">
                      <i className="pi pi-list-check text-primary-dark"></i>
                    </div>
                    <h2 className="text-xl font-semibold text-primary-dark">¿Qué habilidades tienes para ofrecer?</h2>
                  </div>
                  <p className="text-neutral-dark/70 mb-6 pl-14">
                    Selecciona las habilidades con las que te gustaría generar ingresos
                  </p>
                  
                  <SkillSelector 
                    selectedSkills={selectedSkills} 
                    setSelectedSkills={setSelectedSkills} 
                  />
                  
                  <div className="flex flex-col md:flex-row justify-between items-center mt-8 gap-4">
                    <div className="text-sm text-neutral-dark/60 flex items-center w-full md:w-auto text-center md:text-left">
                      <i className="pi pi-info-circle mr-2"></i>
                      {selectedSkills.length === 0 
                        ? "Selecciona al menos una habilidad" 
                        : `Has seleccionado ${selectedSkills.length} ${selectedSkills.length === 1 ? 'habilidad' : 'habilidades'}`}
                    </div>
                    <Button
                      label="Siguiente"
                      icon="pi pi-arrow-right"
                      iconPos="right"
                      disabled={selectedSkills.length === 0}
                      onClick={() => setStep(2)}
                      className={`w-full md:w-auto px-6 py-2 rounded-lg transition-all duration-200 ${
                        selectedSkills.length === 0
                          ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                          : "bg-primary-dark text-white hover:bg-primary-dark/90 shadow-sm hover:shadow"
                      }`}
                    />
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="max-w-3xl mx-auto">
                  <div className="flex items-center mb-4">
                    <div className="w-10 h-10 rounded-full bg-primary-dark/10 flex items-center justify-center mr-3">
                      <i className="pi pi-map-marker text-primary-dark"></i>
                    </div>
                    <h2 className="text-xl font-semibold text-primary-dark">¿En qué ciudad te encuentras?</h2>
                  </div>
                  <p className="text-neutral-dark/70 mb-6 pl-14">
                    Las tarifas varían según la ciudad donde ofreces tus servicios
                  </p>
                  
                  <div className="max-w-md mx-auto bg-slate-50 p-4 md:p-6 rounded-lg border border-slate-100 shadow-sm">
                    <Dropdown
                      value={showOtherCity ? "other" : city}
                      options={cities}
                      onChange={handleCityChange}
                      placeholder="Selecciona tu ciudad"
                      className="w-full mb-4 p-inputtext-lg shadow-sm"
                      panelClassName="border border-slate-200"
                    />
                    
                    {showOtherCity && (
                      <div className="mb-4">
                        <div className="relative">
                          <InputText
                            ref={otherCityInputRef}
                            value={otherCity}
                            onChange={(e) => setOtherCity(e.target.value)}
                            placeholder="Ingresa tu ciudad"
                            className="w-full p-3 pl-10 border border-slate-200 rounded-lg"
                          />
                          <i className="pi pi-map-marker absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        </div>
                        <div className="mt-2 bg-yellow-50 p-3 rounded-lg border border-yellow-100">
                          <p className="text-sm text-neutral-dark flex items-start">
                            <i className="pi pi-info-circle text-yellow-600 mt-0.5 mr-2"></i>
                            <span>
                              ¡Pronto llegaremos a tu ciudad! Por ahora, te mostraremos un estimado basado en nuestros precios.
                            </span>
                          </p>
                        </div>
                      </div>
                    )}
                    
                    {/* Campo de teléfono */}
{/* Campo de teléfono */}
<div className="mb-4">
  <div className="relative">
    <InputMask
      id="phone"
      ref={phoneInputRef}
      value={phoneNumber}
      onChange={(e) => setPhoneNumber(e.value)}
      mask="99999999"
      placeholder="69696969"
      className="w-full p-3 pl-10 border border-slate-200 rounded-lg"
    />
    <i className="pi pi-phone absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
    <Tooltip target="#phone-info" position="top" />
    <i 
      id="phone-info" 
      className="pi pi-info-circle absolute right-3 top-1/2 transform -translate-y-1/2 text-primary-dark/60 cursor-help"
      data-pr-tooltip="¡Tira esos dígitos! 🤙 Prometo no mandarte memes random 😜"
    />
  </div>
  <p className="text-xs text-neutral-dark/60 mt-1 ml-2">
    Te avisaremos cuando alguien requiera tus habilidades pro 🚀💯
  </p>
</div>
                    
                    <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-6">
                      <div className="flex items-start">
                        <i className="pi pi-info-circle text-blue-500 mt-1 mr-3"></i>
                        <p className="text-sm text-neutral-dark">
                          Los precios mostrados son estimaciones basadas en lo que ganan otros estudiantes. 
                          Al registrarte, podrás personalizar tus propias tarifas.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex flex-col gap-3">
                      <Button
                        label="Calcular mis ingresos"
                        icon="pi pi-calculator"
                        iconPos="right"
                        disabled={!city || (showOtherCity && !otherCity) || !phoneNumber || phoneNumber === "+591-"}
                        onClick={handleCalculate}
                        className={`w-full px-6 py-2 rounded-lg ${
                          !city || (showOtherCity && !otherCity) || !phoneNumber || phoneNumber === "+591-"
                            ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                            : "bg-primary-dark text-white hover:bg-primary-dark/90 shadow-md hover:shadow-lg transition-all"
                        }`}
                      />
                      
                      <Button
                        label="Atrás"
                        icon="pi pi-arrow-left"
                        onClick={() => setStep(1)}
                        className="w-full px-6 py-2 text-primary-dark border border-primary-dark hover:bg-primary-light/10 rounded-lg"
                      />
                    </div>
                  </div>
                </div>
              )}

              {step === 3 && calculatedIncome && (
                <IncomeResults 
                  calculatedIncome={calculatedIncome}
                  selectedSkills={selectedSkills}
                  city={showOtherCity ? otherCity : city}
                  currentUser={currentUser}
                  userExists={userExists}
                  onStartOver={() => {
                    setStep(1);
                    setSelectedSkills([]);
                    setCity("");
                    setOtherCity("");
                    setShowOtherCity(false);
                    setCalculatedIncome(null);
                    setPhoneNumber("+591-");
                  }}
                  onRegister={handleLoginWithGoogle}
                  onDashboard={() => navigate("/dashboard")}
                />
              )}
            </div>
          </div>
        </div>
      </main>

      <Dialog
        visible={showLoginPrompt}
        onHide={() => setShowLoginPrompt(false)}
        header={(
          <div className="flex items-center">
            <i className="pi pi-lock text-primary-dark mr-2"></i>
            <span>¡Ya casi lo tienes!</span>
          </div>
        )}
        dismissableMask
        draggable={false}
        resizable={false}
        className="w-full max-w-md"
        footer={(
          <div className="flex justify-end">
            <Button
              label="Cancelar"
              icon="pi pi-times"
              onClick={() => setShowLoginPrompt(false)}
              className="p-button-text p-button-sm"
            />
          </div>
        )}
        pt={{
          root: { className: 'rounded-xl shadow-xl border border-neutral-gray/10' }
        }}
      >
        <LoginPrompt 
          onLogin={handleLoginWithGoogle}
          loading={loginLoading}
          calculatedIncome={calculatedIncome}
        />
      </Dialog>
    </div>
  );
};

export default IncomeCalculatorPage;