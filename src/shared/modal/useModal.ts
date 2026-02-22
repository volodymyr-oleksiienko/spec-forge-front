import { useDispatch, useSelector } from 'react-redux';

import type { RootState } from '@/app/store';

import { type ModalName, modalSlice } from './modalSlice';

export interface UseModalReturn<T = unknown> {
  isModalOpen: boolean;
  data: T | null;
  openModal: (data?: T) => void;
  closeModal: () => void;
}

export const useModal = <T = unknown>(name: ModalName): UseModalReturn<T> => {
  const dispatch = useDispatch();
  const modal = useSelector((state: RootState) => state.modal.modals[name]) || {
    isModalOpen: false,
    data: null,
  };

  const openModal = (data?: any) => dispatch(modalSlice.actions.openModal({ name, data }));
  const closeModal = () => dispatch(modalSlice.actions.closeModal({ name }));

  return { isModalOpen: modal.isModalOpen, data: modal.data as T, openModal, closeModal };
};
