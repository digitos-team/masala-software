import React from "react";
import DistributorSalesChart from "./distributorcomponents/DistributorSalesChart";
import DistributorPendingActions from "./distributorcomponents/DistributorPendingActions";
import {
  AlertTriangle,
  Trophy,
  Target,
  Plus,
  Activity,
  ChevronRight,
  ArrowUpRight,
  Clock,
} from "lucide-react";

const DistributorDashboard = () => {
  return (
    <div className="bg-[#F4F7FE] min-h-screen font-sans p-4 md:p-8 lg:p-10">
      <div className="max-w-[1600px] mx-auto space-y-8">
        {/* --- 👑 HEADER SECTION: Minimal & Sharp --- */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-white/40 p-6 rounded-[2rem] backdrop-blur-md border border-white/60 shadow-sm">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                System Live •{" "}
                <span className="text-slate-900">Masala Pro v2.0</span>
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
              Enterprise <span className="text-indigo-600">Console</span>
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <button className="hidden sm:flex items-center gap-2 text-slate-500 font-bold text-xs bg-white border border-slate-200 px-4 py-2.5 rounded-xl hover:bg-slate-50 transition-all">
              <Clock size={16} /> History
            </button>
            <div className="flex items-center gap-2">
              <button className="p-3.5 rounded-xl bg-white border border-slate-200 text-slate-400 hover:text-rose-500 transition-all shadow-sm">
                <AlertTriangle size={20} />
              </button>
              <button className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-3.5 rounded-xl font-black text-sm shadow-xl shadow-indigo-200 hover:bg-indigo-700 active:scale-95 transition-all">
                <Plus size={18} strokeWidth={3} /> New Order
              </button>
            </div>
          </div>
        </div>

        {/* --- 📊 TOP LAYER: ANALYTICS --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Chart Card */}
          <div className="lg:col-span-2 bg-white rounded-[2.5rem] border border-slate-200/50 shadow-sm overflow-hidden p-2">
            <DistributorSalesChart />
          </div>

          {/* REVENUE GOAL: Glassmorphism Style */}
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200/50 shadow-sm flex flex-col justify-between relative overflow-hidden group">
            <div className="flex justify-between items-start relative z-10">
              <div>
                <h3 className="text-slate-400 font-black text-[11px] uppercase tracking-[0.2em] mb-1">
                  Monthly Target
                </h3>
                <div className="flex items-baseline gap-1">
                  <h4 className="text-5xl font-black text-slate-900 tracking-tighter">
                    78%
                  </h4>
                  <ArrowUpRight
                    className="text-emerald-500"
                    size={24}
                    strokeWidth={3}
                  />
                </div>
              </div>
              <div className="p-4 bg-indigo-50 text-indigo-600 rounded-2xl group-hover:rotate-6 transition-transform">
                <Target size={28} />
              </div>
            </div>

            <div className="relative z-10 mt-6">
              <p className="text-slate-500 font-bold text-sm leading-relaxed mb-6">
                You are <span className="text-slate-900 italic">₹24,000</span>{" "}
                away from your February goal.
              </p>

              <div className="space-y-3">
                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-400">
                  <span>Current Volume</span>
                  <span className="text-indigo-600">₹86,000</span>
                </div>
                <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden border border-slate-200/50 p-[2px]">
                  <div
                    className="bg-indigo-600 h-full rounded-full shadow-[0_0_12px_rgba(79,70,229,0.4)] transition-all duration-1000 ease-out"
                    style={{ width: "78%" }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* --- 🏥 MIDDLE LAYER: NETWORK & HEALTH --- */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* STOCK HEALTH: Simplified List */}
          <div className="lg:col-span-1 bg-white p-8 rounded-[2.5rem] border border-slate-200/50 shadow-sm">
            <div className="flex justify-between items-center mb-8 border-b border-slate-50 pb-4">
              <h3 className="font-black text-slate-900 tracking-tight flex items-center gap-2 text-sm uppercase">
                <Activity size={16} className="text-rose-500" /> Stock Health
              </h3>
              <span className="bg-rose-50 text-rose-600 text-[10px] font-black px-2 py-1 rounded-lg">
                3 ALERTS
              </span>
            </div>

            <div className="space-y-4">
              {["Biryani Masala", "Garam Masala", "Turmeric"].map((item) => (
                <div
                  key={item}
                  className="flex items-center justify-between group p-1 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.6)]"></div>
                    <span className="text-sm font-bold text-slate-600 group-hover:text-slate-900">
                      {item}
                    </span>
                  </div>
                  <ChevronRight
                    size={14}
                    className="text-slate-300 group-hover:translate-x-1 transition-transform"
                  />
                </div>
              ))}
            </div>

            <button className="w-full mt-10 py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-600 shadow-lg shadow-slate-200 transition-all">
              Restock All
            </button>
          </div>

          <div className="lg:col-span-2">
            <DistributorPendingActions />
          </div>

          {/* TOP PERFORMER: Dark Mode Elegance */}
          <div className="lg:col-span-1 bg-slate-900 p-8 rounded-[2.5rem] shadow-2xl shadow-slate-200 text-white relative overflow-hidden group">
            <Trophy className="absolute right-[-10px] bottom-[-10px] text-white/5 w-32 h-32 rotate-12" />

            <h3 className="font-black tracking-[0.1em] text-[10px] uppercase text-indigo-400 mb-8">
              MVP Partner
            </h3>

            <div className="flex items-center gap-4 mb-10 relative z-10">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center font-black text-2xl shadow-lg border border-indigo-400/20">
                A
              </div>
              <div>
                <p className="font-black text-white text-xl tracking-tight leading-none">
                  Sub Dist A
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">
                    ₹32,000 Volume
                  </p>
                </div>
              </div>
            </div>

            <button className="w-full bg-white/10 backdrop-blur-md hover:bg-white/20 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all relative z-10 border border-white/5">
              View All Partners
            </button>
          </div>
        </div>

        {/* --- 📁 DATA TABLE SECTION --- */}
        <div className="bg-white rounded-[2.5rem] border border-slate-200/50 shadow-sm p-2 overflow-hidden">
          <div className="p-8 flex items-center justify-between border-b border-slate-50">
            <div>
              <h3 className="font-black text-slate-900 text-lg tracking-tight">
                Network Activity
              </h3>
              <p className="text-slate-400 text-xs font-bold">
                Monitor all sub-distributor transactions
              </p>
            </div>
            <button className="text-indigo-600 bg-indigo-50 px-4 py-2 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-indigo-600 hover:text-white transition-all">
              Export Report
            </button>
          </div>

          <div className="py-20 flex flex-col items-center justify-center bg-slate-50/30">
            <div className="p-6 bg-white rounded-full shadow-sm mb-4">
              <Activity className="text-slate-200" size={40} />
            </div>
            <p className="text-slate-400 font-bold italic text-sm tracking-tight">
              Awaiting Transaction Stream...
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DistributorDashboard;
