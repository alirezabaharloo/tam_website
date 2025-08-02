import i18n from '../i18n';

export const validateUserForm = (formData) => {
  const errors = {};

  // Validate phone_number
  if (!formData.phone_number) {
    errors.phone_number = 'شماره موبایل الزامی است.';
  } else if (!/^\b$/.test(formData.phone_number)){
    errors.phone_number = 'شماره تلفن همراه نامعتبر است!';
  } else if (!/^[0-9]{11}$/.test(formData.phone_number)) {
    errors.phone_number = 'شماره موبایل باید دقیقاً ۱۱ رقم باشد.';
  }

  // Validate first_name
  if (formData.first_name && formData.first_name.length > 100) {
    errors.first_name = 'نام نمی‌تواند بیشتر از ۱۰۰ کاراکتر باشد.';
  }

  // Validate last_name
  if (formData.last_name && formData.last_name.length > 100) {
    errors.last_name = 'نام خانوادگی نمی‌تواند بیشتر از ۱۰۰ کاراکتر باشد.';
  }

  return errors;
};

export const validateStrongPassword = (password) => {
  const errors = [];
  if (password.length < 8) {
    errors.push('گذرواژه باید حداقل ۸ کاراکتر باشد.');
  }
  if (!/[A-Z]/.test(password)) {
    errors.push('گذرواژه باید حداقل شامل یک حرف بزرگ باشد.');
  }
  if (!/[a-z]/.test(password)) {
    errors.push('گذرواژه باید حداقل شامل یک حرف کوچک باشد.');
  }
  if (!/[0-9]/.test(password)) {
    errors.push('گذرواژه باید حداقل شامل یک عدد باشد.');
  }
  if (!/[!@#$%^&*]/.test(password)) {
    errors.push('گذرواژه باید حداقل شامل یک کاراکتر خاص (!@#$%^&*) باشد.');
  }
  return errors;
};

export const validateChangePassword = (newPassword, repeatPassword) => {
  const errors = {};
  
  if (!newPassword) {
    errors.new_password = 'گذرواژه جدید الزامی است.';
  }
  if (!repeatPassword) {
    errors.repeat_password = 'تکرار گذرواژه الزامی است.';
  }
  
  if (newPassword && repeatPassword && newPassword !== repeatPassword) {
    errors.repeat_password = 'گذرواژه‌ها یکسان نیستند.';
  }

  if (newPassword) {
    const strongPasswordErrors = validateStrongPassword(newPassword);
    if (strongPasswordErrors.length > 0) {
      errors.new_password = strongPasswordErrors; // Assign the array directly
    }
  }
  
  return errors;
}; 

export const validateProfileFormIntl = (formData, t) => {
  const errors = {};
  // Validate first_name
  if (formData.first_name && formData.first_name.length > 100) {
    errors.first_name = t('profileFirstName') + ' ' + t('validation:profileFirstNameMax', { max: 100 });
  }
  // Validate last_name
  if (formData.last_name && formData.last_name.length > 100) {
    errors.last_name = t('profileLastName') + ' ' + t('validation:profileLastNameMax', { max: 100 });
  }
  return errors;
};

export const validateProfileChangePasswordIntl = (fields, t) => {
  const errors = {};
  if (!fields.old_password) {
    errors.old_password = t('profilePasswordRequired', { ns: 'validation' });
  }
  if (!fields.new_password) {
    errors.new_password = t('profileNewPassword', { ns: 'validation' }) + ' ' + t('profilePasswordRequired', { ns: 'validation' });
  }
  if (!fields.confirm_password) {
    errors.confirm_password = t('profileConfirmNewPassword', { ns: 'validation' }) + ' ' + t('profilePasswordRequired', { ns: 'validation' });
  }
  if (fields.new_password && fields.confirm_password && fields.new_password !== fields.confirm_password) {
    errors.confirm_password = t('profilePasswordsNoMatch', { ns: 'profile' });
  }
  if (fields.new_password && fields.new_password.length < 8) {
    errors.new_password = t('profilePasswordTooShort', { ns: 'profile' });
  }
  return errors;
}; 