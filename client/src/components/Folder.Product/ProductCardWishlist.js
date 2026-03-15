import React from "react";

const ProductCardWishlist = ({ PWhislist }) => {
  return (
    <div key={PWhislist} className="card-product">
      {/* <img src={PWhislist.image} alt="" className="img-product" /> */}
      {/* <div className="product-card-book">
        <div className="img-container">
        </div>
        <div className="description-container">
          <div className="description-left">
            <p className="product-name">{PWhislist.title}</p>
            <span>{PWhislist.brand}</span>
            <span>{PWhislist.ref}</span>
            <span className="price">{PWhislist.price} €</span>
          </div>
        </div>
      </div> */}
    </div>
  );
};

export default ProductCardWishlist;
