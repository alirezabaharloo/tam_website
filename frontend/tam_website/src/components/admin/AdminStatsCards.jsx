import React from 'react';

const AdminStatsCards = ({ stats, is_superuser, is_author, is_seller }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {is_superuser && (
        <div className="bg-primary rounded-xl p-6">
          <h3 className="text-[18px] font-medium text-quinary-tint-800 mb-2">تعداد کاربران</h3>
          <p className="text-[32px] font-bold text-quinary-tint-800">{stats.users}</p>
        </div>
      )}
      {(is_superuser || is_author) && (
        <div className="bg-primary rounded-xl p-6">
          <h3 className="text-[18px] font-medium text-quinary-tint-800 mb-2">تعداد اخبار</h3>
          <p className="text-[32px] font-bold text-quinary-tint-800">{stats.articles}</p>
        </div>
      )}
      {(is_superuser || is_seller) && (
        <div className="bg-primary rounded-xl p-6">
          <h3 className="text-[18px] font-medium text-quinary-tint-800 mb-2">تعداد محصولات</h3>
          <p className="text-[32px] font-bold text-quinary-tint-800">{stats.products}</p>
        </div>
      )}
    </div>
  );
};

export default AdminStatsCards; 