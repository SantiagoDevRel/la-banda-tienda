// Admin orders list — ScreenOrders
import { AdminShell } from "@/components/AdminShell";
import { Icon } from "@/components/icons";
import { OrdersTable } from "@/components/admin/OrdersTable";

export default function OrdenesPage() {
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
      <OrdersTable />
    </AdminShell>
  );
}
