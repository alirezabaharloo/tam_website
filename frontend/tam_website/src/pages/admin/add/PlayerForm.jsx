import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import useAdminHttp from '../../../hooks/useAdminHttp';
import { successNotif, errorNotif } from '../../../utils/customNotifs';
import { validatePlayerForm, isFormValid } from '../../../utils/PlayerValidators';

const PlayerForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('persian');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [showErrors, setShowErrors] = useState(false); // Control when to display errors
  const [imagePreview, setImagePreview] = useState(null); // Store image preview URL
  const [positionOptions, setPositionOptions] = useState({});
  
  // Initial form data
  const [formData, setFormData] = useState({
    name_fa: '',
    name_en: '',
    number: '',
    goals: '',
    games: '',
    position: '',
    image: null
  });
  
  // Fetch player positions from the backend
  const {
    data: positions,
    isLoading: positionsLoading,
    isError: positionsError
  } = useAdminHttp('http://localhost:8000/api/admin/player-positions/');
  
  // Initialize HTTP hook for form submission
  const {
    isLoading: submitLoading,
    isError: submitError,
    errorContent: submitErrorContent,
    sendRequest
  } = useAdminHttp();
  
  // Effect to set position options once data is loaded
  useEffect(() => {
    if (positions) {
      // Filter out the empty position (used for "All" in filters)
      const filteredPositions = { ...positions };
      delete filteredPositions[''];
      setPositionOptions(filteredPositions);
    }
  }, [positions]);
  
  // Check form validity
  const [formIsValid, setFormIsValid] = useState(false);
  
  useEffect(() => {
    // Update form validity but don't show errors until submit
    setFormIsValid(isFormValid(formData));
    
    // If showing errors, update them
    if (showErrors) {
      setErrors(validatePlayerForm(formData));
    }
  }, [formData, showErrors]);
  
  // Handle form input changes
  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  // Handle image file selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Create preview URL for the selected image
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
      
      setFormData(prev => ({
        ...prev,
        image: file
      }));
    }
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setShowErrors(true); // Start showing errors
    
    // Validate form before submission
    const validationErrors = validatePlayerForm(formData);
    setErrors(validationErrors);
    
    if (Object.keys(validationErrors).length > 0) {
      return;
    }
    
    setIsLoading(true);
    
    console.log("this is the form data", formData);
    try {
      // Send request to API
      const response = await sendRequest('http://localhost:8000/api/admin/player-create/', 'POST', formData);
      console.log(formData);
      if (response.isError) {
        // Handle validation errors from backend
        setErrors(response.errorContent || {});
        errorNotif('خطا در ایجاد بازیکن');
      } else {
        // Show success notification and redirect
        successNotif('بازیکن جدید اضافه شد');
        setTimeout(() => {
          navigate('/admin/players', { 
            state: { 
              preserveFilters: true 
            }
          });
        }, 2000);
      }
    } catch (error) {
      errorNotif('خطا در ارتباط با سرور');
      console.error('Error submitting form:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle back navigation
  const handleBack = () => {
    window.history.back();
  };
  
  // Define tabs for bilingual input
  const tabs = [
    { id: 'persian', label: 'فارسی', lang: 'fa' },
    { id: 'english', label: 'English', lang: 'en' }
  ];

  const isRTL = true; // Assuming RTL layout for Persian

  return (
    <div className="min-h-screen bg-quinary-tint-600 py-8">
      <div className="max-w-[1200px] mx-auto px-4">
        {/* Back Link - Replaces the header section */}
        <div className="flex mb-6">
          <button
            onClick={handleBack}
            className="text-primary text-lg flex items-center hover:underline focus:outline-none"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="24" 
                height="24" 
                viewBox="0 0 24 24" 
                fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              className={`mr-2 ${isRTL ? 'rotate-180' : ''}`}
            >
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
            بازگشت
          </button>
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
            {/* Player Name Tabs */}
            <div className="space-y-6">
              {/* Tab Navigation */}
              <div className="flex border-b border-quinary-tint-500">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
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

              {/* Tab Content for Name */}
              <div className="space-y-6">
                {activeTab === 'persian' && (
                  <div>
                    <label className="block text-[16px] text-secondary mb-2 text-right">
                      نام بازیکن (فارسی) *
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={formData.name_fa}
                        onChange={(e) => handleInputChange('name_fa', e.target.value)}
                        className={`w-full px-4 py-3 bg-quinary-tint-600 text-primary rounded-lg border-2 ${
                          showErrors && errors.name_fa ? 'border-quaternary' : 'border-quinary-tint-500'
                        } focus:border-primary outline-none transition-colors duration-300`}
                        placeholder="نام بازیکن به فارسی"
                        dir="rtl"
                      />
                    </div>
                    {showErrors && errors.name_fa && (
                      <p className="text-quaternary text-[14px] mt-1 text-right">{errors.name_fa}</p>
                    )}
                  </div>
                )}

                {activeTab === 'english' && (
                  <div>
                    <label className="block text-[16px] text-secondary mb-2 text-right">
                      نام بازیکن (انگلیسی) *
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={formData.name_en}
                        onChange={(e) => handleInputChange('name_en', e.target.value)}
                        className={`w-full px-4 py-3 bg-quinary-tint-600 text-primary rounded-lg border-2 ${
                          showErrors && errors.name_en ? 'border-quaternary' : 'border-quinary-tint-500'
                        } focus:border-primary outline-none transition-colors duration-300`}
                        placeholder="Player name in English"
                        dir="ltr"
                      />
                    </div>
                    {showErrors && errors.name_en && (
                      <p className="text-quaternary text-[14px] mt-1 text-right">{errors.name_en}</p>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Player Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Player Number */}
              <div>
                <label className="block text-[16px] text-secondary mb-2 text-right">
                  شماره پیراهن *
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={formData.number}
                    onChange={(e) => handleInputChange('number', e.target.value)}
                    className={`w-full px-4 py-3 bg-quinary-tint-600 text-primary rounded-lg border-2 ${
                      showErrors && errors.number ? 'border-quaternary' : 'border-quinary-tint-500'
                    } focus:border-primary outline-none transition-colors duration-300`}
                    placeholder="شماره پیراهن (1-99)"
                    min="1"
                    max="99"
                  />
                </div>
                {showErrors && errors.number && (
                  <p className="text-quaternary text-[14px] mt-1 text-right">{errors.number}</p>
                )}
              </div>

              {/* Position */}
              <div>
                <label className="block text-[16px] text-secondary mb-2 text-right">
                  پست بازیکن *
                </label>
                <div className="relative">
                  <select
                    value={formData.position}
                    onChange={(e) => handleInputChange('position', e.target.value)}
                    className={`w-full px-4 py-3 bg-quinary-tint-600 text-primary rounded-lg border-2 ${
                      showErrors && errors.position ? 'border-quaternary' : 'border-quinary-tint-500'
                    } focus:border-primary outline-none transition-colors duration-300`}
                  >
                    <option value="">انتخاب پست بازیکن</option>
                    {Object.entries(positionOptions).map(([value, label]) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </select>
                </div>
                {showErrors && errors.position && (
                  <p className="text-quaternary text-[14px] mt-1 text-right">{errors.position}</p>
                )}
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Goals */}
              <div>
                <label className="block text-[16px] text-secondary mb-2 text-right">
                  تعداد گل *
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={formData.goals}
                    onChange={(e) => handleInputChange('goals', e.target.value)}
                    className={`w-full px-4 py-3 bg-quinary-tint-600 text-primary rounded-lg border-2 ${
                      showErrors && errors.goals ? 'border-quaternary' : 'border-quinary-tint-500'
                    } focus:border-primary outline-none transition-colors duration-300`}
                    placeholder="تعداد گل"
                    min="0"
                  />
                </div>
                {showErrors && errors.goals && (
                  <p className="text-quaternary text-[14px] mt-1 text-right">{errors.goals}</p>
                )}
              </div>

              {/* Games */}
              <div>
                <label className="block text-[16px] text-secondary mb-2 text-right">
                  تعداد بازی *
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={formData.games}
                    onChange={(e) => handleInputChange('games', e.target.value)}
                    className={`w-full px-4 py-3 bg-quinary-tint-600 text-primary rounded-lg border-2 ${
                      showErrors && errors.games ? 'border-quaternary' : 'border-quinary-tint-500'
                    } focus:border-primary outline-none transition-colors duration-300`}
                    placeholder="تعداد بازی"
                    min="0"
                  />
                </div>
                {showErrors && errors.games && (
                  <p className="text-quaternary text-[14px] mt-1 text-right">{errors.games}</p>
                )}
              </div>
            </div>

            {/* Player Image with Preview */}
            <div className="space-y-4">
              <label className="block text-[16px] text-secondary mb-2 text-right">
                تصویر بازیکن *
              </label>
              <div className="relative">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className={`w-full px-4 py-3 bg-quinary-tint-600 text-primary rounded-lg border-2 ${
                    showErrors && errors.image ? 'border-quaternary' : 'border-quinary-tint-500'
                  } focus:border-primary outline-none transition-colors duration-300`}
                />
              </div>
              {showErrors && errors.image && (
                <p className="text-quaternary text-[14px] mt-1 text-right">{errors.image}</p>
              )}
              
              {/* Image Preview */}
              {imagePreview && (
                <div className="mt-4 flex justify-center">
                  <img 
                    src={imagePreview} 
                    alt="Player preview" 
                    className="max-h-64 rounded-lg border-2 border-primary"
                  />
                </div>
              )}
            </div>

            {/* Form Action (Submit Button Only) */}
            <div className="flex justify-center pt-6">
              <button
                type="submit"
                disabled={submitLoading || !formIsValid}
                className={`px-8 py-3 rounded-lg text-[16px] font-semibold transition-colors duration-300 flex items-center justify-center min-w-[200px]
                  ${formIsValid 
                    ? 'bg-primary text-quinary-tint-800 hover:bg-primary-tint-200' 
                    : 'bg-gray-400 text-gray-700 cursor-not-allowed opacity-70'
                  }`}
              >
                {submitLoading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-quinary-tint-800"></div>
                ) : (
                  'ایجاد بازیکن'
                )}
              </button>
            </div>
          </motion.form>
        </div>
      </div>
    </div>
  );
};

export default PlayerForm;