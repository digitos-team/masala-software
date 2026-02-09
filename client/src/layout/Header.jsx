import {
  Menu,
  Bell,
  Settings,
  ChevronRight,
  LayoutGrid,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

const Header = ({ onMenuClick }) => {
  const { user } = useAuth();

  // Get initials for avatar
  const getInitials = (name) => {
    if (!name) return "??";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <header className="h-20 bg-white/90 backdrop-blur-xl border-b border-slate-200/50 flex items-center justify-between px-6 sm:px-10 sticky top-0 z-40">
      {/* --- LEFT: NAVIGATION CONTEXT --- */}
      <div className="flex items-center gap-4 sm:gap-6">
        {/* MOBILE TOGGLE */}
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-600 active:scale-95 transition-all"
        >
          <Menu size={20} strokeWidth={2.5} />
        </button>

        {/* BREADCRUMB UI (Very Premium) */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex p-2 bg-indigo-50 rounded-lg text-indigo-600">
            <LayoutGrid size={18} strokeWidth={2.5} />
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2">
            <span className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">
              Platform
            </span>
            <ChevronRight
              size={14}
              className="hidden sm:block text-slate-300"
            />
            <span className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
              Dashboard
            </span>
          </div>
        </div>
      </div>

      {/* --- RIGHT: GLOBAL ACTIONS & USER --- */}
      <div className="flex items-center gap-3 sm:gap-8">
        {/* ACTION ICONS GROUP */}
        <div className="flex items-center gap-1 sm:gap-3 px-3 py-1.5 bg-slate-50 rounded-2xl border border-slate-100">
          <button className="p-2 text-slate-400 hover:text-indigo-600 transition-colors rounded-lg hover:bg-white">
            <Settings size={18} strokeWidth={2.5} />
          </button>

          <div className="w-px h-4 bg-slate-200" />

          <button className="relative p-2 text-slate-400 hover:text-indigo-600 transition-colors rounded-lg hover:bg-white">
            <Bell size={18} strokeWidth={2.5} />
            <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-white" />
          </button>
        </div>

        {/* USER PROFILE CARD (Simplified) */}
        <div className="flex items-center gap-4 group cursor-pointer border-l border-slate-100 pl-4 sm:pl-8">
          <div className="hidden md:flex flex-col items-end leading-tight">
            <span className="text-[13px] font-black text-slate-800">
              {user?.name || "User Name"}
            </span>
            <span className="text-[9px] font-black uppercase text-indigo-500 tracking-widest mt-0.5">
              {user?.role ? `${user.role} Account` : "Account"}
            </span>
          </div>

          {/* MODERN AVATAR */}
          <div className="relative">
            <div className="w-11 h-11 rounded-2xl bg-slate-900 flex items-center justify-center shadow-lg shadow-slate-200 transition-transform group-hover:scale-105 duration-300">
              <span className="text-white font-black text-xs tracking-tighter">
                {getInitials(user?.name)}
              </span>
            </div>
            {/* Online Indicator Badge */}
            <div className="absolute -bottom-1 -right-1 bg-white p-0.5 rounded-full">
              <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full border border-white" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
