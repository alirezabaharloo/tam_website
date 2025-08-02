import React from 'react';
import ProfileInfoForm from './ProfileInfoForm';
import ProfileHistoryTable from './ProfileHistoryTable';
import ProfileSecurity from './ProfileSecurity';
import ProfileNotifications from './ProfileNotifications';
import ProfileSupport from './ProfileSupport';

export default function ProfileTabPanel({ activeTab, user, onUserUpdate, notif, setNotif, onOpenChangePassword }) {
  switch (activeTab) {
    case 'info':
      return <ProfileInfoForm user={user} onUserUpdate={onUserUpdate} onOpenChangePassword={onOpenChangePassword} />;
    case 'history':
      return <ProfileHistoryTable user={user} />;
    default:
      return null;
  }
}
