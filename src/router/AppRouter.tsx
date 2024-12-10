import { BrowserRouter as Router, Routes, Route } from "react-router-dom"; // Importar react-router-dom
import { AdminDashboardPage } from "../pages/Admin/AdminDashboardPage"; // Componente de Dashboard
import { GestionSocios } from "../pages/Admin/GestionSocio";
export const AppRouter = () => {
  return (
    <Router>
      <Routes>
        <Route path="/socios" element={<GestionSocios />} />
      </Routes>
    </Router>
  );
};
