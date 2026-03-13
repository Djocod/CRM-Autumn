import React from "react";
import Navigation from "../components/Navigation";
import Products from "../components/Products";

const Book = () => {
  return (
    <div className="body-book">
      <Products />
      <Navigation />
    </div>
  );
};

export default Book;
