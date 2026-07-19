import React, { useEffect, useState } from "react";
import { HiOutlineTruck, HiOutlineShoppingBag, HiOutlineLocationMarker } from "react-icons/hi";
import { fetchDeliveryCheckoutOptions } from "../../services/deliveryConfigurationService";

const METHODS = [
  {
    id: "vendorDelivery",
    label: "Vendor Delivery",
    description: "Delivered directly by the vendor",
    icon: HiOutlineShoppingBag,
  },
  {
    id: "customerPickup",
    label: "Customer Pickup",
    description: "Collect your order from the vendor location",
    icon: HiOutlineLocationMarker,
  },
  {
    id: "yeboneDelivery",
    label: "Yebone Delivery",
    description: "Platform-managed delivery with courier assignment",
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
      .catch(() => {
        if (!mounted) return;
      })
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
    <section className="yebone-surface rounded-[1.75rem] p-6 lg:p-8">
      <h2 className="font-Poppins text-lg font-semibold mb-2 dark:text-white">Delivery method</h2>
      <p className="text-sm text-gray-500 mb-5">Choose how you want to receive your order</p>

      {loading ? (
        <div className="admin-skeleton h-28 rounded-xl" />
      ) : (
        <div className="space-y-3">
          {METHODS.map(({ id, label, description, icon: Icon }) => {
            const enabled = Boolean(options[id]);
            const comingSoon = id === "yeboneDelivery" && options.yeboneDeliveryComingSoon;
            const selected = value === id;

            return (
              <label
                key={id}
                className={`flex items-start gap-4 p-4 rounded-xl border transition ${
                  comingSoon
                    ? "border-gray-200 dark:border-gray-800 opacity-70 cursor-not-allowed"
                    : selected
                    ? "border-yebone-primary bg-yebone-primary/5 cursor-pointer"
                    : "border-gray-100 dark:border-gray-800 hover:border-yebone-primary/40 cursor-pointer"
                }`}
              >
                <input
                  type="radio"
                  name="deliveryMethod"
                  value={id}
                  checked={selected}
                  disabled={!enabled || comingSoon}
                  onChange={() => onChange?.(id)}
                  className="mt-1 accent-yebone-primary"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <Icon className="text-yebone-primary" size={18} />
                    <span className="font-semibold text-sm dark:text-white">{label}</span>
                    {comingSoon && (
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500">
                        Coming soon
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{description}</p>
                </div>
              </label>
            );
          })}
        </div>
      )}
    </section>
  );
};

export default CheckoutDeliveryMethods;
