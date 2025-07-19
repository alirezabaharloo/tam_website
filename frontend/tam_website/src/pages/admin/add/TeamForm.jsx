import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import useAdminHttp from '../../../hooks/useAdminHttp';
import { validateTeamForm, isFormValid } from '../../../validators/TeamValidators';
import { successNotif, errorNotif } from '../../../utils/customNotifs';
import SomethingWentWrong from '../../../pages/UI/SomethingWentWrong';
import { ArticleFormIcons } from '../../../data/Icons';

const Icons = ArticleFormIcons;

const TeamForm = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('persian');
  const [formData, setFormData] = useState({
    name_fa: '',
    name_en: '',
    image: null
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [errors, setErrors] = useState({});
  const [tabErrors, setTabErrors] = useState({ persian: false, english: false });
  const { isError, isLoading, sendRequest, response } = useAdminHttp();
  const imageInputRef = useRef(null);

  useEffect(() => {
    setTabErrors({
      persian: !!errors.name_fa,
      english: !!errors.name_en
    });
  }, [errors]);

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
  };

  const handleInputChange = (field, value) => {
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
      if (errors.image) {
        setErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors.image;
          return newErrors;
        });
      }
      setFormData(prev => ({ ...prev, image: file }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateTeamForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      if (validationErrors.name_fa && activeTab !== 'persian') setActiveTab('persian');
      else if (validationErrors.name_en && activeTab !== 'english') setActiveTab('english');
      return;
    }
    setErrors({});
    const formDataToSend = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      formDataToSend.append(key, value);
    });
    try {
      const response = await sendRequest('http://localhost:8000/api/admin/team-create/', 'POST', formDataToSend);
      if (response?.isError) {
        setErrors(response?.errorContent || {});
        errorNotif('خطا در ایجاد تیم');
      } else {
        successNotif('تیم جدید اضافه شد');
        setTimeout(() => {
          navigate('/admin/teams', {
            state: {
              preserveFilters: true
            }
          });
        }, 2000);
      }
    } catch (err) {
      errorNotif('خطا در ارتباط با سرور');
      if (err && err.response && err.response.data) {
        setErrors(err.response.data);
      } else if (typeof err === 'object' && err !== null) {
        setErrors(err);
      } else {
        setErrors({ general: 'خطایی رخ داد.' });
      }
    }
  };

  const handleBack = () => {
    window.history.back();
  };
  
  const handleViewImage = (imageUrl) => {
    window.open(imageUrl, '_blank');
  };

  const handleChangeImage = () => {
    if (imageInputRef.current) {
      imageInputRef.current.click();
    }
  };

  const tabs = [
    { id: 'persian', label: 'فارسی', lang: 'fa' },
    { id: 'english', label: 'English', lang: 'en' }
  ];

  const flashingDotCSS = `
    @keyframes flash {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.3; }
    }
  `;

  if (isError || response?.isError) {
    return <SomethingWentWrong />;
  }
  
  const isRTL = true;

  return (
    <div className="min-h-screen bg-quinary-tint-600">
      <style>{flashingDotCSS}</style>
      <div className="max-w-[1200px] mx-auto px-4 mt-[1rem]">
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
                  افزودن تیم جدید
                </h1>
                <p className="text-[16px] text-secondary">
                  در این صفحه می توانید تیم جدیدی ایجاد کنید
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-quinary-tint-800 rounded-2xl shadow p-6">
          <motion.form
            onSubmit={handleSubmit}
            className="space-y-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex border-b border-quinary-tint-500 mb-6">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => handleTabChange(tab.id)}
                  className={`px-6 py-3 text-[16px] font-medium transition-all duration-300 border-b-2 relative ${
                    activeTab === tab.id
                      ? 'text-primary border-primary'
                      : 'text-secondary border-transparent hover:text-primary hover:border-quinary-tint-400'
                  }`}
                >
                  {tab.label}
                  {activeTab !== tab.id && tabErrors[tab.id] && (
                    <span
                      className="absolute -top-1 -right-1 w-3 h-3 bg-quaternary rounded-full"
                      style={{ animation: 'flash 1s infinite ease-in-out' }}
                    />
                  )}
                </button>
              ))}
            </div>
            <div className="grid grid-cols-1 gap-6">
              {activeTab === 'persian' && (
                <div>
                  <label className="block text-[16px] text-secondary mb-2 text-right">نام تیم (فارسی) *</label>
                  <input
                    type="text"
                    value={formData.name_fa}
                    onChange={e => handleInputChange('name_fa', e.target.value)}
                    className="w-full px-4 py-3 bg-quinary-tint-600 text-primary rounded-lg border-2 border-quinary-tint-500 focus:border-primary outline-none transition-colors duration-300"
                    dir="rtl"
                  />
                  {errors.name_fa && <div className="text-red-500 text-sm mt-1">{errors.name_fa}</div>}
                </div>
              )}
              {activeTab === 'english' && (
                <div>
                  <label className="block text-[16px] text-secondary mb-2 text-left">Team Name (English) *</label>
                  <input
                    type="text"
                    value={formData.name_en}
                    onChange={e => handleInputChange('name_en', e.target.value)}
                    className="w-full px-4 py-3 bg-quinary-tint-600 text-primary rounded-lg border-2 border-quinary-tint-500 focus:border-primary outline-none transition-colors duration-300"
                    dir="ltr"
                  />
                  {errors.name_en && <div className="text-red-500 text-sm mt-1">{errors.name_en}</div>}
                </div>
              )}
            </div>
            <div className="space-y-4">
              <label className="block text-[16px] text-secondary mb-2 text-right">
                تصویر تیم *
              </label>
              <div
                className={`w-full h-[300px] rounded-lg border-2 ${
                  errors.image ? 'border-quaternary' : 'border-quinary-tint-500'
                } relative overflow-hidden cursor-pointer group`}
                onClick={handleChangeImage}
              >
                {imagePreview ? (
                  <>
                    <img
                      src={imagePreview}
                      alt="Team preview"
                      className="w-full h-full object-cover transition-all duration-300 group-hover:blur-sm group-hover:brightness-50"
                    />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="flex gap-4">
                        <button
                          type="button"
                          className="p-3 bg-white bg-opacity-20 rounded-full hover:bg-opacity-30 transition-all duration-300"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleViewImage(imagePreview);
                          }}
                        >
                          <Icons.View className="text-white text-xl" />
                        </button>
                        <button
                          type="button"
                          className="p-3 bg-white bg-opacity-20 rounded-full hover:bg-opacity-30 transition-all duration-300"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleChangeImage();
                          }}
                        >
                          <Icons.Edit className="text-white text-xl" />
                        </button>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-quinary-tint-600 hover:bg-quinary-tint-500 transition-colors duration-300">
                    <Icons.Add className="text-secondary text-4xl mb-2" />
                    <span className="text-secondary">انتخاب تصویر</span>
                  </div>
                )}
                <input
                  type="file"
                  ref={imageInputRef}
                  onChange={handleImageChange}
                  className="hidden"
                  accept="image/*"
                />
              </div>
              {errors.image && <div className="text-red-500 text-sm mt-1 self-start">{errors.image}</div>}
            </div>
            {errors.general && <div className="text-red-500 text-sm mt-2">{errors.general}</div>}
            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              <button
                type="submit"
                disabled={isLoading || !isFormValid(formData)}
                className="flex-1 px-6 py-3 bg-primary text-quinary-tint-800 text-[16px] font-semibold rounded-lg hover:bg-primary-tint-200 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isLoading ? <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-quinary-tint-800"></div> : 'ایجاد تیم'}
              </button>
              <button
                type="button"
                onClick={handleBack}
                className="flex-1 px-6 py-3 border-2 border-primary text-primary text-[16px] font-semibold rounded-lg hover:bg-primary hover:text-quinary-tint-800 transition-colors duration-300"
              >
                انصراف
              </button>
            </div>
          </motion.form>
        </div>
      </div>
    </div>
  );
};

export default TeamForm; 