import axiosInstance from "../../../api/axiosInstance";

/**
 * 🎯 SUB-DISTRIBUTOR API SERVICE
 * Centralized API calls for all sub-distributor operations
 */

export const subDistributorApi = {
    // Get dashboard statistics
    getStats: async () => {
        const response = await axiosInstance.get("/sub-distributor/stats");
        return response.data;
    },

    // Get all orders for the logged-in sub-distributor
    getOrders: async () => {
        const response = await axiosInstance.get("/sub-distributor/orders");
        return response.data;
    },

    // Create a new order
    createOrder: async (orderData) => {
        const response = await axiosInstance.post("/sub-distributor/orders", orderData);
        return response.data;
    },

    // Get available products
    getProducts: async () => {
        const response = await axiosInstance.get("/sub-distributor/products");
        return response.data;
    },

    // Get sales chart data
    getSalesData: async (period = "monthly") => {
        const response = await axiosInstance.get(`/sub-distributor/sales?period=${period}`);
        return response.data;
    },

    // Get user profile
    getProfile: async () => {
        const response = await axiosInstance.get("/sub-distributor/profile");
        return response.data;
    },
};

export default subDistributorApi;
