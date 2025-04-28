import axios from "axios";

const BASE_URL = "http://localhost:5000/api";

export const getPostsApiAllCategory = async () => {
  let res = await axios.get(
    `${BASE_URL}/products`
  );
  return res.data;
};

export const getPostsApiCars = async () => {
  let res = await axios.get(
    `${BASE_URL}/products?category=car`
  );
  return res.data;
};

export const getPostsApiBikes = async () => {
  let res = await axios.get(
    `${BASE_URL}/products?category=bike`
  );
  return res.data;
};

export const getPostsApiMobiles = async () => {
  let res = await axios.get(
    `${BASE_URL}/products?category=mobile`
  );
  return res.data;
};

export const getPostsApiHouse = async () => {
  let res = await axios.get(
    `${BASE_URL}/products?category=home_and_apartment`
  );
  return res.data;
};

export const getAllProducts = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/products`);
        return response.data;
    } catch (error) {
        console.error('Error fetching all products:', error);
        throw error;
    }
};
