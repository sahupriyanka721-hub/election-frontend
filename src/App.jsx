import React, { useState, useEffect } from 'react';
import { auth, googleProvider } from './firebase';
import { signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';

export default function App() {
  const [user, setUser] = useState(null);
  const [currentView, setCurrentView] = useState('home'); // 'home', 'universities', 'admin'
  const [selectedUni, setSelectedUni] = useState(null);
  const [activeTab, setActiveTab] = useState('portal'); // 'portal', 'voting', 'student-portal', 'manager', 'uni-admin', 'orgs-hub'

  // Theme State ('dark' or 'light')
  const [theme, setTheme] = useState('dark');

  // Mobile Menu State
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // University Internal Admin & Organization States
  const [isUniAdminLoggedIn, setIsUniAdminLoggedIn] = useState(false);
  const [uniAdminEmail, setUniAdminEmail] = useState('');
  const [uniAdminPassword, setUniAdminPassword] = useState('');

  // Organization Auth
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
    { id: 3, subject: 'Software Engineering', marks: '90/100', grade: 'O' },
    { id: 4, subject: 'Computer Networks', marks: '75/100', grade: 'B+' }
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
  
  // Universities List with Working Images & Details
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
      organizations: [
        { name: 'Vivant Governing Council', role: 'Primary Student Body' },
        { name: 'Ojashvi Welfare Society', role: 'Campus Activities' }
      ],
      candidates: [
        { id: 1, name: 'Aarav Sharma', party: 'Vivant', votes: 120 },
        { id: 2, name: 'Rahul Verma', party: 'Ojashvi', votes: 95 }
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
      organizations: [
        { name: 'Youth Front Council', role: 'Primary Student Governing Body' },
        { name: 'Panther Student Union', role: 'Campus Welfare & Activities' }
      ],
      candidates: [
        { id: 1, name: 'Aditya Roy', party: 'Youth Front', votes: 150 }
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
      organizations: [
        { name: 'Panther Group Senate', role: 'Main Senate Body' },
        { name: 'Students Voice Alliance', role: 'Student Advocacy' }
      ],
      candidates: [
        { id: 1, name: 'Simran Kaur', party: 'Panther Group', votes: 210 },
        { id: 2, name: 'Rohit Gupta', party: 'Students Voice', votes: 180 }
      ]
    }
  ]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

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
      alert("Invalid Admin Credentials! (Hint: admin@univote.com / admin123)");
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
    if (!user && !isOrgLoggedIn) {
      alert("Please sign in or log in as an organization to register candidates!");
      return;
    }
    if (!candidateName.trim() || !candidateParty.trim()) {
      alert("Please fill in all candidate fields.");
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
    alert("Candidate registered successfully!");
  };

  const handleUpdateMarks = (e) => {
    e.preventDefault();
    if (!newSubject.trim() || !newMarks.trim() || !newGrade.trim()) {
      alert("Please fill all academic fields!");
      return;
    }

    const updatedMarkItem = {
      id: Date.now(),
      subject: newSubject,
      marks: newMarks,
      grade: newGrade
    };

    setStudentMarks([...studentMarks, updatedMarkItem]);
    setNewSubject('');
    setNewMarks('');
    setNewGrade('');
    alert("Academic record updated successfully!");
  };

  const handleUniversityRegistration = (e) => {
    e.preventDefault();
    if (!regUniName || !regLocation || !regDesc || !regEligible || !regDoc) {
      alert("Please fill all fields and upload documents.");
      return;
    }

    const newUni = {
      id: regUniName.toLowerCase().replace(/\s+/g, '-'),
      name: regUniName,
      location: regLocation,
      desc: regDesc,
      eligible: regEligible,
      status: 'Pending',
      docName: regDoc.name,
      image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1200&q=80',
      organizations: [{ name: 'Campus Governing Council', role: 'Primary Student Body' }],
      candidates: []
    };

    setUniversities([...universities, newUni]);
    setShowRegModal(false);
    setRegUniName('');
    setRegLocation('');
    setRegDesc('');
    setRegEligible('');
    setRegDoc(null);
    alert("University application submitted for admin verification!");
  };

  const handleAdminAction = (uniId, action) => {
    setUniversities(universities.map(uni => uni.id === uniId ? { ...uni, status: action } : uni));
    alert(`University status updated to: ${action}`);
  };

  const handleDeleteUniversity = (uniId) => {
    if (window.confirm("Are you sure you want to delete this university?")) {
      setUniversities(universities.filter(uni => uni.id !== uniId));
    }
  };

  const getTotalVotes = (candidates) => {
    const total = candidates.reduce((acc, curr) => acc + curr.votes, 0);
    return total === 0 ? 1 : total;
  };

  const isDark = theme === 'dark';

  return (
    <div className={`min-h-screen font-sans relative overflow-hidden transition-colors duration-300 ${isDark ? 'bg-[#030508] text-gray-100' : 'bg-gray-50 text-gray-900'}`}>
      <div className="absolute top-0 left-1/3 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute top-1/4 right-1/4 w-[400px] h-[400px] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none"></div>

      {/* Navbar */}
      <nav className={`p-4 border-b backdrop-blur-xl sticky top-0 z-50 shadow-2xl transition-colors duration-300 ${isDark ? 'border-gray-800/60 bg-[#030508]/90' : 'border-gray-200 bg-white/90'}`}>
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="cursor-pointer flex items-center gap-2.5" onClick={() => { setCurrentView('home'); setSelectedUni(null); setMobileMenuOpen(false); }}>
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center font-black text-white shadow-lg shadow-blue-600/30">V</div>
            <div>
              <h1 className="text-sm md:text-lg font-black tracking-wider bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">UniVote Pro</h1>
              <p className={`text-[8px] md:text-[9px] tracking-wide font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>National Campus Election Portal</p>
            </div>
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-3">
            <button 
              onClick={() => { setCurrentView('home'); setSelectedUni(null); }}
              className={`text-sm font-semibold px-3.5 py-1.5 rounded-xl transition ${currentView === 'home' ? 'text-blue-400 bg-blue-950/40 border border-blue-800/40' : isDark ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}
            >
              Home
            </button>
            <button 
              onClick={() => { setCurrentView('universities'); setSelectedUni(null); }}
              className={`text-sm font-semibold px-3.5 py-1.5 rounded-xl transition ${currentView === 'universities' && !selectedUni ? 'text-blue-400 bg-blue-950/40 border border-blue-800/40' : isDark ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}
            >
              Universities
            </button>
            <button 
              onClick={() => { setCurrentView('admin'); setSelectedUni(null); }}
              className={`text-sm font-semibold px-3.5 py-1.5 rounded-xl transition ${currentView === 'admin' ? 'text-blue-400 bg-blue-950/40 border border-blue-800/40' : isDark ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}
            >
              Admin Panel 🛡️
            </button>

            {/* Theme Toggle Button */}
            <button 
              onClick={toggleTheme}
              className={`p-2 rounded-xl text-sm font-bold border transition shadow-md flex items-center justify-center ${isDark ? 'bg-gray-900 border-gray-700 text-yellow-400 hover:bg-gray-800' : 'bg-gray-100 border-gray-300 text-slate-700 hover:bg-gray-200'}`}
              title="Toggle Light/Dark Mode"
            >
              {isDark ? '☀️ Light' : '🌙 Dark'}
            </button>

            {user ? (
              <div className={`flex items-center gap-2.5 border px-3 py-1.5 rounded-2xl shadow-xl backdrop-blur-md ml-2 ${isDark ? 'bg-gray-900/90 border-gray-700/60' : 'bg-gray-100 border-gray-200'}`}>
                <img src={user.photoURL} alt="Profile" className="w-7 h-7 rounded-full border-2 border-blue-500 shadow-md object-cover" />
                <div className="text-left">
                  <p className={`text-[11px] font-bold leading-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>{user.displayName || 'User'}</p>
                  <p className="text-[9px] text-blue-400 font-medium truncate max-w-[100px]">{user.email}</p>
                </div>
                <button onClick={handleLogout} className="bg-red-600 hover:bg-red-500 text-white px-2.5 py-1 rounded-lg text-xs font-semibold transition ml-1">
                  Logout
                </button>
              </div>
            ) : (
              <button onClick={handleGoogleLogin} className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 text-white px-4 py-2 rounded-xl text-sm font-bold transition-all shadow-lg shadow-blue-600/20 active:scale-95 ml-2">
                Sign in with Google
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <button onClick={toggleTheme} className={`p-2 rounded-xl text-xs font-bold border ${isDark ? 'bg-gray-900 border-gray-700 text-yellow-400' : 'bg-gray-100 border-gray-300 text-slate-700'}`}>
              {isDark ? '☀️' : '🌙'}
            </button>
            {user && <img src={user.photoURL} alt="Profile" className="w-8 h-8 rounded-full border-2 border-blue-500 object-cover" />}
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className={`border p-2 rounded-xl ${isDark ? 'bg-gray-900 border-gray-800 text-gray-200' : 'bg-gray-100 border-gray-200 text-gray-800'}`}>
              {mobileMenuOpen ? '✕' : '☰'}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown */}
        {mobileMenuOpen && (
          <div className={`md:hidden mt-4 pt-4 border-t flex flex-col gap-2.5 ${isDark ? 'border-gray-800/80' : 'border-gray-200'}`}>
            <button onClick={() => { setCurrentView('home'); setSelectedUni(null); setMobileMenuOpen(false); }} className={`text-left text-sm font-semibold px-4 py-2.5 rounded-xl ${currentView === 'home' ? 'text-blue-400 bg-blue-950/40' : 'text-gray-300'}`}>🏠 Home</button>
            <button onClick={() => { setCurrentView('universities'); setSelectedUni(null); setMobileMenuOpen(false); }} className={`text-left text-sm font-semibold px-4 py-2.5 rounded-xl ${currentView === 'universities' && !selectedUni ? 'text-blue-400 bg-blue-950/40' : 'text-gray-300'}`}>🏛️ Universities</button>
            <button onClick={() => { setCurrentView('admin'); setSelectedUni(null); setMobileMenuOpen(false); }} className={`text-left text-sm font-semibold px-4 py-2.5 rounded-xl ${currentView === 'admin' ? 'text-blue-400 bg-blue-950/40' : 'text-gray-300'}`}>🛡️ Admin Panel</button>
            <div className="pt-2 border-t">
              {user ? (
                <button onClick={() => { handleLogout(); setMobileMenuOpen(false); }} className="w-full bg-red-600 text-white py-2 rounded-xl text-xs font-semibold">Logout</button>
              ) : (
                <button onClick={() => { handleGoogleLogin(); setMobileMenuOpen(false); }} className="w-full bg-blue-600 text-white py-3 rounded-xl text-sm font-bold">Sign in with Google</button>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Main Container */}
      <main className="p-4 md:p-8 max-w-7xl mx-auto relative z-10">
        
        {/* VIEW 1: HOME */}
        {currentView === 'home' && !selectedUni && (
          <div className="py-12 md:py-20 text-center max-w-4xl mx-auto space-y-8">
            <div className="inline-flex items-center gap-2 bg-blue-500/10 text-blue-400 px-4 py-1.5 rounded-full border border-blue-500/20 text-xs font-semibold uppercase tracking-widest shadow-inner">
              <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></span>
              Secure Digital Ballot System 2026
            </div>
            <h1 className={`text-4xl md:text-7xl font-black tracking-tight leading-[1.1] bg-gradient-to-r bg-clip-text text-transparent ${isDark ? 'from-white via-gray-200 to-gray-400' : 'from-gray-900 via-gray-700 to-gray-500'}`}>
              Next-Gen Student Union Elections & Organization Hub
            </h1>
            <p className={`text-sm md:text-base leading-relaxed max-w-2xl mx-auto font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Comprehensive university and organization information dashboards with transparent verification routing and secure Google-authenticated balloting.
            </p>
            <div className="flex flex-wrap justify-center gap-4 pt-2">
              <button onClick={() => setCurrentView('universities')} className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 text-white px-8 py-4 rounded-2xl font-bold text-sm shadow-xl shadow-blue-600/30 transition-all hover:scale-105">
                Explore Universities →
              </button>
              <button onClick={() => setShowRegModal(true)} className={`border px-8 py-4 rounded-2xl font-bold text-sm shadow-xl transition-all hover:scale-105 ${isDark ? 'bg-gray-900/90 hover:bg-gray-800 text-white border-gray-700/80' : 'bg-white hover:bg-gray-50 text-gray-800 border-gray-300'}`}>
                Register University 🏛️
              </button>
            </div>
          </div>
        )}

        {/* VIEW 2: UNIVERSITIES LIST */}
        {currentView === 'universities' && !selectedUni && (
          <div>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
              <div>
                <span className="text-xs bg-blue-500/10 text-blue-400 px-3 py-1 rounded-full border border-blue-500/20 font-semibold uppercase tracking-widest inline-block mb-2">Verified Portal</span>
                <h2 className={`text-3xl font-black ${isDark ? 'text-white' : 'text-gray-900'}`}>Approved Universities</h2>
                <p className={`text-xs md:text-sm mt-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Select your approved institution to open the complete dashboard.</p>
              </div>
              <button onClick={() => setShowRegModal(true)} className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-xl font-bold text-xs shadow-lg transition">
                + Register New University
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {universities.filter(uni => uni.status === 'Approved').map((uni) => (
                <div key={uni.id} className={`group relative border rounded-3xl overflow-hidden flex flex-col justify-between transition-all duration-500 hover:-translate-y-2 hover:border-blue-500/60 hover:shadow-xl ${isDark ? 'bg-gradient-to-b from-gray-900/90 to-gray-950/90 border-gray-800/80' : 'bg-white border-gray-200 shadow-md'}`}>
                  <div className={`relative h-48 w-full overflow-hidden ${isDark ? 'bg-gray-950' : 'bg-gray-100'}`}>
                    <img src={uni.image} alt={uni.name} className="w-full h-full object-cover group-hover:scale-110 transition duration-700" />
                    <span className="absolute top-4 right-4 text-[10px] bg-emerald-950/90 text-emerald-400 px-3 py-1 rounded-full border border-emerald-800/60 font-semibold backdrop-blur-md">Active</span>
                  </div>
                  <div className="p-6 pt-2">
                    <h3 className={`font-bold text-lg mb-1 group-hover:text-blue-400 transition-colors ${isDark ? 'text-white' : 'text-gray-900'}`}>{uni.name}</h3>
                    <p className="text-xs text-blue-400/90 mb-3 font-medium">📍 {uni.location}</p>
                    <p className={`text-xs mb-6 leading-relaxed line-clamp-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{uni.desc}</p>
                    <button onClick={() => { setSelectedUni(uni); setActiveTab('portal'); }} className={`w-full text-sm py-3 rounded-xl transition-all font-semibold text-center shadow-lg border ${isDark ? 'bg-gray-800/80 hover:bg-blue-600 text-white border-gray-700/50' : 'bg-gray-100 hover:bg-blue-600 hover:text-white text-gray-800 border-gray-200'}`}>
                      Open Dashboard →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* VIEW 3: ADMIN PANEL */}
        {currentView === 'admin' && (
          <div>
            {!isAdminLoggedIn ? (
              <div className={`max-w-md mx-auto mt-12 border p-8 rounded-3xl shadow-2xl ${isDark ? 'bg-gradient-to-b from-gray-900 to-gray-950 border-gray-800' : 'bg-white border-gray-200'}`}>
                <div className="text-center mb-6">
                  <span className="text-xs bg-purple-500/15 text-purple-400 px-3 py-1 rounded-full border border-purple-500/30 font-semibold uppercase tracking-widest inline-block mb-2">Restricted Access</span>
                  <h2 className={`text-2xl font-black ${isDark ? 'text-white' : 'text-gray-900'}`}>Admin Panel Login</h2>
                  <p className={`text-xs mt-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Use admin@univote.com / admin123</p>
                </div>
                <form onSubmit={handleAdminLogin} className="space-y-4">
                  <div>
                    <label className={`block text-xs font-semibold mb-1.5 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Admin Email</label>
                    <input type="email" value={adminEmail} onChange={(e) => setAdminEmail(e.target.value)} placeholder="admin@univote.com" className={`w-full border rounded-xl p-3 text-sm focus:outline-none ${isDark ? 'bg-gray-950 border-gray-800 text-white' : 'bg-gray-50 border-gray-300'}`} required />
                  </div>
                  <div>
                    <label className={`block text-xs font-semibold mb-1.5 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Password</label>
                    <input type="password" value={adminPassword} onChange={(e) => setAdminPassword(e.target.value)} placeholder="••••••••" className={`w-full border rounded-xl p-3 text-sm focus:outline-none ${isDark ? 'bg-gray-950 border-gray-800 text-white' : 'bg-gray-50 border-gray-300'}`} required />
                  </div>
                  <button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3.5 rounded-xl text-sm font-bold shadow-lg mt-2">Login</button>
                </form>
              </div>
            ) : (
              <div className="space-y-6">
                <div className={`p-6 rounded-3xl border flex justify-between items-center shadow-xl ${isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'}`}>
                  <div>
                    <span className="text-xs bg-emerald-500/15 text-emerald-400 px-3 py-1 rounded-full border font-semibold">Super Admin Active</span>
                    <h2 className={`text-2xl font-black mt-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>National Control & Admin Panel</h2>
                  </div>
                  <button onClick={() => setIsAdminLoggedIn(false)} className="bg-red-600 text-white px-4 py-2 rounded-xl text-xs font-semibold shadow">Admin Logout</button>
                </div>
                <div className="space-y-4">
                  <h3 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>University Approvals Management</h3>
                  {universities.map(uni => (
                    <div key={uni.id} className={`p-5 rounded-2xl border flex justify-between items-center ${isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'}`}>
                      <div>
                        <h4 className="font-bold text-white">{uni.name} <span className="text-xs text-blue-400">({uni.status})</span></h4>
                        <p className="text-xs text-gray-400">Document: {uni.docName}</p>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => handleAdminAction(uni.id, 'Approved')} className="bg-emerald-600 text-white px-3 py-1.5 rounded-xl text-xs">Approve</button>
                        <button onClick={() => handleAdminAction(uni.id, 'Rejected')} className="bg-amber-600 text-white px-3 py-1.5 rounded-xl text-xs">Reject</button>
                        <button onClick={() => handleDeleteUniversity(uni.id)} className="bg-rose-600 text-white px-3 py-1.5 rounded-xl text-xs">Delete</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* EXACT AMITY / UNIVERSITY DASHBOARD MATCHING SECOND SCREENSHOT */}
        {selectedUni && (
          <div className="space-y-6">
            {/* University Header Banner */}
            <div className={`p-6 md:p-8 rounded-3xl border shadow-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 ${isDark ? 'bg-gradient-to-r from-gray-900 via-gray-950 to-gray-900 border-gray-800' : 'bg-white border-gray-200'}`}>
              <div>
                <h2 className={`text-3xl md:text-5xl font-black tracking-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>{selectedUni.name}</h2>
                <p className="text-xs md:text-sm text-blue-400 mt-1 font-medium">📍 {selectedUni.location} • Comprehensive Info Hub</p>
              </div>
              <div className="flex items-center gap-3">
                <div className={`px-4 py-2 rounded-2xl border text-right ${isDark ? 'bg-gray-950 border-gray-800' : 'bg-gray-100 border-gray-200'}`}>
                  <p className="text-[10px] text-gray-400 font-semibold uppercase">Total Eligible Voters</p>
                  <p className={`text-base font-black ${isDark ? 'text-white' : 'text-gray-900'}`}>{selectedUni.eligible}</p>
                </div>
                <button onClick={() => setSelectedUni(null)} className="bg-gray-800 hover:bg-gray-700 text-white border border-gray-700 px-4 py-3 rounded-2xl text-xs font-bold">
                  ← Back
                </button>
              </div>
            </div>

            {/* Dashboard Layout: Left Nav + Right Content (Matching Screenshot 2) */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              
              {/* Left Navigation Sidebar */}
              <div className={`lg:col-span-1 p-4 rounded-3xl border space-y-2 h-fit shadow-xl ${isDark ? 'bg-gray-900/80 border-gray-800' : 'bg-white border-gray-200'}`}>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-3 mb-2">Dashboard Navigation</p>
                
                <button onClick={() => setActiveTab('portal')} className={`w-full text-left text-xs font-bold px-4 py-3 rounded-2xl transition flex items-center gap-2.5 ${activeTab === 'portal' ? 'bg-blue-600 text-white shadow-lg' : isDark ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-700 hover:bg-gray-100'}`}>
                  🏛️ University Info Hub
                </button>
                <button onClick={() => setActiveTab('voting')} className={`w-full text-left text-xs font-bold px-4 py-3 rounded-2xl transition flex items-center gap-2.5 ${activeTab === 'voting' ? 'bg-blue-600 text-white shadow-lg' : isDark ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-700 hover:bg-gray-100'}`}>
                  🗳️ Voting & Standings
                </button>
                <button onClick={() => setActiveTab('student-portal')} className={`w-full text-left text-xs font-bold px-4 py-3 rounded-2xl transition flex items-center gap-2.5 ${activeTab === 'student-portal' ? 'bg-blue-600 text-white shadow-lg' : isDark ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-700 hover:bg-gray-100'}`}>
                  🎓 Student Portal & Marks
                </button>
                <button onClick={() => setActiveTab('manager')} className={`w-full text-left text-xs font-bold px-4 py-3 rounded-2xl transition flex items-center gap-2.5 ${activeTab === 'manager' ? 'bg-blue-600 text-white shadow-lg' : isDark ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-700 hover:bg-gray-100'}`}>
                  📋 Candidate Manager
                </button>
                <button onClick={() => setActiveTab('orgs-hub')} className={`w-full text-left text-xs font-bold px-4 py-3 rounded-2xl transition flex items-center gap-2.5 ${activeTab === 'orgs-hub' ? 'bg-blue-600 text-white shadow-lg' : isDark ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-700 hover:bg-gray-100'}`}>
                  🏢 Organizations Hub
                </button>
              </div>

              {/* Right Content Area */}
              <div className="lg:col-span-3 space-y-6">
                
                {activeTab === 'portal' && (
                  <div className="space-y-6">
                    {/* Master Information Record Box */}
                    <div className={`border p-6 rounded-3xl shadow-xl space-y-6 ${isDark ? 'bg-gradient-to-b from-gray-900 to-gray-950 border-gray-800' : 'bg-white border-gray-200'}`}>
                      <div>
                        <span className="text-[10px] bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full font-bold uppercase tracking-widest">Master Information Record</span>
                        <h3 className={`text-2xl font-black mt-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>{selectedUni.name} Overview</h3>
                        <p className={`text-xs mt-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{selectedUni.desc}</p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className={`p-4 rounded-2xl border ${isDark ? 'bg-gray-900 border-gray-800' : 'bg-gray-50 border-gray-200'}`}>
                          <p className="text-[10px] text-gray-400 font-bold uppercase">Total Registered Voters</p>
                          <p className={`text-2xl font-black mt-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>{selectedUni.eligible}</p>
                        </div>
                        <div className={`p-4 rounded-2xl border ${isDark ? 'bg-gray-900 border-gray-800' : 'bg-gray-50 border-gray-200'}`}>
                          <p className="text-[10px] text-gray-400 font-bold uppercase">Active Student Organizations</p>
                          <p className="text-2xl font-black text-blue-400 mt-1">{selectedUni.organizations.length} Bodies</p>
                        </div>
                        <div className={`p-4 rounded-2xl border ${isDark ? 'bg-gray-900 border-gray-800' : 'bg-gray-50 border-gray-200'}`}>
                          <p className="text-[10px] text-gray-400 font-bold uppercase">Registered Candidates</p>
                          <p className="text-2xl font-black text-emerald-400 mt-1">{selectedUni.candidates.length}</p>
                        </div>
                      </div>
                    </div>

                    {/* Associated Student Organizations */}
                    <div className={`border p-6 rounded-3xl shadow-xl space-y-4 ${isDark ? 'bg-gradient-to-b from-gray-900 to-gray-950 border-gray-800' : 'bg-white border-gray-200'}`}>
                      <h3 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Associated Student Organizations</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {selectedUni.organizations.map((org, idx) => (
                          <div key={idx} className={`p-4 rounded-2xl border flex justify-between items-center ${isDark ? 'bg-gray-900 border-gray-800' : 'bg-gray-50 border-gray-200'}`}>
                            <div>
                              <h4 className={`text-xs font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{org.name}</h4>
                              <p className="text-[10px] text-blue-400">{org.role}</p>
                            </div>
                            <span className="text-[10px] bg-emerald-950 text-emerald-400 px-2.5 py-1 rounded-full border border-emerald-800 font-bold">Verified</span>
                          </div>
                        ))}
                      </div>

                      {/* Institutional Verification Bundle */}
                      <div className={`mt-6 p-4 rounded-2xl border flex justify-between items-center ${isDark ? 'bg-gray-950 border-gray-800' : 'bg-gray-100 border-gray-200'}`}>
                        <div>
                          <p className="text-[10px] text-gray-400 font-bold uppercase">Institutional Verification Bundle</p>
                          <p className="text-xs text-blue-400 font-semibold mt-0.5">📄 {selectedUni.docName}</p>
                        </div>
                        <button onClick={() => alert("Downloading verification bundle...")} className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-xl text-xs font-bold shadow">
                          View Document Details
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'voting' && (
                  <div className={`border p-6 rounded-3xl shadow-xl space-y-6 ${isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'}`}>
                    <h3 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Student Union Ballot & Live Standings</h3>
                    <div className="space-y-4">
                      {selectedUni.candidates.map(cand => {
                        const totalVotes = getTotalVotes(selectedUni.candidates);
                        const pct = Math.round((cand.votes / totalVotes) * 100);
                        return (
                          <div key={cand.id} className={`p-4 rounded-2xl border space-y-2 ${isDark ? 'bg-gray-950 border-gray-800' : 'bg-gray-50 border-gray-200'}`}>
                            <div className="flex justify-between items-center">
                              <div>
                                <h4 className={`font-bold text-sm ${isDark ? 'text-white' : 'text-gray-900'}`}>{cand.name}</h4>
                                <p className="text-xs text-blue-400">Party: {cand.party}</p>
                              </div>
                              <button onClick={() => handleVote(selectedUni.id, cand.id)} className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-xl text-xs font-bold shadow">
                                Vote ✓ ({cand.votes})
                              </button>
                            </div>
                            <div className="w-full bg-gray-800 h-2 rounded-full overflow-hidden">
                              <div className="bg-blue-500 h-full transition-all duration-500" style={{ width: `${pct}%` }}></div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {activeTab === 'student-portal' && (
                  <div className={`border p-6 rounded-3xl shadow-xl space-y-6 ${isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'}`}>
                    <h3 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Student Academic & Marks Portal</h3>
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className={`border-b ${isDark ? 'border-gray-800 text-gray-400' : 'border-gray-200 text-gray-500'}`}>
                          <th className="pb-2">Subject</th>
                          <th className="pb-2">Marks</th>
                          <th className="pb-2">Grade</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-800/40">
                        {studentMarks.map(item => (
                          <tr key={item.id}>
                            <td className={`py-3 font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>{item.subject}</td>
                            <td className="py-3 text-blue-400">{item.marks}</td>
                            <td className="py-3 text-emerald-400 font-bold">{item.grade}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    <form onSubmit={handleUpdateMarks} className="space-y-3 pt-4 border-t border-gray-800">
                      <h4 className={`text-xs font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Add Grade Entry</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        <input type="text" value={newSubject} onChange={e => setNewSubject(e.target.value)} placeholder="Subject" className={`border rounded-xl p-2.5 text-xs ${isDark ? 'bg-gray-950 border-gray-800 text-white' : 'bg-gray-50 border-gray-300'}`} required />
                        <input type="text" value={newMarks} onChange={e => setNewMarks(e.target.value)} placeholder="Marks (e.g. 85/100)" className={`border rounded-xl p-2.5 text-xs ${isDark ? 'bg-gray-950 border-gray-800 text-white' : 'bg-gray-50 border-gray-300'}`} required />
                        <input type="text" value={newGrade} onChange={e => setNewGrade(e.target.value)} placeholder="Grade (e.g. A+)" className={`border rounded-xl p-2.5 text-xs ${isDark ? 'bg-gray-950 border-gray-800 text-white' : 'bg-gray-50 border-gray-300'}`} required />
                      </div>
                      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-xl text-xs font-bold shadow">Save Record</button>
                    </form>
                  </div>
                )}

                {activeTab === 'manager' && (
                  <div className={`border p-6 rounded-3xl shadow-xl space-y-6 ${isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'}`}>
                    <h3 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Candidate Manager</h3>
                    <form onSubmit={handleAddCandidate} className="space-y-4 max-w-md">
                      <div>
                        <label className={`block text-xs font-semibold mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Candidate Name</label>
                        <input type="text" value={candidateName} onChange={e => setCandidateName(e.target.value)} placeholder="Full Name" className={`w-full border rounded-xl p-3 text-sm ${isDark ? 'bg-gray-950 border-gray-800 text-white' : 'bg-gray-50 border-gray-300'}`} required />
                      </div>
                      <div>
                        <label className={`block text-xs font-semibold mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Party / Alliance</label>
                        <input type="text" value={candidateParty} onChange={e => setCandidateParty(e.target.value)} placeholder="Party Name" className={`w-full border rounded-xl p-3 text-sm ${isDark ? 'bg-gray-950 border-gray-800 text-white' : 'bg-gray-50 border-gray-300'}`} required />
                      </div>
                      <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-xl text-sm font-bold shadow">Register Candidate</button>
                    </form>
                  </div>
                )}

                {activeTab === 'orgs-hub' && (
                  <div className={`border p-6 rounded-3xl shadow-xl space-y-6 ${isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'}`}>
                    <h3 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Organizations Hub</h3>
                    <div className="space-y-3">
                      {selectedUni.organizations.map((org, i) => (
                        <div key={i} className={`p-4 rounded-2xl border flex justify-between items-center ${isDark ? 'bg-gray-950 border-gray-800' : 'bg-gray-50 border-gray-200'}`}>
                          <div>
                            <h4 className={`font-bold text-sm ${isDark ? 'text-white' : 'text-gray-900'}`}>{org.name}</h4>
                            <p className="text-xs text-blue-400">{org.role}</p>
                          </div>
                          <span className="text-xs text-emerald-400 font-bold bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-800">Verified Body</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              </div>

            </div>
          </div>
        )}

        {/* REGISTRATION MODAL */}
        {showRegModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className={`border p-6 rounded-3xl max-w-lg w-full space-y-4 ${isDark ? 'bg-gray-900 border-gray-800 text-white' : 'bg-white border-gray-200 text-gray-900'}`}>
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-black">Register University</h3>
                <button onClick={() => setShowRegModal(false)} className="text-gray-400 hover:text-white font-bold">✕</button>
              </div>
              <form onSubmit={handleUniversityRegistration} className="space-y-3">
                <input type="text" value={regUniName} onChange={e => setRegUniName(e.target.value)} placeholder="University Name" className={`w-full border rounded-xl p-3 text-sm ${isDark ? 'bg-gray-950 border-gray-800 text-white' : 'bg-gray-50 border-gray-300'}`} required />
                <input type="text" value={regLocation} onChange={e => setRegLocation(e.target.value)} placeholder="Location" className={`w-full border rounded-xl p-3 text-sm ${isDark ? 'bg-gray-950 border-gray-800 text-white' : 'bg-gray-50 border-gray-300'}`} required />
                <textarea value={regDesc} onChange={e => setRegDesc(e.target.value)} placeholder="Description" className={`w-full border rounded-xl p-3 text-sm h-20 ${isDark ? 'bg-gray-950 border-gray-800 text-white' : 'bg-gray-50 border-gray-300'}`} required />
                <input type="text" value={regEligible} onChange={e => setRegEligible(e.target.value)} placeholder="Eligible Voters (e.g. 20,000+)" className={`w-full border rounded-xl p-3 text-sm ${isDark ? 'bg-gray-950 border-gray-800 text-white' : 'bg-gray-50 border-gray-300'}`} required />
                <input type="file" accept=".pdf" onChange={e => setRegDoc(e.target.files[0])} className={`w-full border rounded-xl p-2.5 text-xs ${isDark ? 'bg-gray-950 border-gray-800 text-gray-300' : 'bg-gray-50 border-gray-300'}`} required />
                <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-xl text-sm font-bold">Submit Application</button>
              </form>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}