import { SectionHeading } from './MemorialUI';

export default function FuneralService({memorial}) {
  return (
      <section
        id="service"
        className="scroll-mt-8 bg-[#fff1b8] px-5 py-20 sm:px-8 sm:py-24 lg:py-28"
      >
        <div className="mx-auto max-w-5xl">
          <SectionHeading
            eyebrow="Burial arrangements"
            title="A Time to Gather"
            description="Family and friends are invited to join us in prayer, remembrance, and gratitude as we celebrate Cecilia's life."
          />

          <div className="overflow-hidden rounded-3xl border border-[#eadcae] bg-[#fffdf5] shadow-[0_18px_60px_rgba(127,17,24,0.08)]">
            <div className="grid lg:grid-cols-[0.8fr_1.2fr]">
              {/* Card sidebar */}
              <div className="flex flex-col items-center justify-center bg-[#a71920] px-7 py-12 text-center text-white sm:px-12 lg:py-16">
                <div
                  aria-hidden="true"
                  className="flex h-20 w-20 items-center justify-center rounded-full border border-white/30 font-serif text-4xl"
                >
                  ♡
                </div>

                <p className="mt-7 text-xs uppercase tracking-[0.28em] text-white/75">
                  Burial arrangements
                </p>

                <h3 className="mt-4 font-serif text-3xl leading-tight sm:text-4xl">
                  Together in
                  <br />
                  Remembrance
                </h3>

                <div className="my-7 h-px w-16 bg-white/40" />

                <p className="max-w-xs text-sm leading-7 text-white/85">
                  Your presence, prayers, and memories will be a source of
                  comfort to our family during this time.
                </p>
              </div>

              {/* Event details */}
              <div className="px-6 py-9 sm:px-10 sm:py-12 lg:px-12 lg:py-14">
                <div className="space-y-7">
                  <div className="flex gap-4">
                    <div
                      aria-hidden="true"
                      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#fff1b8] text-xl text-[#a71920]"
                    >
                      ♧
                    </div>

                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                        Date
                      </p>

                      <p className="mt-2 font-serif text-lg text-[#3a2522] sm:text-xl">
                        {memorial.funeral.date}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div
                      aria-hidden="true"
                      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#fff1b8] text-xl text-[#a71920]"
                    >
                      ◷
                    </div>

                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                        Time
                      </p>

                      <p className="mt-2 font-serif text-lg text-[#3a2522] sm:text-xl">
                        {memorial.funeral.time}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div
                      aria-hidden="true"
                      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#fff1b8] text-xl text-[#a71920]"
                    >
                      ⌖
                    </div>

                    <div className="min-w-0">
                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                        Venue
                      </p>

                      <p className="mt-2 font-serif text-lg text-[#3a2522] sm:text-xl">
                        {memorial.funeral.venue}
                      </p>

                      <p className="mt-2 text-sm leading-6 text-slate-600">
                        {memorial.funeral.address}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="my-9 border-t border-[#ece8de]" />

                <a
                  href={memorial.funeral.notice}
                  target="_blank"
                  rel="noreferrer"
                  className="flex min-h-12 w-full items-center justify-center gap-3 rounded-full bg-[#a71920] px-5 py-3 text-center text-sm font-medium text-white transition hover:bg-[#7f1118] focus:outline-none focus:ring-2 focus:ring-[#a71920] focus:ring-offset-2"
                >
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    className="h-5 w-5"
                  >
                    <rect x="3" y="5" width="13" height="14" rx="2" />
                    <path d="m16 10 5-3v10l-5-3" />
                  </svg>

                  View the Obituary Notice
                  <span aria-hidden="true">↗</span>
                </a>

                <p className="mt-3 text-center text-xs leading-5 text-slate-500">
                  Please keep the Ohiri family in your prayers during this
                  time of remembrance.
                </p>
              </div>
            </div>

            {/* Guest instructions */}
            <div className="border-t border-[#eadcae] bg-[#fffaf0] px-6 py-8 sm:px-10 lg:px-12">
              <h4 className="font-serif text-xl text-[#3a2522]">
                Service schedule
              </h4>

              <div className="mt-5 grid gap-4 md:grid-cols-3">
                {memorial.instructions.map((instruction, index) => {
                  const [heading, ...rest] = instruction.split(":");

                  return (
                    <div key={index} className="flex gap-3">
                      <span
                        aria-hidden="true"
                        className="mt-0.5 text-[#a71920]"
                      >
                        ✳
                      </span>

                      <p className="text-sm leading-6 text-slate-600">
                        <span className="font-semibold text-[#3a2522]">
                          {heading}:
                        </span>{" "}
                        {rest.join(":").trim()}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>
  );
}
