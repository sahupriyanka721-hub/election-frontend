import React, { useState, useEffect } from 'react';
import { auth, googleProvider } from './firebase';
import { signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';

export default function App() {
  const [user, setUser] = useState(null);
  const [currentView, setCurrentView] = useState('home'); // 'home', 'universities', 'admin'
  const [selectedUni, setSelectedUni] = useState(null);
  const [activeTab, setActiveTab] = useState('voting'); // 'voting', 'manager', 'org-dashboard', 'student-portal'

  // Dark / Light Mode State
  const [isDarkMode, setIsDarkMode] = useState(true);

  // Mobile Menu State
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // University Internal Admin & Organization States
  const [uniSubView, setUniSubView] = useState('portal'); // 'portal', 'uni-admin-login', 'uni-admin-dashboard', 'org-login', 'org-dashboard', 'student-portal'
  
  // University Admin Auth
  const [uniAdminEmail, setUniAdminEmail] = useState('');
  const [uniAdminPassword, setUniAdminPassword] = useState('');
  const [isUniAdminLoggedIn, setIsUniAdminLoggedIn] = useState(false);

  // Organization Auth
  const [orgEmail, setOrgEmail] = useState('');
  const [orgPassword, setOrgPassword] = useState('');
  const [isOrgLoggedIn, setIsOrgLoggedIn] = useState(false);
  const [orgName, setOrgName] = useState('');

  // Global Admin Credentials States (Email-based)
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);

  // Advanced Admin Panel Sub-Tabs ('overview', 'universities-mgmt', 'students-mgmt', 'system-logs')
  const [adminTab, setAdminTab] = useState('overview');

  // Admin Document/University Detail Modal State
  const [adminSelectedUni, setAdminSelectedUni] = useState(null);

  const [candidateName, setCandidateName] = useState('');
  const [candidateParty, setCandidateParty] = useState('');

  // Student Marks Management States (Inside Student Portal)
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
  
  // Universities List with Working Images
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
      image: 'https://images.unsplash.com/photo-1595535373655-4b9c2aae42d1?q=80&w=938&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
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

  const handleUniAdminLoginSubmit = (e) => {
    e.preventDefault();
    if (uniAdminEmail && uniAdminPassword) {
      setIsUniAdminLoggedIn(true);
      setUniSubView('uni-admin-dashboard');
      alert("University Admin Logged In Successfully!");
    } else {
      alert("Please enter valid credentials!");
    }
  };

  const handleOrgLoginSubmit = (e) => {
    e.preventDefault();
    if (orgEmail && orgPassword) {
      setIsOrgLoggedIn(true);
      setOrgName(orgEmail.split('@')[0].toUpperCase());
      setUniSubView('org-dashboard');
      alert("Organization Logged In Successfully!");
    } else {
      alert("Please enter valid organization credentials!");
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
      alert("Please sign in with Google or log in as an Organization to register candidates!");
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

  const handleUpdateMarks = (e) => {
    e.preventDefault();
    if (!newSubject.trim() || !newMarks.trim() || !newGrade.trim()) {
      alert("Please fill in all subject details!");
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
    alert("Student marks updated successfully!");
  };

  const handleUniversityRegistration = (e) => {
    e.preventDefault();
    if (!regUniName || !regLocation || !regDesc || !regEligible || !regDoc) {
      alert("Please fill all fields and upload verification documents.");
      return;
    }

    const defaultImages = [
      'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=1200&q=80'
    ];
    const randomImg = defaultImages[Math.floor(Math.random() * defaultImages.length)];

    const newUni = {
      id: regUniName.toLowerCase().replace(/\s+/g, '-'),
      name: regUniName,
      location: regLocation,
      desc: regDesc,
      eligible: regEligible,
      status: 'Pending',
      docName: regDoc.name,
      image: randomImg,
      candidates: []
    };

    setUniversities([...universities, newUni]);
    setShowRegModal(false);
    setRegUniName('');
    setRegLocation('');
    setRegDesc('');
    setRegEligible('');
    setRegDoc(null);
    alert("University application submitted successfully! It is sent for admin verification.");
  };

  const handleAdminAction = (uniId, action) => {
    setUniversities(universities.map(uni => {
      if (uni.id === uniId) {
        return { ...uni, status: action };
      }
      return uni;
    }));
    alert(`University status updated to: ${action}`);
  };

  const handleDeleteUniversity = (uniId) => {
    if (window.confirm("Are you sure you want to delete this university from the system?")) {
      setUniversities(universities.filter(uni => uni.id !== uniId));
      alert("University removed successfully.");
    }
  };

  const getTotalVotes = (candidates) => {
    const total = candidates.reduce((acc, curr) => acc + curr.votes, 0);
    return total === 0 ? 1 : total;
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-[#030508] text-gray-100' : 'bg-gray-50 text-gray-900'} font-sans relative overflow-hidden selection:bg-blue-500 selection:text-white transition-colors duration-300`}>
      <div className="absolute top-0 left-1/3 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute top-1/4 right-1/4 w-[400px] h-[400px] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none"></div>

      {/* Navbar */}
      <nav className={`p-4 border-b ${isDarkMode ? 'border-gray-800/60 bg-[#030508]/90' : 'border-gray-200 bg-white/90'} backdrop-blur-xl sticky top-0 z-50 shadow-2xl transition-colors duration-300`}>
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="cursor-pointer flex items-center gap-2.5" onClick={() => { setCurrentView('home'); setSelectedUni(null); setUniSubView('portal'); setMobileMenuOpen(false); }}>
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center font-black text-white shadow-lg shadow-blue-600/30">V</div>
            <div>
              <h1 className="text-sm md:text-lg font-black tracking-wider text-white bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">UniVote Pro</h1>
              <p className={`text-[8px] md:text-[9px] ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} tracking-wide font-medium`}>National Campus Election Portal</p>
            </div>
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-3">
            <button 
              onClick={() => { setCurrentView('home'); setSelectedUni(null); setUniSubView('portal'); }}
              className={`text-sm font-semibold px-3.5 py-1.5 rounded-xl transition ${currentView === 'home' ? 'text-blue-400 bg-blue-950/40 border border-blue-800/40' : isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}
            >
              Home
            </button>
            <button 
              onClick={() => { setCurrentView('universities'); setSelectedUni(null); setUniSubView('portal'); }}
              className={`text-sm font-semibold px-3.5 py-1.5 rounded-xl transition ${currentView === 'universities' && !selectedUni ? 'text-blue-400 bg-blue-950/40 border border-blue-800/40' : isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}
            >
              Universities
            </button>
            <button 
              onClick={() => { setCurrentView('admin'); setSelectedUni(null); setUniSubView('portal'); }}
              className={`text-sm font-semibold px-3.5 py-1.5 rounded-xl transition ${currentView === 'admin' ? 'text-blue-400 bg-blue-950/40 border border-blue-800/40' : isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}
            >
              Admin Panel 🛡️
            </button>

            {/* Dark / Light Mode Toggle Button */}
            <button 
              onClick={() => setIsDarkMode(!isDarkMode)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition flex items-center gap-1.5 ${isDarkMode ? 'bg-gray-800/80 border-gray-700 text-yellow-400 hover:bg-gray-700' : 'bg-gray-100 border-gray-300 text-gray-700 hover:bg-gray-200'}`}
              title="Toggle Dark/Light Mode"
            >
              {isDarkMode ? '☀️ Light' : '🌙 Dark'}
            </button>

            {user ? (
              <div className={`flex items-center gap-2.5 ${isDarkMode ? 'bg-gray-900/90 border-gray-700/60' : 'bg-gray-100 border-gray-300'} border px-3 py-1.5 rounded-2xl shadow-xl backdrop-blur-md ml-2`}>
                <img src={user.photoURL} alt="Profile" className="w-7 h-7 rounded-full border-2 border-blue-500 shadow-md object-cover" />
                <div className="text-left">
                  <p className={`text-[11px] font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} leading-tight`}>{user.displayName || 'User'}</p>
                  <p className="text-[9px] text-blue-400 font-medium truncate max-w-[100px]">{user.email}</p>
                </div>
                <button 
                  onClick={handleLogout}
                  className="bg-red-600 hover:bg-red-500 text-white px-2.5 py-1 rounded-lg text-xs font-semibold transition ml-1"
                >
                  Logout
                </button>
              </div>
            ) : (
              <button 
                onClick={handleGoogleLogin}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 text-white px-4 py-2 rounded-xl text-sm font-bold transition-all shadow-lg shadow-blue-600/20 active:scale-95 ml-2"
              >
                Sign in with Google
              </button>
            )}
          </div>

          {/* Mobile Hamburger Button */}
          <div className="flex md:hidden items-center gap-2">
            <button 
              onClick={() => setIsDarkMode(!isDarkMode)}
              className={`p-2 rounded-xl text-xs font-semibold border ${isDarkMode ? 'bg-gray-900 border-gray-800 text-yellow-400' : 'bg-gray-100 border-gray-300 text-gray-700'}`}
            >
              {isDarkMode ? '☀️' : '🌙'}
            </button>
            {user && (
              <img src={user.photoURL} alt="Profile" className="w-8 h-8 rounded-full border-2 border-blue-500 object-cover" />
            )}
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`${isDarkMode ? 'bg-gray-900 border-gray-800 text-gray-200' : 'bg-gray-100 border-gray-300 text-gray-800'} border p-2 rounded-xl focus:outline-none`}
            >
              {mobileMenuOpen ? '✕' : '☰'}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className={`md:hidden mt-4 pt-4 border-t ${isDarkMode ? 'border-gray-800/80' : 'border-gray-200'} flex flex-col gap-2.5 animate-fadeIn`}>
            <button 
              onClick={() => { setCurrentView('home'); setSelectedUni(null); setUniSubView('portal'); setMobileMenuOpen(false); }}
              className={`text-left text-sm font-semibold px-4 py-2.5 rounded-xl transition ${currentView === 'home' ? 'text-blue-400 bg-blue-950/40 border border-blue-800/40' : isDarkMode ? 'text-gray-300 hover:bg-gray-900' : 'text-gray-700 hover:bg-gray-100'}`}
            >
              🏠 Home
            </button>
            <button 
              onClick={() => { setCurrentView('universities'); setSelectedUni(null); setUniSubView('portal'); setMobileMenuOpen(false); }}
              className={`text-left text-sm font-semibold px-4 py-2.5 rounded-xl transition ${currentView === 'universities' && !selectedUni ? 'text-blue-400 bg-blue-950/40 border border-blue-800/40' : isDarkMode ? 'text-gray-300 hover:bg-gray-900' : 'text-gray-700 hover:bg-gray-100'}`}
            >
              🏛️ Universities
            </button>
            <button 
              onClick={() => { setCurrentView('admin'); setSelectedUni(null); setUniSubView('portal'); setMobileMenuOpen(false); }}
              className={`text-left text-sm font-semibold px-4 py-2.5 rounded-xl transition ${currentView === 'admin' ? 'text-blue-400 bg-blue-950/40 border border-blue-800/40' : isDarkMode ? 'text-gray-300 hover:bg-gray-900' : 'text-gray-700 hover:bg-gray-100'}`}
            >
              🛡️ Admin Panel
            </button>

            <div className={`pt-2 border-t ${isDarkMode ? 'border-gray-800/60' : 'border-gray-200'} mt-1`}>
              {user ? (
                <div className={`flex flex-col gap-3 ${isDarkMode ? 'bg-gray-950 border-gray-800' : 'bg-gray-100 border-gray-300'} p-3 rounded-2xl border`}>
                  <div className="flex items-center gap-2.5">
                    <img src={user.photoURL} alt="Profile" className="w-8 h-8 rounded-full border border-blue-500 object-cover" />
                    <div>
                      <p className={`text-xs font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{user.displayName || 'User'}</p>
                      <p className="text-[10px] text-blue-400 truncate max-w-[200px]">{user.email}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => { handleLogout(); setMobileMenuOpen(false); }}
                    className="w-full bg-red-600 hover:bg-red-500 text-white py-2 rounded-xl text-xs font-semibold transition"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <button 
                  onClick={() => { handleGoogleLogin(); setMobileMenuOpen(false); }}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 text-white py-3 rounded-xl text-sm font-bold shadow-lg"
                >
                  Sign in with Google
                </button>
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
            
            <h1 className={`text-4xl md:text-7xl font-black ${isDarkMode ? 'text-white' : 'text-gray-900'} tracking-tight leading-[1.1] bg-gradient-to-r ${isDarkMode ? 'from-white via-gray-200 to-gray-400' : 'from-gray-900 via-gray-800 to-gray-600'} bg-clip-text text-transparent`}>
              Next-Gen Student Union Elections & Organization Hub
            </h1>
            
            <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} text-sm md:text-base leading-relaxed max-w-2xl mx-auto font-medium`}>
              Comprehensive university and organization information dashboards with transparent verification routing and secure Google-authenticated balloting.
            </p>

            <div className="flex flex-wrap justify-center gap-4 pt-2">
              <button 
                onClick={() => setCurrentView('universities')}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 text-white px-8 py-4 rounded-2xl font-bold text-sm shadow-xl shadow-blue-600/30 transition-all hover:scale-105 active:scale-95"
              >
                Explore Universities →
              </button>
              <button 
                onClick={() => setShowRegModal(true)}
                className={`${isDarkMode ? 'bg-gray-900/90 text-white border-gray-700/80 hover:bg-gray-800' : 'bg-white text-gray-800 border-gray-300 hover:bg-gray-100'} border px-8 py-4 rounded-2xl font-bold text-sm shadow-xl transition-all hover:scale-105 active:scale-95`}
              >
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
                <h2 className={`text-3xl font-black ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Approved Universities</h2>
                <p className={`text-xs md:text-sm mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Select your approved institution to open the complete organization & student dashboard.</p>
              </div>
              <button 
                onClick={() => setShowRegModal(true)}
                className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-xl font-bold text-xs shadow-lg transition"
              >
                + Register New University
              </button>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {universities.filter(uni => uni.status === 'Approved').map((uni) => (
                <div 
                  key={uni.id} 
                  className={`group relative ${isDarkMode ? 'bg-gradient-to-b from-gray-900/90 to-gray-950/90 border-gray-800/80 hover:border-blue-500/60' : 'bg-white border-gray-200 hover:border-blue-400 shadow-md'} border rounded-3xl overflow-hidden flex flex-col justify-between transition-all duration-500 hover:-translate-y-2 hover:shadow-xl backdrop-blur-xl`}
                >
                  <div className={`relative h-48 w-full overflow-hidden ${isDarkMode ? 'bg-gray-950' : 'bg-gray-100'}`}>
                    <img src={uni.image} alt={uni.name} className="w-full h-full object-cover group-hover:scale-110 transition duration-700" />
                    <div className={`absolute inset-0 bg-gradient-to-t ${isDarkMode ? 'from-gray-950 via-gray-950/40' : 'from-white/90 via-white/20'} to-transparent`}></div>
                    <span className="absolute top-4 right-4 text-[10px] bg-emerald-950/90 text-emerald-400 px-3 py-1 rounded-full border border-emerald-800/60 font-semibold tracking-wider backdrop-blur-md">Active</span>
                  </div>

                  <div className="p-6 pt-2">
                    <h3 className={`font-bold text-lg ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-1 group-hover:text-blue-400 transition-colors`}>{uni.name}</h3>
                    <p className="text-xs text-blue-400/90 mb-3 font-medium">📍 {uni.location}</p>
                    <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mb-6 leading-relaxed line-clamp-2`}>{uni.desc}</p>
                  
                    <div className={`flex justify-between items-center text-xs ${isDarkMode ? 'text-gray-400 border-gray-800/80' : 'text-gray-600 border-gray-200'} mb-4 border-t pt-3`}>
                      <span>Eligible Voters:</span>
                      <strong className={`${isDarkMode ? 'text-white bg-gray-800/60 border-gray-700/50' : 'text-gray-900 bg-gray-100 border-gray-200'} px-2.5 py-1 rounded-lg border`}>{uni.eligible}</strong>
                    </div>
                    <button 
                      onClick={() => { setSelectedUni(uni); setActiveTab('voting'); setUniSubView('portal'); }}
                      className={`w-full ${isDarkMode ? 'bg-gray-800/80 border-gray-700/50 text-white' : 'bg-gray-100 border-gray-200 text-gray-800 hover:bg-gray-200'} hover:bg-gradient-to-r hover:from-blue-600 hover:to-indigo-600 hover:text-white text-sm py-3 rounded-xl transition-all font-semibold text-center shadow-lg border`}
                    >
                      Open Dashboard →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* VIEW 4: SELECTED UNIVERSITY DASHBOARD & TABS */}
        {selectedUni && (
          <div className="space-y-6">
            <button 
              onClick={() => setSelectedUni(null)}
              className={`text-xs font-semibold ${isDarkMode ? 'bg-gray-900 text-gray-300 border-gray-800 hover:bg-gray-800' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'} border px-4 py-2 rounded-xl transition flex items-center gap-2 shadow-md`}
            >
              ← Back to Universities
            </button>

            {/* University Header Banner */}
            <div className={`relative rounded-3xl overflow-hidden border ${isDarkMode ? 'border-gray-800/80 bg-gray-900/60' : 'border-gray-200 bg-white shadow-xl'} p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 backdrop-blur-xl`}>
              <div className="space-y-2">
                <span className="text-[10px] bg-blue-500/10 text-blue-400 px-3 py-1 rounded-full border border-blue-500/20 font-semibold uppercase tracking-wider">Institution Portal</span>
                <h2 className={`text-2xl md:text-4xl font-black ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{selectedUni.name}</h2>
                <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} max-w-xl`}>{selectedUni.desc} • 📍 {selectedUni.location}</p>
              </div>
              
              <div className="flex flex-wrap gap-2">
                <button 
                  onClick={() => setUniSubView('portal')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition ${uniSubView === 'portal' ? 'bg-blue-600 text-white shadow-lg' : isDarkMode ? 'bg-gray-800 text-gray-300' : 'bg-gray-200 text-gray-800'}`}
                >
                  🏛️ Election & Voting
                </button>
                <button 
                  onClick={() => setUniSubView('student-portal')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition ${uniSubView === 'student-portal' ? 'bg-blue-600 text-white shadow-lg' : isDarkMode ? 'bg-gray-800 text-gray-300' : 'bg-gray-200 text-gray-800'}`}
                >
                  🎓 Student Portal
                </button>
                <button 
                  onClick={() => setUniSubView('uni-admin-login')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition ${uniSubView.includes('uni-admin') ? 'bg-purple-600 text-white shadow-lg' : isDarkMode ? 'bg-gray-800 text-purple-300' : 'bg-gray-200 text-purple-700'}`}
                >
                  🛡️ Uni Admin
                </button>
                <button 
                  onClick={() => setUniSubView('org-login')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition ${uniSubView.includes('org') ? 'bg-emerald-600 text-white shadow-lg' : isDarkMode ? 'bg-gray-800 text-emerald-300' : 'bg-gray-200 text-emerald-700'}`}
                >
                  🏢 Organization
                </button>
              </div>
            </div>

            {/* SUB-VIEW 1: STANDARD PORTAL (VOTING & CANDIDATES) */}
            {uniSubView === 'portal' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className={`lg:col-span-2 ${isDarkMode ? 'bg-gray-950/80 border-gray-800/80' : 'bg-white border-gray-200 shadow-xl'} border rounded-3xl p-6 md:p-8 backdrop-blur-xl space-y-6`}>
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className={`text-xl font-black ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Active Ballot Box</h3>
                      <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Cast your secure digital vote for registered student union candidates.</p>
                    </div>
                    <span className="text-xs bg-emerald-500/10 text-emerald-400 px-3 py-1 rounded-full border border-emerald-500/20 font-bold">Live Poll</span>
                  </div>

                  {selectedUni.candidates.length === 0 ? (
                    <div className={`text-center py-12 ${isDarkMode ? 'bg-gray-900/40 border-gray-800' : 'bg-gray-50 border-gray-200'} border rounded-2xl`}>
                      <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>No candidates registered yet for this election.</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {selectedUni.candidates.map((cand) => {
                        const total = getTotalVotes(selectedUni.candidates);
                        const percentage = Math.round((cand.votes / total) * 100);
                        return (
                          <div key={cand.id} className={`${isDarkMode ? 'bg-gray-900/80 border-gray-800' : 'bg-gray-50 border-gray-200'} border rounded-2xl p-5 space-y-3 transition`}>
                            <div className="flex justify-between items-center">
                              <div>
                                <h4 className={`font-bold text-base ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{cand.name}</h4>
                                <p className="text-xs text-blue-400 font-semibold">Party: {cand.party}</p>
                              </div>
                              <div className="flex items-center gap-4">
                                <span className="text-xs font-bold text-emerald-400">{cand.votes} Votes ({percentage}%)</span>
                                <button 
                                  onClick={() => handleVote(selectedUni.id, cand.id)}
                                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-lg transition active:scale-95"
                                >
                                  Vote 🗳️
                                </button>
                              </div>
                            </div>
                            <div className={`w-full ${isDarkMode ? 'bg-gray-950' : 'bg-gray-200'} h-2.5 rounded-full overflow-hidden`}>
                              <div className="bg-gradient-to-r from-blue-500 to-indigo-500 h-full transition-all duration-500" style={{ width: `${percentage}%` }}></div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Candidate Registration Box */}
                <div className={`${isDarkMode ? 'bg-gray-950/80 border-gray-800/80' : 'bg-white border-gray-200 shadow-xl'} border rounded-3xl p-6 md:p-8 backdrop-blur-xl space-y-6 h-fit`}>
                  <div>
                    <h3 className={`text-lg font-black ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Register Candidate</h3>
                    <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Add a new candidate to the ballot lineup.</p>
                  </div>

                  <form onSubmit={handleAddCandidate} className="space-y-4">
                    <div>
                      <label className={`block text-xs font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>Candidate Name</label>
                      <input 
                        type="text" 
                        value={candidateName}
                        onChange={(e) => setCandidateName(e.target.value)}
                        placeholder="e.g. Priya Sharma"
                        className={`w-full ${isDarkMode ? 'bg-gray-900 border-gray-800 text-white' : 'bg-gray-50 border-gray-300 text-gray-900'} border rounded-xl p-3 text-xs focus:outline-none focus:border-blue-500`}
                        required 
                      />
                    </div>
                    <div>
                      <label className={`block text-xs font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>Party / Panel Name</label>
                      <input 
                        type="text" 
                        value={candidateParty}
                        onChange={(e) => setCandidateParty(e.target.value)}
                        placeholder="e.g. Student Alliance"
                        className={`w-full ${isDarkMode ? 'bg-gray-900 border-gray-800 text-white' : 'bg-gray-50 border-gray-300 text-gray-900'} border rounded-xl p-3 text-xs focus:outline-none focus:border-blue-500`}
                        required 
                      />
                    </div>
                    <button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 text-white py-3 rounded-xl text-xs font-bold shadow-lg transition">
                      Submit Candidate Nomination
                    </button>
                  </form>
                </div>
              </div>
            )}

            {/* SUB-VIEW 2: STUDENT PORTAL (MARKS & PROFILE) */}
            {uniSubView === 'student-portal' && (
              <div className={`space-y-6 ${isDarkMode ? 'bg-gray-950/80 border-gray-800/80' : 'bg-white border-gray-200 shadow-xl'} border rounded-3xl p-6 md:p-8 backdrop-blur-xl`}>
                <div className="flex justify-between items-center flex-wrap gap-4">
                  <div>
                    <h3 className={`text-xl font-black ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Student Academic Portal</h3>
                    <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>View semester results and academic performance records.</p>
                  </div>
                  {user && (
                    <div className="flex items-center gap-3 bg-blue-500/10 border border-blue-500/20 px-4 py-2 rounded-2xl">
                      <img src={user.photoURL} alt="Student" className="w-8 h-8 rounded-full border border-blue-500 object-cover" />
                      <div>
                        <p className={`text-xs font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{user.displayName}</p>
                        <p className="text-[10px] text-blue-400 font-medium">Verified Student ID: #UV-2026-9481</p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
                  <div className={`md:col-span-2 ${isDarkMode ? 'bg-gray-900/60 border-gray-800' : 'bg-gray-50 border-gray-200'} border rounded-2xl p-6 space-y-4`}>
                    <h4 className={`text-sm font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Semester Grade Report</h4>
                    <div className="space-y-3">
                      {studentMarks.map((m) => (
                        <div key={m.id} className={`flex justify-between items-center p-3.5 rounded-xl border ${isDarkMode ? 'bg-gray-950 border-gray-800 text-gray-200' : 'bg-white border-gray-200 text-gray-800 shadow-sm'}`}>
                          <div>
                            <p className="text-xs font-bold">{m.subject}</p>
                            <p className="text-[10px] text-gray-400">Score: {m.marks}</p>
                          </div>
                          <span className="px-3 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-bold">Grade: {m.grade}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Add Marks Form */}
                  <div className={`${isDarkMode ? 'bg-gray-900/60 border-gray-800' : 'bg-gray-50 border-gray-200'} border rounded-2xl p-6 space-y-4 h-fit`}>
                    <h4 className={`text-sm font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Add Subject Record</h4>
                    <form onSubmit={handleUpdateMarks} className="space-y-3">
                      <div>
                        <label className={`block text-[10px] font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>Subject Name</label>
                        <input 
                          type="text" 
                          value={newSubject}
                          onChange={(e) => setNewSubject(e.target.value)}
                          placeholder="e.g. Operating Systems"
                          className={`w-full ${isDarkMode ? 'bg-gray-950 border-gray-800 text-white' : 'bg-white border-gray-300 text-gray-900'} border rounded-xl p-2.5 text-xs focus:outline-none`}
                        />
                      </div>
                      <div>
                        <label className={`block text-[10px] font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>Marks Obtained</label>
                        <input 
                          type="text" 
                          value={newMarks}
                          onChange={(e) => setNewMarks(e.target.value)}
                          placeholder="e.g. 85/100"
                          className={`w-full ${isDarkMode ? 'bg-gray-950 border-gray-800 text-white' : 'bg-white border-gray-300 text-gray-900'} border rounded-xl p-2.5 text-xs focus:outline-none`}
                        />
                      </div>
                      <div>
                        <label className={`block text-[10px] font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>Grade</label>
                        <input 
                          type="text" 
                          value={newGrade}
                          onChange={(e) => setNewGrade(e.target.value)}
                          placeholder="e.g. A"
                          className={`w-full ${isDarkMode ? 'bg-gray-950 border-gray-800 text-white' : 'bg-white border-gray-300 text-gray-900'} border rounded-xl p-2.5 text-xs focus:outline-none`}
                        />
                      </div>
                      <button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 text-white py-2.5 rounded-xl text-xs font-bold transition shadow-md">
                        Add Record
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            )}

            {/* SUB-VIEW 3: UNI ADMIN LOGIN & DASHBOARD */}
            {uniSubView === 'uni-admin-login' && !isUniAdminLoggedIn && (
              <div className={`max-w-md mx-auto ${isDarkMode ? 'bg-gray-950 border-gray-800' : 'bg-white border-gray-200 shadow-xl'} border p-8 rounded-3xl backdrop-blur-md`}>
                <div className="text-center mb-6">
                  <span className="text-xs bg-purple-500/10 text-purple-400 px-3 py-1 rounded-full border border-purple-500/20 font-semibold uppercase tracking-widest inline-block mb-2">Internal Administration</span>
                  <h3 className={`text-2xl font-black ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{selectedUni.name} Admin</h3>
                  <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mt-1`}>Login to manage university election rules and voter lists.</p>
                </div>
                <form onSubmit={handleUniAdminLoginSubmit} className="space-y-4">
                  <div>
                    <label className={`block text-xs font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>Admin Email</label>
                    <input 
                      type="email" 
                      value={uniAdminEmail}
                      onChange={(e) => setUniAdminEmail(e.target.value)}
                      placeholder="admin@university.edu"
                      className={`w-full ${isDarkMode ? 'bg-gray-900 border-gray-800 text-white' : 'bg-gray-50 border-gray-300 text-gray-900'} border rounded-xl p-3 text-xs focus:outline-none`}
                      required 
                    />
                  </div>
                  <div>
                    <label className={`block text-xs font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>Password</label>
                    <input 
                      type="password" 
                      value={uniAdminPassword}
                      onChange={(e) => setUniAdminPassword(e.target.value)}
                      placeholder="••••••••"
                      className={`w-full ${isDarkMode ? 'bg-gray-900 border-gray-800 text-white' : 'bg-gray-50 border-gray-300 text-gray-900'} border rounded-xl p-3 text-xs focus:outline-none`}
                      required 
                    />
                  </div>
                  <button type="submit" className="w-full bg-purple-600 hover:bg-purple-500 text-white py-3 rounded-xl text-xs font-bold shadow-lg">
                    Login to Uni Admin Dashboard
                  </button>
                </form>
              </div>
            )}

            {uniSubView === 'uni-admin-dashboard' && isUniAdminLoggedIn && (
              <div className={`${isDarkMode ? 'bg-gray-950/80 border-gray-800' : 'bg-white border-gray-200 shadow-xl'} border rounded-3xl p-6 md:p-8 space-y-6`}>
                <div className="flex justify-between items-center">
                  <div>
                    <span className="text-xs bg-purple-500/10 text-purple-400 px-3 py-1 rounded-full border border-purple-500/20 font-bold">Uni Admin Active</span>
                    <h3 className={`text-2xl font-black ${isDarkMode ? 'text-white' : 'text-gray-900'} mt-1`}>{selectedUni.name} Control Room</h3>
                  </div>
                  <button onClick={() => setIsUniAdminLoggedIn(false)} className="bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-xl text-xs font-semibold">Logout</button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className={`${isDarkMode ? 'bg-gray-900 border-gray-800' : 'bg-gray-50 border-gray-200'} p-5 rounded-2xl border`}>
                    <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Total Candidates</p>
                    <p className={`text-2xl font-black ${isDarkMode ? 'text-white' : 'text-gray-900'} mt-1`}>{selectedUni.candidates.length}</p>
                  </div>
                  <div className={`${isDarkMode ? 'bg-gray-900 border-gray-800' : 'bg-gray-50 border-gray-200'} p-5 rounded-2xl border`}>
                    <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Eligible Voters</p>
                    <p className={`text-2xl font-black ${isDarkMode ? 'text-white' : 'text-gray-900'} mt-1`}>{selectedUni.eligible}</p>
                  </div>
                  <div className={`${isDarkMode ? 'bg-gray-900 border-gray-800' : 'bg-gray-50 border-gray-200'} p-5 rounded-2xl border`}>
                    <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Election Status</p>
                    <p className="text-2xl font-black text-emerald-400 mt-1">Active</p>
                  </div>
                </div>
              </div>
            )}

            {/* SUB-VIEW 4: ORGANIZATION LOGIN & DASHBOARD */}
            {uniSubView === 'org-login' && !isOrgLoggedIn && (
              <div className={`max-w-md mx-auto ${isDarkMode ? 'bg-gray-950 border-gray-800' : 'bg-white border-gray-200 shadow-xl'} border p-8 rounded-3xl backdrop-blur-md`}>
                <div className="text-center mb-6">
                  <span className="text-xs bg-emerald-500/10 text-emerald-400 px-3 py-1 rounded-full border border-emerald-500/20 font-semibold uppercase tracking-widest inline-block mb-2">Student Organization</span>
                  <h3 className={`text-2xl font-black ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Organization Login</h3>
                  <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mt-1`}>Manage organization campaigns and student welfare requests.</p>
                </div>
                <form onSubmit={handleOrgLoginSubmit} className="space-y-4">
                  <div>
                    <label className={`block text-xs font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>Organization Email</label>
                    <input 
                      type="email" 
                      value={orgEmail}
                      onChange={(e) => setOrgEmail(e.target.value)}
                      placeholder="youthfront@org.com"
                      className={`w-full ${isDarkMode ? 'bg-gray-900 border-gray-800 text-white' : 'bg-gray-50 border-gray-300 text-gray-900'} border rounded-xl p-3 text-xs focus:outline-none`}
                      required 
                    />
                  </div>
                  <div>
                    <label className={`block text-xs font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>Password</label>
                    <input 
                      type="password" 
                      value={orgPassword}
                      onChange={(e) => setOrgPassword(e.target.value)}
                      placeholder="••••••••"
                      className={`w-full ${isDarkMode ? 'bg-gray-900 border-gray-800 text-white' : 'bg-gray-50 border-gray-300 text-gray-900'} border rounded-xl p-3 text-xs focus:outline-none`}
                      required 
                    />
                  </div>
                  <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-500 text-white py-3 rounded-xl text-xs font-bold shadow-lg">
                    Login to Organization Hub
                  </button>
                </form>
              </div>
            )}

            {uniSubView === 'org-dashboard' && isOrgLoggedIn && (
              <div className={`${isDarkMode ? 'bg-gray-950/80 border-gray-800' : 'bg-white border-gray-200 shadow-xl'} border rounded-3xl p-6 md:p-8 space-y-6`}>
                <div className="flex justify-between items-center">
                  <div>
                    <span className="text-xs bg-emerald-500/10 text-emerald-400 px-3 py-1 rounded-full border border-emerald-500/20 font-bold">Organization Active</span>
                    <h3 className={`text-2xl font-black ${isDarkMode ? 'text-white' : 'text-gray-900'} mt-1`}>{orgName} Dashboard ({selectedUni.name})</h3>
                  </div>
                  <button onClick={() => setIsOrgLoggedIn(false)} className="bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-xl text-xs font-semibold">Logout</button>
                </div>
                <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>You have administrative privileges to endorse candidates and broadcast campaign manifestos for {selectedUni.name}.</p>
              </div>
            )}

          </div>
        )}

        {/* VIEW 5: ADVANCED ADMIN PANEL & LOGIN */}
        {currentView === 'admin' && (
          <div>
            {!isAdminLoggedIn ? (
              <div className={`max-w-md mx-auto mt-12 ${isDarkMode ? 'bg-gradient-to-b from-gray-900 to-gray-950 border-gray-800' : 'bg-white border-gray-200 shadow-xl'} border p-8 rounded-3xl backdrop-blur-md`}>
                <div className="text-center mb-6">
                  <span className="text-xs bg-purple-500/15 text-purple-400 px-3 py-1 rounded-full border border-purple-500/30 font-semibold uppercase tracking-widest inline-block mb-2">Restricted Access</span>
                  <h2 className={`text-2xl font-black ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Admin Panel Login</h2>
                  <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mt-1`}>Please authenticate to access full system management.</p>
                </div>

                <form onSubmit={handleAdminLogin} className="space-y-4">
                  <div>
                    <label className={`block text-xs font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-1.5`}>Admin Email</label>
                    <input 
                      type="email" 
                      value={adminEmail}
                      onChange={(e) => setAdminEmail(e.target.value)}
                      placeholder="admin@univote.com"
                      className={`w-full ${isDarkMode ? 'bg-gray-950 border-gray-800 text-white' : 'bg-gray-50 border-gray-300 text-gray-900'} border rounded-xl p-3 text-sm focus:outline-none focus:border-blue-500`}
                      required 
                    />
                  </div>
                  <div>
                    <label className={`block text-xs font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-1.5`}>Password</label>
                    <input 
                      type="password" 
                      value={adminPassword}
                      onChange={(e) => setAdminPassword(e.target.value)}
                      placeholder="••••••••"
                      className={`w-full ${isDarkMode ? 'bg-gray-950 border-gray-800 text-white' : 'bg-gray-50 border-gray-300 text-gray-900'} border rounded-xl p-3 text-sm focus:outline-none focus:border-blue-500`}
                      required 
                    />
                  </div>
                  <button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 text-white py-3.5 rounded-xl text-sm font-bold shadow-lg mt-2">
                    Login to Admin Panel
                  </button>
                </form>
              </div>
            ) : (
              <div className="space-y-6">
                <div className={`flex flex-col md:flex-row justify-between items-start md:items-center ${isDarkMode ? 'from-gray-900 to-gray-950 border-gray-800' : 'from-gray-100 to-white border-gray-200'} bg-gradient-to-r p-6 rounded-3xl border gap-4 shadow-xl`}>
                  <div>
                    <span className="text-xs bg-emerald-500/15 text-emerald-400 px-3 py-1 rounded-full border border-emerald-500/30 font-semibold uppercase tracking-widest inline-block mb-2">Super Admin Active</span>
                    <h2 className={`text-2xl font-black ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>National Control & Admin Panel</h2>
                    <p className={`text-xs mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Manage universities, approve compliance documents, and monitor live system status.</p>
                  </div>
                  <button 
                    onClick={() => setIsAdminLoggedIn(false)}
                    className="bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-xl text-xs font-semibold transition shadow-lg"
                  >
                    Admin Logout
                  </button>
                </div>

                <div className={`flex flex-wrap gap-2 ${isDarkMode ? 'bg-gray-900/60 border-gray-800' : 'bg-gray-200 border-gray-300'} p-2 rounded-2xl border`}>
                  <button 
                    onClick={() => setAdminTab('overview')}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition ${adminTab === 'overview' ? 'bg-blue-600 text-white shadow-lg' : isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-700 hover:text-gray-900'}`}
                  >
                    📊 System Overview
                  </button>
                  <button 
                    onClick={() => setAdminTab('universities-mgmt')}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition ${adminTab === 'universities-mgmt' ? 'bg-blue-600 text-white shadow-lg' : isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-700 hover:text-gray-900'}`}
                  >
                    🏛️ University Approvals ({universities.filter(u => u.status === 'Pending').length})
                  </button>
                  <button 
                    onClick={() => setAdminTab('students-mgmt')}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition ${adminTab === 'students-mgmt' ? 'bg-blue-600 text-white shadow-lg' : isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-700 hover:text-gray-900'}`}
                  >
                    👥 Student Voters Directory
                  </button>
                  <button 
                    onClick={() => setAdminTab('system-logs')}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition ${adminTab === 'system-logs' ? 'bg-blue-600 text-white shadow-lg' : isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-700 hover:text-gray-900'}`}
                  >
                    ⚙️ System Activity Logs
                  </button>
                </div>

                {adminTab === 'overview' && (
                  <div className="space-y-6 animate-fadeIn">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div className={`${isDarkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200 shadow-md'} p-6 rounded-3xl border`}>
                        <p className={`text-xs font-semibold ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Total Universities</p>
                        <p className={`text-3xl font-black ${isDarkMode ? 'text-white' : 'text-gray-900'} mt-2`}>{universities.length}</p>
                      </div>
                      <div className={`${isDarkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200 shadow-md'} p-6 rounded-3xl border`}>
                        <p className={`text-xs font-semibold ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Pending Approvals</p>
                        <p className="text-3xl font-black text-amber-400 mt-2">{universities.filter(u => u.status === 'Pending').length}</p>
                      </div>
                      <div className={`${isDarkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200 shadow-md'} p-6 rounded-3xl border`}>
                        <p className={`text-xs font-semibold ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Active Ballots</p>
                        <p className="text-3xl font-black text-emerald-400 mt-2">{universities.filter(u => u.status === 'Approved').length}</p>
                      </div>
                      <div className={`${isDarkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200 shadow-md'} p-6 rounded-3xl border`}>
                        <p className={`text-xs font-semibold ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>System Security</p>
                        <p className="text-3xl font-black text-blue-400 mt-2">Encrypted</p>
                      </div>
                    </div>
                  </div>
                )}

                {adminTab === 'universities-mgmt' && (
                  <div className={`space-y-4 ${isDarkMode ? 'bg-gray-950/80 border-gray-800' : 'bg-white border-gray-200 shadow-xl'} border rounded-3xl p-6`}>
                    <h3 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>University Applications & Approvals</h3>
                    <div className="space-y-3">
                      {universities.map(uni => (
                        <div key={uni.id} className={`flex justify-between items-center p-4 rounded-2xl border ${isDarkMode ? 'bg-gray-900 border-gray-800' : 'bg-gray-50 border-gray-200'}`}>
                          <div>
                            <h4 className={`font-bold text-sm ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{uni.name}</h4>
                            <p className="text-xs text-blue-400">{uni.location} • Status: <span className={uni.status === 'Approved' ? 'text-emerald-400 font-bold' : uni.status === 'Pending' ? 'text-amber-400 font-bold' : 'text-red-400 font-bold'}>{uni.status}</span></p>
                          </div>
                          <div className="flex gap-2">
                            {uni.status !== 'Approved' && (
                              <button onClick={() => handleAdminAction(uni.id, 'Approved')} className="bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-1.5 rounded-xl text-xs font-semibold">Approve</button>
                            )}
                            <button onClick={() => handleDeleteUniversity(uni.id)} className="bg-red-600 hover:bg-red-500 text-white px-3 py-1.5 rounded-xl text-xs font-semibold">Delete</button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

      </main>

      {/* University Registration Modal */}
      {showRegModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className={`${isDarkMode ? 'bg-gray-950 border-gray-800 text-white' : 'bg-white border-gray-200 text-gray-900'} border rounded-3xl max-w-lg w-full p-6 md:p-8 space-y-6 shadow-2xl animate-fadeIn`}>
            <div className="flex justify-between items-center">
              <div>
                <span className="text-xs bg-blue-500/10 text-blue-400 px-3 py-1 rounded-full border border-blue-500/20 font-bold">Official Onboarding</span>
                <h3 className={`text-xl font-black mt-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Register University Portal</h3>
              </div>
              <button onClick={() => setShowRegModal(false)} className={`text-gray-400 hover:text-white text-lg font-bold ${isDarkMode ? 'bg-gray-900' : 'bg-gray-100'} px-3 py-1 rounded-xl`}>✕</button>
            </div>

            <form onSubmit={handleUniversityRegistration} className="space-y-4">
              <div>
                <label className={`block text-xs font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>University Full Name</label>
                <input 
                  type="text" 
                  value={regUniName}
                  onChange={(e) => setRegUniName(e.target.value)}
                  placeholder="e.g. Delhi University"
                  className={`w-full ${isDarkMode ? 'bg-gray-900 border-gray-800 text-white' : 'bg-gray-50 border-gray-300 text-gray-900'} border rounded-xl p-3 text-xs focus:outline-none`}
                  required 
                />
              </div>
              <div>
                <label className={`block text-xs font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>Location</label>
                <input 
                  type="text" 
                  value={regLocation}
                  onChange={(e) => setRegLocation(e.target.value)}
                  placeholder="e.g. New Delhi, India"
                  className={`w-full ${isDarkMode ? 'bg-gray-900 border-gray-800 text-white' : 'bg-gray-50 border-gray-300 text-gray-900'} border rounded-xl p-3 text-xs focus:outline-none`}
                  required 
                />
              </div>
              <div>
                <label className={`block text-xs font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>Description</label>
                <textarea 
                  value={regDesc}
                  onChange={(e) => setRegDesc(e.target.value)}
                  placeholder="Brief description of the university election council..."
                  className={`w-full ${isDarkMode ? 'bg-gray-900 border-gray-800 text-white' : 'bg-gray-50 border-gray-300 text-gray-900'} border rounded-xl p-3 text-xs focus:outline-none`}
                  rows="2"
                  required 
                />
              </div>
              <div>
                <label className={`block text-xs font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>Eligible Voter Count</label>
                <input 
                  type="text" 
                  value={regEligible}
                  onChange={(e) => setRegEligible(e.target.value)}
                  placeholder="e.g. 20,000+"
                  className={`w-full ${isDarkMode ? 'bg-gray-900 border-gray-800 text-white' : 'bg-gray-50 border-gray-300 text-gray-900'} border rounded-xl p-3 text-xs focus:outline-none`}
                  required 
                />
              </div>
              <div>
                <label className={`block text-xs font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>Upload Verification Document (PDF)</label>
                <input 
                  type="file" 
                  accept=".pdf"
                  onChange={(e) => setRegDoc(e.target.files[0])}
                  className={`w-full ${isDarkMode ? 'bg-gray-900 border-gray-800 text-gray-300' : 'bg-gray-50 border-gray-300 text-gray-700'} border rounded-xl p-2.5 text-xs focus:outline-none`}
                  required 
                />
              </div>

              <button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 text-white py-3 rounded-xl text-xs font-bold shadow-lg mt-2">
                Submit for Verification
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}