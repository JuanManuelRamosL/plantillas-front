import { Navigate, useLocation, useParams } from "react-router-dom";
import { useCustomerAuth } from "./CustomerAuthContext";

export default function RequireCustomerAuth({ children }) {
  const { customer } = useCustomerAuth();
  const { slug } = useParams();
  const location = useLocation();

  if (!customer) {
    return (
      <Navigate
        to={`/${slug}/ingresar`}
        state={{ from: location.pathname }}
        replace
      />
    );
  }
  return children;
}
