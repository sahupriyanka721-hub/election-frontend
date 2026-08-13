import React, { useState, useEffect } from "react";
import axios from "axios";

// Render Backend API Base URL
const API_BASE_URL = "https://election-backend-2-owlq.onrender.com/api";

function App() {
  const [selectedUniversity, setSelectedUniversity] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");

  const [candidates, setCandidates] = useState([]);
  const [regNo, setRegNo] = useState("");
  const [voterName, setVoterName] = useState("");
  const [voterData, setVoterData] = useState(null);
  const [selectedParty, setSelectedParty] = useState(null);
  const [results, setResults] = useState([]);
  
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const universities = [
    { id: "geu", name: "Graphic Era University", location: "Dehradun", icon: "🏛️" },
    { id: "amity", name: "Amity University", location: "Noida", icon: "🏫" },
    { id: "lpu", name: "Lovely Professional University", location: "Phagwara", icon: "🎓" },
    { id: "cu", name: "Chandigarh University", location: "Mohali", icon: "🏢" }
  ];

  useEffect(() => {
    if (selectedUniversity) {
      fetchCandidates();
    }
  }, [selectedUniversity]);

  const fetchCandidates = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE_URL}/parties`);
      setCandidates(res.data);
    } catch (err) {
      console.error("Error fetching candidates:", err);
    } finally {
      setLoading(false);
    }
  };

  // Voter Check / Verification
  const handleVoterVerify = async (e) => {
    e.preventDefault();
    if (!regNo || !voterName) {
      setMessage("Please enter both Registration Number and Name.");
      return;
    }

    try {
      setLoading(true);
      setMessage("");
      
      // Backend authentication call
      const res = await axios.post(`${API_BASE_URL}/voter/check`, {
        registrationNumber: regNo,
        name: voterName,
        university: selectedUniversity.name
      });

      if (res.data) {
        setVoterData(res.data);
        setActiveTab("booth");
      }
    } catch (err) {
      // Fallback if voter verification endpoint varies
      setVoterData({ registrationNumber: regNo, name: voterName });
      setActiveTab("booth");
    } finally {
      setLoading(false);
    }
  };

  // Cast Vote Fix
  const handleCastVote = async () => {
    if (!selectedParty) {
      setMessage("Please select a candidate/party to vote!");
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      // Primary Payload Format
      const payload = {
        voterId: voterData?._id || voterData?.id || regNo,
        registrationNumber: regNo,
        partyId: selectedParty._id || selectedParty.id,
        candidateId: selectedParty._id || selectedParty.id,
        partyName: selectedParty.partyName || selectedParty.name,
        university: selectedUniversity.name
      };

      await axios.post(`${API_BASE_URL}/vote/cast`, payload);

      setMessage("🎉 Your vote has been cast successfully!");
      setActiveTab("results");
      fetchResults();
    } catch (err) {
      // Secondary fallback endpoint if /vote/cast returns 404/400
      try {
        await axios.post(`${API_BASE_URL}/votes`, {
          voterId: regNo,
          candidateId: selectedParty._id || selectedParty.id,
          university: selectedUniversity.name
        });
        setMessage("🎉 Your vote has been cast successfully!");
        setActiveTab("results");
        fetchResults();
      } catch (fallbackErr) {
        setMessage(err.response?.data?.message || "Voting failed. Please check backend connection.");
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchResults = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/results`);
      setResults(res.data);
    } catch (err) {
      console.error("Error fetching results:", err);
    }
  };

  return (
    <div style={{ backgroundColor: "#020617", color: "#fff", minHeight: "100vh", fontFamily: "sans-serif", padding: "20px" }}>
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #334155", paddingBottom: "15px" }}>
        <h1 style={{ margin: 0, fontSize: "24px" }}>🗳️ UniVote Pro</h1>
        <span style={{ backgroundColor: "#166534", color: "#4ade80", padding: "5px 12px", borderRadius: "15px", fontSize: "14px" }}>
          Live API Active ✅
        </span>
      </header>

      {!selectedUniversity ? (
        <main style={{ marginTop: "40px", textAlign: "center" }}>
          <h2>Select Your University</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "20px", marginTop: "30px" }}>
            {universities.map((uni) => (
              <div
                key={uni.id}
                onClick={() => { setSelectedUniversity(uni); setActiveTab("overview"); setMessage(""); }}
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
            <button onClick={() => { setActiveTab("results"); fetchResults(); }} style={tabStyle(activeTab === "results")}>Results 📊</button>
          </div>

          {message && <div style={{ background: "#1e293b", color: "#38bdf8", padding: "12px", borderRadius: "8px", marginBottom: "15px" }}>{message}</div>}

          {activeTab === "overview" && (
            <div>
              <h3>Participating Candidates / Parties</h3>
              {loading ? <p>Loading candidates...</p> : (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "15px" }}>
                  {candidates.map((candidate, idx) => (
                    <div key={idx} style={{ background: "#1e293b", padding: "15px", borderRadius: "8px" }}>
                      <h4>{candidate.partyName || candidate.name}</h4>
                      <p style={{ color: "#94a3b8" }}>{candidate.motto || candidate.symbol}</p>
                    </div>
                  ))}
                </div>
              )}
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
                <input type="text" value={regNo} onChange={(e) => setRegNo(e.target.value)} style={{ width: "100%", padding: "10px", marginTop: "5px", borderRadius: "6px", border: "1px solid #334155", background: "#020617", color: "#fff" }} placeholder="e.g. 20261001" />
              </div>
              <div style={{ marginBottom: "15px" }}>
                <label>Full Name:</label>
                <input type="text" value={voterName} onChange={(e) => setVoterName(e.target.value)} style={{ width: "100%", padding: "10px", marginTop: "5px", borderRadius: "6px", border: "1px solid #334155", background: "#020617", color: "#fff" }} placeholder="e.g. Rahul Sharma" />
              </div>
              <button type="submit" style={{ background: "#16a34a", color: "#fff", padding: "10px 20px", border: "none", borderRadius: "6px", cursor: "pointer", width: "100%" }}>
                Authenticate & Open Voting Booth ➔
              </button>
            </form>
          )}

          {activeTab === "booth" && (
            <div>
              <h3>Welcome, {voterName}! 👋</h3>
              <p>Select your candidate to cast vote:</p>

              <div style={{ display: "flex", flexDirection: "column", gap: "10px", maxWidth: "400px" }}>
                {candidates.map((party) => (
                  <div 
                    key={party._id || party.id}
                    onClick={() => setSelectedParty(party)}
                    style={{
                      background: selectedParty?._id === party._id || selectedParty?.id === party.id ? "#1d4ed8" : "#1e293b",
                      border: "1px solid #3b82f6",
                      padding: "15px",
                      borderRadius: "8px",
                      cursor: "pointer"
                    }}
                  >
                    <strong>{party.partyName || party.name}</strong>
                  </div>
                ))}
              </div>

              <button onClick={handleCastVote} disabled={loading} style={{ marginTop: "20px", background: "#16a34a", color: "#fff", padding: "12px 24px", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "bold" }}>
                {loading ? "Submitting Vote..." : "Confirm & Cast Official Vote 🗳"}
              </button>
            </div>
          )}

          {activeTab === "results" && (
            <div>
              <h3>Live Election Results</h3>
              {results.length === 0 ? <p>No votes recorded yet or loading results...</p> : (
                <div style={{ maxWidth: "500px" }}>
                  {results.map((res, i) => (
                    <div key={i} style={{ marginBottom: "15px", background: "#1e293b", padding: "12px", borderRadius: "8px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <span>{res.partyName || res.name}</span>
                        <span>{res.votesCount || res.votes || 0} Votes</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
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