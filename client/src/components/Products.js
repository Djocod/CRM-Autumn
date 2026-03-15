import axios from "axios";
import React, { useEffect, useState } from "react";
import ProductCard from "./Folder.Product/ProductCard.js";

const Products = () => {
  const [productsData, setProductsData] = useState([]);
  const [brandName, setBrandName] = useState("");

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
      <div className="input-container">
        <i className="fa-brands fa-sistrix"></i>
        <input
          type="text"
          placeholder="Recherche"
          id="search-brand"
          className="input-search"
          onChange={(e) => setBrandName(e.target.value.toLowerCase())}
        />
      </div>
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
