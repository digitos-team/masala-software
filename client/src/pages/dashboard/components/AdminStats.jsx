const AdminStats = ({ stats, onCardClick }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8 sm:mb-10">
      {stats.map((item) => (
        <div
          key={item.title}
          onClick={() => item.isClickable && onCardClick && onCardClick(item.title)}
          className={`group relative overflow-hidden bg-white rounded-2xl sm:rounded-[2rem] border border-slate-100
                     p-4 sm:p-6 shadow-[0_8px_30px_rgba(0,0,0,0.04)]
                     transition-all duration-300 hover:shadow-xl hover:-translate-y-1 active:scale-95
                     ${item.isClickable ? "cursor-pointer" : ""}`}
        >
          {/* Decorative bubble (desktop focus) */}
          <div
            className="absolute -right-6 -top-6 w-16 h-16 bg-indigo-50/60 rounded-full
                          transition-transform duration-700 group-hover:scale-[2]
                          hidden sm:block"
          />

          {/* Content */}
          <div className="relative flex flex-col gap-2">
            {/* Title */}
            <p className="text-[10px] sm:text-[11px] font-black uppercase tracking-[0.15em] text-slate-400 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.6)]" />
              {item.title}
            </p>

            {/* Value */}
            <h2
              className="text-xl sm:text-2xl lg:text-3xl font-black tracking-tight text-slate-900
                           group-hover:text-indigo-600 transition-colors"
            >
              {item.value}
            </h2>

            {/* Subtle indicator (mobile UX polish) */}
            <div className="mt-2 sm:hidden flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
              <span className="text-[10px] text-slate-400 font-semibold">
                Updated today
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AdminStats;
