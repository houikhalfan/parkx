import React from "react";
import AdminLayout from "./AdminLayout.jsx"; // keep if you have it; otherwise remove this line

export default function AdminIndex() {
  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold">Admin</h1>
      <p className="text-gray-600 mt-2">Page de démonstration.</p>
    </div>
  );
}

// If you don't use layouts yet, you can delete the next line safely.
AdminIndex.layout = (page) => <AdminLayout children={page} />;

