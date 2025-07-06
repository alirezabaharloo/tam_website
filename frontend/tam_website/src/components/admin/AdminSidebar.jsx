import React from 'react';
import { AdminIcons } from '../../data/Icons';

const AdminSidebar = ({ tabs, activeTab, setActiveTab, isRTL }) => {
  return (
    <div className="bg-quinary-tint-800 rounded-2xl shadow-[0_0_16px_rgba(0,0,0,0.25)] p-4">
      <nav className="space-y-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-[16px] font-medium transition-all duration-300 ${
              activeTab === tab.id
                ? 'bg-primary text-quinary-tint-800'
                : 'text-secondary hover:bg-quinary-tint-700'
            }`}
          >
            {tab.icon ? <tab.icon /> : <AdminIcons.Default />}
            {tab.label}
          </button>
        ))}
      </nav>
    </div>
  );
};

export default AdminSidebar; 