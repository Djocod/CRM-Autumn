import React from "react";
import { NavLink } from "react-router-dom";

const Navigation = () => {
  return (
    <ul className="nav-bar">
      <li className="nav-item">
        <NavLink to="/">Acceuil</NavLink>
      </li>
      <li className="nav-item">
        <NavLink to={"/Profil"}>Profil</NavLink>
      </li>
      <li className="nav-item">
        <NavLink to={"/Book"}>Catalogue</NavLink>
      </li>
    </ul>
  );
};

export default Navigation;
