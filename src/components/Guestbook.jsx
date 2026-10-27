import { FieldLabel, SectionHeading } from './MemorialUI';

export default function Guestbook({memorial, messages, form, error, success, handleChange, handleSubmit, formatTimestamp}) {
  return (
      <section
        id="guestbook"
        className="scroll-mt-8 px-5 py-20 sm:px-8 sm:py-24 lg:py-28"
      >
        <div className="mx-auto max-w-6xl">
          <SectionHeading
            eyebrow="Words from the heart"
            title="Share a Memory"
            description="If she touched your life in any way, we invite you to leave a message, share a memory, or offer words of comfort to the family."
          />

          <div className="grid items-start gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-14">
            {/* Form */}
            <div className="rounded-3xl border border-[#eadcae] bg-[#fffdf5] p-6 shadow-[0_15px_45px_rgba(127,17,24,0.05)] sm:p-9">
              <div className="mb-7">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#a71920]">
                  Guestbook
                </p>

                <h3 className="mt-3 font-serif text-2xl text-[#3a2522] sm:text-3xl">
                  Leave a Loving Tribute
                </h3>

                <p className="mt-3 text-sm leading-6 text-slate-600">
                  Every message is a gift. Thank you for helping us celebrate
                  her life and preserve her memory.
                </p>
              </div>

              <form onSubmit={handleSubmit} noValidate>
                <div className="space-y-5">
                  <div>
                    <FieldLabel htmlFor="name">Your Name</FieldLabel>

                    <input
                      id="name"
                      name="name"
                      type="text"
                      autoComplete="name"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="Enter your full name"
                      maxLength={100}
                      required
                      className="min-h-12 w-full rounded-xl border border-[#eadcae] bg-[#fffaf0] px-4 py-3 text-base text-[#4a3530] outline-none transition placeholder:text-slate-400 focus:border-[#a71920] focus:ring-2 focus:ring-[#a71920]/20"
                    />
                  </div>

                  <div>
                    <FieldLabel htmlFor="relationship">
                      Your Relationship to {memorial.name.split(" ")[0]}
                    </FieldLabel>

                    <select
                      id="relationship"
                      name="relationship"
                      value={form.relationship}
                      onChange={handleChange}
                      required
                      className="min-h-12 w-full rounded-xl border border-[#eadcae] bg-[#fffaf0] px-4 py-3 text-base text-[#4a3530] outline-none transition focus:border-[#a71920] focus:ring-2 focus:ring-[#a71920]/20"
                    >
                      <option value="" disabled>
                        Select your relationship
                      </option>
                      <option value="Daughter">Daughter</option>
                      <option value="Son">Son</option>
                      <option value="Grandchild">Grandchild</option>
                      <option value="Sibling">Sibling</option>
                      <option value="In-law">In-law</option>
                      <option value="Relative">Relative</option>
                      <option value="Friend">Friend</option>
                      <option value="Church member">Church member</option>
                      <option value="Colleague">Colleague</option>
                      <option value="Neighbour">Neighbour</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div>
                    <FieldLabel htmlFor="message">
                      Your Message or Memory
                    </FieldLabel>

                    <textarea
                      id="message"
                      name="message"
                      value={form.message}
                      onChange={handleChange}
                      placeholder="Share a cherished memory, words of comfort, or a special moment you remember..."
                      rows={6}
                      maxLength={2000}
                      required
                      className="w-full resize-y rounded-xl border border-[#eadcae] bg-[#fffaf0] px-4 py-3 text-base leading-7 text-[#4a3530] outline-none transition placeholder:text-slate-400 focus:border-[#a71920] focus:ring-2 focus:ring-[#a71920]/20"
                    />

                    <p className="mt-2 text-right text-xs text-slate-500">
                      {form.message.length}/2000 characters
                    </p>
                  </div>
                </div>

                {error && (
                  <p
                    role="alert"
                    className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700"
                  >
                    {error}
                  </p>
                )}

                {success && (
                  <p
                    role="status"
                    className="mt-4 rounded-xl bg-[#fff1b8] px-4 py-3 text-sm text-[#7f1118]"
                  >
                    Your tribute has been added to the guestbook. Thank you
                    for sharing your memory.
                  </p>
                )}

                <button
                  type="submit"
                  className="mt-6 flex min-h-12 w-full items-center justify-center gap-3 rounded-full bg-[#a71920] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#7f1118] focus:outline-none focus:ring-2 focus:ring-[#a71920] focus:ring-offset-2"
                >
                  Share Your Tribute
                  <span aria-hidden="true">♡</span>
                </button>

                <p className="mt-4 text-center text-xs leading-5 text-slate-500">
                  Your words help keep her memory alive.
                </p>
              </form>
            </div>

            {/* Messages feed */}
            <div>
              <div className="mb-6 flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#a71920]">
                    Messages of love
                  </p>

                  <h3 className="mt-2 font-serif text-2xl text-[#3a2522] sm:text-3xl">
                    Tributes & Memories
                  </h3>
                </div>

                <span className="shrink-0 rounded-full border border-[#e4dfd4] bg-white px-4 py-2 text-sm text-slate-600">
                  {messages.length}{" "}
                  {messages.length === 1 ? "message" : "messages"}
                </span>
              </div>

              <div className="space-y-5" aria-live="polite">
                {messages.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-[#dcd7cb] px-6 py-14 text-center">
                    <span
                      aria-hidden="true"
                      className="font-serif text-4xl text-[#b3aa97]"
                    >
                      ♡
                    </span>

                    <p className="mt-4 font-serif text-xl text-[#3a2522]">
                      Be the first to share a memory
                    </p>

                    <p className="mt-2 text-sm leading-6 text-slate-500">
                      Your words can bring comfort and help preserve her
                      beautiful legacy.
                    </p>
                  </div>
                ) : (
                  messages.map((item) => (
                    <article
                      key={item.id}
                      className="rounded-2xl border border-[#eae5db] bg-white p-5 shadow-[0_8px_30px_rgba(70,70,50,0.025)] transition hover:border-[#d7d7c6] sm:p-7"
                    >
                      <div className="flex items-start gap-4">
                        <div
                          aria-hidden="true"
                          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#fff1b8] font-serif text-xl text-[#a71920]"
                        >
                          {item.name.charAt(0).toUpperCase()}
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex flex-col justify-between gap-1 sm:flex-row sm:items-start sm:gap-4">
                            <div>
                              <h4 className="break-words font-semibold text-[#3a2522]">
                                {item.name}
                              </h4>

                              <p className="mt-1 text-sm text-slate-500">
                                {item.relationship}
                              </p>
                            </div>

                            <time
                              dateTime={item.timestamp}
                              className="text-xs leading-5 text-slate-400 sm:max-w-[145px] sm:text-right"
                            >
                              {formatTimestamp(item.timestamp)}
                            </time>
                          </div>

                          <div className="my-4 h-px bg-[#f0ede6]" />

                          <p className="whitespace-pre-wrap break-words font-serif text-base leading-7 text-slate-600">
                            {item.message}
                          </p>

                          <div className="mt-5 flex items-center gap-2 text-sm text-[#a71920]">
                            <span aria-hidden="true">♡</span>
                            <span className="italic">
                              Shared with love
                            </span>
                          </div>
                        </div>
                      </div>
                    </article>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
  );
}
