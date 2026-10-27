export default function MemorialFooter({memorial}) {
  return (
      <footer className="bg-[#fffaf0] px-5 py-8 sm:px-8">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 text-center sm:flex-row sm:text-left">
      

          <div className="text-center text-xs leading-5 text-slate-500 sm:text-left">
            <p className="mt-2 text-sm font-semibold uppercase tracking-[0.12em] text-[#3a2522]">
           

              Copyright © 2026{' '}
              <a 
                href="https://redjic.com" // Replace with the actual URL of Redjic Limited
                target="_blank" 
                rel="noopener noreferrer"
                className="underline font-bold text-[#a71920] hover:text-stone-700 transition-colors duration-200"
              >
                Redjic Limited
              </a>
              . All rights reserved.
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
