import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Navigation from "./Navigation";
import {
  addPurchase,
  deletePurchase,
  addview,
  deleteView,
} from "./settingsBtn.js";

const ProfilUser = () => {
  const { id } = useParams();
  const [userId, setUserId] = useState("");
  const [userData, setUserData] = useState(null);
  const [userRegistered, setUserRegistered] = useState(null);
  const [userBorn, setUserBorn] = useState(null);
  const [viewData, setViewData] = useState([]);
  const [purchaseData, setPurchaseData] = useState([]);
  const [productsData, setProductsData] = useState([]);
  const [valueType, setValueType] = useState("");
  const options = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  console.log(userData);

  useEffect(() => {
    //CALLBACK : le code à exécuter
    axios
      .get(`http://localhost:8000/api/product`)
      .then((res) => setProductsData(res.data.products));

    axios.get(`http://localhost:8000/api/users/${id}`).then((res) => {
      const date = new Date(res.data.user.registered.date);
      const born = new Date(res.data.user.dob.date);
      setUserData(res.data.user);
      setUserId(res.data.user._id);
      setViewData(res.data.user.viewSessions);
      setPurchaseData(res.data.user.purchaseSessions);
      setUserRegistered(date);
      setUserBorn(born);
    });
  }, [id]); //DÉPENDANCES : "surveille id, et relance le callback si id change"

  return (
    <div className="body-user">
      <Navigation />
      {userData && (
        <div key={userData._id} className="profil-container">
          <div className="ref-container"></div>
          <img src={userData.picture.medium} alt={userData.name.last} />
          <h3>
            {userData.name.title} {userData.name.last} {userData.name.first}
          </h3>
          <span className="vip">
            <i className="fa-solid fa-shield"></i>Client Vip
          </span>
          <div className="icon-container">
            <i className="fa-solid fa-arrow-up-from-bracket"></i>
            <i className="fa-solid fa-message"></i>
            <i className="fa-solid fa-pencil"></i>
          </div>
        </div>
      )}
      <div className="main-container">
        <h2>GÉNÉRAL</h2>
        {userData && (
          <div key={userData._id} className="card-user-main">
            <h3>Informations générales</h3>
            <ul className="list-main">
              <li className="item-main">
                {" "}
                <p>Client(e) depuis le</p>
                <p>
                  {userRegistered &&
                    userRegistered.toLocaleDateString("fr-FR", options)}
                </p>
              </li>
              <li className="item-main">
                <p>N de téléphone</p>
                <p>{userData.phone}</p>
              </li>
              <li className="item-main">
                <p>Email</p>
                <p>{userData.email}</p>
              </li>
              <li className="item-main">
                <p>Date de naissance</p>
                <p>
                  {userBorn && userBorn.toLocaleDateString("fr-FR", options)}
                </p>
              </li>
              <li className="item-main">
                <p>Nationalité</p>
                <p>{userData.location.country}</p>
              </li>
              <li className="item-main">
                <p>Magasin principal</p>
                <p>Automne PARIS</p>
              </li>
              <li className="item-main">
                <p>PS référent</p>
                <p>Ahmed Hakimi</p>
              </li>
              <li className="item-main">
                <p>ID client</p>
                <p>{userData.login.salt}</p>
              </li>
            </ul>
          </div>
        )}
        <div className="engage-container">
          <h3>Engagement</h3>
          <ul className="list-engage">
            <li className="item-engage">
              <p>12 832€</p>
              <span>CA 3 mois</span>
            </li>
            <li className="item-engage">
              <p>27 961€</p>
              <span>CA 12 mois</span>
            </li>
            <li className="item-engage">
              <p>120 832€</p>
              <span>CA TOTAL</span>
            </li>
          </ul>
        </div>
        <div className="like-container">
          <div className="like-left"></div>
          <div className="like-right">
            <h4>Marques</h4>
            <p>
              <span></span>Chaumet (64%)
            </p>
            <p>
              <span></span>Dior (27%)
            </p>
            <p>
              <span></span>Moncier (9%)
            </p>
          </div>
        </div>
      </div>
      <div className="histo-container">
        <h2>HISTORIQUE</h2>
        <div className="product-interaction-container">
          <div className="buy-container same-style-container">
            <h3>TOUS LES ACHATS</h3>
            {userData && (
              <div key={userData._id}>
                <h3>
                  {/* {userData.purchaseSessions[0].date
                    ? userData.purchaseSessions[0].date
                    : ""} */}
                </h3>
                <p>
                  {/* {userData.purchaseSessions[0].type} */}
                  <span>Automne - Paris</span>
                </p>
                <p>
                  {/* {userData.purchaseSessions[0].type === "buyShop"
                    ? userData.purchaseSessions.length
                    : ""}{" "} */}
                  articles
                </p>
                <p>produits achetés - nb</p>
              </div>
            )}
            {purchaseData.map((session) => {
              session.products.map((item) =>
                item.product ? (
                  <div
                    key={item.product._id}
                    className="product-card-user-container"
                  >
                    <div className="img-container">
                      <img
                        src={item.product.image}
                        alt=""
                        className="img-product"
                      />
                    </div>
                    <div className="description-container">
                      <div className="description-left">
                        <p className="product-name">{item.product.title}</p>
                        <span className="product-brand">
                          {item.product.brand}
                        </span>
                        <span>{item.product.ref}</span>
                        <p className="product-params">
                          Couleur : {item.product.colors[0].name} - Taille :
                          {item.product.sizes[2]
                            ? item.product.sizes[2]
                            : " N/A "}
                        </p>
                      </div>
                      <div className="price-product">
                        <p>{item.product.price} €</p>
                      </div>
                    </div>
                    <div className="set-btn">
                      <label htmlFor={`buyShop-del-${item.product._id}`}>
                        buyShop
                      </label>
                      <input
                        type="radio"
                        name={`delete-${item.product._id}`}
                        id={`buyShop-del-${item.product._id}`}
                        value="buyShop"
                        checked={valueType === "buyShop"}
                        onChange={() => setValueType("buyShop")}
                      />

                      <label htmlFor={`buyNet-del-${item.product._id}`}>
                        buyNet
                      </label>
                      <input
                        type="radio"
                        name={`delete-${item.product._id}`}
                        id={`buyNet-del-${item.product._id}`}
                        value="buyNet"
                        checked={valueType === "buyNet"}
                        onChange={() => setValueType("buyNet")}
                      />

                      <label htmlFor={`refund-del-${item.product._id}`}>
                        refund
                      </label>
                      <input
                        type="radio"
                        name={`delete-${item.product._id}`}
                        id={`refund-del-${item.product._id}`}
                        value="refund"
                        checked={valueType === "refund"}
                        onChange={() => setValueType("refund")}
                      />
                      <button
                        id=""
                        onClick={() =>
                          deletePurchase(item.product._id, userId, valueType)
                        }
                      >
                        deletePurchase
                      </button>
                    </div>
                  </div>
                ) : null,
              );
            })}
          </div>
          <div className="view-container same-style-container">
            <h3>SÉLECTIONS</h3>
            {viewData.map((session) =>
              session.products.map((item) =>
                item.product ? (
                  <div
                    key={item.product._id}
                    className="product-card-user-container"
                  >
                    <div className="img-container">
                      <img
                        src={item.product.image}
                        alt=""
                        className="img-product"
                      />
                    </div>
                    <div className="description-container">
                      <div className="description-left">
                        <p className="product-name">{item.product.title}</p>
                        <span className="product-brand">
                          {item.product.brand}
                        </span>
                        <span>{item.product.ref}</span>
                        <p className="product-params">
                          Couleur : {item.product.colors[0].name} - Taille :
                          {item.product.sizes[2]
                            ? item.product.sizes[2]
                            : " N/A "}
                        </p>
                      </div>
                      <div className="price-product">
                        <p>{item.product.price} €</p>
                      </div>
                    </div>
                    <button
                      id=""
                      onClick={() => deleteView(item.product._id, userId)}
                    >
                      Deleteview
                    </button>
                  </div>
                ) : null,
              ),
            )}
          </div>
        </div>
        <ul className="container-book">
          {productsData.length > 0 &&
            productsData
              // .sort((a, b) => a.brand.localeCompare(b.brand))
              .map((product) => (
                <div
                  key={product._id}
                  product={product}
                  className="product-card-user-container"
                >
                  <div className="img-container">
                    <img src={product.image} alt="" className="img-product" />
                  </div>
                  <div className="description-container">
                    <div className="description-left">
                      <p className="product-name">{product.title}</p>
                      <span className="product-brand">{product.brand}</span>
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
                  <div className="set-btn">
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
                    <button
                      id=""
                      onClick={() =>
                        addPurchase(product._id, userId, valueType)
                      }
                    >
                      purchase
                    </button>
                    <button id="" onClick={() => addview(product._id, userId)}>
                      view
                    </button>
                  </div>
                </div>
              ))}
        </ul>
      </div>
    </div>
  );
};

export default ProfilUser;
