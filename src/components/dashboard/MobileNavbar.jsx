import PropTypes from "prop-types";

const MobileNavbar = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: "home", icon: "pi-home", label: "Inicio" },
    { id: "wallet", icon: "pi-wallet", label: "Billetera" },
    { id: "profile", icon: "pi-user", label: "Perfil" },
  ];

  return (
    <div className="fixed bottom-4 left-4 right-4 bg-white rounded-full shadow-lg md:hidden z-20">
      <div className="flex justify-around items-center py-1">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              className={`flex items-center justify-center py-2 ${
                isActive ? "w-auto px-4" : "w-12"
              }`}
              onClick={() => onTabChange(tab.id)}
            >
              {isActive ? (
                <div className="flex items-center bg-[#02533C] text-white px-4 py-2 rounded-full">
                  <i className={`pi ${tab.icon} text-lg mr-2`}></i>
                  <span className="text-sm font-medium">{tab.label}</span>
                </div>
              ) : (
                <div className="flex items-center justify-center w-12 h-12">
                  <i className={`pi ${tab.icon} text-gray-500 text-xl`}></i>
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

MobileNavbar.propTypes = {
  activeTab: PropTypes.string.isRequired,
  onTabChange: PropTypes.func.isRequired,
};

export default MobileNavbar;
