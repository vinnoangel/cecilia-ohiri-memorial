export function SectionHeading({ eyebrow, title, description }) {
  return (
    <div className="mx-auto mb-12 max-w-2xl text-center">
      <p className="mb-3 text-xs font-semibold uppercase tracking-[0.28em] text-[#a71920]">{eyebrow}</p>
      <h2 className="font-serif text-3xl leading-tight text-[#3a2522] sm:text-4xl md:text-5xl">{title}</h2>
      {description && <p className="mx-auto mt-5 max-w-xl text-base leading-7 text-slate-600">{description}</p>}
    </div>
  );
}

export function Ornament() {
  return (
    <div aria-hidden="true" className="flex items-center justify-center gap-3 text-[#c08a12]">
      <span className="h-px w-12 bg-[#e6c85a]" />
      <span className="text-lg">?</span>
      <span className="h-px w-12 bg-[#e6c85a]" />
    </div>
  );
}

export function FieldLabel({ children, htmlFor }) {
  return <label htmlFor={htmlFor} className="mb-2 block text-sm font-medium text-[#3a2522]">{children}</label>;
}
