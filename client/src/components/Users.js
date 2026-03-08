import React, { useEffect, useState } from "react";
import axios from "axios";
import UsersCard from "./UsersCard";

const Users = () => {
  const [usersData, setUsersData] = useState([]);

  useEffect(() => {
    axios
      .get(`http://localhost:8000/api/users`)
      .then((res) => setUsersData(res.data.user));
  }, []);
  return (
    <div className="users-container">
      {usersData.length > 0 &&
        usersData
          .sort((a, b) => a.name.last.localeCompare(b.name.last))
          .map((user) => <UsersCard key={user._id} user={user} />)}
      {/*Props: user={user} c'est ça qui devient "user" dans le composant */}
    </div>
  );
};

export default Users;
