import { Ornament, SectionHeading } from './MemorialUI';

export default function LifeTribute({memorial}) {
  return (
      <section
        id="tribute"
        className="scroll-mt-8 px-5 py-20 sm:px-8 sm:py-24 lg:py-28"
      >
        <div className="mx-auto max-w-4xl">
          <SectionHeading
            eyebrow="Her story · Her legacy"
            title="A Life Well Spent"
            description="With gratitude to God Almighty, we celebrate the life and legacy of a beloved wife, mother, grandmother, sister, and aunty."
          />

          <article className="relative rounded-2xl border border-[#eadcae] bg-[#fffdf5] px-6 py-9 shadow-[0_12px_45px_rgba(127,17,24,0.05)] sm:px-12 sm:py-14 md:px-16">
            <span
              aria-hidden="true"
              className="absolute left-5 top-1 font-serif text-7xl leading-none text-[#f4d978] sm:left-8 sm:top-3 sm:text-8xl"
            >
              "
            </span>

            <div className="relative space-y-6 pt-5 font-serif text-base leading-8 text-slate-600 sm:text-lg sm:leading-9">
              {memorial.obituary.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>

            <div className="mt-10">
              <Ornament />
            </div>

            <p className="mt-7 text-center font-serif text-xl italic text-[#a71920] sm:text-2xl">
              Until we meet again.
            </p>
          </article>

          <div className="mt-12 grid gap-5 sm:grid-cols-3">
            {[
              {
                title: "Her Kindness",
                description:
                  "A gentle heart that made everyone feel seen and loved.",
                symbol: "♡",
              },
              {
                title: "Her Wisdom",
                description:
                  "Words of comfort and lessons that will guide generations.",
                symbol: "✳",
              },
              {
                title: "Her Legacy",
                description:
                  "A beautiful life whose love continues to live in us.",
                symbol: "∞",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-[#eadcae] bg-[#fff1b8] px-5 py-7 text-center"
              >
                <span
                  aria-hidden="true"
                  className="font-serif text-3xl text-[#a71920]"
                >
                  {item.symbol}
                </span>

                <h3 className="mt-3 font-serif text-xl text-[#3a2522]">
                  {item.title}
                </h3>

                <p className="mt-3 text-sm leading-6 text-slate-600">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
  );
}
