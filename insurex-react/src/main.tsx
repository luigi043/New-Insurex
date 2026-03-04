import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';

// Initialize mock interceptor in demo mode (GitHub Pages)
if (import.meta.env.VITE_DEMO_MODE === 'true') {
  const { setupMockInterceptor } = await import('./services/mock/mockInterceptor');
  const { DEMO_AUTH_RESPONSE } = await import('./services/mock/mockData');
  setupMockInterceptor();
  // Pre-seed localStorage so the app auto-authenticates on first load
  if (!localStorage.getItem('accessToken')) {
    localStorage.setItem('accessToken', DEMO_AUTH_RESPONSE.accessToken);
    localStorage.setItem('refreshToken', DEMO_AUTH_RESPONSE.refreshToken);
    localStorage.setItem('user', JSON.stringify(DEMO_AUTH_RESPONSE.user));
  }
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
