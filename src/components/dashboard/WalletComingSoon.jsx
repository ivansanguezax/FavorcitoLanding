import { Card } from "primereact/card";

const WalletComingSoon = () => {
  return (
    <Card className="border-0 overflow-hidden">
      <div className="relative">
        {/* Fondo decorativo */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary-light/20 rounded-full -mr-10 -mt-10"></div>
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-primary-light/10 rounded-full -ml-16 -mb-16"></div>
        
        <div className="flex flex-col items-center py-10 px-6 text-center relative z-10">
          {/* Icono principal */}
          <div className="mb-8 bg-gradient-to-br from-primary-light/30 to-primary-dark/20 p-7 rounded-full shadow-inner">
            <i className="pi pi-wallet text-5xl text-primary-dark"></i>
          </div>

          {/* Etiqueta "Próximamente" */}
          <div className="absolute right-10 top-8 bg-yellow-400 px-3 py-1 rounded-lg transform rotate-12 shadow-sm">
            <span className="text-sm font-bold text-yellow-900">¡Muy pronto!</span>
          </div>

          <h2 className="text-2xl font-bold text-primary-dark mb-3">
            Tu Wallet
          </h2>

          <p className="text-neutral-dark/80 max-w-md">
            ¡Pronto podrás administrar tus ingresos por favores realizados!
          </p>

        
        </div>
      </div>
    </Card>
  );
};

export default WalletComingSoon;