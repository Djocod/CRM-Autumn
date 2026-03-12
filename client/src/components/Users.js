import React, { useEffect, useState } from "react";
import axios from "axios";
import UsersCard from "./UsersCard";
const Users = () => {
  const [usersData, setUsersData] = useState([]);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    if (userName.length > 0) {
      axios
        .get(`http://localhost:8000/api/users/search/${userName}`)
        .then((res) => setUsersData(res.data.user));
    } else {
      axios
        .get(`http://localhost:8000/api/users`)
        .then((res) => setUsersData(res.data.user));
    }
  }, [userName]);
  return (
    <div className="users-container">
      <h3>Tous les clients</h3>
      {usersData &&
        usersData
          .sort((a, b) => a.name.last.localeCompare(b.name.last))
          .map((user, index, array) => {
            const currentLetter = user.name.last[0].toUpperCase();
            const letter =
              index > 0 ? array[index - 1].name.last[0].toUpperCase() : null;
            const showLetter = currentLetter !== letter;
            return (
              <UsersCard key={user._id} user={user} showLetter={showLetter} />
            );
          })}

      {/* Props: user={user} c'est ça qui devient "user" dans le composant  */}
      <div className="input-container">
        <i class="fa-brands fa-sistrix"></i>
        <input
          type="text"
          placeholder="Recherche"
          id="search-name"
          className="input-search"
          onChange={(e) => setUserName(e.target.value.toLowerCase())}
        />
      </div>
    </div>
  );
};

export default Users;
