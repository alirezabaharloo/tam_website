import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { validateProfileFormIntl } from '../../validators/UserValidators';
import useAdminHttp from '../../hooks/useAdminHttp';
import { successNotif, errorNotif } from '../../utils/customNotifs';

export default function ProfileInfoForm({ user, onUserUpdate, onOpenChangePassword }) {
  const { t, i18n } = useTranslation(['profile', 'validation']);
  const [form, setForm] = useState({
    first_name: user.first_name || '',
    last_name: user.last_name || '',
    phone_number: user.phone_number || '',
  });
  const [errors, setErrors] = useState({});
  const [backendError, setBackendError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setForm({
      first_name: user.first_name || '',
      last_name: user.last_name || '',
      phone_number: user.phone_number || '',
    });
  }, [user]);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: undefined });
    setBackendError('');
  };

  const handleSave = async e => {
    e.preventDefault();
    const validationErrors = validateProfileFormIntl(form, t);
    setErrors(validationErrors);
    setBackendError('');
    if (Object.keys(validationErrors).length > 0) return;
    setLoading(true);
    try {
      const { sendRequest } = useAdminHttp();
      const res = await sendRequest(
        'http://localhost:8000/api/auth/profile/',
        'PATCH',
        form
      );
      if (res && !res.isError) {
        successNotif(t('profileSaveSuccess'));
        onUserUpdate(res);
      } else {
        errorNotif(t('somethingWentWrong', { ns: 'blog' }));
        setBackendError(res?.errorContent?.detail || t('somethingWentWrong', { ns: 'blog' }));
      }
    } catch (err) {
      setBackendError(err.message);
      errorNotif(t('somethingWentWrong', { ns: 'blog' }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="space-y-6" onSubmit={handleSave}>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label className="block text-primary font-medium mb-1">{t('profileFirstName')}</label>
          <input
            name="first_name"
            type="text"
            value={form.first_name}
            onChange={handleChange}
            className={`w-full px-4 py-2 rounded-lg border border-quaternary-200 focus:border-primary outline-none transition text-primary ${errors.first_name ? 'border-red-500' : ''}`}
          />
          {errors.first_name && <div className="text-red-600 text-xs mt-1">{errors.first_name}</div>}
        </div>
        <div>
          <label className="block text-primary font-medium mb-1">{t('profileLastName')}</label>
          <input
            name="last_name"
            type="text"
            value={form.last_name}
            onChange={handleChange}
            className={`w-full px-4 py-2 rounded-lg border border-quaternary-200 focus:border-primary outline-none transition text-primary ${errors.last_name ? 'border-red-500' : ''}`}
          />
          {errors.last_name && <div className="text-red-600 text-xs mt-1">{errors.last_name}</div>}
        </div>
        <div>
          <label className="block text-primary font-medium mb-1">{t('profilePhone')}</label>
          <input
            name="phone_number"
            type="text"
            value={form.phone_number}
            disabled
            className="w-full px-4 py-2 rounded-lg border border-quaternary-200 text-primary-tint-500 bg-gray-100"
          />
        </div>
      </div>
      {backendError && <div className="text-red-600 text-sm mt-2">{backendError}</div>}
      <div className="flex gap-4 mt-6">
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2 rounded-lg bg-primary text-quinary-tint-800 font-semibold shadow hover:bg-primary-tint-100 transition disabled:opacity-60"
        >
          {loading ? t('loading', { ns: 'blog' }) : t('profileSave')}
        </button>
        <button
          type="button"
          onClick={onOpenChangePassword}
          className="px-6 py-2 rounded-lg border border-primary text-primary font-semibold shadow hover:bg-quaternary-tint-900 transition"
        >
          {t('profileChangePassword')}
        </button>
      </div>
    </form>
  );
}
