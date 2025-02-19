import { useEffect, useState } from 'react';

export const Stepper = ({ activeIndex, onStepClick }) => {
  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const steps = [
    {
      label: width > 768 ? 'Habilidades' : '',
      icon: 'pi pi-star'
    },
    {
      label: width > 768 ? 'Información Académica' : '',
      icon: 'pi pi-book'
    },
    {
      label: width > 768 ? 'Información Personal' : '',
      icon: 'pi pi-user'
    },
    {
      label: width > 768 ? 'Verificación' : '',
      icon: 'pi pi-check'
    }
  ];

  const handleClick = (index) => {
    if (index < activeIndex) {
      onStepClick(index);
    }
  };

  return (
    <div className="w-full px-4 py-6">
      <div className="relative flex justify-between items-center">
        {/* Progress Line */}
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-0.5 bg-neutral-gray">
          <div 
            className="h-full bg-primary-dark transition-all duration-300"
            style={{ width: `${(activeIndex / (steps.length - 1)) * 100}%` }}
          />
        </div>

        {/* Steps */}
        {steps.map((step, index) => (
          <div 
            key={index}
            className="relative flex flex-col items-center"
            onClick={() => handleClick(index)}
          >
            {/* Step Circle */}
            <div 
              className={`
                w-10 h-10 rounded-full flex items-center justify-center 
                cursor-pointer transition-all duration-300 z-10
                ${index <= activeIndex 
                  ? 'bg-primary-dark text-white' 
                  : 'bg-white border-2 border-neutral-gray text-neutral-gray'}
                ${index < activeIndex && 'hover:opacity-80'}
              `}
            >
              <i className={`${step.icon} text-lg`} />
            </div>

            {/* Label */}
            {width > 768 && (
              <span 
                className={`
                  absolute -bottom-8 text-sm font-medium whitespace-nowrap
                  transition-colors duration-300
                  ${index <= activeIndex ? 'text-primary-dark' : 'text-neutral-gray'}
                `}
              >
                {step.label}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};