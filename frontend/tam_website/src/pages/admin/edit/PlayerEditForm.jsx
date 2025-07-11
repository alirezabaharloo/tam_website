import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import useAdminHttp from '../../../hooks/useAdminHttp';
import { successNotif, errorNotif } from '../../../utils/customNotifs';
import { validatePlayerNumber, isFormValid } from '../../../utils/PlayerValidators';
import LazyImage from '../../../components/UI/LazyImage';

const PlayerEditForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { playerId } = useParams(); // Get the player ID from URL params
  const [activeTab, setActiveTab] = useState('persian');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [imagePreview, setImagePreview] = useState(null);
  const [positionOptions, setPositionOptions] = useState({});
  const [originalData, setOriginalData] = useState(null); // Store original data for comparison
  const [hasChanges, setHasChanges] = useState(false); // Track if any changes have been made
  const fileInputRef = useRef(null); // Reference to hidden file input
  
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
  
  // Fetch player details for editing
  const {
    data: playerDetails,
    isLoading: playerDetailsLoading,
    isError: playerDetailsError,
    sendRequest: fetchPlayers,
  } = useAdminHttp(`http://localhost:8000/api/admin/player-detail/${playerId}/`);
  
  // Initialize HTTP hook for form submission
  const {
    isLoading: submitLoading,
    isError: submitError,
    errorContent: submitErrorContent,
    sendRequest
  } = useAdminHttp();
  
  // Effect to populate form with player details once loaded
  useEffect(() => {
    if (playerDetails) {
      const initialFormData = {
        name_fa: playerDetails.name_fa || '',
        name_en: playerDetails.name_en || '',
        number: playerDetails.number?.toString() || '',
        goals: playerDetails.goals?.toString() || '',
        games: playerDetails.games?.toString() || '',
        position: playerDetails.position || '',
        image: null // Image is handled separately
      };
      
      setFormData(initialFormData);
      setOriginalData(initialFormData);
      
      // Set image preview if available
      if (playerDetails.image) {
        setImagePreview(playerDetails.image);
      }
    }
  }, [playerDetails]);
  
  // Effect to set position options once data is loaded
  useEffect(() => {
    if (positions) {
      // Filter out the empty position (used for "All" in filters)
      const filteredPositions = { ...positions };
      delete filteredPositions[''];
      setPositionOptions(filteredPositions);
    }
  }, [positions]);
  
  // Effect to check if form is valid and if any changes have been made
  useEffect(() => {
    // Check if data is loaded and form is valid
    const isComplete = isFormValid(formData);
    
    // Check if any fields have been changed from original values
    if (originalData) {
      const hasFormChanges = Object.keys(formData).some(key => {
        // Skip image comparison as it's handled differently
        if (key === 'image') {
          return formData.image !== null;
        }
        return formData[key] !== originalData[key];
      });
      
      // Also consider image removal as a change
      const hasImageChanges = 
        (imagePreview === null && playerDetails?.image) || // Image was removed
        formData.image !== null; // New image was selected
      
      setHasChanges(hasFormChanges || hasImageChanges);
    }
  }, [formData, originalData, imagePreview, playerDetails]);
  
  // Track if tabs have errors
  const [tabErrors, setTabErrors] = useState({
    persian: false,
    english: false
  });
  
  // Update tab error indicators when errors change
  useEffect(() => {
    const newTabErrors = {
      persian: errors.name_fa ? true : false,
      english: errors.name_en ? true : false
    };
    
    setTabErrors(newTabErrors);
  }, [errors]);
  
  // Clear tab error when switching to that tab
  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    
    // Clear the tab error indicator when switching to that tab
    if (tabErrors[tabId]) {
      setTabErrors(prev => ({
        ...prev,
        [tabId]: false
      }));
    }
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
    }
    
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  // Handle triggering file input click
  const handleChangeImageClick = () => {
    fileInputRef.current.click();
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
      }
      
      setFormData(prev => ({
        ...prev,
        image: file
      }));
    }
  };
  
  // Handle image removal
  const handleRemoveImage = () => {
    // Clear the image preview
    setImagePreview(null);
    
    // Set the image field to null in form data
    setFormData(prev => ({
      ...prev,
      image: null
    }));
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Second level validation: Only validate the number field when submitting
    const numberError = validatePlayerNumber(formData.number);
    if (numberError) {
      setErrors({ number: numberError });
      return;
    }
    
    setIsLoading(true);
    
    const formDataToSend = new FormData();
    // Only send fields that have changed
    Object.entries(formData).forEach(([key, value]) => {
      if (key === 'image') {
        if (value !== null) {
          formDataToSend.append(key, value);
        } else if (originalData.image !== null && imagePreview === null) {
          // Explicitly set image to null when removed
          formDataToSend.append('remove_image', 'true');
        }
      } else if (originalData[key] !== value) {
        formDataToSend.append(key, value);
      }
    });

    try {
      // Send request to API for updating the player
      const response = await sendRequest(`http://localhost:8000/api/admin/player-update/${playerId}/`, 'PATCH', formDataToSend);
      
      if (response.isError) {
        // Handle validation errors from backend
        setErrors(response.errorContent || {});
        errorNotif('خطا در بروزرسانی بازیکن');
      } else {
        // Show success notification and redirect
        successNotif('اطلاعات بازیکن با موفقیت بروزرسانی شد');
        fetchPlayers();
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

  // Show loading state while fetching player data
  if (playerDetailsLoading) {
    return (
      <div className="min-h-screen bg-quinary-tint-600 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Show error state if player data fetch failed
  if (playerDetailsError) {
    return (
      <div className="min-h-screen bg-quinary-tint-600 flex items-center justify-center">
        <div className="bg-quaternary text-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-bold mb-2">خطا در دریافت اطلاعات بازیکن</h2>
          <p>لطفا مجدد تلاش کنید یا با پشتیبانی تماس بگیرید.</p>
          <button 
            onClick={handleBack}
            className="mt-4 px-4 py-2 bg-primary text-white rounded-lg"
          >
            بازگشت
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-quinary-tint-600">
      <style>{flashingDotCSS}</style>
      <div className="max-w-[1200px] mx-auto px-4">
        {/* Back Link */}
        <div className="flex mb-6 justify-end">
          <button
            onClick={handleBack}
            className="text-primary text-lg flex items-center hover:underline focus:outline-none"
          >
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

            {/* Player Image */}
            <div className="space-y-4">
              <label className="block text-[16px] text-secondary mb-2 text-right">
                تصویر بازیکن
              </label>
              
              {/* Hidden file input */}
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
              
              <div className="flex flex-col items-center space-y-4">
                {/* Image Preview */}
                {imagePreview ? (
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-64 h-64 rounded-lg overflow-hidden">
                      <LazyImage 
                        src={imagePreview} 
                        alt="Player preview" 
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </div>
                    
                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={handleChangeImageClick}
                        className="px-4 py-2 bg-primary text-quinary-tint-800 rounded-lg hover:bg-primary-tint-100 transition-colors duration-300 flex items-center gap-2 text-[14px] font-medium"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                        </svg>
                        تغییر تصویر
                      </button>
                      
                      <button
                        type="button"
                        onClick={handleRemoveImage}
                        className="px-4 py-2 bg-quaternary text-quinary-tint-800 rounded-lg hover:bg-quaternary-tint-100 transition-colors duration-300 flex items-center gap-2 text-[14px] font-medium"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        حذف تصویر
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={handleChangeImageClick}
                    className="px-4 py-2 bg-primary text-quinary-tint-800 rounded-lg hover:bg-primary-tint-100 transition-colors duration-300 flex items-center gap-2 text-[14px] font-medium"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4V5h12v10z" clipRule="evenodd" />
                      <path d="M4 12l4-4 2 2 4-4 2 2v4H4z" />
                    </svg>
                    انتخاب تصویر
                  </button>
                )}
                
                {errors.image && (
                  <p className="text-quaternary text-[14px] mt-1">{errors.image}</p>
                )}
              </div>
            </div>

            {/* Form Action (Submit Button Only) */}
            <div className="flex justify-center flex-col items-center pt-6">
              <button
                type="submit"
                disabled={submitLoading || !hasChanges}
                className={`px-8 py-3 rounded-lg text-[16px] font-semibold transition-colors duration-300 flex items-center justify-center min-w-[200px]
                  ${hasChanges 
                    ? 'bg-primary text-quinary-tint-800 hover:bg-primary-tint-200' 
                    : 'bg-gray-400 text-gray-700 cursor-not-allowed opacity-70'
                  }`}
              >
                {submitLoading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-quinary-tint-800"></div>
                ) : (
                  'تغییر اطلاعات بازیکن'
                )}
              </button>
              {!hasChanges && (
                <div className="text-quaternary text-[14px] mt-1 text-right">
                  <p>لطفا حداقل یکی از فیلدها را تغییر دهید</p>
                </div>
              )}
            </div>
          </motion.form>
        </div>
      </div>
    </div>
  );
};

export default PlayerEditForm; 