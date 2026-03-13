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
  // const [datePurchase, setDatePurchase] = useState(null);
  const [viewData, setViewData] = useState([]);
  const [purchaseData, setPurchaseData] = useState([]);
  const [productsData, setProductsData] = useState([]);
  const [valueType, setValueType] = useState("");
  const [activeSection, setActiveSection] = useState("general");
  const options = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };

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
          <div className="profil-card-name">
            <img src={userData.picture.medium} alt={userData.name.last} />
            <div className="profil-name">
              <h3>
                {userData.name.title} {userData.name.last} {userData.name.first}
              </h3>
              <span className="vip">Client Vip</span>
            </div>
          </div>
          <ul className="list-engage">
            <li className="item-engage">
              <span>CA 3 mois</span>
              <p>12 832€</p>
            </li>
            <li className="item-engage">
              <span>CA 12 mois</span>
              <p>27 961€</p>
            </li>
            <li className="item-engage">
              <span>CA TOTAL</span>
              <p>120 832€</p>
            </li>
          </ul>
        </div>
      )}
      <div className="main-container">
        <div className="main-title">
          <div className="btn-container">
            <h4
              className="btn-general btn-h4"
              onClick={() => setActiveSection("general")}
            >
              GÉNÉRAL
            </h4>
          </div>
          <div className="btn-container">
            <h4
              className="btn-histo btn-h4"
              onClick={() => setActiveSection("histo")}
            >
              HISTORIQUE
            </h4>
          </div>
        </div>
        {activeSection === "general" && (
          <div className="class-event-useref">
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
                      {userBorn &&
                        userBorn.toLocaleDateString("fr-FR", options)}
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
            <div className="like-container">
              <h3>Préférences</h3>
              <div className="like-component">
                <div className="like-left">
                  <img src="/assets/Figpie.webp" alt="" />
                </div>
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
          </div>
        )}
      </div>

      {activeSection === "histo" && (
        <div className="histo-container">
          <div className="product-interaction-container">
            <div className="buy-container same-style-container">
              <h3>
                Tous les achats{" "}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="23"
                  height="16"
                  viewBox="0 0 23 16"
                  fill="none"
                >
                  <path
                    d="M1.25 1.25H21.25M4.58333 7.75H17.9167M8.58333 14.25H13.9167"
                    stroke="#25272C"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </h3>
              {/* =========================================== */}

              <div className="info-buy-container">
                <h4>3 mars 2026</h4>
                <p>
                  <span>Automne - Paris</span>
                </p>
                <p>articles {purchaseData.length}</p>
              </div>

              {purchaseData
                .filter((session) => session.type === "buyShop")
                .map((session) => {
                  return session.products.map((item) =>
                    item.product ? (
                      <div
                        key={item.product._id}
                        className="product-card-user-container"
                      >
                        <div className="product-card-user">
                          <div className="img-container">
                            <img
                              src={item.product.image}
                              alt=""
                              className="img-product"
                            />
                          </div>
                          <div className="description-container">
                            <div className="description-left">
                              <p className="product-name">
                                {item.product.title}
                              </p>
                              <span className="product-brand">
                                {item.product.brand}
                              </span>
                              <div className="span-snr">
                                <span>{item.product.ref} |</span>{" "}
                                <span className="shop"> En magasin</span>
                              </div>
                              <p className="product-params">
                                Couleur : {item.product.colors[0].name} - Taille
                                :
                                {item.product.sizes[2]
                                  ? item.product.sizes[2]
                                  : " N/A "}
                              </p>
                            </div>
                            <div className="price-product">
                              <p>{item.product.price} €</p>
                            </div>
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
                              deletePurchase(
                                item.product._id,
                                userId,
                                valueType,
                              )
                            }
                          >
                            deletePurchase
                          </button>
                        </div>
                      </div>
                    ) : null,
                  );
                })}

              {purchaseData
                .filter((session) => session.type === "buyNet")
                .map((session) => {
                  return session.products.map((item) =>
                    item.product ? (
                      <div
                        key={item.product._id}
                        className="product-card-user-container"
                      >
                        <div className="product-card-user">
                          <div className="img-container">
                            <img
                              src={item.product.image}
                              alt=""
                              className="img-product"
                            />
                          </div>
                          <div className="description-container">
                            <div className="description-left">
                              <p className="product-name">
                                {item.product.title}
                              </p>
                              <span className="product-brand">
                                {item.product.brand}
                              </span>
                              <div className="span-snr">
                                <span>{item.product.ref} |</span>{" "}
                                <span className="net"> En ligne</span>
                              </div>
                              <p className="product-params">
                                Couleur : {item.product.colors[0].name} - Taille
                                :
                                {item.product.sizes[2]
                                  ? item.product.sizes[2]
                                  : " N/A "}
                              </p>
                            </div>
                            <div className="price-product">
                              <p>{item.product.price} €</p>
                            </div>
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
                              deletePurchase(
                                item.product._id,
                                userId,
                                valueType,
                              )
                            }
                          >
                            deletePurchase
                          </button>
                        </div>
                      </div>
                    ) : null,
                  );
                })}

              {purchaseData
                .filter((session) => session.type === "refund")
                .map((session) => {
                  return session.products.map((item) =>
                    item.product ? (
                      <div
                        key={item.product._id}
                        className="product-card-user-container"
                      >
                        <div className="product-card-user">
                          <div className="img-container">
                            <img
                              src={item.product.image}
                              alt=""
                              className="img-product"
                            />
                          </div>
                          <div className="description-container">
                            <div className="description-left">
                              <p className="product-name">
                                {item.product.title}
                              </p>
                              <span className="product-brand">
                                {item.product.brand}
                              </span>
                              <div className="span-snr">
                                <span>{item.product.ref} |</span>{" "}
                                <span className="refund"> Remboursement</span>
                              </div>
                              <p className="product-params">
                                Couleur : {item.product.colors[0].name} - Taille
                                :
                                {item.product.sizes[2]
                                  ? item.product.sizes[2]
                                  : " N/A "}
                              </p>
                            </div>
                            <div className="price-product">
                              <p>{item.product.price} €</p>
                            </div>
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
                              deletePurchase(
                                item.product._id,
                                userId,
                                valueType,
                              )
                            }
                          >
                            deletePurchase
                          </button>
                        </div>
                      </div>
                    ) : null,
                  );
                })}

              {/* =========================================== */}
            </div>
            <div className="view-container same-style-container">
              <h3>SÉLECTIONS</h3>
              <div className="info-buy-container">
                <h4>3 mars 2026</h4>
                <p>
                  <span>Automne - Paris</span>
                </p>
                <p>articles {viewData.length}</p>
              </div>
              {viewData.map((session) =>
                session.products.map((item) =>
                  item.product ? (
                    <div
                      key={item.product._id}
                      className="product-card-user-container"
                    >
                      <div className="product-card-user">
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
                      <button
                        id=""
                        onClick={() => addview(product._id, userId)}
                      >
                        view
                      </button>
                    </div>
                  </div>
                ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ProfilUser;
