import React from 'react';
import SpinLoader from '../../UI/SpinLoader';

const DeleteArticleModal = ({ isOpen, onClose, onDelete, articleTitle, isDeleting }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-quinary-tint-800 p-6 rounded-2xl shadow-lg max-w-md w-full mx-4">
        <h3 className="text-xl font-bold text-primary mb-4">تأیید حذف مقاله</h3>
        <p className="text-secondary mb-6">
          آیا مطمئن هستید که می‌خواهید مقاله <span className="font-bold text-primary">{articleTitle || 'انتخاب شده'}</span> را حذف کنید؟
          <br />
          این عمل غیرقابل بازگشت است.
        </p>
        <div className="flex gap-3 justify-end">
          <button
            onClick={onClose}
            disabled={isDeleting}
            className="px-4 py-2 bg-quinary-tint-700 text-secondary rounded-lg hover:bg-quinary-tint-600 transition-colors duration-200 disabled:opacity-50"
          >
            انصراف
          </button>
          <button
            onClick={onDelete}
            disabled={isDeleting}
            className="px-4 py-2 bg-quaternary text-quinary-tint-800 rounded-lg hover:bg-quaternary-tint-200 transition-colors duration-200 font-medium flex items-center gap-2 disabled:opacity-50"
          >
            {isDeleting ? (
              <>
                <SpinLoader size="small" />
                در حال حذف...
              </>
            ) : (
              'حذف'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteArticleModal; 