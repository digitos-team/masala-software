import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  UserCircle,
  Package,
  ShoppingCart,
  BarChart3,
  Settings,
  LogOut,
  X,
  Zap,
  ChevronRight,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();
  const { user, logout } = useAuth();
  const role = user?.role?.toLowerCase() || "guest";

  const isActive = (path) =>
    location.pathname === path || location.pathname.startsWith(path + "/");

  const linkClass = (path) => `
    group relative flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold transition-all duration-300
    ${isActive(path)
      ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20 active:scale-[0.98]"
      : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-100"
    }
  `;

  return (
    <>
      {/* 🌑 REFINED OVERLAY */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm z-40 lg:hidden transition-all duration-500"
        />
      )}

      {/* 🚀 MODERN ENTERPRISE SIDEBAR */}
      <aside
        className={`
          fixed lg:static top-0 left-0 z-50
          h-screen w-[280px] bg-[#0F111A] border-r border-slate-800/40
          transform transition-all duration-500 cubic-bezier(0.4, 0, 0.2, 1)
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0
          flex flex-col
        `}
      >
        {/* LOGO: Sharp & Minimal */}
        <div className="p-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-xl shadow-indigo-600/20">
              <Zap size={20} className="text-white fill-white" />
            </div>
            <span className="font-black text-white text-lg tracking-tight uppercase italic">
              MASALA<span className="text-indigo-500">PRO</span>
            </span>
          </div>

          <button
            onClick={onClose}
            className="lg:hidden p-2 rounded-lg bg-slate-800/50 text-slate-400"
          >
            <X size={18} />
          </button>
        </div>

        {/* NAVIGATION: Structured & Balanced */}
        <nav className="flex-1 px-6 space-y-7 overflow-y-auto no-scrollbar">
          {/* Group 1: Analysis */}
          <div className="space-y-1">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-600 mb-3 px-2">
              Analysis
            </p>
            <Link
              to="/dashboard"
              className={linkClass("/dashboard")}
              onClick={onClose}
            >
              <div className="flex items-center gap-3">
                <LayoutDashboard size={18} strokeWidth={2.5} />{" "}
                <span>Dashboard</span>
              </div>
              {isActive("/dashboard") && (
                <ChevronRight size={14} className="opacity-50" />
              )}
            </Link>
          </div>

          {/* Group 2: Business (Role Based) */}
          <div className="space-y-1">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-600 mb-3 px-2">
              Network
            </p>

            {role === "admin" && (
              <>
                <Link
                  to="/distributor-dashboard"
                  className={linkClass("/distributor-dashboard")}
                  onClick={onClose}
                >
                  <div className="flex items-center gap-3">
                    <Users size={18} strokeWidth={2.5} />{" "}
                    <span>Distributors</span>
                  </div>
                </Link>

                <Link
                  to="/subdistributor-dashboard"
                  className={linkClass("/subdistributor-dashboard")}
                  onClick={onClose}
                >
                  <div className="flex items-center gap-3">
                    <UserCircle size={18} strokeWidth={2.5} />{" "}
                    <span>Sub-Partners</span>
                  </div>
                </Link>
              </>
            )}

            <Link
              to="/products"
              className={linkClass("/products")}
              onClick={onClose}
            >
              <div className="flex items-center gap-3">
                <Package size={18} strokeWidth={2.5} /> <span>Inventory</span>
              </div>
            </Link>

            <Link
              to="/orders"
              className={linkClass("/orders")}
              onClick={onClose}
            >
              <div className="flex items-center gap-3">
                <ShoppingCart size={18} strokeWidth={2.5} />{" "}
                <span>Orders</span>
              </div>
            </Link>
          </div>

          {/* Group 3: Config */}
          <div className="space-y-1 pb-10">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-600 mb-3 px-2">
              Configuration
            </p>
            <Link
              to="/reports"
              className={linkClass("/reports")}
              onClick={onClose}
            >
              <div className="flex items-center gap-3">
                <BarChart3 size={18} strokeWidth={2.5} /> <span>Analytics</span>
              </div>
            </Link>
            <Link
              to="/settings"
              className={linkClass("/settings")}
              onClick={onClose}
            >
              <div className="flex items-center gap-3">
                <Settings size={18} strokeWidth={2.5} /> <span>Settings</span>
              </div>
            </Link>
          </div>
        </nav>

        {/* 👤 FOOTER: Clean Logout Section */}
        <div className="p-6 border-t border-slate-800/50">
          <button
            onClick={() => {
              console.log("Sidebar: Logout button clicked");
              logout();
            }}
            className="w-full flex items-center justify-center gap-3 py-3 rounded-xl bg-rose-500/5 border border-rose-500/10 text-rose-500 font-bold text-xs uppercase tracking-widest hover:bg-rose-500 hover:text-white transition-all duration-300"
          >
            <LogOut size={16} strokeWidth={2.5} /> Logout Session
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
