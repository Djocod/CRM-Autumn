import axios from "axios";
import React, { useEffect, useState } from "react";
import ProductCard from "./ProductCard";

const Products = () => {
  const [productsData, setProdctsData] = useState([]);
  useEffect(() => {
    axios
      .get(`http://localhost:8000/api/product`)
      .then((res) => setProdctsData(res.data.products));
  }, []);

  return (
    <div className="card-product-container">
      {productsData.length > 0 &&
        productsData
          .sort((a, b) => a.brand.localeCompare(b.brand))
          .map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
    </div>
  );
};

export default Products;
