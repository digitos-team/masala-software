import axiosInstance from "../axiosInstance";

// CREATE NEW PAYMENT
export const createPayment = async (paymentData) => {
    const response = await axiosInstance.post("/payments/createpayment", paymentData);
    return response.data;
};

// GET PAYMENTS BY ORDER
export const getPaymentsByOrder = async (orderId) => {
    const response = await axiosInstance.get(`/payments/order/${orderId}`);
    return response.data;
};

// GET ALL PAYMENTS (Filtered)
export const getAllPayments = async (params) => {
    const response = await axiosInstance.get("/payments/getpayments", { params });
    return response.data;
};

// GET PAYMENT STATS
export const getPaymentStats = async (params) => {
    const response = await axiosInstance.get("/payments/paymentstats", { params });
    return response.data;
};

// GET PAYMENT HISTORY
export const getPaymentHistory = async (params) => {
    const response = await axiosInstance.get("/payments/paymenthistory", { params });
    return response.data;
};

// GET REVENUE BY METHOD
export const getRevenueByMethod = async (params) => {
    const response = await axiosInstance.get("/payments/paymentrevenue", { params });
    return response.data;
};
