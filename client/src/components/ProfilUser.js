import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Navigation from "./Navigation";
import SeetingsProduct from "./SeetingsProduct";

const ProfilUser = () => {
  const { id } = useParams();
  const [userData, setUserData] = useState(null);
  const [viewData, setViewData] = useState([]);
  const [purchaseData, setPurchaseData] = useState([]);
  const [refundData, setRefundData] = useState([]);
  console.log(userData);

  // console.log(userData, refundData);

  useEffect(() => {
    //CALLBACK : le code à exécuter

    axios.get(`http://localhost:8000/api/users/${id}`).then((res) => {
      setUserData(res.data.user);
      setViewData(res.data.user.viewSessions);
      setPurchaseData(res.data.user.purchaseSessions);
      setRefundData(res.data.user.refundSessions);
    });
  }, [id]); //DÉPENDANCES : "surveille id, et relance le callback si id change"

  return (
    <div>
      <Navigation />
      <SeetingsProduct />
      <div>
        {userData && (
          <div key={userData._id}>
            <img src={userData.picture.medium} alt="" />
            <h1>{userData.name.first}</h1>
          </div>
        )}
      </div>
      <div>
        <h2>view</h2>
        {viewData.map((session) =>
          session.products.map((item) =>
            item.product ? (
              <div key={item.product._id}>
                <img src={item.image} alt="" className="img-product" />
                <div className="description-container">
                  <h3>
                    {item.product.brand} | {item.product.title}
                  </h3>
                  <p className="description">{item.product.description}</p>
                </div>
              </div>
            ) : null,
          ),
        )}
      </div>
      <div>
        <h2>achat</h2>
        {purchaseData.map((session) =>
          session.products.map((item) =>
            item.product ? (
              <div key={item.product._id}>
                <img src={item.product.image} alt="" className="img-product" />
                <div className="description-container">
                  <h3>
                    {item.product.brand} | {item.product.title}
                  </h3>
                  <p className="description">{item.product.description}</p>
                </div>
              </div>
            ) : null,
          ),
        )}
      </div>
      <div>
        <h2>remboursement</h2>
        {refundData.map((session) =>
          session.products.map((item) =>
            item.product ? (
              <div key={item.product._id}>
                <img src={item.product.image} alt="" className="img-product" />
                <div className="description-container">
                  <h3>
                    {item.product.brand} | {item.product.title}
                  </h3>
                  <p className="description">{item.product.description}</p>
                </div>
              </div>
            ) : null,
          ),
        )}
      </div>
    </div>
  );
};

export default ProfilUser;
