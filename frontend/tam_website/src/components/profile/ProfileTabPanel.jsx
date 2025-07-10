import React from 'react';
import ProfileInfoForm from './ProfileInfoForm';
import ProfileHistoryTable from './ProfileHistoryTable';
import ProfileSecurity from './ProfileSecurity';
import ProfileNotifications from './ProfileNotifications';
import ProfileSupport from './ProfileSupport';

export default function ProfileTabPanel({ activeTab, user, onUserUpdate, notif, setNotif }) {
  switch (activeTab) {
    case 'info':
      return <ProfileInfoForm user={user} onUserUpdate={onUserUpdate} />;
    case 'history':
      return <ProfileHistoryTable user={user} />;
    case 'security':
      return <ProfileSecurity user={user} />;
    case 'notifications':
      return <ProfileNotifications notif={notif} setNotif={setNotif} />;
    case 'support':
      return <ProfileSupport />;
    default:
      return null;
  }
}
