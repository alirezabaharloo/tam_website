import React from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import i18n from '../i18n';

// Custom toast configurations based on notification type
const toastConfig = {
  position: "top-right",
  autoClose: 5000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  rtl: i18n.language === 'fa',
};

// Success notification function
export const successNotif = (message, options = {}) => {
  const config = { ...toastConfig, ...options };
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

// This function will update RTL status when language changes
export const updateNotifRtl = () => {
  toastConfig.rtl = i18n.language === 'fa';
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