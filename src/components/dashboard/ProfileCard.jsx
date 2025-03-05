import PropTypes from "prop-types";

const ProfileCard = ({ student, currentUser }) => {
  const getName = () => {
    return student?.name || currentUser?.displayName || "Estudiante";
  };

  const getEmail = () => {
    return student?.mail || currentUser?.email || "No especificado";
  };

  // Obtener iniciales para el fallback del avatar
  const getInitials = () => {
    const name = getName();
    if (!name || name === "Estudiante") return "E";
    
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white rounded-xl overflow-hidden shadow-sm">
      {/* Encabezado con foto centrada */}
      <div className="pt-6 pb-4 flex flex-col items-center text-center">
        {/* Avatar centrado */}
        <div className="w-20 h-20 mb-3 rounded-full overflow-hidden border-2 border-white shadow-sm bg-primary-light/20">
          {currentUser?.photoURL ? (
            <img
              src={currentUser.photoURL}
              alt={`Foto de ${getName()}`}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.parentNode.innerHTML = `<div class="w-full h-full bg-primary-dark/20 flex items-center justify-center"><span class="text-xl font-bold text-primary-dark">${getInitials()}</span></div>`;
              }}
            />
          ) : (
            <div className="w-full h-full bg-primary-dark/20 flex items-center justify-center">
              <span className="text-xl font-bold text-primary-dark">{getInitials()}</span>
            </div>
          )}
        </div>

        {/* Información básica centrada */}
        <h3 className="text-lg font-semibold text-primary-dark">
          {getName()}
        </h3>

        {student?.university && (
          <p className="text-sm text-neutral-dark mt-1">
            {student.university}
          </p>
        )}

        {/* Ubicación */}
        {student?.city && (
          <div className="mt-2 inline-flex items-center text-sm text-neutral-dark/80">
            <i className="pi pi-map-marker text-primary-dark/70 mr-1 text-xs"></i>
            <span>
              {student.city}
              {student?.zona ? `, ${student.zona}` : ""}
            </span>
          </div>
        )}
        
        {/* Badge de verificación */}
        <div className="mt-2">
          <span className="inline-flex items-center bg-primary-dark/5 text-primary-dark text-xs px-2 py-1 rounded-full">
            <i className="pi pi-check-circle text-xs mr-1"></i>
            Perfil verificado
          </span>
        </div>
      </div>

      {/* Separador */}
      <div className="border-t border-neutral-gray/10"></div>

      {/* Información de contacto - Diseño simple */}
      <div className="p-4 sm:p-5">
        <h4 className="text-sm font-medium text-primary-dark mb-3 flex items-center">
          <i className="pi pi-user text-primary-dark/70 mr-2"></i>
          Información de Contacto
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="bg-neutral-light/30 p-3 rounded-lg">
            <span className="text-xs text-neutral-dark/70 block">Email</span>
            <span className="text-sm text-neutral-dark font-medium break-all">{getEmail()}</span>
          </div>

          {student?.phone && (
            <div className="bg-neutral-light/30 p-3 rounded-lg">
              <span className="text-xs text-neutral-dark/70 block">Teléfono</span>
              <span className="text-sm text-neutral-dark font-medium">{student.phone}</span>
            </div>
          )}
        </div>
      </div>

      {/* Servicios simplificados */}
      {student?.skills && student.skills.length > 0 && (
        <div className="p-4 sm:p-5 border-t border-neutral-gray/10">
          <h4 className="text-sm font-medium text-primary-dark mb-3 flex items-center">
            <i className="pi pi-briefcase text-primary-dark/70 mr-2"></i>
            Servicios Ofrecidos
          </h4>

          <div className="flex flex-wrap gap-2">
            {student.skills.slice(0, 6).map((skill, index) => (
              <div
                key={index}
                className="px-3 py-1 text-xs rounded-full bg-primary-light/10 text-primary-dark border border-primary-dark/10"
              >
                {skill}
              </div>
            ))}
            {student.skills.length > 6 && (
              <div className="px-3 py-1 text-xs rounded-full bg-neutral-light text-neutral-dark">
                +{student.skills.length - 6} más
              </div>
            )}
          </div>
        </div>
      )}

      {/* Días disponibles simplificados */}
      {student?.availability && Object.keys(student.availability).length > 0 && (
        <div className="p-4 sm:p-5 border-t border-neutral-gray/10">
          <h4 className="text-sm font-medium text-primary-dark mb-3 flex items-center">
            <i className="pi pi-calendar text-primary-dark/70 mr-2"></i>
            Disponibilidad
          </h4>

          <div className="flex flex-wrap gap-2">
            {Object.keys(student.availability).map((day) => (
              <div
                key={day}
                className="px-3 py-1 text-xs rounded-full bg-blue-50 text-blue-700"
              >
                {day}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

ProfileCard.propTypes = {
  student: PropTypes.object,
  currentUser: PropTypes.object,
};

export default ProfileCard;