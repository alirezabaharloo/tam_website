import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { successNotif } from '../../utils/customNotifs';

export default function ProfileInfoForm({ user, onUserUpdate }) {
  const { t } = useTranslation('profile');
  const [form, setForm] = useState({
    firstName: user.firstName || '',
    lastName: user.lastName || '',
    dob: user.dob || '',
  });

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });
  const handleSave = e => {
    e.preventDefault();
    onUserUpdate(form);
    successNotif(t('profileSaveSuccess'));
  };
  const handleDiscard = () => setForm({
    firstName: user.firstName || '',
    lastName: user.lastName || '',
    dob: user.dob || '',
  });

  return (
    <form className="space-y-6" onSubmit={handleSave}>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label className="block text-primary font-medium mb-1">{t('profileFirstName')}</label>
          <input
            name="firstName"
            type="text"
            value={form.firstName}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg border border-quaternary-200 focus:border-primary outline-none transition text-primary"
          />
        </div>
        <div>
          <label className="block text-primary font-medium mb-1">{t('profileLastName')}</label>
          <input
            name="lastName"
            type="text"
            value={form.lastName}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg border border-quaternary-200 focus:border-primary outline-none transition text-primary"
          />
        </div>
        <div>
          <label className="block text-primary font-medium mb-1">{t('profileDOB')}</label>
          <input
            name="dob"
            type="date"
            value={form.dob}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg border border-quaternary-200 focus:border-primary outline-none transition text-primary"
          />
        </div>
        <div>
          <label className="block text-primary font-medium mb-1">{t('profileEmail')}</label>
          <input
            type="email"
            value={user.email}
            disabled
            className="w-full px-4 py-2 rounded-lg border border-quaternary-200 text-primary-tint-500"
          />
        </div>
        <div>
          <label className="block text-primary font-medium mb-1">{t('profilePhone')}</label>
          <input
            type="text"
            value={user.phone}
            disabled
            className="w-full px-4 py-2 rounded-lg border border-quaternary-200 text-primary-tint-500"
          />
        </div>
      </div>
      <div className="flex gap-4 mt-6">
        <button
          type="submit"
          className="px-6 py-2 rounded-lg bg-primary text-quinary-tint-800 font-semibold shadow hover:bg-primary-tint-100 transition"
        >
          {t('profileSave')}
        </button>
        <button
          type="button"
          onClick={handleDiscard}
          className="px-6 py-2 rounded-lg border border-primary text-primary font-semibold shadow hover:bg-quaternary-tint-900 transition"
        >
          {t('profileDiscard')}
        </button>
      </div>
    </form>
  );
}
