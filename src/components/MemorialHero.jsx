export default function MemorialHero({memorial}) {
  return (
      <section
        id="home"
        className="relative px-5 pb-20 pt-14 sm:px-8 sm:pb-24 sm:pt-20 lg:pb-28 lg:pt-24"
      >
        <div className="mx-auto max-w-7xl">
          <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-20">
            {/* Text */}
            <div className="order-2 text-center lg:order-1 lg:text-left">
              <p               className="mb-6 text-xs font-semibold uppercase tracking-[0.32em] text-[#a71920] sm:text-sm">
                In loving memory
              </p>

              <h1 className="font-serif text-4xl leading-[1.16] text-[#3a2522] sm:text-5xl md:text-6xl xl:text-7xl">
                Forever in Our
                <br />
                Hearts
                <span className="mt-2 block italic text-[#a71920]">
                  {memorial.name}
                </span>
              </h1>

              <div className="mb-7 mt-8 flex items-center justify-center gap-4 lg:justify-start">
                <span className="h-px w-10 bg-[#d4a51b]" />

                <p className="font-serif text-lg tracking-wide text-slate-600 sm:text-xl">
                  {memorial.birthDate} – {memorial.passingDate}
                </p>

                <span className="h-px w-10 bg-[#d4a51b]" />
              </div>

              <p className="mx-auto max-w-xl font-serif text-lg italic leading-8 text-slate-600 sm:text-xl lg:mx-0">
                "Those we love never truly leave us. They live on in the
                kindness they shared, the memories they created, and the love
                they planted in our hearts."
              </p>

              <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center lg:justify-start">
                <a
                  href="#tribute"
                  className="inline-flex min-h-12 items-center justify-center rounded-full bg-[#a71920] px-7 py-3 text-sm font-medium text-white transition hover:bg-[#7f1118] focus:outline-none focus:ring-2 focus:ring-[#a71920] focus:ring-offset-2"
                >
                  Remember Her Life
                  <span className="ml-3" aria-hidden="true">
                    ↓
                  </span>
                </a>

                <a
                  href="#guestbook"
                  className="inline-flex min-h-12 items-center justify-center rounded-full border border-[#d4a51b] px-7 py-3 text-sm font-medium text-[#7f1118] transition hover:bg-[#fff1b8]"
                >
                  Share a Memory
                </a>
              </div>

              <div className="mt-12 flex items-center justify-center gap-3 text-sm text-slate-500 lg:justify-start">
                <span className="text-lg text-[#d4a51b]" aria-hidden="true">
                  ♡
                </span>
                Forever loved. Never forgotten.
              </div>
            </div>

            {/* Portrait */}
            <div className="order-1 mx-auto w-full max-w-md lg:order-2 lg:max-w-none">
              <div className="relative mx-auto max-w-107.5">
                <div
                  aria-hidden="true"
                  className="absolute -right-3 -top-3 h-full w-full rounded-t-[48%] border border-[#e6c85a] sm:-right-5 sm:-top-5"
                />

                <div className="relative overflow-hidden rounded-t-[48%] border-8 border-[#fff7d6] bg-[#fff1b8] shadow-[0_20px_65px_rgba(127,17,24,0.14)] sm:border-[12px]">
                  <img
                    src={memorial.portrait}
                    alt={`Portrait in loving memory of ${memorial.name}`}
                    className="aspect-[4/5] w-full object-contain object-center"
                    fetchPriority="high"
                  />

                </div>

                <div
                  aria-hidden="true"
                  className="absolute -bottom-6 -left-6 flex h-16 w-16 items-center justify-center rounded-full border border-[#e6c85a] bg-[#fffaf0] font-serif text-3xl text-[#a71920] sm:h-20 sm:w-20"
                >
                  ♡
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
  );
}
