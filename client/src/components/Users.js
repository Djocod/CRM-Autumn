import React, { useEffect, useState } from "react";
import axios from "axios";
import UsersCard from "./UsersCard";
const Users = () => {
  const [usersData, setUsersData] = useState([]);
  const [userName, setUserName] = useState("");
  useEffect(() => {
    if (userName) {
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
      <input
        type="text"
        placeholder="Recherche"
        id="search-name"
        onChange={(e) => setUserName(e.target.value.toLowerCase())}
      />
      {usersData &&
        usersData
          .sort((a, b) => a.name.last.localeCompare(b.name.last))
          .map((user) => <UsersCard key={user._id} user={user} />)}
      {/*
  Props: user={user} c'est ça qui devient "user" dans le composant */}
    </div>
  );
};

export default Users;
