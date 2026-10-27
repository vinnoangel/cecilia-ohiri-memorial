export default function MemorialFooter({memorial}) {
  return (
      <footer className="bg-[#fffaf0] px-5 py-8 sm:px-8">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 text-center sm:flex-row sm:text-left">
          <p className="font-serif text-lg text-[#3a2522]">
            {memorial.name}
          </p>

          <div className="text-center text-xs leading-5 text-slate-500 sm:text-left">
            <p>Created with love, in honour of a life that made a difference.</p>
            <p className="mt-2 text-sm font-semibold uppercase tracking-[0.12em] text-[#3a2522]">
              Website powered by{" "}
              <a
                href="https://redjic.com/"
                target="_blank"
                rel="noreferrer"
                className="font-bold text-[#a71920] underline decoration-2 underline-offset-4 transition hover:text-[#7f1118]"
              >
                Redjic Limited
              </a>
            </p>
          </div>

          <a
            href="#home"
            className="text-sm text-[#a71920] underline-offset-4 transition hover:underline"
          >
            Back to top ↑
          </a>
        </div>
      </footer>
  );
}
