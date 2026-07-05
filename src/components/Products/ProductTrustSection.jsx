import React from "react";
import {
  MdVerified,
  MdShield,
  MdLock,
  MdLocalShipping,
  MdReplay,
  MdCheckCircle,
} from "react-icons/md";
import { Container, SectionTitle } from "../ui";

const TRUST_ITEMS = [
  { icon: MdVerified, title: "Verified Seller", desc: "Trusted merchants on Yebone" },
  { icon: MdShield, title: "Buyer Protection", desc: "Shop with peace of mind" },
  { icon: MdLock, title: "Secure Payments", desc: "Encrypted checkout" },
  { icon: MdCheckCircle, title: "Authentic Products", desc: "Genuine marketplace listings" },
  { icon: MdLocalShipping, title: "Fast Delivery", desc: "Across Africa" },
  { icon: MdReplay, title: "Easy Returns", desc: "Hassle-free policy" },
];

const ProductTrustSection = () => (
  <section className="pdp-section bg-yebone-light-gray/40 dark:bg-gray-900/30">
    <Container>
      <SectionTitle
        title="Shop with confidence"
        subtitle="Yebone protects every purchase with premium marketplace trust standards."
        align="center"
      />
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 lg:gap-4">
        {TRUST_ITEMS.map(({ icon: Icon, title, desc }) => (
          <div
            key={title}
            className="yebone-card-lift group text-center p-5 lg:p-6 rounded-2xl yebone-surface"
          >
            <div className="w-12 h-12 mx-auto rounded-2xl bg-yebone-primary/10 flex items-center justify-center mb-3 group-hover:bg-yebone-primary transition-colors duration-300">
              <Icon className="text-yebone-primary group-hover:text-white transition-colors duration-300" size={24} />
            </div>
            <p className="font-Poppins font-semibold text-sm dark:text-white">{title}</p>
            <p className="text-[11px] text-gray-500 mt-1.5 leading-relaxed">{desc}</p>
          </div>
        ))}
      </div>
    </Container>
  </section>
);

export default ProductTrustSection;
