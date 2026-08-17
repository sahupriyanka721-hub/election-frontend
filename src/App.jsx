import React, { useState, useEffect } from "react";
import { auth, googleProvider, db } from "./firebase";
import { signInWithPopup, signOut, onAuthStateChanged } from "firebase/auth";
import { collection, addDoc, getDocs, doc, setDoc, onSnapshot } from "firebase/firestore";

const INITIAL_UNIVERSITIES = [
  { id: "geu", name: "Graphic Era University", location: "Dehradun, Uttarakhand", desc: "Graphic Era student union election portal.", eligible: "18,500+", icon: "🏛️" },
  { id: "amity", name: "Amity University", location: "Noida, Uttar Pradesh", desc: "Annual Student Council Election.", eligible: "25,000+", icon: "🏫" },
  { id: "lpu", name: "Lovely Professional University", location: "Phagwara, Punjab", desc: "Official Campus Senate Election Portal.", eligible: "35,000+", icon: "🎓" },
  { id: "cu", name: "Chandigarh University", location: "Mohali, Punjab", desc: "Central Student Representative Elections.", eligible: "30,000+", icon: "🏢" }
];

function App() {
  const [selectedUniversity, setSelectedUniversity] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");

  // Voter & Auth State
  const [authMethod, setAuthMethod] = useState("google");
  const [user, setUser] = useState(null);
  const [regNo, setRegNo] = useState("");
  const [voterName, setVoterName] = useState("");

  // Events & Voting Database States
  const [events, setEvents] = useState([]);
  const [selectedParty, setSelectedParty] = useState(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [voteCounts, setVoteCounts] = useState({});

  // Event Manager State
  const [orgName, setOrgName] = useState("");
  const [orgEmail, setOrgEmail] = useState("");
  const [isOrgRegistered, setIsOrgRegistered] = useState(false);
  const [eventTitle, setEventTitle] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [eventDesc, setEventDesc] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Firebase Auth Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser({ name: currentUser.displayName, email: currentUser.email, uid: currentUser.uid, method: "Google OAuth" });
        setMessage(`Logged in as ${currentUser.email}`);
      } else {
        setUser(null);
      }
    });
    return () => unsubscribe();
  }, []);

  // Fetch Events from Firebase DB on University Select
  useEffect(() => {
    if (!selectedUniversity) return;

    // Fetch Events Realtime
    const fetchEvents = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, `universities/${selectedUniversity.id}/events`));
        const eventsList = [];
        querySnapshot.forEach((doc) => eventsList.push({ id: doc.id, ...doc.data() }));
        setEvents(eventsList);
      } catch (err) {
        console.error("Firebase fetch error:", err);
      }
    };

    fetchEvents();
  }, [selectedUniversity]);

  // Real Google Sign-In Handler
  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      setUser({ name: result.user.displayName, email: result.user.email, uid: result.user.uid, method: "Google OAuth" });
      setMessage(`🎉 Welcome ${result.user.displayName}! Connected via Backend Google Auth.`);
      setActiveTab("vote");
    } catch (error) {
      setMessage(`Google Auth Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Manual Roll No Login
  const handleManualLogin = (e) => {
    e.preventDefault();
    if (!regNo || !voterName) return setMessage("Please enter Registration Number and Name.");
    setUser({ name: voterName, id: regNo, method: "Registration ID" });
    setMessage(`Logged in as ${voterName} (${regNo})`);
    setActiveTab("vote");
  };

  // Logout
  const handleLogout = async () => {
    await signOut(auth);
    setUser(null);
    setMessage("Logged out successfully.");
  };

  // Add Event to Firebase Database
  const handleAddEventDB = async (e) => {
    e.preventDefault();
    if (!eventTitle || !eventDate || !eventDesc) return setMessage("Fill all event details.");

    try {
      setLoading(true);
      const newEvent = { title: eventTitle, date: eventDate, desc: eventDesc, org: orgName || "Campus Representative", createdAt: new Date() };
      await addDoc(collection(db, `universities/${selectedUniversity.id}/events`), newEvent);
      setEvents((prev) => [...prev, newEvent]);
      setEventTitle("");
      setEventDate("");
      setEventDesc("");
      setMessage("🚀 Event saved permanently in Firebase Database!");
      setActiveTab("events");
    } catch (err) {
      setMessage(`Database Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Cast Vote to Firebase
  const handleCastVoteDB = async () => {
    if (!user) return setMessage("Please login first to vote!");
    if (!selectedParty) return setMessage("Please select a candidate party!");

    try {
      setLoading(true);
      const voteRef = doc(db, `universities/${selectedUniversity.id}/votes`, user.uid || user.id);
      await setDoc(voteRef, { party: selectedParty.partyName, voterName: user.name, timestamp: new Date() });
      setHasVoted(true);
      setMessage("🎉 Your vote has been securely recorded in the database!");
      setActiveTab("results");
    } catch (err) {
      setMessage(`Voting Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const sampleParties = [
    { partyName: "Vivant / Alliance", motto: "Leadership & Student Rights", icon: "🦁" },
    { partyName: "Ojashvi / Youth Front", motto: "Youth Empowerment & Innovation", icon: "🔥" },
    { partyName: "Ashre Army / Senate", motto: "Unity, Discipline & Excellence", icon: "🛡️" }
  ];

  return (
    <div style={{ backgroundColor: "#0b0f19", color: "#fff", minHeight: "100vh", fontFamily: "'Inter', sans-serif", padding: "20px 40px" }}>
      {/* Header */}
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #1e293b", paddingBottom: "20px" }}>
        <div>
          <h1 style={{ margin: 0, fontSize: "24px" }}>🗳️ UniVote Pro <span style={{ fontSize: "12px", color: "#38bdf8", border: "1px solid #0284c7", padding: "2px 8px", borderRadius: "10px" }}>Backend Connected</span></h1>
          <p style={{ margin: "4px 0 0 0", color: "#64748b", fontSize: "13px" }}>Live Firestore Database & Google OAuth</p>
        </div>
        {user ? (
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ fontSize: "13px", color: "#4ade80" }}>👤 {user.name}</span>
            <button onClick={handleLogout} style={{ background: "#dc2626", color: "#fff", border: "none", padding: "6px 12px", borderRadius: "6px", cursor: "pointer", fontSize: "12px" }}>Logout</button>
          </div>
        ) : (
          <span style={{ color: "#94a3b8", fontSize: "13px" }}>Not Logged In</span>
        )}
      </header>

      {!selectedUniversity ? (
        <main style={{ marginTop: "40px", textAlign: "center" }}>
          <h2>Select Your University</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "20px", marginTop: "30px" }}>
            {INITIAL_UNIVERSITIES.map((uni) => (
              <div key={uni.id} onClick={() => { setSelectedUniversity(uni); setMessage(""); }} style={{ background: "#131b2e", border: "1px solid #1e293b", borderRadius: "12px", padding: "20px", textAlign: "left", cursor: "pointer" }}>
                <span style={{ fontSize: "32px" }}>{uni.icon}</span>
                <h3>{uni.name}</h3>
                <p style={{ color: "#94a3b8", fontSize: "13px" }}>{uni.desc}</p>
              </div>
            ))}
          </div>
        </main>
      ) : (
        <section style={{ maxWidth: "800px", margin: "30px auto" }}>
          <button onClick={() => setSelectedUniversity(null)} style={{ background: "#1e293b", color: "#94a3b8", border: "none", padding: "8px 16px", borderRadius: "8px", cursor: "pointer" }}>⬅ Back</button>

          <div style={{ background: "#131b2e", border: "1px solid #1e293b", borderRadius: "16px", padding: "24px", marginTop: "15px" }}>
            <h2>{selectedUniversity.icon} {selectedUniversity.name}</h2>

            {/* Navigation Tabs */}
            <div style={{ display: "flex", gap: "10px", margin: "20px 0", borderBottom: "1px solid #1e293b", paddingBottom: "10px" }}>
              <button onClick={() => setActiveTab("overview")} style={tabStyle(activeTab === "overview")}>Overview</button>
              <button onClick={() => setActiveTab("events")} style={tabStyle(activeTab === "events")}>📅 Events ({events.length})</button>
              <button onClick={() => setActiveTab("org_manager")} style={tabStyle(activeTab === "org_manager")}>🏢 Event Manager</button>
              <button onClick={() => setActiveTab("login")} style={tabStyle(activeTab === "login")}>🔑 Login / Google</button>
              <button onClick={() => setActiveTab("vote")} style={tabStyle(activeTab === "vote")}>🗳️ Vote</button>
            </div>

            {message && <div style={{ background: "#1e293b", color: "#38bdf8", padding: "10px", borderRadius: "8px", marginBottom: "15px", fontSize: "13px" }}>{message}</div>}

            {/* LOGIN TAB */}
            {activeTab === "login" && (
              <div>
                <h3>Login to Vote</h3>
                <div style={{ display: "flex", gap: "10px", marginBottom: "15px" }}>
                  <button onClick={() => setAuthMethod("google")} style={{ padding: "8px", background: authMethod === "google" ? "#ea4335" : "#0f172a", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer" }}>Google Auth</button>
                  <button onClick={() => setAuthMethod("reg")} style={{ padding: "8px", background: authMethod === "reg" ? "#2563eb" : "#0f172a", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer" }}>Reg Number</button>
                </div>

                {authMethod === "google" ? (
                  <button onClick={handleGoogleSignIn} disabled={loading} style={{ background: "#fff", color: "#000", padding: "12px 20px", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "bold" }}>
                    {loading ? "Connecting..." : "🌐 Sign in with Google (Firebase)"}
                  </button>
                ) : (
                  <form onSubmit={handleManualLogin}>
                    <input type="text" placeholder="Reg No" value={regNo} onChange={(e) => setRegNo(e.target.value)} style={{ width: "100%", padding: "8px", marginBottom: "10px" }} />
                    <input type="text" placeholder="Name" value={voterName} onChange={(e) => setVoterName(e.target.value)} style={{ width: "100%", padding: "8px", marginBottom: "10px" }} />
                    <button type="submit" style={{ background: "#16a34a", color: "#fff", padding: "10px", border: "none", borderRadius: "6px", width: "100%" }}>Login</button>
                  </form>
                )}
              </div>
            )}

            {/* EVENTS TAB */}
            {activeTab === "events" && (
              <div>
                <h3>Database Published Events</h3>
                {events.length === 0 ? <p style={{ color: "#94a3b8" }}>No events found in database yet. Add one from Event Manager!</p> : null}
                {events.map((ev, i) => (
                  <div key={i} style={{ background: "#0f172a", padding: "12px", borderRadius: "8px", marginBottom: "10px" }}>
                    <h4 style={{ margin: 0, color: "#38bdf8" }}>{ev.title}</h4>
                    <p style={{ margin: "4px 0", fontSize: "13px" }}>{ev.desc}</p>
                    <span style={{ fontSize: "11px", color: "#64748b" }}>Date: {ev.date} | Org: {ev.org}</span>
                  </div>
                ))}
              </div>
            )}

            {/* EVENT MANAGER TAB */}
            {activeTab === "org_manager" && (
              <form onSubmit={handleAddEventDB}>
                <h3>Add Event to Firebase DB</h3>
                <input type="text" placeholder="Event Title" value={eventTitle} onChange={(e) => setEventTitle(e.target.value)} style={{ width: "100%", padding: "8px", marginBottom: "10px" }} required />
                <input type="text" placeholder="Date (e.g. Sep 15)" value={eventDate} onChange={(e) => setEventDate(e.target.value)} style={{ width: "100%", padding: "8px", marginBottom: "10px" }} required />
                <textarea placeholder="Description" value={eventDesc} onChange={(e) => setEventDesc(e.target.value)} style={{ width: "100%", padding: "8px", marginBottom: "10px" }} required />
                <button type="submit" disabled={loading} style={{ background: "#059669", color: "#fff", padding: "10px", border: "none", borderRadius: "6px", width: "100%" }}>Save to Database 🚀</button>
              </form>
            )}

            {/* VOTE TAB */}
            {activeTab === "vote" && (
              <div>
                <h3>Cast Your Vote</h3>
                {sampleParties.map((p, i) => (
                  <div key={i} onClick={() => setSelectedParty(p)} style={{ background: selectedParty?.partyName === p.partyName ? "#2563eb" : "#0f172a", padding: "12px", borderRadius: "8px", marginBottom: "8px", cursor: "pointer" }}>
                    {p.icon} <strong>{p.partyName}</strong> - <span style={{ fontSize: "12px" }}>{p.motto}</span>
                  </div>
                ))}
                <button onClick={handleCastVoteDB} disabled={loading} style={{ background: "#16a34a", color: "#fff", padding: "12px", border: "none", borderRadius: "8px", cursor: "pointer", width: "100%", marginTop: "15px" }}>
                  {loading ? "Saving Vote to Database..." : "Submit Vote to DB 🗳️"}
                </button>
              </div>
            )}
          </div>
        </section>
      )}
    </div>
  );
}

const tabStyle = (active) => ({ background: active ? "#2563eb" : "transparent", color: active ? "#fff" : "#94a3b8", border: "none", padding: "8px 12px", borderRadius: "6px", cursor: "pointer" });

export default App;