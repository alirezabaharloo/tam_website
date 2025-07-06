import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

export default function NoArticlesFound() {
  const { t } = useTranslation();
  const navigate  = useNavigate();


  return (
    <div className="w-full flex flex-col items-center justify-center py-8 px-4">
      <div className="w-20 h-20 mb-4 text-quaternary-800">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-full h-full"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
          />
        </svg>
      </div>

      <h3 className="text-xl font-medium text-quaternary-800 mb-2 text-center ">
        {t('noArticlesFound')}
      </h3>

      <p className="text-quaternary-600 text-center max-w-md mb-4">
        {t('noArticlesFoundDescription')}
      </p>

      <div className="flex gap-3">
        <button
          className="px-4 py-2 bg-quaternary-200 text-white rounded-lg text-sm hover:bg-quaternary-300"
        >
          {t('tryDifferentFilter')}
        </button>
        <button
          className="px-4 py-2 bg-white text-quaternary-800 border border-quaternary-800 rounded-lg text-sm hover:bg-quaternary-50"
          onClick={()=>{navigate("/")}}        
        >
          {t('refreshPage')}
        </button>
      </div>
    </div>
  );
} 