import { useState, useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Menu } from "primereact/menu";
import { Toast } from "primereact/toast";
import Loader from "../components/Main/Loader";
import { Paginator } from "primereact/paginator";
import studentsService from "../services/studentsService";
import favoresService from "../services/favoresService";
import AppliedFavorCard from "../components/dashboard/AppliedFavorCard";

import axios from "axios";
import { Mixpanel } from "../services/mixpanel";

import ProfileCard from "../components/dashboard/ProfileCard";
import FavorCard from "../components/dashboard/FavorCard";
import FavorDetailDialog from "../components/dashboard/FavorDetailDialog";
import AppliedFavorsList from "../components/dashboard/AppliedFavorsList";
import EmptyState from "../components/dashboard/EmptyState";
import MobileNavbar from "../components/dashboard/MobileNavbar";
import WalletComingSoon from "../components/dashboard/WalletComingSoon";
import PendingProfileState from "../components/dashboard/PendingProfileState";
import VerificationPendingState from "../components/dashboard/VerificationPendingState";

const DashboardLayout = () => {
  const { currentUser, signOut } = useAuth();
  const [studentData, setStudentData] = useState(null);
  const [favores, setFavores] = useState([]);
  const [filteredFavores, setFilteredFavores] = useState([]);
  const [appliedFavores, setAppliedFavores] = useState([]);
  const [loadingAppliedFavores, setLoadingAppliedFavores] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedFavor, setSelectedFavor] = useState(null);
  const [favorDetailVisible, setFavorDetailVisible] = useState(false);
  const [activeTab, setActiveTab] = useState("home");
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [showProfile, setShowProfile] = useState(false);
  const [showAppliedFavors, setShowAppliedFavors] = useState(false);

  const [first, setFirst] = useState(0);
  const [rows, setRows] = useState(6);
  const [totalRecords, setTotalRecords] = useState(0);

  const menuRef = useRef(null);
  const toast = useRef(null);

  const isCalculatorUser = () => {
    if (!studentData) return false;
    
    return (
      studentData.province === "Calculadora" &&
      studentData.address === "Calculadora" &&
      studentData.university === "Calculadora"
    );
  };

  // Nueva función para verificar si el usuario está pendiente de verificación
  const isPendingVerification = () => {
    return studentData && studentData.verified === false;
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const userMenuItems = [
    {
      label: "Mi Perfil",
      icon: "pi pi-user",
      command: () => {
        if (isMobile) {
          setActiveTab("profile");
          setShowAppliedFavors(false);
        } else {
          setShowProfile(true);
          setShowAppliedFavors(false);
        }
      },
    },
    {
      label: "Mis Postulaciones",
      icon: "pi pi-list",
      command: () => {
        if (isMobile) {
          setActiveTab("home");
          setShowAppliedFavors(true);
        } else {
          setShowProfile(false);
          setShowAppliedFavors(true);
        }
      },
    },
    {
      separator: true,
    },
    {
      label: "Cerrar sesión",
      icon: "pi pi-sign-out",
      command: handleSignOut,
    },
  ];

  // Fetch student applied favors
  const fetchAppliedFavors = async () => {
    if (!studentData || !studentData.favoresAplicados || studentData.favoresAplicados.length === 0) {
      setAppliedFavores([]);
      return;
    }
    
    try {
      setLoadingAppliedFavores(true);
      const appliedFavorIds = studentData.favoresAplicados;
      const appliedFavorsList = await favoresService.getAppliedFavores(appliedFavorIds);
      setAppliedFavores(appliedFavorsList);
      
      Mixpanel.track("Applied_Favors_Loaded", {
        user_email: currentUser.email,
        applied_favors_count: appliedFavorsList.length
      });
    } catch (error) {
      console.error("Error fetching applied favors:", error);
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "No se pudieron cargar tus postulaciones",
        life: 3000,
      });
    } finally {
      setLoadingAppliedFavores(false);
    }
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!currentUser?.email) return;

      try {
        setLoading(true);
        setError(null);

        Mixpanel.track("Dashboard_Load", {
          user_email: currentUser.email,
        });

        const studentInfo = await studentsService.getStudentInfo(
          currentUser.email
        );
        setStudentData(studentInfo);

        const favoresDisponibles = await favoresService.getAllFavores();
        
        // Filtrar favores solo de la ciudad del estudiante
        const favoresDeCiudad = favoresDisponibles.filter(
          favor => favor.Ciudad === studentInfo.city
        );
        
        setFavores(favoresDisponibles); // Mantenemos todos por si acaso
        setFilteredFavores(favoresDeCiudad); // Solo mostramos los de su ciudad
        setTotalRecords(favoresDeCiudad.length);
        
        Mixpanel.track("Filtered_Favors_Loaded", {
          user_city: studentInfo.city,
          available_favors: favoresDeCiudad.length,
          total_favors: favoresDisponibles.length
        });
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        setError(error.message);

        Mixpanel.track("Dashboard_Error", {
          user_email: currentUser.email,
          error_message: error.message,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [currentUser]);

  // Load applied favors when student data is available
  useEffect(() => {
    if (studentData) {
      fetchAppliedFavors();
    }
  }, [studentData]);

  // Función para cerrar sesión
  async function handleSignOut() {
    try {
      Mixpanel.track("User_Signout");
      await signOut();
    } catch (error) {
      console.error("Error signing out:", error);
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "No se pudo cerrar la sesión. Por favor intenta de nuevo.",
        life: 3000,
      });
    }
  }

  const handleViewFavorDetails = async (favorId) => {
    try {
      const favor = favores.find((f) => f.ID === favorId);

      if (favor) {
        setSelectedFavor(favor);
        setFavorDetailVisible(true);

        Mixpanel.track("Favor_Details_View", {
          favor_id: favorId,
          favor_type: favor["Tipo de favor"],
        });
      }
    } catch (error) {
      console.error("Error loading favor details:", error);
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "No se pudieron cargar los detalles del favor.",
        life: 3000,
      });
    }
  };

  const handleApplySuccess = async (favorId) => {
    // Update student data to include the new applied favor
    try {
      const updatedStudentInfo = await studentsService.getStudentInfo(currentUser.email);
      setStudentData(updatedStudentInfo);
      
      // Refresh applied favors list
      await fetchAppliedFavors();
      
      toast.current.show({
        severity: "success",
        summary: "¡Éxito!",
        detail: "Tu postulación ha sido registrada correctamente",
        life: 3000,
      });
    } catch (error) {
      console.error("Error updating student data after applying:", error);
    }
  };
  
  // Método alternativo para postular directamente si la API falla
  const handleDirectApply = async (studentId, favorId) => {
    try {
      console.log("Intentando postulación directa:", { studentId, favorId });
      
      // Usar una petición directa sin pasar por el servicio
      const API_URL = import.meta.env.VITE_API_URL;
      
      // Usar el endpoint correcto
      const endpoint = `${API_URL}/students/applyToFavor`;
      console.log(`Intentando con endpoint correcto: ${endpoint}`);
      
      let response;
      let succeeded = false;
      let successfulEndpoint = '';
      
      try {
        response = await axios.post(endpoint, {
          idStudent: studentId,
          idFavor: favorId
        });
        
        if (response.data && response.status === 200) {
          succeeded = true;
          successfulEndpoint = endpoint;
          console.log(`Éxito con endpoint: ${endpoint}`, response.data);
        }
      } catch (err) {
        console.log(`Falló el endpoint principal ${endpoint}:`, err.message);
        // Si falla, intentar con endpoints alternativos como último recurso
        
        const fallbackEndpoints = [
          `${API_URL}/students/apply`,
          `${API_URL}/favores/apply`,
          `${API_URL}/favores/postular`
        ];
        
        for (const backupEndpoint of fallbackEndpoints) {
          try {
            console.log(`Intentando con endpoint alternativo: ${backupEndpoint}`);
            response = await axios.post(backupEndpoint, {
              idStudent: studentId,
              idFavor: favorId
            });
            
            if (response.data && response.status === 200) {
              succeeded = true;
              successfulEndpoint = backupEndpoint;
              console.log(`Éxito con endpoint alternativo: ${backupEndpoint}`, response.data);
              break;
            }
          } catch (fallbackErr) {
            console.log(`Falló endpoint alternativo ${backupEndpoint}:`, fallbackErr.message);
          }
        }
      }
      
      if (succeeded) {
        toast.current.show({
          severity: "success",
          summary: "¡Éxito!",
          detail: `Tu postulación ha sido registrada correctamente usando ${successfulEndpoint}`,
          life: 5000,
        });
        
        // Actualizar datos del estudiante
        const updatedStudentInfo = await studentsService.getStudentInfo(currentUser.email);
        setStudentData(updatedStudentInfo);
        await fetchAppliedFavors();
        
        return true;
      } else {
        toast.current.show({
          severity: "error",
          summary: "Error",
          detail: "No se pudo completar la postulación con ninguna ruta API conocida. Por favor, contacta al administrador.",
          life: 5000,
        });
        return false;
      }
    } catch (error) {
      console.error("Error en postulación directa:", error);
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Error al intentar postular. Consulta la consola para más detalles.",
        life: 3000,
      });
      return false;
    }
  };

  const handleRefresh = () => {
    if (currentUser?.email) {
      setLoading(true);
      
      // Primero obtenemos la información actualizada del estudiante
      studentsService.getStudentInfo(currentUser.email)
        .then((updatedStudentInfo) => {
          setStudentData(updatedStudentInfo);
          
          // Luego obtenemos los favores
          return favoresService.getAllFavores();
        })
        .then((data) => {
          // Filtramos los favores por ciudad
          const favoresDeCiudad = data.filter(
            favor => favor.Ciudad === studentData.city
          );
          
          setFavores(data);
          setFilteredFavores(favoresDeCiudad);
          setTotalRecords(favoresDeCiudad.length);
          
          // Actualizar favores aplicados
          fetchAppliedFavors();

          toast.current.show({
            severity: "success",
            summary: "Actualizado",
            detail: "Los datos se han actualizado correctamente",
            life: 3000,
          });
        })
        .catch((error) => {
          console.error("Error refreshing data:", error);
          toast.current.show({
            severity: "error",
            summary: "Error",
            detail: "No se pudieron actualizar los datos",
            life: 3000,
          });
        })
        .finally(() => setLoading(false));
    }
  };

  const onPageChange = (event) => {
    setFirst(event.first);
    setRows(event.rows);
  };

  const getPaginatedFavores = () => {
    return filteredFavores.slice(first, first + rows);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-primary-dark/5">
        <Loader />
        <p className="mt-4 text-neutral-dark">Cargando tu información...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-primary-dark/5 p-4">
        <div className="bg-white border border-red-200 rounded-lg p-6 max-w-md text-center shadow-sm">
          <i className="pi pi-exclamation-triangle text-3xl text-red-500 mb-4"></i>
          <h2 className="text-xl font-bold text-red-700 mb-2">
            Error al cargar datos
          </h2>
          <p className="text-red-600 mb-4">{error}</p>
          <Button
            label="Intentar nuevamente"
            icon="pi pi-refresh"
            className="bg-primary-dark text-white rounded-lg px-4 py-2 hover:bg-primary-dark/90"
            onClick={() => window.location.reload()}
          />
        </div>
      </div>
    );
  }

  const renderFavoresContent = () => {
    return (
      <Card
        className="border-0 shadow-sm"
        title={
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold text-neutral-dark">
              Favores Disponibles
            </h2>
          </div>
        }
      >
        {/* Lista de favores */}
        {filteredFavores.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {isMobile
                ? filteredFavores.map((favor) => (
                    <FavorCard
                      key={favor.ID}
                      favor={favor}
                      onViewDetails={handleViewFavorDetails}
                    />
                  ))
                : getPaginatedFavores().map((favor) => (
                    <FavorCard
                      key={favor.ID}
                      favor={favor}
                      onViewDetails={handleViewFavorDetails}
                    />
                  ))}
            </div>

            {!isMobile && totalRecords > rows && (
              <div className="mt-4">
                <Paginator
                  first={first}
                  rows={rows}
                  totalRecords={totalRecords}
                  onPageChange={onPageChange}
                  template="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink"
                  className="p-0"
                />
              </div>
            )}
          </>
        ) : (
          <EmptyState
            icon="pi-inbox"
            title="No hay favores disponibles"
            message="En este momento no hay favores disponibles para tomar. ¡Vuelve más tarde!"
          />
        )}
      </Card>
    );
  };

  // Renderizar contenido según la pestaña activa (para móvil)
  const renderActiveTabContent = () => {
    switch (activeTab) {
      case "home":
        return (
          <div className="space-y-6">
            {isMobile && showAppliedFavors ? (
              <AppliedFavorsList 
                appliedFavors={appliedFavores} 
                loading={loadingAppliedFavores} 
              />
            ) : (
              renderFavoresContent()
            )}
          </div>
        );
      case "wallet":
        return <WalletComingSoon />;
      case "profile":
        return (
          <div className="p-2">
            <ProfileCard student={studentData} currentUser={currentUser} />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-primary-dark pb-16 md:pb-0">
      <Toast ref={toast} />

      {/* Header */}
      <header className="bg-white shadow-md sticky top-0 z-20">
        <div className="container mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          {/* Logo - Responsive con diferentes tamaños */}
          <div className="flex items-center">
            <img
              src="https://res.cloudinary.com/dfgjenml4/image/upload/v1737657583/logoDark_uvqsz9.png"
              alt="Favorcito Logo"
              className="h-7 sm:h-8 md:h-9 object-contain transition-all duration-200"
            />
          </div>

          {/* User info and actions - Improved design */}
          <div className="flex items-center gap-3">
            <div
              className="flex items-center gap-2 cursor-pointer hover:bg-neutral-light/80 p-2 rounded-lg transition-all duration-200 border border-transparent hover:border-neutral-gray/10"
              onClick={(e) => menuRef.current.toggle(e)}
            >
              <div className="relative">
                {currentUser?.photoURL ? (
                  <img
                    src={
                      currentUser?.photoURL ||
                      "https://res.cloudinary.com/dfgjenml4/image/upload/v1739926023/Mask_group_rvnwra.png"
                    }
                    alt="Perfil de estudiante"
                    className="w-10 h-10 object-cover rounded-full border-2 border-white shadow-md"
                    onError={(e) => {
                      e.target.src =
                        "https://res.cloudinary.com/dfgjenml4/image/upload/v1739926023/Mask_group_rvnwra.png";
                    }}
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-primary-dark/10 flex items-center justify-center">
                    <i className="pi pi-user text-primary-dark"></i>
                  </div>
                )}
              </div>
              <span className="text-neutral-dark font-medium hidden md:inline-block">
                {currentUser?.displayName || "Usuario"}
              </span>
              <i className="pi pi-chevron-down text-neutral-dark/70 text-sm"></i>
            </div>
            <Menu
              model={userMenuItems}
              popup
              ref={menuRef}
              className="shadow-lg rounded-lg"
            />
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="container mx-auto px-4 py-6">
        {/* Layout para escritorio */}
        <div className="hidden md:block">
          {/* Saludo al usuario */}
          <div className="bg-white rounded-xl shadow-sm p-5 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-primary-dark mb-1">
                  ¡Hola,{" "}
                  {currentUser?.displayName?.split(" ")[0] ||
                    studentData?.name?.split(" ")[0] ||
                    "Usuario"}
                  !
                </h2>
                <p className="text-neutral-dark/80">
                  {showProfile 
                    ? "Información de tu perfil" 
                    : showAppliedFavors 
                      ? "Tus postulaciones a favores"
                      : "Descubre nuevos favores disponibles para ti"}
                </p>
              </div>

              {!showProfile && !showAppliedFavors && !isCalculatorUser() && !isPendingVerification() && (
                <Button
                  label="Actualizar favores"
                  icon="pi pi-refresh"
                  className="bg-primary-dark text-white rounded-lg px-4 py-2 hover:bg-primary-dark/90 flex items-center"
                  onClick={handleRefresh}
                  disabled={loading}
                />
              )}

              {!isCalculatorUser() && !isPendingVerification() && (
                <div className="flex gap-2">
                  {!showAppliedFavors && (
                    <Button
                      label="Mis postulaciones"
                      icon="pi pi-list"
                      className="bg-neutral-light text-primary-dark border border-primary-dark/10 rounded-lg px-4 py-2 hover:bg-neutral-light/80 flex items-center"
                      onClick={() => {
                        setShowAppliedFavors(true);
                        setShowProfile(false);
                      }}
                    />
                  )}
                  
                  {!showProfile && (
                    <Button
                      label="Ver perfil"
                      icon="pi pi-user"
                      className="bg-neutral-light text-primary-dark border border-primary-dark/10 rounded-lg px-4 py-2 hover:bg-neutral-light/80 flex items-center"
                      onClick={() => {
                        setShowProfile(true);
                        setShowAppliedFavors(false);
                      }}
                    />
                  )}
                  
                  {(showProfile || showAppliedFavors) && (
                    <Button
                      label="Ver favores"
                      icon="pi pi-search"
                      className="bg-primary-dark text-white rounded-lg px-4 py-2 hover:bg-primary-dark/90 flex items-center"
                      onClick={() => {
                        setShowProfile(false);
                        setShowAppliedFavors(false);
                      }}
                    />
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Contenido principal con toggle entre perfil, favores y postulaciones */}
          <div className="transition-all duration-300">
            {isCalculatorUser() ? (
              <PendingProfileState 
                studentData={studentData} 
                onRefresh={handleRefresh} 
              />
            ) : isPendingVerification() ? (
              <VerificationPendingState 
                studentData={studentData} 
                onRefresh={handleRefresh} 
              />
            ) : (
              showProfile ? (
                <div className="w-full max-w-xl mx-auto">
                  <ProfileCard student={studentData} currentUser={currentUser} />
                </div>
              ) : showAppliedFavors ? (
                <AppliedFavorsList 
                  appliedFavors={appliedFavores} 
                  loading={loadingAppliedFavores} 
                />
              ) : (
                renderActiveTabContent()
              )
            )}
          </div>
        </div>

        {/* Layout para móvil */}
        <div className="md:hidden">
          {isCalculatorUser() ? (
            <PendingProfileState 
              studentData={studentData} 
              onRefresh={handleRefresh} 
            />
          ) : isPendingVerification() ? (
            <VerificationPendingState 
              studentData={studentData} 
              onRefresh={handleRefresh} 
            />
          ) : (
            <>
              {activeTab === "home" && (
                <div className="space-y-2">
                  {/* Espacio para compensar la cabecera fija */}
                  <div className="h-5"></div>

                  {/* Mensaje motivacional */}
                  <div className="px-4">
                    <h2 className="text-xl font-bold text-white leading-tight">
                      {showAppliedFavors 
                        ? "Tus postulaciones" 
                        : "¡Encuentra tu siguiente favorcito!"}
                    </h2>
                  </div>

                  {/* Título de los favores */}
                  <div className="rounded-t-xl pt-4 pb-5 px-4 shadow-sm">
                    <div className="flex justify-between items-center">
                      <h3 className="font-light text-white">
                        {showAppliedFavors ? "Mis Postulaciones" : "Favorcitos"}
                      </h3>
                      <div className="flex gap-2">
                        {showAppliedFavors ? (
                          <Button
                            icon="pi pi-search"
                            className="p-button-rounded p-button-text text-white"
                            onClick={() => setShowAppliedFavors(false)}
                            tooltip="Ver favores disponibles"
                            tooltipOptions={{ position: 'bottom' }}
                          />
                        ) : (
                          <>
                            <span className="text-primary-light text-sm font-light">
                              {filteredFavores.length} disponibles
                            </span>
                            <Button
                              icon="pi pi-list"
                              className="p-button-rounded p-button-text text-white"
                              onClick={() => setShowAppliedFavors(true)}
                              tooltip="Ver mis postulaciones"
                              tooltipOptions={{ position: 'bottom' }}
                            />
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Lista de favores o postulaciones según estado */}
                  <div className="px-4 pb-20 shadow-sm">
                    {showAppliedFavors ? (
                      // Mostrar postulaciones en móvil
                      appliedFavores && appliedFavores.length > 0 ? (
                        <div className="space-y-4">
                          {appliedFavores.map((favor) => (
                            <AppliedFavorCard key={favor.ID} favor={favor} />
                          ))}
                        </div>
                      ) : (
                        <EmptyState
                          icon="pi-inbox"
                          title="No hay postulaciones"
                          message="Aún no te has postulado a ningún favor. ¡Explora los favores disponibles y postúlate!"
                        />
                      )
                    ) : (
                      // Mostrar favores disponibles
                      filteredFavores.length > 0 ? (
                        <div className="space-y-4">
                          {filteredFavores.map((favor) => (
                            <FavorCard
                              key={favor.ID}
                              favor={favor}
                              onViewDetails={handleViewFavorDetails}
                            />
                          ))}
                        </div>
                      ) : (
                        <EmptyState
                          icon="pi-inbox"
                          title="No hay favores disponibles"
                          message="En este momento no hay favores disponibles para tomar. ¡Vuelve más tarde!"
                        />
                      )
                    )}
                  </div>
                </div>
              )}
              {activeTab !== "home" && renderActiveTabContent()}
            </>
          )}
        </div>
      </main>

      {/* Barra de navegación móvil */}
      <MobileNavbar activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Diálogo de detalles del favor */}
      <FavorDetailDialog
        visible={favorDetailVisible}
        favor={selectedFavor}
        onHide={() => setFavorDetailVisible(false)}
        studentId={studentData?.id}
        onApplySuccess={handleApplySuccess}
        onDirectApply={handleDirectApply}
      />
    </div>
  );
};

export default DashboardLayout;