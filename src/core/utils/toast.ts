import toast from 'react-hot-toast';

export const showSuccess = (message: string) => {
  toast.success(message, {
    icon: '✅',
    style: {
      borderRadius: '10px',
      background: '#333',
      color: '#fff',
    },
  });
};

export const showError = (message: string) => {
  toast.error(message, {
    icon: '❌',
    duration: 4000,
    style: {
      borderRadius: '10px',
      background: '#EF4444',
      color: '#fff',
    },
  });
};

export const showLoading = (message: string) => {
  return toast.loading(message, {
    style: {
      borderRadius: '10px',
      background: '#3B82F6',
      color: '#fff',
    },
  });
};

export const dismissToast = (toastId: string) => {
  toast.dismiss(toastId);
};