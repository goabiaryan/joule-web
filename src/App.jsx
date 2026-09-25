import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import ProductHome from "./pages/ProductHome.jsx";
import IntakePage from "./pages/IntakePage.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ProductHome />} />
        <Route path="/demo" element={<Navigate to="/scoping" replace />} />
        <Route path="/scoping" element={<IntakePage variant="designPartner" />} />
        <Route path="/retainer" element={<IntakePage variant="retainer" />} />
        <Route path="/print" element={<Navigate to="/" replace />} />
        <Route path="/print/advisory" element={<Navigate to="/" replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
