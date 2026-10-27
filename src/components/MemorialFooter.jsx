export default function MemorialFooter({memorial}) {
  return (
      <footer className="bg-[#fffaf0] px-5 py-8 sm:px-8">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 text-center sm:flex-row sm:text-left">
          <p className="font-serif text-lg text-[#3a2522]">
            {memorial.name}
          </p>

          <p className="text-xs leading-5 text-slate-500">
            Created with love, in honour of a life that made a difference.
          </p>

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
