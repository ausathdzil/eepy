import { lazy } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router';

import { AppLayout } from './components/layout/AppLayout.tsx';

const HomePage = lazy(() => import('./routes/Home.tsx'));
const UrlPage = lazy(() => import('./routes/Url.tsx'));
const LoginPage = lazy(() => import('./routes/auth/Login.tsx'));
const RegisterPage = lazy(() => import('./routes/auth/Register.tsx'));

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route element={<HomePage />} index />
          <Route element={<UrlPage />} path="u/:short_url" />
        </Route>

        <Route path="auth">
          <Route element={<LoginPage />} path="login" />
          <Route element={<RegisterPage />} path="register" />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
