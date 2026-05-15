// Admin orders list — ScreenOrders
import { AdminShell } from "@/components/AdminShell";
import { Icon } from "@/components/icons";
import { OrdersTable } from "@/components/admin/OrdersTable";
import { getOrders } from "@/lib/queries";

export default async function OrdenesPage() {
  const orders = await getOrders();

  return (
    <AdminShell
      section="orders"
      page={{
        title: "Pedidos",
        subtitle: "Verificá pagos, gestioná envíos y cierre.",
        action: (
          <div style={{ display: "flex", gap: 10 }}>
            <button className="lds-btn lds-btn-secondary lds-btn-sm">
              <Icon name="upload" size={15} color="var(--ink-2)" />
              Exportar
            </button>
          </div>
        ),
      }}
    >
      <OrdersTable orders={orders} />
    </AdminShell>
  );
}
