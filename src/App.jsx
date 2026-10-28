import MemorialPage from "./MemorialPage";
import AdminApp from "./admin/AdminApp";
import { Analytics } from "@vercel/analytics/react";

export default function App() {
  return (
    <>
      {window.location.pathname.startsWith("/admin") ? (
        <AdminApp />
      ) : (
        <MemorialPage />
      )}
      <Analytics />
    </>
  );
}