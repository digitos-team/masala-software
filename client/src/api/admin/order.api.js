import axiosInstance from "../axiosInstance";

// GET ALL ORDERS (Admin)
export const getAllOrders = async (params) => {
    const response = await axiosInstance.get("/orders/getorders", { params });
    return response.data;
};

// GET SINGLE ORDER
export const getOrder = async (id) => {
    const response = await axiosInstance.get(`/orders/getorderbyid/${id}`);
    return response.data;
};

// UPDATE ORDER STATUS (Admin/System)
export const updateOrderStatus = async (id, status, reason = null) => {
    const response = await axiosInstance.patch(`/orders/updatestatus/${id}`, { status, reason });
    return response.data;
};

// UPDATE ORDER DETAILS (Distributor/Admin)
export const updateOrder = async (id, orderData) => {
    const response = await axiosInstance.patch(`/orders/updateorder/${id}`, orderData);
    return response.data;
};
// CREATE NEW ORDER
export const createOrder = async (orderData) => {
    const response = await axiosInstance.post("/orders/neworder", orderData);
    return response.data;
};

// GET ORDER STATS (Admin)
export const getOrderStats = async () => {
    const response = await axiosInstance.get("/orders/orderstats");
    return response.data;
};

// GET REVENUE REPORT (Admin)
export const getRevenueReport = async (params) => {
    const response = await axiosInstance.get("/orders/revenue", { params });
    return response.data;
};

// GET TOP SELLING PRODUCTS (Admin)
export const getTopSellingProducts = async (limit = 5) => {
    const response = await axiosInstance.get(`/orders/top-products?limit=${limit}`);
    return response.data;
};
