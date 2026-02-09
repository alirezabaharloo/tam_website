import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { successNotif, errorNotif } from '../../../utils/customNotifs';
import AdminPlayerNotFound from '../../AdminUI/AdminPlayerNotFound';
import AdminSomethingWentWrong from '../../AdminUI/AdminSomethingWentWrong';
import FormHeader from '../../../components/UI/FormHeader';
import { validatePlayerForm } from '../../../validators/PlayerValidators';
import PlayerFormFields from '../../../components/admin/players/PlayerFormFields';
import api from '../../../api';

const EditPlayerForm = () => {
  const { playerId } = useParams();
  const [activeTab, setActiveTab] = useState('persian');
  const [errors, setErrors] = useState({});
  const [imagePreview, setImagePreview] = useState(null);
  const [positionOptions, setPositionOptions] = useState({});
  const [originalData, setOriginalData] = useState(null);
  const [hasChanges, setHasChanges] = useState(false);
  const queryClient = useQueryClient();
  
  const [formData, setFormData] = useState({
    name_fa: '',
    name_en: '',
    number: '',
    goals: '',
    games: '',
    position: '',
    image: '',
  });
  
  const {
    data: positions,
    isError: positionsError,
  } = useQuery({
    queryKey: ['player-positions'],
    queryFn: async () => {
      const response = await api.get('/admin/player-positions/');
      return response.data;
    },
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  const {
    data: playerDetails,
    isLoading: playerDetailsLoading,
    isError: playerDetailsError,
    error: playerDetailsErrorObj,
  } = useQuery({
    queryKey: ['player-detail', playerId],
    queryFn: async () => {
      const response = await api.get(`/admin/player-detail/${playerId}/`);
      return response.data;
    },
    enabled: !!playerId,
    refetchOnWindowFocus: false,
  });

  const updatePlayerMutation = useMutation({
    mutationFn: async (formDataToSend) => {
      const response = await api.patch(`/admin/player-update/${playerId}/`, formDataToSend, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    },
    onSuccess: () => {
      successNotif('اطلاعات بازیکن با موفقیت بروزرسانی شد');
      setErrors({});
      queryClient.invalidateQueries({ queryKey: ['player-detail', playerId] });
    },
    onError: (error) => {
      const backendErrors = error?.response?.data || {};
      setErrors(prevErrors => ({ ...prevErrors, ...backendErrors }));
      errorNotif('خطا در بروزرسانی بازیکن');
    },
  });
  
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

  // Remove centralized useEffect for live validation
  // Validation will now be handled directly in change handlers and on submit.

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
    setFormData(prev => ({ ...prev, [field]: value }));
    // Validate only the changed field and update errors
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
      // Validate image and update errors
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
    const finalValidationErrors = validatePlayerForm({ ...formData, image: formData.image || imagePreview });
    setErrors(finalValidationErrors);
    if (Object.keys(finalValidationErrors).length > 0) { // Only check newly generated errors
      errorNotif('لطفاً خطاهای فرم را برطرف کنید');
      return;
    }

    if (!hasChanges) {
      errorNotif('لطفا حداقل یکی از فیلدها را تغییر دهید.');
      return;
    }

    const formDataToSend = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      // Only append fields if they have changed from originalData
      if (key !== 'image' && originalData[key] !== value) {
        formDataToSend.append(key, value);
      }
    });
    // Handle image separately: only append if a new image file is selected
    if (formData.image) {
      formDataToSend.append('image', formData.image);
    } else if (imagePreview === null && playerDetails?.image) {
      // If image was removed
      formDataToSend.append('image', ''); // Send empty string to clear image
    }

    updatePlayerMutation.mutate(formDataToSend);
  };
  
  const handleBack = () => {
    window.history.back();
  };
  
  const tabs = [
    { id: 'persian', label: 'فارسی', lang: 'fa' },
    { id: 'english', label: 'English', lang: 'en' }
  ];

  if (playerDetailsLoading) {
    return (
      <div className="min-h-screen bg-quinary-tint-600 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const playerNotFound =
    playerDetailsError &&
    (playerDetailsErrorObj?.response?.status === 404 ||
      playerDetailsErrorObj?.response?.data?.detail === 'No Player matches the given query.' ||
      playerDetailsErrorObj?.response?.data?.detail === 'page not found.');

  if (playerNotFound) {
    return <AdminPlayerNotFound />;
  }
  
  if (playerDetailsError || positionsError) {
    return <AdminSomethingWentWrong />;
  }

  return (
    <div className="min-h-screen bg-quinary-tint-600">
      <div className="max-w-[1200px] mx-auto px-4 mt-[1rem]">
        <FormHeader
          title="ویرایش بازیکن"
          subtitle="در این صفحه می توانید اطلاعات بازیکن را ویرایش کنید"
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
            isSubmitting={updatePlayerMutation.isPending}
            isSubmitDisabled={Object.keys(errors).length > 0 || updatePlayerMutation.isPending || playerDetailsLoading}
            submitText="ذخیره تغییرات"
          />
        </div>
      </div>
    </div>
  );
};

export default EditPlayerForm; 
