import { toast } from 'react-toastify';

export const notifyError = (message: string) => {
  toast.error(message);
};
