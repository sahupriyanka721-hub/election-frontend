import React, { useState, useEffect } from "react";

export default function App() {
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

  const parties = [
    { _id: "1", name: "Student Welfare Party", symbol: "📚" },
    { _id: "2", name: "Youth Progress Front", symbol: "🚀" },
    { _id: "3", name: "United Students Alliance", symbol: "🤝" }
  ];

  useEffect(() => {
    setFormError("");
  }, [screen]);

  // Step 1: Details Check-in -> Move to Voting Booth
  async function handleVerify(e) {
    e.preventDefault();
    if (hasVotedLocally) {
      setFormError("Aap pehle hi vote de chuke hain!");
      return;
    }
    setFormError("");
    setVotingToken("test-token-123");
    setVoterName(name || "Test Voter");
    setScreen("booth"); // Ab party select karne wala screen aayega
  }

  // Step 2: Cast Vote -> Direct Thank You Page
  async function castVote() {
    if (!selectedParty) return;
    setCastingVote(true);
    
    setTimeout(() => {
      setCastingVote(false);
      setHasVotedLocally(true);
      localStorage.setItem("hasVoted", "true");
      setScreen("thankyou"); // Vote Submit hone ke baad seedha Thank You screen
    }, 800);
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
            <p style={{ fontSize: "14px", color: "#475569" }}>Registration number aur naam daalo jaisa list mein register hai.</p>
            
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

              <button type="submit" style={{ width: "100%", padding: "12px", backgroundColor: "#1e293b", color: "#fff", border: "none", borderRadius: "6px", fontWeight: "bold", cursor: "pointer" }}>
                Proceed to Vote ➔
              </button>
            </form>
          </div>
        )}

        {/* 2. VOTING BOOTH (PARTY CHOOSE KARNE WALA PAGE) */}
        {screen === "booth" && (
          <div>
            <h2>Welcome, {voterName}! 👋</h2>
            <p style={{ fontSize: "14px", color: "#475569" }}>Apne pasandida candidate/party ko select karein:</p>
            
            <div style={{ margin: "20px 0" }}>
              {parties.map((party) => (
                <div 
                  key={party._id} 
                  onClick={() => setSelectedParty(party)}
                  style={{ 
                    padding: "12px", 
                    border: selectedParty?._id === party._id ? "2px solid #2563eb" : "1px solid #cbd5e1", 
                    backgroundColor: selectedParty?._id === party._id ? "#eff6ff" : "#fff",
                    borderRadius: "8px", 
                    marginBottom: "10px", 
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "10px"
                  }}
                >
                  <span style={{ fontSize: "20px" }}>{party.symbol}</span>
                  <span style={{ fontWeight: "bold" }}>{party.name}</span>
                </div>
              ))}
            </div>

            <button 
              onClick={castVote} 
              disabled={!selectedParty || castingVote}
              style={{ width: "100%", padding: "12px", backgroundColor: selectedParty ? "#16a34a" : "#94a3b8", color: "#fff", border: "none", borderRadius: "6px", fontWeight: "bold", cursor: "pointer" }}
            >
              {castingVote ? "Submitting..." : "Submit Vote & Finish 🗳"}
            </button>
          </div>
        )}

        {/* 3. THANK YOU SCREEN */}
        {screen === "thankyou" && (
          <div style={{ textAlign: "center", padding: "10px 0" }}>
            <h1 style={{ fontSize: "40px", margin: "0 0 10px 0" }}>🎉</h1>
            <h2 style={{ color: "#16a34a", margin: "0 0 10px 0" }}>Thank You for Voting!</h2>
            <p style={{ color: "#475569", fontSize: "14px", marginBottom: "25px" }}>Aapka vote successfully submit ho gaya hai.</p>
            
            <button 
              onClick={() => setScreen("results")} 
              style={{ width: "100%", padding: "12px", backgroundColor: "#2563eb", color: "#fff", border: "none", borderRadius: "6px", fontWeight: "bold", cursor: "pointer" }}
            >
              📊 View Results
            </button>
          </div>
        )}

        {/* 4. RESULTS SCREEN */}
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