import { ConfirmScreen } from "@/components/storefront/ConfirmScreen";
import { getStoreSettings } from "@/lib/queries";

// 07 · Confirmación de pedido.
// Server component fetches WhatsApp from DB and passes it to the client screen.
export default async function ConfirmPage() {
  const settings = await getStoreSettings();

  return <ConfirmScreen whatsapp={settings.whatsapp} />;
}
