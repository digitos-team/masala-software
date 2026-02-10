import { Pencil, Trash2, Key } from "lucide-react";

const DistributorTable = ({ distributors, onEdit, onDelete, onResetPassword }) => {
  return (
    <div className="bg-white rounded-2xl sm:rounded-[2rem] shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-slate-100 overflow-hidden transition-all duration-300">
      {/* Header */}
      <div className="p-4 sm:p-6 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="text-lg sm:text-xl font-black tracking-tight text-slate-800">
            Active Distributors
          </h3>
        </div>

        <span className="px-3 py-1 bg-indigo-50 text-indigo-600 text-[10px] font-black rounded-full uppercase tracking-widest border border-indigo-100">
          Management Console
        </span>
      </div>

      {/* Table */}
      <div className="overflow-x-auto scrollbar-hide">
        <table className="w-full min-w-[640px] text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/60">
              <th className="px-4 sm:px-6 py-3 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                Member Details
              </th>
              <th className="px-4 sm:px-6 py-3 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                Email / Contact
              </th>
              <th className="px-4 sm:px-6 py-3 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                Created At
              </th>
              <th className="px-4 sm:px-6 py-3 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 text-right">
                Status
              </th>
              <th className="px-4 sm:px-6 py-3 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 text-right">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100 italic">
            {distributors.map((dist) => (
              <tr
                key={dist._id}
                className="group hover:bg-indigo-50/40 transition-colors"
              >
                {/* Distributor */}
                <td className="px-4 sm:px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 font-bold text-xs
                                    group-hover:bg-indigo-600 group-hover:text-white transition shadow-sm"
                    >
                      {dist.name?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-black text-slate-700 leading-none">{dist.name}</p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1.5">{dist.role}</p>
                    </div>
                  </div>
                </td>

                {/* Email / Contact */}
                <td className="px-4 sm:px-6 py-4">
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-slate-500">{dist.email || "N/A"}</span>
                    <span className="text-[10px] font-semibold text-slate-400 mt-0.5">{dist.phone || "N/A"}</span>
                  </div>
                </td>

                {/* Created At */}
                <td className="px-4 sm:px-6 py-4 text-xs font-bold text-slate-400">
                  {new Date(dist.createdAt).toLocaleDateString()}
                </td>

                {/* Status */}
                <td className="px-4 sm:px-6 py-4 text-right">
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-lg text-xs font-black border uppercase tracking-widest ${dist.status === "inactive"
                      ? "bg-slate-100 text-slate-500 border-slate-200"
                      : "bg-indigo-50 text-indigo-600 border-indigo-100"
                      }`}
                  >
                    {dist.status || "Active"}
                  </span>
                </td>

                {/* Actions */}
                <td className="px-4 sm:px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => onEdit(dist)}
                      className="p-2 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all"
                      title="Edit Distributor"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      onClick={() => onResetPassword(dist)}
                      className="p-2 rounded-lg text-slate-400 hover:text-amber-600 hover:bg-amber-50 transition-all"
                      title="Reset Password"
                    >
                      <Key size={16} />
                    </button>
                    <button
                      onClick={() => onDelete(dist._id)}
                      className="p-2 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-all"
                      title="Delete Distributor"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DistributorTable;
