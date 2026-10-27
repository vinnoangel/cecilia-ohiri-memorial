import { useCallback, useEffect, useMemo, useState } from "react";
import { supabase } from "../lib/supabaseClient";

const PAGE_SIZE = 8;

function formatDate(value) {
  return new Intl.DateTimeFormat("en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function statusLabel(status) {
  return status === "approved" ? "Published" : status[0].toUpperCase() + status.slice(1);
}

export default function AdminDashboard({ user }) {
  const [view, setView] = useState("overview");
  const [tributes, setTributes] = useState([]);
  const [stats, setStats] = useState({ total: 0, pending: 0, published: 0, rejected: 0 });
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("newest");
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [workingId, setWorkingId] = useState("");
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");

  const loadData = useCallback(async () => {
    setLoading(true);
    setError("");

    const [{ data: rows, error: rowsError }, { data: countRows, error: countError }] =
      await Promise.all([
        supabase
          .from("tributes")
          .select("id, name, relationship, message, created_at, is_approved, moderation_status")
          .order("created_at", { ascending: false }),
        supabase.from("tributes").select("id, is_approved, moderation_status"),
      ]);

    if (rowsError || countError) {
      console.error("Unable to load moderation data:", rowsError || countError);
      setError("Unable to load moderation data. Please try again.");
    } else {
      setTributes(rows || []);
      const all = countRows || [];
      setStats({
        total: all.length,
        pending: all.filter((item) => item.moderation_status === "pending" || (!item.moderation_status && !item.is_approved)).length,
        published: all.filter((item) => item.moderation_status === "approved" || (!item.moderation_status && item.is_approved)).length,
        rejected: all.filter((item) => item.moderation_status === "rejected").length,
      });
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(loadData, 0);
    return () => window.clearTimeout(timer);
  }, [loadData]);

  async function updateStatus(tribute, nextStatus) {
    if (!window.confirm(`${nextStatus === "approved" ? "Publish" : "Reject"} this tribute?`)) {
      return;
    }

    setWorkingId(tribute.id);
    setNotice("");
    setError("");
    const { error: updateError } = await supabase
      .from("tributes")
      .update({
        moderation_status: nextStatus,
        is_approved: nextStatus === "approved",
      })
      .eq("id", tribute.id);

    if (updateError) {
      console.error("Unable to update tribute:", updateError);
      setError("The tribute could not be updated.");
    } else {
      setNotice(nextStatus === "approved" ? "Tribute published." : "Tribute rejected.");
      await loadData();
    }

    setWorkingId("");
  }

  async function signOut() {
    await supabase.auth.signOut();
  }

  const filtered = useMemo(() => {
    let rows = tributes.filter((item) => {
      const status = item.moderation_status || (item.is_approved ? "approved" : "pending");
      if (view === "pending" && status !== "pending") return false;
      if (view === "published" && status !== "approved") return false;
      if (view === "rejected" && status !== "rejected") return false;
      const text = `${item.name} ${item.relationship} ${item.message}`.toLowerCase();
      return text.includes(query.toLowerCase());
    });
    rows = [...rows].sort((a, b) => {
      const difference = new Date(a.created_at) - new Date(b.created_at);
      return sort === "oldest" ? difference : -difference;
    });
    return rows;
  }, [tributes, view, query, sort]);

  const paged = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);
  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));

  function selectView(nextView) {
    setView(nextView);
    setPage(0);
  }

  return (
    <main className="min-h-screen bg-[#fffaf0] text-[#4a3530]">
      <header className="border-b border-[#eadcae] bg-[#fffdf5]">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 sm:px-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#a71920]">Memorial administration</p>
            <h1 className="mt-1 font-serif text-2xl text-[#3a2522]">Cecilia Ohiri</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="hidden text-sm text-slate-500 sm:block">{user.email}</span>
            <button onClick={signOut} className="rounded-full border border-[#d4a51b] px-4 py-2 text-sm text-[#7f1118] hover:bg-[#fff1b8]">Sign out</button>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-7xl gap-8 px-5 py-8 sm:px-8 lg:grid-cols-[220px_1fr]">
        <nav aria-label="Administration" className="h-fit rounded-2xl border border-[#eadcae] bg-[#fffdf5] p-3">
          {[
            ["overview", "Overview"],
            ["pending", "Pending tributes"],
            ["published", "Published tributes"],
            ["rejected", "Rejected / archived"],
          ].map(([value, label]) => (
            <button key={value} onClick={() => selectView(value)} className={`mb-1 w-full rounded-xl px-4 py-3 text-left text-sm ${view === value ? "bg-[#a71920] font-semibold text-white" : "text-[#3a2522] hover:bg-[#fff1b8]"}`}>
              {label}
            </button>
          ))}
          <a href="/" className="mt-4 block border-t border-[#eadcae] px-4 pt-4 text-sm text-[#a71920] hover:underline">View public memorial</a>
        </nav>

        <section>
          {notice && <p role="status" className="mb-5 rounded-xl bg-[#fff1b8] px-4 py-3 text-sm text-[#7f1118]">{notice}</p>}
          {error && <p role="alert" className="mb-5 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
          {view === "overview" ? (
            <Overview
              stats={stats}
              recent={tributes.slice(0, 5)}
              onSelectView={selectView}
              onPending={() => selectView("pending")}
            />
          ) : (
            <TributeList
              view={view}
              rows={paged}
              total={filtered.length}
              query={query}
              sort={sort}
              page={page}
              pageCount={pageCount}
              loading={loading}
              workingId={workingId}
              onQuery={(value) => { setQuery(value); setPage(0); }}
              onSort={setSort}
              onPage={setPage}
              onUpdate={updateStatus}
            />
          )}
        </section>
      </div>
    </main>
  );
}

