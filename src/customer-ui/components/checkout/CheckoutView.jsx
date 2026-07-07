import React, { useState } from "react";
import { Card, Button, Input, Select, Badge, Progress } from "../../../design-system/components";
import { SectionHeader, PremiumCard } from "../../../ui-polish";
import { MARKETPLACE_NAME, AI_POWERED_BY } from "../../../ui-polish/brandConstants";
import { logCustomerUIDiagnostics } from "../../diagnostics/CustomerUIDiagnostics";

const STEPS = ["Address", "Shipping", "Payment", "Review"];

export const CheckoutProgress = ({ step = 1 }) => (
  <nav aria-label="Checkout progress" className="mb-8">
    <Progress value={(step / STEPS.length) * 100} />
    <ol className="flex justify-between mt-3 text-xs sm:text-sm">
      {STEPS.map((label, i) => (
        <li key={label} className={`font-medium ${i + 1 <= step ? "text-yebone-primary" : "text-gray-400"}`}>
          {i + 1}. {label}
        </li>
      ))}
    </ol>
  </nav>
);

export const ShippingAddressForm = ({ addresses = [] }) => (
  <Card aria-label="Shipping address">
    <h3 className="font-Poppins font-semibold mb-4">Shipping Address</h3>
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
      <h3 className="font-Poppins font-semibold mb-4">Delivery Method</h3>
      <div className="space-y-2">
        {[{ id: "standard", label: "Standard (3-5 days)", price: "Free" }, { id: "express", label: "Express (1-2 days)", price: "$9.99" }].map((m) => (
          <label key={m.id} className={`flex items-center justify-between p-4 border rounded-xl cursor-pointer transition-colors ${method === m.id ? "border-yebone-primary bg-yebone-primary/5" : "border-gray-200 dark:border-gray-700"}`}>
            <span className="flex items-center gap-2">
              <input type="radio" name="delivery" value={m.id} checked={method === m.id} onChange={() => setMethod(m.id)} />
              {m.label}
            </span>
            <Badge variant={m.price === "Free" ? "success" : "default"}>{m.price}</Badge>
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
      <h3 className="font-Poppins font-semibold mb-4">Payment Method</h3>
      <div className="space-y-2">
        {[{ id: "card", label: "Credit / Debit Card" }, { id: "eft", label: "EFT / Bank Transfer" }, { id: "wallet", label: "Digital Wallet" }].map((m) => (
          <label key={m.id} className={`flex items-center gap-2 p-4 border rounded-xl cursor-pointer ${method === m.id ? "border-yebone-primary" : ""}`}>
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
    <PremiumCard aria-label="Checkout order summary" className="lg:sticky lg:top-24">
      <h3 className="font-Poppins font-semibold text-lg mb-4">Order Summary</h3>
      {items.map((i) => (
        <div key={i.id} className="flex justify-between text-sm mb-2">
          <span className="truncate mr-2">{i.name} × {i.quantity}</span>
          <span className="shrink-0">${(i.price * i.quantity).toFixed(2)}</span>
        </div>
      ))}
      <div className="flex justify-between font-bold border-t border-gray-200 dark:border-gray-700 pt-3 mt-3">
        <span>Total</span>
        <span className="text-yebone-primary">${total.toFixed(2)}</span>
      </div>
      <Button className="w-full mt-4 yebone-btn-lift">Place Order</Button>
      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 text-xs text-gray-500 space-y-1">
        <p>🛡️ Buyer protection on {MARKETPLACE_NAME}</p>
        <p>✨ {AI_POWERED_BY}</p>
      </div>
    </PremiumCard>
  );
};

export const OrderConfirmation = ({ orderId = "ORD-0000" }) => (
  <PremiumCard className="text-center max-w-lg mx-auto" aria-label="Order confirmation">
    <div className="text-5xl mb-4" aria-hidden="true">✅</div>
    <h2 className="text-2xl font-Poppins font-bold mb-2">Order Confirmed!</h2>
    <p className="text-gray-600 dark:text-gray-400 mb-2">Thank you for shopping on {MARKETPLACE_NAME}.</p>
    <p className="text-sm mb-6">Order ID: <strong>{orderId}</strong></p>
    <div className="flex flex-col sm:flex-row gap-2 justify-center">
      <Button variant="secondary">View Order</Button>
      <Button>Continue Shopping</Button>
    </div>
  </PremiumCard>
);

export const CheckoutView = ({ items = [], addresses = [], step = 2 }) => {
  logCustomerUIDiagnostics("component", { name: "CheckoutView", step });
  return (
    <div>
      <SectionHeader title="Checkout" subtitle="Complete your purchase securely" />
      <CheckoutProgress step={step} />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <ShippingAddressForm addresses={addresses} />
          <DeliveryMethod />
          <PaymentMethod />
        </div>
        <CheckoutSummary items={items} />
      </div>
    </div>
  );
};

export default CheckoutView;
