import React from "react";

const ProductCard = ({ product }) => {
  return (
    <div key={product._id} className="card-product">
      <div className="product-card-book">
        <div className="img-container">
          <img src={product.image} alt="" className="img-product" />
        </div>
        <div className="description-container">
          <div className="description-left">
            <p className="product-name">{product.title}</p>
            <span>{product.brand}</span>
            <span>{product.ref}</span>
            <p className="product-params">
              Couleur : {product.colors[0].name} - Taille :
              {product.sizes[2] ? product.sizes[2] : " N/A "}
            </p>
          </div>
          <div className="price-product">
            <p>{product.price} €</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
