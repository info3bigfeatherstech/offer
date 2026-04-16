import React, { Suspense, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { SettingTabRegistry } from "./SettingTabregistry";

const SettingsDashboard = ({ onExit }) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const activeCtab = searchParams.get("ctab");
  const defaultCtab = SettingTabRegistry[0]?.id || null;
  const resolvedCtab = activeCtab && SettingTabRegistry.find((t) => t.id === activeCtab)
    ? activeCtab
    : defaultCtab;

  const groupedTabs = useMemo(() => {
    const map = new Map();
    SettingTabRegistry.forEach((tab) => {
      const g = tab.group || "General";
      if (!map.has(g)) map.set(g, []);
      map.get(g).push(tab);
    });
    return map;
  }, []);

  const activeTabConfig = SettingTabRegistry.find((t) => t.id === resolvedCtab);
  const TabComponent = activeTabConfig?.component ?? null;

  const handleSubTabClick = (tabId) => {
    setSearchParams({ tab: "settings", ctab: tabId });
  };

  return (
    <div className="flex flex-1 min-h-screen bg-gray-50">
      {/* ── Settings Sidebar ──────────────────────────────────────────────── */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col sticky top-0 h-screen z-20">
        
        {/* Header — Fixed Back Arrow and Settings Title */}
        <div className="px-4 py-5 flex items-center gap-4 border-b border-gray-200 bg-white sticky top-0 z-30">
          <button
            onClick={onExit}
            className="p-1 rounded hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
          <h2 className="text-xl font-medium text-gray-900">Settings</h2>
        </div>

        {/* Grouped Nav */}
        <nav className="flex-1 overflow-y-auto">
          {[...groupedTabs.entries()].map(([groupLabel, tabs], index) => (
            <div 
              key={groupLabel} 
              className={`py-6 px-4 ${index !== groupedTabs.size - 1 ? "border-b border-gray-200" : ""}`}
            >
              {/* Group Label */}
              <p className="px-3 mb-3 text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                {groupLabel}
              </p>

              {/* Sub-tabs */}
              <div className="space-y-1">
                {tabs.map((tab) => {
                  const isActive = resolvedCtab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => handleSubTabClick(tab.id)}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-md transition-all duration-150 cursor-pointer text-left ${
                        isActive
                          ? "bg-blue-50 text-blue-600 shadow-sm"
                          : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                      }`}
                    >
                      <svg
                        className={`w-5 h-5 shrink-0 ${isActive ? "text-blue-600" : "text-gray-500"}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d={tab.icon} />
                      </svg>
                      {tab.label}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
          
          {/* Static Help Links (Bottom Group) */}
          {/* <div className="py-6 px-4 border-t border-gray-200 mt-auto">
             <div className="space-y-1">
                <button className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-md">
                   <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" strokeWidth="1.8" /></svg>
                   Help center
                </button>
                <button className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-md">
                   <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.989-2.386l-.548-.547z" strokeWidth="1.8" /></svg>
                   Suggest ideas
                </button>
             </div>
          </div> */}
        </nav>
      </aside>

      {/* ── Settings Content ─────────────────────────────────────────────── */}
      <main className="flex-1 overflow-y-auto">
        <header className="bg-white h-16 border-b border-gray-200 flex items-center px-8 sticky top-0 z-10">
          <h2 className="text-xl font-medium text-gray-900 capitalize">
            {activeTabConfig?.label || "Settings"}
          </h2>
        </header>

        <div className="p-8">
          <Suspense fallback={<div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" /></div>}>
            {TabComponent ? <TabComponent /> : <div className="text-gray-400">Content coming soon</div>}
          </Suspense>
        </div>
      </main>
    </div>
  );
};

export default SettingsDashboard;