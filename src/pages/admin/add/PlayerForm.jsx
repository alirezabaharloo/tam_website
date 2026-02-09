import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQuery } from '@tanstack/react-query';
import { successNotif, errorNotif } from '../../../utils/customNotifs';
import { validatePlayerForm } from '../../../validators/PlayerValidators'; // Removed isFormValid
import FormHeader from '../../../components/UI/FormHeader';
import PlayerFormFields from '../../../components/admin/players/PlayerFormFields';
import api from '../../../api';


const PlayerForm = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('persian');
  const [errors, setErrors] = useState({});
  const [imagePreview, setImagePreview] = useState(null);
  const [positionOptions, setPositionOptions] = useState({});
  
  const [tabErrors, setTabErrors] = useState({
    persian: false, 
    english: false
  });
  
  const [formData, setFormData] = useState({
    name_fa: '',
    name_en: '',
    number: '',
    goals: '',
    games: '',
    position: '',
    image: null
  });
  
  const { data: positions } = useQuery({
    queryKey: ['player-positions'],
    queryFn: async () => {
      const response = await api.get('/admin/player-positions/');
      return response.data;
    },
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  const createPlayerMutation = useMutation({
    mutationFn: async (formDataToSend) => {
      const response = await api.post('/admin/player-create/', formDataToSend, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    },
    onSuccess: (data) => {
      successNotif('بازیکن جدید اضافه شد');
      setTimeout(() => {
        navigate(`/admin/players/edit/${data.id}`);
      }, 1500);
    },
    onError: (error) => {
      // Set backend errors and merge with any existing ones
      const backendErrors = error?.response?.data || {};
      setErrors(prevErrors => ({ ...prevErrors, ...backendErrors }));
      errorNotif('خطا در ایجاد بازیکن');
    },
  });
  
  useEffect(() => {
    if (positions) {
      const filteredPositions = { ...positions };
      delete filteredPositions[''];
      setPositionOptions(filteredPositions);
    }
  }, [positions]);
  
  
  useEffect(() => {
    const newTabErrors = {
      persian: !!errors.name_fa,
      english: !!errors.name_en
    };
    setTabErrors(newTabErrors);
  }, [errors]);
  
  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
  };
  
  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    const newErrors = validatePlayerForm({ [field]: value });
    setErrors(prev => {
      const oldErrors = { ...prev };
      delete oldErrors[field];
      return { ...oldErrors, ...newErrors };
    });
  };
  
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
      setFormData(prev => ({ ...prev, image: file }));
      const newErrors = validatePlayerForm({ image: file });
      setErrors(prev => {
        const oldErrors = { ...prev };
        delete oldErrors.image;
        return { ...oldErrors, ...newErrors };
      });
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Final validation before submission
    const newErrors = validatePlayerForm({ ...formData, image: formData.image || imagePreview });
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0 || Object.keys(errors).length > 0) {
      errorNotif('لطفاً خطاهای فرم را برطرف کنید');
      return;
    }
    
    const formDataToSend = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      formDataToSend.append(key, value);
    });

    createPlayerMutation.mutate(formDataToSend);
  };
  
  const handleBack = () => {
    navigate("/admin/players")
  };

  const tabs = [
    { id: 'persian', label: 'فارسی', lang: 'fa' },
    { id: 'english', label: 'English', lang: 'en' }
  ];

  return (
    <div className="min-h-screen bg-quinary-tint-600">
      <div className="max-w-[1200px] mx-auto px-4 mt-[1rem]">
        <FormHeader
          title="افزودن بازیکن جدید"
          subtitle="در این صفحه می توانید بازیکن جدیدی ایجاد کنید"
          onBack={handleBack}
        />
        <div className="bg-quinary-tint-800 rounded-2xl shadow-[0_0_16px_rgba(0,0,0,0.25)] p-6">
          <PlayerFormFields
            activeTab={activeTab}
            tabs={tabs}
            tabErrors={tabErrors}
            onTabChange={handleTabChange}
            formData={formData}
            errors={errors}
            onInputChange={handleInputChange}
            onImageChange={handleImageChange}
            positionOptions={positionOptions}
            imagePreview={imagePreview}
            onSubmit={handleSubmit}
            onCancel={handleBack}
            isSubmitting={createPlayerMutation.isPending}
            isSubmitDisabled={Object.keys(errors).length > 0 || createPlayerMutation.isPending}
            submitText="ایجاد بازیکن"
          />
        </div>
      </div>
    </div>
  );
};

export default PlayerForm;
