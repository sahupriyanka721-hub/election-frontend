import React, { useState, useEffect } from 'react';
import { auth, googleProvider } from './firebase';
import { signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';

export default function App() {
  const [user, setUser] = useState(null);
  const [selectedUni, setSelectedUni] = useState(null);
  const [activeTab, setActiveTab] = useState('voting');

  const [candidateName, setCandidateName] = useState('');
  const [candidateParty, setCandidateParty] = useState('');
  
  const [universities, setUniversities] = useState([
    { 
      id: 'graphic-era', 
      name: 'Graphic Era University', 
      location: 'Dehradun, Uttarakhand', 
      desc: 'Graphic Era (Deemed to be University) student union election portal.', 
      eligible: '18,500+',
      candidates: [
        { id: 1, name: 'Aarav Sharma', party: 'Vivant', votes: 120 },
        { id: 2, name: 'Rahul Verma', party: 'Ojashvi', votes: 95 },
        { id: 3, name: 'Priya Negi', party: 'Ashre Army', votes: 45 }
      ]
    },
    { 
      id: 'amity', 
      name: 'Amity University', 
      location: 'Noida, Uttar Pradesh', 
      desc: 'Annual Student Council Election for Amity University main campus.', 
      eligible: '25,000+',
      candidates: [
        { id: 1, name: 'Priya Singh', party: 'Vivant', votes: 150 },
        { id: 2, name: 'Amit Kumar', party: 'Ashre Army', votes: 130 },
        { id: 3, name: 'Rohit Singh', party: 'Ojashvi', votes: 90 }
      ]
    },
    { 
      id: 'lpu', 
      name: 'Lovely Professional University', 
      location: 'Phagwara, Punjab', 
      desc: 'Official Campus Senate Election Portal.', 
      eligible: '35,000+',
      candidates: [
        { id: 1, name: 'Simran Kaur', party: 'Ojashvi', votes: 210 },
        { id: 2, name: 'Rohit Gupta', party: 'Vivant', votes: 180 },
        { id: 3, name: 'Ankit Sharma', party: 'Ashre Army', votes: 110 }
      ]
    },
    { 
      id: 'chandigarh', 
      name: 'Chandigarh University', 
      location: 'Mohali, Punjab', 
      desc: 'Central Student Representative Elections.', 
      eligible: '30,000+',
      candidates: [
        { id: 1, name: 'Vikas Patel', party: 'Ashre Army', votes: 160 },
        { id: 2, name: 'Neha Sharma', party: 'Vivant', votes: 145 },
        { id: 3, name: 'Karan Mehra', party: 'Ojashvi', votes: 115 }
      ]
    }
  ]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      alert("Login failed: " + error.message);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      alert("Logout failed: " + error.message);
    }
  };

  const handleVote = (uniId, candidateId) => {
    if (!user) {
      alert("Please sign in with Google first to cast your vote!");
      return;
    }

    setUniversities(universities.map(uni => {
      if (uni.id === uniId) {
        const updatedCandidates = uni.candidates.map(cand => {
          if (cand.id === candidateId) {
            return { ...cand, votes: cand.votes + 1 };
          }
          return cand;
        });
        return { ...uni, candidates: updatedCandidates };
      }
      return uni;
    }));

    setSelectedUni(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        candidates: prev.candidates.map(c => c.id === candidateId ? { ...c, votes: c.votes + 1 } : c)
      };
    });

    alert("Vote recorded successfully!");
  };

  const handleAddCandidate = (e) => {
    e.preventDefault();
    if (!user) {
      alert("Please sign in with Google to register candidates!");
      return;
    }
    if (!candidateName.trim() || !candidateParty.trim()) {
      alert("Please fill in all fields.");
      return;
    }

    const newCandidate = {
      id: Date.now(),
      name: candidateName,
      party: candidateParty,
      votes: 0
    };

    setUniversities(universities.map(uni => {
      if (uni.id === selectedUni.id) {
        return { ...uni, candidates: [...uni.candidates, newCandidate] };
      }
      return uni;
    }));

    setSelectedUni(prev => ({
      ...prev,
      candidates: [...prev.candidates, newCandidate]
    }));

    setCandidateName('');
    setCandidateParty('');
    alert("Candidate registered successfully for " + selectedUni.name);
  };

  return (
    <div className="min-h-screen bg-[#0b0f17] text-gray-100 font-sans selection:bg-blue-500 selection:text-white">
      {/* Navbar with smooth shadow transition */}
      <nav className="p-4 border-b border-gray-800/80 backdrop-blur-md bg-[#0b0f17]/80 sticky top-0 z-50 transition-all duration-300">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold tracking-wider text-white bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">UniVote Pro</h1>
            <p className="text-[10px] text-gray-400">National Campus Election & Event Management Portal</p>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-xs text-green-400 hidden md:flex items-center gap-1.5 bg-green-950/50 px-3 py-1 rounded-full border border-green-800/50">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse inline-block"></span> Live Connection Active
            </span>
            {user ? (
              <div className="flex items-center gap-3 animate-fadeIn">
                <div className="flex items-center gap-2 bg-gray-900/90 border border-gray-800 px-3 py-1.5 rounded-xl shadow-lg">
                  <img src={user.photoURL} alt="Profile" className="w-7 h-7 rounded-full border border-blue-500/50 shadow-sm" />
                  <div className="text-left">
                    <p className="text-xs font-bold text-white leading-tight">{user.displayName}</p>
                    <p className="text-[10px] text-gray-400 leading-tight">{user.email}</p>
                  </div>
                </div>
                <button 
                  onClick={handleLogout}
                  className="bg-red-600/90 hover:bg-red-600 hover:scale-105 active:scale-95 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 shadow-lg shadow-red-900/20"
                >
                  Logout
                </button>
              </div>
            ) : (
              <button 
                onClick={handleGoogleLogin}
                className="bg-blue-600 hover:bg-blue-500 hover:scale-105 active:scale-95 px-5 py-2 rounded-xl text-sm font-medium transition-all duration-200 shadow-lg shadow-blue-600/30"
              >
                Sign in with Google
              </button>
            )}
          </div>
        </div>
      </nav>

      <main className="p-8 max-w-7xl mx-auto">
        {!selectedUni ? (
          <div>
            <h2 className="text-3xl font-extrabold text-center mb-2 tracking-tight">Select Your University</h2>
            <p className="text-gray-400 text-center mb-10 max-w-xl mx-auto text-sm">Click on your institution to view candidates, manage events, access voter authentication, and cast votes with secure 3D-enhanced interactions.</p>
            
            {/* University Cards Grid with 3D Hover & Smooth Transitions */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {universities.map((uni) => (
                <div 
                  key={uni.id} 
                  className="group bg-gray-900/80 border border-gray-800/80 p-6 rounded-2xl flex flex-col justify-between transition-all duration-300 ease-out hover:-translate-y-2 hover:scale-[1.02] hover:border-blue-500/50 hover:shadow-2xl hover:shadow-blue-500/10 relative overflow-hidden backdrop-blur-sm"
                >
                  {/* Subtle glowing background effect on hover */}
                  <div className="absolute inset-0 bg-gradient-to-b from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>

                  <div>
                    <div className="flex justify-between items-start mb-4">
                      <span className="text-2xl p-2 bg-gray-800/50 rounded-xl border border-gray-700/50 group-hover:scale-110 transition-transform duration-300">🏛️</span>
                      <span className="text-[10px] bg-green-950/80 text-green-400 px-2.5 py-1 rounded-full border border-green-800/50 font-medium tracking-wide">Elections Active</span>
                    </div>
                    <h3 className="font-bold text-lg text-white mb-1 group-hover:text-blue-400 transition-colors duration-200">{uni.name}</h3>
                    <p className="text-xs text-blue-400/90 mb-3 font-medium">📍 {uni.location}</p>
                    <p className="text-xs text-gray-400 mb-6 leading-relaxed">{uni.desc}</p>
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center text-xs text-gray-400 mb-4 border-t border-gray-800/80 pt-3">
                      <span>Eligible Voters:</span>
                      <strong className="text-white bg-gray-800/60 px-2 py-0.5 rounded border border-gray-700/50">{uni.eligible}</strong>
                    </div>
                    <button 
                      onClick={() => { setSelectedUni(uni); setActiveTab('voting'); }}
                      className="w-full bg-gray-800/90 hover:bg-blue-600 text-sm py-2.5 rounded-xl transition-all duration-200 font-medium text-center text-white shadow-md active:scale-95 group-hover:shadow-blue-600/30"
                    >
                      Open Portal →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="animate-fadeIn">
            <button 
              onClick={() => setSelectedUni(null)}
              className="text-sm text-blue-400 hover:text-blue-300 hover:-translate-x-1 transition-all duration-200 mb-6 inline-flex items-center gap-1 font-medium"
            >
              ← Back to Universities
            </button>
            
            <h2 className="text-3xl font-bold text-white mb-1">{selectedUni.name}</h2>
            <p className="text-gray-400 mb-6 text-sm">Student Union Election 2026 Portal</p>

            <div className="flex gap-3 mb-8 border-b border-gray-800/80 pb-4">
              <button 
                onClick={() => setActiveTab('voting')}
                className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 shadow-sm ${activeTab === 'voting' ? 'bg-blue-600 text-white shadow-blue-600/30 scale-105' : 'text-gray-400 hover:text-white bg-gray-900/80 border border-gray-800'}`}
              >
                Student Voting Booth
              </button>
              <button 
                onClick={() => setActiveTab('manager')}
                className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 shadow-sm ${activeTab === 'manager' ? 'bg-blue-600 text-white shadow-blue-600/30 scale-105' : 'text-gray-400 hover:text-white bg-gray-900/80 border border-gray-800'}`}
              >
                Event Manager Portal (Org Registration)
              </button>
            </div>

            {activeTab === 'voting' ? (
              <div className="space-y-4 max-w-3xl">
                <h3 className="text-lg font-semibold text-white mb-2">Active Candidates</h3>
                {selectedUni.candidates.map((cand) => (
                  <div 
                    key={cand.id} 
                    className="group bg-gray-900/80 border border-gray-800/80 p-5 rounded-2xl flex justify-between items-center transition-all duration-200 hover:-translate-y-1 hover:border-blue-500/40 hover:shadow-xl backdrop-blur-sm"
                  >
                    <div>
                      <span className="text-[10px] bg-blue-950/60 text-blue-400 px-2.5 py-0.5 rounded-full border border-blue-900/50 font-semibold uppercase tracking-wider">Party: {cand.party}</span>
                      <h4 className="font-bold text-base text-white mt-2">Candidate: {cand.name}</h4>
                      <p className="text-xs text-gray-400 mt-1">Total Votes: <strong className="text-white">{cand.votes}</strong></p>
                    </div>
                    <button 
                      onClick={() => handleVote(selectedUni.id, cand.id)}
                      className="bg-green-600 hover:bg-green-500 text-white px-6 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 shadow-lg shadow-green-600/20 hover:scale-105 active:scale-95"
                    >
                      Vote
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-gray-900/80 border border-gray-800/80 p-8 rounded-2xl max-w-xl backdrop-blur-sm shadow-xl">
                <h3 className="text-xl font-bold text-white mb-2">Register New Candidate / Organization</h3>
                <p className="text-xs text-gray-400 mb-6 leading-relaxed">Organizers can sign in with Google and register new candidates for {selectedUni.name}.</p>

                {user ? (
                  <form onSubmit={handleAddCandidate} className="space-y-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-300 mb-1.5">Candidate Name</label>
                      <input 
                        type="text" 
                        value={candidateName}
                        onChange={(e) => setCandidateName(e.target.value)}
                        placeholder="e.g. Amit Sharma"
                        className="w-full bg-gray-950/80 border border-gray-800 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-300 mb-1.5">Party / Organization Name</label>
                      <input 
                        type="text" 
                        value={candidateParty}
                        onChange={(e) => setCandidateParty(e.target.value)}
                        placeholder="e.g. Vivant"
                        className="w-full bg-gray-950/80 border border-gray-800 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                        required
                      />
                    </div>
                    <button 
                      type="submit"
                      className="bg-blue-600 hover:bg-blue-500 text-white w-full py-3 rounded-xl text-sm font-medium transition-all duration-200 shadow-lg shadow-blue-600/30 hover:scale-[1.01] active:scale-95 mt-2"
                    >
                      Add Candidate to Election
                    </button>
                  </form>
                ) : (
                  <div className="text-center py-8 bg-gray-950/60 rounded-xl border border-gray-800/80 px-4">
                    <p className="text-sm text-gray-300 mb-4">You must be signed in with Google to register candidates.</p>
                    <button 
                      onClick={handleGoogleLogin}
                      className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 shadow-lg shadow-blue-600/30 hover:scale-105 active:scale-95"
                    >
                      Sign in with Google Now
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}