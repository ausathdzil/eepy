import { lazy, Suspense } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router';

import { AppLayout } from './components/layout/AppLayout.tsx';
import { UserProvider } from './components/UserProvider.tsx';

const HomePage = lazy(() => import('./routes/Home.tsx'));
const UrlPage = lazy(() => import('./routes/Url.tsx'));
const LoginPage = lazy(() => import('./routes/auth/Login.tsx'));
const RegisterPage = lazy(() => import('./routes/auth/Register.tsx'));

export default function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={null}>
        <UserProvider>
          <Routes>
            <Route element={<AppLayout />}>
              <Route element={<HomePage />} index />
            </Route>

            <Route element={<UrlPage />} path="u/:short_url" />

            <Route path="auth">
              <Route element={<LoginPage />} path="login" />
              <Route element={<RegisterPage />} path="register" />
            </Route>
          </Routes>
        </UserProvider>
      </Suspense>
    </BrowserRouter>
  );
}
