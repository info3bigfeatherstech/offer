/**
 * AdminProfileCard.jsx
 * Fully independent — fetches and displays admin's own profile.
 * Read-only. No props required.
 */

import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAdminProfile } from "../../ADMIN_REDUX_MANAGEMENT/staffSlice";
import { User, Mail, Phone, Shield, Clock } from "lucide-react";

import { ROLE_LABELS } from "../../roles";

const AdminProfileCard = () => {
  const dispatch = useDispatch();
  const { adminProfile, loading } = useSelector((state) => state.staff);

  useEffect(() => {
    dispatch(fetchAdminProfile());
  }, [dispatch]);

  if (loading.profile) {
    return (
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm animate-pulse">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-slate-200" />
          <div className="space-y-2">
            <div className="h-4 w-40 bg-slate-200 rounded" />
            <div className="h-3 w-28 bg-slate-100 rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (!adminProfile) return null;

  const initials = adminProfile.name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  const joinedDate = new Date(adminProfile.createdAt).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  return (
    <div className="bg-gradient-to-br from-indigo-50 to-white border border-indigo-100 rounded-2xl p-6 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Left — avatar + name */}
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-indigo-600 text-white flex items-center justify-center text-lg font-bold shadow-md shadow-indigo-200 shrink-0">
            {initials}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-slate-900">{adminProfile.name}</h3>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 text-indigo-700 border border-indigo-200">
                <Shield size={10} />
               {ROLE_LABELS[adminProfile.role] || adminProfile.role}
              </span>
            </div>
            <p className="text-xs text-slate-400 flex items-center gap-1 mt-1">
              <Clock size={11} />
              Admin since {joinedDate}
            </p>
          </div>
        </div>

        {/* Right — contact details */}
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 text-sm text-slate-600">
          <div className="flex items-center gap-2">
            <Mail size={14} className="text-indigo-400 shrink-0" />
            <span className="font-medium">{adminProfile.email}</span>
          </div>
          {adminProfile.phone && (
            <div className="flex items-center gap-2">
              <Phone size={14} className="text-indigo-400 shrink-0" />
              <span className="font-medium">{adminProfile.phone}</span>
            </div>
          )}
          <div className="flex items-center gap-2">
            <User size={14} className="text-indigo-400 shrink-0" />
            <span
              className={`text-xs font-bold px-2 py-0.5 rounded-full border ${
                adminProfile.status === "active"
                  ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                  : "bg-rose-50 text-rose-600 border-rose-100"
              }`}
            >
              {adminProfile.status?.charAt(0).toUpperCase() + adminProfile.status?.slice(1)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProfileCard;