import { useEffect, useState } from "react";
import { Ornament } from "./components/MemorialUI";
import MemorialHeader from "./components/MemorialHeader";
import MemorialHero from "./components/MemorialHero";
import LifeTribute from "./components/LifeTribute";
import FuneralService from "./components/FuneralService";
import Guestbook from "./components/Guestbook";
import ClosingTribute from "./components/ClosingTribute";
import MemorialFooter from "./components/MemorialFooter";

import { supabase } from "./lib/supabaseClient";

const SUBMISSION_COOLDOWN_MS = 60 * 60 * 1000;
const SUBMISSION_COOLDOWN_KEY = "cecilia-memorial:last-tribute-submission";

function getSubmissionCooldownRemaining() {
  try {
    const timestamp = Number(
      window.localStorage.getItem(SUBMISSION_COOLDOWN_KEY)
    );

    if (!Number.isFinite(timestamp)) {
      return 0;
    }

    const remaining = SUBMISSION_COOLDOWN_MS - (Date.now() - timestamp);

    if (remaining <= 0) {
      window.localStorage.removeItem(SUBMISSION_COOLDOWN_KEY);
      return 0;
    }

    return remaining;
  } catch (storageError) {
    console.warn("Unable to read submission cooldown:", storageError);
    return 0;
  }
}

function recordSubmissionTime() {
  try {
    window.localStorage.setItem(
      SUBMISSION_COOLDOWN_KEY,
      String(Date.now())
    );
  } catch (storageError) {
    console.warn("Unable to record submission cooldown:", storageError);
  }
}

function formatCooldown(remaining) {
  const minutes = Math.ceil(remaining / (60 * 1000));
  return `${minutes} minute${minutes === 1 ? "" : "s"}`;
}

const memorial = {
  name: "Cecilia Obiageri Nkemka Ohiri",
  birthDate: "11 December 1948",
  passingDate: "3 July 2026",
  portrait: "/cecilia-obiageri-nkemka-ohiri.jpeg",

  obituary: [
    "There is no age in the life of man at which death is welcomed. Even as our mother lies here at the ripe age of a septuagenarian, we still accuse death of being callously wicked. Such is man's emotion in the event of death.",

    "Mama was born on 11 December 1948 into the family of Late Mr. and Mrs. Lazarus Ukaegbu of Umuaku Ogbaku in Mbaitoli L.G.A., Imo State. She was the second daughter of her parents.",

    "She attended Central School Ogbaku in the early 1960s. Unfortunately, she could not complete her elementary education due to financial constraints. She later apprenticed herself to the late Mr. James Nzurumike of Amakaohia Ubi in Owerri West L.G.A., one of the renowned tailors of the late 1960s, to learn tailoring.",

    "After completing her apprenticeship, Mama opened her own tailoring shop in Ogbaku in the 1970s. With the support of her parents, she built the business from scratch. Her tailoring business became a force to be reckoned with, trained several apprentices, and served as a major source of livelihood for the family.",

    "Mama married her heart-throb, the late Mr. Alphonsus Nkemka Ohiri, on 31 August 1980 at St. Kevin's Catholic Church Ogbaku. The marriage was solemnised by Rev. Father Augustine Amanze and was blessed with four responsible children. Before her marriage, she was the leader of the revered Mary League Girls' Association of St. Kevin's Catholic Church Ogbaku.",

    "After her wedding, she relocated to Bauchi State with her husband, where she engaged in the foodstuff business. She remained a fulfilled and active Christian from her youth and was an ardent member of Deeper Life Bible Church. Until illness limited her mobility in March 2025, she actively participated in church activities and remained a convinced follower of Christ in her words and actions.",

    "In 2012, Mama was diagnosed with chronic diabetes and hypertension. These illnesses led to her involuntary retirement from trading in 2014. Her late husband and children managed her condition through regulated diets and routine medication. In March 2025, she suffered a partial stroke which her children swiftly attended to. She had a relapse in June 2026.",

    "Sadly, Late Mrs. Cecilia Nkemka Ohiri bowed to death and waved goodbye to the hullabaloo of this life at Umezurike Hospital, Owerri, at about 5:20 PM on Friday, 3 July 2026.",

    "She is survived by Mr. Kelechi Donald Nkemka Ohiri (KC Best), her first son; Mr. Geoffrey Chimeremeze Ohiri (Daddy Geo), her second son; Pastor Stanley Sunday Ohiri (SSG/Sir White), her third son; and Mr. Vincent Uche Ohiri (Vinnoangel), her last born.",

    "She is also survived by Mrs. Jacinta Chinenye Ohiri, Mrs. Onyinyechi Calista Ohiri, Mrs. Patience Vincent, and Mrs. Rebecca Tsado Ohiri (Becky), her daughters-in-law; ten grandchildren; one uterine sister; three stepsisters; two stepbrothers; and a host of nephews, nieces, cousins, and other relatives.",

    "As we end this biography in tears, we pray that the Almighty God grants Mama eternal rest until the resurrection morning when we shall meet to part no more. Rest in peace, dear mother. Adieu, Septuagenarian. Farewell, loving and caring mother. Laa N'udo Ada Ukaee.",
  ],

  funeral: {
    date: "Wednesday 28 October & Thursday 29 October 2026",
    time: "8:00 AM · 11:00 AM · 12:00 noon",
    venue: "Her husband's compound, Ogbaku",
    address:
      "Along Impressive Road, Ogbaku, Mbaitoli L.G.A., Imo State",
    notice: "/863250462_1673578877431771_7636838536071350629_n.jpg",
    streamingUrl: "https://www.youtube.com/live/KJdq8mcUP1M?si=cnw-KvT63XGqXeff",
  },

  instructions: [
    "Wednesday 28 October: Service of Songs by Deeper Life Bible Church at her husband's compound by 5:00 PM.",
    "Thursday 29 October, 8:00 AM: Body leaves Ossai Mortuary along Onitsha Express Road for her hometown, Umuaku Ogbaku.",
    "Thursday 29 October, 11:00 AM: Church service at her husband's compound; interment follows immediately after the requiem service.",
  ],
}

