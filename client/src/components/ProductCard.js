import React from "react";

const ProductCard = ({ product }) => {
  return (
    <div key={product._id} className="card-product">
      <img src={product.image} alt="" className="img-product" />
      <div className="description-container">
        <p className="product-name">{product.title}</p>
        <span>{product.brand}</span>
        <span>{product.ref}</span>
        <p className="product-params">
          Couleur : {product.colors[0].name} - Taille :
          {product.sizes[2] ? product.sizes[2] : " N/A "}
        </p>
      </div>
    </div>
  );
};

export default ProductCard;
