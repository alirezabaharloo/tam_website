import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import useAdminHttp from '../../../hooks/useAdminHttp';
import { successNotif, errorNotif } from '../../../utils/customNotifs';
import { isFormValid } from '../../../validators/PlayerValidators';
import LazyImage from '../../../components/UI/LazyImage';
import PlayerNotFound from '../../../components/UI/PlayerNotFound';
import SomethingWentWrong from '../../../components/UI/SomethingWentWrong';
import { ArticleFormIcons } from '../../../data/Icons';

const Icons = ArticleFormIcons;

const PlayerEditForm = () => {
  const navigate = useNavigate();
  const { playerId } = useParams();
  const [activeTab, setActiveTab] = useState('persian');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [imagePreview, setImagePreview] = useState(null);
  const [positionOptions, setPositionOptions] = useState({});
  const [originalData, setOriginalData] = useState(null);
  const [hasChanges, setHasChanges] = useState(false);
  const imageInputRef = useRef(null);

  const [formData, setFormData] = useState({
    name_fa: '',
    name_en: '',
    number: '',
    goals: '',
    games: '',
    position: '',
    image: null
  });

  const {
    data: positions,
  } = useAdminHttp('http://localhost:8000/api/admin/player-positions/');

  const {
    data: playerDetails,
    isLoading: playerDetailsLoading,
    isError: playerDetailsError,
    sendRequest: fetchPlayers,
  } = useAdminHttp(`http://localhost:8000/api/admin/player-detail/${playerId}/`);

  const {
    isLoading: submitLoading,
    sendRequest
  } = useAdminHttp();

  useEffect(() => {
    if (playerDetails) {
      const initialFormData = {
        name_fa: playerDetails.name_fa || '',
        name_en: playerDetails.name_en || '',
        number: playerDetails.number?.toString() || '',
        goals: playerDetails.goals?.toString() || '',
        games: playerDetails.games?.toString() || '',
        position: playerDetails.position || '',
        image: null
      };
      setFormData(initialFormData);
      setOriginalData(initialFormData);
      if (playerDetails.image) {
        setImagePreview(playerDetails.image);
      }
    }
  }, [playerDetails]);

  useEffect(() => {
    if (positions) {
      const filteredPositions = { ...positions };
      delete filteredPositions[''];
      setPositionOptions(filteredPositions);
    }
  }, [positions]);

  useEffect(() => {
    if (originalData) {
      const hasFormChanges = Object.keys(formData).some(key => {
        if (key === 'image') {
          return formData.image !== null;
        }
        return formData[key] !== originalData[key];
      });
      const hasImageChanges =
        (imagePreview === null && playerDetails?.image) ||
        formData.image !== null;
      setHasChanges(hasFormChanges || hasImageChanges);
    }
  }, [formData, originalData, imagePreview, playerDetails]);

  const [tabErrors, setTabErrors] = useState({
    persian: false,
    english: false
  });

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
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
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
    setIsLoading(true);
    const formDataToSend = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (originalData[key] !== value) {
        formDataToSend.append(key, value);
      }
    });
    try {
      const response = await sendRequest(`http://localhost:8000/api/admin/player-update/${playerId}/`, 'PATCH', formDataToSend);
      if (response?.isError) {
        setErrors(response?.errorContent || {});
        errorNotif('خطا در بروزرسانی بازیکن');
      } else {
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

  const isRTL = true;

  const flashingDotCSS = `
    @keyframes flash {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.3; }
    }
  `;

  if (playerDetailsLoading) {
    return (
      <div className="min-h-screen bg-quinary-tint-600 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (playerDetails?.errorContent?.detail === "No Player matches the given query." || playerDetails?.errorContent?.detail === "page not found.") {
    return <PlayerNotFound />;
  }

  if (playerDetails?.isError || positions?.isError || playerDetailsError) {
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
                  ویرایش بازیکن
                </h1>
                <p className="text-[16px] text-secondary">
                  در این صفحه می توانید اطلاعات بازیکن را ویرایش کنید
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
            <div className="space-y-4">
              <label className="block text-[16px] text-secondary mb-2 text-right">
                تصویر بازیکن
              </label>
              <div
                className={`w-full h-[300px] rounded-lg border-2 ${
                  errors.image ? 'border-quaternary' : 'border-quinary-tint-500'
                } relative overflow-hidden cursor-pointer group`}
                onClick={handleChangeImage}
              >
                {imagePreview ? (
                  <>
                    <LazyImage
                      src={imagePreview}
                      alt="Player preview"
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
              {errors.image && (
                <p className="text-quaternary text-[14px] mt-1 text-right">{errors.image}</p>
              )}
            </div>
            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              <button
                type="submit"
                disabled={submitLoading || !hasChanges}
                className="flex-1 px-6 py-3 bg-primary text-quinary-tint-800 text-[16px] font-semibold rounded-lg hover:bg-primary-tint-200 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {submitLoading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-quinary-tint-800"></div>
                ) : (
                  'ذخیره تغییرات'
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

export default PlayerEditForm; 