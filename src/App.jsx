import React, { useState, useEffect } from 'react';
import { auth, googleProvider } from './firebase';
import { signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';

export default function App() {
  const [user, setUser] = useState(null);
  const [currentView, setCurrentView] = useState('home'); // 'home', 'universities', 'register-uni', 'admin-login', 'admin-panel'
  const [selectedUni, setSelectedUni] = useState(null);
  const [activeTab, setActiveTab] = useState('portal'); // 'portal', 'voting', 'student-portal', 'manager', 'documents', 'uni-admin', 'faculty-portal'

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

  // Faculty Login States
  const [facultyEmail, setFacultyEmail] = useState('');
  const [facultyPassword, setFacultyPassword] = useState('');
  const [isFacultyLoggedIn, setIsFacultyLoggedIn] = useState(false);

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

  // Student Document Verification Upload States
  const [aadhaarFile, setAadhaarFile] = useState('');
  const [panFile, setPanFile] = useState('');
  const [tenthFile, setTenthFile] = useState('');
  const [twelfthFile, setTwelfthFile] = useState('');
  const [charCertFile, setCharCertFile] = useState('');
  const [docSubmitted, setDocSubmitted] = useState(false);

  // University Admin Image Upload States
  const [bannerInputType, setBannerInputType] = useState('url'); // 'url' or 'file'
  const [newBannerImage, setNewBannerImage] = useState('');
  const [bannerFileObj, setBannerFileObj] = useState(null);

  const [galleryInputType, setGalleryInputType] = useState('url'); // 'url' or 'file'
  const [newGalleryImage, setNewGalleryImage] = useState('');
  const [galleryFileObj, setGalleryFileObj] = useState(null);

  // Faculty Salary Management States (Controlled by University Admin)
  const [facultySalaries, setFacultySalaries] = useState([
    { id: 1, name: 'Dr. Rajesh Kumar', dept: 'Computer Science & Engg', salary: '₹95,000', status: 'Active' },
    { id: 2, name: 'Dr. Sneha Sharma', dept: 'Electronics & Comm.', salary: '₹88,000', status: 'Active' },
    { id: 3, name: 'Prof. Amit Verma', dept: 'Mechanical Engg', salary: '₹82,000', status: 'Active' }
  ]);
  const [newFacultyName, setNewFacultyName] = useState('');
  const [newFacultyDept, setNewFacultyDept] = useState('');
  const [newFacultySalary, setNewFacultySalary] = useState('');

  // Centralized storage for student document submissions per university
  const [submittedSubmissions, setSubmittedSubmissions] = useState([
    {
      id: 101,
      uniId: 'graphic-era',
      studentName: 'Aarav Sharma',
      studentEmail: 'aarav@student.com',
      aadhaar: 'ID_Verified.pdf',
      pan: 'PAN_Card.pdf',
      tenth: '10th_Marksheet.pdf',
      twelfth: '12th_Marksheet.pdf',
      charCert: 'Character_Certificate.pdf',
      status: 'Pending Verification'
    }
  ]);

  // Student Marks Management States (Real-time dynamic tracking controlled by Faculty)
  const [studentMarks, setStudentMarks] = useState([
    { id: 1, exam: 'Mid-Term Exam', subject: 'Data Structures & Algorithms', marks: '42/50', grade: 'A+' },
    { id: 2, exam: 'Mid-Term Exam', subject: 'Database Management Systems', marks: '38/50', grade: 'A' },
    { id: 3, exam: 'End-Term Exam', subject: 'Software Engineering', marks: '85/100', grade: 'O' },
    { id: 4, exam: 'Quiz 1', subject: 'Computer Networks', marks: '18/20', grade: 'A+' }
  ]);
  const [newExamType, setNewExamType] = useState('Mid-Term Exam');
  const [newSubject, setNewSubject] = useState('');
  const [newMarks, setNewMarks] = useState('');
  const [newGrade, setNewGrade] = useState('');

  // Student Fees States
  const [studentFees, setStudentFees] = useState([
    { id: 1, semester: 'Semester 1 (2025-26)', amount: '₹45,000', status: 'Paid', dueDate: '15 Aug 2025' },
    { id: 2, semester: 'Semester 2 (2025-26)', amount: '₹45,000', status: 'Pending', dueDate: '15 Jan 2026' }
  ]);

  // Upcoming Events States
  const [upcomingEvents, setUpcomingEvents] = useState([
    { id: 1, title: 'Annual Tech Hackathon 2026', date: '25 Mar 2026', venue: 'Main Auditorium', desc: 'Showcase your coding skills and win prizes.' },
    { id: 2, title: 'Mid-Term Examinations', date: '10 Apr 2026', venue: 'Examination Hall', desc: 'Semester mid-term examinations begin.' },
    { id: 3, title: 'Cultural Fest - Crescendo', date: '05 May 2026', venue: 'Open Air Theatre', desc: 'Music, dance, and drama competitions.' }
  ]);

  // Unique Universities Data
  const [universities, setUniversities] = useState([
    { 
      id: 'graphic-era', 
      name: 'Graphic Era University', 
      location: 'Dehradun, Uttarakhand', 
      desc: 'Graphic Era (Deemed to be University) student union election & management portal.', 
      eligible: '18,500+',
      status: 'Approved',
      image: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=1200&q=80',
      gallery: [
        'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=800&q=80'
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
      image: 'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=1200&q=80',
      gallery: [
        'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=800&q=80'
      ],
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
      gallery: [
        'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=800&q=80'
      ],
      candidates: [
        { id: 1, name: 'Simran Kaur', party: 'Panther Group', votes: 210 },
        { id: 2, name: 'Rohit Gupta', party: 'Students Voice', votes: 180 }
      ]
    }
  ]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser || null);
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

  const handleFacultyLogin = (e) => {
    e.preventDefault();
    if (facultyEmail === 'faculty@univote.com' && facultyPassword === 'Faculty@1234') {
      setIsFacultyLoggedIn(true);
      alert("Faculty Logged In Successfully!");
    } else {
      alert("Invalid credentials! Use: faculty@univote.com / Faculty@1234");
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
    setRegisteredApplications(prev => [...prev, newApp]);
    alert("University registration submitted successfully through Sponsoring Body → State Govt → UGC route!");
    setRegUniName('');
    setRegLocation('');
    setRegTrustDeed('');
    setRegPan('');
    setRegLandDoc('');
    setRegCorpusFund('');
    setCurrentView('universities');
  };

  const handleApproveUni = (id) => {
    const targetApp = registeredApplications.find(app => app.id === id);
    if (!targetApp) return;

    setRegisteredApplications(prev =>
      prev.map(app => (app.id === id ? { ...app, status: 'Approved' } : app))
    );

    const approvedItem = {
      id: 'uni-' + Date.now(),
      name: targetApp.name,
      location: targetApp.location,
      status: 'Approved',
      image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1200&q=80',
      gallery: [],
      desc: 'Newly approved university through regulatory pathway.',
      candidates: []
    };

    setUniversities(prev => [...prev, approvedItem]);
    alert("University approved and added to active network!");
  };

  const handleVote = (uniId, candidateId) => {
    const activeUser = user || auth.currentUser;
    if (!activeUser) {
      const guestName = prompt("Please enter your name to cast your vote (or sign in with Google):");
      if (!guestName) return;
    }

    setUniversities(prevUniversities =>
      prevUniversities.map(uni => {
        if (uni.id === uniId) {
          const updatedCandidates = uni.candidates.map(cand =>
            cand.id === candidateId ? { ...cand, votes: cand.votes + 1 } : cand
          );
          return { ...uni, candidates: updatedCandidates };
        }
        return uni;
      })
    );

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

    setUniversities(prevUniversities =>
      prevUniversities.map(uni => {
        if (uni.id === selectedUni.id) {
          return { ...uni, candidates: [...uni.candidates, newCandidate] };
        }
        return uni;
      })
    );

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
    const item = { id: Date.now(), exam: newExamType, subject: newSubject, marks: newMarks, grade: newGrade };
    setStudentMarks(prev => [...prev, item]);
    setNewSubject('');
    setNewMarks('');
    setNewGrade('');
    alert("Student marks updated by faculty in real-time!");
  };

  const handleDeleteMark = (markId) => {
    setStudentMarks(prev => prev.filter(m => m.id !== markId));
    alert("Mark record deleted successfully!");
  };

  const handlePayFee = (feeId) => {
    setStudentFees(prev => prev.map(f => f.id === feeId ? { ...f, status: 'Paid' } : f));
    alert("Fee payment successful and updated!");
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
      aadhaar: aadhaarFile || 'ID_Doc.pdf',
      pan: panFile || 'PAN.pdf',
      tenth: tenthFile || '10th_Marksheet.pdf',
      twelfth: twelfthFile || '12th_Marksheet.pdf',
      charCert: charCertFile || 'Character_Cert.pdf',
      status: 'Pending Verification'
    };
    setSubmittedSubmissions(prev => [...prev, newSub]);
    setDocSubmitted(true);
    alert("All verification documents uploaded and sent to University Admin successfully!");
  };

  const handleDocAction = (subId, statusAction) => {
    setSubmittedSubmissions(prev => prev.map(sub => sub.id === subId ? { ...sub, status: statusAction } : sub));
    alert(`Document status updated to: ${statusAction}`);
  };

  const handleUpdateSalary = (facultyId, updatedSalary) => {
    setFacultySalaries(prev => prev.map(f => f.id === facultyId ? { ...f, salary: updatedSalary } : f));
    alert("Faculty salary updated successfully!");
  };

  const handleAddFaculty = (e) => {
    e.preventDefault();
    if (!newFacultyName || !newFacultyDept || !newFacultySalary) return;
    const newFac = {
      id: Date.now(),
      name: newFacultyName,
      dept: newFacultyDept,
      salary: newFacultySalary,
      status: 'Active'
    };
    setFacultySalaries(prev => [...prev, newFac]);
    setNewFacultyName('');
    setNewFacultyDept('');
    setNewFacultySalary('');
    alert("New faculty added to payroll successfully!");
  };

  const handleDeleteFaculty = (facultyId) => {
    setFacultySalaries(prev => prev.filter(f => f.id !== facultyId));
    alert("Faculty removed from active payroll!");
  };

  const getFileUrl = (fileObj) => {
    if (!fileObj) return '';
    return URL.createObjectURL(fileObj);
  };

  const handleUpdateBanner = (e) => {
    e.preventDefault();
    let imageSrc = '';
    if (bannerInputType === 'url') {
      if (!newBannerImage.trim()) {
        alert("Please enter a valid banner image URL.");
        return;
      }
      imageSrc = newBannerImage;
    } else {
      if (!bannerFileObj) {
        alert("Please select an image file from your gallery.");
        return;
      }
      imageSrc = getFileUrl(bannerFileObj);
    }

    const updatedUni = { ...selectedUni, image: imageSrc };
    setSelectedUni(updatedUni);
    setUniversities(prev => prev.map(u => u.id === updatedUni.id ? updatedUni : u));
    setNewBannerImage('');
    setBannerFileObj(null);
    alert("University banner image updated successfully!");
  };

  const handleAddGalleryImage = (e) => {
    e.preventDefault();
    let imageSrc = '';
    if (galleryInputType === 'url') {
      if (!newGalleryImage.trim()) {
        alert("Please enter a valid gallery image URL.");
        return;
      }
      imageSrc = newGalleryImage;
    } else {
      if (!galleryFileObj) {
        alert("Please select an image file from your gallery.");
        return;
      }
      imageSrc = getFileUrl(galleryFileObj);
    }

    const updatedGallery = [...(selectedUni.gallery || []), imageSrc];
    const updatedUni = { ...selectedUni, gallery: updatedGallery };
    setSelectedUni(updatedUni);
    setUniversities(prev => prev.map(u => u.id === updatedUni.id ? updatedUni : u));
    setNewGalleryImage('');
    setGalleryFileObj(null);
    alert("Gallery image added successfully to university portal!");
  };

  const isDark = theme === 'dark';

  return (
    <div className={`min-h-screen font-sans relative overflow-x-hidden transition-colors duration-200 ${isDark ? 'bg-[#0a0a0c] text-zinc-100' : 'bg-gray-50 text-gray-900'}`}>

      {/* Navbar */}
      <nav className={`p-4 border-b sticky top-0 z-50 backdrop-blur-md transition-colors ${isDark ? 'border-zinc-800/80 bg-[#0a0a0c]/90' : 'border-gray-200 bg-white/90'}`}>
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="cursor-pointer flex items-center gap-3 group" onClick={() => { setCurrentView('home'); setSelectedUni(null); }}>
            <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-700 flex items-center justify-center text-white font-semibold text-xs tracking-tight shadow-sm">U</div>
            <div>
              <h1 className="text-sm font-semibold tracking-tight text-zinc-100">UniVote Pro</h1>
              <p className="text-[10px] text-zinc-400 font-medium">Campus Management Framework</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2.5">
            <button onClick={() => setCurrentView('register-uni')} className="hidden md:flex items-center gap-1.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 px-3 py-1.5 rounded-lg text-xs font-medium text-zinc-300 transition-all">
              🏛️ Register University
            </button>
            <button onClick={() => setCurrentView('admin-login')} className="flex items-center gap-1.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 px-3 py-1.5 rounded-lg text-xs font-medium text-zinc-300 transition-all">
              🔐 Admin Portal
            </button>
            <button onClick={toggleTheme} className="p-2 rounded-lg border border-zinc-800 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-xs transition-all">
              {isDark ? '☀️' : '🌙'}
            </button>
            {user ? (
              <div className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 px-3 py-1 rounded-lg">
                <span className="text-xs text-zinc-300 font-medium">{user.displayName || user.email}</span>
                <button onClick={handleLogout} className="bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 px-2 py-0.5 rounded text-[10px] font-medium transition">Logout</button>
              </div>
            ) : (
              <button onClick={handleGoogleLogin} className="bg-zinc-100 hover:bg-white text-zinc-900 px-3.5 py-1.5 rounded-lg text-xs font-semibold shadow-sm transition-all">
                Sign in with Google
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* Main Container */}
      <main className="p-6 max-w-7xl mx-auto relative z-10">

        {/* 1. Landing Page */}
        {currentView === 'home' && !selectedUni && (
          <div className="py-12 space-y-16">
            <div className="text-center space-y-5 max-w-3xl mx-auto">
              <span className="inline-flex items-center gap-1.5 bg-zinc-900 text-zinc-300 text-[11px] font-medium px-3 py-1 rounded-full border border-zinc-800">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                Secure Campus & Faculty Management Ecosystem
              </span>
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-zinc-100 leading-tight">
                Modernizing Higher Education Administration
              </h2>
              <p className="text-zinc-400 text-sm md:text-base leading-relaxed max-w-2xl mx-auto">
                A clean, robust platform featuring secure university registration, faculty payroll controls, document verification, student academic tracking, and digital elections.
              </p>
              <div className="flex flex-wrap justify-center gap-3 pt-2">
                <button onClick={() => setCurrentView('universities')} className="bg-zinc-100 hover:bg-white text-zinc-900 px-5 py-2.5 rounded-xl font-semibold text-xs shadow-sm transition-all">
                  Explore Universities & Portals →
                </button>
                <button onClick={() => setCurrentView('register-uni')} className="bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-200 px-5 py-2.5 rounded-xl font-semibold text-xs transition-all">
                  🏛️ Register New University
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
              <div className="bg-zinc-900/50 border border-zinc-800/80 hover:border-zinc-700 p-6 rounded-2xl transition-all">
                <div className="w-10 h-10 rounded-xl bg-zinc-800 border border-zinc-700 text-zinc-200 flex items-center justify-center font-bold text-sm mb-4">👨‍🏫</div>
                <h3 className="text-sm font-semibold text-zinc-100 mb-1">Faculty & Salary Management</h3>
                <p className="text-xs text-zinc-400 leading-relaxed">Admin controls for managing faculty rosters, payrolls, and updating monthly compensation packages securely.</p>
              </div>
              <div className="bg-zinc-900/50 border border-zinc-800/80 hover:border-zinc-700 p-6 rounded-2xl transition-all">
                <div className="w-10 h-10 rounded-xl bg-zinc-800 border border-zinc-700 text-zinc-200 flex items-center justify-center font-bold text-sm mb-4">🗳️</div>
                <h3 className="text-sm font-semibold text-zinc-100 mb-1">Campus Voting Booth</h3>
                <p className="text-xs text-zinc-400 leading-relaxed">Secure, authenticated student voting booths for annual student union elections with live vote tallying.</p>
              </div>
              <div className="bg-zinc-900/50 border border-zinc-800/80 hover:border-zinc-700 p-6 rounded-2xl transition-all">
                <div className="w-10 h-10 rounded-xl bg-zinc-800 border border-zinc-700 text-zinc-200 flex items-center justify-center font-bold text-sm mb-4">📊</div>
                <h3 className="text-sm font-semibold text-zinc-100 mb-1">Student Portal & Records</h3>
                <p className="text-xs text-zinc-400 leading-relaxed">Dedicated student dashboards to manage subject-wise marks, exam results, fee updates, and academic events.</p>
              </div>
            </div>
          </div>
        )}

        {/* 2. Universities List View */}
        {currentView === 'universities' && !selectedUni && (
          <div className="space-y-6">
            <div className="flex justify-between items-center bg-zinc-900/50 border border-zinc-800 p-6 rounded-2xl">
              <div>
                <h2 className="text-lg font-bold text-zinc-100">Approved Universities & Campuses</h2>
                <p className="text-xs text-zinc-400 mt-0.5">Select an institution to access its dedicated portal and voting booth.</p>
              </div>
              <button onClick={() => setCurrentView('home')} className="text-xs font-medium text-zinc-300 hover:text-white bg-zinc-800 px-3.5 py-1.5 rounded-lg border border-zinc-700 transition">← Back to Home</button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {universities.map(uni => (
                <div key={uni.id} className="bg-zinc-900/50 border border-zinc-800 hover:border-zinc-700 rounded-2xl overflow-hidden shadow-sm transition-all flex flex-col justify-between group">
                  <div>
                    <div className="h-44 overflow-hidden relative">
                      <img src={uni.image} alt={uni.name} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                      <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 via-transparent to-transparent"></div>
                      <span className="absolute top-3 right-3 bg-zinc-900/90 text-zinc-200 border border-zinc-700 text-[10px] font-medium px-2.5 py-0.5 rounded-full">✓ {uni.status}</span>
                    </div>
                    <div className="p-5 space-y-2">
                      <h3 className="font-semibold text-sm text-zinc-100">{uni.name}</h3>
                      <p className="text-xs text-zinc-400 font-medium">📍 {uni.location}</p>
                      <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">{uni.desc}</p>
                    </div>
                  </div>
                  <div className="p-5 pt-0">
                    <button onClick={() => { setSelectedUni(uni); setActiveTab('portal'); }} className="w-full bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-100 py-2.5 rounded-xl text-xs font-semibold transition-all">
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
          <div className="max-w-3xl mx-auto bg-zinc-900/50 border border-zinc-800 p-8 rounded-2xl shadow-sm space-y-6">
            <div className="flex justify-between items-center border-b border-zinc-800 pb-4">
              <div>
                <h2 className="text-lg font-bold text-zinc-100">University Registration Portal</h2>
                <p className="text-xs text-zinc-400 mt-0.5">Sponsoring Body → State Govt → UGC Setup Route Application Form</p>
              </div>
              <button onClick={() => setCurrentView('home')} className="text-xs text-zinc-400 hover:text-white">Cancel</button>
            </div>

            <form onSubmit={handleUniversityRegistration} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1">University Name</label>
                  <input type="text" value={regUniName} onChange={(e) => setRegUniName(e.target.value)} placeholder="e.g. Apex International University" className="w-full bg-zinc-950 border border-zinc-800 focus:border-zinc-600 rounded-xl p-3 text-xs text-zinc-200 outline-none transition" required />
                </div>
                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1">Location (State / City)</label>
                  <input type="text" value={regLocation} onChange={(e) => setRegLocation(e.target.value)} placeholder="e.g. Ranchi, Jharkhand" className="w-full bg-zinc-950 border border-zinc-800 focus:border-zinc-600 rounded-xl p-3 text-xs text-zinc-200 outline-none transition" required />
                </div>
              </div>

              <div className="space-y-3 pt-1">
                <h3 className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">A. Sponsoring Body Documents</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <input type="text" value={regTrustDeed} onChange={(e) => setRegTrustDeed(e.target.value)} placeholder="Trust Deed / Society Reg. Number" className="w-full bg-zinc-950 border border-zinc-800 focus:border-zinc-600 rounded-xl p-3 text-xs text-zinc-200 outline-none" required />
                  <input type="text" value={regPan} onChange={(e) => setRegPan(e.target.value)} placeholder="Trust PAN Number" className="w-full bg-zinc-950 border border-zinc-800 focus:border-zinc-600 rounded-xl p-3 text-xs text-zinc-200 outline-none" required />
                </div>

                <h3 className="text-xs font-semibold text-zinc-300 uppercase tracking-wider pt-1">B. Land & Infrastructure (Min 50 Acres)</h3>
                <input type="text" value={regLandDoc} onChange={(e) => setRegLandDoc(e.target.value)} placeholder="Sale Deed / CLU Certificate Link or Ref" className="w-full bg-zinc-950 border border-zinc-800 focus:border-zinc-600 rounded-xl p-3 text-xs text-zinc-200 outline-none" required />

                <h3 className="text-xs font-semibold text-zinc-300 uppercase tracking-wider pt-1">C. Financial Documents</h3>
                <input type="text" value={regCorpusFund} onChange={(e) => setRegCorpusFund(e.target.value)} placeholder="Corpus Fund Proof (Rs 25 Cr FD Ref)" className="w-full bg-zinc-950 border border-zinc-800 focus:border-zinc-600 rounded-xl p-3 text-xs text-zinc-200 outline-none" required />
              </div>

              <button type="submit" className="w-full bg-zinc-100 hover:bg-white text-zinc-900 py-3 rounded-xl font-semibold text-xs shadow-sm transition-all">
                Submit Application for State & UGC Review →
              </button>
            </form>
          </div>
        )}

        {/* 4. Admin Login Portal */}
        {currentView === 'admin-login' && !isAdminLoggedIn && (
          <div className="max-w-md mx-auto bg-zinc-900/50 border border-zinc-800 p-8 rounded-2xl shadow-sm space-y-6 my-12">
            <div className="text-center space-y-2">
              <div className="w-10 h-10 bg-zinc-800 border border-zinc-700 text-zinc-200 rounded-xl mx-auto flex items-center justify-center font-bold text-sm">🔐</div>
              <h2 className="text-base font-bold text-zinc-100">Global Admin Secure Login</h2>
              <p className="text-xs text-zinc-400">Enter admin credentials to manage university approvals.</p>
            </div>
            <form onSubmit={handleAdminLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">Admin Email ID</label>
                <input type="email" value={adminEmail} onChange={(e) => setAdminEmail(e.target.value)} placeholder="admin@univote.com" className="w-full bg-zinc-950 border border-zinc-800 focus:border-zinc-600 rounded-xl p-3 text-xs text-zinc-200 outline-none" required />
              </div>
              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">Password</label>
                <input type="password" value={adminPassword} onChange={(e) => setAdminPassword(e.target.value)} placeholder="••••••••" className="w-full bg-zinc-950 border border-zinc-800 focus:border-zinc-600 rounded-xl p-3 text-xs text-zinc-200 outline-none" required />
              </div>
              <button type="submit" className="w-full bg-zinc-100 hover:bg-white text-zinc-900 py-3 rounded-xl font-semibold text-xs transition">
                Login as Global Admin
              </button>
              <div className="text-center pt-1">
                <button type="button" onClick={() => setCurrentView('home')} className="text-xs text-zinc-400 hover:text-white">← Return to Home</button>
              </div>
            </form>
          </div>
        )}

        {/* 5. Admin Dashboard */}
        {currentView === 'admin-panel' && isAdminLoggedIn && (
          <div className="space-y-6">
            <div className="flex justify-between items-center bg-zinc-900/50 border border-zinc-800 p-6 rounded-2xl">
              <div>
                <h2 className="text-lg font-bold text-zinc-100">Global Admin Control Panel</h2>
                <p className="text-xs text-zinc-400 mt-0.5">Review sponsoring body documents and approve university applications.</p>
              </div>
              <button onClick={() => { setIsAdminLoggedIn(false); setCurrentView('home'); }} className="bg-red-500/10 hover:bg-red-500/20 text-red-400 px-3.5 py-1.5 rounded-lg text-xs font-medium border border-red-500/20 transition">Logout Admin</button>
            </div>

            <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 space-y-4">
              <h3 className="text-sm font-bold text-zinc-100">Pending University Applications</h3>
              <div className="space-y-3">
                {registeredApplications.map(app => (
                  <div key={app.id} className="bg-zinc-950 border border-zinc-800 p-4 rounded-xl flex justify-between items-center transition-all hover:border-zinc-700">
                    <div>
                      <h4 className="font-semibold text-zinc-100 text-xs">{app.name}</h4>
                      <p className="text-xs text-zinc-400 mt-0.5">📍 {app.location} | Trust: {app.trust}</p>
                      <p className="text-[11px] text-zinc-400 mt-1">Status: <span className="text-amber-400 font-medium">{app.status}</span></p>
                    </div>
                    {app.status === 'Pending Approval' ? (
                      <button onClick={() => handleApproveUni(app.id)} className="bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-100 px-4 py-2 rounded-lg text-xs font-semibold transition">
                        Approve & Publish
                      </button>
                    ) : (
                      <span className="text-xs font-medium text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-lg border border-emerald-500/20">✓ Approved</span>
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
            <button onClick={() => setSelectedUni(null)} className="text-xs font-medium text-zinc-400 hover:text-white">← Back to Universities</button>
            
            <div className="relative h-56 rounded-2xl overflow-hidden border border-zinc-800 flex items-end p-6 shadow-sm">
              <div className="absolute inset-0 bg-cover bg-center filter brightness-50" style={{ backgroundImage: `url(${selectedUni.image})` }}></div>
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0c] via-[#0a0a0c]/40 to-transparent"></div>
              <div className="relative z-10 space-y-1.5">
                <span className="bg-zinc-900/90 border border-zinc-700 text-zinc-300 text-[10px] font-semibold px-2.5 py-1 rounded-md uppercase tracking-wider">Active Campus</span>
                <h2 className="text-2xl md:text-3xl font-bold text-white">{selectedUni.name}</h2>
                <p className="text-xs text-zinc-300">📍 {selectedUni.location} • Eligible Voters: <span className="text-white font-semibold">{selectedUni.eligible}</span></p>
              </div>
            </div>

            {/* University Portal Layout (Sidebar + Content) */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              
              {/* Sidebar Options */}
              <div className="bg-zinc-900/50 border border-zinc-800 p-3 rounded-2xl space-y-1 h-fit">
                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider px-3 py-2">University Menu</p>
                <button onClick={() => setActiveTab('portal')} className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${activeTab === 'portal' ? 'bg-zinc-800 text-white font-semibold border border-zinc-700' : 'text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-200'}`}>
                  🏠 University Overview
                </button>
                <button onClick={() => setActiveTab('voting')} className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${activeTab === 'voting' ? 'bg-zinc-800 text-white font-semibold border border-zinc-700' : 'text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-200'}`}>
                  🗳️ Voting Booth
                </button>
                <button onClick={() => setActiveTab('student-portal')} className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${activeTab === 'student-portal' ? 'bg-zinc-800 text-white font-semibold border border-zinc-700' : 'text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-200'}`}>
                  🎓 Student Portal & Dashboard
                </button>
                <button onClick={() => setActiveTab('faculty-portal')} className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${activeTab === 'faculty-portal' ? 'bg-zinc-800 text-white font-semibold border border-zinc-700' : 'text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-200'}`}>
                  👨‍🏫 Faculty Marks Management
                </button>
                <button onClick={() => setActiveTab('documents')} className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${activeTab === 'documents' ? 'bg-zinc-800 text-white font-semibold border border-zinc-700' : 'text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-200'}`}>
                  📄 Document Verification
                </button>
                <button onClick={() => setActiveTab('uni-admin')} className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${activeTab === 'uni-admin' ? 'bg-zinc-800 text-white font-semibold border border-zinc-700' : 'text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-200'}`}>
                  🛡️ Uni Admin Panel
                </button>
                <button onClick={() => setActiveTab('manager')} className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${activeTab === 'manager' ? 'bg-zinc-800 text-white font-semibold border border-zinc-700' : 'text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-200'}`}>
                  🏛️ Organisation Panel
                </button>
              </div>

              {/* Main Content Area */}
              <div className="md:col-span-3 space-y-6">

                {/* Overview Tab with Gallery */}
                {activeTab === 'portal' && (
                  <div className="space-y-6">
                    <div className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-2xl space-y-3">
                      <h3 className="text-base font-bold text-zinc-100">Welcome to {selectedUni.name} Portal</h3>
                      <p className="text-xs text-zinc-300 leading-relaxed">{selectedUni.desc}</p>
                      <div className="grid grid-cols-2 gap-4 pt-1">
                        <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800">
                          <p className="text-[10px] text-zinc-400 font-bold uppercase">Total Candidates</p>
                          <p className="text-2xl font-bold text-zinc-100 mt-0.5">{selectedUni.candidates.length}</p>
                        </div>
                        <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800">
                          <p className="text-[10px] text-zinc-400 font-bold uppercase">Verification Status</p>
                          <p className="text-2xl font-bold text-emerald-400 mt-0.5">Verified</p>
                        </div>
                      </div>
                    </div>

                    {/* Campus Gallery Section */}
                    {selectedUni.gallery && selectedUni.gallery.length > 0 && (
                      <div className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-2xl space-y-3">
                        <h4 className="text-sm font-bold text-zinc-100">📷 Campus Gallery & Events</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {selectedUni.gallery.map((imgUrl, idx) => (
                            <div key={idx} className="h-48 rounded-xl overflow-hidden border border-zinc-800 group">
                              <img src={imgUrl} alt={`Gallery ${idx + 1}`} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Voting Booth Tab */}
                {activeTab === 'voting' && (
                  <div className="space-y-4">
                    <h3 className="text-base font-bold text-zinc-100">Active Election Candidates</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {selectedUni.candidates.map(cand => (
                        <div key={cand.id} className="bg-zinc-900/50 border border-zinc-800 hover:border-zinc-700 p-5 rounded-2xl flex justify-between items-center transition-all">
                          <div>
                            <h4 className="font-semibold text-zinc-100 text-sm">{cand.name}</h4>
                            <p className="text-xs text-zinc-400 mt-0.5">Party: <span className="text-zinc-200 font-medium">{cand.party}</span></p>
                            <p className="text-xs text-zinc-400 mt-1">Current Votes: <span className="font-bold text-zinc-100">{cand.votes}</span></p>
                          </div>
                          <button onClick={() => handleVote(selectedUni.id, cand.id)} className="bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-100 px-4 py-2 rounded-xl text-xs font-semibold transition">
                            Vote Now
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Student Portal & Dashboard Tab */}
                {activeTab === 'student-portal' && (
                  <div className="space-y-6">
                    
                    <div className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-2xl space-y-3">
                      <h3 className="text-base font-bold text-zinc-100">🎓 Student Dashboard Overview</h3>
                      <p className="text-xs text-zinc-400">Welcome back! Here is your quick academic summary and stats.</p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 pt-1">
                        <div className="bg-zinc-950 p-3.5 rounded-xl border border-zinc-800">
                          <p className="text-[10px] text-zinc-400 font-bold uppercase">Current CGPA</p>
                          <p className="text-xl font-bold text-zinc-100 mt-1">8.92 / 10</p>
                        </div>
                        <div className="bg-zinc-950 p-3.5 rounded-xl border border-zinc-800">
                          <p className="text-[10px] text-zinc-400 font-bold uppercase">Attendance</p>
                          <p className="text-xl font-bold text-emerald-400 mt-1">92.4%</p>
                        </div>
                        <div className="bg-zinc-950 p-3.5 rounded-xl border border-zinc-800">
                          <p className="text-[10px] text-zinc-400 font-bold uppercase">Fee Status</p>
                          <p className="text-xl font-bold text-amber-400 mt-1">1 Pending</p>
                        </div>
                        <div className="bg-zinc-950 p-3.5 rounded-xl border border-zinc-800">
                          <p className="text-[10px] text-zinc-400 font-bold uppercase">Registered Exams</p>
                          <p className="text-xl font-bold text-zinc-100 mt-1">6 Subjects</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-2xl space-y-3">
                      <h3 className="text-base font-bold text-zinc-100">📝 Examination Marks & Grades</h3>
                      <p className="text-xs text-zinc-400">View live marks entered by faculty members.</p>

                      <div className="space-y-3 pt-1">
                        {['Mid-Term Exam', 'End-Term Exam', 'Quiz 1'].map((examName) => (
                          <div key={examName} className="bg-zinc-950 border border-zinc-800 p-4 rounded-xl space-y-2">
                            <h4 className="font-semibold text-zinc-300 text-xs uppercase tracking-wider border-b border-zinc-800 pb-2">{examName}</h4>
                            <div className="space-y-2 pt-1">
                              {studentMarks.filter(m => m.exam === examName).length === 0 ? (
                                <p className="text-[11px] text-zinc-500">No records found for {examName}.</p>
                              ) : (
                                studentMarks.filter(m => m.exam === examName).map(m => (
                                  <div key={m.id} className="flex justify-between items-center bg-zinc-900/40 p-3 rounded-lg border border-zinc-800">
                                    <div>
                                      <h5 className="font-semibold text-zinc-100 text-xs">{m.subject}</h5>
                                      <p className="text-[11px] text-zinc-400">Marks: <span className="text-zinc-200 font-semibold">{m.marks}</span></p>
                                    </div>
                                    <span className="bg-zinc-800 text-zinc-200 border border-zinc-700 px-2.5 py-1 rounded-lg text-xs font-semibold">
                                      Grade: {m.grade}
                                    </span>
                                  </div>
                                ))
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-2xl space-y-3">
                      <h3 className="text-base font-bold text-zinc-100">💳 Student Fee Dues & Status</h3>
                      <p className="text-xs text-zinc-400">Check tuition fee status and clear pending semester payments.</p>
                      
                      <div className="space-y-3">
                        {studentFees.map(fee => (
                          <div key={fee.id} className="bg-zinc-950 border border-zinc-800 p-4 rounded-xl flex justify-between items-center">
                            <div>
                              <h4 className="font-bold text-zinc-100 text-xs">{fee.semester}</h4>
                              <p className="text-xs text-zinc-400 mt-0.5">Amount: <span className="text-zinc-200 font-semibold">{fee.amount}</span> | Due: {fee.dueDate}</p>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className={`text-xs font-semibold px-2.5 py-1 rounded-lg border ${fee.status === 'Paid' ? 'bg-emerald-950/40 text-emerald-400 border-emerald-900/50' : 'bg-amber-950/40 text-amber-400 border-amber-900/50'}`}>
                                {fee.status}
                              </span>
                              {fee.status === 'Pending' && (
                                <button onClick={() => handlePayFee(fee.id)} className="bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-100 px-3 py-1.5 rounded-lg text-xs font-semibold transition">
                                  Pay Now
                                </button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-2xl space-y-3">
                      <h3 className="text-base font-bold text-zinc-100">📅 Upcoming Campus Events</h3>
                      <p className="text-xs text-zinc-400">Stay updated with upcoming academic and extracurricular schedules.</p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        {upcomingEvents.map(evt => (
                          <div key={evt.id} className="bg-zinc-950 border border-zinc-800 p-4 rounded-xl space-y-2">
                            <span className="bg-zinc-800 text-zinc-300 border border-zinc-700 px-2 py-0.5 rounded text-[10px] font-medium">{evt.date}</span>
                            <h4 className="font-bold text-zinc-100 text-xs mt-1">{evt.title}</h4>
                            <p className="text-xs text-zinc-400 leading-relaxed">{evt.desc}</p>
                            <p className="text-[11px] text-zinc-300 font-medium">📍 {evt.venue}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>
                )}

                {/* Faculty Portal Tab */}
                {activeTab === 'faculty-portal' && (
                  <div className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-2xl space-y-6">
                    
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-zinc-800 pb-4 gap-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                          <span className="text-[10px] font-bold tracking-wider text-zinc-400 uppercase">Faculty Assessment Dashboard</span>
                        </div>
                        <h3 className="text-lg font-bold text-zinc-100">Marks & Evaluation Portal</h3>
                        <p className="text-xs text-zinc-400">Manage and publish verified student marks and academic grades in real-time.</p>
                      </div>
                      {isFacultyLoggedIn && (
                        <button onClick={() => setIsFacultyLoggedIn(false)} className="bg-red-500/10 hover:bg-red-500/20 text-red-400 px-3.5 py-1.5 rounded-lg text-xs font-semibold border border-red-500/20 transition">
                          🔒 Logout Faculty
                        </button>
                      )}
                    </div>

                    {!isFacultyLoggedIn ? (
                      <div className="max-w-md mx-auto bg-zinc-950 border border-zinc-800 p-6 rounded-2xl space-y-4 my-4">
                        <div className="text-center space-y-1.5">
                          <div className="w-10 h-10 bg-zinc-800 border border-zinc-700 text-zinc-200 rounded-xl mx-auto flex items-center justify-center font-bold text-sm">👨‍🏫</div>
                          <h4 className="font-bold text-zinc-100 text-sm">Faculty Secure Portal</h4>
                          <p className="text-xs text-zinc-400">Authenticate with your faculty credentials.</p>
                          <div className="bg-zinc-900 border border-zinc-800 p-2 rounded-lg text-[11px] text-zinc-300 font-mono mt-2">
                            🔑 faculty@univote.com / Faculty@1234
                          </div>
                        </div>
                        <form onSubmit={handleFacultyLogin} className="space-y-3 pt-1">
                          <div>
                            <label className="block text-xs font-semibold text-zinc-300 mb-1">Faculty Email</label>
                            <input type="email" value={facultyEmail} onChange={(e) => setFacultyEmail(e.target.value)} placeholder="faculty@univote.com" className="w-full bg-zinc-900 border border-zinc-800 focus:border-zinc-700 rounded-xl p-3 text-xs text-zinc-200 outline-none" required />
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-zinc-300 mb-1">Password</label>
                            <input type="password" value={facultyPassword} onChange={(e) => setFacultyPassword(e.target.value)} placeholder="••••••••" className="w-full bg-zinc-900 border border-zinc-800 focus:border-zinc-700 rounded-xl p-3 text-xs text-zinc-200 outline-none" required />
                          </div>
                          <button type="submit" className="w-full bg-zinc-100 hover:bg-white text-zinc-900 py-3 rounded-xl font-semibold text-xs transition">
                            Authenticate Faculty →
                          </button>
                        </form>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        
                        <div className="bg-zinc-950 border border-zinc-800 p-5 rounded-xl space-y-3">
                          <h4 className="font-bold text-zinc-100 text-xs uppercase tracking-wider">✍️ Publish New Student Examination Marks</h4>
                          <form onSubmit={handleAddMark} className="space-y-3">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              <div>
                                <label className="block text-xs font-semibold text-zinc-300 mb-1">Examination Type</label>
                                <select value={newExamType} onChange={(e) => setNewExamType(e.target.value)} className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-2.5 text-xs text-zinc-200 outline-none">
                                  <option value="Mid-Term Exam">Mid-Term Exam</option>
                                  <option value="End-Term Exam">End-Term Exam</option>
                                  <option value="Quiz 1">Quiz 1</option>
                                </select>
                              </div>
                              <div>
                                <label className="block text-xs font-semibold text-zinc-300 mb-1">Subject Title</label>
                                <input type="text" value={newSubject} onChange={(e) => setNewSubject(e.target.value)} placeholder="e.g. AI & ML" className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-2.5 text-xs text-zinc-200 outline-none" required />
                              </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              <div>
                                <label className="block text-xs font-semibold text-zinc-300 mb-1">Marks Obtained</label>
                                <input type="text" value={newMarks} onChange={(e) => setNewMarks(e.target.value)} placeholder="e.g. 45/50" className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-2.5 text-xs text-zinc-200 outline-none" required />
                              </div>
                              <div>
                                <label className="block text-xs font-semibold text-zinc-300 mb-1">Grade Awarded</label>
                                <input type="text" value={newGrade} onChange={(e) => setNewGrade(e.target.value)} placeholder="e.g. A+" className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-2.5 text-xs text-zinc-200 outline-none" required />
                              </div>
                            </div>
                            <button type="submit" className="w-full bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-100 py-2.5 rounded-xl font-semibold text-xs transition">
                              ✓ Publish Marks Instantly
                            </button>
                          </form>
                        </div>

                        <div className="space-y-3">
                          <h4 className="font-bold text-zinc-100 text-xs uppercase tracking-wider">📋 Active Student Grade Records ({studentMarks.length})</h4>
                          <div className="space-y-2">
                            {studentMarks.map(m => (
                              <div key={m.id} className="bg-zinc-950 border border-zinc-800 p-4 rounded-xl flex justify-between items-center">
                                <div className="space-y-1">
                                  <span className="bg-zinc-800 text-zinc-300 border border-zinc-700 px-2 py-0.5 rounded text-[10px] font-medium">
                                    {m.exam}
                                  </span>
                                  <h5 className="font-bold text-zinc-100 text-xs mt-1">{m.subject}</h5>
                                  <p className="text-xs text-zinc-400">Marks: <span className="text-zinc-200 font-semibold">{m.marks}</span></p>
                                </div>
                                <div className="flex items-center gap-3">
                                  <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-1 rounded-lg text-xs font-bold">
                                    {m.grade}
                                  </span>
                                  <button onClick={() => handleDeleteMark(m.id)} className="bg-red-500/10 hover:bg-red-500/20 text-red-400 px-3 py-1.5 rounded-lg text-xs font-semibold transition">
                                    Delete
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                      </div>
                    )}
                  </div>
                )}

                {/* Document Verification Tab */}
                {activeTab === 'documents' && (
                  <div className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-2xl space-y-4">
                    <h3 className="text-base font-bold text-zinc-100">Student Verification Document Portal</h3>
                    <p className="text-xs text-zinc-400">Upload your identity and academic certificates for {selectedUni.name}.</p>
                    
                    <form onSubmit={handleDocumentSubmit} className="space-y-3">
                      <div>
                        <label className="block text-xs font-semibold text-zinc-300 mb-1">Identity Card Document / PDF</label>
                        <input type="file" onChange={(e) => setAadhaarFile(e.target.files[0]?.name || '')} className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2 text-xs text-zinc-300 file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-zinc-800 file:text-zinc-200 hover:file:bg-zinc-700 cursor-pointer" required />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-zinc-300 mb-1">PAN Card Document / PDF</label>
                        <input type="file" onChange={(e) => setPanFile(e.target.files[0]?.name || '')} className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2 text-xs text-zinc-300 file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-zinc-800 file:text-zinc-200 hover:file:bg-zinc-700 cursor-pointer" required />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-zinc-300 mb-1">10th Marksheet (PDF/Image)</label>
                        <input type="file" onChange={(e) => setTenthFile(e.target.files[0]?.name || '')} className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2 text-xs text-zinc-300 file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-zinc-800 file:text-zinc-200 hover:file:bg-zinc-700 cursor-pointer" required />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-zinc-300 mb-1">12th Marksheet (PDF/Image)</label>
                        <input type="file" onChange={(e) => setTwelfthFile(e.target.files[0]?.name || '')} className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2 text-xs text-zinc-300 file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-zinc-800 file:text-zinc-200 hover:file:bg-zinc-700 cursor-pointer" required />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-zinc-300 mb-1">Character Certificate (PDF/Image)</label>
                        <input type="file" onChange={(e) => setCharCertFile(e.target.files[0]?.name || '')} className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2 text-xs text-zinc-300 file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-zinc-800 file:text-zinc-200 hover:file:bg-zinc-700 cursor-pointer" required />
                      </div>
                      <button type="submit" className="w-full bg-zinc-100 hover:bg-white text-zinc-900 py-3 rounded-xl font-semibold text-xs transition">
                        Submit All Documents to University Admin
                      </button>
                      {docSubmitted && <p className="text-xs text-emerald-400 text-center font-medium">✓ Documents submitted successfully for review!</p>}
                    </form>
                  </div>
                )}

                {/* University Admin Panel */}
                {activeTab === 'uni-admin' && (
                  <div className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-2xl space-y-6">
                    <div className="flex justify-between items-center border-b border-zinc-800 pb-4">
                      <div>
                        <h3 className="text-base font-bold text-zinc-100">University Admin Panel ({selectedUni.name})</h3>
                        <p className="text-xs text-zinc-400 mt-0.5">Review student documents, manage portal images, and control faculty salaries.</p>
                      </div>
                      {isUniAdminLoggedIn && (
                        <button onClick={() => setIsUniAdminLoggedIn(false)} className="bg-red-500/10 text-red-400 px-3 py-1 rounded-lg text-xs font-semibold border border-red-500/20">Logout</button>
                      )}
                    </div>

                    {!isUniAdminLoggedIn ? (
                      <div className="max-w-md mx-auto bg-zinc-950 border border-zinc-800 p-5 rounded-xl space-y-3 my-2">
                        <div className="text-center">
                          <h4 className="font-bold text-zinc-100 text-xs">University Admin Login Required</h4>
                          <p className="text-[11px] text-zinc-400">Use: uniorg@univote.com / Uni@1234</p>
                        </div>
                        <form onSubmit={handleUniAdminLogin} className="space-y-3">
                          <input type="email" value={uniAdminUser} onChange={(e) => setUniAdminUser(e.target.value)} placeholder="uniorg@univote.com" className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-2.5 text-xs text-zinc-200" required />
                          <input type="password" value={uniAdminPass} onChange={(e) => setUniAdminPass(e.target.value)} placeholder="••••••••" className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-2.5 text-xs text-zinc-200" required />
                          <button type="submit" className="w-full bg-zinc-100 hover:bg-white text-zinc-900 py-2.5 rounded-xl font-semibold text-xs transition">Login as Uni Admin</button>
                        </form>
                      </div>
                    ) : (
                      <div className="space-y-5">
                        
                        {/* Faculty Salary Control */}
                        <div className="bg-zinc-950 border border-zinc-800 p-4 rounded-xl space-y-4">
                          <h4 className="font-bold text-zinc-100 text-xs uppercase tracking-wider">💵 Faculty Salary & Payroll Control</h4>
                          
                          <form onSubmit={handleAddFaculty} className="bg-zinc-900 border border-zinc-800 p-3.5 rounded-xl space-y-2.5">
                            <h5 className="font-semibold text-zinc-300 text-xs">➕ Add New Faculty Member</h5>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                              <input type="text" value={newFacultyName} onChange={(e) => setNewFacultyName(e.target.value)} placeholder="Faculty Name" className="bg-zinc-950 border border-zinc-800 rounded-lg p-2 text-xs text-zinc-200" required />
                              <input type="text" value={newFacultyDept} onChange={(e) => setNewFacultyDept(e.target.value)} placeholder="Department" className="bg-zinc-950 border border-zinc-800 rounded-lg p-2 text-xs text-zinc-200" required />
                              <input type="text" value={newFacultySalary} onChange={(e) => setNewFacultySalary(e.target.value)} placeholder="Salary (₹90,000)" className="bg-zinc-950 border border-zinc-800 rounded-lg p-2 text-xs text-zinc-200" required />
                            </div>
                            <button type="submit" className="w-full bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-100 py-2 rounded-lg text-xs font-semibold transition">
                              Add Faculty & Set Salary
                            </button>
                          </form>

                          <div className="space-y-2 pt-1">
                            <h5 className="font-semibold text-zinc-300 text-xs">📋 Current Faculty Salary List</h5>
                            <div className="space-y-2">
                              {facultySalaries.map(fac => (
                                <div key={fac.id} className="bg-zinc-900 border border-zinc-800 p-3 rounded-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
                                  <div>
                                    <h6 className="font-bold text-zinc-100 text-xs">{fac.name}</h6>
                                    <p className="text-[11px] text-zinc-400">Dept: <span className="text-zinc-200 font-medium">{fac.dept}</span></p>
                                  </div>
                                  <div className="flex items-center gap-2 w-full md:w-auto">
                                    <input 
                                      type="text" 
                                      defaultValue={fac.salary} 
                                      onBlur={(e) => handleUpdateSalary(fac.id, e.target.value)}
                                      className="bg-zinc-950 border border-zinc-800 rounded-lg p-1.5 text-xs text-emerald-400 font-semibold w-28 text-center" 
                                    />
                                    <button onClick={() => handleDeleteFaculty(fac.id)} className="bg-red-500/10 hover:bg-red-500/20 text-red-400 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition ml-auto">
                                      Remove
                                    </button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Image Upload Section */}
                        <div className="bg-zinc-950 border border-zinc-800 p-4 rounded-xl space-y-3">
                          <h4 className="font-bold text-zinc-100 text-xs uppercase tracking-wider">🖼️ Manage University Portal Images</h4>
                          <div className="space-y-2">
                            <label className="text-xs font-semibold text-zinc-300 block">Update Header Banner Image</label>
                            <form onSubmit={handleUpdateBanner} className="flex gap-2">
                              {bannerInputType === 'url' ? (
                                <input type="text" value={newBannerImage} onChange={(e) => setNewBannerImage(e.target.value)} placeholder="https://images.unsplash.com/photo-..." className="flex-1 bg-zinc-900 border border-zinc-800 rounded-xl p-2.5 text-xs text-zinc-200" />
                              ) : (
                                <input type="file" accept="image/*" onChange={(e) => setBannerFileObj(e.target.files[0])} className="flex-1 bg-zinc-900 border border-zinc-800 rounded-xl p-1 text-xs text-zinc-300" />
                              )}
                              <button type="submit" className="bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-100 px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap">Update Banner</button>
                            </form>
                          </div>
                        </div>

                        {/* Student Document Submissions */}
                        <div className="space-y-3">
                          <h4 className="font-bold text-zinc-100 text-xs uppercase tracking-wider">Student Document Submissions</h4>
                          <div className="space-y-3">
                            {submittedSubmissions.filter(sub => sub.uniId === selectedUni.id).length === 0 ? (
                              <p className="text-xs text-zinc-400">No student documents submitted for this university yet.</p>
                            ) : (
                              submittedSubmissions.filter(sub => sub.uniId === selectedUni.id).map(sub => (
                                <div key={sub.id} className="bg-zinc-950 border border-zinc-800 p-4 rounded-xl space-y-3">
                                  <div className="flex justify-between items-start">
                                    <div>
                                      <h5 className="font-bold text-zinc-100 text-xs">{sub.studentName}</h5>
                                      <p className="text-xs text-zinc-400">{sub.studentEmail}</p>
                                    </div>
                                    <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-md border ${sub.status === 'Approved' ? 'bg-emerald-950/40 text-emerald-400 border-emerald-900/50' : sub.status === 'Rejected' ? 'bg-red-950/40 text-red-400 border-red-900/50' : 'bg-amber-950/40 text-amber-400 border-amber-900/50'}`}>
                                      {sub.status}
                                    </span>
                                  </div>

                                  <div className="flex gap-2 pt-1">
                                    <button onClick={() => handleDocAction(sub.id, 'Approved')} className="bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 px-3 py-1.5 rounded-lg text-xs font-semibold transition">
                                      Approve
                                    </button>
                                    <button onClick={() => handleDocAction(sub.id, 'Rejected')} className="bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 px-3 py-1.5 rounded-lg text-xs font-semibold transition">
                                      Reject
                                    </button>
                                  </div>
                                </div>
                              ))
                            )}
                          </div>
                        </div>

                      </div>
                    )}
                  </div>
                )}

                {/* Organisation Panel */}
                {activeTab === 'manager' && (
                  <div className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-2xl space-y-4">
                    <h3 className="text-base font-bold text-zinc-100">Organisation & Candidate Panel</h3>
                    <p className="text-xs text-zinc-400">Register new election candidates for {selectedUni.name}.</p>
                    <form onSubmit={handleAddCandidate} className="space-y-3">
                      <input type="text" value={candidateName} onChange={(e) => setCandidateName(e.target.value)} placeholder="Candidate Full Name" className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-xs text-zinc-200 outline-none" required />
                      <input type="text" value={candidateParty} onChange={(e) => setCandidateParty(e.target.value)} placeholder="Party Name" className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-xs text-zinc-200 outline-none" required />
                      <button type="submit" className="w-full bg-zinc-100 hover:bg-white text-zinc-900 py-3 rounded-xl font-semibold text-xs transition">
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