import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import ProductCard from "./ProductCard";
import Products from "./Products";

const ProfilUser = () => {
  const { id } = useParams();
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    //CALLBACK : le code à exécuter
    axios
      .get(`http://localhost:8000/api/users/${id}`)
      .then((res) => setUserData(res.data.user));
  }, [id]); //DÉPENDANCES : "surveille id, et relance le callback si id change"

  return (
    <div>
      <ProductCard />
      {userData && (
        <div key={userData._id}>
          <img src={userData.picture.medium} alt="" />
          <h1>{userData.name.first}</h1>
        </div>
      )}
      <Products />
    </div>
  );
};

export default ProfilUser;
