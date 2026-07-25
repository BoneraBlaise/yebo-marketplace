import React from "react";

const DAY_LABELS = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];
const DAY_NAMES = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

const ShopAboutSection = ({ shop }) => {
  if (!shop) return null;

  const hours = shop.businessHours || {};
  const policies = shop.policies || {};
  const social = shop.socialLinks || {};

  return (
    <section aria-label="About this shop">
      <h2 className="text-lg font-semibold mb-4 dark:text-white">About Shop</h2>
      <div className="shop-about-grid">
        {(shop.description || shop.bio) && (
          <article className="shop-about-card md:col-span-2">
            <h3>Business Description</h3>
            <p>{shop.bio || shop.description}</p>
          </article>
        )}

        {Object.keys(hours).length > 0 && (
          <article className="shop-about-card">
            <h3>Opening Hours</h3>
            <ul className="space-y-1">
              {DAY_LABELS.map((day, i) => {
                const entry = hours[day];
                if (!entry) return null;
                return (
                  <li key={day} className="flex justify-between gap-2">
                    <span>{DAY_NAMES[i]}</span>
                    <span>{entry.closed ? "Closed" : `${entry.open || "—"} – ${entry.close || "—"}`}</span>
                  </li>
                );
              })}
            </ul>
          </article>
        )}

        <article className="shop-about-card">
          <h3>Contact</h3>
          <ul className="space-y-2">
            {shop.phoneNumber && <li>📞 {shop.phoneNumber}</li>}
            {shop.address && <li>📍 {shop.address}</li>}
            {shop.website && (
              <li>
                <a href={shop.website} target="_blank" rel="noopener noreferrer" className="text-[var(--shop-accent)] underline">
                  {shop.website.replace(/^https?:\/\//, "")}
                </a>
              </li>
            )}
          </ul>
        </article>

        {(policies.returns || policies.shipping || policies.supportHours) && (
          <article className="shop-about-card md:col-span-2">
            <h3>Policies</h3>
            <div className="space-y-3">
              {policies.returns && (
                <div>
                  <p className="font-medium text-gray-800 dark:text-gray-200">Return Policy</p>
                  <p>{policies.returns}</p>
                </div>
              )}
              {policies.shipping && (
                <div>
                  <p className="font-medium text-gray-800 dark:text-gray-200">Shipping Policy</p>
                  <p>{policies.shipping}</p>
                </div>
              )}
              {policies.supportHours && (
                <div>
                  <p className="font-medium text-gray-800 dark:text-gray-200">Customer Support Hours</p>
                  <p>{policies.supportHours}</p>
                </div>
              )}
            </div>
          </article>
        )}

        {Object.values(social).some(Boolean) && (
          <article className="shop-about-card">
            <h3>Social</h3>
            <ul className="space-y-1">
              {social.instagram && <li><a href={social.instagram} target="_blank" rel="noopener noreferrer" className="underline">Instagram</a></li>}
              {social.facebook && <li><a href={social.facebook} target="_blank" rel="noopener noreferrer" className="underline">Facebook</a></li>}
              {social.twitter && <li><a href={social.twitter} target="_blank" rel="noopener noreferrer" className="underline">Twitter</a></li>}
              {social.tiktok && <li><a href={social.tiktok} target="_blank" rel="noopener noreferrer" className="underline">TikTok</a></li>}
              {social.whatsapp && <li><a href={`https://wa.me/${social.whatsapp}`} target="_blank" rel="noopener noreferrer" className="underline">WhatsApp</a></li>}
            </ul>
          </article>
        )}
      </div>
    </section>
  );
};

export default ShopAboutSection;
