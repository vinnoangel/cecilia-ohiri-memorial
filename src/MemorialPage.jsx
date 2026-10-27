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
  birthDate: "1948",
  passingDate: "3 July 2026",
  portrait: "/cecilia-obiageri-nkemka-ohiri.jpeg",

  obituary: [
    "With gratitude to God Almighty for a life well spent, the entire Ohiri family of Umuaku Ogbaku in Mbaitoli L.G.A., Imo State, announces the glorious demise of their beloved wife, mother, grandmother, sister, and aunty, Late Mrs. Cecilia Obiageri Nkemka Ohiri (nee Ukaegbu).",

    "Cecilia passed away on the 3rd of July, 2026, at Umezurike Hospital after a brief illness. Her life was a blessing to her family, and her memory will remain a source of comfort and gratitude to all who knew and loved her.",

    "She is survived by her children, grandchildren, brothers, sisters, in-laws, and a host of other relatives, who mourn her passing and celebrate the life she shared with them.",

    "May her soul rest in perfect peace. Amen.",
  ],

  funeral: {
    date: "Wednesday 28 October & Thursday 29 October 2026",
    time: "8:00 AM · 11:00 AM · 12:00 noon",
    venue: "Her husband's compound, Ogbaku",
    address:
      "Along Impressive Road, Ogbaku, Mbaitoli L.G.A., Imo State",
    notice: "/863250462_1673578877431771_7636838536071350629_n.jpg",
  },

  instructions: [
    "Wednesday 28 October: Service of Songs by Deeper Life Bible Church at her husband's compound by 5:00 PM.",
    "Thursday 29 October, 8:00 AM: Body leaves Ossai Mortuary along Onitsha Express Road for her hometown, Umuaku Ogbaku.",
    "Thursday 29 October, 11:00 AM: Church service at her husband's compound; interment follows immediately after the requiem service.",
  ],
};

function normalizeDuplicateValue(value) {
  return value.trim().replace(/\s+/g, " ").toLocaleLowerCase();
}

export default function MemorialPage() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function loadTributes() {
        const { data, error } = await supabase
        .from("tributes")
        .select("id, name, relationship, message, created_at")
        .eq("is_approved", true)
        .order("created_at", { ascending: false });

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
        .insert({ name, relationship, message });

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
      <MemorialHeader memorial={memorial} />
      <MemorialHero memorial={memorial} />
      <div className="px-5 py-5"><Ornament /></div>
      <LifeTribute memorial={memorial} />
      <FuneralService memorial={memorial} />
      <Guestbook memorial={memorial} messages={messages} loading={loading} submitting={submitting} form={form} error={error} success={success} handleChange={handleChange} handleSubmit={handleSubmit} formatTimestamp={formatTimestamp} />
      <ClosingTribute memorial={memorial} />
      <MemorialFooter memorial={memorial} />
    </main>
  );
}
