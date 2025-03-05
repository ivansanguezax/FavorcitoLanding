import PropTypes from "prop-types";

const ProfileCard = ({ student, currentUser }) => {
  const getName = () => {
    return student?.name || currentUser?.displayName || "Estudiante";
  };

  const getEmail = () => {
    return student?.mail || currentUser?.email || "No especificado";
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white rounded-xl shadow-sm border border-neutral-gray/10 overflow-hidden">
      {/* Profile header with clean design */}
      <div className="p-6 pb-5 border-b border-neutral-gray/10">
        <div className="flex items-center gap-4">
          {/* Avatar - Simple circular image with subtle shadow */}
          <div className="relative">
            <div className="w-16 h-16 rounded-full overflow-hidden shadow-sm">
              <img
                src={
                  currentUser?.photoURL ||
                  "https://res.cloudinary.com/dfgjenml4/image/upload/v1739926023/Mask_group_rvnwra.png"
                }
                alt="Perfil de estudiante"
                className="w-18 h-18 object-cover rounded-full border-2 border-white shadow-md"
                onError={(e) => {
                  e.target.src =
                    "https://res.cloudinary.com/dfgjenml4/image/upload/v1739926023/Mask_group_rvnwra.png";
                }}
              />
            </div>
          </div>

          {/* Name and basic details - Clean typography */}
          <div>
            <h3 className="text-lg font-semibold text-primary-dark">
              {getName()}
            </h3>

            <div className="flex items-center mt-1">
              <span className="text-sm text-neutral-dark">
                {student?.university || "Universidad"}
              </span>
            </div>

            <p className="text-sm text-neutral-dark/90 mt-1">
              {student?.degree || "Carrera no especificada"}
            </p>
          </div>
        </div>

        {/* Location - Simple inline display */}
        {student?.city && (
          <div className="mt-4 flex items-center">
            <i className="pi pi-map-marker text-primary-dark mr-2 text-sm"></i>
            <span className="text-sm text-neutral-dark">{student.city}</span>
          </div>
        )}
      </div>

      {/* Contact Information - Clean section */}
      <div className="p-6 border-b border-neutral-gray/10">
        <h4 className="flex items-center text-primary-dark font-medium mb-4">
          <i className="pi pi-user text-primary-dark mr-2 text-sm"></i>
          Información de Contacto
        </h4>

        <div className="space-y-3 pl-1">
          <div className="flex flex-col">
            <span className="text-xs text-neutral-dark/70 mb-1">Email</span>
            <span className="text-sm text-neutral-dark">{getEmail()}</span>
          </div>

          {student?.phone && (
            <div className="flex flex-col">
              <span className="text-xs text-neutral-dark/70 mb-1">
                Teléfono
              </span>
              <span className="text-sm text-neutral-dark">{student.phone}</span>
            </div>
          )}
        </div>
      </div>

      {/* Skills/Services - Modern subtle design */}
      <div className="p-6">
        <h4 className="flex items-center text-primary-dark font-medium mb-4">
          <i className="pi pi-briefcase text-primary-dark mr-2 text-sm"></i>
          Servicios
        </h4>

        {student?.skills && student.skills.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {student.skills.map((skill, index) => (
              <div
                key={index}
                className="px-3 py-1.5 text-xs rounded-md bg-primary-dark/5 text-primary-dark border border-primary-dark/10"
              >
                {skill}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-neutral-dark/80">
            No hay servicios registrados
          </p>
        )}
      </div>
    </div>
  );
};

ProfileCard.propTypes = {
  student: PropTypes.object,
  currentUser: PropTypes.object,
};

export default ProfileCard;
