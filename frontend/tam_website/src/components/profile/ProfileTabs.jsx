import React from 'react';
import { useTranslation } from 'react-i18next';

const TABS = [
  { id: 'info', label: 'profileTabInfo' },
  { id: 'history', label: 'profileTabHistory' },
  { id: 'security', label: 'profileTabSecurity' },
  { id: 'notifications', label: 'profileTabNotifications' },
  { id: 'support', label: 'profileTabSupport', disabled: true },
];

export default function ProfileTabs({ activeTab, setActiveTab }) {
  const { t } = useTranslation('profile');
  return (
    <div className="flex gap-3 mb-10 justify-start">
      {TABS.map(tab => (
        <button
          key={tab.id}
          onClick={() => !tab.disabled && setActiveTab(tab.id)}
          className={`
            px-6 py-2
            text-base font-semibold
            rounded-xl border
            transition-all duration-200
            shadow-sm
            ${activeTab === tab.id
              ? 'bg-primary text-white border-primary'
              : 'bg-white text-primary border-primary-tint-200 hover:bg-quaternary-tint-900'}
            ${tab.disabled ? 'opacity-50 cursor-not-allowed' : ''}
            min-w-[140px]
          `}
          disabled={tab.disabled}
        >
          {t(tab.label)}
        </button>
      ))}
    </div>
  );
}
