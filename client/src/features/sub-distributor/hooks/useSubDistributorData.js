import { useState, useEffect } from "react";
import subDistributorApi from "../api/subDistributorApi";

/**
 * Custom hook to fetch sub-distributor dashboard data
 */
export const useSubDistributorData = () => {
    const [stats, setStats] = useState(null);
    const [orders, setOrders] = useState([]);
    const [salesData, setSalesData] = useState([]);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);

                // Fetch all data in parallel
                const [statsRes, ordersRes, salesRes, productsRes] = await Promise.all([
                    subDistributorApi.getStats(),
                    subDistributorApi.getOrders(),
                    subDistributorApi.getSalesData(),
                    subDistributorApi.getProducts(),
                ]);

                setStats(statsRes.data);
                setOrders(ordersRes.data);
                setSalesData(salesRes.data);
                setProducts(productsRes.data);
            } catch (err) {
                console.error("Failed to fetch sub-distributor data:", err);
                setError(err.message || "Failed to load data");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const refetchStats = async () => {
        try {
            const statsRes = await subDistributorApi.getStats();
            setStats(statsRes.data);
        } catch (err) {
            console.error("Failed to refetch stats:", err);
        }
    };

    const refetchOrders = async () => {
        try {
            const ordersRes = await subDistributorApi.getOrders();
            setOrders(ordersRes.data);
        } catch (err) {
            console.error("Failed to refetch orders:", err);
        }
    };

    return {
        stats,
        orders,
        salesData,
        products,
        loading,
        error,
        refetchStats,
        refetchOrders,
    };
};
