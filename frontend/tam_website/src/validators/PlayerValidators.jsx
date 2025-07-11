/**
 * Player form validation utilities
 */

/**
 * Validates if the player number is between 1 and 99 inclusive
 * @param {string|number} number - The player number to validate
 * @returns {string|null} Error message if invalid, null if valid
 */
export const validatePlayerNumber = (number) => {
    if (!number) {
      return 'لطفا شماره پیراهن بازیکن را وارد کنید';
    }
    
    const num = parseInt(number);
    if (isNaN(num) || num < 1 || num > 99) {
      return 'شماره پیراهن باید بین 1 تا 99 باشد';
    }
    
    return null;
  };
  
/**
 * Validate all player form fields and return errors
 * @param {Object} formData - The form data to validate
 * @returns {Object} Object containing error messages for each invalid field
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
  const numberError = validatePlayerNumber(formData.number);
  if (numberError) {
    errors.number = numberError;
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

  if (!formData.image) {
      errors.image = 'لطفا یک تصویر برای بازیکن انتخاب کنید'
  }
  
  return errors;
};

/**
 * Check if all required fields in the form have values
 * @param {Object} formData - The form data to check
 * @returns {Boolean} Whether all fields have values
 */
export const isFormValid = (formData) => {
  return (
    formData.name_fa?.trim() !== '' && 
    formData.name_en?.trim() !== '' && 
    formData.number !== '' && 
    (formData.goals !== '' || formData.goals === 0) && 
    (formData.games !== '' || formData.games === 0) && 
    formData.position !== '' && 
    formData.image !== null
  );
};
  
export default { validatePlayerNumber, validatePlayerForm, isFormValid }; 