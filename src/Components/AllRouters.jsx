import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "../Pages/Home/Home";
import Login from "./Authentication/Login";
import SignUpForm from "./Authentication/Sign-up-form";
import ProductDetails from "../Pages/ProductDetails/ProductDetails";
import AddProduct from "../Pages/AddProduct/AddProduct";
import AllCategory from "../Pages/AllCategory/AllCategory";
import PrivateRoute from "./PrivateRoute";

const AllRouters = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUpForm />} />
      <Route path="/product/:id" element={<ProductDetails />} />
      <Route path="/category/:category" element={<AllCategory />} />
      <Route
        path="/sell"
        element={
          <PrivateRoute>
            <AddProduct />
          </PrivateRoute>
        }
      />
    </Routes>
  );
};

export default AllRouters; 