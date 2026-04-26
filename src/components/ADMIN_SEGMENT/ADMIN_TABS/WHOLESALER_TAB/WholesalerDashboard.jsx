// ADMIN_SEGMENT/ADMIN_TABS/WHOLESALER_TAB/WholesalerDashboard.jsx

import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { WHOLESALER_TAB_REGISTRY } from "./wholesalerTabRegistry";
import RequestsListTab from "./RequestsListTab";
import { useGetWholesalerSummaryQuery } from "../../ADMIN_REDUX_MANAGEMENT/wholesalerApi/wholesalerApi";

const WholesalerDashboard = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeCtab = searchParams.get("ctab") || "all_requests";
  
  const { data: summary, refetch: refetchSummary } = useGetWholesalerSummaryQuery();
  
  const getBadgeCount = (status) => {
    if (!summary?.summary) return null;
    const count = summary.summary[status];
    return count > 0 ? count : null;
  };
  
  const handleTabChange = (tabId) => {
    setSearchParams({ tab: "wholesaler", ctab: tabId });
  };
  
  const renderContent = () => {
    switch (activeCtab) {
      case "all_requests":
        return <RequestsListTab statusFilter="" onRequestAction={refetchSummary} />;
      case "pending_requests":
        return <RequestsListTab statusFilter="pending" onRequestAction={refetchSummary} />;
      case "approved_requests":
        return <RequestsListTab statusFilter="approved" onRequestAction={refetchSummary} />;
      case "rejected_requests":
        return <RequestsListTab statusFilter="rejected" onRequestAction={refetchSummary} />;
      case "activated_requests":
        return <RequestsListTab statusFilter="activated" onRequestAction={refetchSummary} />;
      default:
        return <RequestsListTab statusFilter="" onRequestAction={refetchSummary} />;
    }
  };
  
  return (
    <div className="space-y-6">
      {/* Header with Summary Stats */}
      <div className="grid grid-cols-5 gap-4 mb-6">
        <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
          <div className="text-sm text-gray-500">Total Requests</div>
          <div className="text-2xl font-bold text-gray-900">{summary?.summary?.total || 0}</div>
        </div>
        <div className="bg-yellow-50 rounded-lg border border-yellow-200 p-4 shadow-sm">
          <div className="text-sm text-yellow-700">Pending</div>
          <div className="text-2xl font-bold text-yellow-800">{summary?.summary?.pending || 0}</div>
        </div>
        <div className="bg-green-50 rounded-lg border border-green-200 p-4 shadow-sm">
          <div className="text-sm text-green-700">Approved</div>
          <div className="text-2xl font-bold text-green-800">{summary?.summary?.approved || 0}</div>
        </div>
        <div className="bg-red-50 rounded-lg border border-red-200 p-4 shadow-sm">
          <div className="text-sm text-red-700">Rejected</div>
          <div className="text-2xl font-bold text-red-800">{summary?.summary?.rejected || 0}</div>
        </div>
        <div className="bg-blue-50 rounded-lg border border-blue-200 p-4 shadow-sm">
          <div className="text-sm text-blue-700">Activated</div>
          <div className="text-2xl font-bold text-blue-800">{summary?.summary?.activated || 0}</div>
        </div>
      </div>
      
      {/* Sub-tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {WHOLESALER_TAB_REGISTRY.map((tab) => {
            const badgeCount = getBadgeCount(tab.id.replace('_requests', ''));
            const isActive = activeCtab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`
                  group inline-flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-all duration-200
                  ${isActive
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }
                `}
              >
                <svg
                  className={`w-5 h-5 ${isActive ? 'text-blue-500' : 'text-gray-400 group-hover:text-gray-500'}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={tab.icon} />
                </svg>
                {tab.label}
                {badgeCount !== null && (
                  <span className={`
                    ml-1 py-0.5 px-2 rounded-full text-xs font-medium
                    ${isActive
                      ? 'bg-blue-100 text-blue-600'
                      : 'bg-gray-100 text-gray-600 group-hover:bg-gray-200'
                    }
                  `}>
                    {badgeCount}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
      
      {/* Content */}
      <div className="mt-6">
        {renderContent()}
      </div>
    </div>
  );
};

export default WholesalerDashboard;