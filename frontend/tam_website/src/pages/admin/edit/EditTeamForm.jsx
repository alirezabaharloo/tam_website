import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import useAdminHttp from '../../../hooks/useAdminHttp';
import { validateTeamForm, isFormValid } from '../../../validators/TeamValidators';
import { successNotif, errorNotif } from '../../../utils/customNotifs';
import SomethingWentWrong from '../../../components/UI/SomethingWentWrong';
import LazyImage from '../../../components/UI/LazyImage';
import SpinLoader from '../../../components/UI/SpinLoader';
import TeamNotFound from '../../../components/UI/TeamNotFound';
import PageNotFound from '../../../pages/PageNotFound';

const EditTeamForm = () => {
  const navigate = useNavigate();
  const { teamId } = useParams();
  const [activeTab, setActiveTab] = useState('persian');
  const [formData, setFormData] = useState({ name_fa: '', name_en: '', image: null });
  const [originalData, setOriginalData] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [errors, setErrors] = useState({});
  const [tabErrors, setTabErrors] = useState({ persian: false, english: false });
  const [hasChanges, setHasChanges] = useState(false);

  // useAdminHttp for fetching team details
  const {
    isLoading: isFetching,
    isError: fetchError,
    data: teamDetails,
    errorContent: fetchErrorContent,
    sendRequest: fetchTeamDetails
  } = useAdminHttp(`http://localhost:8000/api/admin/team-detail/${teamId}/`);

  // useAdminHttp for submitting updates
  const {
    isLoading: submitLoading,
    isError: submitError,
    errorContent: submitErrorContent,
    sendRequest: submitUpdate
  } = useAdminHttp();

  // Fetch team details on mount
  useEffect(() => {
    fetchTeamDetails();
    // eslint-disable-next-line
  }, [teamId]);

  // Populate form when team details are loaded
  useEffect(() => {
    if (teamDetails && teamDetails.id) {
      const initialFormData = {
        name_fa: teamDetails.name_fa || '',
        name_en: teamDetails.name_en || '',
        image: null
      };
      setFormData(initialFormData);
      setOriginalData(initialFormData);
      if (teamDetails.image) setImagePreview(teamDetails.image);
    }
  }, [teamDetails]);

  // Update tab error indicators when errors change
  useEffect(() => {
    setTabErrors({
      persian: !!errors.name_fa,
      english: !!errors.name_en
    });
  }, [errors]);

  // Handle tab switching
  const handleTabChange = (tabId) => setActiveTab(tabId);

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

  // Check if any field has changed
  useEffect(() => {
    if (!originalData) {
      setHasChanges(false);
      return;
    }
    // Check if any field has changed
    const fieldsChanged =
      formData.name_fa !== originalData.name_fa ||
      formData.name_en !== originalData.name_en;

    // Check if image changed (new image selected or image removed)
    const imageChanged =
      (formData.image !== null) ||
      (!imagePreview && originalData && originalData.image);

    setHasChanges(fieldsChanged || imageChanged);
  }, [formData, originalData, imagePreview]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateTeamForm({ ...formData, image: imagePreview || formData.image });
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      if (validationErrors.name_fa && activeTab !== 'persian') setActiveTab('persian');
      else if (validationErrors.name_en && activeTab !== 'english') setActiveTab('english');
      return;
    }
    setErrors({});
    const formDataToSend = new FormData();
    if (formData.name_fa !== originalData.name_fa) formDataToSend.append('name_fa', formData.name_fa);
    if (formData.name_en !== originalData.name_en) formDataToSend.append('name_en', formData.name_en);
    if (formData.image) formDataToSend.append('image', formData.image);
    try {
      const response = await submitUpdate(`http://localhost:8000/api/admin/team-update/${teamId}/`, 'PATCH', formDataToSend);
      if (response?.isError || response?.name_fa || response?.name_en || response?.image) {
        setErrors(response?.errorContent || response);
        errorNotif('خطا در بروزرسانی تیم');
        return;
      }
      successNotif('تیم با موفقیت بروزرسانی شد');
      fetchTeamDetails(); // Refresh details after update
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

  if (isFetching) return <SpinLoader />;
  if (teamDetails?.errorContent?.detail === "No Team matches the given query.") return <TeamNotFound />;
  // Loader and error handling
  if (teamDetails?.errorContent?.detail === "No Team matches the given query." || teamDetails?.errorContent?.detail === "page not found.") {
    return (
      <TeamNotFound />
    );
  }
  if (submitError || teamDetails?.isError || fetchError) return <SomethingWentWrong />;
  
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
                  <LazyImage    
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
                className={`px-6 py-2 rounded-lg font-bold transition-colors duration-300 ${hasChanges ? 'bg-primary text-quinary-tint-800 hover:bg-primary-tint-100' : 'bg-quinary-tint-400 text-secondary cursor-not-allowed'}`}
                disabled={!hasChanges || submitLoading}
              >
                {submitLoading ? 'در حال بروزرسانی...' : 'ذخیره تغییرات'}
              </button>
            </div>
          </motion.form>
        </div>
      </div>
    </div>
  );
};

export default EditTeamForm; 