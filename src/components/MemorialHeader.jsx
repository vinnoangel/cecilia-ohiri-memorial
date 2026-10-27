export default function MemorialHeader({ memorial }) {
  return (
      <header className="relative z-10 border-b border-[#eadcae] bg-[#fffaf0]/95">
        <nav
          aria-label="Main navigation"
          className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 sm:px-8 lg:px-12"
        >
          <a
            href="#home"
            className="flex items-center gap-3 text-[#3a2522]"
            aria-label="Return to memorial home"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-full border border-[#d4a51b] font-serif text-xl">
              G
            </span>

            <span>
              <span className="block font-serif text-lg leading-tight">
                {memorial.name}
              </span>
              <span className="mt-1 block text-[10px] uppercase tracking-[0.2em] text-slate-500">
                A lasting tribute
              </span>
            </span>
          </a>

          <div className="hidden items-center gap-7 text-sm text-slate-600 md:flex">
            <a href="#tribute" className="transition hover:text-[#a71920]">
              Her Life
            </a>

            <a href="#service" className="transition hover:text-[#a71920]">
              Service Details
            </a>

            <a href="#guestbook" className="transition hover:text-[#a71920]">
              Guestbook
            </a>
          </div>

          <a
            href="#guestbook"
            className="rounded-full border border-[#d4a51b] px-4 py-2.5 text-sm font-medium text-[#7f1118] transition hover:bg-[#fff1b8] sm:px-5"
          >
            Leave a Tribute
          </a>
        </nav>
      </header>
  );
}
