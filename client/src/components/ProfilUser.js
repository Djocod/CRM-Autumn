import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import ProductCard from "./ProductCard";
// import Products from "./Products";
import Navigation from "./Navigation";

const ProfilUser = () => {
  const { id } = useParams();
  const [userData, setUserData] = useState(null);
  const [viewData, setViewData] = useState([]);
  const [purchaseData, setPurchaseData] = useState([]);
  console.log(viewData, purchaseData);

  useEffect(() => {
    //CALLBACK : le code à exécuter
    // const purchases = userData.purchaseProducts;

    axios.get(`http://localhost:8000/api/users/${id}`).then((res) => {
      setUserData(res.data.user);
      setViewData(res.data.user.viewedProducts);
      setPurchaseData(res.data.user.purchasedProducts);
    });
  }, [id]); //DÉPENDANCES : "surveille id, et relance le callback si id change"

  return (
    <div>
      <Navigation />
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
        {viewData?.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
      <div>
        <h2>achat</h2>
        {purchaseData?.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default ProfilUser;
