import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import AdminLogin from "./AdminLogin";
import AdminDashboard from "./AdminDashboard";

export default function AdminApp() {
  const [session, setSession] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function loadSession() {
      const { data } = await supabase.auth.getSession();
      if (!mounted) return;
      setSession(data.session);
      if (data.session) {
        const { data: authorized, error } = await supabase.rpc("is_admin");
        if (error) console.error("Unable to verify administrator access:", error);
        setIsAdmin(authorized === true);
      }
      setChecking(false);
    }

    loadSession();
    const { data: listener } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      if (!nextSession) {
        setIsAdmin(false);
        return;
      }
      supabase.rpc("is_admin").then(({ data, error }) => {
        if (error) console.error("Unable to verify administrator access:", error);
        setIsAdmin(data === true);
      });
    });

    return () => {
      mounted = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  if (checking) {
    return <main className="flex min-h-screen items-center justify-center bg-[#fffaf0] text-sm text-slate-500">Checking access...</main>;
  }

  if (!session) return <AdminLogin />;
  if (!isAdmin) {
    return <main className="flex min-h-screen items-center justify-center bg-[#fffaf0] px-5 text-center"><div><h1 className="font-serif text-3xl text-[#3a2522]">Access restricted</h1><p className="mt-3 text-slate-600">This account is not authorized to administer the memorial.</p><button onClick={() => supabase.auth.signOut()} className="mt-6 rounded-full bg-[#a71920] px-5 py-3 text-sm font-semibold text-white">Sign out</button></div></main>;
  }

  return <AdminDashboard user={session.user} />;
}
