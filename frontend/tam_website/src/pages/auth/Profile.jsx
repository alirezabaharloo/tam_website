import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import ProfileHeader from '../../components/profile/ProfileHeader';
import ProfileTabs from '../../components/profile/ProfileTabs';
import ProfileTabPanel from '../../components/profile/ProfileTabPanel';
import ChangePasswordModal from '../../components/profile/ChangePasswordModal';
import useAdminHttp from '../../hooks/useAdminHttp';
import { errorNotif } from '../../utils/customNotifs';

export default function Profile() {
  const { t } = useTranslation('profile');
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('info');
  const [notif, setNotif] = useState({ email: true, sms: false });
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);

  const { data, isLoading, isError, errorContent, sendRequest } = useAdminHttp('http://localhost:8000/api/auth/user/');

  useEffect(() => {
    if (data && !data.isError) {
      setUser(data);
    } else if (data && data.isError) {
      errorNotif(t('somethingWentWrong', { ns: 'blog' }));
    }
  }, [data, t]);

  const handleUserUpdate = updatedFields => {
    setUser(prev => ({ ...prev, ...updatedFields }));
  };

  if (isLoading || !user) {
    return <div className="text-center py-20">{t('loading')}</div>;
  }

  return (
    <div className="min-h-screen bg-quinary-tint-600 py-8 px-2">
      <div className="w-full max-w-[1300px] mx-auto bg-white rounded-2xl shadow-lg p-6 sm:p-10">
        <ProfileHeader user={user} />
        <ProfileTabs activeTab={activeTab} setActiveTab={setActiveTab} />
        <ProfileTabPanel
          activeTab={activeTab}
          user={user}
          onUserUpdate={handleUserUpdate}
          notif={notif}
          setNotif={setNotif}
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