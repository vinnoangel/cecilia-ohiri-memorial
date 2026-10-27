export default function ClosingTribute({memorial}) {
  return (
      <section className="bg-[#7f1118] px-5 py-16 text-center text-white sm:px-8 sm:py-20">
        <div className="mx-auto max-w-3xl">
          <span
            aria-hidden="true"
            className="font-serif text-5xl text-white/75"
          >
            ♡
          </span>

          <h2 className="mt-5 font-serif text-3xl leading-tight sm:text-4xl md:text-5xl">
            Her Love Lives On
          </h2>

          <p className="mx-auto mt-5 max-w-xl font-serif text-lg italic leading-8 text-white/85 sm:text-xl">
            "A mother's love leaves an imprint on our hearts that time can
            never erase."
          </p>

          <div className="mx-auto my-8 h-px w-16 bg-white/40" />

          <p className="text-xs uppercase tracking-[0.28em] text-white/75">
            Forever in our hearts
          </p>

          <p className="mt-3 font-serif text-xl">
            {memorial.name}
          </p>
        </div>
      </section>
  );
}
