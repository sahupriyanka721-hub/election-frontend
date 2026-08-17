import React, { useState } from "react";

const INITIAL_UNIVERSITY_DATA = {
  "Graphic Era University": {
    parties: [
      { id: "geu_1", partyName: "Vivant", motto: "Leadership & Progress", icon: "🦁" },
      { id: "geu_2", partyName: "Ojashvi", motto: "Youth Empowerment", icon: "🔥" },
      { id: "geu_3", partyName: "Ashre Army", motto: "Unity & Discipline", icon: "🛡️" }
    ],
    events: [
      { id: "e1", title: "Student Council Election 2026", org: "GEU Student Affairs", date: "Aug 20, 2026", desc: "Annual election to select student representatives." }
    ]
  },
  "Amity University": {
    parties: [
      { id: "amity_1", partyName: "Amity Vanguard", motto: "Empowering Next-Gen Leaders", icon: "🚀" },
      { id: "amity_2", partyName: "Innovators League", motto: "Creativity & Research First", icon: "💡" },
      { id: "amity_3", partyName: "Youth Alliance", motto: "Student Unity & Future", icon: "⭐" }
    ],
    events: [
      { id: "e2", title: "Amity Youth Fest & Voting", org: "Amity Cultural Club", date: "Sep 05, 2026", desc: "Voting for best club performance and senate elections." }
    ]
  },
  "Lovely Professional University": {
    parties: [
      { id: "lpu_1", partyName: "LPU Campus Senate", motto: "Global Vision & Leadership", icon: "🏛️" },
      { id: "lpu_2", partyName: "Youth Voice LPU", motto: "Academic & Campus Harmony", icon: "📢" },
      { id: "lpu_3", partyName: "United Students Front", motto: "Equality & Innovation", icon: "🌐" }
    ],
    events: [
      { id: "e3", title: "Global Senate Election", org: "LPU Senate Council", date: "Aug 28, 2026", desc: "Official voting for international student senate." }
    ]
  },
  "Chandigarh University": {
    parties: [
      { id: "cu_1", partyName: "CU Rising Alliance", motto: "Unity, Discipline & Action", icon: "🦅" },
      { id: "cu_2", partyName: "Chandigarh Youth Forum", motto: "Progress & Student Rights", icon: "⚡" },
      { id: "cu_3", partyName: "Pioneer Student Club", motto: "Excellence in Action", icon: "🏆" }
    ],
    events: [
      { id: "e4", title: "CU Leadership Summit", org: "CU Student Union", date: "Sep 12, 2026", desc: "Voting for campus leadership and festival committees." }
    ]
  }
};

