import React from 'react';
import { motion } from 'framer-motion';
import ImagePicker from '../../UI/ImagePicker';
import FormActions from '../../UI/FormActions';

const PlayerFormFields = ({
  activeTab,
  tabs,
  tabErrors,
  onTabChange,
  formData,
  errors,
  onInputChange,
  onImageChange,
  positionOptions,
  imagePreview,
  onSubmit,
  onCancel,
  isSubmitting,
  isSubmitDisabled,
  submitText,
}) => {
  const flashingDotCSS = `
    @keyframes flash {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.3; }
    }
  `;

  return (
    <>
      <style>{flashingDotCSS}</style>
      <motion.form
        onSubmit={onSubmit}
        className="space-y-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="space-y-6">
          <div className="flex border-b border-quinary-tint-500 justify-between">
            <div>
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => onTabChange(tab.id)}
                  className={`px-6 py-3 text-[16px] font-medium transition-all duration-300 border-b-2 relative ${
                    activeTab === tab.id
                      ? 'text-primary border-primary'
                      : 'text-secondary border-transparent hover:text-primary hover:border-quinary-tint-400'
                  }`}
                >
                  {tab.label}
                  {activeTab !== tab.id && tabErrors[tab.id] && (
                    <span
                      className="absolute -top-1 -right-1 w-3 h-3 bg-quaternary rounded-full"
                      style={{ animation: 'flash 1s infinite ease-in-out' }}
                    />
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            {activeTab === 'persian' && (
              <div>
                <label className="block text-[16px] text-secondary mb-2 text-right">
                  نام بازیکن (فارسی) *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={formData.name_fa}
                    onChange={(e) => onInputChange('name_fa', e.target.value)}
                    className={`w-full px-4 py-3 bg-quinary-tint-600 text-primary rounded-lg border-2 ${
                      errors.name_fa ? 'border-quaternary' : 'border-quinary-tint-500'
                    } focus:border-primary outline-none transition-colors duration-300`}
                    placeholder="نام بازیکن به فارسی"
                    dir="rtl"
                  />
                </div>
                {errors.name_fa && (
                  <p className="text-quaternary text-[14px] mt-1 text-right">{errors.name_fa}</p>
                )}
              </div>
            )}

            {activeTab === 'english' && (
              <div>
                <label className="block text-[16px] text-secondary mb-2 text-right">
                  نام بازیکن (انگلیسی) *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={formData.name_en}
                    onChange={(e) => onInputChange('name_en', e.target.value)}
                    className={`w-full px-4 py-3 bg-quinary-tint-600 text-primary rounded-lg border-2 ${
                      errors.name_en ? 'border-quaternary' : 'border-quinary-tint-500'
                    } focus:border-primary outline-none transition-colors duration-300`}
                    placeholder="Player name in English"
                    dir="ltr"
                  />
                </div>
                {errors.name_en && (
                  <p className="text-quaternary text-[14px] mt-1 text-right">{errors.name_en}</p>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-[16px] text-secondary mb-2 text-right">
              شماره پیراهن *
            </label>
            <div className="relative">
              <input
                type="number"
                value={formData.number}
                onChange={(e) => onInputChange('number', e.target.value)}
                className={`w-full px-4 py-3 bg-quinary-tint-600 text-primary rounded-lg border-2 ${
                  errors.number ? 'border-quaternary' : 'border-quinary-tint-500'
                } focus:border-primary outline-none transition-colors duration-300`}
                placeholder="شماره پیراهن (1-99)"
                min="1"
                max="99"
              />
            </div>
            {errors.number && (
              <p className="text-quaternary text-[14px] mt-1 text-right">{errors.number}</p>
            )}
          </div>

          <div>
            <label className="block text-[16px] text-secondary mb-2 text-right">
              پست بازیکن *
            </label>
            <div className="relative">
              <select
                value={formData.position}
                onChange={(e) => onInputChange('position', e.target.value)}
                className={`w-full px-4 py-3 bg-quinary-tint-600 text-primary rounded-lg border-2 ${
                  errors.position ? 'border-quaternary' : 'border-quinary-tint-500'
                } focus:border-primary outline-none transition-colors duration-300`}
              >
                <option value="">انتخاب پست بازیکن</option>
                {Object.entries(positionOptions).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
            {errors.position && (
              <p className="text-quaternary text-[14px] mt-1 text-right">{errors.position}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-[16px] text-secondary mb-2 text-right">
              تعداد گل *
            </label>
            <div className="relative">
              <input
                type="number"
                value={formData.goals}
                onChange={(e) => onInputChange('goals', e.target.value)}
                className={`w-full px-4 py-3 bg-quinary-tint-600 text-primary rounded-lg border-2 ${
                  errors.goals ? 'border-quaternary' : 'border-quinary-tint-500'
                } focus:border-primary outline-none transition-colors duration-300`}
                placeholder="تعداد گل"
                min="0"
              />
            </div>
            {errors.goals && (
              <p className="text-quaternary text-[14px] mt-1 text-right">{errors.goals}</p>
            )}
          </div>

          <div>
            <label className="block text-[16px] text-secondary mb-2 text-right">
              تعداد بازی *
            </label>
            <div className="relative">
              <input
                type="number"
                value={formData.games}
                onChange={(e) => onInputChange('games', e.target.value)}
                className={`w-full px-4 py-3 bg-quinary-tint-600 text-primary rounded-lg border-2 ${
                  errors.games ? 'border-quaternary' : 'border-quinary-tint-500'
                } focus:border-primary outline-none transition-colors duration-300`}
                placeholder="تعداد بازی"
                min="0"
              />
            </div>
            {errors.games && (
              <p className="text-quaternary text-[14px] mt-1 text-right">{errors.games}</p>
            )}
          </div>
        </div>

        <ImagePicker
          imagePreview={imagePreview}
          onImageChange={onImageChange}
          error={errors.image}
          label="تصویر بازیکن"
        />

        <FormActions
          onCancel={onCancel}
          onSubmit={onSubmit}
          isSubmitting={isSubmitting}
          isSubmitDisabled={isSubmitDisabled}
          submitText={submitText}
        />
      </motion.form>
    </>
  );
};

export default PlayerFormFields;
