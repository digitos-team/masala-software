import React, { useState, useEffect, useMemo } from "react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Legend
} from "recharts";
import AdminStats from "./components/AdminStats";
import { getOrderStats, getRevenueReport, getTopSellingProducts } from "../../api/admin/order.api";
import { getPaymentStats, getRevenueByMethod } from "../../api/admin/payment.api";
import AdminSalesChart from "./components/AdminSalesChart";
import { getAllOrders } from "../../api/admin/order.api";
import { getPaymentHistory } from "../../api/admin/payment.api";

const Analytics = () => {
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        orders: null,
        revenue: null,
        payments: null,
        topProducts: [],
        revenueByMethod: [],
        rawOrders: [],
        rawPayments: []
    });

    const [dateRange, setDateRange] = useState("thisMonth");

    useEffect(() => {
        fetchAnalyticsData();
    }, [dateRange]);

    const fetchAnalyticsData = async () => {
        setLoading(true);
        try {
            const today = new Date();
            let startDate = new Date();

            if (dateRange === "thisMonth") {
                startDate = new Date(today.getFullYear(), today.getMonth(), 1);
            } else if (dateRange === "lastMonth") {
                startDate = new Date(today.getFullYear(), today.getMonth() - 1, 1);
            } else if (dateRange === "last3Months") {
                startDate = new Date(today.getFullYear(), today.getMonth() - 3, 1);
            } else if (dateRange === "thisYear") {
                startDate = new Date(today.getFullYear(), 0, 1);
            }

            const formattedStartDate = startDate.toISOString().split('T')[0];
            const formattedEndDate = today.toISOString().split('T')[0];

            // Calculate 6 months ago for the trend chart
            const sixMonthsAgo = new Date();
            sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
            sixMonthsAgo.setDate(1); // Set to 1st of the month
            const formattedSixMonthsAgo = sixMonthsAgo.toISOString().split('T')[0];

            // Fetch all necessary data in parallel
            const [
                orderStatsRes,
                revenueReportRes,
                paymentStatsRes,
                topProductsRes,
                revenueByMethodRes,
                allOrdersRes,
                allPaymentsRes
            ] = await Promise.all([
                getOrderStats(), // Overall stats
                getRevenueReport({ startDate: formattedStartDate, endDate: formattedEndDate }),
                getPaymentStats({ startDate: formattedStartDate, endDate: formattedEndDate }),
                getTopSellingProducts(5),
                getRevenueByMethod({ startDate: formattedStartDate, endDate: formattedEndDate }),
                // Fetch 6 months of data for the chart, regardless of selected date range
                getAllOrders({ startDate: formattedSixMonthsAgo, limit: 2000 }),
                getPaymentHistory({ startDate: formattedSixMonthsAgo, limit: 2000 })
            ]);

            setStats({
                orders: orderStatsRes.data,
                revenue: revenueReportRes.data,
                payments: paymentStatsRes.data,
                topProducts: topProductsRes.data,
                revenueByMethod: revenueByMethodRes.data?.revenueByMethod || [],
                rawOrders: allOrdersRes.data.orders || [],
                rawPayments: allPaymentsRes.data.payments || []
            });

        } catch (error) {
            console.error("Error fetching analytics:", error);
        } finally {
            setLoading(false);
        }
    };

    // Cards Data
    const cardsData = useMemo(() => {
        if (!stats.revenue) return [];

        return [
            { title: "Total Revenue", value: `₹${(stats.revenue.totalRevenue || 0).toLocaleString()}`, color: "indigo" },
            { title: "Total Orders", value: (stats.revenue.totalOrders || 0).toString(), color: "blue" },
            { title: "Avg. Order Value", value: `₹${(stats.revenue.averageOrderValue || 0).toLocaleString()}`, color: "purple" },
            { title: "Total Collections", value: `₹${(stats.payments?.totalRevenue || 0).toLocaleString()}`, color: "emerald" },
        ];
    }, [stats]);

    // Transform Data for Charts
    const paymentMethodData = useMemo(() => {
        return stats.revenueByMethod.map(item => ({
            name: item._id,
            value: item.totalRevenue
        }));
    }, [stats.revenueByMethod]);

    const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

    const orderStatusData = useMemo(() => {
        if (!stats.orders?.ordersByStatus) return [];
        return stats.orders.ordersByStatus.map(item => ({
            name: item._id,
            value: item.count
        }));
    }, [stats.orders]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-10">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-black text-slate-800 tracking-tight">Analytics Dashboard</h1>
                    <p className="text-sm font-medium text-slate-500 mt-1">Deep dive into your business performance</p>
                </div>

                <select
                    value={dateRange}
                    onChange={(e) => setDateRange(e.target.value)}
                    className="px-4 py-2 bg-white border border-slate-200 rounded-xl font-bold text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-sm shadow-sm"
                >
                    <option value="thisMonth">This Month</option>
                    <option value="lastMonth">Last Month</option>
                    <option value="last3Months">Last 3 Months</option>
                    <option value="thisYear">This Year</option>
                </select>
            </div>

            {/* KPI Cards */}
            <AdminStats stats={cardsData} />

            {/* Revenue Trend Chart */}
            <section className="bg-white rounded-[2rem] border border-slate-100 p-6 shadow-sm">
                <AdminSalesChart orders={stats.rawOrders} payments={stats.rawPayments} />
            </section>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                {/* Top Selling Products */}
                <section className="bg-white rounded-[2rem] border border-slate-100 p-6 shadow-sm flex flex-col">
                    <h3 className="text-lg font-black text-slate-800 mb-6">Top Selling Products</h3>
                    <div className="flex-1 min-h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                layout="vertical"
                                data={stats.topProducts}
                                margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
                            >
                                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                                <XAxis type="number" hide />
                                <YAxis
                                    dataKey="productName"
                                    type="category"
                                    width={100}
                                    tick={{ fontSize: 11, fontWeight: 600, fill: '#64748b' }}
                                />
                                <Tooltip
                                    cursor={{ fill: '#f8fafc' }}
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                                />
                                <Bar dataKey="totalRevenue" fill="#6366f1" radius={[0, 4, 4, 0]} barSize={20} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </section>

                {/* Payment Methods */}
                <section className="bg-white rounded-[2rem] border border-slate-100 p-6 shadow-sm flex flex-col">
                    <h3 className="text-lg font-black text-slate-800 mb-6">Revenue by Payment Method</h3>
                    <div className="flex-1 min-h-[300px] flex items-center justify-center">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={paymentMethodData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={100}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {paymentMethodData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend verticalAlign="bottom" height={36} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </section>

                {/* Order Status Distribution */}
                <section className="bg-white rounded-[2rem] border border-slate-100 p-6 shadow-sm flex flex-col lg:col-span-2">
                    <h3 className="text-lg font-black text-slate-800 mb-6">Order Status Distribution</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                        {orderStatusData.map((item, index) => (
                            <div key={index} className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex flex-col items-center justify-center text-center">
                                <span className={`text-2xl font-black mb-1
                  ${item.name === 'delivered' ? 'text-emerald-500' :
                                        item.name === 'placed' ? 'text-blue-500' :
                                            item.name === 'cancelled' ? 'text-red-500' : 'text-slate-600'}
                `}>
                                    {item.value}
                                </span>
                                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                                    {item.name}
                                </span>
                            </div>
                        ))}
                    </div>
                </section>

            </div>
        </div>
    );
};

export default Analytics;
