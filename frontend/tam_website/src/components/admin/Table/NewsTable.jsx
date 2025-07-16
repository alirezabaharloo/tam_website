import React, { useState } from 'react';
import useAdminHttp from '../../../hooks/useAdminHttp';
import DeleteArticleModal from '../modal/DeleteArticleModal';

const NewsTable = ({ navigate, articles, getArticles, currentPage, totalItems, onPageChangeAfterDelete }) => {
  // Delete article state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [articleToDelete, setArticleToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Admin HTTP hook for delete operation
  const { sendRequest, isLoading: isDeleteLoading } = useAdminHttp();

  // Handle opening delete modal
  const handleOpenDeleteModal = (article) => {  
    setArticleToDelete(article);
    setDeleteModalOpen(true);
  };

  // Handle closing delete modal
  const handleCloseDeleteModal = () => {
    setDeleteModalOpen(false);
    setArticleToDelete(null);
  };

  // Handle article deletion
  const handleDeleteArticle = async () => {
    if (!articleToDelete) return;
    setIsDeleting(true);
  
    try {
      await sendRequest(`http://localhost:8000/api/admin/article-delete/${articleToDelete.id}/`, 'DELETE');
  
      setDeleteModalOpen(false);
      setArticleToDelete(null);
      
      // After delete, handle page change if needed
      onPageChangeAfterDelete();
      
    } catch (error) {
      console.error('Failed to delete article:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  // Helper function to render status
  const renderStatus = (status) => {
    switch (status) {
      case 'DR':
        return 'پیش نویس';
      case 'PB':
        return 'منتشر شده';
      default:
        return status || '---';
    }
  };

  // Helper function to render type
  const renderType = (type) => {
    switch (type) {
      case 'TX':
        return 'عادی';
      case 'SS':
        return 'اسلایدشو';
      case 'VD':
        return 'ویدیو';
      default:
        return type || '---';
    }
  };

  return (
    <div className="space-y-6">
      {/* Articles table */}
      <div className="bg-quinary-tint-600 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-primary text-quinary-tint-800">
                <th className="px-6 py-3 text-[16px] font-semibold text-right">عنوان مقاله</th>
                <th className="px-6 py-3 text-[16px] font-semibold text-right">وضعیت مقاله</th>
                <th className="px-6 py-3 text-[16px] font-semibold text-right">نوع مقاله</th>
                <th className="px-6 py-3 text-[16px] font-semibold text-right">تیم مربوطه</th>
                <th className="px-6 py-3 text-[16px] font-semibold text-right">تعداد بازدید</th>
                <th className="px-6 py-3 text-[16px] font-semibold text-right">تعداد پسند</th>
                <th className="px-6 py-3 text-[16px] font-semibold text-right">تاریخ آخرین بروزرسانی</th>
                <th className="px-6 py-3 text-[16px] font-semibold text-right">تاریخ انتشار</th>
                <th className="px-6 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-quinary-tint-500">
              {articles && articles.length > 0 ? (
                articles.map((article, index) => (
                  <tr key={article.id || index} className="hover:bg-quinary-tint-500 transition-colors duration-200">
                    <td className="px-6 py-4 text-[16px] text-secondary text-right">{article.title || '---'}</td>
                    <td className="px-6 py-4 text-[16px] text-secondary text-right">{renderStatus(article.status)}</td>
                    <td className="px-6 py-4 text-[16px] text-secondary text-right">{renderType(article.type)}</td>
                    <td className="px-6 py-4 text-[16px] text-secondary text-right">{article.team || '---'}</td>
                    <td className="px-6 py-4 text-[16px] text-secondary text-right">{article.hits_count || '0'}</td>
                    <td className="px-6 py-4 text-[16px] text-secondary text-right">{article.likes_count || '0'}</td>
                    <td className="px-6 py-4 text-[16px] text-secondary text-right">{article.updated_date || '---'}</td>
                    <td className="px-6 py-4 text-[16px] text-secondary text-right">{article.created_date || '---'}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex gap-2 justify-end">
                        <button 
                          onClick={() => navigate(`/admin/news/edit/${article.id || ''}`)}
                          className="px-3 py-1 bg-primary text-quinary-tint-800 rounded hover:bg-primary-tint-100 transition-colors duration-300"
                        >
                          ویرایش
                        </button>
                        <button 
                          onClick={() => handleOpenDeleteModal(article)}
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
                  <td colSpan="9" className="px-6 py-8 text-center text-secondary">
                    هیچ مقاله‌ای یافت نشد
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Article Modal */}
      <DeleteArticleModal
        isOpen={deleteModalOpen}
        onClose={handleCloseDeleteModal}
        onDelete={handleDeleteArticle}
        articleTitle={articleToDelete?.title}
        isDeleting={isDeleting}
      />
    </div>
  );
};

export default NewsTable; 