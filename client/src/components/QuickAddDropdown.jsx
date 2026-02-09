import React, { useState, useRef, useEffect } from "react";
import { Plus, Users, UserCircle, ChevronDown } from "lucide-react";

/**
 * ⚡ QUICK ADD DROPDOWN
 * A premium dropdown button for the header to quickly add distributors or sub-distributors.
 */
const QuickAddDropdown = ({ onAddDistributor, onAddSubDistributor }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={dropdownRef}>
            {/* 🔘 MAIN ACTION BUTTON */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`
          flex items-center gap-2 px-4 py-2.5 rounded-2xl font-black text-sm transition-all duration-300 active:scale-95
          ${isOpen
                        ? "bg-slate-900 text-white shadow-xl shadow-slate-200"
                        : "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20 hover:bg-indigo-700"}
        `}
            >
                <Plus size={18} strokeWidth={3} />
                <span className="hidden sm:inline">Quick Add</span>
                <ChevronDown
                    size={14}
                    strokeWidth={3}
                    className={`transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
                />
            </button>

            {/* 📑 DROPDOWN MENU */}
            {isOpen && (
                <div className="absolute right-0 mt-3 w-64 bg-white rounded-3xl shadow-2xl border border-slate-100 py-3 z-[60] animate-in slide-in-from-top-2 fade-in duration-200">
                    <div className="px-5 py-2 mb-2">
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                            Create New
                        </p>
                    </div>

                    <button
                        onClick={() => {
                            onAddDistributor();
                            setIsOpen(false);
                        }}
                        className="w-full flex items-center gap-4 px-5 py-3.5 hover:bg-slate-50 text-slate-700 transition-colors group"
                    >
                        <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                            <Users size={18} strokeWidth={2.5} />
                        </div>
                        <div className="flex flex-col items-start leading-none">
                            <span className="text-sm font-bold">Add Distributor</span>
                            <span className="text-[10px] text-slate-400 mt-1">Direct partner network</span>
                        </div>
                    </button>

                    <button
                        onClick={() => {
                            onAddSubDistributor();
                            setIsOpen(false);
                        }}
                        className="w-full flex items-center gap-4 px-5 py-3.5 hover:bg-slate-50 text-slate-700 transition-colors group"
                    >
                        <div className="p-2 bg-purple-50 text-purple-600 rounded-xl group-hover:bg-purple-600 group-hover:text-white transition-colors">
                            <UserCircle size={18} strokeWidth={2.5} />
                        </div>
                        <div className="flex flex-col items-start leading-none">
                            <span className="text-sm font-bold">Add Sub-Distributor</span>
                            <span className="text-[10px] text-slate-400 mt-1">Secondary partner tier</span>
                        </div>
                    </button>
                </div>
            )}
        </div>
    );
};

export default QuickAddDropdown;
