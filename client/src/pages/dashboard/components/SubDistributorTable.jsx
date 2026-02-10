import React from "react";
import { User2, Mail, Building2, MoreVertical, Edit2, Trash2 } from "lucide-react";

const SubDistributorTable = ({ subDistributors = [], onEdit, onDelete }) => {
    return (
        <div className="bg-white rounded-[2rem] border border-slate-200/60 shadow-sm overflow-hidden transition-all hover:shadow-xl hover:shadow-slate-200/40">
            {/* Table Header Section */}
            <div className="p-6 border-b border-slate-50 flex justify-between items-center bg-white">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-50 rounded-xl text-indigo-600">
                        <User2 size={20} />
                    </div>
                    <h3 className="text-xl font-black text-slate-800 tracking-tight">
                        Sub-Distributors Network
                    </h3>
                </div>
                <div className="text-sm text-slate-500 font-semibold">
                    Total: {subDistributors.length}
                </div>
            </div>

            {/* Table Wrapper */}
            <div className="overflow-x-auto px-2 pb-2">
                {subDistributors.length === 0 ? (
                    <div className="text-center py-12 text-slate-400">
                        <User2 className="mx-auto mb-3 text-slate-300" size={48} />
                        <p className="font-semibold">No sub-distributors found</p>
                        <p className="text-sm mt-1">Click "Add Sub-Distributor" to get started</p>
                    </div>
                ) : (
                    <table className="w-full border-collapse text-left">
                        <thead>
                            <tr className="bg-slate-50/50">
                                <th className="p-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.15em]">
                                    Name
                                </th>
                                <th className="p-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.15em]">
                                    Email
                                </th>
                                <th className="p-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.15em]">
                                    Parent Distributor
                                </th>
                                <th className="p-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] text-center">
                                    Status
                                </th>
                                <th className="p-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] text-right">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {subDistributors.map((sub) => (
                                <tr
                                    key={sub._id}
                                    className="group hover:bg-indigo-50/30 transition-all duration-200"
                                >
                                    <td className="p-5">
                                        <div className="flex items-center gap-4">
                                            <div className="h-10 w-10 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-500 font-bold border-2 border-white shadow-sm group-hover:bg-white group-hover:text-indigo-600 transition-all">
                                                {sub.name?.charAt(0).toUpperCase() || "S"}
                                            </div>
                                            <div>
                                                <p className="font-black text-slate-800 tracking-tight">
                                                    {sub.name}
                                                </p>
                                                <p className="text-[10px] font-bold text-indigo-500 uppercase tracking-wider">
                                                    Retailer
                                                </p>
                                            </div>
                                        </div>
                                    </td>

                                    <td className="p-5">
                                        <div className="flex items-center gap-2 text-slate-600">
                                            <Mail size={14} className="text-slate-400" />
                                            <span className="text-sm font-medium">{sub.email}</span>
                                        </div>
                                    </td>

                                    <td className="p-5">
                                        <div className="flex items-center gap-2 text-slate-600">
                                            <Building2 size={14} className="text-slate-400" />
                                            <span className="text-sm font-medium">
                                                {sub.parentDistributor?.name || "Not Assigned"}
                                            </span>
                                        </div>
                                    </td>

                                    <td className="p-5 text-center">
                                        <span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-lg font-black text-xs border border-emerald-200">
                                            Active
                                        </span>
                                    </td>

                                    <td className="p-5 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => onEdit && onEdit(sub)}
                                                className="p-2 hover:bg-indigo-50 rounded-lg transition-colors text-slate-400 hover:text-indigo-600"
                                                title="Edit"
                                            >
                                                <Edit2 size={16} />
                                            </button>
                                            <button
                                                onClick={() => onDelete && onDelete(sub._id)}
                                                className="p-2 hover:bg-red-50 rounded-lg transition-colors text-slate-400 hover:text-red-600"
                                                title="Delete"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Table Footer */}
            {subDistributors.length > 0 && (
                <div className="p-4 bg-slate-50/30 border-t border-slate-50 text-center">
                    <p className="text-xs text-slate-500 font-medium">
                        Showing {subDistributors.length} sub-distributor{subDistributors.length !== 1 ? "s" : ""}
                    </p>
                </div>
            )}
        </div>
    );
};

export default SubDistributorTable;
