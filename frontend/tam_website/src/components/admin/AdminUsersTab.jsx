import React, { useState, useEffect } from 'react';
import AdminPagination from './AdminPagination';
import SpinLoader from '../UI/SpinLoader';
import SomethingWentWrong from '../UI/SomethingWentWrong';
import { AdminIcons } from '../../data/Icons';
import useAdminHttp from '../../hooks/useAdminHttp';

const AdminUsersTab = ({ navigate }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(8);
  const [paginationInfo, setPaginationInfo] = useState({ count: 0, totalPages: 1 });
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [userType, setUserType] = useState('');
  const [userTypeOptions, setUserTypeOptions] = useState([]);

  const url = `http://localhost:8000/api/admin/user-list/?page=${currentPage}&page_size=${itemsPerPage}${search ? `&search=${encodeURIComponent(search)}` : ''}${userType ? `&type=${userType}` : ''}`;
  const {
    isLoading,
    data,
    isError,
    errorContent
  } = useAdminHttp(url);

  const {
    data: userPermissionsData,
    isLoading: userPermissionsLoading,
    isError: userPermissionsError
  } = useAdminHttp('http://localhost:8000/api/admin/user-permissions-list/');

  useEffect(() => {
    if (data && data.results) {
      setUsers(data.results);
      setPaginationInfo({
        count: data.count,
        totalPages: Math.ceil(data.count / itemsPerPage)
      });
    }
  }, [data, itemsPerPage]);

  useEffect(() => {
    if (userPermissionsData) {
      const options = Object.entries(userPermissionsData).map(([value, label]) => ({ value, label }));
      setUserTypeOptions(options);
    }
  }, [userPermissionsData]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (newSize) => {
    setItemsPerPage(newSize);
    setCurrentPage(1);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setSearch(searchInput.trim());
    setCurrentPage(1);
  };

  const handleClearSearch = () => {
    setSearch('');
    setSearchInput('');
    setCurrentPage(1);
  };

  const handleTypeChange = (e) => {
    setUserType(e.target.value);
    setCurrentPage(1);
  };

  if (isLoading) return <SpinLoader />;
  if (isError) return <SomethingWentWrong error={errorContent} />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-2">
        <form onSubmit={handleSearchSubmit} className="flex items-center gap-2 w-full sm:w-auto">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative w-full sm:w-64">
              <input
                type="text"
                placeholder="جست و جو کاربر..."
                value={searchInput}
                onChange={e => setSearchInput(e.target.value)}
                className="px-3 py-2 pr-4 rounded-lg border border-quinary-tint-400 focus:outline-none focus:ring-2 focus:ring-primary text-right w-full bg-quinary-tint-800 text-primary pl-8"
                dir="rtl"
              />
              {searchInput && (
                <button
                  type="button"
                  onClick={handleClearSearch}
                  className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-quaternary transition-colors duration-200"
                >
                  <AdminIcons.ClearSearch />
                </button>
              )}
            </div>
            <button
              type="submit"
              className="px-4 py-2 bg-primary text-quinary-tint-800 rounded-lg hover:bg-primary-tint-100 transition-colors duration-300 font-bold"
            >
              جستجو
            </button>
          </div>
          <select
            value={userType}
            onChange={handleTypeChange}
            className="px-3 py-2 rounded-lg border border-quinary-tint-400 bg-quinary-tint-800 text-primary focus:outline-none focus:ring-2 focus:ring-primary text-right"
            dir="rtl"
          >
            <option value="">همه کاربران</option>
            {userTypeOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </form>
        <button 
          onClick={() => navigate('/admin/user/add')}
          className="px-4 py-2 bg-primary text-quinary-tint-800 rounded-lg hover:bg-primary-tint-100 transition-colors duration-300 font-bold"
        >
          کاربر جدید
        </button>
      </div>
      <div className="bg-quinary-tint-600 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-primary text-quinary-tint-800">
                <th className="px-6 py-3 text-[16px] font-semibold text-right">وضعیت</th>
                <th className="px-6 py-3 text-[16px] font-semibold text-right">شماره موبایل</th>
                <th className="px-6 py-3 text-[16px] font-semibold text-right">نام</th>
                <th className="px-6 py-3 text-[16px] font-semibold text-right">نام خانوادگی</th>
                <th className="px-6 py-3 text-[16px] font-semibold text-right">نقش‌ها</th>
                <th className="px-6 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-quinary-tint-500">
              {users.map((userItem, index) => (
                <tr key={index} className="hover:bg-quinary-tint-500 transition-colors duration-200">
                  <td className="px-6 py-4 text-right">
                    <span className={`w-4 h-4 inline-block rounded-full border-2 ${userItem.is_active ? 'bg-emerald-400 border-emerald-500' : 'bg-rose-400 border-rose-500'}`}></span>
                  </td>
                  <td className="px-6 py-4 text-[16px] text-secondary text-right">{userItem.phone_number}</td>
                  <td className="px-6 py-4 text-[16px] text-secondary text-right">{userItem.first_name}</td>
                  <td className="px-6 py-4 text-[16px] text-secondary text-right">{userItem.last_name}</td>
                  <td className="px-6 py-4 text-right">
                    {Array.isArray(userItem.permissions) && userItem.permissions.length > 0 ? (
                      <span className="px-2 py-1 rounded-full text-[12px] font-medium bg-gray-100 text-gray-800">
                        {userItem.permissions.join(' ')}
                      </span>
                    ) : (
                      <span className="px-2 py-1 rounded-full text-[12px] font-medium bg-gray-100 text-gray-800">
                        کاربر
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex gap-2 justify-end">
                      <button 
                        onClick={() => navigate(`/admin/user/edit/${userItem.id || ''}`)}
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
      {paginationInfo.count > 5 && (
        <AdminPagination
          currentPage={currentPage}
          totalPages={paginationInfo.totalPages}
          itemsPerPage={itemsPerPage}
          totalItems={paginationInfo.count}
          onPageChange={handlePageChange}
          onItemsPerPageChange={handleItemsPerPageChange}
        />
      )}
    </div>
  );
};

export default AdminUsersTab; 