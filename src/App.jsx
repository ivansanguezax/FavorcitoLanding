import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { MainLayout } from './layout/MainLayout';
import { FormStudentsLayout } from './layout/FormStudentsLayout';
import { HelmetProvider } from 'react-helmet-async';
import NotFound from './components/Main/NotFound';

function App() {
  return (
    <HelmetProvider>
      <Router>
        <Routes>
          <Route path="/" element={<MainLayout />} />
          <Route path="/estudiante/*" element={<FormStudentsLayout />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </HelmetProvider>
  );
}

export default App;