import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import { Card } from "primereact/card";
import { Skeleton } from "primereact/skeleton";
import { TabView, TabPanel } from "primereact/tabview";
import AppliedFavorCard from "./AppliedFavorCard";
import EmptyState from "./EmptyState";

const AppliedFavorsList = ({ appliedFavors, loading }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [pendingFavors, setPendingFavors] = useState([]);
  const [assignedFavors, setAssignedFavors] = useState([]);
  
  useEffect(() => {
    if (appliedFavors) {
      // Filter favors by status
      const pending = appliedFavors.filter(favor => 
        favor.Status === "Sin asignar" || !favor.Status || favor.Status === "En espera"
      );
      const assigned = appliedFavors.filter(favor => 
        favor.Status === "Asignado"
      );
      
      setPendingFavors(pending);
      setAssignedFavors(assigned);
    }
  }, [appliedFavors]);

  const renderSkeleton = () => {
    return Array(3).fill().map((_, i) => (
      <div key={i} className="mb-3">
        <Skeleton height="12rem" className="mb-2" />
      </div>
    ));
  };

  const renderEmptyState = () => {
    return (
      <EmptyState
        icon="pi-inbox"
        title="No hay postulaciones"
        message="Aún no te has postulado a ningún favor. ¡Explora los favores disponibles y postúlate!"
      />
    );
  };

  return (
    <Card
      className="border-0 shadow-sm"
      title={
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold text-neutral-dark">
            Mis Postulaciones
          </h2>
          <span className="text-sm text-neutral-dark/70">
            {appliedFavors?.length || 0} favor{appliedFavors?.length !== 1 ? 'es' : ''}
          </span>
        </div>
      }
    >
      {loading ? (
        renderSkeleton()
      ) : (
        appliedFavors && appliedFavors.length > 0 ? (
          <TabView activeIndex={activeIndex} onTabChange={(e) => setActiveIndex(e.index)}>
            <TabPanel header={`Pendientes (${pendingFavors.length})`}>
              {pendingFavors.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-3">
                  {pendingFavors.map((favor) => (
                    <AppliedFavorCard key={favor.ID} favor={favor} />
                  ))}
                </div>
              ) : (
                <div className="pt-3">
                  <EmptyState
                    icon="pi-clock"
                    title="No hay postulaciones pendientes"
                    message="No tienes postulaciones pendientes de respuesta."
                  />
                </div>
              )}
            </TabPanel>
            
            <TabPanel header={`Asignados (${assignedFavors.length})`}>
              {assignedFavors.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-3">
                  {assignedFavors.map((favor) => (
                    <AppliedFavorCard key={favor.ID} favor={favor} />
                  ))}
                </div>
              ) : (
                <div className="pt-3">
                  <EmptyState
                    icon="pi-check-circle"
                    title="No hay favores asignados"
                    message="Aún no tienes favores asignados. ¡Sigue postulándote a nuevos favores!"
                  />
                </div>
              )}
            </TabPanel>
          </TabView>
        ) : (
          renderEmptyState()
        )
      )}
    </Card>
  );
};

AppliedFavorsList.propTypes = {
  appliedFavors: PropTypes.array,
  loading: PropTypes.bool
};

export default AppliedFavorsList;