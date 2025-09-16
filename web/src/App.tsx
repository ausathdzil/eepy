import { lazy } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router';

const HomePage = lazy(() => import('./routes/Home'));

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<HomePage />} index />
      </Routes>
    </BrowserRouter>
  );
}
