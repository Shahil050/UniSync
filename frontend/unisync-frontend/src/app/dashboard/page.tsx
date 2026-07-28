import { DashboardPage } from "../pages/DashboardPage";
import { ProtectedRoute } from "../components/ProtectedRoute";

export default function Page() {
  return (
    <ProtectedRoute>
      <DashboardPage />
    </ProtectedRoute>
  );
}