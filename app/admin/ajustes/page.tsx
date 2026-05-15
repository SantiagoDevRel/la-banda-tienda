// Admin settings — ScreenSettings
import { AdminShell } from "@/components/AdminShell";
import { getStoreSettings } from "@/lib/queries";
import { SettingsForm } from "@/components/admin/SettingsForm";

export default async function AjustesPage() {
  const settings = await getStoreSettings();

  return (
    <AdminShell
      section="settings"
      page={{
        title: "Ajustes de la tienda",
        subtitle: "Datos públicos, cuenta para cobrar y políticas de envío.",
      }}
    >
      <SettingsForm settings={settings} />
    </AdminShell>
  );
}
