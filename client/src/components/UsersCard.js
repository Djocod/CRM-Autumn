import React from "react";
import { Link } from "react-router-dom";
//déstructuration classique JS
const UsersCard = ({ user, showLetter }) => {
  const firstLetter = user.name.last[0].toUpperCase();
  console.log(user);

  return (
    <div className="link-container">
      {showLetter && <p>{firstLetter}</p>}
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
          {user.name.last} {user.name.first} <span>{user.nat}</span>
        </h3>
      </Link>
    </div>
  );
};

export default UsersCard;
