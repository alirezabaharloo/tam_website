import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';

const AdminModal = ({ isOpen, onClose, type, onSubmit }) => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'fa';

  // Form states
  const [userForm, setUserForm] = useState({
    phone: '',
    password: '',
    confirmPassword: ''
  });

  const [newsForm, setNewsForm] = useState({
    title: {
      en: '',
      fa: ''
    },
    category: {
      en: '',
      fa: ''
    },
    type: 'basic',
    description: {
      en: '',
      fa: ''
    },
    content: {
      en: '',
      fa: ''
    },
    keywords: [
      { en: '', fa: '' }
    ]
  });

  const handleUserSubmit = (e) => {
    e.preventDefault();
    if (userForm.password !== userForm.confirmPassword) {
      alert(t('adminPasswordsDoNotMatch'));
      return;
    }
    onSubmit(userForm);
    onClose();
  };

  const handleNewsSubmit = (e) => {
    e.preventDefault();
    onSubmit(newsForm);
    onClose();
  };

  const handleNewsKeywordChange = (index, field, value) => {
    const newKeywords = [...newsForm.keywords];
    newKeywords[index] = { ...newKeywords[index], [field]: value };
    setNewsForm({ ...newsForm, keywords: newKeywords });
  };

  const addKeyword = () => {
    setNewsForm({
      ...newsForm,
      keywords: [...newsForm.keywords, { en: '', fa: '' }]
    });
  };

  const removeKeyword = (index) => {
    const newKeywords = newsForm.keywords.filter((_, i) => i !== index);
    setNewsForm({ ...newsForm, keywords: newKeywords });
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-quinary-tint-800 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
          onClick={e => e.stopPropagation()}
        >
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className={`text-2xl font-bold text-primary ${isRTL ? 'text-right' : 'text-left'}`}>
                {type === 'user' ? t('adminAddUser') : t('adminAddNews')}
              </h2>
              <button
                onClick={onClose}
                className="text-secondary hover:text-primary transition-colors duration-300"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {type === 'user' ? (
              <form onSubmit={handleUserSubmit} className="space-y-4">
                <div>
                  <label className="block text-secondary mb-2">{t('adminPhoneNumber')}</label>
                  <input
                    type="tel"
                    value={userForm.phone}
                    onChange={(e) => setUserForm({ ...userForm, phone: e.target.value })}
                    className="w-full px-4 py-2 bg-quinary-tint-700 text-secondary rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  />
                </div>
                <div>
                  <label className="block text-secondary mb-2">{t('adminPassword')}</label>
                  <input
                    type="password"
                    value={userForm.password}
                    onChange={(e) => setUserForm({ ...userForm, password: e.target.value })}
                    className="w-full px-4 py-2 bg-quinary-tint-700 text-secondary rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  />
                </div>
                <div>
                  <label className="block text-secondary mb-2">{t('adminConfirmPassword')}</label>
                  <input
                    type="password"
                    value={userForm.confirmPassword}
                    onChange={(e) => setUserForm({ ...userForm, confirmPassword: e.target.value })}
                    className="w-full px-4 py-2 bg-quinary-tint-700 text-secondary rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  />
                </div>
                <div className="flex justify-end mt-6">
                  <button
                    type="submit"
                    className="px-6 py-2 bg-primary text-quinary-tint-800 rounded-lg hover:bg-primary-tint-100 transition-colors duration-300"
                  >
                    {t('adminSubmit')}
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleNewsSubmit} className="space-y-6">
                {/* Title Section */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-primary">{t('adminTitle')}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-secondary mb-2">English</label>
                      <input
                        type="text"
                        value={newsForm.title.en}
                        onChange={(e) => setNewsForm({ ...newsForm, title: { ...newsForm.title, en: e.target.value } })}
                        className="w-full px-4 py-2 bg-quinary-tint-700 text-secondary rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-secondary mb-2">فارسی</label>
                      <input
                        type="text"
                        value={newsForm.title.fa}
                        onChange={(e) => setNewsForm({ ...newsForm, title: { ...newsForm.title, fa: e.target.value } })}
                        className="w-full px-4 py-2 bg-quinary-tint-700 text-secondary rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        required
                        dir="rtl"
                      />
                    </div>
                  </div>
                </div>

                {/* Category Section */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-primary">{t('adminCategory')}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-secondary mb-2">English</label>
                      <input
                        type="text"
                        value={newsForm.category.en}
                        onChange={(e) => setNewsForm({ ...newsForm, category: { ...newsForm.category, en: e.target.value } })}
                        className="w-full px-4 py-2 bg-quinary-tint-700 text-secondary rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-secondary mb-2">فارسی</label>
                      <input
                        type="text"
                        value={newsForm.category.fa}
                        onChange={(e) => setNewsForm({ ...newsForm, category: { ...newsForm.category, fa: e.target.value } })}
                        className="w-full px-4 py-2 bg-quinary-tint-700 text-secondary rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        required
                        dir="rtl"
                      />
                    </div>
                  </div>
                </div>

                {/* Type Section */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-primary">{t('adminType')}</h3>
                  <select
                    value={newsForm.type}
                    onChange={(e) => setNewsForm({ ...newsForm, type: e.target.value })}
                    className="w-full px-4 py-2 bg-quinary-tint-700 text-secondary rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  >
                    <option value="basic">{t('adminTypeBasic')}</option>
                    <option value="video">{t('adminTypeVideo')}</option>
                    <option value="slideshow">{t('adminTypeSlideshow')}</option>
                  </select>
                </div>

                {/* Description Section */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-primary">{t('adminDescription')}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-secondary mb-2">English</label>
                      <textarea
                        value={newsForm.description.en}
                        onChange={(e) => setNewsForm({ ...newsForm, description: { ...newsForm.description, en: e.target.value } })}
                        className="w-full px-4 py-2 bg-quinary-tint-700 text-secondary rounded-lg focus:outline-none focus:ring-2 focus:ring-primary h-32"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-secondary mb-2">فارسی</label>
                      <textarea
                        value={newsForm.description.fa}
                        onChange={(e) => setNewsForm({ ...newsForm, description: { ...newsForm.description, fa: e.target.value } })}
                        className="w-full px-4 py-2 bg-quinary-tint-700 text-secondary rounded-lg focus:outline-none focus:ring-2 focus:ring-primary h-32"
                        required
                        dir="rtl"
                      />
                    </div>
                  </div>
                </div>

                {/* Content Section */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-primary">{t('adminContent')}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-secondary mb-2">English</label>
                      <textarea
                        value={newsForm.content.en}
                        onChange={(e) => setNewsForm({ ...newsForm, content: { ...newsForm.content, en: e.target.value } })}
                        className="w-full px-4 py-2 bg-quinary-tint-700 text-secondary rounded-lg focus:outline-none focus:ring-2 focus:ring-primary h-48"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-secondary mb-2">فارسی</label>
                      <textarea
                        value={newsForm.content.fa}
                        onChange={(e) => setNewsForm({ ...newsForm, content: { ...newsForm.content, fa: e.target.value } })}
                        className="w-full px-4 py-2 bg-quinary-tint-700 text-secondary rounded-lg focus:outline-none focus:ring-2 focus:ring-primary h-48"
                        required
                        dir="rtl"
                      />
                    </div>
                  </div>
                </div>

                {/* Keywords Section */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-primary">{t('adminKeywords')}</h3>
                    <button
                      type="button"
                      onClick={addKeyword}
                      className="px-4 py-2 bg-primary text-quinary-tint-800 rounded-lg hover:bg-primary-tint-100 transition-colors duration-300"
                    >
                      {t('adminAddKeyword')}
                    </button>
                  </div>
                  {newsForm.keywords.map((keyword, index) => (
                    <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                      <div>
                        <label className="block text-secondary mb-2">English</label>
                        <input
                          type="text"
                          value={keyword.en}
                          onChange={(e) => handleNewsKeywordChange(index, 'en', e.target.value)}
                          className="w-full px-4 py-2 bg-quinary-tint-700 text-secondary rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                          required
                        />
                      </div>
                      <div className="flex gap-4">
                        <div className="flex-grow">
                          <label className="block text-secondary mb-2">فارسی</label>
                          <input
                            type="text"
                            value={keyword.fa}
                            onChange={(e) => handleNewsKeywordChange(index, 'fa', e.target.value)}
                            className="w-full px-4 py-2 bg-quinary-tint-700 text-secondary rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                            required
                            dir="rtl"
                          />
                        </div>
                        {index > 0 && (
                          <button
                            type="button"
                            onClick={() => removeKeyword(index)}
                            className="mt-6 px-3 py-2 bg-quaternary text-quinary-tint-800 rounded-lg hover:bg-quaternary-tint-100 transition-colors duration-300"
                          >
                            {t('adminRemove')}
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex justify-end mt-6">
                  <button
                    type="submit"
                    className="px-6 py-2 bg-primary text-quinary-tint-800 rounded-lg hover:bg-primary-tint-100 transition-colors duration-300"
                  >
                    {t('adminSubmit')}
                  </button>
                </div>
              </form>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AdminModal; 