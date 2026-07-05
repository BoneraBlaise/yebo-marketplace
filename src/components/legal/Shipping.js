import React from "react";

const Shipping = () => {
  return (
    <div className="p-6 w-[70%] mx-auto">
      <h1 className="text-3xl dark:text-white font-bold text-center mb-6">Shipping & Deliveries by Guriraline</h1>

      <p className="mb-4 text-gray-600 dark:text-gray-200">
        At Guriraline, we aim to provide our customers with the best possible
        shopping experience. We offer reliable delivery services for local
        orders within Rwanda. This Shipping Policy outlines the details
        regarding our shipping practices, delivery charges, and other important
        information.
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-4 text-black dark:text-gray-200">1. Local Deliveries</h2>
      <p className="mb-4 text-gray-600 dark:text-gray-200">
        We offer delivery services for customers located within Rwanda. Our
        delivery partners work hard to ensure that your orders are delivered to
        your doorstep in a timely and efficient manner.
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-4 text-black dark:text-gray-200">2. Delivery Charges</h2>
      <p className="mb-4 text-gray-600 dark:text-gray-200">
        Delivery charges for local orders within Rwanda will vary depending on
        the delivery location and the size or weight of the items ordered. The
        delivery fee will be calculated and displayed at checkout, so you can
        review it before confirming your order. We strive to keep our shipping
        fees affordable while ensuring that you receive quality service.
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-4 text-black dark:text-gray-200">3. Shipping Timeline</h2>
      <p className="mb-4 text-gray-600 dark:text-gray-200">
        Orders are typically processed within 1-2 business days. Once your order
        has been processed and shipped, you will receive a confirmation email
        with tracking information (if available). Delivery times may vary
        depending on the delivery address and the delivery service used. In
        general, local deliveries within Rwanda may take 3-7 business days from
        the shipment date. Please note that during peak seasons, such as
        holidays, delivery times may be longer.
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-4 text-black dark:text-gray-200">
        4. International Shipping
      </h2>
      <p className="mb-4 text-gray-600 dark:text-gray-200">
        At this time, we do not offer international shipping. We currently only
        provide local deliveries within Rwanda. We are constantly working to
        expand our services and may offer international shipping in the future.
        Please stay tuned for updates.
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-4 text-black dark:text-gray-200">5. Order Tracking</h2>
      <p className="mb-4 text-gray-600 dark:text-gray-200">
        Once your order has been shipped, you will receive a tracking number, if
        available, so you can monitor the status of your delivery. Please note
        that tracking may not be available for all delivery options, especially
        for smaller items or when using certain delivery partners.
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-4 text-black dark:text-gray-200">6. Delivery Issues</h2>
      <p className="mb-4 text-gray-600 dark:text-gray-200">
        In the event of any delivery issues, such as delays, damage, or missing
        items, please contact our customer support team immediately. We will
        work closely with our delivery partners to resolve the issue as quickly
        as possible and ensure your satisfaction. Please keep in mind that
        delivery times are estimates, and we cannot be held responsible for
        delays caused by factors outside of our control, such as weather
        conditions or other unforeseen circumstances.
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-4 text-black dark:text-gray-200">7. Contact Us</h2>
      <p className="mb-4 text-gray-600 dark:text-gray-200">
        If you have any questions or concerns regarding shipping, delivery
        charges, or your order, please feel free to contact our support team.
        You can reach us at{" "}
        <a href="mailto:support@guriraline.com" className="text-blue-500">
          support@guriraline.com
        </a>
        , and we will assist you promptly.
      </p>
    </div>
  );
};

export default Shipping;
