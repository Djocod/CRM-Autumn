import React, { useEffect, useState } from "react";
import Users from "../components/Users";
import Navigation from "../components/Navigation";
import axios from "axios";

const Profil = () => {
  const [usersCount, setUsersCount] = useState([]);
  useEffect(() => {
    axios
      .get(`http://localhost:8000/api/users`)
      .then((res) => setUsersCount(res.data.user));
  }, []);
  return (
    <div className="body-profil">
      <Navigation />
      <h2>Vos clients</h2>
      <Users />
      <p className="count-users">{usersCount.length} contacts</p>
    </div>
  );
};

export default Profil;
