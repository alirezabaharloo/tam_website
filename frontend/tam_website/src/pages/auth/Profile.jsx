import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import ProfileHeader from '../../components/profile/ProfileHeader';
import ProfileTabs from '../../components/profile/ProfileTabs';
import ProfileTabPanel from '../../components/profile/ProfileTabPanel';

export default function Profile() {
  const { t, i18n } = useTranslation('profile');
  const isRTL = i18n.language === 'fa';

  // Simulated user data (replace with real data)
  const [user, setUser] = useState({
    firstName: '',
    lastName: '',
    email: 'user@email.com',
    phone: '09123456789',
    dob: '',
    preRegisterHistory: [
      { sport: 'Football', date: '2024-06-01' },
      { sport: 'Basketball', date: '2024-05-15' },
    ],
  });

  const [activeTab, setActiveTab] = useState('info');
  const [notif, setNotif] = useState({ email: true, sms: false });

  // For updating user info
  const handleUserUpdate = (fields) => setUser({ ...user, ...fields });

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
        />
      </div>
    </div>
  );
}