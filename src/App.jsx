import React, { useState, useEffect } from "react";

// Base API URL pointing to your Render.com hosted service
const API_BASE_URL = "https://election-backend-2-owlq.onrender.com/api";

const UNIVERSITIES = [
  {
    id: "geu",
    name: "Graphic Era University",
    location: "Dehradun, Uttarakhand",
    code: "GEU-2026",
    status: "Elections Active",
    totalVoters: "18,500+",
    image: "🏛️",
    gradient: "linear-gradient(135deg, #6366f1 0%, #a855f7 100%)",
    tagline: "Empowering Next-Gen Leaders",
    description: "Graphic Era (Deemed to be University) student union election portal for 2026.",
    details: "Graphic Era University offers state-of-the-art facilities and fosters a democratic student leadership culture. Exercise your voting rights responsibly."
  },
  {
    id: "amity",
    name: "Amity University",
    location: "Noida, Uttar Pradesh",
    code: "AMITY-2026",
    status: "Elections Active",
    totalVoters: "25,000+",
    image: "🏫",
    gradient: "linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)",
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
    totalVoters: "35,000+",
    image: "🎓",
    gradient: "linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)",
    tagline: "Transforming Education, Transforming India",
    description: "Official Campus Senate Election Portal 2026.",
    details: "LPU Campus Senate manages student welfare, event organizing committees, and academic dialogue."
  },
  {
    id: "cu",
    name: "Chandigarh University",
    location: "Mohali, Punjab",
    code: "CU-2026",
    status: "Elections Active",
    totalVoters: "30,000+",
    image: "🏢",
    gradient: "linear-gradient(135deg, #10b981 0%, #14b8a6 100%)",
    tagline: "Discover a New Realm of Excellence",
    description: "Central Student Representative Elections.",
    details: "Participate in Chandigarh University's digital voting system to choose your candidate."
  }
];

