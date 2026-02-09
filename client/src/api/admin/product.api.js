import axiosInstance from "../axiosInstance";

// ADD PRODUCT
export const addProduct = async (data) => {
  const response = await axiosInstance.post("/api/products/addproduct", data);
  return response.data;
};

// GET ALL PRODUCTS
export const getProducts = async () => {
  const response = await axiosInstance.get("/api/products/getallproducts");
  return response.data;
};

// UPDATE PRODUCT
export const updateProduct = async (id, data) => {
  const response = await axiosInstance.patch(`/api/products/updateproduct/${id}`, data);
  return response.data;
};

// DELETE PRODUCT
export const deleteProduct = async (id) => {
  const response = await axiosInstance.delete(`/api/products/deleteproduct/${id}`);
  return response.data;
};
