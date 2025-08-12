import { toast, type ToastOptions } from 'react-toastify';

const useToast = () => {
  const showSuccess = (message: string, options?: ToastOptions) => {
    toast.success(message, {
      position: "top-right",
      ...options
    });
  };

  const showError = (message: string, options?: ToastOptions) => {
    toast.error(message, {
      position: "top-right",
      ...options
    });
  };

  const showInfo = (message: string, options?: ToastOptions) => {
    toast.info(message, {
      position: "top-right",
      ...options
    });
  };

  const showWarning = (message: string, options?: ToastOptions) => {
    toast.warning(message, {
      position: "top-right",
      ...options
    });
  };

  return { showSuccess, showError, showInfo, showWarning };
};

export default useToast;