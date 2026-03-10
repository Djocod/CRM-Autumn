import React from "react";
import { NavLink } from "react-router-dom";

const Navigation = () => {
  return (
    <ul>
      <li>
        <NavLink to="/">Acceuil</NavLink>
      </li>
      <li>
        <NavLink to={"/Profil"}>Profil</NavLink>
      </li>
      <li>
        <NavLink to={"/Book"}>Catalogue</NavLink>
      </li>
    </ul>
  );
};

export default Navigation;
