import React, { useState } from "react";

const UNIVERSITY_DATA = {
  "Graphic Era University": [
    { id: "geu_1", partyName: "Vivant", motto: "Leadership & Progress", icon: "🦁" },
    { id: "geu_2", partyName: "Ojashvi", motto: "Youth Empowerment", icon: "🔥" },
    { id: "geu_3", partyName: "Ashre Army", motto: "Unity & Discipline", icon: "🛡️" }
  ],
  "Amity University": [
    { id: "amity_1", partyName: "Amity Vanguard", motto: "Empowering Next-Gen Leaders", icon: "🚀" },
    { id: "amity_2", partyName: "Innovators League", motto: "Creativity & Research First", icon: "💡" },
    { id: "amity_3", partyName: "Youth Alliance", motto: "Student Unity & Future", icon: "⭐" }
  ],
  "Lovely Professional University": [
    { id: "lpu_1", partyName: "LPU Campus Senate", motto: "Global Vision & Leadership", icon: "🏛️" },
    { id: "lpu_2", partyName: "Youth Voice LPU", motto: "Academic & Campus Harmony", icon: "📢" },
    { id: "lpu_3", partyName: "United Students Front", motto: "Equality & Innovation", icon: "🌐" }
  ],
  "Chandigarh University": [
    { id: "cu_1", partyName: "CU Rising Alliance", motto: "Unity, Discipline & Action", icon: "🦅" },
    { id: "cu_2", partyName: "Chandigarh Youth Forum", motto: "Progress & Student Rights", icon: "⚡" },
    { id: "cu_3", partyName: "Pioneer Student Club", motto: "Excellence in Action", icon: "🏆" }
  ]
};

