import React, { useState } from "react";

const UNIVERSITY_DATA = {
  "Graphic Era University": [
    { id: "geu_1", partyName: "GEU United Front", motto: "Tech & Innovation Excellence" },
    { id: "geu_2", partyName: "Pioneer Leadership Club", motto: "Student Welfare & Growth" }
  ],
  "Amity University": [
    { id: "amity_1", partyName: "Amity Vanguard", motto: "Empowering Next-Gen Leaders" },
    { id: "amity_2", partyName: "Innovators League", motto: "Creativity & Research First" }
  ],
  "Lovely Professional University": [
    { id: "lpu_1", partyName: "LPU Campus Senate", motto: "Global Vision & Leadership" },
    { id: "lpu_2", partyName: "Youth Voice LPU", motto: "Academic & Campus Harmony" }
  ],
  "Chandigarh University": [
    { id: "cu_1", partyName: "CU Rising Alliance", motto: "Unity, Discipline & Action" },
    { id: "cu_2", partyName: "Chandigarh Youth Forum", motto: "Progress & Student Rights" }
  ]
};

function App() {
  const [selectedUniversity, setSelectedUniversity] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");

  const [candidates, setCandidates] = useState([]);
  const [regNo, setRegNo] = useState("");
  const [voterName, setVoterName] = useState("");
  const [selectedParty, setSelectedParty] = useState(null);
  const [votedParty, setVotedParty] = useState(null);
  
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const universities = [
    { id: "geu", name: "Graphic Era University", location: "Dehradun", icon: "🏛️" },
    { id: "amity", name: "Amity University", location: "Noida", icon: "🏫" },
    { id: "lpu", name: "Lovely Professional University", location: "Phagwara", icon: "🎓" },
    { id: "cu", name: "Chandigarh University", location: "Mohali", icon: "🏢" }
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
    setMessage("");
    setActiveTab("booth");
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
    <div style={{ backgroundColor: "#020617", color: "#fff", minHeight: "100vh", fontFamily: "sans-serif", padding: "20px" }}>
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #334155", paddingBottom: "15px" }}>
        <h1 style={{ margin: 0, fontSize: "24px" }}>🗳️ UniVote Pro</h1>
        <span style={{ backgroundColor: "#166534", color: "#4ade80", padding: "5px 12px", borderRadius: "15px", fontSize: "14px" }}>
          System Active ✅
        </span>
      </header>

      {!selectedUniversity ? (
        <main style={{ marginTop: "40px", textAlign: "center" }}>
          <h2>Select Your University</h2>
          <p style={{ color: "#94a3b8" }}>Click on your institution to view candidates and cast your vote.</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "20px", marginTop: "30px" }}>
            {universities.map((uni) => (
              <div
                key={uni.id}
                onClick={() => handleSelectUniversity(uni)}
                style={{ background: "#0f172a", border: "1px solid #1e293b", borderRadius: "12px", padding: "20px", cursor: "pointer" }}
              >
                <div style={{ fontSize: "40px" }}>{uni.icon}</div>
                <h3>{uni.name}</h3>
                <p style={{ color: "#64748b" }}>{uni.location}</p>
              </div>
            ))}
          </div>
        </main>
      ) : (
        <section style={{ marginTop: "20px" }}>
          <button onClick={() => { setSelectedUniversity(null); setMessage(""); }} style={{ backgroundColor: "#334155", color: "#fff", border: "none", padding: "8px 15px", borderRadius: "6px", cursor: "pointer" }}>
            ⬅ Back to Universities
          </button>

          <h2 style={{ marginTop: "15px" }}>{selectedUniversity.icon} {selectedUniversity.name}</h2>

          <div style={{ display: "flex", gap: "10px", margin: "20px 0" }}>
            <button onClick={() => setActiveTab("overview")} style={tabStyle(activeTab === "overview")}>Overview</button>
            <button onClick={() => setActiveTab("verify")} style={tabStyle(activeTab === "verify" || activeTab === "booth")}>Login & Vote</button>
            <button onClick={() => setActiveTab("results")} style={tabStyle(activeTab === "results")}>Results 📊</button>
          </div>

          {message && <div style={{ background: "#1e293b", color: "#38bdf8", padding: "12px", borderRadius: "8px", marginBottom: "15px" }}>{message}</div>}

          {activeTab === "overview" && (
            <div>
              <h3>Participating Parties at {selectedUniversity.name}</h3>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "15px" }}>
                {candidates.map((party, idx) => (
                  <div key={idx} style={{ background: "#1e293b", padding: "15px", borderRadius: "8px" }}>
                    <h4 style={{ margin: "0 0 5px 0", color: "#60a5fa" }}>{party.partyName}</h4>
                    <p style={{ color: "#94a3b8", margin: 0, fontSize: "14px" }}>{party.motto}</p>
                  </div>
                ))}
              </div>
              <button onClick={() => setActiveTab("verify")} style={{ marginTop: "20px", background: "#2563eb", color: "#fff", padding: "12px 24px", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "bold" }}>
                🗳️ Click Here to Login & Cast Vote Now
              </button>
            </div>
          )}

          {activeTab === "verify" && (
            <form onSubmit={handleVoterVerify} style={{ background: "#0f172a", padding: "20px", borderRadius: "10px", maxWidth: "400px" }}>
              <h3>Voter Authentication</h3>
              <div style={{ marginBottom: "15px" }}>
                <label>Registration Number:</label>
                <input type="text" value={regNo} onChange={(e) => setRegNo(e.target.value)} style={{ width: "100%", padding: "10px", marginTop: "5px", borderRadius: "6px", border: "1px solid #334155", background: "#020617", color: "#fff" }} placeholder="e.g. 20261001" required />
              </div>
              <div style={{ marginBottom: "15px" }}>
                <label>Full Name:</label>
                <input type="text" value={voterName} onChange={(e) => setVoterName(e.target.value)} style={{ width: "100%", padding: "10px", marginTop: "5px", borderRadius: "6px", border: "1px solid #334155", background: "#020617", color: "#fff" }} placeholder="e.g. Rahul Sharma" required />
              </div>
              <button type="submit" style={{ background: "#16a34a", color: "#fff", padding: "10px 20px", border: "none", borderRadius: "6px", cursor: "pointer", width: "100%" }}>
                Authenticate & Open Voting Booth ➔
              </button>
            </form>
          )}

          {activeTab === "booth" && (
            <div>
              <h3>Welcome, {voterName}! 👋</h3>
              <p>Select your candidate party for {selectedUniversity.name}:</p>

              <div style={{ display: "flex", flexDirection: "column", gap: "10px", maxWidth: "400px" }}>
                {candidates.map((party, idx) => (
                  <div 
                    key={idx}
                    onClick={() => setSelectedParty(party)}
                    style={{
                      background: selectedParty?.partyName === party.partyName ? "#1d4ed8" : "#1e293b",
                      border: "1px solid #3b82f6",
                      padding: "15px",
                      borderRadius: "8px",
                      cursor: "pointer"
                    }}
                  >
                    <strong>{party.partyName}</strong>
                    <p style={{ margin: "5px 0 0", fontSize: "12px", color: "#cbd5e1" }}>{party.motto}</p>
                  </div>
                ))}
              </div>

              <button onClick={handleCastVote} disabled={loading} style={{ marginTop: "20px", background: "#16a34a", color: "#fff", padding: "12px 24px", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "bold" }}>
                {loading ? "Encrypting & Submitting Vote..." : "Confirm & Cast Official Vote 🗳"}
              </button>
            </div>
          )}

          {activeTab === "results" && (
            <div>
              <h3>Live Election Results</h3>
              <div style={{ maxWidth: "500px" }}>
                {candidates.map((party, i) => (
                  <div key={i} style={{ marginBottom: "15px", background: "#1e293b", padding: "12px", borderRadius: "8px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span>{party.partyName}</span>
                      <span style={{ color: "#4ade80", fontWeight: "bold", background: "#064e3b", padding: "4px 10px", borderRadius: "6px" }}>
                        {votedParty === party.partyName ? "1 Vote (Your Vote)" : "0 Votes"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>
      )}
    </div>
  );
}

const tabStyle = (isActive) => ({
  background: isActive ? "#2563eb" : "#0f172a",
  color: "#fff",
  border: "1px solid #1e293b",
  padding: "8px 16px",
  borderRadius: "6px",
  cursor: "pointer"
});

export default App;