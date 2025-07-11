import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import useAdminHttp from '../../hooks/useAdminHttp';
import AdminPagination from './AdminPagination';
import SpinLoader from '../UI/SpinLoader';
import SomethingWentWrong from '../UI/SomethingWentWrong';
import Modal from '../UI/Modal';
import { AdminIcons } from '../../data/Icons';

const AdminPlayersTab = ({ navigate }) => {
  // Use search params for persistent filtering
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchInput, setSearchInput] = useState(searchParams.get('search') || '');
  const [positionOptions, setPositionOptions] = useState({});
  
  // Delete player state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [playerToDelete, setPlayerToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  
  // Extract all filter values from URL params
  const currentPage = parseInt(searchParams.get('page') || '1');
  const itemsPerPage = parseInt(searchParams.get('pageSize') || '5');
  const search = searchParams.get('search') || '';
  const searchLanguage = searchParams.get('searchLanguage') || 'fa';
  const position = searchParams.get('position') || '';

  // Check if any filters are active
  const hasActiveFilters = search !== '' || position !== '' || searchLanguage !== 'fa';

  // Fetch players data
  const url = `http://localhost:8000/api/admin/players/?page=${currentPage}&page_size=${itemsPerPage}${search ? `&search=${encodeURIComponent(search)}` : ''}${position ? `&position=${position}` : ''}${searchLanguage ? `&search_language=${searchLanguage}` : ''}`;
  const {
    isLoading,
    data,
    isError,
    errorContent,
    sendRequest: getPlayers
  } = useAdminHttp(url);

  // Admin HTTP hook for delete operation
  const { sendRequest, isLoading: isDeleteLoading } = useAdminHttp();

  // Fetch position filter options
  const {
    data: positionsData,
    isLoading: positionsLoading,
    isError: positionsError
  } = useAdminHttp('http://localhost:8000/api/admin/player-positions/');

  // State for pagination info
  const [paginationInfo, setPaginationInfo] = useState({ count: 0, totalPages: 1 });
  const [players, setPlayers] = useState([]);

  // Update players and pagination info when data changes
  useEffect(() => {
    if (data && data.results) {
      setPlayers(data.results);
      setPaginationInfo({
        count: data.count,
        totalPages: Math.ceil(data.count / itemsPerPage)
      });
    }
  }, [data, itemsPerPage]);

  // Initialize search input from URL
  useEffect(() => {
    setSearchInput(search);
  }, [search]);

  // Update position options when positions data changes
  useEffect(() => {
    if (positionsData) {
      setPositionOptions(positionsData);
    }
  }, [positionsData]);

  // Helper function to update search params
  const updateSearchParams = (updates) => {
    const newParams = new URLSearchParams(searchParams);
    
    // Apply all updates to the search params
    Object.entries(updates).forEach(([key, value]) => {
      if (value === null || value === '') {
        newParams.delete(key);
      } else {
        newParams.set(key, value);
      }
    });
    
    // If we're updating filters that should reset pagination, set page to 1
    if (updates.search !== undefined || updates.position !== undefined) {
      newParams.set('page', '1');
    }
    
    setSearchParams(newParams);
  };

  const handlePageChange = (page) => {
    updateSearchParams({ page: page.toString() });
  };

  const handleItemsPerPageChange = (newSize) => {
    updateSearchParams({ 
      pageSize: newSize.toString(),
      page: '1' 
    });
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    updateSearchParams({ search: searchInput.trim() });
  };

  const handleClearSearch = () => {
    setSearchInput('');
    updateSearchParams({ search: null });
  };

  const handlePositionChange = (e) => {
    updateSearchParams({ position: e.target.value });
  };

  const handleSearchLanguageChange = (e) => {
    updateSearchParams({ searchLanguage: e.target.value });
  };

  // Function to clear all filters
  const handleClearAllFilters = () => {
    setSearchInput('');
    setSearchParams(new URLSearchParams({ page: '1', pageSize: itemsPerPage.toString() }));
  };

  // Handle opening delete modal
  const handleOpenDeleteModal = (player) => {
    setPlayerToDelete(player);
    setDeleteModalOpen(true);
  };

  // Handle closing delete modal
  const handleCloseDeleteModal = () => {
    setDeleteModalOpen(false);
    setPlayerToDelete(null);
  };

  // Handle player deletion
  const handleDeletePlayer = async () => {
    if (!playerToDelete) return;
    setIsDeleting(true);
  
    try {
      await sendRequest(`http://localhost:8000/api/admin/player-delete/${playerToDelete.id}/`, 'DELETE');
  
      setDeleteModalOpen(false);
      setPlayerToDelete(null);
  
      if (players.length === 1 && currentPage > 1) {
        updateSearchParams({ page: (currentPage - 1).toString() });
      } 
      getPlayers();
      
    } catch (error) {
      console.error('Failed to delete player:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading || positionsLoading) return <SpinLoader />;
  if (isError || positionsError) return <SomethingWentWrong />;

  return (
    <div className="space-y-6">
      {/* Filters section with improved styling */}
      <div className="bg-quinary-tint-700 rounded-xl p-4 shadow-sm">
        <div className="flex flex-col sm:flex-row items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-primary mb-2 sm:mb-0">فیلترها</h2>
          {hasActiveFilters && (
            <button 
              onClick={handleClearAllFilters}
              className="px-4 py-2 bg-quaternary-tint-700 text-secondary rounded-lg hover:bg-quaternary-tint-600 transition-colors duration-200 flex items-center gap-2"
            >
              <AdminIcons.ClearSearch />
              پاک کردن همه فیلترها
            </button>
          )}
        </div>

        <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search group */}
          <div className="flex flex-col space-y-2">
            <label className="text-sm font-medium text-secondary">جستجو</label>
            <div className="flex items-center gap-2">
              <div className="relative flex-grow">
                <input
                  type="text"
                  placeholder="نام بازیکن را وارد کنید..."
                  value={searchInput}
                  onChange={e => setSearchInput(e.target.value)}
                  className="px-3 py-2 pr-4 rounded-lg border border-quinary-tint-400 focus:outline-none focus:ring-2 focus:ring-primary text-right w-full bg-quinary-tint-800 text-primary pl-8"
                  dir="rtl"
                />
                {search !== '' && (
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
                className="px-4 py-2 bg-primary text-quinary-tint-800 rounded-lg hover:bg-primary-tint-100 transition-colors duration-300 font-medium"
              >
                جستجو
              </button>
            </div>
          </div>

          {/* Language group */}
          <div className="flex flex-col space-y-2">
            <label className="text-sm font-medium text-secondary">زبان جستجو</label>
            <select
              value={searchLanguage}
              onChange={handleSearchLanguageChange}
              className="px-3 py-2 rounded-lg border border-quinary-tint-400 bg-quinary-tint-800 text-primary focus:outline-none focus:ring-2 focus:ring-primary text-right"
              dir="rtl"
            >
              <option value="fa">سرچ فارسی</option>
              <option value="en">سرچ انگلیسی</option>
            </select>
          </div>

          {/* Position group */}
          <div className="flex flex-col space-y-2">
            <label className="text-sm font-medium text-secondary">پست بازیکن</label>
            <select
              value={position}
              onChange={handlePositionChange}
              className="px-3 py-2 rounded-lg border border-quinary-tint-400 bg-quinary-tint-800 text-primary focus:outline-none focus:ring-2 focus:ring-primary text-right"
              dir="rtl"
            >
              {Object.entries(positionOptions).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </div>
        </form>
      </div>

      {/* Players table */}
      <div className="bg-quinary-tint-600 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-primary text-quinary-tint-800">
                <th className="px-6 py-3 text-[16px] font-semibold text-right">نام</th>
                <th className="px-6 py-3 text-[16px] font-semibold text-right">پست</th>
                <th className="px-6 py-3 text-[16px] font-semibold text-right">شماره</th>
                <th className="px-6 py-3 text-[16px] font-semibold text-right">گل‌ها</th>
                <th className="px-6 py-3 text-[16px] font-semibold text-right">بازی‌ها</th>
                <th className="px-6 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-quinary-tint-500">
              {players.length > 0 ? (
                players.map((player, index) => (
                  <tr key={player.id || index} className="hover:bg-quinary-tint-500 transition-colors duration-200">
                    <td className="px-6 py-4 text-[16px] text-secondary text-right">{player.name || '---'}</td>
                    <td className="px-6 py-4 text-[16px] text-secondary text-right">{player.position || '---'}</td>
                    <td className="px-6 py-4 text-[16px] text-secondary text-right">{player.number || '---'}</td>
                    <td className="px-6 py-4 text-[16px] text-secondary text-right">{player.goals || '0'}</td>
                    <td className="px-6 py-4 text-[16px] text-secondary text-right">{player.games || '0'}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex gap-2 justify-end">
                        <button 
                          onClick={() => navigate(`/admin/players/edit/${player.id || ''}`)}
                          className="px-3 py-1 bg-primary text-quinary-tint-800 rounded hover:bg-primary-tint-100 transition-colors duration-300"
                        >
                          ویرایش
                        </button>
                        <button 
                          onClick={() => handleOpenDeleteModal(player)}
                          className="px-3 py-1 bg-quaternary text-quinary-tint-800 rounded hover:bg-quaternary-tint-100 transition-colors duration-300"
                        >
                          حذف
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-secondary">
                    هیچ بازیکنی یافت نشد
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
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

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={handleCloseDeleteModal}
        title="تأیید حذف"
        footer={
          <>
            <button
              onClick={handleCloseDeleteModal}
              className="px-4 py-2 bg-quinary-tint-500 text-primary rounded-lg hover:bg-quinary-tint-400 transition-colors duration-300"
              disabled={isDeleteLoading}
            >
              صرف نظر
            </button>
            <button
              onClick={handleDeletePlayer}
              className="px-4 py-2 bg-quaternary text-quinary-tint-800 rounded-lg hover:bg-quaternary-tint-100 transition-colors duration-300 flex items-center gap-2"
              disabled={isDeleteLoading}
            >
              {isDeleteLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  در حال حذف...
                </>
              ) : (
                'بله'
              )}
            </button>
          </>
        }
      >
        <p className="text-lg text-secondary text-center py-2">
          آیا قصد حذف بازیکن <span className="text-primary">{playerToDelete?.name || ''}</span> را دارید؟
        </p>
      </Modal>
    </div>
  );
};

export default AdminPlayersTab; 