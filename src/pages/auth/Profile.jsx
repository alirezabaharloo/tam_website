import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import ProfileHeader from '../../components/profile/ProfileHeader';
import ProfileInfoForm from '../../components/profile/ProfileInfoForm';
import ChangePasswordModal from '../../components/profile/ChangePasswordModal';
import { errorNotif } from '../../utils/customNotifs';
import SomethingWentWrong from '../UI/SomethingWentWrong';
import SpinLoader from '../UI/SpinLoader';
import { apiAuth } from '../../api';
import { useNavigate } from 'react-router-dom';

export default function Profile() {
  const navigate = useNavigate();

  const { t } = useTranslation('profile');
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);

  const { data: user, isLoading, isError } = useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      const response = await apiAuth.get('/auth/user/');
      return response.data;
    },
    retry: false,
    onError: (err) => {
      if (err?.response?.status === 401) {
        navigate("/login");
        return;
      }
  
      throw new Error(err);
      
    },
  });


  if (isLoading) {
    return <SpinLoader />;
  }

  if (isError) {
    return <SomethingWentWrong />;
  }

  if (!user) {
    return <SomethingWentWrong />
  }


  const handleUserUpdate = (data) =>{
    // sadf
  }


  return (
    <div className="min-h-screen bg-quinary-tint-600 py-8 px-2">
      <div className="w-full max-w-[1300px] mx-auto bg-white rounded-2xl shadow-lg p-6 sm:p-10">
        <ProfileHeader user={user} />
        <ProfileInfoForm
          user={user}
          onUserUpdate={handleUserUpdate}
          onOpenChangePassword={() => setIsChangePasswordOpen(true)}
        />
        <ChangePasswordModal
          isOpen={isChangePasswordOpen}
          onClose={() => setIsChangePasswordOpen(false)}
        />
      </div>
    </div>
  );
}