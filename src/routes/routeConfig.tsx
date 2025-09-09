import { createBrowserRouter } from 'react-router-dom';
import ErrorPage from './ErrorPage';

import App from '../utils/App';
import Home from '../components/pages/Home';
import History from '../components/pages/History';



export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: 'history',
        element: <History />,
      },
    ],
  },
]);
