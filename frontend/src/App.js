import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.scss";
import HomePage from "./pages/homePage";
import ProductPage from "./pages/productPage";
import Error404 from "./pages/error404";
import LoginForm from "./components/LoginForm/loginForm";
import SignupForm from "./components/SignupForm/SignupForm";
import TodoPage from "./pages/TodoPage/todoPage";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="" element={<HomePage />} />
        <Route path="/product" element={<ProductPage/>} />
        <Route path="*" element={<Error404/>} />
        <Route path="/login" element={<LoginForm/>} />
        <Route path="/signup" element={<SignupForm/>} />
        <Route path="/todo" element={<TodoPage/>} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;