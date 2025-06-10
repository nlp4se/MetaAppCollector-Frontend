import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { AppsProvider } from './metaappcollector/contexts/AppsContext';
import { MetricPeriodProvider } from './metaappcollector/contexts/MetricDashboardContext';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
    <MetricPeriodProvider>
      <AppsProvider>
        <App />
      </AppsProvider>
    </MetricPeriodProvider>
);

reportWebVitals();
