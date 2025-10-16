"use client";

import { useState } from "react";

interface Contact {
  id: string;
  name: string;
  phone: string;
}

export default function Home() {
  const [contacts, setContacts] = useState<Contact[]>([
    { id: "1", name: "Emergency Contact", phone: "+1508514064" }
  ]);
  const [newName, setNewName] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [isEmergency, setIsEmergency] = useState(false);
  const [showAddContact, setShowAddContact] = useState(false);

  const handleEmergency = async () => {
    setIsEmergency(true);
    
    // Send emergency alert to all contacts
    const message = "🚨 EMERGENCY ALERT - I need immediate help!";
    
    try {
      for (const contact of contacts) {
        // Call API to send SMS
        await fetch("/api/emergency", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            to: contact.phone,
            message: message,
          }),
        });
      }
      
      alert(`Emergency alert sent to ${contacts.length} contact(s)!`);
    } catch (error) {
      console.error("Error sending emergency alert:", error);
      alert("Failed to send emergency alert. Please call 911 directly.");
    }
    
    setTimeout(() => setIsEmergency(false), 3000);
  };

  const addContact = () => {
    if (newName && newPhone) {
      const newContact: Contact = {
        id: Date.now().toString(),
        name: newName,
        phone: newPhone,
      };
      setContacts([...contacts, newContact]);
      setNewName("");
      setNewPhone("");
      setShowAddContact(false);
    }
  };

  const deleteContact = (id: string) => {
    setContacts(contacts.filter((c) => c.id !== id));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-black">
      {/* Header */}
      <header className="backdrop-blur-xl bg-white/70 dark:bg-gray-900/70 border-b border-gray-200/50 dark:border-gray-800/50 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6 py-4">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white tracking-tight">
            Emergency Alert System
          </h1>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-12">
        {/* Emergency Button Section */}
        <div className="mb-12">
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-8 border border-gray-200/50 dark:border-gray-700/50">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 text-center">
              Emergency Alert
            </h2>
            <div className="flex flex-col items-center gap-4">
              <button
                onClick={handleEmergency}
                disabled={isEmergency}
                className={`relative w-64 h-64 rounded-full font-bold text-2xl shadow-2xl transition-all duration-300 transform
                  ${
                    isEmergency
                      ? "bg-red-600 scale-95"
                      : "bg-red-500 hover:bg-red-600 hover:scale-105 active:scale-95"
                  } 
                  text-white disabled:opacity-70`}
              >
                {isEmergency ? (
                  <span className="animate-pulse">Sending Alert...</span>
                ) : (
                  <>
                    <div className="text-6xl mb-2">🚨</div>
                    <div>EMERGENCY</div>
                  </>
                )}
              </button>
              <p className="text-sm text-gray-600 dark:text-gray-400 text-center max-w-md">
                Press the emergency button to send an immediate alert to all your contacts.
              </p>
              <div className="mt-4 text-xs text-gray-500 dark:text-gray-500 text-center">
                In case of real emergency, always call 911 first
              </div>
            </div>
          </div>
        </div>

        {/* Contacts Section */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-8 border border-gray-200/50 dark:border-gray-700/50">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Emergency Contacts
            </h2>
            <button
              onClick={() => setShowAddContact(!showAddContact)}
              className="w-10 h-10 rounded-full bg-blue-500 hover:bg-blue-600 text-white font-bold text-2xl flex items-center justify-center transition-all hover:scale-110 active:scale-95"
            >
              {showAddContact ? "×" : "+"}
            </button>
          </div>

          {/* Add Contact Form */}
          {showAddContact && (
            <div className="mb-6 p-6 bg-gray-50 dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Add New Contact
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="John Doe"
                    className="w-full px-4 py-3 rounded-xl bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-gray-900 dark:text-white placeholder-gray-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    placeholder="+1234567890"
                    className="w-full px-4 py-3 rounded-xl bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-gray-900 dark:text-white placeholder-gray-400"
                  />
                </div>
                <button
                  onClick={addContact}
                  disabled={!newName || !newPhone}
                  className="w-full py-3 px-6 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-all hover:scale-105 active:scale-95"
                >
                  Add Contact
                </button>
              </div>
            </div>
          )}

          {/* Contacts List */}
          <div className="space-y-3">
            {contacts.length === 0 ? (
              <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                <div className="text-5xl mb-4">📇</div>
                <p>No contacts yet. Add your first emergency contact!</p>
              </div>
            ) : (
              contacts.map((contact) => (
                <div
                  key={contact.id}
                  className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 transition-all"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-lg">
                      {contact.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900 dark:text-white">
                        {contact.name}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {contact.phone}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => deleteContact(contact.id)}
                    className="w-8 h-8 rounded-full bg-red-100 hover:bg-red-500 dark:bg-red-900 dark:hover:bg-red-600 text-red-600 hover:text-white dark:text-red-300 dark:hover:text-white font-bold transition-all hover:scale-110"
                  >
                    ×
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-5xl mx-auto px-6 py-8 text-center text-sm text-gray-500 dark:text-gray-500">
        <p>Emergency Alert System • Always call 911 in real emergencies</p>
      </footer>
    </div>
  );
}
