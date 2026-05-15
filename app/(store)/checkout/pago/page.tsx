import { NequiScreen } from "@/components/storefront/NequiScreen";
import { getStoreSettings } from "@/lib/queries";

// 06 · Pago con Nequi — server component fetches Nequi details from DB.
export default async function NequiPage() {
  const settings = await getStoreSettings();

  return (
    <NequiScreen
      nequiNumber={settings.nequiNumber}
      nequiHolder={settings.nequiHolder}
    />
  );
}