function App() {
  const [selectedUniversity, setSelectedUniversity] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");

  // Dynamic Data State
  const [uniData, setUniData] = useState(INITIAL_UNIVERSITY_DATA);

  // Voter & Auth State
  const [authMethod, setAuthMethod] = useState("reg"); // "reg" or "google"
  const [regNo, setRegNo] = useState("");
  const [voterName, setVoterName] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userProfile, setUserProfile] = useState(null);

  const [selectedParty, setSelectedParty] = useState(null);
  const [votedParty, setVotedParty] = useState(null);

  // Event Manager State
  const [registeredOrgs, setRegisteredOrgs] = useState([]);
  const [orgName, setOrgName] = useState("");
  const [orgEmail, setOrgEmail] = useState("");
  const [isOrgRegistered, setIsOrgRegistered] = useState(false);

  // New Event Form State
  const [eventTitle, setEventTitle] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [eventDesc, setEventDesc] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const universities = [
    { id: "geu", name: "Graphic Era University", location: "Dehradun, Uttarakhand", desc: "Graphic Era (Deemed to be University) student union election portal.", eligible: "18,500+", icon: "🏛️" },
    { id: "amity", name: "Amity University", location: "Noida, Uttar Pradesh", desc: "Annual Student Council Election for Amity University main campus.", eligible: "25,000+", icon: "🏫" },
    { id: "lpu", name: "Lovely Professional University", location: "Phagwara, Punjab", desc: "Official Campus Senate Election Portal.", eligible: "35,000+", icon: "🎓" },
    { id: "cu", name: "Chandigarh University", location: "Mohali, Punjab", desc: "Central Student Representative Elections.", eligible: "30,000+", icon: "🏢" }
  ];

  const handleSelectUniversity = (uni) => {
    setSelectedUniversity(uni);
    setActiveTab("overview");
    setMessage("");
    setSelectedParty(null);
  };

  // Traditional Reg No Login
  const handleVoterVerify = (e) => {
    e.preventDefault();
    if (!regNo || !voterName) {
      setMessage("Please enter both Registration Number and Name.");
      return;
    }
    setIsLoggedIn(true);
    setUserProfile({ name: voterName, method: "Registration ID", id: regNo });
    setMessage(`Welcome ${voterName}! Authenticated via Reg No: ${regNo}`);
    setActiveTab("vote");
  };

  // Google Authentication Handler (Simulated Google Auth)
  const handleGoogleAuth = () => {
    setLoading(true);
    setMessage("Connecting to Google Auth Server...");
    setTimeout(() => {
      const googleUser = {
        name: "Student User (Google Verified)",
        email: "student@university.edu.in",
        method: "Google OAuth 2.0"
      };
      setIsLoggedIn(true);
      setUserProfile(googleUser);
      setLoading(false);
      setMessage(`🎉 Authenticated successfully via Google! Logged in as ${googleUser.email}`);
      setActiveTab("vote");
    }, 1200);
  };

  const handleRegisterOrg = (e) => {
    e.preventDefault();
    if (!orgName || !orgEmail) {
      setMessage("Please fill Organisation Name and Email.");
      return;
    }
    const newOrg = { name: orgName, email: orgEmail, uni: selectedUniversity.name };
    setRegisteredOrgs([...registeredOrgs, newOrg]);
    setIsOrgRegistered(true);
    setMessage(`🎉 Organisation '${orgName}' successfully registered for ${selectedUniversity.name}!`);
  };

  const handleAddEvent = (e) => {
    e.preventDefault();
    if (!eventTitle || !eventDate || !eventDesc) {
      setMessage("Please fill all event details.");
      return;
    }

    const newEvent = {
      id: Date.now().toString(),
      title: eventTitle,
      org: orgName || "Campus Representative",
      date: eventDate,
      desc: eventDesc
    };

    setUniData((prev) => ({
      ...prev,
      [selectedUniversity.name]: {
        ...prev[selectedUniversity.name],
        events: [...prev[selectedUniversity.name].events, newEvent]
      }
    }));

    setEventTitle("");
    setEventDate("");
    setEventDesc("");
    setMessage("🚀 New Event successfully created & published on University Portal!");
    setActiveTab("events");
  };

  const handleCastVote = () => {
    if (!selectedParty) {
      setMessage("Please select a candidate party to vote!");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setVotedParty(selectedParty.partyName);
      setMessage("🎉 Your vote has been cast successfully!");
      setActiveTab("results");
      setLoading(false);
    }, 800);
  };

  const currentUniInfo = selectedUniversity ? uniData[selectedUniversity.name] : null;

  return (
    <div style={{ backgroundColor: "#0b0f19", color: "#fff", minHeight: "100vh", fontFamily: "'Inter', sans-serif", padding: "20px 40px" }}>
      {/* Header */}
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #1e293b", paddingBottom: "20px" }}>
        <div>
          <h1 style={{ margin: 0, fontSize: "24px", display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ background: "#2563eb", padding: "6px 10px", borderRadius: "8px" }}>🗳️</span> UniVote Pro
          </h1>
          <p style={{ margin: "4px 0 0 0", color: "#64748b", fontSize: "13px" }}>National Campus Election & Event Management Portal</p>
        </div>
        <div style={{ background: "#064e3b", color: "#4ade80", padding: "6px 14px", borderRadius: "20px", fontSize: "13px", border: "1px solid #10b981", display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{ width: "8px", height: "8px", background: "#4ade80", borderRadius: "50%" }}></span> Live Connection Active
        </div>
      </header>

      {!selectedUniversity ? (
        <main style={{ marginTop: "50px", textAlign: "center" }}>
          <h2 style={{ fontSize: "32px", marginBottom: "8px", fontWeight: "700" }}>Select Your University</h2>
          <p style={{ color: "#94a3b8", fontSize: "15px", marginBottom: "40px" }}>
            Click on your institution to view candidates, manage events, access voter authentication, and cast votes.
          </p>

          {/* Cards Grid */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "24px", maxWidth: "1200px", margin: "0 auto" }}>
            {universities.map((uni) => (
              <div
                key={uni.id}
                onClick={() => handleSelectUniversity(uni)}
                style={{
                  background: "#131b2e",
                  border: "1px solid #1e293b",
                  borderRadius: "16px",
                  padding: "24px",
                  textAlign: "left",
                  cursor: "pointer",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between"
                }}
              >
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                    <span style={{ fontSize: "36px", background: "#1e293b", padding: "10px", borderRadius: "12px" }}>{uni.icon}</span>
                    <span style={{ background: "#022c22", color: "#34d399", fontSize: "11px", padding: "4px 10px", borderRadius: "12px", border: "1px solid #059669" }}>Elections & Events Active</span>
                  </div>
                  <h3 style={{ fontSize: "18px", margin: "0 0 6px 0" }}>{uni.name}</h3>
                  <p style={{ color: "#60a5fa", fontSize: "12px", margin: "0 0 12px 0" }}>📍 {uni.location}</p>
                  <p style={{ color: "#94a3b8", fontSize: "13px", lineHeight: "1.4" }}>{uni.desc}</p>
                </div>

                <div style={{ borderTop: "1px solid #1e293b", paddingTop: "15px", marginTop: "20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: "12px", color: "#64748b" }}>Eligible: <strong style={{ color: "#cbd5e1" }}>{uni.eligible}</strong></span>
                  <span style={{ color: "#38bdf8", fontWeight: "600", fontSize: "13px" }}>Open Portal ➔</span>
                </div>
              </div>
            ))}
          </div>
        </main>
      ) : (
        <section style={{ marginTop: "30px", maxWidth: "850px", margin: "30px auto 0 auto" }}>
          <button onClick={() => { setSelectedUniversity(null); setMessage(""); setIsLoggedIn(false); setIsOrgRegistered(false); }} style={{ backgroundColor: "#1e293b", color: "#94a3b8", border: "none", padding: "8px 16px", borderRadius: "8px", cursor: "pointer", fontSize: "14px" }}>
            ⬅ Back to University List
          </button>

          <div style={{ background: "#131b2e", border: "1px solid #1e293b", borderRadius: "16px", padding: "24px", marginTop: "20px" }}>
            <h2 style={{ marginTop: 0, display: "flex", alignItems: "center", gap: "10px" }}>
              {selectedUniversity.icon} {selectedUniversity.name}
            </h2>

            {/* Navigation Tabs */}
            <div style={{ display: "flex", gap: "8px", margin: "20px 0", borderBottom: "1px solid #1e293b", paddingBottom: "15px", flexWrap: "wrap" }}>
              <button onClick={() => setActiveTab("overview")} style={tabStyle(activeTab === "overview")}>Parties Overview</button>
              <button onClick={() => setActiveTab("events")} style={tabStyle(activeTab === "events")}>📅 Events ({currentUniInfo.events.length})</button>
              <button onClick={() => setActiveTab("org_manager")} style={tabStyle(activeTab === "org_manager")}>🏢 Event Manager Portal</button>
              <button onClick={() => setActiveTab("login")} style={tabStyle(activeTab === "login")}>{isLoggedIn ? `✅ ${userProfile?.name || "Logged In"}` : "🔑 Voter Auth / Google"}</button>
              <button onClick={() => setActiveTab("vote")} style={tabStyle(activeTab === "vote")}>🗳️ Cast Vote</button>
              <button onClick={() => setActiveTab("results")} style={tabStyle(activeTab === "results")}>📊 Live Results</button>
            </div>

            {message && <div style={{ background: "#1e293b", color: "#38bdf8", padding: "12px 16px", borderRadius: "8px", marginBottom: "20px", fontSize: "14px", borderLeft: "4px solid #38bdf8" }}>{message}</div>}

            {/* TAB 1: OVERVIEW */}
            {activeTab === "overview" && (
              <div>
                <h3 style={{ color: "#cbd5e1" }}>Participating Candidate Parties (3 Parties)</h3>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "15px", marginTop: "15px" }}>
                  {currentUniInfo.parties.map((party, idx) => (
                    <div key={idx} style={{ background: "#0f172a", border: "1px solid #1e293b", padding: "16px", borderRadius: "12px" }}>
                      <div style={{ fontSize: "28px", marginBottom: "8px" }}>{party.icon}</div>
                      <h4 style={{ margin: "0 0 4px 0", color: "#60a5fa" }}>{party.partyName}</h4>
                      <p style={{ color: "#94a3b8", margin: 0, fontSize: "13px" }}>{party.motto}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 2: EVENTS LIST */}
            {activeTab === "events" && (
              <div>
                <h3>University Events & Elections</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginTop: "15px" }}>
                  {currentUniInfo.events.map((ev) => (
                    <div key={ev.id} style={{ background: "#0f172a", border: "1px solid #1e293b", padding: "16px", borderRadius: "12px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <h4 style={{ margin: 0, color: "#38bdf8" }}>{ev.title}</h4>
                        <span style={{ background: "#1e293b", color: "#a7f3d0", fontSize: "12px", padding: "4px 10px", borderRadius: "6px" }}>📅 {ev.date}</span>
                      </div>
                      <p style={{ margin: "6px 0", fontSize: "13px", color: "#cbd5e1" }}>{ev.desc}</p>
                      <span style={{ fontSize: "11px", color: "#64748b" }}>Organized by: <strong>{ev.org}</strong></span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 3: ORGANISATION & EVENT MANAGER */}
            {activeTab === "org_manager" && (
              <div>
                {!isOrgRegistered ? (
                  <form onSubmit={handleRegisterOrg} style={{ maxWidth: "450px" }}>
                    <h3 style={{ marginTop: 0 }}>Register Organisation for {selectedUniversity.name}</h3>
                    <p style={{ color: "#94a3b8", fontSize: "13px" }}>Clubs, Student Unions, or External Bodies must register to host events.</p>
                    
                    <div style={{ marginBottom: "15px" }}>
                      <label style={{ fontSize: "13px", color: "#94a3b8" }}>Organisation / Club Name:</label>
                      <input type="text" value={orgName} onChange={(e) => setOrgName(e.target.value)} style={{ width: "100%", padding: "10px", marginTop: "6px", borderRadius: "8px", border: "1px solid #334155", background: "#0b0f19", color: "#fff" }} placeholder="e.g. Cultural Senate / Tech Club" required />
                    </div>
                    <div style={{ marginBottom: "20px" }}>
                      <label style={{ fontSize: "13px", color: "#94a3b8" }}>Official Email:</label>
                      <input type="email" value={orgEmail} onChange={(e) => setOrgEmail(e.target.value)} style={{ width: "100%", padding: "10px", marginTop: "6px", borderRadius: "8px", border: "1px solid #334155", background: "#0b0f19", color: "#fff" }} placeholder="e.g. org@university.edu" required />
                    </div>
                    <button type="submit" style={{ background: "#2563eb", color: "#fff", padding: "12px", border: "none", borderRadius: "8px", cursor: "pointer", width: "100%", fontWeight: "600" }}>
                      Register Organisation 🏢
                    </button>
                  </form>
                ) : (
                  <form onSubmit={handleAddEvent} style={{ maxWidth: "500px" }}>
                    <div style={{ background: "#064e3b", color: "#34d399", padding: "10px 14px", borderRadius: "8px", marginBottom: "20px", fontSize: "13px" }}>
                      ✅ Registered Organisation: <strong>{orgName}</strong> ({selectedUniversity.name})
                    </div>
                    <h3 style={{ marginTop: 0 }}>Create & Add New Event</h3>

                    <div style={{ marginBottom: "15px" }}>
                      <label style={{ fontSize: "13px", color: "#94a3b8" }}>Event Title:</label>
                      <input type="text" value={eventTitle} onChange={(e) => setEventTitle(e.target.value)} style={{ width: "100%", padding: "10px", marginTop: "6px", borderRadius: "8px", border: "1px solid #334155", background: "#0b0f19", color: "#fff" }} placeholder="e.g. Annual Student Senate Election" required />
                    </div>

                    <div style={{ marginBottom: "15px" }}>
                      <label style={{ fontSize: "13px", color: "#94a3b8" }}>Event Date:</label>
                      <input type="text" value={eventDate} onChange={(e) => setEventDate(e.target.value)} style={{ width: "100%", padding: "10px", marginTop: "6px", borderRadius: "8px", border: "1px solid #334155", background: "#0b0f19", color: "#fff" }} placeholder="e.g. Sep 15, 2026" required />
                    </div>

                    <div style={{ marginBottom: "20px" }}>
                      <label style={{ fontSize: "13px", color: "#94a3b8" }}>Event Description:</label>
                      <textarea value={eventDesc} onChange={(e) => setEventDesc(e.target.value)} rows="3" style={{ width: "100%", padding: "10px", marginTop: "6px", borderRadius: "8px", border: "1px solid #334155", background: "#0b0f19", color: "#fff" }} placeholder="Brief overview of the event or voting guidelines..." required />
                    </div>

                    <button type="submit" style={{ background: "#059669", color: "#fff", padding: "12px", border: "none", borderRadius: "8px", cursor: "pointer", width: "100%", fontWeight: "600" }}>
                      Publish Event on Portal 🚀
                    </button>
                  </form>
                )}
              </div>
            )}

            {/* TAB 4: VOTER AUTH & GOOGLE AUTH */}
            {activeTab === "login" && (
              <div style={{ maxWidth: "450px" }}>
                <h3 style={{ marginTop: 0 }}>Voter Authentication</h3>
                <p style={{ color: "#94a3b8", fontSize: "13px" }}>Choose your preferred login method to vote:</p>

                {/* Login Method Toggle */}
                <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
                  <button onClick={() => setAuthMethod("reg")} style={{ flex: 1, padding: "8px", borderRadius: "6px", border: "none", cursor: "pointer", background: authMethod === "reg" ? "#2563eb" : "#0f172a", color: "#fff", fontWeight: "500" }}>
                    🆔 Registration No.
                  </button>
                  <button onClick={() => setAuthMethod("google")} style={{ flex: 1, padding: "8px", borderRadius: "6px", border: "none", cursor: "pointer", background: authMethod === "google" ? "#ea4335" : "#0f172a", color: "#fff", fontWeight: "500" }}>
                    🌐 Google Auth
                  </button>
                </div>

                {authMethod === "reg" ? (
                  <form onSubmit={handleVoterVerify}>
                    <div style={{ marginBottom: "15px" }}>
                      <label style={{ fontSize: "13px", color: "#94a3b8" }}>Registration / Roll Number:</label>
                      <input type="text" value={regNo} onChange={(e) => setRegNo(e.target.value)} style={{ width: "100%", padding: "10px", marginTop: "6px", borderRadius: "8px", border: "1px solid #334155", background: "#0b0f19", color: "#fff" }} placeholder="e.g. GEU/2026/101" required />
                    </div>
                    <div style={{ marginBottom: "20px" }}>
                      <label style={{ fontSize: "13px", color: "#94a3b8" }}>Full Name:</label>
                      <input type="text" value={voterName} onChange={(e) => setVoterName(e.target.value)} style={{ width: "100%", padding: "10px", marginTop: "6px", borderRadius: "8px", border: "1px solid #334155", background: "#0b0f19", color: "#fff" }} placeholder="e.g. Priyanka Sahu" required />
                    </div>
                    <button type="submit" style={{ background: "#16a34a", color: "#fff", padding: "12px", border: "none", borderRadius: "8px", cursor: "pointer", width: "100%", fontWeight: "600" }}>
                      Login & Proceed to Voting ➔
                    </button>
                  </form>
                ) : (
                  <div style={{ textAlign: "center", background: "#0f172a", padding: "24px", borderRadius: "12px", border: "1px solid #1e293b" }}>
                    <p style={{ color: "#cbd5e1", fontSize: "14px", marginTop: 0 }}>Sign in with your University or Official Google Account:</p>
                    <button onClick={handleGoogleAuth} disabled={loading} style={{ background: "#fff", color: "#1f2937", border: "1px solid #d1d5db", padding: "12px 20px", borderRadius: "8px", cursor: "pointer", fontWeight: "600", fontSize: "14px", display: "inline-flex", alignItems: "center", gap: "10px", width: "100%", justifyContent: "center" }}>
                      <svg width="18" height="18" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/></svg>
                      {loading ? "Authenticating Google Account..." : "Continue with Google"}
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* TAB 5: VOTE */}
            {activeTab === "vote" && (
              <div>
                <h3>Select Candidate Party to Vote</h3>
                <p style={{ color: "#94a3b8", fontSize: "14px" }}>Choose one of the contesting parties below:</p>

                <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginTop: "15px" }}>
                  {currentUniInfo.parties.map((party, idx) => (
                    <div 
                      key={idx}
                      onClick={() => setSelectedParty(party)}
                      style={{
                        background: selectedParty?.partyName === party.partyName ? "#1d4ed8" : "#0f172a",
                        border: selectedParty?.partyName === party.partyName ? "2px solid #60a5fa" : "1px solid #1e293b",
                        padding: "16px",
                        borderRadius: "12px",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "15px"
                      }}
                    >
                      <span style={{ fontSize: "28px" }}>{party.icon}</span>
                      <div>
                        <strong style={{ fontSize: "16px" }}>{party.partyName}</strong>
                        <p style={{ margin: "2px 0 0", fontSize: "13px", color: "#cbd5e1" }}>{party.motto}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <button onClick={handleCastVote} disabled={loading} style={{ marginTop: "24px", background: "#16a34a", color: "#fff", padding: "12px 24px", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "bold", fontSize: "15px" }}>
                  {loading ? "Encrypting & Submitting Vote..." : "Confirm & Cast Official Vote 🗳"}
                </button>
              </div>
            )}

            {/* TAB 6: RESULTS */}
            {activeTab === "results" && (
              <div>
                <h3>Live Election Results</h3>
                <div style={{ marginTop: "15px" }}>
                  {currentUniInfo.parties.map((party, i) => (
                    <div key={i} style={{ marginBottom: "12px", background: "#0f172a", padding: "14px 18px", borderRadius: "10px", border: "1px solid #1e293b", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontSize: "15px", fontWeight: "500" }}>{party.icon} {party.partyName}</span>
                      <span style={{ color: "#4ade80", fontWeight: "bold", background: "#064e3b", padding: "4px 12px", borderRadius: "6px", fontSize: "13px" }}>
                        {votedParty === party.partyName ? "1 Vote (Your Vote)" : "0 Votes"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      )}
    </div>
  );
}

const tabStyle = (isActive) => ({
  background: isActive ? "#2563eb" : "transparent",
  color: isActive ? "#fff" : "#94a3b8",
  border: "none",
  padding: "8px 16px",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: "500",
  fontSize: "14px"
});

export default App;