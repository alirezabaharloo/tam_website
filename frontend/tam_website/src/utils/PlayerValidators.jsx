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

export default { validatePlayerNumber, isFormValid }; 