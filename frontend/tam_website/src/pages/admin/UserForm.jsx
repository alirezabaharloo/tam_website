import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, useParams } from 'react-router-dom';
import { fakeUsers } from '../data/fakeUsers';
import { UserFormIcons } from '../../data/Icons';

// Icons
const Icons = UserFormIcons;

const UserForm = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { userId } = useParams();

  const [formData, setFormData] = useState({
    is_author: false,
    is_superuser: false,
    is_seller: false,
    phone_number: '',
    first_name: '',
    last_name: '',
    is_active: true,
    last_login: '',
    created_date: ''
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const isEditMode = !!userId;

  useEffect(() => {
    if (!user) {
      navigate('/');
      return;
    }

    if (isEditMode) {
      // Find user data for editing
      const userToEdit = fakeUsers.find(u => u.id === userId);
      if (userToEdit) {
        setFormData({
          is_author: userToEdit.is_author || false,
          is_superuser: userToEdit.is_superuser || false,
          is_seller: userToEdit.is_seller || false,
          phone_number: userToEdit.phone || '',
          first_name: userToEdit.first_name || '',
          last_name: userToEdit.last_name || '',
          is_active: userToEdit.is_active !== false,
          last_login: userToEdit.last_login || '',
          created_date: userToEdit.created_date || ''
        });
      }
    } else {
      // Set default values for new user
      setFormData({
        is_author: false,
        is_superuser: false,
        is_seller: false,
        phone_number: '',
        first_name: '',
        last_name: '',
        is_active: true,
        last_login: '',
        created_date: new Date().toISOString().split('T')[0]
      });
    }
  }, [userId, user, navigate, isEditMode]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.phone_number.trim()) {
      newErrors.phone_number = 'فیلد اجباری است';
    } else if (!/^09\d{9}$/.test(formData.phone_number)) {
      newErrors.phone_number = 'شماره تلفن نامعتبر است';
    }

    if (!formData.first_name.trim()) {
      newErrors.first_name = 'فیلد اجباری است';
    }

    if (!formData.last_name.trim()) {
      newErrors.last_name = 'فیلد اجباری است';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Here you would make the actual API call
      // const response = await fetch('/api/users', {
      //   method: isEditMode ? 'PUT' : 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(formData)
      // });

      setShowSuccess(true);
      setTimeout(() => {
        navigate('/admin');
      }, 2000);
    } catch (error) {
      console.error('Error saving user:', error);
      setErrors({ submit: 'خطا در ذخیره کاربر' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    navigate('/admin');
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-quinary-tint-600 py-8">
      <div className="max-w-[1000px] mx-auto px-4">
        {/* Header */}
        <div className="bg-quinary-tint-800 rounded-2xl shadow-[0_0_16px_rgba(0,0,0,0.25)] p-6 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <button
                onClick={handleBack}
                className="p-2 text-secondary hover:text-primary transition-colors duration-300"
              >
                <Icons.Back isRTL={true} />
              </button>
              <div className={`${true ? 'mr-4 text-right' : 'ml-4 text-left'}`}>
                <h1 className="text-[24px] sm:text-[32px] font-bold text-primary">
                  {isEditMode ? 'ویرایش کاربر' : 'افزودن کاربر جدید'}
                </h1>
                <p className="text-[16px] sm:text-[18px] text-secondary">
                  {true ? 'فرم ویرایش کاربر' : 'فرم افزودن کاربر جدید'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="bg-quinary-tint-800 rounded-2xl shadow-[0_0_16px_rgba(0,0,0,0.25)] p-6">
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            onSubmit={handleSubmit}
            className="space-y-6"
          >
            {/* Changeable Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Phone Number */}
              <div>
                <label className={`block text-[16px] text-secondary mb-2 ${true ? 'text-right' : 'text-left'}`}>
                  شماره تلفن *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Icons.Phone className="text-secondary" />
                  </div>
                  <input
                    type="text"
                    value={formData.phone_number}
                    onChange={(e) => handleInputChange('phone_number', e.target.value)}
                    className={`w-full pl-10 pr-4 py-3 bg-quinary-tint-600 text-primary rounded-lg border-2 ${
                      errors.phone_number ? 'border-quaternary' : 'border-quinary-tint-500'
                    } focus:border-primary outline-none transition-colors duration-300`}
                    placeholder="09123456789"
                    dir="ltr"
                  />
                </div>
                {errors.phone_number && (
                  <p className="text-quaternary text-[14px] mt-1">{errors.phone_number}</p>
                )}
              </div>

              {/* First Name */}
              <div>
                <label className={`block text-[16px] text-secondary mb-2 ${true ? 'text-right' : 'text-left'}`}>
                  نام *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Icons.User className="text-secondary" />
                  </div>
                  <input
                    type="text"
                    value={formData.first_name}
                    onChange={(e) => handleInputChange('first_name', e.target.value)}
                    className={`w-full pl-10 pr-4 py-3 bg-quinary-tint-600 text-primary rounded-lg border-2 ${
                      errors.first_name ? 'border-quaternary' : 'border-quinary-tint-500'
                    } focus:border-primary outline-none transition-colors duration-300`}
                    placeholder="نام"
                  />
                </div>
                {errors.first_name && (
                  <p className="text-quaternary text-[14px] mt-1">{errors.first_name}</p>
                )}
              </div>

              {/* Last Name */}
              <div>
                <label className={`block text-[16px] text-secondary mb-2 ${true ? 'text-right' : 'text-left'}`}>
                  نام خانوادگی *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Icons.User className="text-secondary" />
                  </div>
                  <input
                    type="text"
                    value={formData.last_name}
                    onChange={(e) => handleInputChange('last_name', e.target.value)}
                    className={`w-full pl-10 pr-4 py-3 bg-quinary-tint-600 text-primary rounded-lg border-2 ${
                      errors.last_name ? 'border-quaternary' : 'border-quinary-tint-500'
                    } focus:border-primary outline-none transition-colors duration-300`}
                    placeholder="نام خانوادگی"
                  />
                </div>
                {errors.last_name && (
                  <p className="text-quaternary text-[14px] mt-1">{errors.last_name}</p>
                )}
              </div>
            </div>

            {/* Boolean Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Is Author */}
              <div className="flex items-center justify-between p-4 bg-quinary-tint-600 rounded-lg">
                <span className="text-[16px] text-secondary">نویسنده</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.is_author}
                    onChange={(e) => handleInputChange('is_author', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className={`w-11 h-6 bg-quinary-tint-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary border-2 border-quinary-tint-400 shadow-inner hover:border-quinary-tint-300`}></div>
                </label>
              </div>

              {/* Is Superuser */}
              <div className="flex items-center justify-between p-4 bg-quinary-tint-600 rounded-lg">
                <span className="text-[16px] text-secondary">مدیر سیستم</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.is_superuser}
                    onChange={(e) => handleInputChange('is_superuser', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className={`w-11 h-6 bg-quinary-tint-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary border-2 border-quinary-tint-400 shadow-inner hover:border-quinary-tint-300`}></div>
                </label>
              </div>

              {/* Is Seller */}
              <div className="flex items-center justify-between p-4 bg-quinary-tint-600 rounded-lg">
                <span className="text-[16px] text-secondary">فروشنده</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.is_seller}
                    onChange={(e) => handleInputChange('is_seller', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className={`w-11 h-6 bg-quinary-tint-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary border-2 border-quinary-tint-400 shadow-inner hover:border-quinary-tint-300`}></div>
                </label>
              </div>

              {/* Is Active */}
              <div className="flex items-center justify-between p-4 bg-quinary-tint-600 rounded-lg">
                <span className="text-[16px] text-secondary">فعال</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.is_active}
                    onChange={(e) => handleInputChange('is_active', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className={`w-11 h-6 bg-quinary-tint-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary border-2 border-quinary-tint-400 shadow-inner hover:border-quinary-tint-300`}></div>
                </label>
              </div>
            </div>

            {/* Read Only Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Last Login */}
              <div>
                <label className={`block text-[16px] text-secondary mb-2 ${true ? 'text-right' : 'text-left'}`}>
                  آخرین ورود
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Icons.Calendar className="text-secondary" />
                  </div>
                  <input
                    type="text"
                    value={formData.last_login || 'Never'}
                    disabled
                    className="w-full pl-10 pr-4 py-3 bg-quinary-tint-500 text-secondary rounded-lg border-2 border-quinary-tint-500 cursor-not-allowed"
                  />
                </div>
              </div>

              {/* Created Date */}
              <div>
                <label className={`block text-[16px] text-secondary mb-2 ${true ? 'text-right' : 'text-left'}`}>
                  تاریخ ایجاد
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Icons.Calendar className="text-secondary" />
                  </div>
                  <input
                    type="text"
                    value={formData.created_date || new Date().toLocaleDateString()}
                    disabled
                    className="w-full pl-10 pr-4 py-3 bg-quinary-tint-500 text-secondary rounded-lg border-2 border-quinary-tint-500 cursor-not-allowed"
                  />
                </div>
              </div>
            </div>

            {/* Submit Error */}
            {errors.submit && (
              <div className="flex items-center p-4 bg-quaternary/10 border border-quaternary rounded-lg">
                <Icons.XMark className="text-quaternary mr-2" />
                <span className="text-quaternary">{errors.submit}</span>
              </div>
            )}

            {/* Success Message */}
            {showSuccess && (
              <div className="flex items-center p-4 bg-primary/10 border border-primary rounded-lg">
                <Icons.Check className="text-primary mr-2" />
                <span className="text-primary">کاربر با موفقیت ذخیره شد</span>
              </div>
            )}

            {/* Form Actions */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 px-6 py-3 bg-primary text-quinary-tint-800 text-[16px] font-semibold rounded-lg hover:bg-primary-tint-200 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isLoading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-quinary-tint-800"></div>
                ) : (
                  'ذخیره کاربر'
                )}
              </button>
              <button
                type="button"
                onClick={handleBack}
                className="flex-1 px-6 py-3 border-2 border-primary text-primary text-[16px] font-semibold rounded-lg hover:bg-primary hover:text-quinary-tint-800 transition-colors duration-300"
              >
                {true ? 'انصراف' : 'انصراف'}
              </button>
            </div>
          </motion.form>
        </div>
      </div>
    </div>
  );
};

export default UserForm; 