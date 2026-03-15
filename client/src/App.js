import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import ProfilUser from "./components/ProfilUser";
import Book from "./pages/Book";
import Profil from "./pages/Profil";
import Wishlist from "./pages/Wishlist";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Profil" element={<Profil />} />
        <Route path="/Book" element={<Book />} />
        <Route path="/Wishlist" element={<Wishlist />} />
        <Route path="/users/:id" element={<ProfilUser />} />
        <Route path="*" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
