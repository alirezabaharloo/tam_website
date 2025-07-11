/**
 * Player form validation utilities
 */

/**
 * Validates all player form fields
 * @param {Object} formData - The form data to validate
 * @returns {Object} An object containing validation errors or empty object if valid
 */
export const validatePlayerForm = (formData) => {
  const errors = {};
  
  // Validate name fields
  if (!formData.name_fa?.trim()) {
    errors.name_fa = 'لطفا نام بازیکن را به فارسی وارد کنید';
  }
  
  if (!formData.name_en?.trim()) {
    errors.name_en = 'لطفا نام بازیکن را به انگلیسی وارد کنید';
  }
  
  // Validate number field
  if (!formData.number) {
    errors.number = 'لطفا شماره پیراهن بازیکن را وارد کنید';
  } else {
    const num = parseInt(formData.number);
    if (isNaN(num) || num < 1 || num > 99) {
      errors.number = 'شماره پیراهن باید بین 1 تا 99 باشد';
    }
  }
  
  // Validate goals field
  if (!formData.goals && formData.goals !== 0) {
    errors.goals = 'لطفا تعداد گل را وارد کنید';
  } else if (isNaN(parseInt(formData.goals)) || parseInt(formData.goals) < 0) {
    errors.goals = 'تعداد گل باید عدد مثبت باشد';
  }
  
  // Validate games field
  if (!formData.games && formData.games !== 0) {
    errors.games = 'لطفا تعداد بازی را وارد کنید';
  } else if (isNaN(parseInt(formData.games)) || parseInt(formData.games) < 0) {
    errors.games = 'تعداد بازی باید عدد مثبت باشد';
  }
  
  // Validate position field
  if (!formData.position) {
    errors.position = 'لطفا پست بازیکن را انتخاب کنید';
  }
  
  // Validate image field
  if (!formData.image) {
    errors.image = 'لطفا تصویر بازیکن را انتخاب کنید';
  }
  
  return errors;
};

/**
 * Check if the form is valid for submission
 * @param {Object} formData - The form data to check
 * @returns {Boolean} Whether the form is valid for submission
 */
export const isFormValid = (formData) => {
  const errors = validatePlayerForm(formData);
  return Object.keys(errors).length === 0;
};

export default { validatePlayerForm, isFormValid }; 