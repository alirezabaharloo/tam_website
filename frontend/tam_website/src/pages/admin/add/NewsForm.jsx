import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import useAdminHttp from '../../../hooks/useAdminHttp';
import { successNotif, errorNotif } from '../../../utils/customNotifs';
import SpinLoader from '../../../pages/UI/SpinLoader';
import SomethingWentWrong from '../../../pages/UI/SomethingWentWrong';
import { validateArticleForm, isFormValid } from '../../../validators/ArticleValidators';
import QuillEditor from '../../../components/admin/Editor/QuillEditor';
import FormHeader from '../../../components/UI/FormHeader';
import ImagePicker from '../../../components/UI/ImagePicker';
import FormActions from '../../../components/UI/FormActions';

const NewsForm = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('persian');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [mainImagePreview, setMainImagePreview] = useState(null);
  const [slideshowImages, setSlideshowImages] = useState([]);
  
  const [tabErrors, setTabErrors] = useState({
    persian: false, 
    english: false
  });
  
  const [formData, setFormData] = useState({
    title_fa: '',
    title_en: '',
    body_fa: '',
    body_en: '',
    team: '',
    status: 'DR',
    type: 'TX',
    video_url: '',
    main_image: null,
    slideshow_images: []
  });
  
  const {
    data: filterData,
    isLoading: filterLoading,
    isError: filterError
  } = useAdminHttp('http://localhost:8000/api/admin/article-filter-data/');
  
  const {
    isLoading: submitLoading,
    sendRequest
  } = useAdminHttp();
  
  const [formIsComplete, setFormIsComplete] = useState(false);
  
  useEffect(() => {
    setFormIsComplete(isFormValid(formData));
  }, [formData]);
  
  useEffect(() => {
    const newTabErrors = {
      persian: errors.title_fa || errors.body_fa ? true : false,
      english: errors.title_en || errors.body_en ? true : false
    };
    setTabErrors(newTabErrors);
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
  
  const handleMainImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setMainImagePreview(previewUrl);
      if (errors.main_image) {
        setErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors.main_image;
          return newErrors;
        });
      }
      setFormData(prev => ({ ...prev, main_image: file }));
    }
  };
  
  const handleSlideshowImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      const newImage = { file, preview: previewUrl };
      setSlideshowImages(prev => [...prev, newImage]);
      if (errors.slideshow_images) {
        setErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors.slideshow_images;
          return newErrors;
        });
      }
      setFormData(prev => ({ ...prev, slideshow_images: [...prev.slideshow_images, file] }));
    }
  };

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateArticleForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      if ((validationErrors.title_fa || validationErrors.body_fa) && activeTab !== 'persian') {
        setActiveTab('persian');
      } else if ((validationErrors.title_en || validationErrors.body_en) && activeTab !== 'english') {
        setActiveTab('english');
      }
      return;
    }
    
    setIsLoading(true);
    const formDataToSend = new FormData();
    
    Object.entries(formData).forEach(([key, value]) => {
      if (key !== 'main_image' && key !== 'slideshow_images') {
        formDataToSend.append(key, value);
      }
    });
    
    if (formData.main_image) {
      formDataToSend.append('main_image', formData.main_image);
    }
    
    formData.slideshow_images.forEach((image, index) => {
      formDataToSend.append(`slideshow_image_${index}`, image);
    });
    
    formDataToSend.append('slideshow_image_count', formData.slideshow_images.length);

    try {
      const response = await sendRequest('http://localhost:8000/api/admin/article-create/', 'POST', formDataToSend);
      if (response?.isError) {
        setErrors(response?.errorContent || {});
        errorNotif('خطا در ایجاد مقاله');
      } else {
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
  
  const handleBack = () => {
    window.history.back();
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
        <FormHeader
          title="افزودن مقاله جدید"
          subtitle="در این صفحه می توانید مقاله جدیدی ایجاد کنید"
          onBack={handleBack}
        />
        <div className="bg-quinary-tint-800 rounded-2xl shadow-[0_0_16px_rgba(0,0,0,0.25)] p-6">
          <motion.form
            onSubmit={handleSubmit}
            className="space-y-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="space-y-6">
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
              <div className="space-y-6">
                {activeTab === 'persian' && (
                  <div className="space-y-6">
                    <div>
                      <label className="block text-[16px] text-secondary mb-2 text-right">
                        عنوان مقاله (فارسی) *
                      </label>
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
                      {errors.title_fa && (
                          <p className="text-quaternary text-[14px] mt-1 text-right">{errors.title_fa}</p>
                      )}
                    </div>
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
                    <div>
                      <label className="block text-[16px] text-secondary mb-2 text-left">
                        Article Title (English) *
                      </label>
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
                      {errors.title_en && (
                          <p className="text-quaternary text-[14px] mt-1 text-left">{errors.title_en}</p>
                      )}
                    </div>
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-[16px] text-secondary mb-2 text-right">
                  تیم *
                </label>
                <select
                    value={formData.team}
                    onChange={(e) => handleInputChange('team', e.target.value)}
                    className={`w-full px-4 py-3 bg-quinary-tint-600 text-primary rounded-lg border-2 ${
                    errors.team ? 'border-quaternary' : 'border-quinary-tint-500'
                    } focus:border-primary outline-none transition-colors duration-300`}
                >
                    <option value="">انتخاب تیم</option>
                    {filterData && filterData.teams && Object.entries(filterData.teams).map(([id, name]) => {
                    if (id !== '') {
                        return (
                        <option key={id} value={id}>
                            {name}
                        </option>
                        );
                    }
                    return null;
                    })}
                </select>
                {errors.team && (
                <p className="text-quaternary text-[14px] mt-1 text-right">{errors.team}</p>
                )}
              </div>
              <div>
                <label className="block text-[16px] text-secondary mb-2 text-right">
                  نوع مقاله *
                </label>
                <select
                    value={formData.type}
                    onChange={(e) => handleInputChange('type', e.target.value)}
                    className={`w-full px-4 py-3 bg-quinary-tint-600 text-primary rounded-lg border-2 ${
                    errors.type ? 'border-quaternary' : 'border-quinary-tint-500'
                    } focus:border-primary outline-none transition-colors duration-300`}
                >
                    {filterData && filterData.type && Object.entries(filterData.type).map(([id, name]) => {
                    if (id !== '') {
                        return (
                        <option key={id} value={id}>
                            {name}
                        </option>
                        );
                    }
                    return null;
                    })}
                </select>
                {formData.type === 'SS' && (
                <p className="text-yellow-500 text-[14px] text-right mt-1">
                    حتما حداقل دو عکس برای ایجاد مقاله اسلاید شو انتخاب کنید.
                </p>
                )}
                {errors.type && (
                <p className="text-quaternary text-[14px] text-right mt-1">{errors.type}</p>
                )}
              </div>
              <div>
                <label className="block text-[16px] text-secondary mb-2 text-right">
                  وضعیت مقاله *
                </label>
                <select
                    value={formData.status}
                    onChange={(e) => handleInputChange('status', e.target.value)}
                    className={`w-full px-4 py-3 bg-quinary-tint-600 text-primary rounded-lg border-2 ${
                    errors.status ? 'border-quaternary' : 'border-quinary-tint-500'
                    } focus:border-primary outline-none transition-colors duration-300`}
                >
                    {filterData && filterData.status && Object.entries(filterData.status).map(([id, name]) => {
                    if (id !== '') {
                        return (
                        <option key={id} value={id}>
                            {name}
                        </option>
                        );
                    }
                    return null;
                    })}
                </select>
                {errors.status && (
                <p className="text-quaternary text-[14px] mt-1 text-right">{errors.status}</p>
                )}
              </div>
              {formData.type === 'VD' && (
                <div>
                  <label className="block text-[16px] text-secondary mb-2 text-right">
                      آدرس ویدیو *
                  </label>
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
                  {errors.video_url && (
                      <p className="text-quaternary text-[14px] mt-1 text-right">{errors.video_url}</p>
                  )}
                </div>
              )}
            </div>
            <ImagePicker
              imagePreview={mainImagePreview}
              onImageChange={handleMainImageChange}
              error={errors.main_image}
              label="تصویر اصلی مقاله"
            />
            {formData.type === 'SS' && (
            <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
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
                            onClick={() => window.open(image.preview, '_blank')}
                        >
                        </button>
                        <button
                            type="button"
                            className="p-2 bg-white bg-opacity-20 rounded-full hover:bg-opacity-50 transition-all duration-300"
                            onClick={() => handleRemoveSlideshowImage(index)}
                        >
                        </button>
                        </div>
                    </div>
                    </div>
                ))}
                <div 
                    className="h-[150px] rounded-lg border-2 border-dashed border-quinary-tint-500 relative overflow-hidden cursor-pointer hover:border-primary transition-colors duration-300 flex items-center justify-center"
                    onClick={() => document.getElementById('slideshow-image-input').click()}
                >
                    <div className="flex flex-col items-center justify-center">
                    <span className="text-secondary text-sm">افزودن تصویر</span>
                    </div>
                    <input
                      type="file"
                      id="slideshow-image-input"
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
            <FormActions
              onCancel={handleBack}
              onSubmit={handleSubmit}
              isSubmitting={submitLoading}
              isSubmitDisabled={!formIsComplete}
              submitText="ایجاد مقاله"
            />
          </motion.form>
        </div>
      </div>
    </div>
  );
};

export default NewsForm; 