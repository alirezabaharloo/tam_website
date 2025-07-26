import React, { useState } from 'react';
import Modal from '../../UI/Modal';
import useAdminHttp from '../../../hooks/useAdminHttp';
import { successNotif, errorNotif } from '../../../utils/customNotifs';
import { validateChangePassword } from '../../../validators/UserValidators';

const ChangePasswordModal = ({
  isOpen,
  onClose,
  userId,
}) => {
  const [newPassword, setNewPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [errors, setErrors] = useState({});
  
  const { isLoading: submitLoading, sendRequest } = useAdminHttp();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateChangePassword(newPassword, repeatPassword);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      const response = await sendRequest(`http://localhost:8000/api/admin/user-change-password/${userId}/`, 'PATCH', {
        new_password: newPassword,
        repeat_password: repeatPassword,
      });

      if (response?.isError) {
        console.log(response?.errorContent);
        setErrors(response?.errorContent || {}); // Keep backend errors for other fields if any
        errorNotif('خطا در تغییر گذرواژه');
      } else {
        successNotif('گذرواژه با موفقیت تغییر کرد.');
        onClose();
        setNewPassword('');
        setRepeatPassword('');
        setErrors({});
      }
    } catch (error) {
      errorNotif('خطا در ارتباط با سرور');
      console.error('Error submitting password change:', error);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="تغییر گذرواژه"
      footer={
        <>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-quinary-tint-500 text-primary rounded-lg hover:bg-quinary-tint-400 transition-colors duration-300"
            disabled={submitLoading}
          >
            انصراف
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-primary text-quinary-tint-800 rounded-lg hover:bg-primary-tint-100 transition-colors duration-300 font-medium"
            disabled={submitLoading}
          >
            {submitLoading ? 'در حال تغییر...' : 'تغییر گذرواژه'}
          </button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-[16px] text-secondary mb-2 text-right">گذرواژه جدید *</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className={`w-full px-4 py-3 bg-quinary-tint-600 text-primary rounded-lg border-2 ${errors.new_password ? 'border-quaternary' : 'border-quinary-tint-500'} focus:border-primary outline-none transition-colors duration-300`}
            placeholder="گذرواژه جدید"
            dir="ltr"
          />
          {errors?.new_password && <p className="text-quaternary text-[14px] mt-1 text-right">{errors.new_password}</p>}
        </div>
        <div>
          <label className="block text-[16px] text-secondary mb-2 text-right">تکرار گذرواژه جدید *</label>
          <input
            type="password"
            value={repeatPassword}
            onChange={(e) => setRepeatPassword(e.target.value)}
            className={`w-full px-4 py-3 bg-quinary-tint-600 text-primary rounded-lg border-2 ${errors.repeat_password ? 'border-quaternary' : 'border-quinary-tint-500'} focus:border-primary outline-none transition-colors duration-300`}
            placeholder="تکرار گذرواژه جدید"
            dir="ltr"
          />
          {errors?.repeat_password && <p className="text-quaternary text-[14px] mt-1 text-right">{errors.repeat_password}</p>}
        </div>
      </form>
    </Modal>
  );
};

export default ChangePasswordModal; 