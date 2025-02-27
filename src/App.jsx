import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { MainLayout } from './layout/MainLayout';
import { FormStudentsLayout } from './layout/FormStudentsLayout';
import { HelmetProvider } from 'react-helmet-async';

function App() {
  return (
    <HelmetProvider>
      <Router>
        <Routes>
          <Route path="/" element={<MainLayout />} />
          <Route path="/estudiantes/*" element={<FormStudentsLayout />} />
        </Routes>
      </Router>
    </HelmetProvider>
  );
}

export default App;