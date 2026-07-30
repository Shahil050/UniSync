import { ProfilePage } from "../pages/ProfilePage";
import { ProtectedRoute } from "../components/ProtectedRoute";

export default function Page() {
  return (
    <ProtectedRoute>
      <ProfilePage />
    </ProtectedRoute>
  );
}