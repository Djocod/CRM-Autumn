import React, { useState } from "react";
import { addview, addPurchase } from "./settingsBtn.js";

const ViewBtnBook = ({ product, userId }) => {
  const [valueType, setValueType] = useState("");
  return (
    <div className="set-btn">
      <form action="">
        <label htmlFor={`buyShop-${product._id}`}>buyShop</label>
        <input
          type="radio"
          name={`type-${product._id}`}
          id={`buyShop-${product._id}`}
          value="buyShop"
          checked={valueType === "buyShop"}
          onChange={() => setValueType("buyShop")}
        />

        <label htmlFor={`buyNet-${product._id}`}>buyNet</label>
        <input
          type="radio"
          name={`type-${product._id}`}
          id={`buyNet-${product._id}`}
          value="buyNet"
          checked={valueType === "buyNet"}
          onChange={() => setValueType("buyNet")}
        />

        <label htmlFor={`refund-${product._id}`}>refund</label>
        <input
          type="radio"
          name={`type-${product._id}`}
          id={`refund-${product._id}`}
          value="refund"
          checked={valueType === "refund"}
          onChange={() => setValueType("refund")}
        />
      </form>
      <div className="container-btn">
        <button
          className="add-pur"
          id=""
          onClick={() => addPurchase(product._id, userId, valueType)}
        >
          purchase
        </button>
        <button
          className="add-view"
          id=""
          onClick={() => addview(product._id, userId)}
        >
          view
        </button>
      </div>
    </div>
  );
};

export default ViewBtnBook;
