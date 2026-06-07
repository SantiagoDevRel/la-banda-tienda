import { NequiScreen } from "@/components/storefront/NequiScreen";
import { getActivePaymentMethods, getStoreSettings } from "@/lib/queries";

// 06 · Pago — server component fetches payment methods + editable messages.
export default async function NequiPage() {
  const [paymentMethods, settings] = await Promise.all([
    getActivePaymentMethods(),
    getStoreSettings(),
  ]);

  return (
    <NequiScreen paymentMethods={paymentMethods} messages={settings.messages} />
  );
}
