import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { createBrandEngine } from "./BrandEngine";

const BrandContext = createContext(null);

export const BrandProvider = ({ children, brand = {} }) => {
  const engine = useMemo(() => createBrandEngine(brand), []);
  const [currentBrand, setCurrentBrand] = useState(() => engine.getBrand());

  useEffect(() => {
    if (Object.keys(brand).length) engine.setBrand(brand);
    else engine.apply();
    setCurrentBrand(engine.getBrand());
    return engine.subscribe(setCurrentBrand);
  }, [engine, brand]);

  const value = useMemo(
    () => ({ brand: currentBrand, setBrand: (b) => engine.setBrand(b), engine }),
    [currentBrand, engine]
  );

  return <BrandContext.Provider value={value}>{children}</BrandContext.Provider>;
};

export const useBrand = () => useContext(BrandContext);

export default BrandProvider;