function App() {
  const [selectedUniversity, setSelectedUniversity] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");

  const [candidates, setCandidates] = useState([]);
  const [regNo, setRegNo] = useState("");
  const [voterName, setVoterName] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [selectedParty, setSelectedParty] = useState(null);
  const [votedParty, setVotedParty] = useState(null);
  
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
    setCandidates(UNIVERSITY_DATA[uni.name] || []);
    setActiveTab("overview");
    setMessage("");
    setSelectedParty(null);
  };

  const handleVoterVerify = (e) => {
    e.preventDefault();
    if (!regNo || !voterName) {
      setMessage("Please enter both Registration Number and Name.");
      return;
    }
    setIsLoggedIn(true);
    setMessage(`Welcome ${voterName}! You are logged in successfully.`);
    setActiveTab("vote");
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

  return (
    <div style={{ backgroundColor: "#0b0f19", color: "#fff", minHeight: "100vh", fontFamily: "'Inter', sans-serif", padding: "20px 40px" }}>
      {/* Header */}
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #1e293b", paddingBottom: "20px" }}>
        <div>
          <h1 style={{ margin: 0, fontSize: "24px", display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ background: "#2563eb", padding: "6px 10px", borderRadius: "8px" }}>🗳️</span> UniVote Pro
          </h1>
          <p style={{ margin: "4px 0 0 0", color: "#64748b", fontSize: "13px" }}>National Campus Election Portal</p>
        </div>
        <div style={{ background: "#064e3b", color: "#4ade80", padding: "6px 14px", borderRadius: "20px", fontSize: "13px", border: "1px solid #10b981", display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{ width: "8px", height: "8px", background: "#4ade80", borderRadius: "50%" }}></span> Live Connection Active
        </div>
      </header>

      {!selectedUniversity ? (
        <main style={{ marginTop: "50px", textAlign: "center" }}>
          <h2 style={{ fontSize: "32px", marginBottom: "8px", fontWeight: "700" }}>Select Your University</h2>
          <p style={{ color: "#94a3b8", fontSize: "15px", marginBottom: "40px" }}>
            Click on your institution to view candidates, access live voter authentication, and submit your vote.
          </p>

          {/* Cards Grid like your Screenshot */}
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
                  position: "relative",
                  transition: "transform 0.2s",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between"
                }}
              >
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                    <span style={{ fontSize: "36px", background: "#1e293b", padding: "10px", borderRadius: "12px" }}>{uni.icon}</span>
                    <span style={{ background: "#022c22", color: "#34d399", fontSize: "11px", padding: "4px 10px", borderRadius: "12px", border: "1px solid #059669" }}>Elections Active</span>
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
        <section style={{ marginTop: "30px", maxWidth: "800px", margin: "30px auto 0 auto" }}>
          <button onClick={() => { setSelectedUniversity(null); setMessage(""); setIsLoggedIn(false); }} style={{ backgroundColor: "#1e293b", color: "#94a3b8", border: "none", padding: "8px 16px", borderRadius: "8px", cursor: "pointer", fontSize: "14px" }}>
            ⬅ Back to University List
          </button>

          <div style={{ background: "#131b2e", border: "1px solid #1e293b", borderRadius: "16px", padding: "24px", marginTop: "20px" }}>
            <h2 style={{ marginTop: 0, display: "flex", alignItems: "center", gap: "10px" }}>
              {selectedUniversity.icon} {selectedUniversity.name}
            </h2>

            {/* Navigation Tabs (Overview, Login, Vote, Results) */}
            <div style={{ display: "flex", gap: "10px", margin: "20px 0", borderBottom: "1px solid #1e293b", paddingBottom: "15px" }}>
              <button onClick={() => setActiveTab("overview")} style={tabStyle(activeTab === "overview")}>Parties Overview</button>
              <button onClick={() => setActiveTab("login")} style={tabStyle(activeTab === "login")}>
                {isLoggedIn ? "✅ Logged In" : "🔑 Voter Login"}
              </button>
              <button onClick={() => setActiveTab("vote")} style={tabStyle(activeTab === "vote")}>🗳️ Cast Vote</button>
              <button onClick={() => setActiveTab("results")} style={tabStyle(activeTab === "results")}>📊 Live Results</button>
            </div>

            {message && <div style={{ background: "#1e293b", color: "#38bdf8", padding: "12px 16px", borderRadius: "8px", marginBottom: "20px", fontSize: "14px", borderLeft: "4px solid #38bdf8" }}>{message}</div>}

            {/* TAB 1: OVERVIEW */}
            {activeTab === "overview" && (
              <div>
                <h3 style={{ color: "#cbd5e1" }}>Participating Candidate Parties (3 Parties)</h3>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "15px", marginTop: "15px" }}>
                  {candidates.map((party, idx) => (
                    <div key={idx} style={{ background: "#0f172a", border: "1px solid #1e293b", padding: "16px", borderRadius: "12px" }}>
                      <div style={{ fontSize: "28px", marginBottom: "8px" }}>{party.icon}</div>
                      <h4 style={{ margin: "0 0 4px 0", color: "#60a5fa" }}>{party.partyName}</h4>
                      <p style={{ color: "#94a3b8", margin: 0, fontSize: "13px" }}>{party.motto}</p>
                    </div>
                  ))}
                </div>
                <div style={{ marginTop: "25px", display: "flex", gap: "15px" }}>
                  <button onClick={() => setActiveTab("login")} style={{ background: "#2563eb", color: "#fff", padding: "12px 20px", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "600" }}>
                    Login to Vote 🔑
                  </button>
                  <button onClick={() => setActiveTab("vote")} style={{ background: "#059669", color: "#fff", padding: "12px 20px", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "600" }}>
                    Direct Vote Booth 🗳️
                  </button>
                </div>
              </div>
            )}

            {/* TAB 2: LOGIN */}
            {activeTab === "login" && (
              <form onSubmit={handleVoterVerify} style={{ maxWidth: "400px" }}>
                <h3 style={{ marginTop: 0 }}>Voter Authentication Login</h3>
                <div style={{ marginBottom: "15px" }}>
                  <label style={{ fontSize: "13px", color: "#94a3b8" }}>Registration Number / Roll No:</label>
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
            )}

            {/* TAB 3: VOTE */}
            {activeTab === "vote" && (
              <div>
                <h3>Select Candidate Party to Vote</h3>
                <p style={{ color: "#94a3b8", fontSize: "14px" }}>Choose one of the 3 contesting parties below:</p>

                <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginTop: "15px" }}>
                  {candidates.map((party, idx) => (
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

            {/* TAB 4: RESULTS */}
            {activeTab === "results" && (
              <div>
                <h3>Live Election Results</h3>
                <div style={{ marginTop: "15px" }}>
                  {candidates.map((party, i) => (
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