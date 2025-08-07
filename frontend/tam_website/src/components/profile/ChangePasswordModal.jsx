import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import ProfileModal from './ProfileModal';
import { validateProfileChangePasswordIntl } from '../../validators/UserValidators';
import useAdminHttp from '../../hooks/useAdminHttp';
import { successNotif, errorNotif } from '../../utils/customNotifs';
import Input from '../../components/authentication/common/Input';

export default function ChangePasswordModal({ isOpen, onClose }) {
  const { t } = useTranslation(['profile', 'validation']);
  const [fields, setFields] = useState({
    old_password: '',
    new_password: '',
    confirm_password: '',
  });
  const [errors, setErrors] = useState({});
  const [backendError, setBackendError] = useState('');
  const { sendRequest, isLoading } = useAdminHttp();

  const handleChange = e => {
    const { name, value } = e.target;
    setFields(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: undefined }));
    setBackendError('');
  };

  const handleSubmit = async e => {
    e.preventDefault();

    const validationErrors = validateProfileChangePasswordIntl(fields, t);
    setErrors(validationErrors);
    setBackendError('');

    if (Object.keys(validationErrors).length > 0) {
      errorNotif(t('validation:formErrors'));
      return;
    }

    try {
      const res = await sendRequest(
        'http://localhost:8000/api/blog/change_password/', // Changed API endpoint to blog app
        'PATCH',
        fields
      );
      if (res && !res.isError) {
        successNotif(t('profileModalChangePasswordSuccess'));
        onClose();
        setFields({ old_password: '', new_password: '', confirm_password: '' });
        setErrors({});
      } else {
        setErrors(res?.errorContent || {});
        errorNotif(t('somethingWentWrong', { ns: 'blog' }));
        setBackendError(res?.errorContent?.detail || t('somethingWentWrong', { ns: 'blog' }));
      }
    } catch (err) {
      errorNotif(t('somethingWentWrong', { ns: 'blog' }));
      console.error('Error submitting change password form:', err);
      if (err.response && err.response.data) {
        setErrors(err.response.data);
        setBackendError(err.response.data.detail || t('somethingWentWrong', { ns: 'blog' }));
      } else if (typeof err === 'object' && err !== null) {
        setBackendError(err.message || t('somethingWentWrong', { ns: 'blog' }));
      } else {
        setBackendError(t('somethingWentWrong', { ns: 'blog' }));
      }
    }
  };

  const isSubmitDisabled = Object.keys(errors).length > 0 || isLoading;

  return (
    <ProfileModal isOpen={isOpen} onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="text-lg font-semibold text-primary mb-2">{t('profileChangePassword')}</div>

        <Input
          label={t('profileCurrentPassword')}
          name="old_password"
          type="password"
          value={fields.old_password}
          onChange={handleChange}
          error={errors.old_password}
          placeholder={t('profileOldPasswordPlaceholder')}
        />

        <Input
          label={t('profileNewPassword')}
          name="new_password"
          type="password"
          value={fields.new_password}
          onChange={handleChange}
          error={errors.new_password}
          placeholder={t('profileNewPasswordPlaceholder')}
        />

        <Input
          label={t('profileConfirmNewPassword')}
          name="confirm_password"
          type="password"
          value={fields.confirm_password}
          onChange={handleChange}
          error={errors.confirm_password}
          placeholder={t('profileConfirmNewPasswordPlaceholder')}
        />

        {backendError && <div className="text-red-600 text-sm mt-2">{backendError}</div>}
        <button
          type="submit"
          disabled={isSubmitDisabled}
          className={`w-full py-3 rounded-lg bg-primary text-quinary-tint-800 font-bold shadow hover:bg-primary-tint-100 transition ${isSubmitDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {isLoading ? t('loading', { ns: 'blog' }) : t('profileSubmit')}
        </button>
      </form>
    </ProfileModal>
  );
}
