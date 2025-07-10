import React from 'react';
import { useTranslation } from 'react-i18next';
import { FaUserCircle } from 'react-icons/fa';

export default function ProfileHeader({ user }) {
  const { t, i18n } = useTranslation('profile');
  const isRTL = i18n.language === 'fa';
  const fullName = (user.firstName && user.lastName)
    ? `${user.firstName} ${user.lastName}`
    : (isRTL ? 'کاربر میهمان' : 'Guest User');

  return (
    <div className="flex items-center gap-6 mb-8">
      <div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center overflow-hidden">
        {/* Replace with <img src={user.photo} ... /> if you have a photo */}
        <FaUserCircle className="text-white text-6xl" />
      </div>
      <div>
        <div className="text-2xl font-bold text-primary">{fullName}</div>
        <div className="text-secondary text-base">{user.email}</div>
      </div>
    </div>
  );
}
