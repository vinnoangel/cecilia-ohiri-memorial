import { useState } from "react";
import { Ornament } from "./components/MemorialUI";
import MemorialHeader from "./components/MemorialHeader";
import MemorialHero from "./components/MemorialHero";
import LifeTribute from "./components/LifeTribute";
import FuneralService from "./components/FuneralService";
import Guestbook from "./components/Guestbook";
import ClosingTribute from "./components/ClosingTribute";
import MemorialFooter from "./components/MemorialFooter";

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

const initialMessages = [
  {
    id: 1,
    name: "Sarah Williams",
    relationship: "Family friend",
    message:
      "Mama Cecilia was such a beautiful soul. Her kindness and warmth will never be forgotten. May her family find strength and comfort in the wonderful memories she leaves behind.",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
  },
  {
    id: 2,
    name: "Michael Thompson",
    relationship: "Family friend",
    message:
      "A truly remarkable woman who made everyone feel welcome. Her legacy of love will continue through everyone fortunate enough to have known her. Rest peacefully, Mama Cecilia.",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
  },
  {
    id: 3,
    name: "Michael Thompson",
    relationship: "Family friend",
    message:
      "A truly remarkable woman who made everyone feel welcome. Her legacy of love will continue through everyone fortunate enough to have known her. Rest peacefully, Mama Cecilia.",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
  },
  {
    id: 4,
    name: "Michael Thompson",
    relationship: "Family friend",
    message:
      "A truly remarkable woman who made everyone feel welcome. Her legacy of love will continue through everyone fortunate enough to have known her. Rest peacefully, Mama Cecilia.",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
  },
  {
    id: 5,
    name: "Michael Thompson",
    relationship: "Family friend",
    message:
      "A truly remarkable woman who made everyone feel welcome. Her legacy of love will continue through everyone fortunate enough to have known her. Rest peacefully, Mama Cecilia.",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
  },
];

export default function MemorialPage() {
  const [messages, setMessages] = useState(initialMessages);

  const [form, setForm] = useState({
    name: "",
    relationship: "",
    message: "",
  });

  const [error, setError] = useState("");

  const [success, setSuccess] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));

    setError("");
    setSuccess(false);
  }

  function handleSubmit(event) {
    event.preventDefault();

    const name = form.name.trim();
    const relationship = form.relationship.trim();
    const message = form.message.trim();

    if (!name || !relationship || !message) {
      setError("Please complete all fields before sharing your message.");
      return;
    }

    const newMessage = {
      id: `${Date.now()}-${Math.random()}`,
      name,
      relationship,
      message,
      timestamp: new Date().toISOString(),
    };

    setMessages((previous) => [newMessage, ...previous]);

    setForm({
      name: "",
      relationship: "",
      message: "",
    });

    setError("");
    setSuccess(true);
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
      <Guestbook memorial={memorial} messages={messages} form={form} error={error} success={success} handleChange={handleChange} handleSubmit={handleSubmit} formatTimestamp={formatTimestamp} />
      <ClosingTribute memorial={memorial} />
      <MemorialFooter memorial={memorial} />
    </main>
  );
}
