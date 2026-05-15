// Admin settings — ScreenSettings
import { AdminShell } from "@/components/AdminShell";
import { getStoreSettings, getAllPaymentMethods } from "@/lib/queries";
import { SettingsForm } from "@/components/admin/SettingsForm";
import { PaymentMethodsManager } from "@/components/admin/PaymentMethodsManager";

export default async function AjustesPage() {
  const [settings, paymentMethods] = await Promise.all([
    getStoreSettings(),
    getAllPaymentMethods(),
  ]);

  return (
    <AdminShell
      section="settings"
      page={{
        title: "Ajustes de la tienda",
        subtitle: "Datos públicos, medios de pago y políticas de envío.",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 20,
          maxWidth: 840,
        }}
      >
        <SettingsForm settings={settings} />
        <PaymentMethodsManager initialMethods={paymentMethods} />
      </div>
    </AdminShell>
  );
}
