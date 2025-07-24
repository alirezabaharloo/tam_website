import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import useAdminHttp from '../../../hooks/useAdminHttp';
import { successNotif, errorNotif } from '../../../utils/customNotifs';
import SpinLoader from '../../../pages/UI/SpinLoader';
import SomethingWentWrong from '../../../pages/UI/SomethingWentWrong';
import ArticleNotFound from '../../../pages/UI/ArticleNotFound';
import { validateArticleForm } from '../../../validators/ArticleValidators';
import QuillEditor from '../../../components/admin/Editor/QuillEditor';
import FormHeader from '../../../components/UI/FormHeader';
import ImagePicker from '../../../components/UI/ImagePicker';
import FormActions from '../../../components/UI/FormActions';
import SlideshowImages from '../../../components/admin/SlideshowImages';
import ImportTranslationModal from '../../../components/admin/Modal/ImportTranslationModal';
import SchedulePublishModal from '../../../components/admin/Modal/SchedulePublishModal';
import { ArticleFormIcons } from '../../../data/Icons';
import { formatJalaliDateTime } from '../../../utils/dateUtils';

const EditNewsForm = () => {
  const navigate = useNavigate();
  const { articleId } = useParams();
  const [activeTab, setActiveTab] = useState('persian');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [mainImagePreview, setMainImagePreview] = useState(null);
  const [slideshowImages, setSlideshowImages] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [scheduledPublishDate, setScheduledPublishDate] = useState(null);
  const [originalData, setOriginalData] = useState(null);
  const [hasChanges, setHasChanges] = useState(false);
  const [deletedImageIds, setDeletedImageIds] = useState([]); // New state to track deleted image IDs
  
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
    slideshow_images: [],
    scheduled_publish_at: null
  });
  
  const {
    data: articleDetails,
    isLoading: articleDetailsLoading,
    isError: articleDetailsError,
    sendRequest: fetchArticleDetails
  } = useAdminHttp(`http://localhost:8000/api/admin/article-detail/${articleId}/`);
  
  const {
    data: filterData,
    isLoading: filterLoading,
    isError: filterError
  } = useAdminHttp('http://localhost:8000/api/admin/article-filter-data/');
  
  const {
    isLoading: submitLoading,
    sendRequest
  } = useAdminHttp();
  
  // Cargar detalles del artículo cuando el componente se monta
  useEffect(() => {
    console.log("Fetching article details for ID:", articleId);
    fetchArticleDetails()
      .then(response => {
        if (response?.isError) {
          console.error("Error fetching article details:", response.errorContent);
          errorNotif('خطا در دریافت اطلاعات مقاله');
        }
      })
      .catch(error => {
        console.error("Exception fetching article details:", error);
        errorNotif('خطا در ارتباط با سرور');
      });
  }, [articleId]);
  
  // Initialize formData with the data from articleDetails
  useEffect(() => {
    if (articleDetails) {
      console.log("Article details received:", articleDetails);
      
      // Make sure team_id is properly set
      let teamId = '';
      if (articleDetails.team_id) {
        teamId = articleDetails.team_id.toString();
      } else if (articleDetails.team && typeof articleDetails.team === 'object' && articleDetails.team.id) {
        teamId = articleDetails.team.id.toString();
      }
      
      const initialFormData = {
        title_fa: articleDetails.title_fa || '',
        title_en: articleDetails.title_en || '',
        body_fa: articleDetails.body_fa || '',
        body_en: articleDetails.body_en || '',
        team: teamId,
        status: articleDetails.status || 'DR',
        type: articleDetails.type || 'TX',
        video_url: articleDetails.video_url || '',
        main_image: null, // This will hold the new main image file if changed
        slideshow_images: [], // This will hold *newly uploaded* slideshow files
        scheduled_publish_at: articleDetails.scheduled_publish_at || null
      };
      
      console.log("Initializing form data:", initialFormData);
      
      setFormData(initialFormData);
      setOriginalData(initialFormData);
      setDeletedImageIds([]); // Reset deleted IDs on new article load
      
      // Configurar imagen principal
      if (articleDetails.main_image) {
        setMainImagePreview(articleDetails.main_image);
      }
      
      // Configurar imágenes de slideshow (now including IDs)
      if (articleDetails.slideshow_images && articleDetails.slideshow_images.length > 0) {
        const images = articleDetails.slideshow_images.map(img => ({
          id: img.id, // Now we have the ID from backend
          preview: img.url,
          file: null, // No new file initially for existing images
          isNew: false // Flag to differentiate new uploads
        }));
        setSlideshowImages(images);
      } else {
        setSlideshowImages([]); // Ensure it's an empty array if no images
      }
      
      // Configurar fecha de publicación programada
      if (articleDetails.scheduled_publish_at) {
        setScheduledPublishDate(new Date(articleDetails.scheduled_publish_at));
      }
    }
  }, [articleDetails]);
  
  // Detectar cambios en el formulario
  useEffect(() => {
    if (originalData) {
      const formFieldsChanged = Object.keys(formData).some(key => {
        if (key === 'main_image' || key === 'slideshow_images') {
          // Handle file changes separately, check if actual files are present
          return formData[key] !== null && (Array.isArray(formData[key]) ? formData[key].length > 0 : true);
        }
        return formData[key] !== originalData[key];
      });
      
      const mainImageChanged = formData.main_image !== null;
      const newSlideshowFilesExist = slideshowImages.some(img => img.file && img.isNew);
      const existingSlideshowImagesRemoved = deletedImageIds.length > 0;
      
      setHasChanges(formFieldsChanged || mainImageChanged || newSlideshowFilesExist || existingSlideshowImagesRemoved);
    }
  }, [formData, originalData, mainImagePreview, slideshowImages, deletedImageIds]);
  
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
    if (!mainImagePreview) {
      errorNotif('ابتدا باید تصویر اصلی مقاله را انتخاب کنید.');
      return;
    }
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
    const imageToRemove = slideshowImages[index];
    if (imageToRemove.id) { // If it's an existing image with an ID
      setDeletedImageIds(prev => [...prev, imageToRemove.id]);
    }
    setSlideshowImages(prev => prev.filter((_, i) => i !== index));
    // No direct update to formData.slideshow_images here, as it only holds new files now.
  };

  const handleChangeSlideshowImage = (index) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        const previewUrl = URL.createObjectURL(file);
        const oldImage = slideshowImages[index];
        if (oldImage.id) { // If replacing an existing image
          setDeletedImageIds(prev => [...prev, oldImage.id]);
        }
        setSlideshowImages(prev => {
          const newImages = [...prev];
          newImages[index] = { id: null, preview: previewUrl, file: file, isNew: true }; // Mark as new
          return newImages;
        });
        // Add the new file to formData.slideshow_images (which only tracks new files)
        setFormData(prev => ({ ...prev, slideshow_images: [...prev.slideshow_images.filter(f => f !== oldImage.file), file] }));
      }
    };
    input.click();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateArticleForm({
      ...formData,
      main_image: formData.main_image || mainImagePreview, // Use new file or current preview URL for validation
      slideshow_images: slideshowImages.filter(img => !img.file).map(img => img.preview).concat(formData.slideshow_images) // All current slideshow images for validation
    });
    
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
    
    // Append fields that have changed (excluding images, handled separately)
    Object.entries(formData).forEach(([key, value]) => {
      if (key !== 'main_image' && key !== 'slideshow_images') {
        if (value !== originalData[key]) {
          if (value !== null && value !== undefined) {
            formDataToSend.append(key, value);
          }
        }
      }
    });
    
    // Append main image if changed
    if (formData.main_image) {
      formDataToSend.append('main_image', formData.main_image);
    }
    // Append IDs of images to be deleted
    if (deletedImageIds.length > 0) {
      deletedImageIds.forEach(id => {
        formDataToSend.append('deleted_image_ids', id); // Append each ID separately
      });
    }

    // Append newly uploaded slideshow image files
    const newSlideshowFiles = slideshowImages.filter(img => img.file && img.isNew).map(img => img.file);
    newSlideshowFiles.forEach((file, index) => {
      formDataToSend.append(`slideshow_image_${index}`, file);
    });
    formDataToSend.append('slideshow_image_count', newSlideshowFiles.length);
    console.log(formDataToSend);
    try {
      console.log("Sending update request for article:", articleId);
      console.log("FormData entries:", [...formDataToSend.entries()].map(([key, value]) => `${key}: ${value instanceof File ? value.name : value}`));
      
      const response = await sendRequest(`http://localhost:8000/api/admin/article-update/${articleId}/`, 'PATCH', formDataToSend);
      
      if (response?.isError) {
        console.error("Error response:", response.errorContent);
        setErrors(response?.errorContent || {});
        errorNotif('خطا در ویرایش مقاله');
      } else {
        successNotif('مقاله با موفقیت ویرایش شد');
        fetchArticleDetails(); // Reload article details
        setErrors({});
        setDeletedImageIds([]); // Clear deleted IDs after successful update
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      errorNotif('خطا در ارتباط با سرور');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleBack = () => {
    window.history.back();
  };
  
  const handleCopyPrompt = () => {
    if (!formData.body_fa || formData.body_fa === '<p><br></p>') {
      errorNotif('ابتدا متن مقاله فارسی را وارد کنید.');
      return;
    }

    const prompt = `=== Prompt Purpose ===Translate the provided Persian article content into natural English, ensuring that all HTML formatting is preserved exactly as presented.
=== Output Format ===Return the result in .md (Markdown) format. Maintain all headings, bold text, italics, text alignments, links, and other formatting precisely as in the original HTML. Ensure that the formatting applied to specific text in Persian is identically applied to its English translation equivalent. For example, if a word or phrase in Persian is bold, italicized, or linked, the corresponding translated word or phrase in English must retain the same formatting in the same position.
=== Examples ===Input (Persian with Formatting):
<p style="text-align: justify;">سلام <a href="www.google.com" rel="noopener noreferrer" target="_blank">دنیا</a>، من یه متن ساختگی هستم که شامل فرمت های زیادی هستم به فارسی و باید به زبان انگلیسی دقیقا به همین فرمت ترجمه بشم، برای مثال اگه <a href="www.google.com" rel="noopener noreferrer" target="_blank">اینجا </a>یه لینک باشه باید توی متن انگلیسی همون قسمت لینک بخوره، یا اگه <strong>اینجا </strong>بولد باشه باید همونجا توی متن فارسی بولد بشه، یا اگه کلمه <em>برنامه نویسی</em> ایتالیک باشه باید توی زبان انگلیسی هم همونجا ایتالیک بشه.</p>

Expected Output (English with Formatting):
<p style="text-align: justify;">Hello <a href="www.google.com" rel="noopener noreferrer" target="_blank">world</a>, I am a dummy text that contains many formats in Persian and must be translated into English exactly with the same formatting. For example, if <a href="www.google.com" rel="noopener noreferrer" target="_blank">here</a> is a link, that part should remain linked in the English version as well. Or if <strong>here</strong> is bold, it should be bold in the English version too. Or if the word <em>programming</em> is italicized, it should also be italicized in the English version at the same spot.</p>

=== Persian Article Body (Formatted) ===
Provide only the prompt text as shown above, without any additional content.
the persian text with format is between this >>> <<<:
>>> ${formData.body_fa} <<< 
    `;
    navigator.clipboard.writeText(prompt).then(() => {
      successNotif('پرامپت ترجمه در کلیپ‌برد کپی شد.');
    }).catch(err => {
      errorNotif('خطا در کپی کردن پرامپت.');
      console.error('Could not copy text: ', err);
    });
  };

  const handleImportTranslation = (importedHtml) => {
    handleInputChange('body_en', importedHtml);
    successNotif('متن ترجمه شده با موفقیت وارد شد.');
  };
  
  const handleSchedulePublication = (scheduledDate) => {
    setScheduledPublishDate(scheduledDate);
    setFormData(prev => ({ ...prev, scheduled_publish_at: scheduledDate.toISOString() }));
    // Force re-evaluation of hasChanges
    setHasChanges(true); // Manually set to true to enable "Save Changes" button
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

  if (articleDetailsLoading || filterLoading) {
    return <SpinLoader />;
  }

  if (articleDetails?.errorContent?.detail === "No Article matches the given query.") {
    return <ArticleNotFound />;
  }

  if (articleDetailsError || filterError) {
    return <SomethingWentWrong />;
  }


  return (
    <div className="min-h-screen bg-quinary-tint-600">
      <style>{flashingDotCSS}</style>
      <div className="max-w-[1200px] mx-auto px-4 mt-[1rem]">
        <FormHeader
          title="ویرایش مقاله"
          subtitle="در این صفحه می توانید مقاله را ویرایش کنید"
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
                      <div className="mt-4 flex justify-start">
                        <button
                          type="button"
                          onClick={handleCopyPrompt}
                          className="flex items-center gap-2 px-4 py-2 bg-quaternary text-white font-semibold rounded-lg hover:bg-quaternary/90 transition-colors duration-300"
                        >
                          <ArticleFormIcons.Copy className="w-5 h-5" />
                          <span>کپی کردن پرامپت ترجمه برای AI</span>
                        </button>
                      </div>
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
                      <div className="mt-4 flex justify-start">
                        <button
                          type="button"
                          onClick={() => setIsModalOpen(true)}
                          className="flex items-center gap-2 px-4 py-2 bg-quaternary text-white font-semibold rounded-lg hover:bg-quaternary/90 transition-colors duration-300"
                        >
                          <span>وارد کردن متن از طریق کلیپ‌برد</span>
                        </button>
                      </div>
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
              <div className="relative">
                <label className="block text-[16px] text-secondary mb-2 text-right">
                  وضعیت مقاله *
                </label>
                <div className="flex items-center space-x-2">
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
                  {formData.status === 'DR' && (
                    <button
                      type="button"
                      onClick={() => setIsScheduleModalOpen(true)}
                      className="flex-shrink-0 px-3 py-3 bg-quaternary text-white rounded-lg hover:bg-quaternary/90 transition-colors duration-300 mr-2"
                      title="زمان‌بندی انتشار"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </button>
                  )}
                </div>
                {errors.status && (
                <p className="text-quaternary text-[14px] mt-1 text-right">{errors.status}</p>
                )}
                {scheduledPublishDate && formData.status === 'DR' && (
                  <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded-md">
                    <p className="text-blue-600 text-sm">
                      زمان‌بندی شده برای انتشار در: {formatJalaliDateTime(scheduledPublishDate)}
                    </p>
                  </div>
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
              <SlideshowImages
                images={slideshowImages}
                onAddImage={handleSlideshowImageChange}
                onRemoveImage={handleRemoveSlideshowImage}
                onChangeImage={handleChangeSlideshowImage}
                error={errors.slideshow_images}
              />
            )}
            <FormActions
              onCancel={handleBack}
              onSubmit={handleSubmit}
              isSubmitting={submitLoading}
              isSubmitDisabled={!hasChanges}
              submitText="ذخیره تغییرات"
            />
          </motion.form>
        </div>
      </div>
      <ImportTranslationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onImport={handleImportTranslation}
      />
      <SchedulePublishModal
        isOpen={isScheduleModalOpen}
        onClose={() => setIsScheduleModalOpen(false)}
        articleId={articleId}
        onSuccess={handleSchedulePublication}
      />
    </div>
  );
};

export default EditNewsForm;