import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import ProductHome from "./pages/ProductHome.jsx";
import IntakePage from "./pages/IntakePage.jsx";
import PrivacyPage from "./pages/PrivacyPage.jsx";
import RouteAnalytics from "./RouteAnalytics.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <RouteAnalytics />
      <Routes>
        <Route path="/" element={<ProductHome />} />
        <Route path="/demo" element={<Navigate to="/scoping" replace />} />
        <Route path="/scoping" element={<IntakePage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="/retainer" element={<Navigate to="/scoping" replace />} />
        <Route path="/print" element={<Navigate to="/" replace />} />
        <Route path="/print/advisory" element={<Navigate to="/" replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
