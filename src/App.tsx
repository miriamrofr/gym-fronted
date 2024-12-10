import { AdminDashboardPage } from "./pages/Admin/AdminDashboardPage";
import { Navigate, Route, Routes } from "react-router-dom";
import { GestionEntrenador } from "./pages/Admin/GestionEntrenador";
import { GestionSocios } from "./pages/Admin/GestionSocio";
import { InfoGimnasio } from "./pages/Admin/InfoGimnasio";
import { GestionMaterial } from "./pages/Admin/GestionMaterial";
import { GestionClaseGuiada } from "./pages/Admin/GestionClaseGuiada";
import { GestionReservaPista } from "./pages/Admin/GestionReservaPista";
import { GestionEntrenamientos } from "./pages/Admin/GestionEntrenamientos";
import { PerfilAdmin } from "./pages/Admin/PerfilAdmin";

function App() {
  return (
    <Routes>
      <Route path="/" element={<AdminDashboardPage />}>
        <Route index element={<Navigate to="info-gimnasio" replace />} />
        <Route path="info-gimnasio" element={<InfoGimnasio />} />
        <Route path="socios" element={<GestionSocios />} />
        <Route path="empleados" element={<GestionEntrenador />} />
        <Route path="materiales" element={<GestionMaterial />} />
        <Route path="clases-guiadas" element={<GestionClaseGuiada />} />
        <Route path="reserva-pistas" element={<GestionReservaPista />} />
        <Route path="entrenamientos" element={<GestionEntrenamientos />} />
        <Route path="perfil" element={<PerfilAdmin />} />
        <Route path="logout" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}

export default App;
