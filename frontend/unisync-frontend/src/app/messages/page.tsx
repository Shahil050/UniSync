import { MessagesPage } from "../pages/MessagesPage";
import { ProtectedRoute } from "../components/ProtectedRoute";

export default function Page() {
  return (
    <ProtectedRoute>
      <MessagesPage />
    </ProtectedRoute>
  );
}