function Overview({ stats, recent, onSelectView, onPending }) {
  return (
    <div>
      <div className="mb-8 flex items-end justify-between gap-4">
        <div><p className="text-sm text-slate-500">A respectful space for review</p><h2 className="mt-1 font-serif text-4xl text-[#3a2522]">Overview</h2></div>
        <button onClick={onPending} className="rounded-full bg-[#a71920] px-5 py-3 text-sm font-semibold text-white hover:bg-[#7f1118]">Review pending</button>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat label="Total tributes" value={stats.total} onClick={() => onSelectView("all")} />
        <Stat label="Pending review" value={stats.pending} accent onClick={() => onSelectView("pending")} />
        <Stat label="Published" value={stats.published} onClick={() => onSelectView("published")} />
        <Stat label="Rejected / archived" value={stats.rejected} onClick={() => onSelectView("rejected")} />
      </div>
      <div className="mt-8 rounded-2xl border border-[#eadcae] bg-[#fffdf5] p-6">
        <h3 className="font-serif text-2xl text-[#3a2522]">Recent submissions</h3>
        <div className="mt-5 divide-y divide-[#eadcae]">
          {recent.length === 0 ? <p className="py-6 text-sm text-slate-500">No submissions yet.</p> : recent.map((item) => <div key={item.id} className="flex flex-col gap-1 py-4 sm:flex-row sm:items-center sm:justify-between"><div><p className="font-semibold text-[#3a2522]">{item.name}</p><p className="text-sm text-slate-500">{item.relationship}</p></div><span className="text-sm text-slate-500">{formatDate(item.created_at)}</span></div>)}
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value, accent, onClick }) {
  return <button type="button" onClick={onClick} className={`w-full rounded-2xl border p-5 text-left transition hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-[#a71920] focus:ring-offset-2 ${accent ? "border-[#d4a51b] bg-[#fff1b8]" : "border-[#eadcae] bg-[#fffdf5]"}`}><span className="text-sm text-slate-500">{label}</span><span className="mt-2 block font-serif text-4xl text-[#3a2522]">{value}</span></button>;
}

function TributeList({ view, rows, total, query, sort, page, pageCount, loading, workingId, onQuery, onSort, onPage, onUpdate }) {
  const title = view === "all" ? "All tributes" : view === "pending" ? "Pending tributes" : view === "published" ? "Published tributes" : "Rejected / archived tributes";
  return <div>
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"><div><p className="text-sm text-slate-500">{total} tribute{total === 1 ? "" : "s"}</p><h2 className="mt-1 font-serif text-4xl text-[#3a2522]">{title}</h2></div><div className="flex gap-2"><input value={query} onChange={(event) => onQuery(event.target.value)} placeholder="Search tributes" className="min-h-11 rounded-full border border-[#eadcae] bg-[#fffdf5] px-4 text-sm outline-none focus:border-[#a71920]" /><select value={sort} onChange={(event) => onSort(event.target.value)} className="rounded-full border border-[#eadcae] bg-[#fffdf5] px-3 text-sm"><option value="newest">Newest</option><option value="oldest">Oldest</option></select></div></div>
    {loading ? <p className="rounded-2xl border border-[#eadcae] bg-[#fffdf5] p-8 text-center text-sm text-slate-500">Loading tributes...</p> : rows.length === 0 ? <p className="rounded-2xl border border-dashed border-[#d4a51b] bg-[#fffdf5] p-12 text-center text-sm text-slate-500">No tributes match this view.</p> : <div className="space-y-4">{rows.map((item) => <article key={item.id} className="rounded-2xl border border-[#eadcae] bg-[#fffdf5] p-5 shadow-[0_8px_30px_rgba(127,17,24,0.04)]"><div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between"><div><h3 className="font-semibold text-[#3a2522]">{item.name}</h3><p className="text-sm text-[#a71920]">{item.relationship}</p></div><span className="text-xs text-slate-500">{formatDate(item.created_at)}</span></div><p className="mt-4 whitespace-pre-wrap break-words leading-7 text-slate-600">{item.message}</p><div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-[#eadcae] pt-4"><span className="text-xs uppercase tracking-[0.15em] text-slate-500">{statusLabel(item.moderation_status || (item.is_approved ? "approved" : "pending"))}</span>{(view === "pending" || view === "published") && <div className="flex gap-2">{view === "pending" && <button disabled={workingId === item.id} onClick={() => onUpdate(item, "rejected")} className="rounded-full border border-[#a71920] px-4 py-2 text-sm text-[#a71920] hover:bg-red-50 disabled:opacity-50">Reject</button>}{view === "published" ? <button disabled={workingId === item.id} onClick={() => onUpdate(item, "rejected")} className="rounded-full border border-[#a71920] px-4 py-2 text-sm text-[#a71920] hover:bg-red-50 disabled:opacity-50">Archive</button> : <button disabled={workingId === item.id} onClick={() => onUpdate(item, "approved")} className="rounded-full bg-[#a71920] px-4 py-2 text-sm font-semibold text-white hover:bg-[#7f1118] disabled:opacity-50">Approve</button>}</div>}</div></article>)}</div>}
    <div className="mt-6 flex items-center justify-between text-sm text-slate-500"><button disabled={page === 0} onClick={() => onPage(page - 1)} className="rounded-full border border-[#eadcae] px-4 py-2 disabled:opacity-40">Previous</button><span>Page {page + 1} of {pageCount}</span><button disabled={page + 1 >= pageCount} onClick={() => onPage(page + 1)} className="rounded-full border border-[#eadcae] px-4 py-2 disabled:opacity-40">Next</button></div>
  </div>;
}
