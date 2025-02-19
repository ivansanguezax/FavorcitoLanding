import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { MainLayout } from "./layout/MainLayout";
import { FormStudentsLayout } from "./layout/FormStudentsLayout";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainLayout />} />
        <Route path="/register/*" element={<FormStudentsLayout />} />
      </Routes>
    </Router>
  );
}

export default App;
