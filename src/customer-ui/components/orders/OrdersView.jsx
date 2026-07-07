import React from "react";
import { Card, Badge, Button, EmptyState } from "../../../design-system/components";
import { Timeline } from "../../../design-system/data";
import { logCustomerUIDiagnostics } from "../../diagnostics/CustomerUIDiagnostics";

const statusVariant = { delivered: "success", shipped: "default", processing: "warning", cancelled: "error" };

export const OrderCard = ({ order }) => (
  <Card className="flex items-center justify-between">
    <div>
      <p className="font-medium">Order #{order.id}</p>
      <p className="text-sm text-gray-500">{order.date} · {order.items} item(s)</p>
    </div>
    <div className="text-right">
      <Badge variant={statusVariant[order.status] || "default"}>{order.status}</Badge>
      <p className="font-bold mt-1">${order.total}</p>
    </div>
  </Card>
);

export const OrdersList = ({ orders = [] }) => {
  logCustomerUIDiagnostics("component", { name: "OrdersList", count: orders.length });
  if (!orders.length) return <EmptyState title="No orders yet" description="Your order history will appear here." action={<Button>Start Shopping</Button>} />;
  return (
    <section aria-label="Orders" className="space-y-3">
      {orders.map((o) => <OrderCard key={o.id} order={o} />)}
    </section>
  );
};

export const OrderTimeline = ({ timeline = [] }) => (
  <Card aria-label="Order timeline">
    <h3 className="font-semibold mb-4">Order Timeline</h3>
    <Timeline events={timeline.map((t) => ({ id: t.id, title: t.status, time: t.date || "Pending" }))} />
  </Card>
);

export const TrackingPlaceholder = () => (
  <Card aria-label="Order tracking">
    <h3 className="font-semibold mb-2">Tracking</h3>
    <p className="text-sm text-gray-600">Tracking information will be available once the order ships.</p>
    <div className="mt-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg text-center text-gray-400">📦 Tracking map placeholder</div>
  </Card>
);

export const InvoicePlaceholder = () => (
  <Card aria-label="Invoice">
    <h3 className="font-semibold mb-2">Invoice</h3>
    <p className="text-sm text-gray-600 mb-3">Download your invoice (placeholder).</p>
    <Button variant="secondary" size="sm">Download Invoice PDF</Button>
  </Card>
);

export const OrderDetailsView = ({ order }) => {
  logCustomerUIDiagnostics("component", { name: "OrderDetailsView", orderId: order?.id });
  if (!order) return <EmptyState title="Order not found" />;
  return (
    <div className="space-y-6">
      <Card>
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-xl font-bold">Order #{order.id}</h2>
            <p className="text-sm text-gray-500">Placed on {order.date}</p>
          </div>
          <Badge variant={statusVariant[order.status]}>{order.status}</Badge>
        </div>
      </Card>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <OrderTimeline timeline={order.timeline} />
        <TrackingPlaceholder />
      </div>
      <Card aria-label="Order items">
        <h3 className="font-semibold mb-3">Items</h3>
        {order.items?.map((item, i) => (
          <div key={i} className="flex justify-between text-sm py-2 border-b last:border-0">
            <span>{item.name} × {item.quantity}</span>
            <span>${item.price}</span>
          </div>
        ))}
        <div className="flex justify-between font-bold mt-3"><span>Total</span><span>${order.total}</span></div>
      </Card>
      <Card aria-label="Shipping address">
        <h3 className="font-semibold mb-2">Shipping Address</h3>
        <p className="text-sm">{order.shippingAddress?.name}</p>
        <p className="text-sm text-gray-600">{order.shippingAddress?.line1}, {order.shippingAddress?.city} {order.shippingAddress?.postal}</p>
      </Card>
      <InvoicePlaceholder />
    </div>
  );
};

export default { OrdersList, OrderDetailsView, OrderTimeline, TrackingPlaceholder, InvoicePlaceholder };
