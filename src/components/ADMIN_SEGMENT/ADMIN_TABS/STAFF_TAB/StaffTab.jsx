/**
 * StaffTab.jsx
 * Pure container — owns no logic, just composes independent components.
 * All state lives in Redux. Nothing is passed as props from here
 * except what each child explicitly needs.
 */

import React from "react";
import StaffTable from "./StaffTable";
import AdminProfileCard from "./AdminProfileCard";

const StaffTab = () => {
  return (
    <div className="p-4 sm:p-6 space-y-6 font-sans max-w-[1600px] mx-auto animate-in fade-in duration-700">
      {/* Admin's own read-only profile card */}
      <AdminProfileCard />

      {/* Full staff directory with all CRUD built-in */}
      <StaffTable />
    </div>
  );
};

export default StaffTab;
// import React, { useState } from "react";
// import { Download, Plus } from "lucide-react";
// import StaffTable from "./StaffTable";
// import CreateStaffForm from "./CreateStaffForm";
// import EditStaffForm from "./EditStaffForm";

// const INITIAL_STAFF = [
//   { 
//     id: 1, 
//     name: "Arjun Mehta", 
//     email: "arjun.m@mehtamart.com", 
//     password: "Admin@2026!",
//     role: "Store Manager", 
//     status: "Active", 
//     joined: "12 Jan 2026" 
//   },
//   { 
//     id: 2, 
//     name: "Priya Sharma", 
//     email: "priya.s@mehtamart.com", 
//     password: "Admin@2026!",
//     role: "Inventory Lead", 
//     status: "Active", 
//     joined: "05 Feb 2026" 
//   },
//   { 
//     id: 3, 
//     name: "Rahul Verma", 
//     email: "rahul.v@mehtamart.com", 
//     password: "Admin@2026!",
//     role: "Support Executive", 
//     status: "On Leave", 
//     joined: "20 Feb 2026" 
//   },
//   { 
//     id: 4, 
//     name: "Sana Khan", 
//     email: "sana.k@mehtamart.com", 
//     password: "Admin@2026!",
//     role: "SEO Specialist", 
//     status: "Active", 
//     joined: "01 Mar 2026" 
//   },
// ];

// const StaffTab = () => {
//   const [staffList, setStaffList] = useState(INITIAL_STAFF);
//   const [showCreateModal, setShowCreateModal] = useState(false);
//   const [showEditModal, setShowEditModal] = useState(false);
//   const [selectedStaff, setSelectedStaff] = useState(null);

//   // Create new staff
//   const handleCreateStaff = (newStaff) => {
//     const staffWithId = {
//       ...newStaff,
//       id: Date.now(),
//       joined: new Date().toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' }),
//       status: "Active"
//     };
//     setStaffList([...staffList, staffWithId]);
//     setShowCreateModal(false);
//   };

//   // Edit staff
//   const handleEditStaff = (updatedStaff) => {
//     setStaffList(staffList.map(staff => 
//       staff.id === updatedStaff.id ? updatedStaff : staff
//     ));
//     setShowEditModal(false);
//     setSelectedStaff(null);
//   };

//   // Delete staff
//   const handleDeleteStaff = (id) => {
//     if (window.confirm("Are you sure you want to delete this staff member?")) {
//       setStaffList(staffList.filter(staff => staff.id !== id));
//     }
//   };

//   // Download CSV
//   const downloadStaffReport = () => {
//     const headers = ["Name,Email,Role,Status,Joined\n"];
//     const rows = staffList.map(s => `${s.name},${s.email},${s.role},${s.status},${s.joined}\n`);
//     const blob = new Blob([headers, ...rows], { type: "text/csv" });
//     const url = window.URL.createObjectURL(blob);
//     const a = document.createElement("a");
//     a.setAttribute("hidden", "");
//     a.setAttribute("href", url);
//     a.setAttribute("download", "staff_report.csv");
//     document.body.appendChild(a);
//     a.click();
//     document.body.removeChild(a);
//   };

//   return (
//     <div className="p-4 sm:p-6 space-y-6 animate-in fade-in duration-700 font-sans max-w-[1600px] mx-auto">
      
//       {/* Header Section */}
//       <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
//         <div>
//           <h2 className="text-2xl font-semibold text-slate-900 tracking-tight">Staff Directory</h2>
//           <p className="text-sm text-slate-500 font-medium">Manage internal team members and access levels.</p>
//         </div>
        
//         <div className="flex items-center gap-3">
//           <button 
//             onClick={downloadStaffReport}
//             className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-all cursor-pointer shadow-sm"
//           >
//             <Download size={16} />
//             Download CSV
//           </button>
          
//           <button 
//             onClick={() => setShowCreateModal(true)}
//             className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 transition-all cursor-pointer shadow-md shadow-indigo-100"
//           >
//             <Plus size={18} />
//             Add Staff
//           </button>
//         </div>
//       </div>

//       {/* Staff Table */}
//       <StaffTable 
//         staffList={staffList}
//         onEdit={(staff) => {
//           setSelectedStaff(staff);
//           setShowEditModal(true);
//         }}
//         onDelete={handleDeleteStaff}
//       />

//       {/* Create Staff Modal */}
//       {showCreateModal && (
//         <CreateStaffForm 
//           onClose={() => setShowCreateModal(false)}
//           onCreate={handleCreateStaff}
//         />
//       )}

//       {/* Edit Staff Modal */}
//       {showEditModal && selectedStaff && (
//         <EditStaffForm 
//           staff={selectedStaff}
//           onClose={() => {
//             setShowEditModal(false);
//             setSelectedStaff(null);
//           }}
//           onEdit={handleEditStaff}
//         />
//       )}
//     </div>
//   );
// };

// export default StaffTab;
