import 'react-toastify/dist/ReactToastify.css';

import { ToastContainer } from 'react-toastify';

export const NotifyContainer = () => {
  return (
    <ToastContainer
      position="bottom-right"
      autoClose={5000}
      closeOnClick={false}
      draggable={false}
      theme="light"
    />
  );
};
