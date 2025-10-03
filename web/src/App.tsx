import { LoaderIcon } from 'lucide-react';

import { lazy, Suspense } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router';

import { AppLayout } from './components/layout/AppLayout.tsx';
import { AuthLayout } from './components/layout/AuthLayout.tsx';
import { ProtectedLayout } from './components/layout/ProtectedLayout.tsx';
import { UserProvider } from './components/UserProvider.tsx';

const HomePage = lazy(() => import('./routes/Home.tsx'));
const ProfilePage = lazy(() => import('./routes/profile/Profile.tsx'));
const MyUrlsPage = lazy(() => import('./routes/profile/MyUrls.tsx'));
const SettingsPage = lazy(() => import('./routes/profile/Settings.tsx'));
const UpdateUrlPage = lazy(() => import('./routes/url/UpdateUrl.tsx'));
const LoginPage = lazy(() => import('./routes/auth/Login.tsx'));
const RegisterPage = lazy(() => import('./routes/auth/Register.tsx'));
const RedirectUrl = lazy(() => import('./routes/Redirect.tsx'));

export default function App() {
  return (
    <BrowserRouter>
      <Suspense
        fallback={
          <div className="grid flex-1 place-content-center">
            <LoaderIcon className="animate-spin" />
          </div>
        }
      >
        <UserProvider>
          <Routes>
            <Route element={<AppLayout />}>
              <Route element={<HomePage />} index />
              <Route element={<ProtectedLayout />}>
                <Route path="profile">
                  <Route element={<ProfilePage />} index />
                  <Route element={<MyUrlsPage />} path="urls" />
                  <Route element={<SettingsPage />} path="settings" />
                </Route>
                <Route path="url">
                  <Route element={<UpdateUrlPage />} path=":url_id/update" />
                </Route>
              </Route>
            </Route>
            <Route element={<AuthLayout />} path="auth">
              <Route element={<LoginPage />} path="login" />
              <Route element={<RegisterPage />} path="register" />
            </Route>
            <Route element={<RedirectUrl />} path="r/:short_url" />
          </Routes>
        </UserProvider>
      </Suspense>
    </BrowserRouter>
  );
}
