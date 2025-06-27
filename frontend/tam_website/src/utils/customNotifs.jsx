import React from 'react';
import { Slide, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import i18n from '../i18n';

// Custom toast configurations based on notification type
const toastConfig = {
  position: i18n.language === 'en' ? "top-left" : "top-right",
  autoClose: 5000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  rtl: i18n.language === 'fa',
};

// Success notification function
export const successNotif = (message, options = {}) => {
  const config = {
    ...toastConfig,                         
    ...options,
    style: {
      background: '#dd2c2c',
      color: '#fff',
      borderRadius: '8px',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
      padding: '1.25rem',
      minWidth: '300px',
      fontSize: '1.1rem',
    },  
    progressStyle: {
      background: '#fff',
    },
    icon: ({ theme, type }) => (
      <div
        className='w-[2rem] rounded-full bg-white'
      >
        <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"
          className='fill-black'
        />
      </svg>
      </div>
    ),
    closeButton: ({ closeToast, theme }) => (
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
        onClick={closeToast}
        className={`cursor-pointe absolute ${i18n.language == 'fa' ? 'left-[1rem]' : 'right-[1rem]'}`}
      >
        <path
          d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"
          fill="none"
          className='fill-gray-800 hover:fill-gray-950 transition-all'
        />
      </svg>
    ),
  };
  return toast.success(message, config);
};

// Error notification function
export const errorNotif = (message, options = {}) => {
  const config = { ...toastConfig, ...options };
  return toast.error(message, config);
};

// Info notification function
export const infoNotif = (message, options = {}) => {
  const config = { ...toastConfig, ...options };
  return toast.info(message, config);
};

// This function will update RTL status and position when language changes
export const updateNotifRtl = () => {
  toastConfig.rtl = i18n.language === 'fa';
  toastConfig.position = i18n.language === 'fa' ? "top-left" : "top-right";
};

// Listen to language changes and update RTL setting
i18n.on('languageChanged', () => {
  updateNotifRtl();
});

export default {
  success: successNotif,
  error: errorNotif,
  info: infoNotif,
  updateRtl: updateNotifRtl
};