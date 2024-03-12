import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.scss";
import HomePage from "./pages/homePage";
import ProductPage from "./pages/productPage";
import Error404 from "./pages/error404";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="" element={<HomePage />} />
        <Route path="/product" element={<ProductPage/>} />
        <Route path="*" element={<Error404/>} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;