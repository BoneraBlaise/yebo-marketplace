import React, { useState } from "react";
import { Card, Button, Input, Select, Badge } from "../../../design-system/components";
import { logCustomerUIDiagnostics } from "../../diagnostics/CustomerUIDiagnostics";

export const ShippingAddressForm = ({ addresses = [] }) => (
  <Card aria-label="Shipping address">
    <h3 className="font-semibold mb-4">Shipping Address</h3>
    {addresses.length > 0 && (
      <Select className="mb-4" aria-label="Select saved address">
        {addresses.map((a) => <option key={a.id} value={a.id}>{a.label} — {a.line1}, {a.city}</option>)}
      </Select>
    )}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      <Input placeholder="Full name" aria-label="Full name" />
      <Input placeholder="Phone" aria-label="Phone number" />
      <Input placeholder="Address line 1" className="md:col-span-2" aria-label="Address line 1" />
      <Input placeholder="City" aria-label="City" />
      <Input placeholder="Postal code" aria-label="Postal code" />
    </div>
  </Card>
);

export const DeliveryMethod = () => {
  const [method, setMethod] = useState("standard");
  return (
    <Card aria-label="Delivery method">
      <h3 className="font-semibold mb-4">Delivery Method</h3>
      <div className="space-y-2">
        {[{ id: "standard", label: "Standard (3-5 days)", price: "Free" }, { id: "express", label: "Express (1-2 days)", price: "$9.99" }].map((m) => (
          <label key={m.id} className="flex items-center justify-between p-3 border rounded-lg cursor-pointer">
            <span className="flex items-center gap-2">
              <input type="radio" name="delivery" value={m.id} checked={method === m.id} onChange={() => setMethod(m.id)} />
              {m.label}
            </span>
            <Badge>{m.price}</Badge>
          </label>
        ))}
      </div>
    </Card>
  );
};

export const PaymentMethod = () => {
  const [method, setMethod] = useState("card");
  return (
    <Card aria-label="Payment method">
      <h3 className="font-semibold mb-4">Payment Method</h3>
      <p className="text-xs text-gray-500 mb-3">No payment processing — UI placeholder only.</p>
      <div className="space-y-2">
        {[{ id: "card", label: "Credit / Debit Card" }, { id: "eft", label: "EFT / Bank Transfer" }, { id: "wallet", label: "Digital Wallet" }].map((m) => (
          <label key={m.id} className="flex items-center gap-2 p-3 border rounded-lg cursor-pointer">
            <input type="radio" name="payment" value={m.id} checked={method === m.id} onChange={() => setMethod(m.id)} />
            {m.label}
          </label>
        ))}
      </div>
      {method === "card" && (
        <div className="grid grid-cols-2 gap-3 mt-4">
          <Input placeholder="Card number" className="col-span-2" aria-label="Card number" />
          <Input placeholder="MM/YY" aria-label="Expiry date" />
          <Input placeholder="CVV" aria-label="CVV" />
        </div>
      )}
    </Card>
  );
};

export const CheckoutSummary = ({ items = [] }) => {
  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  return (
    <Card aria-label="Checkout order summary">
      <h3 className="font-semibold mb-4">Order Summary</h3>
      {items.map((i) => (
        <div key={i.id} className="flex justify-between text-sm mb-2">
          <span>{i.name} × {i.quantity}</span>
          <span>${(i.price * i.quantity).toFixed(2)}</span>
        </div>
      ))}
      <div className="flex justify-between font-bold border-t pt-2 mt-2"><span>Total</span><span>${total.toFixed(2)}</span></div>
      <Button className="w-full mt-4">Place Order</Button>
    </Card>
  );
};

export const OrderConfirmation = ({ orderId = "ORD-0000" }) => (
  <Card className="text-center" aria-label="Order confirmation">
    <div className="text-4xl mb-4">✅</div>
    <h2 className="text-xl font-bold mb-2">Order Confirmed!</h2>
    <p className="text-gray-600 mb-4">Thank you for your order. Order ID: <strong>{orderId}</strong></p>
    <div className="flex gap-2 justify-center">
      <Button variant="secondary">View Order</Button>
      <Button>Continue Shopping</Button>
    </div>
  </Card>
);

export const CheckoutView = ({ items = [], addresses = [], step = 1 }) => {
  logCustomerUIDiagnostics("component", { name: "CheckoutView", step });
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-4">
        <ShippingAddressForm addresses={addresses} />
        <DeliveryMethod />
        <PaymentMethod />
      </div>
      <CheckoutSummary items={items} />
    </div>
  );
};

export default CheckoutView;
