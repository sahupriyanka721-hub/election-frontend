import React, { useState, useEffect } from 'react';
import { auth, googleProvider } from './firebase';
import { signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';

export default function App() {
  const [user, setUser] = useState(null);
  const [currentView, setCurrentView] = useState('home'); // 'home', 'universities', 'register-uni', 'admin-login', 'admin-panel'
  const [selectedUni, setSelectedUni] = useState(null);
  const [activeTab, setActiveTab] = useState('portal'); // 'portal', 'voting', 'student-portal', 'manager', 'documents', 'uni-admin'

  // Theme State ('dark' or 'light')
  const [theme, setTheme] = useState('dark');

  // Global Admin Login States (Email & Password)
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);

  // University-Specific Internal Admin Login States
  const [uniAdminUser, setUniAdminUser] = useState('');
  const [uniAdminPass, setUniAdminPass] = useState('');
  const [isUniAdminLoggedIn, setIsUniAdminLoggedIn] = useState(false);

  // University Registration Form States (Sponsoring Body -> State Govt -> UGC)
  const [regUniName, setRegUniName] = useState('');
  const [regLocation, setRegLocation] = useState('');
  const [regTrustDeed, setRegTrustDeed] = useState('');
  const [regPan, setRegPan] = useState('');
  const [regLandDoc, setRegLandDoc] = useState('');
  const [regCorpusFund, setRegCorpusFund] = useState('');
  const [registeredApplications, setRegisteredApplications] = useState([
    { id: 1, name: 'Jharkhand Technical University', location: 'Ranchi, Jharkhand', status: 'Pending Approval', trust: 'JTU Educational Trust' }
  ]);

  // Form states for Candidate Manager
  const [candidateName, setCandidateName] = useState('');
  const [candidateParty, setCandidateParty] = useState('');

  // Student Document Verification Upload States (File upload support & submissions list)
  const [aadhaarFile, setAadhaarFile] = useState('');
  const [panFile, setPanFile] = useState('');
  const [tenthFile, setTenthFile] = useState('');
  const [twelfthFile, setTwelfthFile] = useState('');
  const [charCertFile, setCharCertFile] = useState('');
  const [docSubmitted, setDocSubmitted] = useState(false);

  // Centralized storage for student document submissions per university
  const [submittedSubmissions, setSubmittedSubmissions] = useState([
    {
      id: 101,
      uniId: 'graphic-era',
      studentName: 'Aarav Sharma',
      studentEmail: 'aarav@student.com',
      aadhaar: 'Aadhaar_Verified.pdf',
      pan: 'PAN_Card.pdf',
      tenth: '10th_Marksheet.pdf',
      twelfth: '12th_Marksheet.pdf',
      charCert: 'Character_Certificate.pdf',
      status: 'Pending Verification'
    }
  ]);

  // Student Marks Management States
  const [studentMarks, setStudentMarks] = useState([
    { id: 1, subject: 'Data Structures & Algorithms', marks: '88/100', grade: 'A+' },
    { id: 2, subject: 'Database Management Systems', marks: '82/100', grade: 'A' },
    { id: 3, subject: 'Software Engineering', marks: '90/100', grade: 'O' }
  ]);
  const [newSubject, setNewSubject] = useState('');
  const [newMarks, setNewMarks] = useState('');
  const [newGrade, setNewGrade] = useState('');

  // Unique Universities Data (No Duplicates)
  const [universities, setUniversities] = useState([
    { 
      id: 'graphic-era', 
      name: 'Graphic Era University', 
      location: 'Dehradun, Uttarakhand', 
      desc: 'Graphic Era (Deemed to be University) student union election & management portal.', 
      eligible: '18,500+',
      status: 'Approved',
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
      image: 'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=1200&q=80',
      candidates: [
        { id: 1, name: 'Aditya Roy', party: 'Youth Front', votes: 150 }
      ]
    },
    { 
      id: 'lpu', 
      name: 'Lovely Professional University', 
      location: 'Phagwara, Punjab', 
      desc: 'Official Campus Senate Election & Organisation Portal.', 
      eligible: '35,000+',
      status: 'Approved',
      image: 'https://images.unsplash.com/photo-1595535373655-4b9c2aae42d1?q=80&w=938&auto=format&fit=crop',
      candidates: [
        { id: 1, name: 'Simran Kaur', party: 'Panther Group', votes: 210 },
        { id: 2, name: 'Rohit Gupta', party: 'Students Voice', votes: 180 }
      ]
    }
  ]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      }
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
      setUser(null);
    } catch (error) {
      setUser(null);
    }
  };

  const handleAdminLogin = (e) => {
    e.preventDefault();
    if (adminEmail === 'admin@univote.com' && adminPassword === 'Admin@1234') {
      setIsAdminLoggedIn(true);
      setCurrentView('admin-panel');
      alert("Admin logged in successfully!");
    } else {
      alert("Invalid Admin Credentials!");
    }
  };

  const handleUniAdminLogin = (e) => {
    e.preventDefault();
    if (uniAdminUser === 'uniorg@univote.com' && uniAdminPass === 'Uni@1234') {
      setIsUniAdminLoggedIn(true);
      alert("University Admin Logged In Successfully!");
    } else {
      alert("Invalid credentials! Use: uniorg@univote.com / Uni@1234");
    }
  };

  const handleUniversityRegistration = (e) => {
    e.preventDefault();
    if (!regUniName || !regTrustDeed || !regPan) {
      alert("Please fill in mandatory fields.");
      return;
    }
    const newApp = {
      id: Date.now(),
      name: regUniName,
      location: regLocation || 'India',
      status: 'Pending Approval',
      trust: regTrustDeed
    };
    setRegisteredApplications([...registeredApplications, newApp]);
    alert("University registration submitted successfully through Sponsoring Body → State Govt → UGC route!");
    setRegUniName('');
    setRegTrustDeed('');
    setRegPan('');
    setRegLandDoc('');
    setRegCorpusFund('');
    setCurrentView('universities');
  };

  const handleApproveUni = (id) => {
    setRegisteredApplications(registeredApplications.map(app => {
      if (app.id === id) {
        const approvedItem = { ...app, status: 'Approved', id: 'uni-' + Date.now(), image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1200&q=80', desc: 'Newly approved university through regulatory pathway.', candidates: [] };
        setUniversities([...universities, approvedItem]);
        return { ...app, status: 'Approved' };
      }
      return app;
    }));
    alert("University approved and added to active network!");
  };

  const handleVote = (uniId, candidateId) => {
    // Fallback auth check: checking state and direct auth.currentUser
    const activeUser = user || auth.currentUser;
    if (!activeUser) {
      const guestName = prompt("Please enter your name to cast your vote (or sign in with Google):");
      if (!guestName) return;
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
    if (!candidateName.trim() || !candidateParty.trim()) return;

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

  const handleAddMark = (e) => {
    e.preventDefault();
    if (!newSubject || !newMarks || !newGrade) return;
    const item = { id: Date.now(), subject: newSubject, marks: newMarks, grade: newGrade };
    setStudentMarks([...studentMarks, item]);
    setNewSubject('');
    setNewMarks('');
    setNewGrade('');
    alert("Student marks updated successfully!");
  };

  const handleDocumentSubmit = (e) => {
    e.preventDefault();
    const activeUser = user || auth.currentUser;
    const studentIdentifier = activeUser ? (activeUser.displayName || activeUser.email) : 'Verified Student';

    const newSub = {
      id: Date.now(),
      uniId: selectedUni.id,
      studentName: studentIdentifier,
      studentEmail: activeUser?.email || 'student@univote.com',
      aadhaar: aadhaarFile || 'Aadhaar.pdf',
      pan: panFile || 'PAN.pdf',
      tenth: tenthFile || '10th_Marksheet.pdf',
      twelfth: twelfthFile || '12th_Marksheet.pdf',
      charCert: charCertFile || 'Character_Cert.pdf',
      status: 'Pending Verification'
    };
    setSubmittedSubmissions([...submittedSubmissions, newSub]);
    setDocSubmitted(true);
    alert("All verification documents uploaded and sent to University Admin successfully!");
  };

  const handleDocAction = (subId, statusAction) => {
    setSubmittedSubmissions(submittedSubmissions.map(sub => sub.id === subId ? { ...sub, status: statusAction } : sub));
    alert(`Document status updated to: ${statusAction}`);
  };

  const isDark = theme === 'dark';

  return (
    <div className={`min-h-screen font-sans relative transition-all duration-300 ${isDark ? 'bg-[#05070c] text-gray-100' : 'bg-gray-50 text-gray-900'}`}>
      
      {/* Navbar */}
      <nav className={`p-4 border-b sticky top-0 z-50 backdrop-blur-md ${isDark ? 'border-gray-800/80 bg-[#05070c]/80' : 'border-gray-200 bg-white/80'}`}>
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="cursor-pointer flex items-center gap-2" onClick={() => { setCurrentView('home'); setSelectedUni(null); }}>
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white font-bold text-sm shadow-md">U</div>
            <div>
              <h1 className="text-base font-extrabold tracking-tight">UniVote Pro</h1>
              <p className="text-[9px] text-gray-400">National University & Election Portal</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <button onClick={() => setCurrentView('register-uni')} className="hidden md:block bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 px-3 py-1.5 rounded-xl text-xs font-semibold text-white shadow-md transition">
              🏛️ Register as University
            </button>
            <button onClick={() => setCurrentView('admin-login')} className="bg-gray-800 hover:bg-gray-700 px-3 py-1.5 rounded-xl text-xs font-medium text-gray-300 border border-gray-700 transition">
              🔐 Admin Portal
            </button>
            <button onClick={toggleTheme} className="p-2 rounded-xl border border-gray-700 bg-gray-900/50 text-yellow-400 text-xs transition">
              {isDark ? '☀️' : '🌙'}
            </button>
            {user ? (
              <div className="flex items-center gap-2 bg-gray-900/80 border border-gray-800 px-3 py-1 rounded-xl">
                <span className="text-xs text-gray-300 font-medium">{user.displayName}</span>
                <button onClick={handleLogout} className="bg-red-600 hover:bg-red-500 px-2 py-1 rounded-lg text-[10px] text-white font-bold">Logout</button>
              </div>
            ) : (
              <button onClick={handleGoogleLogin} className="bg-blue-600 hover:bg-blue-500 px-4 py-1.5 rounded-xl text-xs font-bold text-white shadow-lg transition">
                Sign in with Google
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* Main Container */}
      <main className="p-6 max-w-7xl mx-auto">

        {/* 1. Enhanced Landing Page */}
        {currentView === 'home' && !selectedUni && (
          <div className="py-12 space-y-12">
            <div className="text-center space-y-4 max-w-3xl mx-auto">
              <span className="bg-blue-500/10 text-blue-400 text-[11px] font-bold px-3 py-1 rounded-full border border-blue-500/20">
                Official Campus & Regulatory Framework
              </span>
              <h2 className="text-5xl font-extrabold tracking-tight bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
                Empowering Higher Education & Democratic Elections
              </h2>
              <p className="text-gray-400 text-sm leading-relaxed">
                A secure unified platform for university registration via Sponsoring Body, State Govt & UGC route, document verification, student record management, and digital campus elections.
              </p>
              <div className="flex justify-center gap-4 pt-4">
                <button onClick={() => setCurrentView('universities')} className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-2xl font-bold text-sm shadow-xl transition">
                  Explore Universities & Portals →
                </button>
                <button onClick={() => setCurrentView('register-uni')} className="bg-gray-900 hover:bg-gray-800 border border-gray-700 text-white px-6 py-3 rounded-2xl font-bold text-sm shadow-xl transition">
                  🏛️ Register New University
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
              <div className="bg-gradient-to-b from-gray-900 to-gray-950 border border-gray-800/80 p-6 rounded-3xl shadow-xl transition-all duration-300 hover:-translate-y-2 group">
                <div className="w-12 h-12 rounded-2xl bg-blue-600/20 text-blue-400 flex items-center justify-center font-bold text-xl mb-4">🏛️</div>
                <h3 className="text-lg font-bold text-white mb-2">University Setup Route</h3>
                <p className="text-xs text-gray-400 leading-relaxed">Sponsoring Body (Trust/Society) → State Govt → UGC Compliance workflow with automated document verification.</p>
              </div>
              <div className="bg-gradient-to-b from-gray-900 to-gray-950 border border-gray-800/80 p-6 rounded-3xl shadow-xl transition-all duration-300 hover:-translate-y-2 group">
                <div className="w-12 h-12 rounded-2xl bg-emerald-600/20 text-emerald-400 flex items-center justify-center font-bold text-xl mb-4">🗳️</div>
                <h3 className="text-lg font-bold text-white mb-2">Campus Voting Booth</h3>
                <p className="text-xs text-gray-400 leading-relaxed">Secure, authenticated student voting booths for annual student union elections with live vote tracking.</p>
              </div>
              <div className="bg-gradient-to-b from-gray-900 to-gray-950 border border-gray-800/80 p-6 rounded-3xl shadow-xl transition-all duration-300 hover:-translate-y-2 group">
                <div className="w-12 h-12 rounded-2xl bg-purple-600/20 text-purple-400 flex items-center justify-center font-bold text-xl mb-4">📊</div>
                <h3 className="text-lg font-bold text-white mb-2">Student Portal & Records</h3>
                <p className="text-xs text-gray-400 leading-relaxed">Dedicated student dashboards to manage subject-wise marks, academic results, and verification credentials.</p>
              </div>
            </div>
          </div>
        )}

        {/* 2. Universities List View */}
        {currentView === 'universities' && !selectedUni && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold tracking-tight">Approved Universities & Campuses</h2>
                <p className="text-xs text-gray-400 mt-1">Select an institution to access its dedicated portal and voting booth.</p>
              </div>
              <button onClick={() => setCurrentView('home')} className="text-xs text-blue-400 hover:underline">← Back to Home</button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {universities.map(uni => (
                <div key={uni.id} className="bg-gray-900/90 border border-gray-800 rounded-3xl overflow-hidden shadow-xl transition-all duration-300 hover:-translate-y-2 flex flex-col justify-between group">
                  <div>
                    <div className="h-44 overflow-hidden relative">
                      <img src={uni.image} alt={uni.name} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                      <span className="absolute top-3 right-3 bg-emerald-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-full">{uni.status}</span>
                    </div>
                    <div className="p-5">
                      <h3 className="font-bold text-lg text-white mb-1">{uni.name}</h3>
                      <p className="text-xs text-blue-400 font-medium mb-2">📍 {uni.location}</p>
                      <p className="text-xs text-gray-400 line-clamp-2">{uni.desc}</p>
                    </div>
                  </div>
                  <div className="p-5 pt-0">
                    <button onClick={() => { setSelectedUni(uni); setActiveTab('portal'); }} className="w-full bg-blue-600 hover:bg-blue-500 text-white py-2.5 rounded-xl text-xs font-bold shadow-md transition">
                      Open University Portal →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 3. University Registration Form */}
        {currentView === 'register-uni' && (
          <div className="max-w-3xl mx-auto bg-gray-900/90 border border-gray-800 p-8 rounded-3xl shadow-2xl space-y-6">
            <div className="flex justify-between items-center border-b border-gray-800 pb-4">
              <div>
                <h2 className="text-2xl font-bold text-white">University Registration Portal</h2>
                <p className="text-xs text-gray-400 mt-1">Sponsoring Body → State Govt → UGC Setup Route Application Form</p>
              </div>
              <button onClick={() => setCurrentView('home')} className="text-xs text-blue-400 hover:underline">Cancel</button>
            </div>

            <form onSubmit={handleUniversityRegistration} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">University Name</label>
                  <input type="text" value={regUniName} onChange={(e) => setRegUniName(e.target.value)} placeholder="e.g. Apex International University" className="w-full bg-gray-950 border border-gray-800 rounded-xl p-3 text-sm text-white outline-none" required />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">Location (State / City)</label>
                  <input type="text" value={regLocation} onChange={(e) => setRegLocation(e.target.value)} placeholder="e.g. Ranchi, Jharkhand" className="w-full bg-gray-950 border border-gray-800 rounded-xl p-3 text-sm text-white outline-none" required />
                </div>
              </div>

              <div className="space-y-4 pt-2">
                <h3 className="text-sm font-bold text-blue-400 uppercase tracking-wider">A. Sponsoring Body Documents</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input type="text" value={regTrustDeed} onChange={(e) => setRegTrustDeed(e.target.value)} placeholder="Trust Deed / Society Reg. Number" className="w-full bg-gray-950 border border-gray-800 rounded-xl p-3 text-sm text-white" required />
                  <input type="text" value={regPan} onChange={(e) => setRegPan(e.target.value)} placeholder="Trust PAN Number" className="w-full bg-gray-950 border border-gray-800 rounded-xl p-3 text-sm text-white" required />
                </div>

                <h3 className="text-sm font-bold text-blue-400 uppercase tracking-wider pt-2">B. Land & Infrastructure (Min 50 Acres)</h3>
                <input type="text" value={regLandDoc} onChange={(e) => setRegLandDoc(e.target.value)} placeholder="Sale Deed / CLU Certificate Link or Ref" className="w-full bg-gray-950 border border-gray-800 rounded-xl p-3 text-sm text-white" required />

                <h3 className="text-sm font-bold text-blue-400 uppercase tracking-wider pt-2">C. Financial Documents</h3>
                <input type="text" value={regCorpusFund} onChange={(e) => setRegCorpusFund(e.target.value)} placeholder="Corpus Fund Proof (Rs 25 Cr FD Ref)" className="w-full bg-gray-950 border border-gray-800 rounded-xl p-3 text-sm text-white" required />
              </div>

              <button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 py-3.5 rounded-xl font-bold text-sm text-white shadow-lg transition">
                Submit Application for State & UGC Review
              </button>
            </form>
          </div>
        )}

        {/* 4. Admin Login Portal */}
        {currentView === 'admin-login' && !isAdminLoggedIn && (
          <div className="max-w-md mx-auto bg-gray-900 border border-gray-800 p-8 rounded-3xl shadow-2xl space-y-6 my-12">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-blue-600/20 text-blue-400 rounded-2xl mx-auto flex items-center justify-center font-bold text-xl">🔐</div>
              <h2 className="text-xl font-bold text-white">Global Admin Secure Login</h2>
              <p className="text-xs text-gray-400">Enter admin credentials to manage university approvals.</p>
            </div>
            <form onSubmit={handleAdminLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">Admin Email ID</label>
                <input type="email" value={adminEmail} onChange={(e) => setAdminEmail(e.target.value)} placeholder="admin@univote.com" className="w-full bg-gray-950 border border-gray-800 rounded-xl p-3 text-sm text-white" required />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">Password</label>
                <input type="password" value={adminPassword} onChange={(e) => setAdminPassword(e.target.value)} placeholder="••••••••" className="w-full bg-gray-950 border border-gray-800 rounded-xl p-3 text-sm text-white" required />
              </div>
              <button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 py-3 rounded-xl font-bold text-sm text-white shadow-md transition">
                Login as Global Admin
              </button>
              <div className="text-center pt-2">
                <button type="button" onClick={() => setCurrentView('home')} className="text-xs text-gray-400 hover:text-white">← Return to Home</button>
              </div>
            </form>
          </div>
        )}

        {/* 5. Admin Dashboard */}
        {currentView === 'admin-panel' && isAdminLoggedIn && (
          <div className="space-y-6">
            <div className="flex justify-between items-center border-b border-gray-800 pb-4">
              <div>
                <h2 className="text-2xl font-bold text-white">Global Admin Control Panel</h2>
                <p className="text-xs text-gray-400">Review sponsoring body documents and approve university applications.</p>
              </div>
              <button onClick={() => { setIsAdminLoggedIn(false); setCurrentView('home'); }} className="bg-red-600/20 text-red-400 px-3 py-1.5 rounded-xl text-xs font-bold border border-red-500/30">Logout Admin</button>
            </div>

            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 space-y-4">
              <h3 className="text-lg font-bold text-white">Pending University Applications</h3>
              <div className="space-y-3">
                {registeredApplications.map(app => (
                  <div key={app.id} className="bg-gray-950 border border-gray-800 p-4 rounded-xl flex justify-between items-center">
                    <div>
                      <h4 className="font-bold text-white text-sm">{app.name}</h4>
                      <p className="text-xs text-blue-400">📍 {app.location} | Trust: {app.trust}</p>
                      <p className="text-[11px] text-gray-400 mt-1">Status: <span className="text-amber-400 font-semibold">{app.status}</span></p>
                    </div>
                    {app.status === 'Pending Approval' ? (
                      <button onClick={() => handleApproveUni(app.id)} className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-md">
                        Approve & Publish
                      </button>
                    ) : (
                      <span className="text-xs font-bold text-emerald-400">✓ Approved</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 6. University Interface & Dashboard with Sidebar */}
        {selectedUni && (
          <div className="space-y-6">
            <button onClick={() => setSelectedUni(null)} className="text-xs text-blue-400 hover:underline">← Back to Universities</button>
            
            <div className="relative h-56 rounded-3xl overflow-hidden shadow-2xl border border-gray-800 flex items-end p-6">
              <div className="absolute inset-0 bg-cover bg-center filter brightness-50" style={{ backgroundImage: `url(${selectedUni.image})` }}></div>
              <div className="absolute inset-0 bg-gradient-to-t from-[#05070c] via-transparent to-transparent"></div>
              <div className="relative z-10">
                <span className="bg-blue-600 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">Active Campus</span>
                <h2 className="text-3xl font-extrabold text-white mt-2">{selectedUni.name}</h2>
                <p className="text-xs text-gray-300">📍 {selectedUni.location} • Eligible Voters: {selectedUni.eligible}</p>
              </div>
            </div>

            {/* University Portal Layout (Sidebar + Content) */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              
              {/* Sidebar Options */}
              <div className="bg-gray-900/90 border border-gray-800 p-4 rounded-2xl space-y-2 h-fit shadow-xl">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider px-3 pb-2">University Menu</p>
                <button onClick={() => setActiveTab('portal')} className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-semibold transition ${activeTab === 'portal' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-300 hover:bg-gray-800'}`}>
                  🏠 University Overview
                </button>
                <button onClick={() => setActiveTab('voting')} className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-semibold transition ${activeTab === 'voting' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-300 hover:bg-gray-800'}`}>
                  🗳️ Voting Booth
                </button>
                <button onClick={() => setActiveTab('student-portal')} className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-semibold transition ${activeTab === 'student-portal' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-300 hover:bg-gray-800'}`}>
                  🎓 Student Portal & Marks
                </button>
                <button onClick={() => setActiveTab('documents')} className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-semibold transition ${activeTab === 'documents' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-300 hover:bg-gray-800'}`}>
                  📄 Document Verification
                </button>
                <button onClick={() => setActiveTab('uni-admin')} className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-semibold transition ${activeTab === 'uni-admin' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-300 hover:bg-gray-800'}`}>
                  🛡️ Uni Admin Panel (View Docs)
                </button>
                <button onClick={() => setActiveTab('manager')} className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-semibold transition ${activeTab === 'manager' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-300 hover:bg-gray-800'}`}>
                  🏛️ Organisation Panel
                </button>
              </div>

              {/* Main Content Area */}
              <div className="md:col-span-3 space-y-6">

                {/* Overview Tab */}
                {activeTab === 'portal' && (
                  <div className="bg-gray-900 border border-gray-800 p-6 rounded-2xl space-y-4 shadow-xl">
                    <h3 className="text-xl font-bold text-white">Welcome to {selectedUni.name} Portal</h3>
                    <p className="text-xs text-gray-300 leading-relaxed">{selectedUni.desc}</p>
                    <div className="grid grid-cols-2 gap-4 pt-4">
                      <div className="bg-gray-950 p-4 rounded-xl border border-gray-800">
                        <p className="text-[10px] text-gray-400 font-semibold uppercase">Total Registered Candidates</p>
                        <p className="text-2xl font-extrabold text-blue-400 mt-1">{selectedUni.candidates.length}</p>
                      </div>
                      <div className="bg-gray-950 p-4 rounded-xl border border-gray-800">
                        <p className="text-[10px] text-gray-400 font-semibold uppercase">Verification Status</p>
                        <p className="text-2xl font-extrabold text-emerald-400 mt-1">Verified</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Voting Booth Tab */}
                {activeTab === 'voting' && (
                  <div className="space-y-4">
                    <h3 className="text-xl font-bold text-white">Active Election Candidates</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {selectedUni.candidates.map(cand => (
                        <div key={cand.id} className="bg-gray-900 border border-gray-800 p-5 rounded-2xl flex justify-between items-center shadow-lg">
                          <div>
                            <h4 className="font-bold text-white text-base">{cand.name}</h4>
                            <p className="text-xs text-blue-400 font-medium">Party: {cand.party}</p>
                            <p className="text-xs text-gray-400 mt-1">Current Votes: <span className="font-bold text-white">{cand.votes}</span></p>
                          </div>
                          <button onClick={() => handleVote(selectedUni.id, cand.id)} className="bg-emerald-600 hover:bg-emerald-500 px-4 py-2 rounded-xl text-xs font-bold text-white shadow-md transition">
                            Vote Now
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Student Portal & Marks Update Interface */}
                {activeTab === 'student-portal' && (
                  <div className="space-y-6">
                    <div className="bg-gray-900 border border-gray-800 p-6 rounded-2xl shadow-xl space-y-4">
                      <h3 className="text-xl font-bold text-white">Student Academic Results & Marks</h3>
                      <p className="text-xs text-gray-400">View and update latest subject-wise grades and marks.</p>
                      
                      <div className="space-y-2 pt-2">
                        {studentMarks.map(m => (
                          <div key={m.id} className="bg-gray-950 border border-gray-800 p-3.5 rounded-xl flex justify-between items-center">
                            <div>
                              <h4 className="font-semibold text-white text-sm">{m.subject}</h4>
                              <p className="text-xs text-gray-400">Marks: {m.marks}</p>
                            </div>
                            <span className="bg-blue-600/20 text-blue-400 border border-blue-500/30 px-3 py-1 rounded-lg text-xs font-bold">
                              Grade: {m.grade}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-gray-900 border border-gray-800 p-6 rounded-2xl shadow-xl space-y-4">
                      <h3 className="text-lg font-bold text-white">Update / Add Subject Marks</h3>
                      <form onSubmit={handleAddMark} className="space-y-3">
                        <input type="text" value={newSubject} onChange={(e) => setNewSubject(e.target.value)} placeholder="Subject Name (e.g. Operating Systems)" className="w-full bg-gray-950 border border-gray-800 rounded-xl p-3 text-sm text-white" required />
                        <div className="grid grid-cols-2 gap-3">
                          <input type="text" value={newMarks} onChange={(e) => setNewMarks(e.target.value)} placeholder="Marks (e.g. 85/100)" className="w-full bg-gray-950 border border-gray-800 rounded-xl p-3 text-sm text-white" required />
                          <input type="text" value={newGrade} onChange={(e) => setNewGrade(e.target.value)} placeholder="Grade (e.g. A+)" className="w-full bg-gray-950 border border-gray-800 rounded-xl p-3 text-sm text-white" required />
                        </div>
                        <button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 py-2.5 rounded-xl font-bold text-sm text-white shadow-md">
                          Add / Update Marks
                        </button>
                      </form>
                    </div>
                  </div>
                )}

                {/* Document Verification Tab */}
                {activeTab === 'documents' && (
                  <div className="bg-gray-900 border border-gray-800 p-6 rounded-2xl shadow-xl space-y-4">
                    <h3 className="text-xl font-bold text-white">Student Verification Document Portal</h3>
                    <p className="text-xs text-gray-400">Upload your identity and academic certificates for {selectedUni.name}.</p>
                    
                    <form onSubmit={handleDocumentSubmit} className="space-y-4">
                      <div>
                        <label className="block text-xs font-semibold text-gray-300 mb-1">Aadhaar Card Document / PDF</label>
                        <input type="file" onChange={(e) => setAadhaarFile(e.target.files[0]?.name || '')} className="w-full bg-gray-950 border border-gray-800 rounded-xl p-2.5 text-sm text-gray-300 file:mr-4 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-500 cursor-pointer" required />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-300 mb-1">PAN Card Document / PDF</label>
                        <input type="file" onChange={(e) => setPanFile(e.target.files[0]?.name || '')} className="w-full bg-gray-950 border border-gray-800 rounded-xl p-2.5 text-sm text-gray-300 file:mr-4 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-500 cursor-pointer" required />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-300 mb-1">10th Marksheet (PDF/Image)</label>
                        <input type="file" onChange={(e) => setTenthFile(e.target.files[0]?.name || '')} className="w-full bg-gray-950 border border-gray-800 rounded-xl p-2.5 text-sm text-gray-300 file:mr-4 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-500 cursor-pointer" required />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-300 mb-1">12th Marksheet (PDF/Image)</label>
                        <input type="file" onChange={(e) => setTwelfthFile(e.target.files[0]?.name || '')} className="w-full bg-gray-950 border border-gray-800 rounded-xl p-2.5 text-sm text-gray-300 file:mr-4 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-500 cursor-pointer" required />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-300 mb-1">Character Certificate (PDF/Image)</label>
                        <input type="file" onChange={(e) => setCharCertFile(e.target.files[0]?.name || '')} className="w-full bg-gray-950 border border-gray-800 rounded-xl p-2.5 text-sm text-gray-300 file:mr-4 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-500 cursor-pointer" required />
                      </div>
                      <button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 py-3 rounded-xl font-bold text-sm text-white shadow-md transition">
                        Submit All Documents to University Admin
                      </button>
                      {docSubmitted && <p className="text-xs text-emerald-400 text-center font-bold">✓ Documents submitted successfully for review!</p>}
                    </form>
                  </div>
                )}

                {/* University Admin Panel - View Student Documents & Take Action */}
                {activeTab === 'uni-admin' && (
                  <div className="bg-gray-900 border border-gray-800 p-6 rounded-2xl shadow-xl space-y-6">
                    <div className="flex justify-between items-center border-b border-gray-800 pb-3">
                      <div>
                        <h3 className="text-xl font-bold text-white">University Admin Panel ({selectedUni.name})</h3>
                        <p className="text-xs text-gray-400">Review and verify documents submitted by students.</p>
                      </div>
                      {isUniAdminLoggedIn && (
                        <button onClick={() => setIsUniAdminLoggedIn(false)} className="bg-red-600/20 text-red-400 px-3 py-1 rounded-lg text-xs font-bold border border-red-500/30">Logout Uni Admin</button>
                      )}
                    </div>

                    {!isUniAdminLoggedIn ? (
                      <div className="max-w-md mx-auto bg-gray-950 border border-gray-800 p-6 rounded-2xl space-y-4 my-4">
                        <div className="text-center">
                          <h4 className="font-bold text-white text-sm">University Admin Login Required</h4>
                          <p className="text-[11px] text-gray-400">Use: uniorg@univote.com / Uni@1234</p>
                        </div>
                        <form onSubmit={handleUniAdminLogin} className="space-y-3">
                          <input type="email" value={uniAdminUser} onChange={(e) => setUniAdminUser(e.target.value)} placeholder="uniorg@univote.com" className="w-full bg-gray-900 border border-gray-800 rounded-xl p-2.5 text-sm text-white" required />
                          <input type="password" value={uniAdminPass} onChange={(e) => setUniAdminPass(e.target.value)} placeholder="••••••••" className="w-full bg-gray-900 border border-gray-800 rounded-xl p-2.5 text-sm text-white" required />
                          <button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 py-2.5 rounded-xl font-bold text-sm text-white">Login as Uni Admin</button>
                        </form>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <h4 className="font-bold text-white text-sm">Student Document Submissions</h4>
                        <div className="space-y-4">
                          {submittedSubmissions.filter(sub => sub.uniId === selectedUni.id).length === 0 ? (
                            <p className="text-xs text-gray-400">No student documents submitted for this university yet.</p>
                          ) : (
                            submittedSubmissions.filter(sub => sub.uniId === selectedUni.id).map(sub => (
                              <div key={sub.id} className="bg-gray-950 border border-gray-800 p-4 rounded-xl space-y-3">
                                <div className="flex justify-between items-start">
                                  <div>
                                    <h5 className="font-bold text-white text-sm">{sub.studentName}</h5>
                                    <p className="text-xs text-blue-400">{sub.studentEmail}</p>
                                  </div>
                                  <span className={`text-xs font-bold px-3 py-1 rounded-full border ${sub.status === 'Approved' ? 'bg-emerald-950 text-emerald-400 border-emerald-800' : sub.status === 'Rejected' ? 'bg-red-950 text-red-400 border-red-800' : 'bg-amber-950 text-amber-400 border-amber-800'}`}>
                                    {sub.status}
                                  </span>
                                </div>

                                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-xs text-gray-300 bg-gray-900 p-3 rounded-lg border border-gray-800/80">
                                  <div>📌 Aadhaar: <span className="text-blue-400 font-medium">{sub.aadhaar}</span></div>
                                  <div>💳 PAN: <span className="text-blue-400 font-medium">{sub.pan}</span></div>
                                  <div>🎓 10th: <span className="text-blue-400 font-medium">{sub.tenth}</span></div>
                                  <div>🎓 12th: <span className="text-blue-400 font-medium">{sub.twelfth}</span></div>
                                  <div>📜 Character: <span className="text-blue-400 font-medium">{sub.charCert}</span></div>
                                </div>

                                <div className="flex gap-2 pt-1">
                                  <button onClick={() => handleDocAction(sub.id, 'Approved')} className="bg-emerald-600 hover:bg-emerald-500 px-3 py-1.5 rounded-lg text-xs font-bold text-white shadow">
                                    Approve Documents
                                  </button>
                                  <button onClick={() => handleDocAction(sub.id, 'Rejected')} className="bg-red-600 hover:bg-red-500 px-3 py-1.5 rounded-lg text-xs font-bold text-white shadow">
                                    Reject
                                  </button>
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Organisation Panel / Candidate Manager Tab */}
                {activeTab === 'manager' && (
                  <div className="bg-gray-900 border border-gray-800 p-6 rounded-2xl shadow-xl space-y-4">
                    <h3 className="text-xl font-bold text-white">Organisation & Candidate Panel</h3>
                    <p className="text-xs text-gray-400">Register new election candidates for {selectedUni.name}.</p>
                    <form onSubmit={handleAddCandidate} className="space-y-4">
                      <input type="text" value={candidateName} onChange={(e) => setCandidateName(e.target.value)} placeholder="Candidate Full Name" className="w-full bg-gray-950 border border-gray-800 rounded-xl p-3 text-sm text-white" required />
                      <input type="text" value={candidateParty} onChange={(e) => setCandidateParty(e.target.value)} placeholder="Party Name" className="w-full bg-gray-950 border border-gray-800 rounded-xl p-3 text-sm text-white" required />
                      <button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 py-3 rounded-xl font-bold text-sm text-white shadow-md">
                        Register Candidate
                      </button>
                    </form>
                  </div>
                )}

              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}