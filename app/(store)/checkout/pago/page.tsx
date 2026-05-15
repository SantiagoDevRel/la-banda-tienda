import { NequiScreen } from "@/components/storefront/NequiScreen";
import { getActivePaymentMethods } from "@/lib/queries";

// 06 · Pago — server component fetches active payment methods from DB.
export default async function NequiPage() {
  const paymentMethods = await getActivePaymentMethods();

  return <NequiScreen paymentMethods={paymentMethods} />;
}
