import axiosInstance from "../axiosInstance";

// SET / UPDATE PRODUCT PRICING
export const setProductPricing = async (productId, data) => {
  const response = await axiosInstance.post(`/api/products/${productId}/pricing`, data);
  return response.data;
};

// GET PRODUCT PRICING
export const getProductPricing = async (productId) => {
  const response = await axiosInstance.get(`/api/products/${productId}/pricing`);
  return response.data;
};
