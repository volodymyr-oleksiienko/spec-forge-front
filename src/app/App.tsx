import './App.css';

import { Provider } from 'react-redux';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import { ModalProviders } from '@/app/providers';
import { store } from '@/app/store';
import { Main } from '@/pages/Main';
import { Catcher, NotifyContainer } from '@/shared/ui';

export const App = () => {
  return (
    <Catcher>
      <Provider store={store}>
        <BrowserRouter basename={import.meta.env.VITE_APP_BASENAME}>
          <Routes>
            <Route path="*" element={<Main />} />
          </Routes>

          <NotifyContainer />
          <ModalProviders />
        </BrowserRouter>
      </Provider>
    </Catcher>
  );
};
