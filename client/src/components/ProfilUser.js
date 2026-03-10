import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Navigation from "./Navigation";

const ProfilUser = () => {
  const { id } = useParams();
  const [userData, setUserData] = useState(null);
  const [viewData, setViewData] = useState([]);
  const [purchaseData, setPurchaseData] = useState([]);
  const [refundData, setRefundData] = useState([]);
  const [userId, setUserId] = useState("");
  const [productsData, setProdctsData] = useState([]);

  useEffect(() => {
    axios
      .get(`http://localhost:8000/api/product`)
      .then((res) => setProdctsData(res.data.products));
  }, []);

  function addPurchase(addId) {
    axios
      .patch(`http://localhost:8000/api/users/${addId}/purchase`, {
        userId: userId,
      })
      .then((res) => console.log(res.data));
  }

  function addview(addId) {
    axios
      .patch(`http://localhost:8000/api/users/${addId}/viewed`, {
        userId: userId,
      })
      .then((res) => console.log(res.data));
  }

  function addRefund(addId) {
    axios
      .patch(`http://localhost:8000/api/users/${addId}/refund`, {
        userId: userId,
      })
      .then((res) => console.log(res.data));
  }
  // ==========================================
  function deletePurchase(productId) {
    axios
      .delete(`http://localhost:8000/api/users/${productId}/purchase`, {
        data: { userId: userId },
      })
      .then((res) => console.log(res.data));
  }

  function deleteView(productId) {
    axios
      .delete(`http://localhost:8000/api/users/${productId}/viewed`, {
        data: { userId: userId },
      })
      .then((res) => console.log(res.data));
  }
  function deleteRefund(productId) {
    axios
      .delete(`http://localhost:8000/api/users/${productId}/refund`, {
        data: { userId: userId },
      })
      .then((res) => console.log(res.data));
  }
  useEffect(() => {
    //CALLBACK : le code à exécuter

    axios.get(`http://localhost:8000/api/users/${id}`).then((res) => {
      setUserData(res.data.user);
      setUserId(res.data.user._id);
      setViewData(res.data.user.viewSessions);
      setPurchaseData(res.data.user.purchaseSessions);
      setRefundData(res.data.user.refundSessions);
    });
  }, [id]); //DÉPENDANCES : "surveille id, et relance le callback si id change"

  return (
    <div className="body-user">
      <Navigation />
      <div className="profil-container">
        {userData && (
          <div key={userData._id}>
            <img src={userData.picture.medium} alt="" />
            <h1>{userData.name.first}</h1>
            <p>{userData._id}</p>
          </div>
        )}
      </div>
      <div className="histo-container">
        <div className="view-container">
          <h2>view</h2>
          {viewData.map((session) =>
            session.products.map((item) =>
              item.product ? (
                <div key={item.product._id}>
                  <span>{item.product._id}</span>
                  <img src={item.image} alt="" className="img-product" />
                  <div className="description-container">
                    <h3>
                      {item.product.brand} | {item.product.title}
                    </h3>
                    <p className="description">{item.product.description}</p>
                  </div>
                  <button id="" onClick={() => deleteView(item.product._id)}>
                    Deleteview
                  </button>
                </div>
              ) : null,
            ),
          )}
        </div>
        <div className="buy-container">
          <h2>achat</h2>
          {purchaseData.map((session) =>
            session.products.map((item) =>
              item.product ? (
                <div key={item.product._id}>
                  <span>{item.product._id}</span>
                  <img
                    src={item.product.image}
                    alt=""
                    className="img-product"
                  />
                  <div className="description-container">
                    <h3>
                      {item.product.brand} | {item.product.title}
                    </h3>
                    <p className="description">{item.product.description}</p>
                  </div>
                  <button
                    id=""
                    onClick={() => deletePurchase(item.product._id)}
                  >
                    deletePurchase
                  </button>
                </div>
              ) : null,
            ),
          )}
        </div>
        <div className="refund-container">
          <h2>remboursement</h2>
          {refundData.map((session) =>
            session.products.map((item) =>
              item.product ? (
                <div key={item.product._id}>
                  <span>{item.product._id}</span>
                  <img
                    src={item.product.image}
                    alt=""
                    className="img-product"
                  />
                  <div className="description-container">
                    <h3>
                      {item.product.brand} | {item.product.title}
                    </h3>
                    <p className="description">{item.product.description}</p>
                  </div>
                  <button id="" onClick={() => deleteRefund(item.product._id)}>
                    deleterefund
                  </button>
                </div>
              ) : null,
            ),
          )}
        </div>
        <ul className="container-book">
          {productsData.length > 0 &&
            productsData
              // .sort((a, b) => a.brand.localeCompare(b.brand))
              .map((product) => (
                <div
                  key={product._id}
                  product={product}
                  className="container-book"
                >
                  <img src={product.image} alt="" className="img-product" />
                  <p>{product._id}</p>
                  <button id="" onClick={() => addPurchase(product._id)}>
                    purchase
                  </button>
                  <button id="" onClick={() => addview(product._id)}>
                    view
                  </button>
                  <button id="" onClick={() => addRefund(product._id)}>
                    refund
                  </button>
                </div>
              ))}
        </ul>
      </div>
    </div>
  );
};

export default ProfilUser;
