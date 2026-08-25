import React, { useState, useEffect } from 'react';
import { auth, googleProvider } from './firebase';
import { signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';

export default function App() {
  const [user, setUser] = useState(null);
  const [currentView, setCurrentView] = useState('home'); // 'home', 'universities', 'admin'
  const [selectedUni, setSelectedUni] = useState(null);
  const [activeTab, setActiveTab] = useState('voting');

  // Mobile Menu State
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // University Internal Admin & Organization States
  const [uniSubView, setUniSubView] = useState('portal'); // 'portal', 'uni-admin-login', 'uni-admin-dashboard', 'org-login', 'org-dashboard'
  
  // University Admin Auth
  const [uniAdminEmail, setUniAdminEmail] = useState('');
  const [uniAdminPassword, setUniAdminPassword] = useState('');
  const [isUniAdminLoggedIn, setIsUniAdminLoggedIn] = useState(false);

  // Organization Auth
  const [orgEmail, setOrgEmail] = useState('');
  const [orgPassword, setOrgPassword] = useState('');
  const [isOrgLoggedIn, setIsOrgLoggedIn] = useState(false);
  const [orgName, setOrgName] = useState('');

  // Global Admin Credentials States
  const [adminUsername, setAdminUsername] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);

  // Admin Document/University Detail Modal State
  const [adminSelectedUni, setAdminSelectedUni] = useState(null);

  const [candidateName, setCandidateName] = useState('');
  const [candidateParty, setCandidateParty] = useState('');

  // University Registration Form States
  const [showRegModal, setShowRegModal] = useState(false);
  const [regUniName, setRegUniName] = useState('');
  const [regLocation, setRegLocation] = useState('');
  const [regDesc, setRegDesc] = useState('');
  const [regEligible, setRegEligible] = useState('');
  const [regDoc, setRegDoc] = useState(null);
  
  // Unique & Clean Universities List with Working Campus Images
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
      image: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=1200&q=80',                candidates: [
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
    if (adminUsername === 'admin' && adminPassword === 'admin123') {
      setIsAdminLoggedIn(true);
      alert("Admin Logged In Successfully!");
    } else {
      alert("Invalid Admin ID or Password!");
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

  const getTotalVotes = (candidates) => {
    const total = candidates.reduce((acc, curr) => acc + curr.votes, 0);
    return total === 0 ? 1 : total;
  };

  return (
    <div className="min-h-screen bg-[#030508] text-gray-100 font-sans relative overflow-hidden selection:bg-blue-500 selection:text-white">
      <div className="absolute top-0 left-1/3 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute top-1/4 right-1/4 w-[400px] h-[400px] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none"></div>

      {/* Navbar */}
      <nav className="p-4 border-b border-gray-800/60 backdrop-blur-xl bg-[#030508]/90 sticky top-0 z-50 shadow-2xl">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="cursor-pointer flex items-center gap-2.5" onClick={() => { setCurrentView('home'); setSelectedUni(null); setUniSubView('portal'); setMobileMenuOpen(false); }}>
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center font-black text-white shadow-lg shadow-blue-600/30">V</div>
            <div>
              <h1 className="text-sm md:text-lg font-black tracking-wider text-white bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">UniVote Pro</h1>
              <p className="text-[8px] md:text-[9px] text-gray-400 tracking-wide font-medium">National Campus Election Portal</p>
            </div>
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-3">
            <button 
              onClick={() => { setCurrentView('home'); setSelectedUni(null); setUniSubView('portal'); }}
              className={`text-sm font-semibold px-3.5 py-1.5 rounded-xl transition ${currentView === 'home' ? 'text-blue-400 bg-blue-950/40 border border-blue-800/40' : 'text-gray-300 hover:text-white'}`}
            >
              Home
            </button>
            <button 
              onClick={() => { setCurrentView('universities'); setSelectedUni(null); setUniSubView('portal'); }}
              className={`text-sm font-semibold px-3.5 py-1.5 rounded-xl transition ${currentView === 'universities' && !selectedUni ? 'text-blue-400 bg-blue-950/40 border border-blue-800/40' : 'text-gray-300 hover:text-white'}`}
            >
              Universities
            </button>
            <button 
              onClick={() => { setCurrentView('admin'); setSelectedUni(null); setUniSubView('portal'); }}
              className={`text-sm font-semibold px-3.5 py-1.5 rounded-xl transition ${currentView === 'admin' ? 'text-blue-400 bg-blue-950/40 border border-blue-800/40' : 'text-gray-300 hover:text-white'}`}
            >
              Admin Panel 🛡️
            </button>

            {user ? (
              <div className="flex items-center gap-2.5 bg-gray-900/90 border border-gray-700/60 px-3 py-1.5 rounded-2xl shadow-xl backdrop-blur-md ml-2">
                <img src={user.photoURL} alt="Profile" className="w-7 h-7 rounded-full border-2 border-blue-500 shadow-md object-cover" />
                <div className="text-left">
                  <p className="text-[11px] font-bold text-white leading-tight">{user.displayName || 'User'}</p>
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
            {user && (
              <img src={user.photoURL} alt="Profile" className="w-8 h-8 rounded-full border-2 border-blue-500 object-cover" />
            )}
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="bg-gray-900 border border-gray-800 text-gray-200 p-2 rounded-xl focus:outline-none"
            >
              {mobileMenuOpen ? '✕' : '☰'}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pt-4 border-t border-gray-800/80 flex flex-col gap-2.5 animate-fadeIn">
            <button 
              onClick={() => { setCurrentView('home'); setSelectedUni(null); setUniSubView('portal'); setMobileMenuOpen(false); }}
              className={`text-left text-sm font-semibold px-4 py-2.5 rounded-xl transition ${currentView === 'home' ? 'text-blue-400 bg-blue-950/40 border border-blue-800/40' : 'text-gray-300 hover:bg-gray-900'}`}
            >
              🏠 Home
            </button>
            <button 
              onClick={() => { setCurrentView('universities'); setSelectedUni(null); setUniSubView('portal'); setMobileMenuOpen(false); }}
              className={`text-left text-sm font-semibold px-4 py-2.5 rounded-xl transition ${currentView === 'universities' && !selectedUni ? 'text-blue-400 bg-blue-950/40 border border-blue-800/40' : 'text-gray-300 hover:bg-gray-900'}`}
            >
              🏛️ Universities
            </button>
            <button 
              onClick={() => { setCurrentView('admin'); setSelectedUni(null); setUniSubView('portal'); setMobileMenuOpen(false); }}
              className={`text-left text-sm font-semibold px-4 py-2.5 rounded-xl transition ${currentView === 'admin' ? 'text-blue-400 bg-blue-950/40 border border-blue-800/40' : 'text-gray-300 hover:bg-gray-900'}`}
            >
              🛡️ Admin Panel
            </button>

            <div className="pt-2 border-t border-gray-800/60 mt-1">
              {user ? (
                <div className="flex flex-col gap-3 bg-gray-950 p-3 rounded-2xl border border-gray-800">
                  <div className="flex items-center gap-2.5">
                    <img src={user.photoURL} alt="Profile" className="w-8 h-8 rounded-full border border-blue-500 object-cover" />
                    <div>
                      <p className="text-xs font-bold text-white">{user.displayName || 'User'}</p>
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
            
            <h1 className="text-4xl md:text-7xl font-black text-white tracking-tight leading-[1.1] bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
              Next-Gen Student Union Elections & Compliance Hub
            </h1>
            
            <p className="text-gray-400 text-sm md:text-base leading-relaxed max-w-2xl mx-auto font-medium">
              Transforming campus democracies with transparent verification routing, secure Google-authenticated balloting, and real-time standing tracking.
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
                className="bg-gray-900/90 hover:bg-gray-800 text-white border border-gray-700/80 px-8 py-4 rounded-2xl font-bold text-sm shadow-xl transition-all hover:scale-105 active:scale-95"
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
                <h2 className="text-3xl font-black text-white">Approved Universities</h2>
                <p className="text-gray-400 text-xs md:text-sm mt-1">Select your approved institution to cast secure ballots.</p>
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
                  className="group relative bg-gradient-to-b from-gray-900/90 to-gray-950/90 border border-gray-800/80 rounded-3xl overflow-hidden flex flex-col justify-between transition-all duration-500 hover:-translate-y-2 hover:border-blue-500/60 hover:shadow-xl backdrop-blur-xl"
                >
                  <div className="relative h-48 w-full overflow-hidden bg-gray-950">
                    <img src={uni.image} alt={uni.name} className="w-full h-full object-cover group-hover:scale-110 transition duration-700" />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/40 to-transparent"></div>
                    <span className="absolute top-4 right-4 text-[10px] bg-emerald-950/90 text-emerald-400 px-3 py-1 rounded-full border border-emerald-800/60 font-semibold tracking-wider backdrop-blur-md">Active</span>
                  </div>

                  <div className="p-6 pt-2">
                    <h3 className="font-bold text-lg text-white mb-1 group-hover:text-blue-400 transition-colors">{uni.name}</h3>
                    <p className="text-xs text-blue-400/90 mb-3 font-medium">📍 {uni.location}</p>
                    <p className="text-xs text-gray-400 mb-6 leading-relaxed line-clamp-2">{uni.desc}</p>
                  
                    <div className="flex justify-between items-center text-xs text-gray-400 mb-4 border-t border-gray-800/80 pt-3">
                      <span>Eligible Voters:</span>
                      <strong className="text-white bg-gray-800/60 px-2.5 py-1 rounded-lg border border-gray-700/50">{uni.eligible}</strong>
                    </div>
                    <button 
                      onClick={() => { setSelectedUni(uni); setActiveTab('voting'); setUniSubView('portal'); }}
                      className="w-full bg-gray-800/80 hover:bg-gradient-to-r hover:from-blue-600 hover:to-indigo-600 text-sm py-3 rounded-xl transition-all font-semibold text-center text-white shadow-lg border border-gray-700/50"
                    >
                      Open Portal →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* VIEW 3: ADMIN LOGIN & DASHBOARD */}
        {currentView === 'admin' && (
          <div>
            {!isAdminLoggedIn ? (
              <div className="max-w-md mx-auto mt-12 bg-gradient-to-b from-gray-900 to-gray-950 border border-gray-800 p-8 rounded-3xl shadow-2xl backdrop-blur-md">
                <div className="text-center mb-6">
                  <span className="text-xs bg-purple-500/15 text-purple-400 px-3 py-1 rounded-full border border-purple-500/30 font-semibold uppercase tracking-widest inline-block mb-2">Restricted Access</span>
                  <h2 className="text-2xl font-black text-white">Admin Portal Login</h2>
                  <p className="text-xs text-gray-400 mt-1">Please authenticate to access document review settings.</p>
                </div>

                <form onSubmit={handleAdminLogin} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-1.5">Admin Username</label>
                    <input 
                      type="text" 
                      value={adminUsername}
                      onChange={(e) => setAdminUsername(e.target.value)}
                      placeholder="Username"
                      className="w-full bg-gray-950 border border-gray-800 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-blue-500"
                      required 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-1.5">Password</label>
                    <input 
                      type="password" 
                      value={adminPassword}
                      onChange={(e) => setAdminPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-gray-950 border border-gray-800 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-blue-500"
                      required 
                    />
                  </div>
                  <button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 text-white py-3.5 rounded-xl text-sm font-bold shadow-lg mt-2">
                    Login
                  </button>
                </form>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-gray-900 p-6 rounded-3xl border border-gray-800 gap-4">
                  <div>
                    <span className="text-xs bg-emerald-500/15 text-emerald-400 px-3 py-1 rounded-full border border-emerald-500/30 font-semibold uppercase tracking-widest inline-block mb-2">Authenticated Session</span>
                    <h2 className="text-2xl font-black text-white">Admin Document Review Dashboard</h2>
                    <p className="text-gray-400 text-xs mt-1">Click on any university name or attached document to view full verification details.</p>
                  </div>
                  <button 
                    onClick={() => setIsAdminLoggedIn(false)}
                    className="bg-red-600/80 hover:bg-red-500 text-white px-4 py-2 rounded-xl text-xs font-semibold transition"
                  >
                    Admin Logout
                  </button>
                </div>

                <div className="space-y-4">
                  {universities.map((uni) => (
                    <div key={uni.id} className="bg-gradient-to-r from-gray-900 to-gray-950 border border-gray-800 p-6 rounded-3xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-xl backdrop-blur-md">
                      <div className="space-y-2">
                        <div className="flex flex-wrap items-center gap-3">
                          <h3 
                            onClick={() => setAdminSelectedUni(uni)}
                            className="text-lg font-bold text-white cursor-pointer hover:text-blue-400 transition"
                          >
                            {uni.name} 🔍
                          </h3>
                          <span className={`text-[10px] px-3 py-1 rounded-full font-bold uppercase tracking-wider ${
                            uni.status === 'Approved' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' :
                            uni.status === 'Rejected' ? 'bg-rose-950 text-rose-400 border border-rose-800' :
                            'bg-amber-950 text-amber-400 border border-amber-800'
                          }`}>
                            {uni.status}
                          </span>
                        </div>
                        <p className="text-xs text-blue-400 font-medium">📍 {uni.location} | Voters: {uni.eligible}</p>
                        <p className="text-xs text-gray-400 max-w-xl">{uni.desc}</p>
                        
                        <div className="flex items-center gap-2 pt-1">
                          <span className="text-xs text-gray-400 font-semibold">Attached Document Bundle:</span>
                          <button 
                            onClick={() => setAdminSelectedUni(uni)}
                            className="text-xs text-blue-400 hover:text-blue-300 underline font-semibold flex items-center gap-1 bg-transparent border-0 cursor-pointer"
                          >
                            📄 {uni.docName || 'Verification_Package.pdf'}
                          </button>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 w-full md:w-auto">
                        <button 
                          onClick={() => handleAdminAction(uni.id, 'Approved')}
                          className="flex-1 md:flex-none bg-emerald-600/90 hover:bg-emerald-500 text-white px-5 py-2.5 rounded-xl text-xs font-bold transition shadow-lg"
                        >
                          Approve ✓
                        </button>
                        <button 
                          onClick={() => handleAdminAction(uni.id, 'Rejected')}
                          className="flex-1 md:flex-none bg-rose-600/90 hover:bg-rose-500 text-white px-5 py-2.5 rounded-xl text-xs font-bold transition shadow-lg"
                        >
                          Reject ✕
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* VIEW 4: SELECTED UNIVERSITY PORTAL WITH SIDEBAR & CAMPUS BANNER IMAGE */}
        {selectedUni && (
          <div className="animate-fadeIn space-y-6">
            <button 
              onClick={() => { setSelectedUni(null); setUniSubView('portal'); }}
              className="text-sm text-blue-400 hover:text-blue-300 hover:-translate-x-1 transition inline-flex items-center gap-1 font-semibold"
            >
              ← Back to Universities
            </button>
            
            {/* University Banner Image Section */}
            <div className="relative h-64 md:h-80 w-full rounded-3xl overflow-hidden border border-gray-800 shadow-2xl bg-gray-950">
              <img src={selectedUni.image} alt={selectedUni.name} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#030508] via-[#030508]/60 to-transparent"></div>
              <div className="absolute bottom-6 left-6 right-6 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                <div>
                  <span className="text-xs bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full border border-blue-500/30 font-semibold uppercase tracking-widest mb-2 inline-block backdrop-blur-md">Institution Portal</span>
                  <h2 className="text-3xl md:text-4xl font-black text-white">{selectedUni.name}</h2>
                  <p className="text-gray-300 text-xs md:text-sm mt-1">📍 {selectedUni.location} • Student Union Election 2026</p>
                </div>
                <div className="bg-gray-900/80 backdrop-blur-md border border-gray-800 px-4 py-2 rounded-2xl text-xs text-gray-300">
                  Eligible Voters: <strong className="text-white">{selectedUni.eligible}</strong>
                </div>
              </div>
            </div>

            {/* Layout with Sidebar & Content Panel */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              
              {/* SIDEBAR NAVIGATION */}
              <div className="lg:col-span-1 bg-gradient-to-b from-gray-900/90 to-gray-950/90 border border-gray-800/80 p-4 rounded-3xl backdrop-blur-xl h-fit space-y-2 shadow-xl">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider px-3 mb-2">Navigation Menu</p>
                
                <button 
                  onClick={() => { setActiveTab('voting'); setUniSubView('portal'); }}
                  className={`w-full text-left px-4 py-3 rounded-2xl text-xs font-bold transition flex items-center gap-3 ${uniSubView === 'portal' && activeTab === 'voting' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30' : 'text-gray-300 hover:bg-gray-800/60 hover:text-white'}`}
                >
                  <span className="text-base">🗳️</span> Voting Booth
                </button>

                <button 
                  onClick={() => { setActiveTab('manager'); setUniSubView('portal'); }}
                  className={`w-full text-left px-4 py-3 rounded-2xl text-xs font-bold transition flex items-center gap-3 ${uniSubView === 'portal' && activeTab === 'manager' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30' : 'text-gray-300 hover:bg-gray-800/60 hover:text-white'}`}
                >
                  <span className="text-base">👥</span> Candidate Manager
                </button>

                <button 
                  onClick={() => setUniSubView(isUniAdminLoggedIn ? 'uni-admin-dashboard' : 'uni-admin-login')}
                  className={`w-full text-left px-4 py-3 rounded-2xl text-xs font-bold transition flex items-center gap-3 ${uniSubView.includes('uni-admin') ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30' : 'text-purple-400 hover:bg-purple-950/30 hover:text-purple-300'}`}
                >
                  <span className="text-base">🛡️</span> Uni Admin Panel
                </button>

                <button 
                  onClick={() => setUniSubView(isOrgLoggedIn ? 'org-dashboard' : 'org-login')}
                  className={`w-full text-left px-4 py-3 rounded-2xl text-xs font-bold transition flex items-center gap-3 ${uniSubView.includes('org') ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30' : 'text-emerald-400 hover:bg-emerald-950/30 hover:text-emerald-300'}`}
                >
                  <span className="text-base">🏛️</span> Organizations Hub
                </button>
              </div>

              {/* MAIN CONTENT AREA */}
              <div className="lg:col-span-3">

                {/* SUB-VIEW 1: VOTING BOOTH */}
                {uniSubView === 'portal' && activeTab === 'voting' && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-bold text-white mb-2">Live Candidates & Standings</h3>
                    {selectedUni.candidates.length === 0 ? (
                      <p className="text-xs text-gray-400 bg-gray-900 p-6 rounded-2xl border border-gray-800">No candidates registered yet.</p>
                    ) : (
                      selectedUni.candidates.map((cand) => {
                        const total = getTotalVotes(selectedUni.candidates);
                        const percentage = Math.round((cand.votes / total) * 100);

                        return (
                          <div key={cand.id} className="bg-gradient-to-b from-gray-900/90 to-gray-950/90 border border-gray-800/80 p-6 rounded-3xl space-y-4 shadow-xl">
                            <div className="flex justify-between items-center">
                              <div>
                                <span className="text-[10px] bg-blue-950/80 text-blue-400 px-3 py-1 rounded-full border border-blue-900/60 font-bold uppercase">Party: {cand.party}</span>
                                <h4 className="font-bold text-lg text-white mt-2">{cand.name}</h4>
                              </div>
                              <button 
                                onClick={() => handleVote(selectedUni.id, cand.id)}
                                className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 text-white px-6 py-2.5 rounded-xl text-sm font-semibold shadow-lg active:scale-95"
                              >
                                Cast Vote
                              </button>
                            </div>
                            <div>
                              <div className="flex justify-between text-xs text-gray-400 mb-1.5 font-medium">
                                <span>Votes: <strong className="text-white">{cand.votes}</strong></span>
                                <span className="text-blue-400 font-bold">{percentage}% Share</span>
                              </div>
                              <div className="w-full bg-gray-950 h-2.5 rounded-full overflow-hidden border border-gray-800">
                                <div className="bg-gradient-to-r from-blue-500 to-indigo-500 h-full rounded-full" style={{ width: `${percentage}%` }}></div>
                              </div>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                )}

                {/* SUB-VIEW 2: CANDIDATE MANAGER */}
                {uniSubView === 'portal' && activeTab === 'manager' && (
                  <div className="bg-gradient-to-b from-gray-900/90 to-gray-950/90 border border-gray-800/80 p-8 rounded-3xl shadow-2xl">
                    <h3 className="text-xl font-bold text-white mb-2">Register New Candidate</h3>
                    <p className="text-xs text-gray-400 mb-6">Add candidate nomination for student union elections.</p>
                    <form onSubmit={handleAddCandidate} className="space-y-4">
                      <div>
                        <label className="block text-xs font-semibold text-gray-300 mb-2">Candidate Name</label>
                        <input 
                          type="text" 
                          value={candidateName}
                          onChange={(e) => setCandidateName(e.target.value)}
                          placeholder="e.g. Amit Sharma"
                          className="w-full bg-gray-950 border border-gray-800 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-blue-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-300 mb-2">Party Name</label>
                        <input 
                          type="text" 
                          value={candidateParty}
                          onChange={(e) => setCandidateParty(e.target.value)}
                          placeholder="e.g. Youth Front"
                          className="w-full bg-gray-950 border border-gray-800 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-blue-500"
                          required
                        />
                      </div>
                      <button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 text-white py-3.5 rounded-xl text-sm font-bold shadow-lg mt-2">
                        Add Candidate
                      </button>
                    </form>
                  </div>
                )}

                {/* SUB-VIEW 3: UNIVERSITY ADMIN LOGIN */}
                {uniSubView === 'uni-admin-login' && (
                  <div className="max-w-md mx-auto bg-gradient-to-b from-gray-900 to-gray-950 border border-purple-500/30 p-8 rounded-3xl shadow-2xl">
                    <div className="text-center mb-6">
                      <span className="text-xs bg-purple-500/15 text-purple-400 px-3 py-1 rounded-full border border-purple-500/30 font-semibold uppercase tracking-widest inline-block mb-2">Institution Control</span>
                      <h3 className="text-2xl font-black text-white">{selectedUni.name} Admin</h3>
                      <p className="text-xs text-gray-400 mt-1">Sign in with university administrative credentials.</p>
                    </div>
                    <form onSubmit={handleUniAdminLoginSubmit} className="space-y-4">
                      <div>
                        <label className="block text-xs font-semibold text-gray-300 mb-1.5">Admin Email</label>
                        <input 
                          type="email" 
                          value={uniAdminEmail}
                          onChange={(e) => setUniAdminEmail(e.target.value)}
                          placeholder="admin@university.edu"
                          className="w-full bg-gray-950 border border-gray-800 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-purple-500"
                          required 
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-300 mb-1.5">Password</label>
                        <input 
                          type="password" 
                          value={uniAdminPassword}
                          onChange={(e) => setUniAdminPassword(e.target.value)}
                          placeholder="••••••••"
                          className="w-full bg-gray-950 border border-gray-800 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-purple-500"
                          required 
                        />
                      </div>
                      <button type="submit" className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 text-white py-3.5 rounded-xl text-sm font-bold shadow-lg mt-2">
                        Login to Uni Admin Panel
                      </button>
                    </form>
                  </div>
                )}

                {/* SUB-VIEW 4: UNIVERSITY ADMIN DASHBOARD */}
                {uniSubView === 'uni-admin-dashboard' && (
                  <div className="bg-gradient-to-b from-gray-900 to-gray-950 border border-purple-500/30 p-8 rounded-3xl shadow-2xl space-y-6">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-gray-800 pb-4 gap-4">
                      <div>
                        <span className="text-xs bg-purple-500/15 text-purple-400 px-3 py-1 rounded-full border border-purple-500/30 font-semibold uppercase tracking-widest inline-block mb-1">Authenticated Admin</span>
                        <h3 className="text-2xl font-black text-white">{selectedUni.name} Management Panel</h3>
                      </div>
                      <button 
                        onClick={() => { setIsUniAdminLoggedIn(false); setUniSubView('uni-admin-login'); }}
                        className="bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-xl text-xs font-semibold transition"
                      >
                        Logout Admin
                      </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-gray-950 p-5 rounded-2xl border border-gray-800">
                        <p className="text-xs text-gray-400 font-semibold">Total Voters Registered</p>
                        <p className="text-2xl font-black text-white mt-1">{selectedUni.eligible}</p>
                      </div>
                      <div className="bg-gray-950 p-5 rounded-2xl border border-gray-800">
                        <p className="text-xs text-gray-400 font-semibold">Active Candidates</p>
                        <p className="text-2xl font-black text-blue-400 mt-1">{selectedUni.candidates.length}</p>
                      </div>
                      <div className="bg-gray-950 p-5 rounded-2xl border border-gray-800">
                        <p className="text-xs text-gray-400 font-semibold">Election Status</p>
                        <p className="text-2xl font-black text-emerald-400 mt-1">Live & Secure</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* SUB-VIEW 5: ORGANIZATION LOGIN */}
                {uniSubView === 'org-login' && (
                  <div className="max-w-md mx-auto bg-gradient-to-b from-gray-900 to-gray-950 border border-emerald-500/30 p-8 rounded-3xl shadow-2xl">
                    <div className="text-center mb-6">
                      <span className="text-xs bg-emerald-500/15 text-emerald-400 px-3 py-1 rounded-full border border-emerald-500/30 font-semibold uppercase tracking-widest inline-block mb-2">Student Body / Party Portal</span>
                      <h3 className="text-2xl font-black text-white">Organization Login</h3>
                      <p className="text-xs text-gray-400 mt-1">Sign in with organization credentials to manage campaign entries.</p>
                    </div>
                    <form onSubmit={handleOrgLoginSubmit} className="space-y-4">
                      <div>
                        <label className="block text-xs font-semibold text-gray-300 mb-1.5">Organization Email</label>
                        <input 
                          type="email" 
                          value={orgEmail}
                          onChange={(e) => setOrgEmail(e.target.value)}
                          placeholder="youthfront@org.com"
                          className="w-full bg-gray-950 border border-gray-800 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-emerald-500"
                          required 
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-300 mb-1.5">Password</label>
                        <input 
                          type="password" 
                          value={orgPassword}
                          onChange={(e) => setOrgPassword(e.target.value)}
                          placeholder="••••••••"
                          className="w-full bg-gray-950 border border-gray-800 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-emerald-500"
                          required 
                        />
                      </div>
                      <button type="submit" className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 text-white py-3.5 rounded-xl text-sm font-bold shadow-lg mt-2">
                        Login to Organization Portal
                      </button>
                    </form>
                  </div>
                )}

                {/* SUB-VIEW 6: ORGANIZATION DASHBOARD */}
                {uniSubView === 'org-dashboard' && (
                  <div className="bg-gradient-to-b from-gray-900 to-gray-950 border border-emerald-500/30 p-8 rounded-3xl shadow-2xl space-y-6">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-gray-800 pb-4 gap-4">
                      <div>
                        <span className="text-xs bg-emerald-500/15 text-emerald-400 px-3 py-1 rounded-full border border-emerald-500/30 font-semibold uppercase tracking-widest inline-block mb-1">Organization Dashboard</span>
                        <h3 className="text-2xl font-black text-white">{orgName} Party Hub</h3>
                      </div>
                      <button 
                        onClick={() => { setIsOrgLoggedIn(false); setUniSubView('org-login'); }}
                        className="bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-xl text-xs font-semibold transition"
                      >
                        Logout Org
                      </button>
                    </div>

                    <div className="max-w-xl space-y-4">
                      <h4 className="text-sm font-bold text-white">Register Candidate under {orgName}</h4>
                      <form onSubmit={handleAddCandidate} className="space-y-4">
                        <div>
                          <label className="block text-xs font-semibold text-gray-300 mb-2">Candidate Name</label>
                          <input 
                            type="text" 
                            value={candidateName}
                            onChange={(e) => setCandidateName(e.target.value)}
                            placeholder="e.g. Rahul Sharma"
                            className="w-full bg-gray-950 border border-gray-800 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-emerald-500"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-gray-300 mb-2">Party Affiliation</label>
                          <input 
                            type="text" 
                            value={candidateParty}
                            onChange={(e) => setCandidateParty(e.target.value)}
                            placeholder={orgName}
                            className="w-full bg-gray-950 border border-gray-800 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-emerald-500"
                            required
                          />
                        </div>
                        <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-500 text-white py-3.5 rounded-xl text-sm font-bold shadow-lg">
                          Submit Candidate Nomination
                        </button>
                      </form>
                    </div>
                  </div>
                )}

              </div>
            </div>

          </div>
        )}

      </main>

      {/* ADMIN UNIVERSITY & DOCUMENT DETAIL MODAL */}
      {adminSelectedUni && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 border border-gray-800 p-6 md:p-8 rounded-3xl max-w-xl w-full shadow-2xl relative space-y-4">
            <button onClick={() => setAdminSelectedUni(null)} className="absolute top-5 right-5 text-gray-400 hover:text-white text-lg font-bold">✕</button>

            <div>
              <span className="text-xs bg-blue-500/15 text-blue-400 px-3 py-1 rounded-full border border-blue-500/30 font-semibold uppercase tracking-widest inline-block mb-2">University Full Details</span>
              <h3 className="text-2xl font-black text-white">{adminSelectedUni.name}</h3>
              <p className="text-xs text-blue-400 mt-1 font-medium">📍 {adminSelectedUni.location}</p>
            </div>

            <div className="bg-gray-950 p-4 rounded-2xl border border-gray-800 space-y-3">
              <div>
                <p className="text-[11px] text-gray-400 font-semibold">Description:</p>
                <p className="text-xs text-gray-200 mt-0.5">{adminSelectedUni.desc}</p>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-gray-800/80">
                <span className="text-[11px] text-gray-400 font-semibold">Eligible Voters:</span>
                <span className="text-xs text-white font-bold">{adminSelectedUni.eligible}</span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-gray-800/80">
                <span className="text-[11px] text-gray-400 font-semibold">Current Status:</span>
                <span className="text-xs text-emerald-400 font-bold uppercase">{adminSelectedUni.status}</span>
              </div>
            </div>

            <div className="bg-gray-950 p-4 rounded-2xl border border-gray-800 space-y-2">
              <p className="text-[11px] text-gray-400 font-semibold">Attached Verification Bundle:</p>
              <div className="flex items-center justify-between bg-gray-900 p-3 rounded-xl border border-gray-800">
                <span className="text-xs text-blue-400 font-medium">📄 {adminSelectedUni.docName || 'Verification_Document.pdf'}</span>
                <button 
                  onClick={() => alert("Downloading / Viewing document: " + (adminSelectedUni.docName || 'Document.pdf'))}
                  className="bg-blue-600 hover:bg-blue-500 text-white px-3 py-1.5 rounded-lg text-xs font-semibold transition"
                >
                  View / Download
                </button>
              </div>
            </div>

            <button 
              onClick={() => setAdminSelectedUni(null)} 
              className="w-full bg-gray-800 hover:bg-gray-700 text-white py-3 rounded-xl text-xs font-bold transition mt-2"
            >
              Close Details
            </button>
          </div>
        </div>
      )}

      {/* REGISTRATION MODAL */}
      {showRegModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 border border-gray-800 p-6 md:p-8 rounded-3xl max-w-2xl w-full shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button onClick={() => setShowRegModal(false)} className="absolute top-5 right-5 text-gray-400 hover:text-white text-lg font-bold">✕</button>

            <h3 className="text-2xl font-black text-white mb-1">Register Your University</h3>
            <p className="text-xs text-gray-400 mb-6">Complete state & UGC route documentation setup for establishing a private university.</p>

            <form onSubmit={handleUniversityRegistration} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1.5">University Name</label>
                  <input type="text" value={regUniName} onChange={(e) => setRegUniName(e.target.value)} placeholder="e.g. Jharkhand State University" className="w-full bg-gray-950 border border-gray-800 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-blue-500" required />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1.5">Location</label>
                  <input type="text" value={regLocation} onChange={(e) => setRegLocation(e.target.value)} placeholder="e.g. Ranchi, Jharkhand" className="w-full bg-gray-950 border border-gray-800 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-blue-500" required />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1.5">Description</label>
                <textarea value={regDesc} onChange={(e) => setRegDesc(e.target.value)} placeholder="Brief description..." rows="2" className="w-full bg-gray-950 border border-gray-800 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-blue-500 resize-none" required></textarea>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1.5">Eligible Voters Count</label>
                <input type="text" value={regEligible} onChange={(e) => setRegEligible(e.target.value)} placeholder="e.g. 40,000+" className="w-full bg-gray-950 border border-gray-800 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-blue-500" required />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1.5">Upload Verification Bundle (PDF / ZIP)</label>
                <input type="file" onChange={(e) => setRegDoc(e.target.files[0])} className="w-full bg-gray-950 border border-gray-800 rounded-xl p-2.5 text-xs text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-blue-600 file:text-white" required />
              </div>

              <button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 text-white py-3.5 rounded-xl text-sm font-bold shadow-lg mt-2">
                Submit for Admin Approval
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}