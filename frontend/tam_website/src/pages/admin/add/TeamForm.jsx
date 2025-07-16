import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import useAdminHttp from '../../../hooks/useAdminHttp';
import { validateTeamForm, isFormValid } from '../../../validators/TeamValidators';
import { successNotif, errorNotif } from '../../../utils/customNotifs';
import SomethingWentWrong from '../../../components/UI/SomethingWentWrong';

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

  // Update tab error indicators when errors change
  useEffect(() => {
    setTabErrors({
      persian: !!errors.name_fa,
      english: !!errors.name_en
    });
  }, [errors]);

  // Handle tab switching
  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
  };

  // Handle input changes
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

  // Handle image file selection
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

  // Handle form submission
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
        // Send request to API
      const response = await sendRequest('http://localhost:8000/api/admin/team-create/', 'POST', formDataToSend);
      
      if (response?.isError) {
        // Handle validation errors from backend
        setErrors(response?.errorContent || {});
        errorNotif('خطا در ایجاد تیم');
      } else {
        // Show success notification and redirect
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

  // Tabs for bilingual input
  const tabs = [
    { id: 'persian', label: 'فارسی', lang: 'fa' },
    { id: 'english', label: 'English', lang: 'en' }
  ];

  // CSS for flashing error indicator
  const flashingDotCSS = `
    @keyframes flash {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.3; }
    }
  `;


  if (isError || response?.isError) {
    return <SomethingWentWrong />;
  }

  return (
    <div className="min-h-screen bg-quinary-tint-600">
      <style>{flashingDotCSS}</style>
      <div className="max-w-[600px] mx-auto px-4 mt-[2rem]">
        <div className="bg-quinary-tint-800 rounded-2xl shadow p-6">
          <motion.form
            onSubmit={handleSubmit}
            className="space-y-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Tab Navigation */}
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
                  {/* Error indicator dot */}
                  {activeTab !== tab.id && tabErrors[tab.id] && (
                    <span
                      className="absolute -top-1 -right-1 w-3 h-3 bg-quaternary rounded-full"
                      style={{ animation: 'flash 1s infinite ease-in-out' }}
                    />
                  )}
                </button>
              ))}
            </div>
            {/* Name Fields (Tabbed) */}
            <div className="grid grid-cols-1 gap-6">
              {activeTab === 'persian' && (
                <div>
                  <label className="block text-sm font-medium text-secondary mb-1">نام تیم (فارسی)</label>
                  <input
                    type="text"
                    value={formData.name_fa}
                    onChange={e => handleInputChange('name_fa', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-quinary-tint-400 bg-quinary-tint-700 text-primary focus:outline-none focus:ring-2 focus:ring-primary"
                    dir="rtl"
                  />
                  {errors.name_fa && <div className="text-red-500 text-sm mt-1">{errors.name_fa}</div>}
                </div>
              )}
              {activeTab === 'english' && (
                <div>
                  <label className="block text-sm font-medium text-secondary mb-1">نام تیم (انگلیسی)</label>
                  <input
                    type="text"
                    value={formData.name_en}
                    onChange={e => handleInputChange('name_en', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-quinary-tint-400 bg-quinary-tint-700 text-primary focus:outline-none focus:ring-2 focus:ring-primary"
                    dir="ltr"
                  />
                  {errors.name_en && <div className="text-red-500 text-sm mt-1">{errors.name_en}</div>}
                </div>
              )}
            </div>
            {/* Image Field */}
            <div className="flex flex-col items-center gap-4">
              <label className="block text-sm font-medium text-secondary mb-1 self-start">تصویر تیم</label>
              <div className="flex items-center gap-4 w-full">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="flex-1 px-3 py-2 rounded-lg border border-quinary-tint-400 bg-quinary-tint-700 text-primary focus:outline-none focus:ring-2 focus:ring-primary"
                />
                {imagePreview && (
                  <img
                    src={imagePreview}
                    alt="پیش‌نمایش تیم"
                    className="w-20 h-20 object-cover rounded-lg border border-quinary-tint-400"
                  />
                )}
              </div>
              {errors.image && <div className="text-red-500 text-sm mt-1 self-start">{errors.image}</div>}
            </div>
            {errors.general && <div className="text-red-500 text-sm mt-2">{errors.general}</div>}
            <div className="flex justify-end">
              <button
                type="submit"
                className={`px-6 py-2 rounded-lg font-bold transition-colors duration-300 ${isFormValid(formData) ? 'bg-primary text-quinary-tint-800 hover:bg-primary-tint-100' : 'bg-quinary-tint-400 text-secondary cursor-not-allowed'}`}
                disabled={!isFormValid(formData) || isLoading}
              >
                {isLoading ? <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-quinary-tint-800"></div>: 'ایجاد تیم'}
              </button>
            </div>
          </motion.form>
        </div>
      </div>
    </div>
  );
};

export default TeamForm; 