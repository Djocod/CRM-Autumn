import React, { useRef } from "react";

const ProductCard = ({ product }) => {
  const styleBtn = useRef(null);
  const handleIdWihslist = (PWhislist) => {
    const value = styleBtn.current;
    if (!value) return;
    if (styleBtn) {
      value.classList.toggle("styleLikeBtn");
      console.log(PWhislist);
    }
  };

  return (
    <div className="card-product">
      <div className="product-card-book">
        <div className="img-container">
          <img src={product.image} alt="" className="img-product" />

          <button className="add-wishlist" ref={styleBtn}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
            >
              <path
                d="M12 21.35L10.55 20.03C5.4 15.36 2 12.27 2 8.5C2 5.41 4.42 3 7.5 3C9.24 3 10.91 3.81 12 5.08C13.09 3.81 14.76 3 16.5 3C19.58 3 22 5.41 22 8.5C22 12.27 18.6 15.36 13.45 20.03L12 21.35Z"
                fill="#F7F8F8"
                className=""
                onClick={() => handleIdWihslist(product._id)}
              />
            </svg>
          </button>
        </div>
        <div className="description-container">
          <div className="description-left">
            <p className="product-name">{product.title}</p>
            <span>{product.brand}</span>
            <span>{product.ref}</span>
            <span className="price">{product.price} €</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
