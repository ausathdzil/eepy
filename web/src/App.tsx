import { lazy } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router';

const HomePage = lazy(() => import('./routes/Home.tsx'));
const UrlPage = lazy(() => import('./routes/Url.tsx'));

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<HomePage />} index />
        <Route element={<UrlPage />} path="/u/:short_url" />
      </Routes>
    </BrowserRouter>
  );
}
