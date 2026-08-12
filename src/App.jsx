import React, { useState, useEffect } from "react";

export default function App() {
  // LocalStorage check for initial state
  const [hasVotedLocally, setHasVotedLocally] = useState(() => {
    return localStorage.getItem("hasVoted") === "true";
  });

  const [screen, setScreen] = useState(() => {
    return localStorage.getItem("hasVoted") === "true" ? "thankyou" : "verify";
  });

  const [regno, setRegno] = useState("");
  const [name, setName] = useState("");
  const [votingToken, setVotingToken] = useState("");
  const [voterName, setVoterName] = useState("");
  const [selectedParty, setSelectedParty] = useState(null);
  const [formError, setFormError] = useState("");
  const [castingVote, setCastingVote] = useState(false);

  // Mock Parties Data
  const parties = [
    { _id: "1", name: "Student Welfare Party", symbol: "📚" },
    { _id: "2", name: "Youth Progress Front", symbol: "🚀" },
    { _id: "3", name: "United Students Alliance", symbol: "🤝" }
  ];

  useEffect(() => {
    setFormError("");
  }, [screen]);

  async function handleVerify(e) {
    e.preventDefault();
    if (hasVotedLocally) {
      setFormError("Aap pehle hi vote de chuke hain!");
      return;
    }
    setFormError("");
    setVotingToken("test-token-123");
    setVoterName(name || "Test Voter");
    
    // Direct thank you screen par bhejne ke liye vote save aur setScreen update
    setHasVotedLocally(true);
    localStorage.setItem("hasVoted", "true");
    setScreen("thankyou");
  }

  function handleReset() {
    localStorage.removeItem("hasVoted");
    setHasVotedLocally(false);
    setScreen("verify");
  }

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#0f172a", color: "#fff", display: "flex", justifyContent: "center", alignItems: "center", padding: "20px", fontFamily: "sans-serif" }}>
      <div style={{ backgroundColor: "#fdfbf7", color: "#1e293b", padding: "30px", borderRadius: "12px", width: "100%", maxWidth: "450px", boxShadow: "0 10px 25px rgba(0,0,0,0.3)" }}>
        
        {/* HEADER */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <h3 style={{ margin: 0, color: "#1e1b4b" }}>• College Union Election</h3>
          <span style={{ backgroundColor: "#e2e8f0", padding: "4px 8px", borderRadius: "4px", fontSize: "12px", fontWeight: "bold" }}>ADMIN</span>
        </div>

        {/* 1. VERIFICATION SCREEN */}
        {screen === "verify" && (
          <div>
            <span style={{ fontSize: "12px", letterSpacing: "1px", color: "#64748b", fontWeight: "bold" }}>🛡 VOTER CHECK-IN</span>
            <h2 style={{ margin: "10px 0", color: "#0f172a" }}>Apni pehchaan confirm karein</h2>
            <p style={{ fontSize: "14px", color: "#475569" }}>Registration number aur naam daalo jaisa list mein register hai. Ek voter, ek vote.</p>
            
            <form onSubmit={handleVerify} style={{ marginTop: "20px" }}>
              {formError && <div style={{ color: "#dc2626", marginBottom: "10px", fontSize: "14px" }}>{formError}</div>}
              
              <div style={{ marginBottom: "15px" }}>
                <label style={{ display: "block", fontSize: "12px", fontWeight: "bold", marginBottom: "5px" }}>REGISTRATION NUMBER</label>
                <input type="text" value={regno} onChange={(e) => setRegno(e.target.value)} required style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #cbd5e1", boxSizing: "border-box" }} />
              </div>

              <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", fontSize: "12px", fontWeight: "bold", marginBottom: "5px" }}>FULL NAME</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} required style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #cbd5e1", boxSizing: "border-box" }} />
              </div>

              <button type="submit" style={{ width: "100%", padding: "12px", backgroundColor: "#16a34a", color: "#fff", border: "none", borderRadius: "6px", fontWeight: "bold", cursor: "pointer" }}>
                Submit & Finish 🗳
              </button>
            </form>
          </div>
        )}

        {/* 2. THANK YOU SCREEN */}
        {screen === "thankyou" && (
          <div style={{ textAlign: "center", padding: "10px 0" }}>
            <h1 style={{ fontSize: "40px", margin: "0 0 10px 0" }}>🎉</h1>
            <h2 style={{ color: "#16a34a", margin: "0 0 10px 0" }}>Thank You!</h2>
            <p style={{ color: "#475569", fontSize: "14px", marginBottom: "25px" }}>Aapki details successfully verify ho gayi hain.</p>
            
            <button 
              onClick={() => setScreen("results")} 
              style={{ width: "100%", padding: "12px", backgroundColor: "#2563eb", color: "#fff", border: "none", borderRadius: "6px", fontWeight: "bold", cursor: "pointer" }}
            >
              📊 View Results
            </button>
          </div>
        )}

        {/* 3. CONGRATULATIONS / RESULTS SCREEN */}
        {screen === "results" && (
          <div style={{ textAlign: "center", padding: "10px 0" }}>
            <h1 style={{ fontSize: "45px", margin: "0 0 10px 0" }}>🎉🎊</h1>
            <h2 style={{ color: "#1e1b4b", margin: "0 0 10px 0" }}>Congratulations!</h2>
            <p style={{ color: "#475569", fontSize: "14px", marginBottom: "20px" }}>Election process successfully finish ho chuka hai!</p>
            
            <div style={{ backgroundColor: "#f1f5f9", padding: "15px", borderRadius: "8px", textAlign: "left", marginBottom: "20px" }}>
              <h4 style={{ margin: "0 0 10px 0", color: "#0f172a" }}>🏆 Current Winner Leading:</h4>
              <p style={{ margin: 0, fontWeight: "bold", color: "#16a34a" }}>📚 Student Welfare Party</p>
            </div>

            <button 
              onClick={handleReset} 
              style={{ width: "100%", padding: "10px", backgroundColor: "#dc2626", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "bold" }}
            >
              🔄 Reset Voting Status (For Test)
            </button>
          </div>
        )}

      </div>
    </div>
  );
}