function normalizeDuplicateValue(value) {
  return value.trim().replace(/\s+/g, " ").toLocaleLowerCase();
}

export default function MemorialPage() {
  const [messages, setMessages] = useState([]);
  const [showStreamingNotice, setShowStreamingNotice] = useState(
    Boolean(memorial.funeral.streamingUrl)
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [notificationPermission, setNotificationPermission] = useState(
    () => ("Notification" in window ? Notification.permission : "unsupported")
  );

  async function enableNotifications() {
    if (!("Notification" in window)) {
      setError("Browser notifications are not supported on this device.");
      return;
    }

    const permission = await Notification.requestPermission();
    setNotificationPermission(permission);

    if (permission !== "granted") {
      setError(
        "Notifications are blocked. Enable them in your browser's site settings."
      );
    }
  }

  useEffect(() => {
    let active = true;

    async function loadTributes(showLoading = true) {
      if (showLoading) {
        setLoading(true);
      }

      const { data, error } = await supabase
        .from("tributes")
        .select("id, name, relationship, message, created_at")
        .eq("is_approved", true)
        .order("created_at", { ascending: false });

      if (!active) {
        return;
      }

      if (error) {
        console.error("Failed to load tributes:", error);
        setError("Unable to load tributes. Please try again later.");
      } else {
        setMessages(
          data.map((item) => ({
            ...item,
            timestamp: item.created_at,
          }))
        );
      }

      setLoading(false);
    }

    loadTributes();

    const channel = supabase
      .channel("public-tributes-feed")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "tributes" },
        (payload) => {
          const approved =
            payload.eventType === "INSERT"
              ? payload.new?.is_approved === true &&
                payload.new?.moderation_status === "approved"
              : payload.eventType === "UPDATE" &&
                payload.new?.is_approved === true &&
                payload.new?.moderation_status === "approved" &&
                (payload.old?.is_approved !== true ||
                  payload.old?.moderation_status !== "approved");

          if (
            approved &&
            "Notification" in window &&
            Notification.permission === "granted"
          ) {
            try {
              const notification = new Notification(
                "New memorial tribute published",
                {
                  body: "A new tribute is now available in Cecilia's guestbook.",
                  tag: `published-tribute-${payload.new.id}`,
                  icon: "/favicon-now-package/favicon-48x48.png",
                }
              );

              notification.onclick = () => {
                window.focus();
                document
                  .getElementById("guestbook")
                  ?.scrollIntoView({ behavior: "smooth" });
                notification.close();
              };
            } catch (notificationError) {
              console.error(
                "Unable to display tribute notification:",
                notificationError
              );
            }
          }

          loadTributes(false);
        }
      )
      .subscribe((status) => {
        if (status === "CHANNEL_ERROR") {
          console.error("Unable to subscribe to tribute updates.");
        }
      });

    return () => {
      active = false;
      supabase.removeChannel(channel);
    };
  }, []);

  const [form, setForm] = useState({
    name: "",
    relationship: "",
    message: "",
  });

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));

    setError("");
    setSuccess(false);
  }


  async function handleSubmit(event) {
    event.preventDefault();

    if (submitting) {
      return;
    }

    const cooldownRemaining = getSubmissionCooldownRemaining();

    if (cooldownRemaining > 0) {
      setError(
        `Only one tribute can be submitted from this device per hour. Please try again in ${formatCooldown(
          cooldownRemaining
        )}.`
      );
      return;
    }

    setError("");
    setSuccess(false);

    const name = form.name.trim();
    const relationship = form.relationship.trim();
    const message = form.message.trim();

    if (!name || !relationship || !message) {
      setError("Please complete all fields.");
      return;
    }

    if (
      name.length > 100 ||
      relationship.length > 100 ||
      message.length > 2000
    ) {
      setError("Please check the length of your entries.");
      return;
    }

    const normalizedName = normalizeDuplicateValue(name);
    const normalizedRelationship = normalizeDuplicateValue(relationship);
    const localDuplicate = messages.some(
      (item) =>
        normalizeDuplicateValue(item.name) === normalizedName &&
        normalizeDuplicateValue(item.relationship) === normalizedRelationship
    );

    if (localDuplicate) {
      setError(
        "A tribute from this name and relationship has already been submitted."
      );
      return;
    }

    setSubmitting(true);

    try {
      const { data: isDuplicate, error: duplicateCheckError } =
        await supabase.rpc("tribute_exists_for_identity", {
          p_name: name,
          p_relationship: relationship,
        });

      if (duplicateCheckError) {
        console.error(
          "Unable to check for duplicate tribute:",
          duplicateCheckError
        );
        setError("We could not verify your tribute. Please try again.");
        return;
      }

      if (isDuplicate === true) {
        setError(
          "A tribute from this name and relationship has already been submitted."
        );
        return;
      }

      const { error: insertError } = await supabase
        .from("tributes")
        .insert({
          name,
          relationship,
          message,
          is_approved: false,
          moderation_status: "pending",
        });

      if (insertError) {
        console.error("Error submitting tribute:", insertError);

        if (insertError.code === "23505") {
          setError(
            "A tribute from this name and relationship has already been submitted."
          );
          return;
        }

        if (insertError.code === "23514") {
          setError(
            "A tribute from this name and relationship has already been submitted."
          );
          return;
        }

        setError(
          "Your tribute could not be submitted. Please check your connection and try again."
        );
        return;
      }

      recordSubmissionTime();
      setForm({ name: "", relationship: "", message: "" });
      setSuccess(true);
    } finally {
      setSubmitting(false);
    }
  }


  function formatTimestamp(timestamp) {
    return new Intl.DateTimeFormat("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(timestamp));
  }

  return (
    <main className="min-h-screen overflow-hidden bg-[#fffaf0] font-sans text-[#4a3530]">
      {showStreamingNotice && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#3a2522]/60 px-5 py-8"
          role="presentation"
        >
          <div
            aria-labelledby="streaming-notice-title"
            aria-modal="true"
            className="relative w-full max-w-md rounded-3xl border border-[#d4a51b] bg-[#fffdf5] p-7 text-center shadow-[0_20px_70px_rgba(58,37,34,0.25)] sm:p-9"
            role="dialog"
          >
            <button
              type="button"
              onClick={() => setShowStreamingNotice(false)}
              aria-label="Close live streaming notice"
              className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full text-xl text-[#7f1118] transition hover:bg-[#fff1b8] focus:outline-none focus:ring-2 focus:ring-[#a71920]"
            >
              ×
            </button>

            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#a71920]">
              Live streaming available
            </p>
            <h2
              id="streaming-notice-title"
              className="mt-3 font-serif text-3xl text-[#3a2522]"
            >
              Join us online
            </h2>
            <p className="mt-4 leading-7 text-slate-600">
              The service is being streamed live. You are welcome to join the
              family and friends in remembrance.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <a
                href={memorial.funeral.streamingUrl}
                target="_blank"
                rel="noreferrer"
                onClick={() => setShowStreamingNotice(false)}
                className="inline-flex min-h-12 items-center justify-center rounded-full bg-[#a71920] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#7f1118] focus:outline-none focus:ring-2 focus:ring-[#a71920] focus:ring-offset-2"
              >
                Watch the live stream ↗
              </a>
              <button
                type="button"
                onClick={() => setShowStreamingNotice(false)}
                className="min-h-12 rounded-full border border-[#d4a51b] px-6 py-3 text-sm font-medium text-[#7f1118] transition hover:bg-[#fff1b8] focus:outline-none focus:ring-2 focus:ring-[#a71920] focus:ring-offset-2"
              >
                Continue to memorial
              </button>
            </div>
          </div>
        </div>
      )}
      <MemorialHeader memorial={memorial} />
      <MemorialHero memorial={memorial} />
      <div className="px-5 py-5"><Ornament /></div>
      <LifeTribute memorial={memorial} />
      <FuneralService memorial={memorial} />
      <Guestbook memorial={memorial} messages={messages} loading={loading} submitting={submitting} form={form} error={error} success={success} handleChange={handleChange} handleSubmit={handleSubmit} formatTimestamp={formatTimestamp} notificationPermission={notificationPermission} enableNotifications={enableNotifications} />
      <ClosingTribute memorial={memorial} />
      <MemorialFooter memorial={memorial} />
    </main>
  );
}
