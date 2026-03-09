import React from "react";
import { Link } from "react-router-dom";
//déstructuration classique JS
const UsersCard = ({ user }) => {
  return (
    <Link
      to={`/users/${user._id}`}
      key={user._id}
      className="card-user-container"
    >
      <img
        src={user.picture.medium}
        alt={`${user.name.first} ${user.lastName}`}
      />
      <h3>
        {user.name.title} | {user.name.first} {user.name.last}
      </h3>
    </Link>
  );
};

export default UsersCard;
