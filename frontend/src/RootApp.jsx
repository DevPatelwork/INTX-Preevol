import './style/app.css';

import { Suspense, lazy } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { App } from 'antd';
import store from '@/redux/store';
import PageLoader from '@/components/PageLoader';

const PreevolOs = lazy(() => import('./apps/PreevolOs'));

export default function RoutApp() {
  return (
    <BrowserRouter>
      <Provider store={store}>
        <App>
          <Suspense fallback={<PageLoader />}>
            <PreevolOs />
          </Suspense>
        </App>
      </Provider>
    </BrowserRouter>
  );
}
