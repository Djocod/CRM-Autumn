import React, { useState } from "react";
import { deletePurchase } from "./settingsBtn.js";

const ViewBtn = ({ item, userId }) => {
  const [valueType, setValueType] = useState("");
  return (
    <div className="set-btn">
      <form action="">
        <label htmlFor={`buyShop-del-${item.product._id}`}>buyShop</label>
        <input
          type="radio"
          name={`delete-${item.product._id}`}
          id={`buyShop-del-${item.product._id}`}
          value="buyShop"
          checked={valueType === "buyShop"}
          onChange={() => setValueType("buyShop")}
        />

        <label htmlFor={`buyNet-del-${item.product._id}`}>buyNet</label>
        <input
          type="radio"
          name={`delete-${item.product._id}`}
          id={`buyNet-del-${item.product._id}`}
          value="buyNet"
          checked={valueType === "buyNet"}
          onChange={() => setValueType("buyNet")}
        />

        <label htmlFor={`refund-del-${item.product._id}`}>refund</label>
        <input
          type="radio"
          name={`delete-${item.product._id}`}
          id={`refund-del-${item.product._id}`}
          value="refund"
          checked={valueType === "refund"}
          onChange={() => setValueType("refund")}
        />
      </form>
      <div className="container-btn">
        <button
          className="del-pur"
          id=""
          onClick={() => deletePurchase(item.product._id, userId, valueType)}
        >
          deletePurchase
        </button>
      </div>
    </div>
  );
};

export default ViewBtn;
