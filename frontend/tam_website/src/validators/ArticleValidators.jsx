/**
 * Article form validation utilities
 */

/**
 * Validate all article form fields and return errors
 * @param {Object} formData - The form data to validate
 * @returns {Object} Object containing error messages for each invalid field
 */
export const validateArticleForm = (formData) => {
  const errors = {};
  
  // Validate title fields
  if (!formData.title_fa?.trim()) {
    errors.title_fa = 'لطفا عنوان مقاله را به فارسی وارد کنید';
  }
  
  if (!formData.title_en?.trim()) {
    errors.title_en = 'لطفا عنوان مقاله را به انگلیسی وارد کنید';
  }
  
  // Validate body fields
  if (!formData.body_fa?.trim()) {
    errors.body_fa = 'لطفا متن مقاله را به فارسی وارد کنید';
  }
  
  if (!formData.body_en?.trim()) {
    errors.body_en = 'لطفا متن مقاله را به انگلیسی وارد کنید';
  }
  
  // Validate team field
  if (!formData.team) {
    errors.team = 'لطفا تیم را انتخاب کنید';
  }
  
  // Validate video URL for video type articles
  if (formData.type === 'VD' && !formData.video_url?.trim()) {
    errors.video_url = 'لطفا آدرس ویدیو را وارد کنید';
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
    formData.title_fa?.trim() !== '' && 
    formData.title_en?.trim() !== '' && 
    formData.body_fa?.trim() !== '' && 
    formData.body_en?.trim() !== '' && 
    formData.team !== '' &&
    formData.status !== '' &&
    formData.type !== '' &&
    (formData.type !== 'VD' || (formData.type === 'VD' && formData.video_url?.trim() !== ''))
  );
};
  
export default { validateArticleForm, isFormValid }; 