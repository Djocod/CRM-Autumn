import React, { useEffect, useState } from "react";
import ViewBtn from "../Folder.Btn/ViewBtn.js";

const UsersProductCardShop = ({ item, typeSection, userId }) => {
  const [valueSession, setValueSession] = useState([]);
  const [valueClass, setValueClass] = useState("");
  useEffect(() => {
    if (typeSection === "buyShop") {
      setValueSession("En magasin");
      setValueClass("shop");
    } else if (typeSection === "buyNet") {
      setValueSession("En ligne");
      setValueClass("net");
    } else if (typeSection === "refund") {
      setValueSession("Remboursé");
      setValueClass("refund");
    }
  }, [typeSection]);

  return (
    <div key={item.product._id} className="product-card-user-container">
      <div className="product-card-user">
        <div className="img-container">
          <img src={item.product.image} alt="" className="img-product" />
        </div>
        <div className="description-container">
          <div className="description-left">
            <p className="product-name">{item.product.title}</p>
            <span className="product-brand">{item.product.brand}</span>
            <div className="span-snr">
              <span>{item.product.ref} |</span>{" "}
              <span className={valueClass}>{valueSession}</span>
            </div>
            <p className="product-params">
              Couleur : {item.product.colors[0].name} - Taille :
              {item.product.sizes[2] ? item.product.sizes[2] : " N/A "}
            </p>
          </div>
          <div className="price-product">
            <p>{item.product.price} €</p>
          </div>
        </div>
      </div>
      <ViewBtn key={item.product._id} item={item} userId={userId} />
    </div>
  );
};

export default UsersProductCardShop;
