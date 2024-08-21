import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';
import '@mantine/notifications/styles.css';

import { BrowserRouter } from 'react-router-dom';
import {createTheme, MantineProvider} from '@mantine/core';

import { Provider } from 'react-redux';
import store from './Store';
import { BackendBaseUrl } from './Arch/Urls';
import axios from 'axios';
import { Keys } from './Arch/keys';
import { verifyAsync } from './state/UserState';
import { setSelectedPage } from './state/DashboardState';
import { Notifications } from '@mantine/notifications';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

const theme = createTheme({
    /** Put your mantine theme override here */
    colors:{
        red: [
            "#ffe9f3",
            "#ffd2e0",
            "#f9a2be",
            "#f4709a",
            "#ef457c",
            "#ed2b68",
            "#ed1b5f",
            "#d30d4f",
            "#be0145",
            "#a7003a"
        ],
        purple: [
            "#fbeefb",
            "#f2d9f3",
            "#e6b0e8",
            "#db85de",
            "#d060d4",
            "#ca4acf",
            "#c73ecd",
            "#b030b6",
            "#9d2aa2",
            "#89208e"
        ],
        pink: [
            "#ffe8f9",
            "#ffcfeb",
            "#ff9cd3",
            "#fe65ba",
            "#fd3aa6",
            "#fd1f98",
            "#fe1092",
            "#e3007e",
            "#cb0070",
            "#b20061"
        ],

    }
});


store.dispatch(verifyAsync())
store.dispatch(setSelectedPage(1))


root.render(
  <React.StrictMode>
      <BrowserRouter basename="/inventory-management">
          <Provider store={store}>
              <MantineProvider theme={theme} defaultColorScheme="dark" >
                  <Notifications position="top-right"/>
                  <App />
              </MantineProvider>
          </Provider>
      </BrowserRouter>
  </React.StrictMode>
);


