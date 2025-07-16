import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import useAdminHttp from '../../../hooks/useAdminHttp';
import { successNotif, errorNotif } from '../../../utils/customNotifs';
import { validatePlayerNumber, validatePlayerForm, isFormValid } from '../../../validators/PlayerValidators';

const PlayerForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('persian');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [imagePreview, setImagePreview] = useState(null); // Store image preview URL
  const [positionOptions, setPositionOptions] = useState({});
  
  // Track if tabs have errors
  const [tabErrors, setTabErrors] = useState({
    persian: false, 
    english: false
  });
  
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
  
  // First level validation: Check if all fields have values
  const [formIsComplete, setFormIsComplete] = useState(false);
  
  useEffect(() => {
    setFormIsComplete(isFormValid(formData));
  }, [formData]);
  
  // Update tab error indicators when errors change
  useEffect(() => {
    const newTabErrors = {
      persian: errors.name_fa ? true : false,
      english: errors.name_en ? true : false
    };
    
    setTabErrors(newTabErrors);
    
    // This will ensure tab errors are always in sync with actual errors
    // When an error is fixed, its indicator will disappear
  }, [errors]);
  
  // Handle tab switching without clearing error indicators
  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    
    // We no longer clear the error indicator just because we switched to that tab
    // The indicator should only clear when the actual error is fixed
  };
  
  // Handle form input changes
  const handleInputChange = (field, value) => {
    // Clear error for the field being edited
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
      
      // Note: We don't need to manually update tabErrors here
      // The useEffect that watches errors will automatically update tabErrors
      // when errors change, ensuring the indicator is only removed when the error is fixed
    }
    
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
      
      // Clear image error if exists
      if (errors.image) {
        setErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors.image;
          return newErrors;
        });
        
        // The useEffect watching errors will automatically update tabErrors
        // ensuring the indicator is only removed when the error is fixed
      }
      
      setFormData(prev => ({
        ...prev,
        image: file
      }));
    }
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate all fields using the shared validation function
    const validationErrors = validatePlayerForm(formData);
    
    // If there are validation errors, display them and stop submission
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      
      // Switch to the appropriate tab if there's an error in a tab that's not active
      if (validationErrors.name_fa && activeTab !== 'persian') {
        setActiveTab('persian');
      } else if (validationErrors.name_en && activeTab !== 'english') {
        setActiveTab('english');
      }
      
      return;
    }
    
    setIsLoading(true);
    
    const formDataToSend = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      formDataToSend.append(key, value);
    });

    try {
      // Send request to API
      const response = await sendRequest('http://localhost:8000/api/admin/player-create/', 'POST', formDataToSend);
      
      if (response?.isError) {
        // Handle validation errors from backend
        setErrors(response?.errorContent || {});
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

  // CSS for flashing error indicator
  const flashingDotCSS = `
    @keyframes flash {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.3; }
    }
  `;

  return (
    <div className="min-h-screen bg-quinary-tint-600">
      <style>{flashingDotCSS}</style>
      <div className="max-w-[1200px] mx-auto px-4 mt-[1rem]">

        {/* Form */}
        <div className="bg-quinary-tint-800 rounded-2xl shadow-[0_0_16px_rgba(0,0,0,0.25)] p-6">
          <motion.form
            onSubmit={handleSubmit}
            className="space-y-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >{/* Player Name Tabs */}
            <div className="space-y-6">
              {/* Tab Navigation */}
            <div className="flex border-b border-quinary-tint-500 justify-between">
             
             <div>
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
              <div>
                <span
                    onClick={handleBack}
                    className="text-white bg-primary text-lg flex items-center py-[0.5rem] px-[1rem] rounded-lg cursor-pointer hover:bg-primary-tint-100 transition-colors duration-300"
                  >
                    بازگشت
                </span>
              </div>
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
                          errors.name_fa ? 'border-quaternary' : 'border-quinary-tint-500'
                        } focus:border-primary outline-none transition-colors duration-300`}
                        placeholder="نام بازیکن به فارسی"
                        dir="rtl"
                      />
                    </div>
                    {errors.name_fa && (
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
                          errors.name_en ? 'border-quaternary' : 'border-quinary-tint-500'
                        } focus:border-primary outline-none transition-colors duration-300`}
                        placeholder="Player name in English"
                        dir="ltr"
                      />
                    </div>
                    {errors.name_en && (
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
                      errors.number ? 'border-quaternary' : 'border-quinary-tint-500'
                    } focus:border-primary outline-none transition-colors duration-300`}
                    placeholder="شماره پیراهن (1-99)"
                    min="1"
                    max="99"
                  />
                </div>
                {errors.number && (
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
                      errors.position ? 'border-quaternary' : 'border-quinary-tint-500'
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
                {errors.position && (
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
                      errors.goals ? 'border-quaternary' : 'border-quinary-tint-500'
                    } focus:border-primary outline-none transition-colors duration-300`}
                    placeholder="تعداد گل"
                    min="0"
                  />
                </div>
                {errors.goals && (
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
                      errors.games ? 'border-quaternary' : 'border-quinary-tint-500'
                    } focus:border-primary outline-none transition-colors duration-300`}
                    placeholder="تعداد بازی"
                    min="0"
                  />
                </div>
                {errors.games && (
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
                    errors.image ? 'border-quaternary' : 'border-quinary-tint-500'
                  } focus:border-primary outline-none transition-colors duration-300`}
                />
              </div>
              {errors.image && (
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
            <div className="flex justify-center flex-col items-center pt-6">
              <button
                type="submit"
                disabled={submitLoading || !formIsComplete}
                className={`px-8 py-3 rounded-lg text-[16px] font-semibold transition-colors duration-300 flex items-center justify-center min-w-[200px]
                  ${formIsComplete 
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
              {!formIsComplete && (
                <div className="text-quaternary text-[14px] mt-1 text-right">
                  <p>لطفا همه ی فیلد های فارسی و انگلیسی رو پر کنید</p>
                </div>
                )}
            </div>
          </motion.form>
        </div>
      </div>
    </div>
  );
};

export default PlayerForm;