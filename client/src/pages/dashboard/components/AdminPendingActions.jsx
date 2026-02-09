import { AlertTriangle, Truck, PackageX } from "lucide-react";

const actions = [
  {
    title: "Orders Pending Approval",
    count: 5,
    description: "Orders waiting for admin approval",
    icon: AlertTriangle,
    styles: {
      bg: "bg-amber-50",
      text: "text-amber-700",
      border: "border-amber-200",
    },
  },
  {
    title: "Ready for Dispatch",
    count: 3,
    description: "Approved orders not dispatched",
    icon: Truck,
    styles: {
      bg: "bg-blue-50",
      text: "text-blue-700",
      border: "border-blue-200",
    },
  },
  {
    title: "Low Stock Alerts",
    count: 2,
    description: "Products running low on stock",
    icon: PackageX,
    styles: {
      bg: "bg-rose-50",
      text: "text-rose-700",
      border: "border-rose-200",
    },
  },
];

const AdminPendingActions = () => {
  return (
    <div className="relative z-0 bg-white rounded-3xl border border-slate-100 p-4 sm:p-6 shadow-sm ">
      {/* Header */}
      <div className="mb-5">
        <h3 className="text-lg sm:text-xl font-extrabold text-slate-800">
          Pending Actions
        </h3>
        <p className="text-xs text-slate-400 mt-1">
          Tasks that require immediate attention
        </p>
      </div>

      {/* Actions */}
      <div className="space-y-3 sm:space-y-4">
        {actions.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.title}
              className={`p-4 rounded-2xl border ${item.styles.bg} ${item.styles.border}`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  {/* Icon */}
                  <div
                    className={`p-2 rounded-xl ${item.styles.bg} ${item.styles.text} shrink-0`}
                  >
                    <Icon size={18} />
                  </div>

                  {/* Text */}
                  <div>
                    <p className="text-sm font-bold text-slate-800">
                      {item.title}
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {item.description}
                    </p>
                  </div>
                </div>

                {/* Count */}
                <span
                  className={`px-3 py-1 rounded-full text-sm sm:text-base font-extrabold ${item.styles.text} ${item.styles.bg}`}
                >
                  {item.count}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AdminPendingActions;
