import { Route, Routes } from "react-router-dom";
import BookingLayout from "./BookingLayout";
import ServicesPage from "./pages/ServicesPage";
import ExpertPage from "./pages/ExpertPage";
import DateTimePage from "./pages/DateTimePage";
import PaymentPage from "./pages/PaymentPage";
import ProfilePage from "./pages/ProfilePage";
import ProductsPage from "./pages/ProductsPage";
import CustomerLoginPage from "./pages/CustomerLoginPage";
import LocationPage from "./pages/LocationPage";
import CoursesPage from "./pages/CoursesPage";
import AppPage from "./pages/AppPage";
import RequireCustomerAuth from "./auth/RequireCustomerAuth";

export default function BookingRoutes() {
  return (
    <Routes>
      <Route path="/:slug" element={<BookingLayout />}>
        <Route index element={<ServicesPage />} />
        <Route path="experto" element={<ExpertPage />} />
        <Route path="fecha" element={<DateTimePage />} />
        <Route path="pago" element={<PaymentPage />} />
        <Route
          path="perfil"
          element={
            <RequireCustomerAuth>
              <ProfilePage />
            </RequireCustomerAuth>
          }
        />
        <Route path="productos" element={<ProductsPage />} />
        <Route path="ingresar" element={<CustomerLoginPage />} />
        <Route path="donde-estamos" element={<LocationPage />} />
        <Route path="cursos" element={<CoursesPage />} />
        <Route path="nuestra-app" element={<AppPage />} />
      </Route>
    </Routes>
  );
}