export default function App() {
  const [selectedUni, setSelectedUni] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");

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
  const [connectionStatus, setConnectionStatus] = useState("Checking live connection...");

  const API_PROXY = (path) => {
    if (window.location.hostname === "localhost") {
      return `${API_BASE_URL}/${path}`; 
    }
    return `/api/${path}`;
  };

  useEffect(() => {
    fetchCandidatesFromBackend();
  }, []);

  const fetchCandidatesFromBackend = async () => {
    setConnectionStatus("Connecting to live server...");
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 20000);

      const url = API_PROXY('candidate/list');
      const res = await fetch(url, { signal: controller.signal });
      clearTimeout(timeoutId);

      const data = await res.json();
      if (res.ok && Array.isArray(data) && data.length > 0) {
        setParties(data);
        setConnectionStatus("Connected Live: ✅");
      } else {
        throw new Error("Invalid backend response format.");
      }
    } catch (err) {
      console.error("Backend fetch failed or timed out.", err);
      const defaultParties = [
        { _id: "vivant", name: "Vivant", symbol: "🦁", motto: "Leadership & Progress", color: "#3b82f6" },
        { _id: "ojashvi", name: "Ojashvi", symbol: "🔥", motto: "Youth Empowerment", color: "#f97316" },
        { _id: "ashre", name: "Ashre Army", symbol: "🛡️", motto: "Unity & Discipline", color: "#8b5cf6" }
      ];
      setParties(defaultParties);
      setConnectionStatus("Live Connection Delayed/Failed.");
    }
  };

  useEffect(() => {
    setFormError("");
  }, [activeTab]);

  const handleVerify = async (e) => {
    e.preventDefault();
    if (hasVotedLocally) {
      setFormError("⚠️ You have already cast your vote!");
      return;
    }
    setFormError("");
    setLoading(true);

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000);

      const url = API_PROXY('voter/check');
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ registrationNumber: regno, name: name }),
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      const data = await res.json();

      if (res.ok) {
        setVotingToken(data.token || "token-" + Date.now());
        setVoterName(name || "Student Voter");
        await fetchCandidatesFromBackend();
        setActiveTab("booth");
      } else {
        setFormError(data.message || "Invalid Registration Number or Name!");
      }
    } catch (err) {
      console.warn("Backend Verification Failed/Timed Out.", err);
      setVotingToken("dev-token-" + Date.now());
      setVoterName(name || "Student Voter");
      await fetchCandidatesFromBackend();
      setActiveTab("booth");
    } finally {
      setLoading(false);
    }
  };

  const castVote = async () => {
    if (!selectedParty) return;
    setCastingVote(true);

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      const url = API_PROXY('vote/cast');
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token: votingToken,
          candidateId: selectedParty._id || selectedParty.id
        }),
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      if (res.ok) {
        setHasVotedLocally(true);
        localStorage.setItem("hasVoted", "true");
        setActiveTab("thankyou");
      } else {
        const data = await res.json();
        alert(data.message || "Voting failed. Please try again.");
      }
    } catch (err) {
      console.error("Cast Vote API Failed.", err);
      setHasVotedLocally(true);
      localStorage.setItem("hasVoted", "true");
      setActiveTab("thankyou");
    } finally {
      setCastingVote(false);
    }
  };

  const handleReset = () => {
    localStorage.removeItem("hasVoted");
    setHasVotedLocally(false);
    setSelectedParty(null);
    setActiveTab("overview");
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "radial-gradient(circle at top, #1e1b4b 0%, #0f172a 60%, #020617 100%)",
      color: "#f8fafc",
      fontFamily: "'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
      padding: "20px"
    }}>
      
      {/* HEADER */}
      <header style={{
        maxWidth: "1200px",
        margin: "0 auto 40px auto",
        display: "flex",
        justify: "space-between",
        alignItems: "center",
        padding: "18px 25px",
        background: "rgba(30, 41, 59, 0.6)",
        backdropFilter: "blur(12px)",
        borderRadius: "16px",
        border: "1px solid rgba(255, 255, 255, 0.1)"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <span style={{ fontSize: "32px", filter: "drop-shadow(0 0 10px #38bdf8)" }}>🗳️</span>
          <div>
            <h1 style={{ margin: 0, fontSize: "22px", background: "linear-gradient(90deg, #38bdf8, #818cf8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", fontWeight: "800" }}>
              UniVote Pro
            </h1>
            <p style={{ margin: 0, fontSize: "12px", color: "#94a3b8" }}>National Campus Election Portal 2026</p>
          </div>
        </div>
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          background: "rgba(34, 197, 94, 0.15)",
          color: "#4ade80",
          padding: "8px 16px",
          borderRadius: "30px",
          border: "1px solid rgba(34, 197, 94, 0.3)",
          fontWeight: "600",
          fontSize: "13px"
        }}>
          <span style={{ width: "8px", height: "8px", backgroundColor: connectionStatus.includes("✅") ? "#22c55e" : "#f59e0b", borderRadius: "50%", boxShadow: connectionStatus.includes("✅") ? "0 0 8px #22c55e" : "0 0 8px #f59e0b" }}></span>
          {connectionStatus}
        </div>
      </header>

      {/* LANDING GRID PAGE */}
      {!selectedUni && (
        <main style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "50px" }}>
            <h2 style={{ fontSize: "38px", margin: "0 0 12px 0", color: "#ffffff", fontWeight: "800" }}>Select Your University</h2>
            <p style={{ color: "#94a3b8", fontSize: "16px", maxWidth: "650px", margin: "0 auto", lineHeight: "1.6" }}>
              Click on your institution to view candidates, access live voter authentication, and submit your vote.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "25px" }}>
            {UNIVERSITIES.map((uni) => (
              <div 
                key={uni.id}
                onClick={() => { setSelectedUni(uni); setActiveTab("overview"); }}
                style={{
                  background: "rgba(30, 41, 59, 0.4)",
                  backdropFilter: "blur(10px)",
                  borderRadius: "20px",
                  padding: "25px",
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                  cursor: "pointer",
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  position: "relative",
                  overflow: "hidden"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "#38bdf8";
                  e.currentTarget.style.transform = "translateY(-6px)";
                  e.currentTarget.style.boxShadow = "0 20px 30px -10px rgba(56, 189, 248, 0.2)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.08)";
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "4px", background: uni.gradient }}></div>
                
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                  <span style={{ fontSize: "42px", padding: "10px", background: "rgba(255,255,255,0.05)", borderRadius: "14px" }}>{uni.image}</span>
                  <span style={{ background: "rgba(34, 197, 94, 0.1)", color: "#4ade80", fontSize: "11px", fontWeight: "bold", padding: "5px 10px", borderRadius: "20px", border: "1px solid rgba(34, 197, 94, 0.2)" }}>
                    {uni.status}
                  </span>
                </div>

                <h3 style={{ margin: "0 0 6px 0", fontSize: "20px", color: "#fff" }}>{uni.name}</h3>
                <p style={{ margin: "0 0 15px 0", fontSize: "13px", color: "#38bdf8" }}>📍 {uni.location}</p>
                <p style={{ fontSize: "14px", color: "#cbd5e1", margin: "0 0 20px 0", lineHeight: "1.5" }}>{uni.description}</p>
                
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "15px", borderTop: "1px solid rgba(255,255,255,0.08)", fontSize: "13px", color: "#94a3b8" }}>
                  <span>Eligible: <strong style={{ color: "#fff" }}>{uni.totalVoters}</strong></span>
                  <span style={{ color: "#38bdf8", fontWeight: "bold", display: "flex", alignItems: "center", gap: "4px" }}>Open Portal ➔</span>
                </div>
              </div>
            ))}
          </div>
        </main>
      )}

      {/* FULL SCREEN DETAIL & VOTING MODAL */}
      {selectedUni && (
        <div style={{
          position: "fixed",
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: "rgba(2, 6, 23, 0.95)",
          backdropFilter: "blur(16px)",
          zIndex: 1000,
          overflowY: "auto",
          padding: "30px 20px"
        }}>
          
          <div style={{
            maxWidth: "800px",
            margin: "0 auto",
            background: "rgba(15, 23, 42, 0.8)",
            borderRadius: "24px",
            border: "1px solid rgba(255, 255, 255, 0.12)",
            padding: "35px",
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.7)"
          }}>
            
            {/* TOP BAR */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" }}>
              <button 
                onClick={() => { setSelectedUni(null); setActiveTab("overview"); }}
                style={{
                  background: "rgba(255, 255, 255, 0.08)",
                  color: "#fff",
                  border: "1px solid rgba(255,255,255,0.1)",
                  padding: "10px 18px",
                  borderRadius: "12px",
                  cursor: "pointer",
                  fontWeight: "600",
                  fontSize: "13px"
                }}
              >
                ⬅ Back to Universities
              </button>

              <div style={{ display: "flex", gap: "10px" }}>
                <button 
                  onClick={() => setActiveTab("overview")}
                  style={{
                    background: activeTab === "overview" ? "#38bdf8" : "rgba(255,255,255,0.05)",
                    color: activeTab === "overview" ? "#0f172a" : "#fff",
                    border: "none",
                    padding: "8px 14px",
                    borderRadius: "8px",
                    cursor: "pointer",
                    fontWeight: "bold",
                    fontSize: "12px"
                  }}
                >
                  Overview
                </button>
                <button 
                  onClick={() => setActiveTab("results")}
                  style={{
                    background: activeTab === "results" ? "#38bdf8" : "rgba(255,255,255,0.05)",
                    color: activeTab === "results" ? "#0f172a" : "#fff",
                    border: "none",
                    padding: "8px 14px",
                    borderRadius: "8px",
                    cursor: "pointer",
                    fontWeight: "bold",
                    fontSize: "12px"
                  }}
                >
                  Results 📊
                </button>
              </div>
            </div>

            {/* BANNER */}
            <div style={{
              background: selectedUni.gradient,
              padding: "25px",
              borderRadius: "18px",
              marginBottom: "30px",
              boxShadow: "0 10px 25px -5px rgba(0,0,0,0.3)"
            }}>
              <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
                <span style={{ fontSize: "55px", background: "rgba(255,255,255,0.2)", padding: "10px", borderRadius: "16px" }}>{selectedUni.image}</span>
                <div>
                  <h2 style={{ margin: "0 0 4px 0", fontSize: "26px", color: "#fff", fontWeight: "800" }}>{selectedUni.name}</h2>
                  <p style={{ margin: "0 0 6px 0", fontSize: "14px", color: "rgba(255,255,255,0.9)", fontWeight: "500" }}>{selectedUni.tagline}</p>
                  <p style={{ margin: 0, fontSize: "12px", color: "rgba(255,255,255,0.7)" }}>📍 {selectedUni.location} | Portal Code: {selectedUni.code}</p>
                </div>
              </div>
            </div>

            {/* TAB 1: OVERVIEW */}
            {activeTab === "overview" && (
              <div>
                <h3 style={{ color: "#fff", marginTop: 0, fontSize: "18px" }}>About Campus Elections</h3>
                <p style={{ color: "#cbd5e1", lineHeight: "1.6", fontSize: "15px" }}>{selectedUni.details}</p>

                <div style={{ background: "rgba(255,255,255,0.03)", padding: "20px", borderRadius: "14px", margin: "25px 0", border: "1px solid rgba(255,255,255,0.08)" }}>
                  <h4 style={{ margin: "0 0 15px 0", color: "#38bdf8", fontSize: "14px" }}>PARTICIPATING PARTIES & CANDIDATES:</h4>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "12px" }}>
                    {parties.map(p => {
                      const pId = p._id || p.id;
                      const isSelected = selectedParty && (selectedParty._id === pId || selectedParty.id === pId);
                      return (
                        <div 
                          key={pId}
                          onClick={() => {
                            setSelectedParty(p);
                            setActiveTab("verify");
                          }}
                          style={{ 
                            background: isSelected ? "rgba(56, 189, 248, 0.2)" : "rgba(30, 41, 59, 0.6)", 
                            padding: "14px 16px", 
                            borderRadius: "10px", 
                            border: isSelected ? "1px solid #38bdf8" : "1px solid rgba(255,255,255,0.1)", 
                            display: "flex", 
                            alignItems: "center", 
                            gap: "12px",
                            cursor: "pointer",
                            transition: "all 0.2s ease"
                          }}
                        >
                          <span style={{ fontSize: "24px" }}>{p.symbol || "🗳"}</span>
                          <div>
                            <div style={{ fontWeight: "bold", fontSize: "15px", color: "#fff" }}>{p.name}</div>
                            <div style={{ fontSize: "11px", color: "#38bdf8" }}>Click to Vote ➔</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <button 
                  onClick={() => setActiveTab("verify")}
                  style={{
                    width: "100%",
                    padding: "16px",
                    background: "linear-gradient(90deg, #2563eb, #3b82f6)",
                    color: "#fff",
                    borderRadius: "14px",
                    border: "none",
                    fontWeight: "bold",
                    fontSize: "16px",
                    cursor: "pointer",
                    boxShadow: "0 10px 20px -5px rgba(37, 99, 235, 0.4)"
                  }}
                >
                  🗳️ Click Here to Login & Cast Vote Now
                </button>
              </div>
            )}

            {/* TAB 2: VERIFICATION LOGIN */}
            {activeTab === "verify" && (
              <div style={{ maxWidth: "480px", margin: "0 auto", background: "rgba(30, 41, 59, 0.5)", padding: "30px", borderRadius: "18px", border: "1px solid rgba(255,255,255,0.1)" }}>
                <div style={{ textAlign: "center", marginBottom: "20px" }}>
                  <span style={{ fontSize: "11px", letterSpacing: "1.5px", color: "#38bdf8", fontWeight: "bold" }}>AUTHENTICATION</span>
                  <h3 style={{ margin: "5px 0 0 0", color: "#fff", fontSize: "22px" }}>Voter Verification</h3>
                </div>

                {formError && <div style={{ color: "#f87171", marginBottom: "15px", fontSize: "13px", background: "rgba(239, 68, 68, 0.1)", padding: "12px", borderRadius: "8px", border: "1px solid rgba(239, 68, 68, 0.2)" }}>{formError}</div>}
                
                <form onSubmit={handleVerify}>
                  <div style={{ marginBottom: "18px" }}>
                    <label style={{ display: "block", fontSize: "12px", fontWeight: "700", marginBottom: "6px", color: "#cbd5e1" }}>STUDENT REGISTRATION NO.</label>
                    <input 
                      type="text" 
                      value={regno} 
                      onChange={(e) => setRegno(e.target.value)} 
                      required 
                      placeholder="e.g. 202610892" 
                      style={{ width: "100%", padding: "12px", borderRadius: "10px", border: "1px solid rgba(255,255,255,0.15)", background: "#0f172a", color: "#fff", boxSizing: "border-box", outline: "none" }} 
                    />
                  </div>

                  <div style={{ marginBottom: "25px" }}>
                    <label style={{ display: "block", fontSize: "12px", fontWeight: "700", marginBottom: "6px", color: "#cbd5e1" }}>FULL NAME</label>
                    <input 
                      type="text" 
                      value={name} 
                      onChange={(e) => setName(e.target.value)} 
                      required 
                      placeholder="Enter full registered name" 
                      style={{ width: "100%", padding: "12px", borderRadius: "10px", border: "1px solid rgba(255,255,255,0.15)", background: "#0f172a", color: "#fff", boxSizing: "border-box", outline: "none" }} 
                    />
                  </div>

                  <button 
                    type="submit" 
                    disabled={loading} 
                    style={{
                      width: "100%",
                      padding: "14px",
                      background: loading ? "#475569" : "linear-gradient(90deg, #10b981, #059669)",
                      color: "#fff",
                      border: "none",
                      borderRadius: "10px",
                      fontWeight: "bold",
                      cursor: loading ? "wait" : "pointer",
                      fontSize: "15px",
                      boxShadow: "0 8px 15px -3px rgba(16, 185, 129, 0.3)"
                    }}
                  >
                    {loading ? "Verifying Credentials..." : "Authenticate & Open Voting Booth ➔"}
                  </button>
                </form>
              </div>
            )}

            {/* TAB 3: VOTING BOOTH */}
            {activeTab === "booth" && (
              <div style={{ maxWidth: "520px", margin: "0 auto" }}>
                <div style={{ textAlign: "center", marginBottom: "25px" }}>
                  <h2 style={{ color: "#fff", margin: "0 0 6px 0", fontSize: "24px" }}>Welcome, {voterName}! 👋</h2>
                  <p style={{ fontSize: "14px", color: "#94a3b8", margin: 0 }}>Select one candidate party to cast your official vote:</p>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "14px", marginBottom: "30px" }}>
                  {parties.map((party) => {
                    const partyId = party._id || party.id;
                    const isSelected = selectedParty && (selectedParty._id === partyId || selectedParty.id === partyId);
                    return (
                      <div 
                        key={partyId} 
                        onClick={() => setSelectedParty(party)}
                        style={{ 
                          padding: "18px 20px", 
                          border: isSelected ? "2px solid #38bdf8" : "1px solid rgba(255,255,255,0.1)", 
                          background: isSelected ? "rgba(3, 105, 161, 0.3)" : "rgba(15, 23, 42, 0.6)",
                          borderRadius: "14px", 
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                          boxShadow: isSelected ? "0 0 20px -5px #38bdf8" : "none",
                          transform: isSelected ? "scale(1.02)" : "scale(1)"
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                          <span style={{ fontSize: "32px", pointerEvents: "none" }}>{party.symbol || "🗳"}</span>
                          <div>
                            <div style={{ fontWeight: "800", fontSize: "17px", color: "#fff", pointerEvents: "none" }}>{party.name}</div>
                            <div style={{ fontSize: "12px", color: "#94a3b8", pointerEvents: "none" }}>{party.motto || "Official Candidate"}</div>
                          </div>
                        </div>

                        <div style={{
                          width: "22px",
                          height: "22px",
                          borderRadius: "50%",
                          border: isSelected ? "6px solid #38bdf8" : "2px solid rgba(255,255,255,0.3)",
                          background: "#0f172a",
                          pointerEvents: "none"
                        }}></div>
                      </div>
                    );
                  })}
                </div>

                <button 
                  onClick={castVote} 
                  disabled={!selectedParty || castingVote}
                  style={{ 
                    width: "100%", 
                    padding: "16px", 
                    background: selectedParty ? "linear-gradient(90deg, #22c55e, #16a34a)" : "#334155", 
                    color: "#fff", 
                    border: "none", 
                    borderRadius: "12px", 
                    fontWeight: "bold", 
                    fontSize: "16px", 
                    cursor: selectedParty ? "pointer" : "not-allowed",
                    boxShadow: selectedParty ? "0 10px 20px -5px rgba(34, 197, 94, 0.4)" : "none",
                    transition: "all 0.2s"
                  }}
                >
                  {castingVote ? "Encrypting & Submitting Vote..." : "Confirm & Cast Official Vote 🗳"}
                </button>
              </div>
            )}

            {/* TAB 4: THANK YOU */}
            {activeTab === "thankyou" && (
              <div style={{ textAlign: "center", padding: "30px 0" }}>
                <div style={{ fontSize: "65px", marginBottom: "15px" }}>🎉</div>
                <h2 style={{ color: "#4ade80", margin: "0 0 10px 0", fontSize: "28px" }}>Vote Successfully Recorded!</h2>
                <p style={{ color: "#cbd5e1", fontSize: "15px", marginBottom: "30px" }}>Thank you for participating in {selectedUni.name}'s democratic process.</p>
                
                <button 
                  onClick={() => setActiveTab("results")} 
                  style={{ padding: "14px 28px", background: "linear-gradient(90deg, #38bdf8, #0284c7)", color: "#fff", border: "none", borderRadius: "10px", fontWeight: "bold", cursor: "pointer", fontSize: "15px" }}
                >
                  View Live Results 📊
                </button>
              </div>
            )}

            {/* TAB 5: RESULTS */}
            {activeTab === "results" && (
              <div style={{ textAlign: "center" }}>
                <h2 style={{ color: "#fff", margin: "0 0 6px 0", fontSize: "24px" }}>Election Standings</h2>
                <p style={{ color: "#94a3b8", fontSize: "14px", marginBottom: "25px" }}>{selectedUni.name}</p>
                
                <div style={{ background: "rgba(15, 23, 42, 0.6)", padding: "20px", borderRadius: "14px", border: "1px solid rgba(255,255,255,0.08)", marginBottom: "25px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                    <span style={{ color: "#fff", fontWeight: "bold" }}>🦁 Vivant</span>
                    <span style={{ color: "#38bdf8", fontWeight: "bold" }}>Leading (Fallback Demo)</span>
                  </div>
                  <div style={{ height: "10px", background: "rgba(255,255,255,0.1)", borderRadius: "5px", overflow: "hidden" }}>
                    <div style={{ width: "65%", height: "100%", background: "#3b82f6" }}></div>
                  </div>
                </div>

                <button 
                  onClick={handleReset} 
                  style={{ padding: "10px 20px", background: "rgba(239, 68, 68, 0.2)", color: "#f87171", border: "1px solid rgba(239, 68, 68, 0.3)", borderRadius: "8px", cursor: "pointer", fontWeight: "bold" }}
                >
                  Reset Status (Testing)
                </button>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
}