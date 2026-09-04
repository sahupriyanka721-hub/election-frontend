import React, { useState, useEffect } from 'react';
import { auth, googleProvider } from './firebase';
import { signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';

export default function App() {
  const [user, setUser] = useState(null);
  const [currentView, setCurrentView] = useState('home'); // 'home', 'universities', 'admin'
  const [selectedUni, setSelectedUni] = useState(null);
  const [activeTab, setActiveTab] = useState('info'); // 'info', 'voting', 'student-portal', 'manager', 'uni-admin', 'orgs'

  // Dark / Light Mode State
  const [isDarkMode, setIsDarkMode] = useState(true);

  // University Internal Admin & Organization States
  const [uniSubView, setUniSubView] = useState('portal'); 
  const [uniAdminEmail, setUniAdminEmail] = useState('');
  const [uniAdminPassword, setUniAdminPassword] = useState('');
  const [isUniAdminLoggedIn, setIsUniAdminLoggedIn] = useState(false);

  const [orgEmail, setOrgEmail] = useState('');
  const [orgPassword, setOrgPassword] = useState('');
  const [isOrgLoggedIn, setIsOrgLoggedIn] = useState(false);
  const [orgName, setOrgName] = useState('');

  // Global Admin Credentials States
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [adminTab, setAdminTab] = useState('overview');

  const [candidateName, setCandidateName] = useState('');
  const [candidateParty, setCandidateParty] = useState('');

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
  
  // Universities List
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

  const handleAdminLogin = (e) => {
    e.preventDefault();
    if (adminEmail === 'admin@univote.com' && adminPassword === 'admin123') {
      setIsAdminLoggedIn(true);
      alert("Admin Logged In Successfully!");
    } else {
      alert("Invalid Admin Email or Password! (Hint: admin@univote.com / admin123)");
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
      status: 'Pending',
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
    alert("University application submitted for review!");
  };

  const getTotalVotes = (candidates) => {
    const total = candidates.reduce((acc, curr) => acc + curr.votes, 0);
    return total === 0 ? 1 : total;
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-[#0b0f17] text-gray-100' : 'bg-gray-50 text-gray-900'} font-sans relative`}>
      
      {/* Navbar */}
      <nav className={`p-4 border-b ${isDarkMode ? 'border-gray-800 bg-[#0b0f17]/90' : 'border-gray-200 bg-white/90'} backdrop-blur-md sticky top-0 z-50`}>
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="cursor-pointer flex items-center gap-2" onClick={() => { setCurrentView('home'); setSelectedUni(null); }}>
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-white">V</div>
            <h1 className="text-base font-black tracking-wider text-white">UniVote Pro</h1>
          </div>

          <div className="flex items-center gap-4">
            <button onClick={() => { setCurrentView('home'); setSelectedUni(null); }} className="text-xs font-semibold px-3 py-1.5 rounded-lg text-gray-300 hover:text-white">Home</button>
            <button onClick={() => { setCurrentView('universities'); setSelectedUni(null); }} className="text-xs font-semibold px-3 py-1.5 rounded-lg text-gray-300 hover:text-white">Universities</button>
            <button onClick={() => { setCurrentView('admin'); setSelectedUni(null); }} className="text-xs font-semibold px-3 py-1.5 rounded-lg text-gray-300 hover:text-white">Admin Panel</button>
            
            <button onClick={() => setIsDarkMode(!isDarkMode)} className="px-2.5 py-1 rounded-lg text-xs border border-gray-700 text-yellow-400">
              {isDarkMode ? '☀️' : '🌙'}
            </button>

            {user ? (
              <div className="flex items-center gap-2 bg-gray-900 border border-gray-800 px-3 py-1 rounded-xl">
                <img src={user.photoURL} alt="User" className="w-6 h-6 rounded-full object-cover" />
                <span className="text-xs font-bold text-white">{user.displayName}</span>
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

        {/* VIEW 1: HOME */}
        {currentView === 'home' && !selectedUni && (
          <div className="py-20 text-center max-w-2xl mx-auto space-y-6">
            <h1 className="text-4xl md:text-5xl font-black text-white">Student Union Elections & Organization Hub</h1>
            <p className="text-gray-400 text-sm">Secure digital voting and comprehensive university governance platform.</p>
            <div className="flex justify-center gap-4">
              <button onClick={() => setCurrentView('universities')} className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-xl font-bold text-xs shadow-lg">Explore Universities →</button>
              <button onClick={() => setShowRegModal(true)} className="bg-gray-800 hover:bg-gray-700 text-white px-6 py-3 rounded-xl font-bold text-xs border border-gray-700">Register University 🏛️</button>
            </div>
          </div>
        )}

        {/* VIEW 2: UNIVERSITIES LIST */}
        {currentView === 'universities' && !selectedUni && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-black text-white">Approved Universities</h2>
              <button onClick={() => setShowRegModal(true)} className="bg-blue-600 text-white px-4 py-2 rounded-xl text-xs font-bold">+ Register New University</button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {universities.filter(u => u.status === 'Approved').map(uni => (
                <div key={uni.id} className="bg-[#111726] border border-gray-800 rounded-2xl overflow-hidden shadow-xl flex flex-col justify-between">
                  <div className="h-40 w-full relative">
                    <img src={uni.image} alt={uni.name} className="w-full h-full object-cover" />
                    <span className="absolute top-3 right-3 text-[10px] bg-emerald-950 text-emerald-400 px-2.5 py-0.5 rounded-full border border-emerald-800 font-semibold">Active</span>
                  </div>
                  <div className="p-5 space-y-3">
                    <h3 className="font-bold text-base text-white">{uni.name}</h3>
                    <p className="text-xs text-blue-400">📍 {uni.location}</p>
                    <p className="text-xs text-gray-400 line-clamp-2">{uni.desc}</p>
                    <button onClick={() => { setSelectedUni(uni); setActiveTab('info'); }} className="w-full bg-gray-800 hover:bg-blue-600 text-white text-xs py-2.5 rounded-xl transition font-semibold border border-gray-700">
                      Open Dashboard →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* VIEW 3: EXACT PREVIOUS LAYOUT WITH SIDEBAR & MAIN CONTENT */}
        {selectedUni && (
          <div className="space-y-6">
            
            {/* Top University Header Banner */}
            <div className="flex justify-between items-center bg-[#111726] border border-gray-800 p-6 rounded-2xl shadow-xl">
              <div>
                <h2 className="text-2xl md:text-3xl font-black text-white">{selectedUni.name}</h2>
                <p className="text-xs text-gray-400 mt-1">📍 {selectedUni.location} • Comprehensive Info Hub</p>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-gray-400 block">Total Eligible Voters:</span>
                <strong className="text-sm text-white bg-gray-900 border border-gray-800 px-3 py-1 rounded-lg inline-block mt-0.5">{selectedUni.eligible}</strong>
              </div>
            </div>

            {/* Dashboard Layout with Sidebar */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              
              {/* SIDEBAR NAVIGATION (As seen in your image) */}
              <div className="bg-[#111726] border border-gray-800 rounded-2xl p-4 space-y-2 h-fit">
                <p className="text-[10px] uppercase font-bold text-gray-500 tracking-wider px-3 mb-2">Dashboard Navigation</p>
                
                <button 
                  onClick={() => setActiveTab('info')}
                  className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2.5 ${activeTab === 'info' ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-300 hover:bg-gray-900'}`}
                >
                  🏛️ University Info Hub
                </button>
                <button 
                  onClick={() => setActiveTab('voting')}
                  className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2.5 ${activeTab === 'voting' ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-300 hover:bg-gray-900'}`}
                >
                  🗳️ Voting & Standings
                </button>
                <button 
                  onClick={() => setActiveTab('student-portal')}
                  className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2.5 ${activeTab === 'student-portal' ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-300 hover:bg-gray-900'}`}
                >
                  🎓 Student Portal & Marks
                </button>
                <button 
                  onClick={() => setActiveTab('manager')}
                  className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2.5 ${activeTab === 'manager' ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-300 hover:bg-gray-900'}`}
                >
                  👥 Candidate Manager
                </button>
                <button 
                  onClick={() => setActiveTab('uni-admin')}
                  className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2.5 ${activeTab === 'uni-admin' ? 'bg-purple-600 text-white shadow-lg' : 'text-gray-300 hover:bg-gray-900'}`}
                >
                  🛡️ Uni Admin Panel
                </button>
                <button 
                  onClick={() => setActiveTab('orgs')}
                  className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2.5 ${activeTab === 'orgs' ? 'bg-emerald-600 text-white shadow-lg' : 'text-gray-300 hover:bg-gray-900'}`}
                >
                  🏢 Organizations Hub
                </button>

                <div className="pt-4 border-t border-gray-800 mt-4">
                  <button onClick={() => setSelectedUni(null)} className="w-full text-center text-xs text-gray-400 hover:text-white py-2">
                    ← Back to Universities List
                  </button>
                </div>
              </div>

              {/* MAIN CONTENT AREA DEPENDING ON TAB */}
              <div className="lg:col-span-3 space-y-6">
                
                {/* TAB 1: UNIVERSITY INFO HUB (Overview + Associated Orgs + Document Bundle) */}
                {activeTab === 'info' && (
                  <div className="space-y-6">
                    <div className="bg-[#111726] border border-gray-800 rounded-2xl p-6 space-y-4">
                      <span className="text-[10px] bg-blue-500/10 text-blue-400 px-3 py-1 rounded-full border border-blue-500/20 font-semibold uppercase tracking-wider">Master Information Record</span>
                      <h3 className="text-xl font-black text-white">{selectedUni.name} Overview</h3>
                      <p className="text-xs text-gray-400">{selectedUni.desc}</p>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                        <div className="bg-gray-900 border border-gray-800 p-4 rounded-xl">
                          <p className="text-[10px] text-gray-400">Total Registered Voters</p>
                          <p className="text-xl font-black text-white mt-1">{selectedUni.eligible}</p>
                        </div>
                        <div className="bg-gray-900 border border-gray-800 p-4 rounded-xl">
                          <p className="text-[10px] text-gray-400">Active Student Organizations</p>
                          <p className="text-xl font-black text-white mt-1">{selectedUni.organizations?.length || 2} Bodies</p>
                        </div>
                        <div className="bg-gray-900 border border-gray-800 p-4 rounded-xl">
                          <p className="text-[10px] text-gray-400">Registered Candidates</p>
                          <p className="text-xl font-black text-white mt-1">{selectedUni.candidates.length}</p>
                        </div>
                      </div>
                    </div>

                    {/* Associated Student Organizations */}
                    <div className="bg-[#111726] border border-gray-800 rounded-2xl p-6 space-y-4">
                      <h3 className="text-sm font-bold text-white">Associated Student Organizations</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {selectedUni.organizations?.map((org, idx) => (
                          <div key={idx} className="flex justify-between items-center p-4 rounded-xl bg-gray-900 border border-gray-800">
                            <div>
                              <p className="text-xs font-bold text-white">{org.name}</p>
                              <p className="text-[10px] text-gray-400">{org.type}</p>
                            </div>
                            <span className="text-[10px] bg-emerald-950 text-emerald-400 px-2.5 py-1 rounded-full border border-emerald-800 font-bold">Verified</span>
                          </div>
                        ))}
                      </div>

                      {/* Institutional Verification Bundle */}
                      <div className="pt-4 border-t border-gray-800 flex justify-between items-center">
                        <div>
                          <p className="text-[10px] uppercase font-bold text-gray-500">Institutional Verification Bundle</p>
                          <p className="text-xs font-semibold text-white mt-0.5">📄 {selectedUni.docName}</p>
                        </div>
                        <button onClick={() => alert("Downloading document verification bundle...")} className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-xl text-xs font-bold border border-gray-700">
                          View Document Details
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 2: VOTING & STANDINGS */}
                {activeTab === 'voting' && (
                  <div className="bg-[#111726] border border-gray-800 rounded-2xl p-6 space-y-6">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="text-lg font-black text-white">Active Ballot Box & Standings</h3>
                        <p className="text-xs text-gray-400">Cast your secure vote for registered candidates.</p>
                      </div>
                      <span className="text-xs bg-emerald-500/10 text-emerald-400 px-3 py-1 rounded-full border border-emerald-500/20 font-bold">Live</span>
                    </div>

                    {selectedUni.candidates.length === 0 ? (
                      <p className="text-xs text-gray-400 py-6 text-center">No candidates available.</p>
                    ) : (
                      <div className="space-y-4">
                        {selectedUni.candidates.map(cand => {
                          const total = getTotalVotes(selectedUni.candidates);
                          const percentage = Math.round((cand.votes / total) * 100);
                          return (
                            <div key={cand.id} className="bg-gray-900 border border-gray-800 p-4 rounded-xl space-y-2">
                              <div className="flex justify-between items-center">
                                <div>
                                  <p className="text-xs font-bold text-white">{cand.name} <span className="text-blue-400 font-normal">({cand.party})</span></p>
                                  <p className="text-[10px] text-gray-400">{cand.votes} Votes ({percentage}%)</p>
                                </div>
                                <button onClick={() => handleVote(selectedUni.id, cand.id)} className="bg-blue-600 hover:bg-blue-500 text-white px-3.5 py-1.5 rounded-xl text-xs font-bold">
                                  Vote 🗳️
                                </button>
                              </div>
                              <div className="w-full bg-gray-950 h-2 rounded-full overflow-hidden">
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
                  <div className="bg-[#111726] border border-gray-800 rounded-2xl p-6 space-y-6">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="text-lg font-black text-white">Student Portal & Academic Marks</h3>
                        <p className="text-xs text-gray-400">Semester performance records.</p>
                      </div>
                      {user && (
                        <div className="flex items-center gap-2 bg-gray-900 border border-gray-800 px-3 py-1.5 rounded-xl">
                          <img src={user.photoURL} alt="User" className="w-6 h-6 rounded-full object-cover" />
                          <span className="text-xs font-bold text-white">{user.displayName}</span>
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="md:col-span-2 space-y-3">
                        <h4 className="text-xs font-bold text-gray-300 uppercase">Grade Report</h4>
                        {studentMarks.map(m => (
                          <div key={m.id} className="flex justify-between items-center bg-gray-900 border border-gray-800 p-3.5 rounded-xl">
                            <div>
                              <p className="text-xs font-bold text-white">{m.subject}</p>
                              <p className="text-[10px] text-gray-400">Score: {m.marks}</p>
                            </div>
                            <span className="text-xs font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-800 px-2.5 py-1 rounded-lg">Grade: {m.grade}</span>
                          </div>
                        ))}
                      </div>

                      {/* Add Marks Form */}
                      <div className="bg-gray-900 border border-gray-800 p-4 rounded-xl space-y-3 h-fit">
                        <h4 className="text-xs font-bold text-white">Add Subject Record</h4>
                        <form onSubmit={handleUpdateMarks} className="space-y-2.5">
                          <input type="text" value={newSubject} onChange={e => setNewSubject(e.target.value)} placeholder="Subject Name" className="w-full bg-gray-950 border border-gray-800 rounded-xl p-2.5 text-xs text-white" required />
                          <input type="text" value={newMarks} onChange={e => setNewMarks(e.target.value)} placeholder="Marks (e.g. 85/100)" className="w-full bg-gray-950 border border-gray-800 rounded-xl p-2.5 text-xs text-white" required />
                          <input type="text" value={newGrade} onChange={e => setNewGrade(e.target.value)} placeholder="Grade (e.g. A)" className="w-full bg-gray-950 border border-gray-800 rounded-xl p-2.5 text-xs text-white" required />
                          <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-xl text-xs font-bold">Add Record</button>
                        </form>
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 4: CANDIDATE MANAGER */}
                {activeTab === 'manager' && (
                  <div className="bg-[#111726] border border-gray-800 rounded-2xl p-6 space-y-6">
                    <div>
                      <h3 className="text-lg font-black text-white">Candidate Manager</h3>
                      <p className="text-xs text-gray-400">Register new candidates for election ballots.</p>
                    </div>

                    <form onSubmit={handleAddCandidate} className="space-y-4 max-w-md">
                      <div>
                        <label className="block text-xs font-semibold text-gray-300 mb-1">Candidate Name</label>
                        <input type="text" value={candidateName} onChange={e => setCandidateName(e.target.value)} placeholder="e.g. Priya Sharma" className="w-full bg-gray-900 border border-gray-800 rounded-xl p-3 text-xs text-white" required />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-300 mb-1">Party Name</label>
                        <input type="text" value={candidateParty} onChange={e => setCandidateParty(e.target.value)} placeholder="e.g. Student Alliance" className="w-full bg-gray-900 border border-gray-800 rounded-xl p-3 text-xs text-white" required />
                      </div>
                      <button type="submit" className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-xl text-xs font-bold">Submit Candidate</button>
                    </form>
                  </div>
                )}

                {/* TAB 5: UNI ADMIN PANEL */}
                {activeTab === 'uni-admin' && (
                  <div className="bg-[#111726] border border-gray-800 rounded-2xl p-6 space-y-4">
                    <span className="text-[10px] bg-purple-500/10 text-purple-400 px-3 py-1 rounded-full border border-purple-500/20 font-bold">Uni Admin Access</span>
                    <h3 className="text-xl font-black text-white">{selectedUni.name} Administration Control</h3>
                    <p className="text-xs text-gray-400">Manage institution voting rolls and review compliance documentation.</p>
                    <div className="grid grid-cols-2 gap-4 pt-2">
                      <div className="bg-gray-900 border border-gray-800 p-4 rounded-xl">
                        <p className="text-xs text-gray-400">Total Registered Candidates</p>
                        <p className="text-2xl font-black text-white mt-1">{selectedUni.candidates.length}</p>
                      </div>
                      <div className="bg-gray-900 border border-gray-800 p-4 rounded-xl">
                        <p className="text-xs text-gray-400">Status</p>
                        <p className="text-2xl font-black text-emerald-400 mt-1">Active</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 6: ORGANIZATIONS HUB */}
                {activeTab === 'orgs' && (
                  <div className="bg-[#111726] border border-gray-800 rounded-2xl p-6 space-y-4">
                    <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-3 py-1 rounded-full border border-emerald-500/20 font-bold">Student Organizations Hub</span>
                    <h3 className="text-xl font-black text-white">{selectedUni.name} Recognized Student Bodies</h3>
                    <div className="space-y-3 pt-2">
                      {selectedUni.organizations?.map((org, idx) => (
                        <div key={idx} className="bg-gray-900 border border-gray-800 p-4 rounded-xl flex justify-between items-center">
                          <div>
                            <p className="text-sm font-bold text-white">{org.name}</p>
                            <p className="text-xs text-gray-400">{org.type}</p>
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

        {/* GLOBAL ADMIN VIEW */}
        {currentView === 'admin' && (
          <div className="max-w-md mx-auto mt-10 bg-[#111726] border border-gray-800 p-8 rounded-3xl shadow-xl">
            {!isAdminLoggedIn ? (
              <form onSubmit={handleAdminLogin} className="space-y-4">
                <div className="text-center mb-4">
                  <h2 className="text-2xl font-black text-white">Admin Login</h2>
                  <p className="text-xs text-gray-400 mt-1">admin@univote.com / admin123</p>
                </div>
                <input type="email" value={adminEmail} onChange={e => setAdminEmail(e.target.value)} placeholder="Email" className="w-full bg-gray-900 border border-gray-800 rounded-xl p-3 text-xs text-white" required />
                <input type="password" value={adminPassword} onChange={e => setAdminPassword(e.target.value)} placeholder="Password" className="w-full bg-gray-900 border border-gray-800 rounded-xl p-3 text-xs text-white" required />
                <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-xl text-xs font-bold">Login</button>
              </form>
            ) : (
              <div className="space-y-4 text-center">
                <h2 className="text-xl font-black text-white">Super Admin Dashboard Active</h2>
                <p className="text-xs text-gray-400">Total Universities in System: {universities.length}</p>
                <button onClick={() => setIsAdminLoggedIn(false)} className="bg-red-600 text-white px-4 py-2 rounded-xl text-xs font-semibold">Logout Admin</button>
              </div>
            )}
          </div>
        )}

      </main>

      {/* University Registration Modal */}
      {showRegModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#111726] border border-gray-800 rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-black text-white">Register University Portal</h3>
              <button onClick={() => setShowRegModal(false)} className="text-gray-400 text-lg font-bold">✕</button>
            </div>
            <form onSubmit={handleUniversityRegistration} className="space-y-3">
              <input type="text" value={regUniName} onChange={e => setRegUniName(e.target.value)} placeholder="University Name" className="w-full bg-gray-900 border border-gray-800 rounded-xl p-3 text-xs text-white" required />
              <input type="text" value={regLocation} onChange={e => setRegLocation(e.target.value)} placeholder="Location" className="w-full bg-gray-900 border border-gray-800 rounded-xl p-3 text-xs text-white" required />
              <textarea value={regDesc} onChange={e => setRegDesc(e.target.value)} placeholder="Description" className="w-full bg-gray-900 border border-gray-800 rounded-xl p-3 text-xs text-white" rows="2" required />
              <input type="text" value={regEligible} onChange={e => setRegEligible(e.target.value)} placeholder="Eligible Voters (e.g. 20,000+)" className="w-full bg-gray-900 border border-gray-800 rounded-xl p-3 text-xs text-white" required />
              <input type="file" accept=".pdf" onChange={e => setRegDoc(e.target.files[0])} className="w-full bg-gray-900 border border-gray-800 rounded-xl p-2.5 text-xs text-gray-300" required />
              <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-xl text-xs font-bold">Submit for Verification</button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}