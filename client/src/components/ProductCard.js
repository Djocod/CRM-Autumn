import React from "react";
import "../style/productcard.css";

const ProductCard = ({ product }) => {
  if (!product) return;

  return (
    <div className="card-product-container">
      <div key={product._id} className="card-product">
        <img src={product.image} alt="" className="img-product" />
        <div className="description-container">
          <h3>
            {product.brand} | {product.title}
          </h3>
          <p className="description">{product.description}</p>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
