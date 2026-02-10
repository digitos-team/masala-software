import axiosInstance from "../axiosInstance";

// ADD PRODUCT
export const addProduct = async (data) => {
  const response = await axiosInstance.post("/products/addproduct", data);
  return response.data;
};

// GET ALL PRODUCTS
export const getProducts = async (params) => {
  const response = await axiosInstance.get("/products/getallproducts", { params });
  return response.data;
};

// UPDATE PRODUCT
export const updateProduct = async (id, data) => {
  const response = await axiosInstance.patch(`/products/updateproduct/${id}`, data);
  return response.data;
};

// DELETE PRODUCT
export const deleteProduct = async (id) => {
  const response = await axiosInstance.delete(`/products/deleteproduct/${id}`);
  return response.data;
};

// GET PRODUCT STATS (Admin)
export const getProductStats = async () => {
  const response = await axiosInstance.get("/products/stats");
  return response.data;
};
