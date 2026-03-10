import axios from "axios";
import React from "react";

const SeetingsProduct = () => {
  const deleteId = "69b007449ed05269c31bf026";
  const addId = "69b01fb3004b88adca0de8ce";

  function add() {
    axios
      .patch(`http://localhost:8000/api/users/${addId}/purchase`, {
        userId: addId,
      })
      .then((res) => console.log(res.data));
  }

  function deletePurchase() {
    axios
      .delete(`http://localhost:8000/api/users/${deleteId}/purchase`, {
        data: { userId: deleteId },
      })
      .then((res) => console.log(res.data));
  }
  function deleteView() {
    axios
      .delete(`http://localhost:8000/api/users/${deleteId}/viewed`, {
        data: { userId: deleteId },
      })
      .then((res) => console.log(res.data));
  }
  function deleteRefund() {
    axios
      .delete(`http://localhost:8000/api/users/${deleteId}/refund`, {
        data: { userId: deleteId },
      })
      .then((res) => console.log(res.data));
  }
  // http://localhost:8000/api/users
  // http://localhost:8000/api/users/id
  // http://localhost:8000/api/users/search/Smith
  // http://localhost:8000/api/users/:productId/viewed
  // http://localhost:8000/api/users/:productId/purchase
  // http://localhost:8000/api/users/:productId/refund
  // http://localhost:8000/api/product
  // http://localhost:8000/api/product/search?brand=Gucci

  return (
    <div>
      <button id="" onClick={() => deletePurchase()}>
        deletePurchase
      </button>
      <button id="" onClick={() => deleteView()}>
        Deleteview
      </button>
      <button id="" onClick={() => deleteRefund()}>
        deleterefund
      </button>
      <button id="" onClick={() => add()}>
        add
      </button>
    </div>
  );
};

export default SeetingsProduct;
