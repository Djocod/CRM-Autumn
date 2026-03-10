import React from "react";

const ProductCard = ({ product }) => {
  return (
    <div key={product._id} className="card-product">
      <img src={product.image} alt="" className="img-product" />
      <div className="description-container">
        <h3>
          {product.brand} | {product.title}
        </h3>
        <p className="description">{product.description}</p>
      </div>
    </div>
  );
};

export default ProductCard;
