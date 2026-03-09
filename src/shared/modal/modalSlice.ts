import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export type ModalName = 'selectSpecType';

interface ModalState {
  modals: Record<string, { data?: any; isModalOpen: boolean }>;
}

const initialState: ModalState = {
  modals: {},
};

interface ModalPayload {
  name: ModalName;
  data?: any;
}

export const modalSlice = createSlice({
  name: 'modal',
  initialState,
  reducers: {
    openModal: (state, { payload: { name, data } }: PayloadAction<ModalPayload>) => {
      state.modals[name] = { isModalOpen: true, data };
    },
    closeModal: (state, { payload: { name } }: PayloadAction<ModalPayload>) => {
      const modal = state.modals[name];
      if (modal) {
        modal.isModalOpen = false;
        modal.data = null;
      }
    },
  },
});
