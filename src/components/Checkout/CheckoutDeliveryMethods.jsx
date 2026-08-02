import React, { useEffect, useState } from "react";
import { HiOutlineTruck, HiOutlineShoppingBag, HiOutlineLocationMarker } from "react-icons/hi";
import { fetchDeliveryCheckoutOptions } from "../../services/deliveryConfigurationService";

const METHODS = [
  {
    id: "vendorDelivery",
    label: "Vendor Delivery",
    description: "Delivered by the vendor",
    icon: HiOutlineShoppingBag,
  },
  {
    id: "customerPickup",
    label: "Customer Pickup",
    description: "Collect from vendor location",
    icon: HiOutlineLocationMarker,
  },
  {
    id: "yeboneDelivery",
    label: "Yebone Delivery",
    description: "Platform-managed delivery",
    icon: HiOutlineTruck,
  },
];

const CheckoutDeliveryMethods = ({ value, onChange }) => {
  const [options, setOptions] = useState({
    vendorDelivery: true,
    customerPickup: true,
    yeboneDelivery: false,
    yeboneDeliveryComingSoon: true,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    fetchDeliveryCheckoutOptions()
      .then((response) => {
        if (!mounted) return;
        setOptions((prev) => ({ ...prev, ...(response?.data || {}) }));
      })
      .catch(() => {})
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (loading || value) return;
    if (options.vendorDelivery) onChange?.("vendorDelivery");
    else if (options.customerPickup) onChange?.("customerPickup");
  }, [loading, options.vendorDelivery, options.customerPickup, onChange, value]);

  return (
    <section className="checkout-section">
      <h2 className="checkout-section__title">Delivery method</h2>

      {loading ? (
        <div className="checkout-skeleton" />
      ) : (
        <div className="checkout-delivery__list">
          {METHODS.map(({ id, label, description, icon: Icon }) => {
            const enabled = Boolean(options[id]);
            const comingSoon = id === "yeboneDelivery" && options.yeboneDeliveryComingSoon;
            const selected = value === id;

            return (
              <label
                key={id}
                className={`checkout-delivery__option${
                  comingSoon ? " is-disabled" : selected ? " is-selected" : ""
                }`}
              >
                <input
                  type="radio"
                  name="deliveryMethod"
                  value={id}
                  checked={selected}
                  disabled={!enabled || comingSoon}
                  onChange={() => onChange?.(id)}
                />
                <Icon className="checkout-delivery__icon" size={16} aria-hidden="true" />
                <span className="checkout-delivery__copy">
                  <span className="checkout-delivery__label">
                    {label}
                    {comingSoon && <em>Coming soon</em>}
                  </span>
                  <span className="checkout-delivery__desc">{description}</span>
                </span>
              </label>
            );
          })}
        </div>
      )}
    </section>
  );
};

export default CheckoutDeliveryMethods;
