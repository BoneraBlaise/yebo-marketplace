import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { MdVerified } from "react-icons/md";
import { Container, SectionTitle } from "../ui";
import { getVerifiedVendors } from "./homeProductFilters";

const HomeVerifiedVendors = () => {
  const { allProducts } = useSelector((state) => state.products);

  const vendors = useMemo(
    () => getVerifiedVendors(allProducts, 6),
    [allProducts]
  );

  if (!vendors.length) return null;

  return (
    <section className="home-section bg-yebone-light-gray dark:bg-gray-900/40">
      <Container>
        <SectionTitle
          title="Verified vendors"
          subtitle="Trusted sellers on Yebone — store names are chosen by each merchant."
          align="left"
        />

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {vendors.map((shop) => (
            <Link
              key={shop._id}
              to={`/shop/preview/${shop._id}`}
              className="home-card-lift group block rounded-3xl bg-white dark:bg-gray-900 border border-gray-100/80 dark:border-gray-800 overflow-hidden shadow-md hover:shadow-2xl hover:shadow-yebone-primary/10"
            >
              {/* Cover */}
              <div className="relative h-36 overflow-hidden">
                {shop.avatar?.url ? (
                  <>
                    <img
                      src={shop.avatar.url}
                      alt=""
                      className="absolute inset-0 w-full h-full object-cover scale-105 group-hover:scale-110 transition-transform duration-700 ease-out"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/60 to-yebone-primary/30" />
                    <div className="absolute inset-0 backdrop-blur-[2px] group-hover:backdrop-blur-0 transition-all duration-500" />
                  </>
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-yebone-primary via-yebone-primary-dark to-gray-900" />
                )}

                <span className="absolute top-3 right-3 inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-yebone-gold text-yebone-dark-text text-[10px] font-bold uppercase tracking-wide shadow-lg z-10">
                  <MdVerified size={13} />
                  Verified
                </span>
              </div>

              {/* Avatar + info */}
              <div className="relative px-5 pb-5 pt-0">
                <div className="absolute -top-10 left-5 z-10">
                  <img
                    src={shop.avatar?.url || "https://via.placeholder.com/80"}
                    alt={`${shop.name} store on Yebone`}
                    className="w-[72px] h-[72px] rounded-2xl border-4 border-white dark:border-gray-900 object-cover shadow-xl home-img-fade"
                  />
                </div>

                <div className="pt-14">
                  <h3 className="font-Poppins font-semibold text-lg text-yebone-dark-text dark:text-white group-hover:text-yebone-primary transition-colors duration-300">
                    {shop.name}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {shop.productCount} products
                    {shop.ratings ? ` · ${shop.ratings}★ rating` : " · Top rated"}
                  </p>

                  {shop.previewImages?.length > 0 && (
                    <div className="flex gap-2 mt-5">
                      {shop.previewImages.slice(0, 3).map((img, i) => (
                        <div
                          key={i}
                          className="w-14 h-14 rounded-xl overflow-hidden border border-gray-100 dark:border-gray-800 shadow-sm group-hover:shadow-md transition-shadow"
                        >
                          <img
                            src={img}
                            alt=""
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 home-img-fade"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
};

export default HomeVerifiedVendors;
