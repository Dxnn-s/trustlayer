"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Contact {
  phone: string;
  name: string;
}

// Demo user — replace with real auth when ready
const DEMO_USER_ID = "+251912345678";

export default function CirclePage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [newPhone, setNewPhone] = useState("");
  const [newName, setNewName] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`/api/circle/${encodeURIComponent(DEMO_USER_ID)}`)
      .then((r) => r.json())
      .then((d) => setContacts(d.contacts));
  }, []);

  async function handleAdd() {
    setError("");
    const res = await fetch(`/api/circle/${encodeURIComponent(DEMO_USER_ID)}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone: newPhone, name: newName }),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error);
      return;
    }
    setContacts(data.contacts);
    setNewPhone("");
    setNewName("");
    setShowForm(false);
  }

  async function handleRemove(phone: string) {
    const res = await fetch(
      `/api/circle/${encodeURIComponent(DEMO_USER_ID)}/${encodeURIComponent(phone)}`,
      { method: "DELETE" }
    );
    const data = await res.json();
    setContacts(data.contacts);
  }

  return (
    <div className="bg-surface text-on-surface min-h-screen flex flex-col">
      <header className="bg-[#f8f9ff] flex items-center justify-between px-6 py-4 w-full top-0 z-50">
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-primary text-2xl">shield</span>
          <span className="text-primary font-headline font-bold text-lg tracking-tight">
            TrustLayer
          </span>
        </div>
        <div className="hidden md:flex gap-6">
          <Link href="/" className="text-on-surface-variant font-label font-bold text-sm hover:text-primary transition-colors">
            Dashboard
          </Link>
          <span className="text-primary font-label font-bold text-sm">Circle</span>
          <Link href="#" className="text-on-surface-variant font-label font-bold text-sm hover:text-primary transition-colors">
            History
          </Link>
        </div>
      </header>

      <main className="flex-1 max-w-2xl mx-auto w-full px-6 pt-8 pb-32">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-headline font-black tracking-tight text-on-surface">
            My trusted circle
          </h1>
          <div className="bg-primary-container text-on-primary-container px-3 py-1 rounded-full font-headline font-bold text-sm">
            {contacts.length}/10
          </div>
        </div>

        <p className="text-on-surface-variant mb-10 leading-relaxed font-body">
          Manage the people you trust to verify your identity. Only members of
          your circle can vouch for your secure transactions.
        </p>

        <div className="space-y-0 bg-surface-container-lowest rounded-xl overflow-hidden">
          {contacts.length === 0 && (
            <p className="p-5 text-on-surface-variant text-sm">
              No contacts yet. Add someone to get started.
            </p>
          )}
          {contacts.map((contact, i) => (
            <div
              key={contact.phone}
              className={`flex items-center justify-between p-5 transition-colors duration-200 hover:bg-surface-container-low ${
                i < contacts.length - 1 ? "border-b border-surface-container" : ""
              }`}
            >
              <div className="flex items-center gap-4">
                <div className="w-3 h-3 rounded-full bg-primary-container" />
                <div>
                  <div className="font-headline font-bold text-on-surface">
                    {contact.name || <span className="text-outline-variant italic">No name</span>}
                  </div>
                  <div className="font-body text-sm text-on-surface-variant tracking-wider">
                    {contact.phone}
                  </div>
                </div>
              </div>
              <button
                onClick={() => handleRemove(contact.phone)}
                aria-label={`Remove ${contact.name}`}
                className="text-outline-variant hover:text-error transition-colors p-2"
              >
                <span className="material-symbols-outlined text-xl">close</span>
              </button>
            </div>
          ))}
        </div>

        {showForm && (
          <div className="mt-6 bg-surface-container-low rounded-xl p-5 space-y-4">
            {error && (
              <p className="text-sm text-error font-medium">{error}</p>
            )}
            <div>
              <label className="font-label font-bold text-xs uppercase tracking-widest text-on-surface-variant block mb-2">
                Name
              </label>
              <input
                className="w-full bg-surface-container-high rounded-xl px-4 py-3 font-body focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Almaz"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
              />
            </div>
            <div>
              <label className="font-label font-bold text-xs uppercase tracking-widest text-on-surface-variant block mb-2">
                Phone
              </label>
              <input
                className="w-full bg-surface-container-high rounded-xl px-4 py-3 font-body focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="+251922000000"
                value={newPhone}
                onChange={(e) => setNewPhone(e.target.value)}
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleAdd}
                className="flex-1 bg-primary-container text-on-primary-container font-headline font-bold py-3 rounded-xl active:scale-95 transition-transform"
              >
                Add
              </button>
              <button
                onClick={() => { setShowForm(false); setError(""); }}
                className="flex-1 border-2 border-outline-variant text-on-surface-variant font-headline font-bold py-3 rounded-xl active:scale-95 transition-transform"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {!showForm && (
          <div className="mt-12 flex justify-center">
            <button
              onClick={() => setShowForm(true)}
              className="bg-primary-container text-on-primary-container font-headline font-bold py-4 px-10 rounded-full flex items-center gap-3 active:scale-95 transition-transform duration-150"
            >
              <span className="material-symbols-outlined font-black">add</span>
              <span>Add contact</span>
            </button>
          </div>
        )}
      </main>

      <nav className="md:hidden fixed bottom-0 left-0 w-full flex justify-around items-center px-4 pb-6 pt-2 bg-white border-t-4 border-[#eff4ff] z-50">
        <Link href="/" className="flex flex-col items-center justify-center text-[#121c2a] p-2">
          <span className="material-symbols-outlined text-2xl">verified_user</span>
          <span className="font-headline font-bold text-[10px] uppercase tracking-widest mt-1">Verify</span>
        </Link>
        <Link href="/circle" className="flex flex-col items-center justify-center bg-[#10b981] text-white rounded-xl p-2 scale-105">
          <span
            className="material-symbols-outlined text-2xl"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            group
          </span>
          <span className="font-headline font-bold text-[10px] uppercase tracking-widest mt-1">Circle</span>
        </Link>
        <Link href="#" className="flex flex-col items-center justify-center text-[#121c2a] p-2">
          <span className="material-symbols-outlined text-2xl">history</span>
          <span className="font-headline font-bold text-[10px] uppercase tracking-widest mt-1">History</span>
        </Link>
        <Link href="#" className="flex flex-col items-center justify-center text-[#121c2a] p-2">
          <span className="material-symbols-outlined text-2xl">settings</span>
          <span className="font-headline font-bold text-[10px] uppercase tracking-widest mt-1">Settings</span>
        </Link>
      </nav>
    </div>
  );
}
