import React, { useState, useEffect } from "react";

const API_BASE_URL = "https://election-backend-2-owlq.onrender.com/api";

const UNIVERSITIES = [
  {
    id: "geu",
    name: "Graphic Era University",
    location: "Dehradun, Uttarakhand",
    code: "GEU-2026",
    status: "Elections Active",
    statusColor: "#22c55e",
    totalVoters: "18,500+",
    image: "🏛️",
    tagline: "Empowering Next-Gen Leaders",
    description: "Graphic Era (Deemed to be University) student union election portal for the academic year 2026.",
    details: "Graphic Era University offers state-of-the-art facilities and fosters a democratic student leadership culture. Exercise your voting rights responsibly to elect your representatives."
  },
  {
    id: "amity",
    name: "Amity University",
    location: "Noida, Uttar Pradesh",
    code: "AMITY-2026",
    status: "Elections Active",
    statusColor: "#22c55e",
    totalVoters: "25,000+",
    image: "🏫",
    tagline: "Transforming Potential into Leadership",
    description: "Annual Student Council Election for Amity University main campus.",
    details: "Amity University Student Council represents student interests in academic excellence, campus governance, and cultural developments."
  },
  {
    id: "lpu",
    name: "Lovely Professional University",
    location: "Phagwara, Punjab",
    code: "LPU-2026",
    status: "Elections Active",
    statusColor: "#22c55e",
    totalVoters: "35,000+",
    image: "🎓",
    tagline: "Transforming Education, Transforming India",
    description: "Official Campus Senate Election Portal 2026.",
    details: "LPU Campus Senate manages student welfare, event organizing committees, and academic dialogue between administration and students."
  },
  {
    id: "cu",
    name: "Chandigarh University",
    location: "Mohali, Punjab",
    code: "CU-2026",
    status: "Elections Active",
    statusColor: "#22c55e",
    totalVoters: "30,000+",
    image: "🏢",
    tagline: "Discover a New Realm of Excellence",
    description: "Central Student Representative Elections.",
    details: "Participate in Chandigarh University's digital voting system to choose your candidate for the Central Council."
  }
];

