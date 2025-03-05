import { motion } from "framer-motion";
import { MessageSquare, DollarSign, Users } from "lucide-react";

const StepByStep = () => {
  const steps = [
    {
      icon: <MessageSquare size={32} />,
      title: "Cuéntanos qué necesitas",
      description:
        "Describe tu favor con todos los detalles para que los estudiantes entiendan exactamente cómo ayudarte.",
      delay: 0.2,
    },
    {
      icon: <DollarSign size={32} />,
      title: "Define tu presupuesto",
      description:
        "Establece el monto que estás dispuesto a pagar. ¡Tú tienes el control de tu inversión!",
      delay: 0.4,
    },
    {
      icon: <Users size={32} />,
      title: "Conéctate con un universitario",
      description:
        "Encuentra al estudiante ideal para tu favor en minutos y comienza a recibir ayuda.",
      delay: 0.6,
    },
  ];

  return (
    <div className="w-full py-16 px-4 bg-neutral-light">
      <div className="max-w-7xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl md:text-4xl font-bold text-primary-dark text-center mb-4"
        >
          Pide tu{" "}
          <img
            src="https://res.cloudinary.com/dfgjenml4/image/upload/v1737657583/logoDark_uvqsz9.png"
            alt="Logo"
            className="inline h-8 md:h-10 align-baseline"
          />{" "}
          <br /> en segundos
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12 mb-12">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: step.delay }}
              className="flex flex-col items-center text-center"
            >
              <div className="relative mb-6">
                <div className="w-16 h-16 rounded-full bg-primary-dark flex items-center justify-center">
                  <div className="text-primary-light">{step.icon}</div>
                </div>
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-8 left-full w-full h-0.5 bg-neutral-gray -z-10" />
                )}
              </div>

              <h3 className="text-xl font-semibold text-primary-dark mb-3">
                {step.title}
              </h3>

              <p className="text-neutral-dark leading-relaxed">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StepByStep;
