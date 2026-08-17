import React, { useState, useEffect } from 'react';
import { auth, googleProvider, db } from './firebase';
import { signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';

function App() {
  const [selectedUniv, setSelectedUniv] = useState(null);
  const [user, setUser] = useState(null);
  const [hasVoted, setHasVoted] = useState(false);

  const [parties, setParties] = useState([
    { id: 'abvp', name: 'ABVP', candidate: 'Aarav Sharma', votes: 120 },
    { id: 'nsui', name: 'NSUI', candidate: 'Priya Verma', votes: 95 },
    { id: 'aisa', name: 'AISA', candidate: 'Rohan Gupta', votes: 45 }
  ]);

  const universities = [
    {
      id: 'geu',
      name: 'Graphic Era University',
      location: 'Dehradun, Uttarakhand',
      desc: 'Graphic Era (Deemed to be University) student union election portal.',
      eligible: '18,500+'
    },
    {
      id: 'amity',
      name: 'Amity University',
      location: 'Noida, Uttar Pradesh',
      desc: 'Annual Student Council Election for Amity University main campus.',
      eligible: '25,000+'
    },
    {
      id: 'lpu',
      name: 'Lovely Professional University',
      location: 'Phagwara, Punjab',
      desc: 'Official Campus Senate Election Portal.',
      eligible: '35,000+'
    },
    {
      id: 'cu',
      name: 'Chandigarh University',
      location: 'Mohali, Punjab',
      desc: 'Central Student Representative Elections.',
      eligible: '30,000+'
    }
  ];

  useEffect(() => {
    onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
  }, []);

  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error("Login Error:", error);
    }
  };

  const handleVote = (id) => {
    if (!user) {
      alert("Kripya vote karne ke liye pehle Login karein!");
      return;
    }
    if (hasVoted) {
      alert("Aap pehle hi vote de chuke hain!");
      return;
    }
    setParties(parties.map(p => p.id === id ? { ...p, votes: p.votes + 1 } : p));
    setHasVoted(true);
    alert("Aapka vote safaltapurvak darj ho gaya hai!");
  };

  return (
    <div style={{ backgroundColor: '#0f172a', color: '#fff', minHeight: '100vh', fontFamily: 'sans-serif' }}>
      {/* Header Bar */}
      <header style={{ padding: '20px 40px', borderBottom: '1px solid #1e293b', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ backgroundColor: '#2563eb', padding: '8px 12px', borderRadius: '8px', fontWeight: 'bold' }}>🗳️</div>
          <div>
            <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 'bold' }}>UniVote Pro</h2>
            <small style={{ color: '#64748b' }}>National Campus Election & Event Management Portal</small>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <span style={{ backgroundColor: '#064e3b', color: '#34d399', padding: '5px 12px', borderRadius: '20px', fontSize: '12px' }}>● Live Connection Active</span>
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span>{user.displayName}</span>
              <button onClick={() => signOut(auth)} style={{ padding: '6px 12px', backgroundColor: '#dc2626', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Logout</button>
            </div>
          ) : (
            <button onClick={handleGoogleLogin} style={{ padding: '8px 16px', backgroundColor: '#2563eb', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Sign in with Google</button>
          )}
        </div>
      </header>

      {/* Main Content */}
      <div style={{ padding: '40px 20px', maxWidth: '1200px', margin: '0 auto' }}>
        {!selectedUniv ? (
          /* Landing Page: Select Your University */
          <div>
            <div style={{ textAlign: 'center', marginBottom: '40px' }}>
              <h1 style={{ fontSize: '32px', marginBottom: '10px' }}>Select Your University</h1>
              <p style={{ color: '#94a3b8' }}>Click on your institution to view candidates, manage events, access voter authentication, and cast votes.</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
              {universities.map((univ) => (
                <div key={univ.id} style={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '12px', padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px' }}>
                      <span style={{ fontSize: '24px' }}>🏛️</span>
                      <span style={{ backgroundColor: '#064e3b', color: '#34d399', padding: '4px 8px', borderRadius: '12px', fontSize: '10px' }}>Elections & Events Active</span>
                    </div>
                    <h3 style={{ margin: '0 0 5px 0' }}>{univ.name}</h3>
                    <p style={{ color: '#e2e8f0', fontSize: '12px', margin: '0 0 10px 0' }}>📍 {univ.location}</p>
                    <p style={{ color: '#94a3b8', fontSize: '13px', lineHeight: '1.4' }}>{univ.desc}</p>
                  </div>
                  <div style={{ marginTop: '20px', paddingTop: '15px', borderTop: '1px solid #334155', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <small style={{ color: '#64748b' }}>Eligible: <strong style={{ color: '#cbd5e1' }}>{univ.eligible}</strong></small>
                    <button onClick={() => setSelectedUniv(univ)} style={{ backgroundColor: 'transparent', color: '#38bdf8', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>Open Portal ➔</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* Voting Portal Page for Selected University */
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <button onClick={() => setSelectedUniv(null)} style={{ backgroundColor: '#334155', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', marginBottom: '20px' }}>
              ← Back to Universities
            </button>
            <h2 style={{ fontSize: '28px', marginBottom: '5px' }}>{selectedUniv.name}</h2>
            <p style={{ color: '#94a3b8', marginBottom: '30px' }}>Student Union Election 2026 - Cast Your Vote</p>

            <div style={{ display: 'grid', gap: '20px' }}>
              {parties.map((party) => (
                <div key={party.id} style={{ border: '1px solid #334155', padding: '20px', borderRadius: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#1e293b' }}>
                  <div>
                    <h3 style={{ margin: 0, color: '#38bdf8' }}>Party: {party.name}</h3>
                    <p style={{ margin: '5px 0', color: '#e2e8f0', fontSize: '16px' }}>Candidate: <strong>{party.candidate}</strong></p>
                    <small style={{ color: '#94a3b8' }}>Total Votes: {party.votes}</small>
                  </div>
                  <button 
                    onClick={() => handleVote(party.id)}
                    disabled={hasVoted}
                    style={{ padding: '10px 24px', backgroundColor: hasVoted ? '#475569' : '#22c55e', color: '#fff', border: 'none', borderRadius: '6px', cursor: hasVoted ? 'not-allowed' : 'pointer', fontWeight: 'bold' }}>
                    {hasVoted ? 'Voted' : 'Vote'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;