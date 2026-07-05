import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { IoBagHandleOutline } from "react-icons/io5";
import { HiOutlineSparkles } from "react-icons/hi";
import { Container, Button } from "../ui";
import { typography } from "../../design-system/typography";
import HomeProductCard from "../Home/HomeProductCard";

const CheckoutEmptyCart = () => {
  const { allProducts } = useSelector((state) => state.products);
  const suggestions = (allProducts || []).slice(0, 4);

  return (
    <Container className="py-16 lg:py-24">
      <div className="max-w-lg mx-auto text-center yebone-fade-up">
        <div className="w-24 h-24 mx-auto mb-6 rounded-3xl yebone-surface flex items-center justify-center">
          <IoBagHandleOutline size={40} className="text-yebone-primary" />
        </div>
        <h1 className={`${typography.heading} mb-3`}>Your cart is empty</h1>
        <p className="text-gray-500 dark:text-gray-400 mb-8 leading-relaxed">
          Discover premium products across Africa on Yebone — fashion, tech, home, and more.
        </p>
        <Link to="/products">
          <Button size="lg" className="yebone-btn-lift">
            Continue shopping
          </Button>
        </Link>
      </div>

      {suggestions.length > 0 && (
        <div className="mt-16">
          <div className="flex items-center gap-2 mb-6">
            <HiOutlineSparkles className="text-yebone-gold" />
            <h2 className={`${typography.subheading}`}>You might like</h2>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            {suggestions.map((product) => (
              <div key={product._id} className="flex justify-center">
                <HomeProductCard data={product} compact />
              </div>
            ))}
          </div>
        </div>
      )}
    </Container>
  );
};

export default CheckoutEmptyCart;
