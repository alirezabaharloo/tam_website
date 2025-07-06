import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { fakeUsers } from '../data/fakeUsers';
import { newsData } from '../data/newsData';
import { ArticleFormIcons } from '../../data/Icons';

const Icons = ArticleFormIcons;

const ArticleForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('persian');
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errors, setErrors] = useState({});

  // Determine if we're adding or editing
  const isEditing = location.pathname.includes('/edit/');

  // Initialize form data
  const [formData, setFormData] = useState({
    author: '',
    category: '',
    title: {
      fa: '',
      en: ''
    },
    body: {
      fa: '',
      en: ''
    },
    status: 'DR', // Draft by default
    type: 'TX', // Text by default
    slug: '',
    video_url: '',
    hits: 0,
    likes: 0
  });

  // Status options
  const statusOptions = [
    { value: 'DR', label: 'مقاله پیش نویس' },
    { value: 'AC', label: 'مقاله تایید شده' },
    { value: 'RJ', label: 'مقاله رد شده' }
  ];

  // Type options
  const typeOptions = [
    { value: 'SS', label: 'اسلایدشو' },
    { value: 'VD', label: 'ویدیو' },
    { value: 'TX', label: 'متن' }
  ];

  // Load article data if editing
  useEffect(() => {
    if (isEditing && id) {
      // Find the article in newsData
      const article = newsData.find(item => item.id === parseInt(id));
      if (article) {
        setFormData({
          author: article.author || '',
          category: article.category?.fa || '',
          title: {
            fa: article.title?.fa || '',
            en: article.title?.en || ''
          },
          body: {
            fa: article.body?.fa || '',
            en: article.body?.en || ''
          },
          status: article.status || 'DR',
          type: article.type || 'TX',
          slug: article.slug || '',
          video_url: article.video_url || '',
          hits: article.views || 0,
          likes: article.likes || 0
        });
      }
    }
  }, [isEditing, id]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.author.trim()) {
      newErrors.author = 'لطفا نام نویسنده را وارد کنید';
    }

    if (!formData.category.trim()) {
      newErrors.category = 'لطفا دسته بندی را وارد کنید';
    }

    if (!formData.title.fa.trim() && !formData.title.en.trim()) {
      newErrors.title = 'لطفا عنوان مقاله را وارد کنید';
    }

    if (!formData.body.fa.trim() && !formData.body.en.trim()) {
      newErrors.body = 'لطفا متن مقاله را وارد کنید';
    }

    if (!formData.slug.trim()) {
      newErrors.slug = 'لطفا جهت مقاله را وارد کنید';
    }

    if (formData.type === 'VD' && !formData.video_url.trim()) {
      newErrors.video_url = 'لطفا آدرس ویدیو را وارد کنید';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleTitleChange = (lang, value) => {
    setFormData(prev => ({
      ...prev,
      title: {
        ...prev.title,
        [lang]: value
      }
    }));
  };

  const handleBodyChange = (lang, value) => {
    setFormData(prev => ({
      ...prev,
      body: {
        ...prev.body,
        [lang]: value
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setShowSuccess(true);
      setTimeout(() => {
        navigate('/admin');
      }, 2000);
    } catch (error) {
      setErrors({ submit: 'مقاله ذخیره نشد' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    navigate('/admin');
  };

  const tabs = [
    { id: 'persian', label: 'فارسی', lang: 'fa' },
    { id: 'english', label: 'English', lang: 'en' }
  ];

  return (
    <div className="min-h-screen bg-quinary-tint-600 py-8">
      <div className="max-w-[1200px] mx-auto px-4">
        {/* Header */}
        <div className="bg-quinary-tint-800 rounded-2xl shadow-[0_0_16px_rgba(0,0,0,0.25)] p-6 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <button
                onClick={handleBack}
                className={`p-2 bg-quinary-tint-600 rounded-lg hover:bg-quinary-tint-500 transition-colors duration-300 ${isRTL ? 'ml-4' : 'mr-4'}`}
              >
                <Icons.ArrowLeft isRTL={isRTL} />
              </button>
              <div className={`${isRTL ? 'mr-4 text-right' : 'ml-4 text-left'}`}>
                <h1 className="text-[24px] sm:text-[32px] font-bold text-primary">
                  {isEditing ? 'ویرایش مقاله' : 'افزودن مقاله جدید'}
                </h1>
                <p className="text-[16px] text-secondary">
                  {isEditing ? 'در این صفحه می توانید مقاله خود را ویرایش کنید' : 'در این صفحه می توانید مقاله جدیدی ایجاد کنید'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="bg-quinary-tint-800 rounded-2xl shadow-[0_0_16px_rgba(0,0,0,0.25)] p-6">
          <motion.form
            onSubmit={handleSubmit}
            className="space-y-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Author */}
              <div>
                <label className={`block text-[16px] text-secondary mb-2 ${isRTL ? 'text-right' : 'text-left'}`}>
                  نویسنده *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Icons.User className="text-secondary" />
                  </div>
                  <select
                    value={formData.author}
                    onChange={(e) => handleInputChange('author', e.target.value)}
                    className={`w-full pl-10 pr-4 py-3 bg-quinary-tint-600 text-primary rounded-lg border-2 ${
                      errors.author ? 'border-quaternary' : 'border-quinary-tint-500'
                    } focus:border-primary outline-none transition-colors duration-300`}
                  >
                    <option value="">انتخاب نویسنده</option>
                    {fakeUsers.filter(user => user.is_author).map(user => (
                      <option key={user.id} value={user.id}>
                        {user.first_name} {user.last_name}
                      </option>
                    ))}
                  </select>
                </div>
                {errors.author && (
                  <p className="text-quaternary text-[14px] mt-1">{errors.author}</p>
                )}
              </div>

              {/* Category */}
              <div>
                <label className={`block text-[16px] text-secondary mb-2 ${isRTL ? 'text-right' : 'text-left'}`}>
                  دسته بندی *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Icons.Category className="text-secondary" />
                  </div>
                  <input
                    type="text"
                    value={formData.category}
                    onChange={(e) => handleInputChange('category', e.target.value)}
                    className={`w-full pl-10 pr-4 py-3 bg-quinary-tint-600 text-primary rounded-lg border-2 ${
                      errors.category ? 'border-quaternary' : 'border-quinary-tint-500'
                    } focus:border-primary outline-none transition-colors duration-300`}
                    placeholder="دسته بندی"
                  />
                </div>
                {errors.category && (
                  <p className="text-quaternary text-[14px] mt-1">{errors.category}</p>
                )}
              </div>
            </div>

            {/* Title and Body Tabs */}
            <div className="space-y-6">
              {/* Tab Navigation */}
              <div className="flex border-b border-quinary-tint-500">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-6 py-3 text-[16px] font-medium transition-all duration-300 border-b-2 ${
                      activeTab === tab.id
                        ? 'text-primary border-primary'
                        : 'text-secondary border-transparent hover:text-primary hover:border-quinary-tint-400'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              <div className="space-y-6">
                {activeTab === 'persian' && (
                  <div className="space-y-6">
                    {/* Persian Title */}
                    <div>
                      <label className={`block text-[16px] text-secondary mb-2 ${isRTL ? 'text-right' : 'text-left'}`}>
                        عنوان مقاله (فارسی) *
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Icons.Title className="text-secondary" />
                        </div>
                        <input
                          type="text"
                          value={formData.title.fa}
                          onChange={(e) => handleTitleChange('fa', e.target.value)}
                          className={`w-full pl-10 pr-4 py-3 bg-quinary-tint-600 text-primary rounded-lg border-2 ${
                            errors.title ? 'border-quaternary' : 'border-quinary-tint-500'
                          } focus:border-primary outline-none transition-colors duration-300`}
                          placeholder="عنوان مقاله"
                          dir="rtl"
                        />
                      </div>
                    </div>

                    {/* Persian Body */}
                    <div>
                      <label className={`block text-[16px] text-secondary mb-2 ${isRTL ? 'text-right' : 'text-left'}`}>
                        متن مقاله (فارسی) *
                      </label>
                      <div className="relative">
                        <div className="absolute top-3 left-3 flex items-start pointer-events-none">
                          <Icons.Body className="text-secondary mt-1" />
                        </div>
                        <textarea
                          value={formData.body.fa}
                          onChange={(e) => handleBodyChange('fa', e.target.value)}
                          rows={8}
                          className={`w-full pl-10 pr-4 py-3 bg-quinary-tint-600 text-primary rounded-lg border-2 ${
                            errors.body ? 'border-quaternary' : 'border-quinary-tint-500'
                          } focus:border-primary outline-none transition-colors duration-300 resize-vertical`}
                          placeholder="متن مقاله"
                          dir="rtl"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'english' && (
                  <div className="space-y-6">
                    {/* English Title */}
                    <div>
                      <label className={`block text-[16px] text-secondary mb-2 ${isRTL ? 'text-right' : 'text-left'}`}>
                        عنوان مقاله (English) *
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Icons.Title className="text-secondary" />
                        </div>
                        <input
                          type="text"
                          value={formData.title.en}
                          onChange={(e) => handleTitleChange('en', e.target.value)}
                          className={`w-full pl-10 pr-4 py-3 bg-quinary-tint-600 text-primary rounded-lg border-2 ${
                            errors.title ? 'border-quaternary' : 'border-quinary-tint-500'
                          } focus:border-primary outline-none transition-colors duration-300`}
                          placeholder="عنوان مقاله"
                          dir="ltr"
                        />
                      </div>
                    </div>

                    {/* English Body */}
                    <div>
                      <label className={`block text-[16px] text-secondary mb-2 ${isRTL ? 'text-right' : 'text-left'}`}>
                        متن مقاله (English) *
                      </label>
                      <div className="relative">
                        <div className="absolute top-3 left-3 flex items-start pointer-events-none">
                          <Icons.Body className="text-secondary mt-1" />
                        </div>
                        <textarea
                          value={formData.body.en}
                          onChange={(e) => handleBodyChange('en', e.target.value)}
                          rows={8}
                          className={`w-full pl-10 pr-4 py-3 bg-quinary-tint-600 text-primary rounded-lg border-2 ${
                            errors.body ? 'border-quaternary' : 'border-quinary-tint-500'
                          } focus:border-primary outline-none transition-colors duration-300 resize-vertical`}
                          placeholder="متن مقاله"
                          dir="ltr"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {(errors.title || errors.body) && (
                <div className="text-quaternary text-[14px]">
                  {errors.title && <p>{errors.title}</p>}
                  {errors.body && <p>{errors.body}</p>}
                </div>
              )}
            </div>

            {/* Article Settings */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Status */}
              <div className="flex items-center justify-between p-4 bg-quinary-tint-600 rounded-lg">
                <span className="text-[16px] text-secondary">وضعیت مقاله</span>
                <select
                  value={formData.status}
                  onChange={(e) => handleInputChange('status', e.target.value)}
                  className="px-3 py-1 bg-quinary-tint-700 text-secondary rounded border border-quinary-tint-500 focus:border-primary outline-none"
                >
                  {statusOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Type */}
              <div className="flex items-center justify-between p-4 bg-quinary-tint-600 rounded-lg">
                <span className="text-[16px] text-secondary">نوع مقاله</span>
                <select
                  value={formData.type}
                  onChange={(e) => handleInputChange('type', e.target.value)}
                  className="px-3 py-1 bg-quinary-tint-700 text-secondary rounded border border-quinary-tint-500 focus:border-primary outline-none"
                >
                  {typeOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Additional Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Slug */}
              <div>
                <label className={`block text-[16px] text-secondary mb-2 ${isRTL ? 'text-right' : 'text-left'}`}>
                  جهت مقاله *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Icons.Slug className="text-secondary" />
                  </div>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => handleInputChange('slug', e.target.value)}
                    className={`w-full pl-10 pr-4 py-3 bg-quinary-tint-600 text-primary rounded-lg border-2 ${
                      errors.slug ? 'border-quaternary' : 'border-quinary-tint-500'
                    } focus:border-primary outline-none transition-colors duration-300`}
                    placeholder="جهت مقاله"
                    dir="ltr"
                  />
                </div>
                {errors.slug && (
                  <p className="text-quaternary text-[14px] mt-1">{errors.slug}</p>
                )}
              </div>

              {/* Video URL (only if type is video) */}
              {formData.type === 'VD' && (
                <div>
                  <label className={`block text-[16px] text-secondary mb-2 ${isRTL ? 'text-right' : 'text-left'}`}>
                    آدرس ویدیو *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Icons.Video className="text-secondary" />
                    </div>
                    <input
                      type="url"
                      value={formData.video_url}
                      onChange={(e) => handleInputChange('video_url', e.target.value)}
                      className={`w-full pl-10 pr-4 py-3 bg-quinary-tint-600 text-primary rounded-lg border-2 ${
                        errors.video_url ? 'border-quaternary' : 'border-quinary-tint-500'
                      } focus:border-primary outline-none transition-colors duration-300`}
                      placeholder="آدرس ویدیو"
                      dir="ltr"
                    />
                  </div>
                  {errors.video_url && (
                    <p className="text-quaternary text-[14px] mt-1">{errors.video_url}</p>
                  )}
                </div>
              )}
            </div>

            {/* Read Only Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Hits */}
              <div>
                <label className={`block text-[16px] text-secondary mb-2 ${isRTL ? 'text-right' : 'text-left'}`}>
                  بازدید
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Icons.Views className="text-secondary" />
                  </div>
                  <input
                    type="number"
                    value={formData.hits}
                    disabled
                    className="w-full pl-10 pr-4 py-3 bg-quinary-tint-500 text-secondary rounded-lg border-2 border-quinary-tint-500 cursor-not-allowed"
                  />
                </div>
              </div>

              {/* Likes */}
              <div>
                <label className={`block text-[16px] text-secondary mb-2 ${isRTL ? 'text-right' : 'text-left'}`}>
                  پسند
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Icons.Likes className="text-secondary" />
                  </div>
                  <input
                    type="number"
                    value={formData.likes}
                    disabled
                    className="w-full pl-10 pr-4 py-3 bg-quinary-tint-500 text-secondary rounded-lg border-2 border-quinary-tint-500 cursor-not-allowed"
                  />
                </div>
              </div>
            </div>

            {/* Submit Error */}
            {errors.submit && (
              <div className="flex items-center p-4 bg-quaternary/10 border border-quaternary rounded-lg">
                <Icons.XMark className="text-quaternary mr-2" />
                <span className="text-quaternary">{errors.submit}</span>
              </div>
            )}

            {/* Success Message */}
            {showSuccess && (
              <div className="flex items-center p-4 bg-primary/10 border border-primary rounded-lg">
                <Icons.Check className="text-primary mr-2" />
                <span className="text-primary">مقاله با موفقیت ذخیره شد</span>
              </div>
            )}

            {/* Form Actions */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 px-6 py-3 bg-primary text-quinary-tint-800 text-[16px] font-semibold rounded-lg hover:bg-primary-tint-200 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isLoading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-quinary-tint-800"></div>
                ) : (
                  'ذخیره مقاله'
                )}
              </button>
              <button
                type="button"
                onClick={handleBack}
                className="flex-1 px-6 py-3 border-2 border-primary text-primary text-[16px] font-semibold rounded-lg hover:bg-primary hover:text-quinary-tint-800 transition-colors duration-300"
              >
                'انصراف'
              </button>
            </div>
          </motion.form>
        </div>
      </div>
    </div>
  );
};

export default ArticleForm; 