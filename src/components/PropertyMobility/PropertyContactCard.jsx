import React from "react";
import { HiOutlinePhone, HiOutlineMail } from "react-icons/hi";

const PropertyContactCard = ({ listing, onContact, contacting = false }) => {
  const owner = listing?.ownerInfo || {};
  const phone = owner.contactPhone || owner.phone;
  const email = owner.contactEmail || owner.email;

  return (
    <aside className="pm-contact-card rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-5 space-y-4 lg:sticky lg:top-24">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Contact</p>
        <h2 className="text-lg font-semibold mt-1">{owner.name || "Listing owner"}</h2>
        {listing?.verified ? (
          <span className="inline-flex mt-2 text-xs font-medium px-2 py-1 rounded-full bg-green-100 text-green-800">
            Verified seller
          </span>
        ) : null}
      </div>

      {phone ? (
        <a href={`tel:${phone}`} className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
          <HiOutlinePhone /> {phone}
        </a>
      ) : null}

      {email ? (
        <a href={`mailto:${email}`} className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 break-all">
          <HiOutlineMail /> {email}
        </a>
      ) : null}

      <button
        type="button"
        className="w-full min-h-[44px] px-4 rounded-xl bg-[#29625d] text-white text-sm font-medium disabled:opacity-60"
        onClick={onContact}
        disabled={contacting}
      >
        {contacting ? "Opening chat…" : "Contact Vendor"}
      </button>
    </aside>
  );
};

export default PropertyContactCard;
