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
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { HomePage } from "./pages/HomePage";
import { LoginPage } from "./pages/LoginPage";
import SocioDashboardPage from "./pages/Socio/SocioDashboardPage";
import { UserProvider } from "./context/UseAuth"; // Ajusta la ruta a donde se encuentra tu archivo
import ProtectedRoute from "./routes/ProtectedRoute";

function App() {
  return (
    <UserProvider>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        {/*Ruta protegida*/}
        <Route
          path="/admin"
          element={
            <ProtectedRoute requiredRole="Admin">
              <AdminDashboardPage />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="info-gimnasio" replace />} />
          <Route path="info-gimnasio" element={<InfoGimnasio />} />
          <Route path="socios" element={<GestionSocios />} />
          <Route path="entrenadores" element={<GestionEntrenador />} />
          <Route path="materiales" element={<GestionMaterial />} />
          <Route path="clases-guiadas" element={<GestionClaseGuiada />} />
          <Route path="reserva-pistas" element={<GestionReservaPista />} />
          <Route path="entrenamientos" element={<GestionEntrenamientos />} />
          <Route path="perfil" element={<PerfilAdmin />} />
          <Route path="logout" element={<Navigate to="/" replace />} />
        </Route>
        <Route
          path="/socio"
          element={
            <ProtectedRoute requiredRole="Socio">
              <SocioDashboardPage />
            </ProtectedRoute>
          }
        ></Route>{" "}
        <Route path="*" element={<h1>NO SE ENCUENTRA PAGINA </h1>}></Route>
      </Routes>

      <ToastContainer position="top-right" autoClose={5000} hideProgressBar />
    </UserProvider>
  );
}

export default App;
