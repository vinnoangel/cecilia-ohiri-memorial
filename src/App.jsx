import MemorialPage from "./MemorialPage";
import AdminApp from "./admin/AdminApp";

export default function App() {
  return window.location.pathname.startsWith("/admin") ? (
    <AdminApp />
  ) : (
    <MemorialPage />
  );
}