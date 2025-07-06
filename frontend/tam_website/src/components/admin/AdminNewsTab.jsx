import React, { useState } from 'react';

const AdminNewsTab = ({ navigate }) => {
  // TODO: Replace with real news data from backend
  const [news, setNews] = useState([
    { id: 1, title: 'خبر اول', category: 'ورزشی', type: 'مقاله', views: 120 },
    { id: 2, title: 'خبر دوم', category: 'اجتماعی', type: 'ویدیو', views: 45 },
  ]);

  const onEditArticle = (id) => {
    // TODO: Implement edit article navigation
    alert('ویرایش خبر: ' + id);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-[24px] font-bold text-primary">
          مدیریت اخبار
        </h2>
        <button 
          onClick={() => navigate('/admin/article/add')}
          className="px-4 py-2 bg-primary text-quinary-tint-800 rounded-lg hover:bg-primary-tint-100 transition-colors duration-300"
        >
          اخبار جدید
        </button>
      </div>
      <div className="bg-quinary-tint-600 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-primary text-quinary-tint-800">
                <th className="px-6 py-3 text-[16px] font-semibold text-right">عنوان</th>
                <th className="px-6 py-3 text-[16px] font-semibold text-right">دسته‌بندی</th>
                <th className="px-6 py-3 text-[16px] font-semibold text-right">نوع</th>
                <th className="px-6 py-3 text-[16px] font-semibold text-right">بازدید</th>
                <th className="px-6 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-quinary-tint-500">
              {news.map((newsItem) => (
                <tr key={newsItem.id} className="hover:bg-quinary-tint-500 transition-colors duration-200">
                  <td className="px-6 py-4 text-[16px] text-secondary text-right">{newsItem.title}</td>
                  <td className="px-6 py-4 text-[16px] text-secondary text-right">{newsItem.category}</td>
                  <td className="px-6 py-4 text-[16px] text-secondary text-right">{newsItem.type}</td>
                  <td className="px-6 py-4 text-[16px] text-secondary text-right">{newsItem.views}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex gap-2 justify-end">
                      <button 
                        onClick={() => onEditArticle(newsItem.id)}
                        className="px-3 py-1 bg-primary text-quinary-tint-800 rounded hover:bg-primary-tint-100 transition-colors duration-300"
                      >
                        ویرایش
                      </button>
                      <button className="px-3 py-1 bg-quaternary text-quinary-tint-800 rounded hover:bg-quaternary-tint-100 transition-colors duration-300">
                        حذف
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminNewsTab; 