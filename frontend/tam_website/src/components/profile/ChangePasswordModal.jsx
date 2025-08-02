import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import ProfileModal from './ProfileModal';
import { validateProfileChangePasswordIntl } from '../../validators/UserValidators';
import useAdminHttp from '../../hooks/useAdminHttp';
import { successNotif, errorNotif } from '../../utils/customNotifs';

export default function ChangePasswordModal({ isOpen, onClose }) {
  const { t } = useTranslation(['profile', 'validation']);
  const [fields, setFields] = useState({
    old_password: '',
    new_password: '',
    confirm_password: '',
  });
  const [errors, setErrors] = useState({});
  const [backendError, setBackendError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = e => {
    setFields({ ...fields, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: undefined });
    setBackendError('');
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const validationErrors = validateProfileChangePasswordIntl(fields, t);
    setErrors(validationErrors);
    setBackendError('');
    if (Object.keys(validationErrors).length > 0) return;
    setLoading(true);
    try {
      const { sendRequest } = useAdminHttp();
      const res = await sendRequest(
        'http://localhost:8000/api/auth/change_password/',
        'PATCH',
        {
          old_password: fields.old_password,
          new_password: fields.new_password,
          confirm_password: fields.confirm_password,
        }
      );
      if (res && !res.isError) {
        successNotif(t('profileModalChangePasswordSuccess'));
        onClose();
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
    <ProfileModal isOpen={isOpen} onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="text-lg font-semibold text-primary mb-2">{t('profileChangePassword')}</div>
        <div>
          <label className="block text-primary font-medium mb-1">{t('profilePassword', { ns: 'profile' })}</label>
          <input
            name="old_password"
            type="password"
            value={fields.old_password}
            onChange={handleChange}
            className={`w-full px-4 py-2 rounded-lg border text-primary border-quaternary-200 focus:border-primary outline-none transition ${errors.old_password ? 'border-red-500' : ''}`}
          />
          {errors.old_password && <div className="text-red-600 text-xs mt-1">{errors.old_password}</div>}
        </div>
        <div>
          <label className="block text-primary font-medium mb-1">{t('profileNewPassword', { ns: 'validation' })}</label>
          <input
            name="new_password"
            type="password"
            value={fields.new_password}
            onChange={handleChange}
            className={`w-full px-4 py-2 rounded-lg border text-primary border-quaternary-200 focus:border-primary outline-none transition ${errors.new_password ? 'border-red-500' : ''}`}
          />
          {errors.new_password && <div className="text-red-600 text-xs mt-1">{errors.new_password}</div>}
        </div>
        <div>
          <label className="block text-primary font-medium mb-1">{t('profileConfirmNewPassword', { ns: 'validation' })}</label>
          <input
            name="confirm_password"
            type="password"
            value={fields.confirm_password}
            onChange={handleChange}
            className={`w-full px-4 py-2 rounded-lg border text-primary border-quaternary-200 focus:border-primary outline-none transition ${errors.confirm_password ? 'border-red-500' : ''}`}
          />
          {errors.confirm_password && <div className="text-red-600 text-xs mt-1">{errors.confirm_password}</div>}
        </div>
        {backendError && <div className="text-red-600 text-sm mt-2">{backendError}</div>}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-lg bg-primary text-quinary-tint-800 font-bold shadow hover:bg-primary-tint-100 transition disabled:opacity-60"
        >
          {loading ? t('loading', { ns: 'blog' }) : t('profileSubmit')}
        </button>
      </form>
    </ProfileModal>
  );
}
