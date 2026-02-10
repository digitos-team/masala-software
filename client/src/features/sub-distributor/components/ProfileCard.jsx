import { useState, useEffect } from "react";
import { User, MapPin, Calendar, ShieldCheck, Mail } from "lucide-react";
import subDistributorApi from "../api/subDistributorApi";

const ProfileCard = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await subDistributorApi.getProfile();
        setUser(response.data);
      } catch (error) {
        console.error("Failed to fetch profile:", error);
        // Fallback to user from localStorage if available
        const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
        setUser(storedUser);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden sticky top-8 h-96 flex items-center justify-center">
        <div className="text-slate-400">Loading profile...</div>
      </div>
    );
  }

  // Format join date
  const joinedDate = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    })
    : "N/A";

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden sticky top-8">
      {/* Top Decoration Header */}
      <div className="h-20 bg-gradient-to-r from-indigo-500 to-purple-600 w-full" />

      {/* Profile Info Section */}
      <div className="px-6 pb-6">
        <div className="relative flex justify-center mt-[-40px] mb-4">
          <div className="p-1 bg-white rounded-2xl shadow-md">
            <div className="bg-slate-100 h-20 w-20 rounded-xl flex items-center justify-center border-2 border-white overflow-hidden">
              <User className="text-slate-400 w-10 h-10" />
            </div>
          </div>
          {/* Status Badge on Avatar */}
          <div
            className="absolute bottom-1 right-[35%] bg-emerald-500 border-4 border-white w-5 h-5 rounded-full shadow-sm"
            title="Active Status"
          ></div>
        </div>

        <div className="text-center mb-6">
          <h3 className="text-xl font-extrabold text-slate-800 tracking-tight leading-tight">
            {user?.fullname || user?.name || "User"}
          </h3>
          <div className="flex items-center justify-center gap-1 text-slate-500 mt-1">
            <MapPin size={14} className="text-indigo-500" />
            <span className="text-xs font-semibold uppercase tracking-wider">
              {user?.role || "Retailer"}
            </span>
          </div>
        </div>

        {/* Info Grid */}
        <div className="space-y-4 border-t border-slate-50 pt-5">
          <div className="flex items-center justify-between group">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-slate-50 rounded-lg group-hover:bg-indigo-50 transition-colors">
                <ShieldCheck
                  size={16}
                  className="text-slate-400 group-hover:text-indigo-600"
                />
              </div>
              <span className="text-sm font-medium text-slate-500">Status</span>
            </div>
            <span className="text-sm font-bold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-100">
              Active
            </span>
          </div>

          <div className="flex items-center justify-between group">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-slate-50 rounded-lg group-hover:bg-indigo-50 transition-colors">
                <Calendar
                  size={16}
                  className="text-slate-400 group-hover:text-indigo-600"
                />
              </div>
              <span className="text-sm font-medium text-slate-500">Joined</span>
            </div>
            <span className="text-sm font-bold text-slate-700">
              {joinedDate}
            </span>
          </div>

          <div className="flex items-center justify-between group">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-slate-50 rounded-lg group-hover:bg-indigo-50 transition-colors">
                <Mail
                  size={16}
                  className="text-slate-400 group-hover:text-indigo-600"
                />
              </div>
              <span className="text-sm font-medium text-slate-500">Email</span>
            </div>
            <span className="text-xs font-bold text-slate-700 truncate max-w-[120px]" title={user?.email}>
              {user?.email || "N/A"}
            </span>
          </div>
        </div>

        {/* Action Button */}
        <button className="w-full mt-6 bg-slate-900 hover:bg-black text-white py-3 rounded-xl text-sm font-bold transition-all shadow-lg shadow-slate-200 flex items-center justify-center gap-2 active:scale-95">
          Edit Profile
        </button>
      </div>
    </div>
  );
};

export default ProfileCard;
