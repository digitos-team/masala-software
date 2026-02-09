import { useState } from "react";

const DashboardLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen flex bg-slate-50 relative">
      {/* 🔥 MOBILE OVERLAY */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ✅ SIDEBAR */}
      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-40 w-64
          bg-white border-r border-slate-200
          transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        {/* Sidebar Header */}
        <div className="h-14 flex items-center justify-between px-4 border-b">
          <span className="font-extrabold text-slate-800">Masala Admin</span>

          {/* Close button (mobile only) */}
          <button
            className="lg:hidden text-xl font-bold"
            onClick={() => setSidebarOpen(false)}
          >
            ✕
          </button>
        </div>

        {/* Sidebar Navigation */}
        <nav className="p-4 space-y-2">
          <a
            href="/dashboard"
            className="block px-3 py-2 rounded-lg font-medium hover:bg-slate-100"
          >
            Dashboard
          </a>
          <a
            href="/orders"
            className="block px-3 py-2 rounded-lg font-medium hover:bg-slate-100"
          >
            Orders
          </a>
          <a
            href="/products"
            className="block px-3 py-2 rounded-lg font-medium hover:bg-slate-100"
          >
            Products
          </a>
        </nav>
      </aside>

      {/* ✅ MAIN CONTENT */}
      <div className="flex-1 flex flex-col">
        {/* 🔥 TOPBAR */}
        <header className="h-14 bg-white border-b border-slate-200 flex items-center px-4 gap-3">
          {/* Hamburger (mobile only) */}
          <button
            className="lg:hidden text-xl font-bold"
            onClick={() => setSidebarOpen(true)}
          >
            ☰
          </button>

          <h1 className="font-bold text-slate-800">Dashboard</h1>
        </header>

        {/* PAGE CONTENT */}
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
};

export default DashboardLayout;
