import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import useAdminHttp from '../../../hooks/useAdminHttp';
import { successNotif, errorNotif } from '../../../utils/customNotifs';
import { ArticleFormIcons } from '../../../data/Icons';
import SpinLoader from '../../../components/UI/SpinLoader';
import SomethingWentWrong from '../../../components/UI/SomethingWentWrong';
import { validateArticleForm, isFormValid } from '../../../validators/ArticleValidators';
import QuillEditor from '../../../components/UI/QuillEditor'; // Import the new editor

const Icons = ArticleFormIcons;

const NewsForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('persian');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [mainImagePreview, setMainImagePreview] = useState(null); // Main image preview URL
  const [slideshowImages, setSlideshowImages] = useState([]); // Array of slideshow image objects
  const mainImageInputRef = useRef(null);
  const slideshowImageInputRef = useRef(null);
  
  // Track if tabs have errors
  const [tabErrors, setTabErrors] = useState({
    persian: false, 
    english: false
  });
  
  // Initialize form data
  const [formData, setFormData] = useState({
    title_fa: '',
    title_en: '',
    body_fa: '',
    body_en: '',
    team: '',
    status: 'DR', // Draft by default
    type: 'TX', // Text by default
    video_url: '',
    main_image: null,
    slideshow_images: []
  });
  
  // Fetch filter data for dropdown options
  const {
    data: filterData,
    isLoading: filterLoading,
    isError: filterError
  } = useAdminHttp('http://localhost:8000/api/admin/article-filter-data/');
  
  // Initialize HTTP hook for form submission
  const {
    isLoading: submitLoading,
    isError: submitError,
    errorContent: submitErrorContent,
    sendRequest
  } = useAdminHttp();
  
  // First level validation: Check if all fields have values
  const [formIsComplete, setFormIsComplete] = useState(false);
  
  // Check if form is complete
  useEffect(() => {
    setFormIsComplete(isFormValid(formData));
  }, [formData]);
  
  // Update tab error indicators when errors change
  useEffect(() => {
    const newTabErrors = {
      persian: errors.title_fa || errors.body_fa ? true : false,
      english: errors.title_en || errors.body_en ? true : false
    };
    
    setTabErrors(newTabErrors);
  }, [errors]);
  
  // Handle tab switching without clearing error indicators
  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
  };
  
  // Handle form input changes, including QuillEditor
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
  
  // Handle main image file selection
  const handleMainImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Create preview URL for the selected image
      const previewUrl = URL.createObjectURL(file);
      setMainImagePreview(previewUrl);
      
      // Clear image error if exists
      if (errors.main_image) {
        setErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors.main_image;
          return newErrors;
        });
      }
      
      setFormData(prev => ({
        ...prev,
        main_image: file
      }));
    }
  };
  
  // Handle slideshow image file selection
  const handleSlideshowImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      const newImage = { file, preview: previewUrl };
      
      // Add new image to the slideshow images array
      setSlideshowImages(prev => [...prev, newImage]);
      
      // Clear slideshow images error if exists
      if (errors.slideshow_images) {
        setErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors.slideshow_images;
          return newErrors;
        });
      }
      
      // Update form data with the new slideshow image
      setFormData(prev => ({
        ...prev,
        slideshow_images: [...prev.slideshow_images, file]
      }));
    }
  };
  
  // Handle viewing image in full size
  const handleViewImage = (imageUrl) => {
    window.open(imageUrl, '_blank');
  };
  
  // Handle changing main image
  const handleChangeMainImage = () => {
    if (mainImageInputRef.current) {
      mainImageInputRef.current.click();
    }
  };
  
  // Handle removing a slideshow image
  const handleRemoveSlideshowImage = (index) => {
    setSlideshowImages(prev => {
      const newImages = [...prev];
      newImages.splice(index, 1);
      return newImages;
    });
    
    setFormData(prev => {
      const newSlideshowImages = [...prev.slideshow_images];
      newSlideshowImages.splice(index, 1);
      return {
        ...prev,
        slideshow_images: newSlideshowImages
      };
    });
  };
  
  // Handle changing a slideshow image
  const handleChangeSlideshowImage = (index) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        const previewUrl = URL.createObjectURL(file);
        
        setSlideshowImages(prev => {
          const newImages = [...prev];
          newImages[index] = { file, preview: previewUrl };
          return newImages;
        });
        
        setFormData(prev => {
          const newSlideshowImages = [...prev.slideshow_images];
          newSlideshowImages[index] = file;
          return {
            ...prev,
            slideshow_images: newSlideshowImages
          };
        });
      }
    };
    input.click();
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form using the validator
    const validationErrors = validateArticleForm(formData);
    
    // If there are validation errors, display them and stop submission
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      
      // Switch to the appropriate tab if there's an error in a tab that's not active
      if ((validationErrors.title_fa || validationErrors.body_fa) && activeTab !== 'persian') {
        setActiveTab('persian');
      } else if ((validationErrors.title_en || validationErrors.body_en) && activeTab !== 'english') {
        setActiveTab('english');
      }
      
      return;
    }
    
    setIsLoading(true);
    
    const formDataToSend = new FormData();
    
    // Add text fields to FormData
    Object.entries(formData).forEach(([key, value]) => {
      if (key !== 'main_image' && key !== 'slideshow_images') {
        formDataToSend.append(key, value);
      }
    });
    
    // Add main image to FormData
    if (formData.main_image) {
      formDataToSend.append('main_image', formData.main_image);
    }
    
    // Add slideshow images to FormData in order
    formData.slideshow_images.forEach((image, index) => {
      formDataToSend.append(`slideshow_image_${index}`, image);
    });
    
    // Add the total count of slideshow images
    formDataToSend.append('slideshow_image_count', formData.slideshow_images.length);

    try {
      // Send request to API
      const response = await sendRequest('http://localhost:8000/api/admin/article-create/', 'POST', formDataToSend);
      
      if (response?.isError) {
        // Handle validation errors from backend
        setErrors(response?.errorContent || {});
        errorNotif('خطا در ایجاد مقاله');
      } else {
        // Show success notification and redirect
        successNotif('مقاله جدید اضافه شد');
        setTimeout(() => {
          navigate('/admin/articles', { 
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

  if (filterLoading) {
    return <SpinLoader />;
  }

  if (filterError) {
    return <SomethingWentWrong />;
  }

  return (
    <div className="min-h-screen bg-quinary-tint-600">
      <style>{flashingDotCSS}</style>
      <div className="max-w-[1200px] mx-auto px-4 mt-[1rem]">
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
                  افزودن مقاله جدید
                </h1>
                <p className="text-[16px] text-secondary">
                  در این صفحه می توانید مقاله جدیدی ایجاد کنید
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
            
            {/* Title and Body Tabs */}
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
              </div>

              {/* Tab Content */}
              <div className="space-y-6">
                {activeTab === 'persian' && (
                  <div className="space-y-6">
                    {/* Persian Title */}
                    <div>
                      <label className="block text-[16px] text-secondary mb-2 text-right">
                        عنوان مقاله (فارسی) *
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Icons.Title className="text-secondary" />
                        </div>
                        <input
                          type="text"
                          value={formData.title_fa}
                          onChange={(e) => handleInputChange('title_fa', e.target.value)}
                          className={`w-full pl-10 pr-4 py-3 bg-quinary-tint-600 text-primary rounded-lg border-2 ${
                            errors.title_fa ? 'border-quaternary' : 'border-quinary-tint-500'
                          } focus:border-primary outline-none transition-colors duration-300`}
                          placeholder="عنوان مقاله"
                          dir="rtl"
                        />
                      </div>
                      {errors.title_fa && (
                        <p className="text-quaternary text-[14px] mt-1 text-right">{errors.title_fa}</p>
                      )}
                    </div>

                    {/* Persian Body */}
                    <div>
                      <label className="block text-[16px] text-secondary mb-2 text-right">
                        متن مقاله (فارسی) *
                      </label>
                      <div className={`rounded-lg border-2 ${errors.body_fa ? 'border-quaternary' : 'border-transparent'}`}>
                        <QuillEditor
                          value={formData.body_fa}
                          onChange={(data) => handleInputChange('body_fa', data)}
                          placeholder="متن مقاله خود را اینجا وارد کنید..."
                          isRTL={true}
                        />
                      </div>
                      {errors.body_fa && (
                        <p className="text-quaternary text-[14px] mt-1 text-right">{errors.body_fa}</p>
                      )}
                    </div>
                  </div>
                )}

                {activeTab === 'english' && (
                  <div className="space-y-6">
                    {/* English Title */}
                    <div>
                      <label className="block text-[16px] text-secondary mb-2 text-left">
                        Article Title (English) *
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                          <Icons.Title className="text-secondary" />
                        </div>
                        <input
                          type="text"
                          value={formData.title_en}
                          onChange={(e) => handleInputChange('title_en', e.target.value)}
                          className={`w-full pr-10 pl-4 py-3 bg-quinary-tint-600 text-primary rounded-lg border-2 ${
                            errors.title_en ? 'border-quaternary' : 'border-quinary-tint-500'
                          } focus:border-primary outline-none transition-colors duration-300`}
                          placeholder="Article title"
                          dir="ltr"
                        />
                      </div>
                      {errors.title_en && (
                        <p className="text-quaternary text-[14px] mt-1 text-left">{errors.title_en}</p>
                      )}
                    </div>

                    {/* English Body */}
                    <div>
                      <label className="block text-[16px] text-secondary mb-2 text-left">
                        Article Body (English) *
                      </label>
                      <div className={`rounded-lg border-2 ${errors.body_en ? 'border-quaternary' : 'border-transparent'}`}>
                        <QuillEditor
                          value={formData.body_en}
                          onChange={(data) => handleInputChange('body_en', data)}
                          placeholder="Enter your article body here..."
                          isRTL={false}
                        />
                      </div>
                      {errors.body_en && (
                        <p className="text-quaternary text-[14px] mt-1 text-left">{errors.body_en}</p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Article Settings */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Team */}
              <div>
                <label className="block text-[16px] text-secondary mb-2 text-right">
                  تیم *
                </label>
                <div className="relative">
                  <select
                    value={formData.team}
                    onChange={(e) => handleInputChange('team', e.target.value)}
                    className={`w-full px-4 py-3 bg-quinary-tint-600 text-primary rounded-lg border-2 ${
                      errors.team ? 'border-quaternary' : 'border-quinary-tint-500'
                    } focus:border-primary outline-none transition-colors duration-300`}
                  >
                    <option value="">انتخاب تیم</option>
                    {filterData && filterData.teams && Object.entries(filterData.teams).map(([id, name]) => {
                      if (id !== '') { // Skip the "All teams" option
                        return (
                          <option key={id} value={id}>
                            {name}
                          </option>
                        );
                      }
                      return null;
                    })}
                  </select>
                </div>
                {errors.team && (
                  <p className="text-quaternary text-[14px] mt-1 text-right">{errors.team}</p>
                )}
              </div>

              {/* Type */}
              <div>
                <label className="block text-[16px] text-secondary mb-2 text-right">
                  نوع مقاله *
                </label>
                <div className="relative">
                  <select
                    value={formData.type}
                    onChange={(e) => handleInputChange('type', e.target.value)}
                    className={`w-full px-4 py-3 bg-quinary-tint-600 text-primary rounded-lg border-2 ${
                      errors.type ? 'border-quaternary' : 'border-quinary-tint-500'
                    } focus:border-primary outline-none transition-colors duration-300`}
                  >
                    {filterData && filterData.type && Object.entries(filterData.type).map(([id, name]) => {
                      if (id !== '') { // Skip the "All types" option
                        return (
                          <option key={id} value={id}>
                            {name}
                          </option>
                        );
                      }
                      return null;
                    })}
                  </select>
                </div>
                <div className='relative'>
                {errors.type && (
                  <p className="text-quaternary text-[14px] text-right mt-1 absolute">{errors.type}</p>
                )}
                {formData.type === 'SS' && (
                  <p className="text-yellow-500 text-[14px] text-right mt-1 absolute">
                    حتما حداقل دو عکس برای ایجاد مقاله اسلاید شو انتخاب کنید.
                  </p>
                )}
                </div>
              </div>

              {/* Status */}
              <div>
                <label className="block text-[16px] text-secondary mb-2 text-right">
                  وضعیت مقاله *
                </label>
                <div className="relative">
                  <select
                    value={formData.status}
                    onChange={(e) => handleInputChange('status', e.target.value)}
                    className={`w-full px-4 py-3 bg-quinary-tint-600 text-primary rounded-lg border-2 ${
                      errors.status ? 'border-quaternary' : 'border-quinary-tint-500'
                    } focus:border-primary outline-none transition-colors duration-300`}
                  >
                    {filterData && filterData.status && Object.entries(filterData.status).map(([id, name]) => {
                      if (id !== '') { // Skip the "All statuses" option
                        return (
                          <option key={id} value={id}>
                            {name}
                          </option>
                        );
                      }
                      return null;
                    })}
                  </select>
                </div>
                {errors.status && (
                  <p className="text-quaternary text-[14px] mt-1 text-right">{errors.status}</p>
                )}
              </div>

              {/* Video URL (only shown when type is Video) */}
              {formData.type === 'VD' && (
                <div>
                  <label className="block text-[16px] text-secondary mb-2 text-right">
                    آدرس ویدیو *
                  </label>
                  <div className="relative">
                    <input
                      type="url"
                      value={formData.video_url}
                      onChange={(e) => handleInputChange('video_url', e.target.value)}
                      className={`w-full px-4 py-3 bg-quinary-tint-600 text-primary rounded-lg border-2 ${
                        errors.video_url ? 'border-quaternary' : 'border-quinary-tint-500'
                      } focus:border-primary outline-none transition-colors duration-300`}
                      placeholder="https://..."
                      dir="ltr"
                    />
                  </div>
                  {errors.video_url && (
                    <p className="text-quaternary text-[14px] mt-1 text-right">{errors.video_url}</p>
                  )}
                </div>
              )}
            </div>

              {/* Image Upload Section - Above the tabs */}
            <div className="space-y-6">
              <label className="block mb-2 text-right">
                تصویر اصلی مقاله *
              </label>
              <div 
                className={`w-full h-[25rem] rounded-lg border-2 ${
                  errors.main_image ? 'border-quaternary' : 'border-quinary-tint-500'
                } relative overflow-hidden cursor-pointer group`}
                onClick={handleChangeMainImage}
              >
                {mainImagePreview ? (
                  <>
                    <img 
                      src={mainImagePreview} 
                      alt="Article main image" 
                      className="w-full h-full object-cover transition-all duration-300 group-hover:blur-sm group-hover:brightness-50"
                    />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="flex gap-4">
                        <button
                          type="button"
                          className="p-3 bg-white bg-opacity-20 rounded-full hover:bg-opacity-50 transition-all duration-300"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleViewImage(mainImagePreview);
                          }}
                        >
                          <Icons.View className="text-white text-xl" />
                        </button>
                        <button
                          type="button"
                          className="p-3 bg-white bg-opacity-20 rounded-full hover:bg-opacity-50 transition-all duration-300"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleChangeMainImage();
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
                  ref={mainImageInputRef}
                  onChange={handleMainImageChange}
                  className="hidden"
                  accept="image/*"
                />
              </div>
              {errors.main_image && (
                <p className="text-quaternary text-[14px] mt-1 text-right">{errors.main_image}</p>
              )}
            </div>
              {/* Slideshow Images Section (only shown when type is Slideshow) */}
            {formData.type === 'SS' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                  {/* Existing slideshow images */}
                  {slideshowImages.map((image, index) => (
                    <div 
                      key={index}
                      className="h-[150px] rounded-lg border-2 border-quinary-tint-500 relative overflow-hidden group"
                    >
                      <img 
                        src={image.preview} 
                        alt={`Slideshow image ${index + 1}`} 
                        className="w-full h-full object-cover transition-all duration-300 group-hover:blur-sm group-hover:brightness-50"
                      />
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="flex gap-4">
                          <button
                            type="button"
                            className="p-2 bg-white bg-opacity-20 rounded-full hover:bg-opacity-50 transition-all duration-300"
                            onClick={() => handleViewImage(image.preview)}
                          >
                            <Icons.View className="text-white" />
                          </button>
                          <button
                            type="button"
                            className="p-2 bg-white bg-opacity-20 rounded-full hover:bg-opacity-50 transition-all duration-300"
                            onClick={() => handleChangeSlideshowImage(index)}
                          >
                            <Icons.Edit className="text-white" />
                          </button>
                          <button
                            type="button"
                            className="p-2 bg-white bg-opacity-20 rounded-full hover:bg-opacity-50 transition-all duration-300"
                            onClick={() => handleRemoveSlideshowImage(index)}
                          >
                            <Icons.Delete className="text-white" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {/* Add new slideshow image box */}
                  <div 
                    className="h-[150px] rounded-lg border-2 border-dashed border-quinary-tint-500 relative overflow-hidden cursor-pointer hover:border-primary transition-colors duration-300 flex items-center justify-center"
                    onClick={() => slideshowImageInputRef.current.click()}
                  >
                    <div className="flex flex-col items-center justify-center">
                      <Icons.Add className="text-secondary text-2xl mb-2" />
                      <span className="text-secondary text-sm">افزودن تصویر</span>
                    </div>
                    <input
                      type="file"
                      ref={slideshowImageInputRef}
                      onChange={handleSlideshowImageChange}
                      className="hidden"
                      accept="image/*"
                    />
                  </div>
                </div>
                {errors.slideshow_images && (
                  <p className="text-quaternary text-[14px] mt-1 text-right">{errors.slideshow_images}</p>
                )}
              </div>
            )}
            

            {/* Form Actions */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              <button
                type="submit"
                disabled={isLoading || !formIsComplete}
                className="flex-1 px-6 py-3 bg-primary text-quinary-tint-800 text-[16px] font-semibold rounded-lg hover:bg-primary-tint-200 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isLoading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-quinary-tint-800"></div>
                ) : (
                  'ایجاد مقاله'
                )}
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

export default NewsForm; 