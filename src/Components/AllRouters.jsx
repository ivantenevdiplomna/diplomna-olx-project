import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "../Pages/Home/Home";
import Login from "./Authentication/Login";
import SignUpForm from "./Authentication/Sign-up-form";
import ProductDetails from "../Pages/ProductDetails/ProductDetails";
import AddProduct from "../Pages/AddProduct/AddProduct";
import Category from "../Pages/Category/Category";
import Profile from "../Pages/Profile/Profile";
import PrivateRoute from "./PrivateRoute";

const AllRouters = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUpForm />} />
      <Route path="/product/:id" element={<ProductDetails />} />
      <Route path="/category/:category" element={<Category />} />
      <Route path="/category/:category/:subcategory" element={<Category />} />
      <Route
        path="/sell"
        element={
          <PrivateRoute>
            <AddProduct />
          </PrivateRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <PrivateRoute>
            <Profile />
          </PrivateRoute>
        }
      />
    </Routes>
  );
};

export default AllRouters; 