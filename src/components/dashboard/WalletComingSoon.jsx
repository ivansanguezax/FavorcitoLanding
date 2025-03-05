import { Card } from "primereact/card";

const WalletComingSoon = () => {
  return (
    <Card className="border-0 shadow-sm opacity-70">
      <div className="flex flex-col items-center py-8 text-center">
        <div className="mb-6 bg-slate-100 p-6 rounded-full">
          <i className="pi pi-wallet text-4xl text-primary-dark opacity-70"></i>
        </div>

        <h2 className="text-2xl font-bold text-neutral-dark mb-2">
          Billetera Digital
        </h2>

        <p className="text-neutral-gray mb-6 max-w-md">
          Pronto podrás gestionar tus ingresos, realizar seguimiento de tus
          ganancias y mucho más.
        </p>

        {/* Secciones de wallet simuladas */}
        <div className="w-full max-w-md space-y-4">
          <div className="bg-slate-100 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-neutral-dark mb-2">
              Balance Total
            </h3>
            <div className="flex justify-between items-center">
              <span className="text-neutral-gray">Disponible</span>
              <span className="text-2xl font-bold text-primary-dark">
                $0.00
              </span>
            </div>
          </div>
        </div>

        <div className="mt-8 px-6 py-3 rounded-lg bg-primary-dark bg-opacity-10 text-primary-dark">
          <i className="pi pi-info-circle mr-2"></i>
          <span>Esta función estará disponible próximamente</span>
        </div>
      </div>
    </Card>
  );
};

export default WalletComingSoon;
