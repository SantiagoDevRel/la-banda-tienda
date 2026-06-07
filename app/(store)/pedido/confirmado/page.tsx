import { ConfirmScreen } from "@/components/storefront/ConfirmScreen";
import { getStoreSettings } from "@/lib/queries";

// 07 · Confirmación de pedido. Server component: trae los mensajes editables.
export default async function ConfirmPage() {
  const settings = await getStoreSettings();
  return <ConfirmScreen messages={settings.messages} />;
}
