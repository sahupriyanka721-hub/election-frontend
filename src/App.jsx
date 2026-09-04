import React, { useState, useEffect } from 'react';
import { auth, googleProvider } from './firebase';
import { signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';

export default function App() {
  const [user, setUser] = useState(null);
  const [selectedUni, setSelectedUni] = useState(null);
  const [activeTab, setActiveTab] = useState('info'); 

  // Dark / Light Mode State with toggle button
  const [isDarkMode, setIsDarkMode] = useState(true);

  // Student Marks Management States
  const [studentMarks, setStudentMarks] = useState([
    { id: 1, subject: 'Data Structures & Algorithms', marks: '88/100', grade: 'A+' },
    { id: 2, subject: 'Database Management Systems', marks: '82/100', grade: 'A' },
    { id: 3, subject: 'Software Engineering', marks: '90/100', grade: 'O' }
  ]);
  const [newSubject, setNewSubject] = useState('');
  const [newMarks, setNewMarks] = useState('');
  const [newGrade, setNewGrade] = useState('');

  // University Registration Form States
  const [showRegModal, setShowRegModal] = useState(false);
  const [regUniName, setRegUniName] = useState('');
  const [regLocation, setRegLocation] = useState('');
  const [regDesc, setRegDesc] = useState('');
  const [regEligible, setRegEligible] = useState('');
  const [regDoc, setRegDoc] = useState(null);

  const [candidateName, setCandidateName] = useState('');
  const [candidateParty, setCandidateParty] = useState('');
  
  // Universities List with Images
  const [universities, setUniversities] = useState([
    { 
      id: 'graphic-era', 
      name: 'Graphic Era University', 
      location: 'Dehradun, Uttarakhand', 
      desc: 'Graphic Era (Deemed to be University) student union election portal.', 
      eligible: '18,500+',
      status: 'Approved',
      docName: 'Graphic_Era_Trust_Docs.pdf',
      image: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=1200&q=80',
      candidates: [
        { id: 1, name: 'Aarav Sharma', party: 'Vivant', votes: 120 },
        { id: 2, name: 'Rahul Verma', party: 'Ojashvi', votes: 95 }
      ],
      organizations: [
        { name: 'Vivant Council', type: 'Primary Student Governing Body' },
        { name: 'Ojashvi Welfare', type: 'Campus Activities & Events' }
      ]
    },
    { 
      id: 'amity', 
      name: 'Amity University', 
      location: 'Noida, Uttar Pradesh', 
      desc: 'Annual Student Council Election for Amity University main campus.', 
      eligible: '25,000+',
      status: 'Approved',
      docName: 'Amity_Compliance_Bundle.pdf',
      image: 'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=1200&q=80',
      candidates: [
        { id: 1, name: 'Aditya Roy', party: 'Youth Front', votes: 150 }
      ],
      organizations: [
        { name: 'Youth Front Council', type: 'Primary Student Governing Body' },
        { name: 'Panther Student Union', type: 'Campus Welfare & Activities' }
      ]
    },
    { 
      id: 'lpu', 
      name: 'Lovely Professional University', 
      location: 'Phagwara, Punjab', 
      desc: 'Official Campus Senate Election Portal.', 
      eligible: '35,000+',
      status: 'Approved',
      docName: 'LPU_Registration_Bundle.pdf',
      image: 'https://images.unsplash.com/photo-1595535373655-4b9c2aae42d1?q=80&w=938&auto=format&fit=crop',
      candidates: [
        { id: 1, name: 'Simran Kaur', party: 'Panther Group', votes: 210 }
      ],
      organizations: [
        { name: 'Panther Group Senate', type: 'Primary Student Governing Body' }
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
        return {
          ...uni,
          candidates: uni.candidates.map(c => c.id === candidateId ? { ...c, votes: c.votes + 1 } : c)
        };
      }
      return uni;
    }));
    setSelectedUni(prev => ({
      ...prev,
      candidates: prev.candidates.map(c => c.id === candidateId ? { ...c, votes: c.votes + 1 } : c)
    }));
    alert("Vote recorded successfully!");
  };

  const handleAddCandidate = (e) => {
    e.preventDefault();
    if (!candidateName.trim() || !candidateParty.trim()) return;
    const newCand = { id: Date.now(), name: candidateName, party: candidateParty, votes: 0 };
    setUniversities(universities.map(uni => uni.id === selectedUni.id ? { ...uni, candidates: [...uni.candidates, newCand] } : uni));
    setSelectedUni(prev => ({ ...prev, candidates: [...prev.candidates, newCand] }));
    setCandidateName('');
    setCandidateParty('');
    alert("Candidate registered successfully!");
  };

  const handleUpdateMarks = (e) => {
    e.preventDefault();
    if (!newSubject.trim() || !newMarks.trim() || !newGrade.trim()) return;
    setStudentMarks([...studentMarks, { id: Date.now(), subject: newSubject, marks: newMarks, grade: newGrade }]);
    setNewSubject('');
    setNewMarks('');
    setNewGrade('');
    alert("Marks added successfully!");
  };

  const handleUniversityRegistration = (e) => {
    e.preventDefault();
    if (!regUniName || !regLocation || !regDesc || !regEligible || !regDoc) return;
    const newUni = {
      id: regUniName.toLowerCase().replace(/\s+/g, '-'),
      name: regUniName,
      location: regLocation,
      desc: regDesc,
      eligible: regEligible,
      status: 'Approved',
      docName: regDoc.name,
      image: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=1200&q=80',
      candidates: [],
      organizations: [{ name: 'Default Student Body', type: 'Governing Council' }]
    };
    setUniversities([...universities, newUni]);
    setShowRegModal(false);
    setRegUniName('');
    setRegLocation('');
    setRegDesc('');
    setRegEligible('');
    setRegDoc(null);
    alert("University registered successfully!");
  };

  const getTotalVotes = (candidates) => {
    const total = candidates.reduce((acc, curr) => acc + curr.votes, 0);
    return total === 0 ? 1 : total;
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-[#0b0f17] text-gray-100' : 'bg-gray-100 text-gray-900'} font-sans relative`}>
      
      {/* Navbar with Dark/Light Mode Toggle Button */}
      <nav className={`p-4 border-b ${isDarkMode ? 'border-gray-800 bg-[#0b0f17]/90' : 'border-gray-300 bg-white/90'} backdrop-blur-md sticky top-0 z-50`}>
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="cursor-pointer flex items-center gap-2" onClick={() => setSelectedUni(null)}>
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-white">V</div>
            <h1 className="text-base font-black tracking-wider">UniVote Pro</h1>
          </div>

          <div className="flex items-center gap-4">
            <button onClick={() => setSelectedUni(null)} className={`text-xs font-semibold px-3 py-1.5 rounded-lg ${isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-black'}`}>Home / Universities</button>
            <button onClick={() => setShowRegModal(true)} className={`text-xs font-semibold px-3 py-1.5 rounded-lg ${isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-black'}`}>Register University 🏛️</button>
            
            {/* Theme Toggle Button */}
            <button 
              onClick={() => setIsDarkMode(!isDarkMode)} 
              className={`px-3 py-1 rounded-lg text-xs font-bold border ${isDarkMode ? 'border-gray-700 bg-gray-900 text-yellow-400' : 'border-gray-300 bg-gray-200 text-amber-600'}`}
              title="Toggle Dark/Light Mode"
            >
              {isDarkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
            </button>

            {user ? (
              <div className={`flex items-center gap-2 border px-3 py-1 rounded-xl ${isDarkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-300 shadow-sm'}`}>
                <img src={user.photoURL} alt="User" className="w-6 h-6 rounded-full object-cover" />
                <span className="text-xs font-bold">{user.displayName}</span>
                <button onClick={handleLogout} className="bg-red-600 text-white px-2 py-0.5 rounded text-[10px]">Logout</button>
              </div>
            ) : (
              <button onClick={handleGoogleLogin} className="bg-blue-600 hover:bg-blue-500 text-white px-3 py-1.5 rounded-xl text-xs font-bold">Sign in with Google</button>
            )}
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="p-6 max-w-7xl mx-auto">

        {/* VIEW 1: UNIVERSITIES HOME LIST (With Images & Cards exactly like before) */}
        {!selectedUni && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-black">Select University Dashboard</h2>
                <p className="text-xs text-gray-500 mt-1">Choose your institution to manage elections, info hubs, and portals.</p>
              </div>
              <button onClick={() => setShowRegModal(true)} className="bg-blue-600 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-md">+ Register New University</button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {universities.map(uni => (
                <div key={uni.id} className={`border rounded-2xl overflow-hidden shadow-xl flex flex-col justify-between ${isDarkMode ? 'bg-[#111726] border-gray-800' : 'bg-white border-gray-200'}`}>
                  <div className="h-40 w-full relative">
                    <img src={uni.image} alt={uni.name} className="w-full h-full object-cover" />
                    <span className="absolute top-3 right-3 text-[10px] bg-emerald-950 text-emerald-400 px-2.5 py-0.5 rounded-full border border-emerald-800 font-semibold">Active</span>
                  </div>
                  <div className="p-5 space-y-3">
                    <h3 className="font-bold text-base">{uni.name}</h3>
                    <p className="text-xs text-blue-400">📍 {uni.location}</p>
                    <p className={`text-xs line-clamp-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{uni.desc}</p>
                    <button onClick={() => { setSelectedUni(uni); setActiveTab('info'); }} className={`w-full text-xs py-2.5 rounded-xl transition font-semibold border ${isDarkMode ? 'bg-gray-800 hover:bg-blue-600 text-white border-gray-700' : 'bg-gray-100 hover:bg-blue-600 hover:text-white text-gray-800 border-gray-300'}`}>
                      Open Dashboard →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* VIEW 2: EXACT UNIVERSITY DASHBOARD LAYOUT WITH SIDEBAR */}
        {selectedUni && (
          <div className="space-y-6">
            
            {/* Top University Header Banner */}
            <div className={`flex justify-between items-center border p-6 rounded-2xl shadow-xl ${isDarkMode ? 'bg-[#111726] border-gray-800' : 'bg-white border-gray-200'}`}>
              <div>
                <h2 className="text-2xl md:text-3xl font-black">{selectedUni.name}</h2>
                <p className="text-xs text-gray-400 mt-1">📍 {selectedUni.location} • Comprehensive Info Hub</p>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-gray-400 block">Total Eligible Voters:</span>
                <strong className={`text-sm border px-3 py-1 rounded-lg inline-block mt-0.5 ${isDarkMode ? 'bg-gray-900 border-gray-800 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'}`}>{selectedUni.eligible}</strong>
              </div>
            </div>

            {/* Dashboard Layout with Sidebar */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              
              {/* SIDEBAR NAVIGATION */}
              <div className={`border rounded-2xl p-4 space-y-2 h-fit ${isDarkMode ? 'bg-[#111726] border-gray-800' : 'bg-white border-gray-200'}`}>
                <p className="text-[10px] uppercase font-bold text-gray-500 tracking-wider px-3 mb-2">Dashboard Navigation</p>
                
                <button onClick={() => setActiveTab('info')} className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2.5 ${activeTab === 'info' ? 'bg-blue-600 text-white shadow-lg' : isDarkMode ? 'text-gray-300 hover:bg-gray-900' : 'text-gray-700 hover:bg-gray-100'}`}>
                  🏛️ University Info Hub
                </button>
                <button onClick={() => setActiveTab('voting')} className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2.5 ${activeTab === 'voting' ? 'bg-blue-600 text-white shadow-lg' : isDarkMode ? 'text-gray-300 hover:bg-gray-900' : 'text-gray-700 hover:bg-gray-100'}`}>
                  🗳️ Voting & Standings
                </button>
                <button onClick={() => setActiveTab('student-portal')} className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2.5 ${activeTab === 'student-portal' ? 'bg-blue-600 text-white shadow-lg' : isDarkMode ? 'text-gray-300 hover:bg-gray-900' : 'text-gray-700 hover:bg-gray-100'}`}>
                  🎓 Student Portal & Marks
                </button>
                <button onClick={() => setActiveTab('manager')} className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2.5 ${activeTab === 'manager' ? 'bg-blue-600 text-white shadow-lg' : isDarkMode ? 'text-gray-300 hover:bg-gray-900' : 'text-gray-700 hover:bg-gray-100'}`}>
                  👥 Candidate Manager
                </button>
                <button onClick={() => setActiveTab('uni-admin')} className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2.5 ${activeTab === 'uni-admin' ? 'bg-purple-600 text-white shadow-lg' : isDarkMode ? 'text-gray-300 hover:bg-gray-900' : 'text-gray-700 hover:bg-gray-100'}`}>
                  🛡️ Uni Admin Panel
                </button>
                <button onClick={() => setActiveTab('orgs')} className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2.5 ${activeTab === 'orgs' ? 'bg-emerald-600 text-white shadow-lg' : isDarkMode ? 'text-gray-300 hover:bg-gray-900' : 'text-gray-700 hover:bg-gray-100'}`}>
                  🏢 Organizations Hub
                </button>

                <div className={`pt-4 border-t mt-4 ${isDarkMode ? 'border-gray-800' : 'border-gray-200'}`}>
                  <button onClick={() => setSelectedUni(null)} className="w-full text-center text-xs text-gray-500 hover:text-blue-500 py-2 font-semibold">
                    ← Back to Universities List
                  </button>
                </div>
              </div>

              {/* MAIN CONTENT AREA DEPENDING ON TAB */}
              <div className="lg:col-span-3 space-y-6">
                
                {/* TAB 1: UNIVERSITY INFO HUB */}
                {activeTab === 'info' && (
                  <div className="space-y-6">
                    <div className={`border rounded-2xl p-6 space-y-4 ${isDarkMode ? 'bg-[#111726] border-gray-800' : 'bg-white border-gray-200'}`}>
                      <span className="text-[10px] bg-blue-500/10 text-blue-400 px-3 py-1 rounded-full border border-blue-500/20 font-semibold uppercase tracking-wider">Master Information Record</span>
                      <h3 className="text-xl font-black">{selectedUni.name} Overview</h3>
                      <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{selectedUni.desc}</p>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                        <div className={`border p-4 rounded-xl ${isDarkMode ? 'bg-gray-900 border-gray-800' : 'bg-gray-50 border-gray-200'}`}>
                          <p className="text-[10px] text-gray-500">Total Registered Voters</p>
                          <p className="text-xl font-black mt-1">{selectedUni.eligible}</p>
                        </div>
                        <div className={`border p-4 rounded-xl ${isDarkMode ? 'bg-gray-900 border-gray-800' : 'bg-gray-50 border-gray-200'}`}>
                          <p className="text-[10px] text-gray-500">Active Student Organizations</p>
                          <p className="text-xl font-black mt-1">{selectedUni.organizations?.length || 2} Bodies</p>
                        </div>
                        <div className={`border p-4 rounded-xl ${isDarkMode ? 'bg-gray-900 border-gray-800' : 'bg-gray-50 border-gray-200'}`}>
                          <p className="text-[10px] text-gray-500">Registered Candidates</p>
                          <p className="text-xl font-black mt-1">{selectedUni.candidates.length}</p>
                        </div>
                      </div>
                    </div>

                    {/* Associated Student Organizations */}
                    <div className={`border rounded-2xl p-6 space-y-4 ${isDarkMode ? 'bg-[#111726] border-gray-800' : 'bg-white border-gray-200'}`}>
                      <h3 className="text-sm font-bold">Associated Student Organizations</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {selectedUni.organizations?.map((org, idx) => (
                          <div key={idx} className={`flex justify-between items-center p-4 rounded-xl border ${isDarkMode ? 'bg-gray-900 border-gray-800' : 'bg-gray-50 border-gray-200'}`}>
                            <div>
                              <p className="text-xs font-bold">{org.name}</p>
                              <p className="text-[10px] text-gray-500">{org.type}</p>
                            </div>
                            <span className="text-[10px] bg-emerald-950 text-emerald-400 px-2.5 py-1 rounded-full border border-emerald-800 font-bold">Verified</span>
                          </div>
                        ))}
                      </div>

                      {/* Institutional Verification Bundle */}
                      <div className={`pt-4 border-t flex justify-between items-center ${isDarkMode ? 'border-gray-800' : 'border-gray-200'}`}>
                        <div>
                          <p className="text-[10px] uppercase font-bold text-gray-500">Institutional Verification Bundle</p>
                          <p className="text-xs font-semibold mt-0.5">📄 {selectedUni.docName}</p>
                        </div>
                        <button onClick={() => alert("Downloading document verification bundle...")} className={`px-4 py-2 rounded-xl text-xs font-bold border ${isDarkMode ? 'bg-gray-800 hover:bg-gray-700 border-gray-700 text-white' : 'bg-gray-100 hover:bg-gray-200 border-gray-300 text-gray-800'}`}>
                          View Document Details
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 2: VOTING & STANDINGS */}
                {activeTab === 'voting' && (
                  <div className={`border rounded-2xl p-6 space-y-6 ${isDarkMode ? 'bg-[#111726] border-gray-800' : 'bg-white border-gray-200'}`}>
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="text-lg font-black">Active Ballot Box & Standings</h3>
                        <p className="text-xs text-gray-500">Cast your secure vote for registered candidates.</p>
                      </div>
                      <span className="text-xs bg-emerald-500/10 text-emerald-400 px-3 py-1 rounded-full border border-emerald-500/20 font-bold">Live</span>
                    </div>

                    {selectedUni.candidates.length === 0 ? (
                      <p className="text-xs text-gray-500 py-6 text-center">No candidates available.</p>
                    ) : (
                      <div className="space-y-4">
                        {selectedUni.candidates.map(cand => {
                          const total = getTotalVotes(selectedUni.candidates);
                          const percentage = Math.round((cand.votes / total) * 100);
                          return (
                            <div key={cand.id} className={`border p-4 rounded-xl space-y-2 ${isDarkMode ? 'bg-gray-900 border-gray-800' : 'bg-gray-50 border-gray-200'}`}>
                              <div className="flex justify-between items-center">
                                <div>
                                  <p className="text-xs font-bold">{cand.name} <span className="text-blue-400 font-normal">({cand.party})</span></p>
                                  <p className="text-[10px] text-gray-500">{cand.votes} Votes ({percentage}%)</p>
                                </div>
                                <button onClick={() => handleVote(selectedUni.id, cand.id)} className="bg-blue-600 hover:bg-blue-500 text-white px-3.5 py-1.5 rounded-xl text-xs font-bold">
                                  Vote 🗳️
                                </button>
                              </div>
                              <div className={`w-full h-2 rounded-full overflow-hidden ${isDarkMode ? 'bg-gray-950' : 'bg-gray-200'}`}>
                                <div className="bg-blue-500 h-full transition-all" style={{ width: `${percentage}%` }}></div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}

                {/* TAB 3: STUDENT PORTAL & MARKS */}
                {activeTab === 'student-portal' && (
                  <div className={`border rounded-2xl p-6 space-y-6 ${isDarkMode ? 'bg-[#111726] border-gray-800' : 'bg-white border-gray-200'}`}>
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="text-lg font-black">Student Portal & Academic Marks</h3>
                        <p className="text-xs text-gray-500">Semester performance records.</p>
                      </div>
                      {user && (
                        <div className={`flex items-center gap-2 border px-3 py-1.5 rounded-xl ${isDarkMode ? 'bg-gray-900 border-gray-800' : 'bg-gray-50 border-gray-200'}`}>
                          <img src={user.photoURL} alt="User" className="w-6 h-6 rounded-full object-cover" />
                          <span className="text-xs font-bold">{user.displayName}</span>
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="md:col-span-2 space-y-3">
                        <h4 className="text-xs font-bold text-gray-500 uppercase">Grade Report</h4>
                        {studentMarks.map(m => (
                          <div key={m.id} className={`flex justify-between items-center border p-3.5 rounded-xl ${isDarkMode ? 'bg-gray-900 border-gray-800' : 'bg-gray-50 border-gray-200'}`}>
                            <div>
                              <p className="text-xs font-bold">{m.subject}</p>
                              <p className="text-[10px] text-gray-500">Score: {m.marks}</p>
                            </div>
                            <span className="text-xs font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-800 px-2.5 py-1 rounded-lg">Grade: {m.grade}</span>
                          </div>
                        ))}
                      </div>

                      {/* Add Marks Form */}
                      <div className={`border p-4 rounded-xl space-y-3 h-fit ${isDarkMode ? 'bg-gray-900 border-gray-800' : 'bg-gray-50 border-gray-200'}`}>
                        <h4 className="text-xs font-bold">Add Subject Record</h4>
                        <form onSubmit={handleUpdateMarks} className="space-y-2.5">
                          <input type="text" value={newSubject} onChange={e => setNewSubject(e.target.value)} placeholder="Subject Name" className={`w-full border rounded-xl p-2.5 text-xs ${isDarkMode ? 'bg-gray-950 border-gray-800 text-white' : 'bg-white border-gray-300 text-gray-900'}`} required />
                          <input type="text" value={newMarks} onChange={e => setNewMarks(e.target.value)} placeholder="Marks (e.g. 85/100)" className={`w-full border rounded-xl p-2.5 text-xs ${isDarkMode ? 'bg-gray-950 border-gray-800 text-white' : 'bg-white border-gray-300 text-gray-900'}`} required />
                          <input type="text" value={newGrade} onChange={e => setNewGrade(e.target.value)} placeholder="Grade (e.g. A)" className={`w-full border rounded-xl p-2.5 text-xs ${isDarkMode ? 'bg-gray-950 border-gray-800 text-white' : 'bg-white border-gray-300 text-gray-900'}`} required />
                          <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-xl text-xs font-bold">Add Record</button>
                        </form>
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 4: CANDIDATE MANAGER */}
                {activeTab === 'manager' && (
                  <div className={`border rounded-2xl p-6 space-y-6 ${isDarkMode ? 'bg-[#111726] border-gray-800' : 'bg-white border-gray-200'}`}>
                    <div>
                      <h3 className="text-lg font-black">Candidate Manager</h3>
                      <p className="text-xs text-gray-500">Register new candidates for election ballots.</p>
                    </div>

                    <form onSubmit={handleAddCandidate} className="space-y-4 max-w-md">
                      <div>
                        <label className="block text-xs font-semibold text-gray-500 mb-1">Candidate Name</label>
                        <input type="text" value={candidateName} onChange={e => setCandidateName(e.target.value)} placeholder="e.g. Priya Sharma" className={`w-full border rounded-xl p-3 text-xs ${isDarkMode ? 'bg-gray-900 border-gray-800 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'}`} required />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-500 mb-1">Party Name</label>
                        <input type="text" value={candidateParty} onChange={e => setCandidateParty(e.target.value)} placeholder="e.g. Student Alliance" className={`w-full border rounded-xl p-3 text-xs ${isDarkMode ? 'bg-gray-900 border-gray-800 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'}`} required />
                      </div>
                      <button type="submit" className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-xl text-xs font-bold">Submit Candidate</button>
                    </form>
                  </div>
                )}

                {/* TAB 5: UNI ADMIN PANEL */}
                {activeTab === 'uni-admin' && (
                  <div className={`border rounded-2xl p-6 space-y-4 ${isDarkMode ? 'bg-[#111726] border-gray-800' : 'bg-white border-gray-200'}`}>
                    <span className="text-[10px] bg-purple-500/10 text-purple-400 px-3 py-1 rounded-full border border-purple-500/20 font-bold">Uni Admin Access</span>
                    <h3 className="text-xl font-black">{selectedUni.name} Administration Control</h3>
                    <p className="text-xs text-gray-500">Manage institution voting rolls and review compliance documentation.</p>
                    <div className="grid grid-cols-2 gap-4 pt-2">
                      <div className={`border p-4 rounded-xl ${isDarkMode ? 'bg-gray-900 border-gray-800' : 'bg-gray-50 border-gray-200'}`}>
                        <p className="text-xs text-gray-500">Total Registered Candidates</p>
                        <p className="text-2xl font-black mt-1">{selectedUni.candidates.length}</p>
                      </div>
                      <div className={`border p-4 rounded-xl ${isDarkMode ? 'bg-gray-900 border-gray-800' : 'bg-gray-50 border-gray-200'}`}>
                        <p className="text-xs text-gray-500">Status</p>
                        <p className="text-2xl font-black text-emerald-400 mt-1">Active</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 6: ORGANIZATIONS HUB */}
                {activeTab === 'orgs' && (
                  <div className={`border rounded-2xl p-6 space-y-4 ${isDarkMode ? 'bg-[#111726] border-gray-800' : 'bg-white border-gray-200'}`}>
                    <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-3 py-1 rounded-full border border-emerald-500/20 font-bold">Student Organizations Hub</span>
                    <h3 className="text-xl font-black">{selectedUni.name} Recognized Student Bodies</h3>
                    <div className="space-y-3 pt-2">
                      {selectedUni.organizations?.map((org, idx) => (
                        <div key={idx} className={`border p-4 rounded-xl flex justify-between items-center ${isDarkMode ? 'bg-gray-900 border-gray-800' : 'bg-gray-50 border-gray-200'}`}>
                          <div>
                            <p className="text-sm font-bold">{org.name}</p>
                            <p className="text-xs text-gray-500">{org.type}</p>
                          </div>
                          <span className="text-xs text-emerald-400 font-bold bg-emerald-950/60 border border-emerald-800 px-3 py-1 rounded-lg">Verified Body</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              </div>

            </div>

          </div>
        )}

      </main>

      {/* University Registration Modal */}
      {showRegModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className={`border rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl ${isDarkMode ? 'bg-[#111726] border-gray-800' : 'bg-white border-gray-200'}`}>
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-black">Register University Portal</h3>
              <button onClick={() => setShowRegModal(false)} className="text-gray-400 text-lg font-bold">✕</button>
            </div>
            <form onSubmit={handleUniversityRegistration} className="space-y-3">
              <input type="text" value={regUniName} onChange={e => setRegUniName(e.target.value)} placeholder="University Name" className={`w-full border rounded-xl p-3 text-xs ${isDarkMode ? 'bg-gray-900 border-gray-800 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'}`} required />
              <input type="text" value={regLocation} onChange={e => setRegLocation(e.target.value)} placeholder="Location" className={`w-full border rounded-xl p-3 text-xs ${isDarkMode ? 'bg-gray-900 border-gray-800 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'}`} required />
              <textarea value={regDesc} onChange={e => setRegDesc(e.target.value)} placeholder="Description" className={`w-full border rounded-xl p-3 text-xs ${isDarkMode ? 'bg-gray-900 border-gray-800 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'}`} rows="2" required />
              <input type="text" value={regEligible} onChange={e => setRegEligible(e.target.value)} placeholder="Eligible Voters (e.g. 20,000+)" className={`w-full border rounded-xl p-3 text-xs ${isDarkMode ? 'bg-gray-900 border-gray-800 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'}`} required />
              <input type="file" accept=".pdf" onChange={e => setRegDoc(e.target.files[0])} className={`w-full border rounded-xl p-2.5 text-xs ${isDarkMode ? 'bg-gray-900 border-gray-800 text-gray-300' : 'bg-gray-50 border-gray-200 text-gray-700'}`} required />
              <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-xl text-xs font-bold">Submit University</button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}