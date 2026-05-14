import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AppLayout from "./components/layout/AppLayout";
import LearnPage from "./pages/LearnPage";
import ComparePage from "./pages/ComparePage";
import CodeViewerPage from "./pages/CodeViewerPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route index element={<Navigate to="/learn" replace />} />
          <Route path="learn" element={<LearnPage />} />
          <Route path="compare" element={<ComparePage />} />
          <Route path="code-viewer" element={<CodeViewerPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
