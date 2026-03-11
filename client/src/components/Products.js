import axios from "axios";
import React, { useEffect, useState } from "react";
import ProductCard from "./ProductCard";

const Products = () => {
  const [productsData, setProductsData] = useState([]);
  const [brandName, setBrandName] = useState("");
  console.log(productsData, brandName);

  useEffect(() => {
    if (brandName) {
      axios
        .get(`http://localhost:8000/api/product/search?brand=${brandName}`)
        .then((res) => setProductsData(res.data.products));
    } else {
      axios
        .get(`http://localhost:8000/api/product`)
        .then((res) => setProductsData(res.data.products));
    }
  }, [brandName]);

  return (
    <div className="card-product-container">
      <input
        type="text"
        placeholder="Recherche"
        id="search-product"
        onChange={(e) => setBrandName(e.target.value.toLowerCase())}
      />
      {productsData &&
        productsData
          .sort((a, b) => a.brand.localeCompare(b.brand))
          .map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
    </div>
  );
};

export default Products;