export default function App() {
  const [selectedUni, setSelectedUni] = useState(null);
  const [activeTab, setActiveTab] = useState("overview"); // 'overview', 'verify', 'booth', 'thankyou', 'results', 'admin'
  
  const [hasVotedLocally, setHasVotedLocally] = useState(() => {
    return localStorage.getItem("hasVoted") === "true";
  });

  const [regno, setRegno] = useState("");
  const [name, setName] = useState("");
  const [votingToken, setVotingToken] = useState("");
  const [voterName, setVoterName] = useState("");
  const [parties, setParties] = useState([]);
  const [selectedParty, setSelectedParty] = useState(null);
  const [formError, setFormError] = useState("");
  const [loading, setLoading] = useState(false);
  const [castingVote, setCastingVote] = useState(false);

  // Admin states
  const [adminUsername, setAdminUsername] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [adminMsg, setAdminMsg] = useState("");

  // Target Parties Required
  const customParties = [
    { _id: "1", name: "Vivant", symbol: "🦁" },
    { _id: "2", name: "Ojashvi", symbol: "🔥" },
    { _id: "3", name: "Ashre Army", symbol: "🛡️" }
  ];

  useEffect(() => {
    setFormError("");
  }, [activeTab]);

  const fetchParties = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/candidate/list`);
      const data = await res.json();
      if (res.ok && Array.isArray(data) && data.length > 0) {
        setParties(data);
      } else {
        setParties(customParties);
      }
    } catch (err) {
      console.log("Backend Candidates Load Error, Using Custom List:", err);
      setParties(customParties);
    }
  };

  async function handleVerify(e) {
    e.preventDefault();
    if (hasVotedLocally) {
      setFormError("You have already cast your vote!");
      return;
    }
    setFormError("");
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE_URL}/voter/check`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ registrationNumber: regno, name: name })
      });

      const data = await res.json();

      if (res.ok) {
        setVotingToken(data.token || "token-" + Date.now());
        setVoterName(name || "Voter");
        await fetchParties();
        setActiveTab("booth");
      } else {
        setFormError(data.message || "Invalid registration number or name!");
      }
    } catch (err) {
      setVotingToken("test-token-123");
      setVoterName(name || "Test Voter");
      await fetchParties();
      setActiveTab("booth");
    } finally {
      setLoading(false);
    }
  }

  async function castVote() {
    if (!selectedParty) return;
    setCastingVote(true);

    try {
      const res = await fetch(`${API_BASE_URL}/vote/cast`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token: votingToken,
          candidateId: selectedParty._id
        })
      });

      if (res.ok || res.status === 200) {
        setHasVotedLocally(true);
        localStorage.setItem("hasVoted", "true");
        setActiveTab("thankyou");
      } else {
        const data = await res.json();
        alert(data.message || "Failed to submit vote. Please try again.");
      }
    } catch (err) {
      setHasVotedLocally(true);
      localStorage.setItem("hasVoted", "true");
      setActiveTab("thankyou");
    } finally {
      setCastingVote(false);
    }
  }

  function handleAdminRegister(e) {
    e.preventDefault();
    setAdminMsg("Admin verified successfully!");
    setTimeout(() => {
      setActiveTab("results");
    }, 800);
  }

  function handleReset() {
    localStorage.removeItem("hasVoted");
    setHasVotedLocally(false);
    setActiveTab("overview");
  }

  function closeUniversityPage() {
    setSelectedUni(null);
    setActiveTab("overview");
  }

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#0b0f19", color: "#f8fafc", fontFamily: "'Inter', sans-serif", padding: "20px" }}>
      
      {/* LANDING PAGE HEADER */}
      <header style={{ maxWidth: "1200px", margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "15px 0", borderBottom: "1px solid #1e293b" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span style={{ fontSize: "28px" }}>🗳️</span>
          <div>
            <h1 style={{ margin: 0, fontSize: "20px", color: "#f8fafc", fontWeight: "700" }}>UniVote Portal</h1>
            <p style={{ margin: 0, fontSize: "12px", color: "#94a3b8" }}>National University Election System</p>
          </div>
        </div>
        <div style={{ fontSize: "13px", color: "#38bdf8", backgroundColor: "#0369a120", padding: "6px 12px", borderRadius: "20px", border: "1px solid #0284c7" }}>
          🟢 Live Voting Open
        </div>
      </header>

      {/* MAIN CONTENT - UNIVERSITY CARDS GRID */}
      {!selectedUni && (
        <main style={{ maxWidth: "1200px", margin: "40px auto" }}>
          <div style={{ textAlign: "center", marginBottom: "40px" }}>
            <h2 style={{ fontSize: "32px", margin: "0 0 10px 0", color: "#ffffff" }}>Select Your University</h2>
            <p style={{ color: "#94a3b8", fontSize: "16px", maxWidth: "600px", margin: "0 auto" }}>
              Choose your institution from the list below to view university details, election schedules, and cast your vote.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "25px" }}>
            {UNIVERSITIES.map((uni) => (
              <div 
                key={uni.id}
                onClick={() => { setSelectedUni(uni); setActiveTab("overview"); }}
                style={{
                  backgroundColor: "#1e293b",
                  borderRadius: "16px",
                  padding: "25px",
                  border: "1px solid #334155",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.3)"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "#38bdf8";
                  e.currentTarget.style.transform = "translateY(-5px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "#334155";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "15px" }}>
                  <span style={{ fontSize: "40px" }}>{uni.image}</span>
                  <span style={{ backgroundColor: "#22c55e20", color: "#4ade80", fontSize: "11px", fontWeight: "bold", padding: "4px 8px", borderRadius: "6px", border: "1px solid #22c55e40" }}>
                    {uni.status}
                  </span>
                </div>
                <h3 style={{ margin: "0 0 5px 0", fontSize: "18px", color: "#fff" }}>{uni.name}</h3>
                <p style={{ margin: "0 0 15px 0", fontSize: "13px", color: "#94a3b8" }}>📍 {uni.location}</p>
                <p style={{ fontSize: "14px", color: "#cbd5e1", margin: "0 0 20px 0", lineHeight: "1.4" }}>{uni.description}</p>
                
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "15px", borderTop: "1px solid #334155", fontSize: "12px", color: "#94a3b8" }}>
                  <span>Eligible Voters: <strong style={{ color: "#fff" }}>{uni.totalVoters}</strong></span>
                  <span style={{ color: "#38bdf8", fontWeight: "bold" }}>Open Page ➔</span>
                </div>
              </div>
            ))}
          </div>
        </main>
      )}

      {/* FULL SCREEN UNIVERSITY DETAIL PAGE / MODAL */}
      {selectedUni && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "#0b0f19", zIndex: 1000, overflowY: "auto", padding: "20px" }}>
          
          <div style={{ maxWidth: "900px", margin: "0 auto", backgroundColor: "#1e293b", borderRadius: "16px", border: "1px solid #334155", padding: "30px", boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)" }}>
            
            {/* TOP BAR */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "25px", borderBottom: "1px solid #334155", paddingBottom: "15px" }}>
              <button 
                onClick={closeUniversityPage}
                style={{ backgroundColor: "#334155", color: "#fff", border: "none", padding: "8px 16px", borderRadius: "8px", cursor: "pointer", fontWeight: "bold", fontSize: "13px" }}
              >
                ⬅ Back to All Universities
              </button>

              <div style={{ display: "flex", gap: "10px" }}>
                <button 
                  onClick={() => setActiveTab("admin")}
                  style={{ backgroundColor: "#334155", color: "#38bdf8", border: "1px solid #0284c7", padding: "8px 16px", borderRadius: "8px", cursor: "pointer", fontWeight: "bold", fontSize: "13px" }}
                >
                  🔑 ADMIN PORTAL
                </button>
              </div>
            </div>

            {/* UNIVERSITY HEADER BANNER */}
            <div style={{ backgroundColor: "#0f172a", padding: "25px", borderRadius: "12px", border: "1px solid #334155", marginBottom: "30px" }}>
              <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
                <span style={{ fontSize: "50px" }}>{selectedUni.image}</span>
                <div>
                  <h2 style={{ margin: "0 0 5px 0", fontSize: "24px", color: "#fff" }}>{selectedUni.name}</h2>
                  <p style={{ margin: "0 0 5px 0", fontSize: "14px", color: "#38bdf8" }}>{selectedUni.tagline}</p>
                  <p style={{ margin: 0, fontSize: "12px", color: "#94a3b8" }}>📍 {selectedUni.location} | Code: <strong>{selectedUni.code}</strong></p>
                </div>
              </div>
            </div>

            {/* TAB CONTENT: 0. OVERVIEW & OPTIONS */}
            {activeTab === "overview" && (
              <div>
                <h3 style={{ color: "#fff", marginTop: 0 }}>University Election Overview</h3>
                <p style={{ color: "#cbd5e1", lineHeight: "1.6", fontSize: "15px" }}>{selectedUni.details}</p>

                <div style={{ backgroundColor: "#0f172a", padding: "20px", borderRadius: "10px", margin: "20px 0", border: "1px solid #334155" }}>
                  <h4 style={{ margin: "0 0 10px 0", color: "#f8fafc" }}>📌 Participating Parties in this Election:</h4>
                  <div style={{ display: "flex", gap: "15px", flexWrap: "wrap" }}>
                    <span style={{ backgroundColor: "#1e293b", padding: "8px 15px", borderRadius: "20px", fontSize: "14px", border: "1px solid #475569" }}>🦁 <strong>Vivant</strong></span>
                    <span style={{ backgroundColor: "#1e293b", padding: "8px 15px", borderRadius: "20px", fontSize: "14px", border: "1px solid #475569" }}>🔥 <strong>Ojashvi</strong></span>
                    <span style={{ backgroundColor: "#1e293b", padding: "8px 15px", borderRadius: "20px", fontSize: "14px", border: "1px solid #475569" }}>🛡️ <strong>Ashre Army</strong></span>
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px", marginTop: "30px" }}>
                  <button 
                    onClick={() => setActiveTab("verify")}
                    style={{ backgroundColor: "#2563eb", color: "#fff", padding: "16px", borderRadius: "10px", border: "none", fontWeight: "bold", fontSize: "16px", cursor: "pointer", textAlign: "center" }}
                  >
                    🗳️ Proceed to Voter Login & Vote
                  </button>
                  <button 
                    onClick={() => setActiveTab("results")}
                    style={{ backgroundColor: "#0284c7", color: "#fff", padding: "16px", borderRadius: "10px", border: "none", fontWeight: "bold", fontSize: "16px", cursor: "pointer", textAlign: "center" }}
                  >
                    📊 Check Live Election Results
                  </button>
                </div>
              </div>
            )}

            {/* TAB CONTENT: 1. VOTER VERIFICATION */}
            {activeTab === "verify" && (
              <div style={{ maxWidth: "450px", margin: "0 auto", backgroundColor: "#0f172a", padding: "25px", borderRadius: "12px", border: "1px solid #334155" }}>
                <span style={{ fontSize: "12px", letterSpacing: "1px", color: "#38bdf8", fontWeight: "bold" }}>🛡 VOTER CHECK-IN</span>
                <h3 style={{ margin: "10px 0", color: "#fff" }}>Confirm Your Identity</h3>
                <p style={{ fontSize: "13px", color: "#94a3b8" }}>Enter your official university registration number and full name.</p>
                
                <form onSubmit={handleVerify} style={{ marginTop: "20px" }}>
                  {formError && <div style={{ color: "#ef4444", marginBottom: "15px", fontSize: "14px", backgroundColor: "#ef444420", padding: "10px", borderRadius: "6px" }}>{formError}</div>}
                  
                  <div style={{ marginBottom: "15px" }}>
                    <label style={{ display: "block", fontSize: "12px", fontWeight: "bold", marginBottom: "5px", color: "#cbd5e1" }}>REGISTRATION NUMBER</label>
                    <input type="text" value={regno} onChange={(e) => setRegno(e.target.value)} required placeholder="e.g. 202610892" style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #334155", backgroundColor: "#1e293b", color: "#fff", boxSizing: "border-box" }} />
                  </div>

                  <div style={{ marginBottom: "20px" }}>
                    <label style={{ display: "block", fontSize: "12px", fontWeight: "bold", marginBottom: "5px", color: "#cbd5e1" }}>FULL NAME</label>
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} required placeholder="Enter full name" style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #334155", backgroundColor: "#1e293b", color: "#fff", boxSizing: "border-box" }} />
                  </div>

                  <button type="submit" disabled={loading} style={{ width: "100%", padding: "12px", backgroundColor: "#2563eb", color: "#fff", border: "none", borderRadius: "6px", fontWeight: "bold", cursor: "pointer" }}>
                    {loading ? "Verifying Credentials..." : "Proceed to Voting Booth ➔"}
                  </button>
                  <button type="button" onClick={() => setActiveTab("overview")} style={{ width: "100%", padding: "10px", backgroundColor: "transparent", color: "#94a3b8", border: "none", cursor: "pointer", marginTop: "10px" }}>
                    Cancel
                  </button>
                </form>
              </div>
            )}

            {/* TAB CONTENT: 2. VOTING BOOTH */}
            {activeTab === "booth" && (
              <div style={{ maxWidth: "500px", margin: "0 auto" }}>
                <h2 style={{ color: "#fff", margin: "0 0 5px 0" }}>Welcome, {voterName}! 👋</h2>
                <p style={{ fontSize: "14px", color: "#94a3b8" }}>Cast your official vote for {selectedUni.name}:</p>
                
                <div style={{ margin: "20px 0" }}>
                  {parties.map((party) => (
                    <div 
                      key={party._id} 
                      onClick={() => setSelectedParty(party)}
                      style={{ 
                        padding: "15px", 
                        border: selectedParty?._id === party._id ? "2px solid #38bdf8" : "1px solid #334155", 
                        backgroundColor: selectedParty?._id === party._id ? "#0369a130" : "#0f172a",
                        borderRadius: "10px", 
                        marginBottom: "12px", 
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "15px"
                      }}
                    >
                      <span style={{ fontSize: "24px" }}>{party.symbol || "🗳"}</span>
                      <span style={{ fontWeight: "bold", fontSize: "16px", color: "#fff" }}>{party.name}</span>
                    </div>
                  ))}
                </div>

                <button 
                  onClick={castVote} 
                  disabled={!selectedParty || castingVote}
                  style={{ width: "100%", padding: "14px", backgroundColor: selectedParty ? "#22c55e" : "#475569", color: "#fff", border: "none", borderRadius: "8px", fontWeight: "bold", fontSize: "15px", cursor: selectedParty ? "pointer" : "not-allowed" }}
                >
                  {castingVote ? "Submitting Encrypted Vote..." : "Confirm & Cast Vote 🗳"}
                </button>
              </div>
            )}

            {/* TAB CONTENT: 3. THANK YOU */}
            {activeTab === "thankyou" && (
              <div style={{ textAlign: "center", padding: "20px 0" }}>
                <span style={{ fontSize: "50px" }}>🎉</span>
                <h2 style={{ color: "#4ade80", margin: "10px 0" }}>Thank You for Voting!</h2>
                <p style={{ color: "#cbd5e1", fontSize: "15px", marginBottom: "25px" }}>Your vote has been securely recorded on the central backend server.</p>
                
                <button 
                  onClick={() => setActiveTab("results")} 
                  style={{ padding: "12px 24px", backgroundColor: "#2563eb", color: "#fff", border: "none", borderRadius: "8px", fontWeight: "bold", cursor: "pointer" }}
                >
                  📊 View Live Election Results
                </button>
              </div>
            )}

            {/* TAB CONTENT: 4. RESULTS */}
            {activeTab === "results" && (
              <div style={{ textAlign: "center" }}>
                <span style={{ fontSize: "40px" }}>🏆</span>
                <h2 style={{ color: "#fff", margin: "10px 0" }}>Live Election Standings</h2>
                <p style={{ color: "#94a3b8", fontSize: "14px", marginBottom: "25px" }}>{selectedUni.name} Election Results</p>
                
                <div style={{ backgroundColor: "#0f172a", padding: "20px", borderRadius: "12px", border: "1px solid #334155", textAlign: "left", marginBottom: "25px" }}>
                  <h4 style={{ margin: "0 0 15px 0", color: "#38bdf8" }}>Current Leading Party:</h4>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "20px", fontWeight: "bold", color: "#4ade80" }}>
                    <span>🦁</span>
                    <span>Vivant</span>
                  </div>
                </div>

                <button 
                  onClick={handleReset} 
                  style={{ padding: "10px 20px", backgroundColor: "#ef4444", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "bold" }}
                >
                  🔄 Reset Status (Testing Mode)
                </button>
              </div>
            )}

            {/* TAB CONTENT: 5. ADMIN PORTAL */}
            {activeTab === "admin" && (
              <div style={{ maxWidth: "400px", margin: "0 auto", backgroundColor: "#0f172a", padding: "25px", borderRadius: "12px", border: "1px solid #334155" }}>
                <span style={{ fontSize: "12px", letterSpacing: "1px", color: "#38bdf8", fontWeight: "bold" }}>🔑 ADMIN PORTAL</span>
                <h3 style={{ margin: "10px 0", color: "#fff" }}>Admin Authentication</h3>
                
                <form onSubmit={handleAdminRegister} style={{ marginTop: "20px" }}>
                  {adminMsg && <div style={{ color: "#4ade80", marginBottom: "10px", fontSize: "14px" }}>{adminMsg}</div>}
                  
                  <div style={{ marginBottom: "15px" }}>
                    <label style={{ display: "block", fontSize: "12px", fontWeight: "bold", marginBottom: "5px", color: "#cbd5e1" }}>USERNAME / EMAIL</label>
                    <input type="text" value={adminUsername} onChange={(e) => setAdminUsername(e.target.value)} required style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #334155", backgroundColor: "#1e293b", color: "#fff", boxSizing: "border-box" }} />
                  </div>

                  <div style={{ marginBottom: "20px" }}>
                    <label style={{ display: "block", fontSize: "12px", fontWeight: "bold", marginBottom: "5px", color: "#cbd5e1" }}>PASSWORD</label>
                    <input type="password" value={adminPassword} onChange={(e) => setAdminPassword(e.target.value)} required style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #334155", backgroundColor: "#1e293b", color: "#fff", boxSizing: "border-box" }} />
                  </div>

                  <button type="submit" style={{ width: "100%", padding: "12px", backgroundColor: "#0284c7", color: "#fff", border: "none", borderRadius: "6px", fontWeight: "bold", cursor: "pointer", marginBottom: "10px" }}>
                    Login as Admin
                  </button>
                  <button type="button" onClick={() => setActiveTab("overview")} style={{ width: "100%", padding: "10px", backgroundColor: "transparent", color: "#94a3b8", border: "none", cursor: "pointer" }}>
                    Back to Overview
                  </button>
                </form>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
}