import SubDistributorStats from "../dashboard/subDistributorComponents/SubDistributorStats";
import MySalesChart from "../dashboard/subDistributorComponents/MySalesChart";
import MyOrders from "../dashboard/subDistributorComponents/MyOrders";
import CreateOrder from "../dashboard/subDistributorComponents/CreateOrder";
import ProfileCard from "../dashboard/subDistributorComponents/ProfileCard";

const SubDistributorDashboard = () => {
  return (
    <div className="bg-[#f8fafc] min-h-screen p-4 md:p-8">
      {/* Header Section */}
      <div className="max-w-7xl mx-auto mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
            Sub-Distributor Dashboard
          </h1>
          <p className="text-slate-500 text-sm mt-1 font-medium">
            Welcome back! Here's what's happening with your sales today.
          </p>
        </div>

        {/* Optional: Add a quick action button here if needed */}
        <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-sm active:scale-95">
          Download Report
        </button>
      </div>

      <div className="max-w-7xl mx-auto space-y-8">
        {/* Stats Section - Top Row */}
        <section className="animate-in fade-in duration-500">
          <SubDistributorStats />
        </section>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Side: Charts & Actions (8 Columns) */}
          <div className="lg:col-span-8 space-y-8">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden transition-hover hover:shadow-md">
              <MySalesChart />
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-1 transition-hover hover:shadow-md">
              <CreateOrder />
            </div>
          </div>

          {/* Right Side: Profile & Quick Info (4 Columns) */}
          <div className="lg:col-span-4">
            <div className="sticky top-8">
              <ProfileCard />
              {/* Tip: ProfileCard ke andar ki styling bhi clean rakhna for consistency */}
            </div>
          </div>
        </div>

        {/* Bottom Section: Full Width Orders Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 transition-hover hover:shadow-md overflow-hidden">
          <div className="p-1">
            <MyOrders />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubDistributorDashboard;
