import React, { useState, useEffect } from 'react';
import { auth, googleProvider } from './firebase';
import { signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';

export default function App() {
  const [user, setUser] = useState(null);
  const [currentView, setCurrentView] = useState('home'); // 'home', 'universities', 'portal'
  const [selectedUni, setSelectedUni] = useState(null);
  const [activeTab, setActiveTab] = useState('voting');

  const [candidateName, setCandidateName] = useState('');
  const [candidateParty, setCandidateParty] = useState('');

  // University Registration Form States
  const [showRegModal, setShowRegModal] = useState(false);
  const [regUniName, setRegUniName] = useState('');
  const [regLocation, setRegLocation] = useState('');
  const [regDesc, setRegDesc] = useState('');
  const [regEligible, setRegEligible] = useState('');
  const [regDoc, setRegDoc] = useState(null);
  
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
        { id: 1, name: 'Aditya Roy', party: 'Youth Front', votes: 150 },
        { id: 2, name: 'Sneha Kapoor', party: 'Alliance Club', votes: 130 },
        { id: 3, name: 'Mohit Tyagi', party: 'Phoenix Party', votes: 90 }
      ]
    },
    { 
      id: 'lpu', 
      name: 'Lovely Professional University', 
      location: 'Phagwara, Punjab', 
      desc: 'Official Campus Senate Election Portal.', 
      eligible: '35,000+',
      candidates: [
        { id: 1, name: 'Simran Kaur', party: 'Panther Group', votes: 210 },
        { id: 2, name: 'Rohit Gupta', party: 'Students Voice', votes: 180 },
        { id: 3, name: 'Ankit Sharma', party: 'Apex Union', votes: 110 }
      ]
    },
    { 
      id: 'chandigarh', 
      name: 'Chandigarh University', 
      location: 'Mohali, Punjab', 
      desc: 'Central Student Representative Elections.', 
      eligible: '30,000+',
      candidates: [
        { id: 1, name: 'Vikas Patel', party: 'Royal Squad', votes: 160 },
        { id: 2, name: 'Neha Sharma', party: 'Campus Force', votes: 145 },
        { id: 3, name: 'Karan Mehra', party: 'Inquilab Party', votes: 115 }
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

  // University registration bina login ke ab work karegi
  const handleUniversityRegistration = (e) => {
    e.preventDefault();
    if (!regUniName || !regLocation || !regDesc || !regEligible || !regDoc) {
      alert("Please fill all fields and upload verification documents.");
      return;
    }

    const newUni = {
      id: regUniName.toLowerCase().replace(/\s+/g, '-'),
      name: regUniName,
      location: regLocation,
      desc: regDesc,
      eligible: regEligible,
      candidates: []
    };

    setUniversities([...universities, newUni]);
    setShowRegModal(false);
    setRegUniName('');
    setRegLocation('');
    setRegDesc('');
    setRegEligible('');
    setRegDoc(null);
    alert("University registered successfully! It is now added to the portal.");
  };

  const getTotalVotes = (candidates) => {
    const total = candidates.reduce((acc, curr) => acc + curr.votes, 0);
    return total === 0 ? 1 : total;
  };

  return (
    <div className="min-h-screen bg-[#05070b] text-gray-100 font-sans relative overflow-hidden selection:bg-blue-500 selection:text-white">
      {/* Background ambient glowing orbs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none"></div>

      {/* Navbar */}
      <nav className="p-4 border-b border-gray-800/60 backdrop-blur-xl bg-[#05070b]/80 sticky top-0 z-50 shadow-2xl">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="cursor-pointer" onClick={() => { setCurrentView('home'); setSelectedUni(null); }}>
            <h1 className="text-xl font-extrabold tracking-wider text-white bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-500 bg-clip-text text-transparent">UniVote Pro</h1>
            <p className="text-[10px] text-gray-400 tracking-wide font-medium">National Campus Election & Event Management Portal</p>
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={() => { setCurrentView('home'); setSelectedUni(null); }}
              className={`text-xs md:text-sm font-semibold px-3 py-1.5 rounded-lg transition ${currentView === 'home' ? 'text-blue-400 bg-blue-950/40' : 'text-gray-300 hover:text-white'}`}
            >
              Home
            </button>
            <button 
              onClick={() => { setCurrentView('universities'); setSelectedUni(null); }}
              className={`text-xs md:text-sm font-semibold px-3 py-1.5 rounded-lg transition ${currentView === 'universities' && !selectedUni ? 'text-blue-400 bg-blue-950/40' : 'text-gray-300 hover:text-white'}`}
            >
              Universities
            </button>

            {user ? (
              <div className="flex items-center gap-3">
                <div className="hidden sm:flex items-center gap-2.5 bg-gray-900/90 border border-gray-700/60 px-3 py-1.5 rounded-2xl shadow-xl backdrop-blur-md">
                  <img src={user.photoURL} alt="Profile" className="w-8 h-8 rounded-full border-2 border-blue-500 shadow-md object-cover" />
                  <div className="text-left">
                    <p className="text-xs font-bold text-white leading-tight">{user.displayName}</p>
                    <p className="text-[10px] text-blue-400 font-medium leading-tight">{user.email}</p>
                  </div>
                </div>
                <button 
                  onClick={handleLogout}
                  className="bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 shadow-lg shadow-red-600/20 active:scale-95"
                >
                  Logout
                </button>
              </div>
            ) : (
              <button 
                onClick={handleGoogleLogin}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 shadow-xl shadow-blue-600/30 hover:scale-105 active:scale-95"
              >
                Sign in with Google
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="p-4 md:p-8 max-w-7xl mx-auto relative z-10">
        
        {/* VIEW 1: HOME PAGE */}
        {currentView === 'home' && !selectedUni && (
          <div className="py-12 md:py-20 text-center max-w-3xl mx-auto space-y-6">
            <span className="text-xs bg-blue-500/10 text-blue-400 px-4 py-1.5 rounded-full border border-blue-500/20 font-semibold uppercase tracking-widest inline-block shadow-inner">
              Secure Digital Ballot 2026
            </span>
            <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight leading-tight bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
              Transparent Campus Elections & Event Management
            </h1>
            <p className="text-gray-400 text-sm md:text-base leading-relaxed max-w-2xl mx-auto">
              Empowering student democracies nationwide. Cast secure votes, monitor real-time tally distributions, and manage university organizations effortlessly.
            </p>

            <div className="flex flex-wrap justify-center gap-4 pt-4">
              <button 
                onClick={() => setCurrentView('universities')}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white px-8 py-3.5 rounded-2xl font-bold text-sm shadow-xl shadow-blue-600/30 transition-all hover:scale-105 active:scale-95"
              >
                Browse Universities →
              </button>
              <button 
                onClick={() => setShowRegModal(true)}
                className="bg-gray-900/90 hover:bg-gray-800 text-white border border-gray-700/80 px-8 py-3.5 rounded-2xl font-bold text-sm shadow-xl transition-all hover:scale-105 active:scale-95"
              >
                Register as a University 🏛️
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-16 text-left">
              <div className="bg-gray-900/50 border border-gray-800 p-6 rounded-3xl backdrop-blur-md">
                <div className="text-2xl mb-2">🔒</div>
                <h3 className="font-bold text-white text-sm">Secure Google Auth</h3>
                <p className="text-xs text-gray-400 mt-1">Verified student logins prevent duplicate voting and maintain integrity.</p>
              </div>
              <div className="bg-gray-900/50 border border-gray-800 p-6 rounded-3xl backdrop-blur-md">
                <div className="text-2xl mb-2">📊</div>
                <h3 className="font-bold text-white text-sm">Live Tally & Share</h3>
                <p className="text-xs text-gray-400 mt-1">Instant percentage calculations and visual progress indicators.</p>
              </div>
              <div className="bg-gray-900/50 border border-gray-800 p-6 rounded-3xl backdrop-blur-md">
                <div className="text-2xl mb-2">🏛️</div>
                <h3 className="font-bold text-white text-sm">Multi-Institution</h3>
                <p className="text-xs text-gray-400 mt-1">Support for independent university profiles and custom party factions.</p>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 2: UNIVERSITIES LIST GRID */}
        {(currentView === 'universities' || currentView === 'home') && !selectedUni && currentView === 'universities' && (
          <div>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
              <div>
                <span className="text-xs bg-blue-500/10 text-blue-400 px-3 py-1 rounded-full border border-blue-500/20 font-semibold uppercase tracking-widest inline-block mb-2">Official Portal</span>
                <h2 className="text-3xl font-black text-white">Select Your University</h2>
                <p className="text-gray-400 text-xs md:text-sm mt-1">Choose your institution to cast secure ballots or inspect candidate lists.</p>
              </div>
              <button 
                onClick={() => setShowRegModal(true)}
                className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-xl font-bold text-xs shadow-lg transition"
              >
                + Register New University
              </button>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {universities.map((uni) => (
                <div 
                  key={uni.id} 
                  className="group relative bg-gradient-to-b from-gray-900/90 to-gray-950/90 border border-gray-800/80 p-6 rounded-3xl flex flex-col justify-between transition-all duration-500 ease-out hover:-translate-y-2 hover:scale-[1.02] hover:border-blue-500/60 hover:shadow-[0_20px_50px_rgba(59,130,246,0.15)] backdrop-blur-xl overflow-hidden"
                >
                  <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                  <div>
                    <div className="flex justify-between items-start mb-4">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600/20 to-indigo-600/20 border border-blue-500/30 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform duration-300 shadow-inner">
                        🏛️
                      </div>
                      <span className="text-[10px] bg-emerald-950/80 text-emerald-400 px-3 py-1 rounded-full border border-emerald-800/60 font-semibold tracking-wider shadow-sm">Active</span>
                    </div>
                    <h3 className="font-bold text-lg text-white mb-1 group-hover:text-blue-400 transition-colors duration-300">{uni.name}</h3>
                    <p className="text-xs text-blue-400/90 mb-3 font-medium flex items-center gap-1">📍 {uni.location}</p>
                    <p className="text-xs text-gray-400 mb-6 leading-relaxed">{uni.desc}</p>
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center text-xs text-gray-400 mb-4 border-t border-gray-800/80 pt-3">
                      <span>Eligible Voters:</span>
                      <strong className="text-white bg-gray-800/60 px-2.5 py-1 rounded-lg border border-gray-700/50">{uni.eligible}</strong>
                    </div>
                    <button 
                      onClick={() => { setSelectedUni(uni); setActiveTab('voting'); }}
                      className="w-full bg-gray-800/80 hover:bg-gradient-to-r hover:from-blue-600 hover:to-indigo-600 text-sm py-3 rounded-xl transition-all duration-300 font-semibold text-center text-white shadow-lg active:scale-95 group-hover:shadow-blue-600/30 border border-gray-700/50 group-hover:border-transparent"
                    >
                      Open Portal →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* VIEW 3: SELECTED UNIVERSITY PORTAL */}
        {selectedUni && (
          <div className="animate-fadeIn">
            <button 
              onClick={() => setSelectedUni(null)}
              className="text-sm text-blue-400 hover:text-blue-300 hover:-translate-x-1 transition-all duration-200 mb-6 inline-flex items-center gap-1 font-semibold"
            >
              ← Back to Universities
            </button>
            
            <div className="mb-8 bg-gradient-to-r from-gray-900/90 to-gray-950/90 border border-gray-800/80 p-6 rounded-3xl backdrop-blur-xl shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <span className="text-xs bg-blue-500/10 text-blue-400 px-3 py-1 rounded-full border border-blue-500/20 font-semibold uppercase tracking-widest mb-2 inline-block">Institution Portal</span>
                <h2 className="text-2xl md:text-3xl font-black text-white">{selectedUni.name}</h2>
                <p className="text-gray-400 text-xs md:text-sm mt-1">Student Union Election 2026 • Secure Balloting System</p>
              </div>
              <div className="flex gap-2 bg-gray-950 p-1.5 rounded-2xl border border-gray-800">
                <button 
                  onClick={() => setActiveTab('voting')}
                  className={`px-5 py-2.5 rounded-xl text-xs md:text-sm font-semibold transition-all duration-300 ${activeTab === 'voting' ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-600/30' : 'text-gray-400 hover:text-white'}`}
                >
                  Voting Booth
                </button>
                <button 
                  onClick={() => setActiveTab('manager')}
                  className={`px-5 py-2.5 rounded-xl text-xs md:text-sm font-semibold transition-all duration-300 ${activeTab === 'manager' ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-600/30' : 'text-gray-400 hover:text-white'}`}
                >
                  Event Manager
                </button>
              </div>
            </div>

            {activeTab === 'voting' ? (
              <div className="space-y-4 max-w-3xl">
                <h3 className="text-lg font-bold text-white mb-2">Live Candidates & Standings</h3>
                {selectedUni.candidates.length === 0 ? (
                  <p className="text-xs text-gray-400 bg-gray-900 p-6 rounded-2xl border border-gray-800">No candidates registered yet. Switch to Event Manager to add candidates.</p>
                ) : (
                  selectedUni.candidates.map((cand) => {
                    const total = getTotalVotes(selectedUni.candidates);
                    const percentage = Math.round((cand.votes / total) * 100);

                    return (
                      <div 
                        key={cand.id} 
                        className="group bg-gradient-to-b from-gray-900/90 to-gray-950/90 border border-gray-800/80 p-6 rounded-3xl transition-all duration-300 hover:border-blue-500/50 hover:shadow-2xl backdrop-blur-xl space-y-4"
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <span className="text-[10px] bg-blue-950/80 text-blue-400 px-3 py-1 rounded-full border border-blue-900/60 font-bold uppercase tracking-widest">Party: {cand.party}</span>
                            <h4 className="font-bold text-lg text-white mt-2">{cand.name}</h4>
                          </div>
                          <button 
                            onClick={() => handleVote(selectedUni.id, cand.id)}
                            className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white px-6 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 shadow-lg shadow-emerald-600/20 hover:scale-105 active:scale-95"
                          >
                            Cast Vote
                          </button>
                        </div>

                        <div>
                          <div className="flex justify-between text-xs text-gray-400 mb-1.5 font-medium">
                            <span>Votes: <strong className="text-white">{cand.votes}</strong></span>
                            <span className="text-blue-400 font-bold">{percentage}% Share</span>
                          </div>
                          <div className="w-full bg-gray-950 h-2.5 rounded-full overflow-hidden border border-gray-800/80">
                            <div 
                              className="bg-gradient-to-r from-blue-500 to-indigo-500 h-full rounded-full transition-all duration-500 shadow-[0_0_12px_rgba(59,130,246,0.5)]"
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            ) : (
              <div className="bg-gradient-to-b from-gray-900/90 to-gray-950/90 border border-gray-800/80 p-8 rounded-3xl max-w-xl backdrop-blur-xl shadow-2xl">
                <h3 className="text-xl font-bold text-white mb-2">Register New Candidate / Organization</h3>
                <p className="text-xs text-gray-400 mb-6 leading-relaxed">Authorized organizers can sign in with Google and register new candidates directly for {selectedUni.name}.</p>

                {user ? (
                  <form onSubmit={handleAddCandidate} className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-300 mb-2">Candidate Name</label>
                      <input 
                        type="text" 
                        value={candidateName}
                        onChange={(e) => setCandidateName(e.target.value)}
                        placeholder="e.g. Amit Sharma"
                        className="w-full bg-gray-950/90 border border-gray-800 rounded-xl p-3.5 text-sm text-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-300 mb-2">Party / Organization Name</label>
                      <input 
                        type="text" 
                        value={candidateParty}
                        onChange={(e) => setCandidateParty(e.target.value)}
                        placeholder="e.g. Youth Front"
                        className="w-full bg-gray-950/90 border border-gray-800 rounded-xl p-3.5 text-sm text-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                        required
                      />
                    </div>
                    <button 
                      type="submit"
                      className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white w-full py-3.5 rounded-xl text-sm font-bold transition-all duration-300 shadow-xl shadow-blue-600/30 hover:scale-[1.01] active:scale-95 mt-2"
                    >
                      Add Candidate to Election
                    </button>
                  </form>
                ) : (
                  <div className="text-center py-10 bg-gray-950/80 rounded-2xl border border-gray-800/80 px-4">
                    <p className="text-sm text-gray-300 mb-4">You must be signed in with Google to register candidates.</p>
                    <button 
                      onClick={handleGoogleLogin}
                      className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-300 shadow-xl shadow-blue-600/30 hover:scale-105 active:scale-95"
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

      {/* UNIVERSITY REGISTRATION MODAL (Bina Login ke open aur submit hoga) */}
      {showRegModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 border border-gray-800 p-6 md:p-8 rounded-3xl max-w-lg w-full shadow-2xl relative animate-fadeIn max-h-[90vh] overflow-y-auto">
            <button 
              onClick={() => setShowRegModal(false)}
              className="absolute top-5 right-5 text-gray-400 hover:text-white text-lg font-bold"
            >
              ✕
            </button>

            <h3 className="text-2xl font-black text-white mb-2">Register Your University</h3>
            <p className="text-xs text-gray-400 mb-6">Fill out the official details and upload verification documents to deploy your campus election portal.</p>

            <form onSubmit={handleUniversityRegistration} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1.5">University Name</label>
                <input 
                  type="text" 
                  value={regUniName}
                  onChange={(e) => setRegUniName(e.target.value)}
                  placeholder="e.g. Delhi University"
                  className="w-full bg-gray-950 border border-gray-800 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1.5">Location (City, State)</label>
                <input 
                  type="text" 
                  value={regLocation}
                  onChange={(e) => setRegLocation(e.target.value)}
                  placeholder="e.g. New Delhi, Delhi"
                  className="w-full bg-gray-950 border border-gray-800 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1.5">Short Description</label>
                <textarea 
                  value={regDesc}
                  onChange={(e) => setRegDesc(e.target.value)}
                  placeholder="Brief description of the university council..."
                  rows="2"
                  className="w-full bg-gray-950 border border-gray-800 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-blue-500 resize-none"
                  required
                ></textarea>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1.5">Eligible Voters Count</label>
                <input 
                  type="text" 
                  value={regEligible}
                  onChange={(e) => setRegEligible(e.target.value)}
                  placeholder="e.g. 40,000+"
                  className="w-full bg-gray-950 border border-gray-800 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1.5">Upload Verification Document (ID Proof / Authority Letter)</label>
                <input 
                  type="file" 
                  onChange={(e) => setRegDoc(e.target.files[0])}
                  className="w-full bg-gray-950 border border-gray-800 rounded-xl p-2.5 text-xs text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-500"
                  required
                />
              </div>

              <button 
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white py-3.5 rounded-xl text-sm font-bold shadow-lg transition mt-4"
              >
                Submit University Registration
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}