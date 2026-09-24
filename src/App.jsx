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
      aadhaar: 'Aadhaar_Verified.pdf',
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
      aadhaar: aadhaarFile || 'Aadhaar.pdf',
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
    <div className={`min-h-screen font-sans relative transition-all duration-300 ${isDark ? 'bg-[#05070c] text-gray-100' : 'bg-gray-50 text-gray-900'}`}>
      
      {/* 3D & 4D Custom CSS Animations & Shaders Injection */}
      <style>{`
        @keyframes floatOrb1 {
          0%, 100% { transform: translate(0px, 0px) scale(1); }
          50% { transform: translate(30px, -40px) scale(1.15); }
        }
        @keyframes floatOrb2 {
          0%, 100% { transform: translate(0px, 0px) scale(1); }
          50% { transform: translate(-40px, 30px) scale(1.2); }
        }
        .animate-orb1 { animation: floatOrb1 9s ease-in-out infinite; }
        .animate-orb2 { animation: floatOrb2 12s ease-in-out infinite; }
        
        .card-3d-tilt {
          transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275), box-shadow 0.4s ease;
          transform-style: preserve-3d;
          perspective: 1000px;
        }
        .card-3d-tilt:hover {
          transform: translateY(-8px) rotateX(3deg) rotateY(-3deg);
          box-shadow: 0 20px 40px -15px rgba(59, 130, 246, 0.3);
        }
      `}</style>

      {/* 4D Dynamic Background Glow Orbs */}
      <div className="absolute top-20 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px] pointer-events-none animate-orb1 z-0"></div>
      <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-[140px] pointer-events-none animate-orb2 z-0"></div>

      {/* Navbar */}
      <nav className={`p-4 border-b sticky top-0 z-50 backdrop-blur-md ${isDark ? 'border-gray-800/80 bg-[#05070c]/80' : 'border-gray-200 bg-white/80'}`}>
        <div className="max-w-7xl mx-auto flex justify-between items-center relative z-10">
          <div className="cursor-pointer flex items-center gap-2 group" onClick={() => { setCurrentView('home'); setSelectedUni(null); }}>
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white font-bold text-sm shadow-md group-hover:rotate-12 transition transform duration-300">U</div>
            <div>
              <h1 className="text-base font-extrabold tracking-tight">UniVote Pro</h1>
              <p className="text-[9px] text-gray-400">3D/4D National Campus Framework</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <button onClick={() => setCurrentView('register-uni')} className="hidden md:block bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 px-3 py-1.5 rounded-xl text-xs font-semibold text-white shadow-md transition transform hover:scale-105">
              🏛️ Register as University
            </button>
            <button onClick={() => setCurrentView('admin-login')} className="bg-gray-800 hover:bg-gray-700 px-3 py-1.5 rounded-xl text-xs font-medium text-gray-300 border border-gray-700 transition">
              🔐 Admin Portal
            </button>
            <button onClick={toggleTheme} className="p-2 rounded-xl border border-gray-700 bg-gray-900/50 text-yellow-400 text-xs transition transform hover:rotate-45">
              {isDark ? '☀️' : '🌙'}
            </button>
            {user ? (
              <div className="flex items-center gap-2 bg-gray-900/80 border border-gray-800 px-3 py-1 rounded-xl">
                <span className="text-xs text-gray-300 font-medium">{user.displayName || user.email}</span>
                <button onClick={handleLogout} className="bg-red-600 hover:bg-red-500 px-2 py-1 rounded-lg text-[10px] text-white font-bold">Logout</button>
              </div>
            ) : (
              <button onClick={handleGoogleLogin} className="bg-blue-600 hover:bg-blue-500 px-4 py-1.5 rounded-xl text-xs font-bold text-white shadow-lg transition transform hover:scale-105">
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
          <div className="py-12 space-y-12">
            <div className="text-center space-y-4 max-w-3xl mx-auto">
              <span className="bg-blue-500/10 text-blue-400 text-[11px] font-bold px-3 py-1 rounded-full border border-blue-500/20 shadow-lg inline-block">
                ✨ Next-Gen 3D Interactive Campus & Faculty Ecosystem
              </span>
              <h2 className="text-5xl font-extrabold tracking-tight bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
                Empowering Higher Education with 3D/4D Motion
              </h2>
              <p className="text-gray-400 text-sm leading-relaxed">
                A secure unified platform featuring 3D animated cards for university registration, faculty salary control, document verification, student records, and digital elections.
              </p>
              <div className="flex justify-center gap-4 pt-4">
                <button onClick={() => setCurrentView('universities')} className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-2xl font-bold text-sm shadow-xl transition transform hover:scale-105">
                  Explore Universities & Portals →
                </button>
                <button onClick={() => setCurrentView('register-uni')} className="bg-gray-900 hover:bg-gray-800 border border-gray-700 text-white px-6 py-3 rounded-2xl font-bold text-sm shadow-xl transition transform hover:scale-105">
                  🏛️ Register New University
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
              <div className="card-3d-tilt bg-gradient-to-b from-gray-900 to-gray-950 border border-gray-800/80 p-6 rounded-3xl shadow-xl group">
                <div className="w-12 h-12 rounded-2xl bg-blue-600/20 text-blue-400 flex items-center justify-center font-bold text-xl mb-4 group-hover:scale-110 transition">👨‍🏫</div>
                <h3 className="text-lg font-bold text-white mb-2">Faculty & Salary Management</h3>
                <p className="text-xs text-gray-400 leading-relaxed">Admin controls for managing faculty rosters, payrolls, and updating monthly compensation packages.</p>
              </div>
              <div className="card-3d-tilt bg-gradient-to-b from-gray-900 to-gray-950 border border-gray-800/80 p-6 rounded-3xl shadow-xl group">
                <div className="w-12 h-12 rounded-2xl bg-emerald-600/20 text-emerald-400 flex items-center justify-center font-bold text-xl mb-4 group-hover:scale-110 transition">🗳️</div>
                <h3 className="text-lg font-bold text-white mb-2">Campus Voting Booth</h3>
                <p className="text-xs text-gray-400 leading-relaxed">Secure, authenticated student voting booths for annual student union elections with live vote tracking.</p>
              </div>
              <div className="card-3d-tilt bg-gradient-to-b from-gray-900 to-gray-950 border border-gray-800/80 p-6 rounded-3xl shadow-xl group">
                <div className="w-12 h-12 rounded-2xl bg-purple-600/20 text-purple-400 flex items-center justify-center font-bold text-xl mb-4 group-hover:scale-110 transition">📊</div>
                <h3 className="text-lg font-bold text-white mb-2">Student Portal & Records</h3>
                <p className="text-xs text-gray-400 leading-relaxed">Dedicated student dashboards to manage subject-wise marks, exam results, fee updates, and events.</p>
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
                <div key={uni.id} className="card-3d-tilt bg-gray-900/90 border border-gray-800 rounded-3xl overflow-hidden shadow-xl flex flex-col justify-between group">
                  <div>
                    <div className="h-44 overflow-hidden relative">
                      <img src={uni.image} alt={uni.name} className="w-full h-full object-cover group-hover:scale-110 transition duration-700" />
                      <span className="absolute top-3 right-3 bg-emerald-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow">{uni.status}</span>
                    </div>
                    <div className="p-5">
                      <h3 className="font-bold text-lg text-white mb-1">{uni.name}</h3>
                      <p className="text-xs text-blue-400 font-medium mb-2">📍 {uni.location}</p>
                      <p className="text-xs text-gray-400 line-clamp-2">{uni.desc}</p>
                    </div>
                  </div>
                  <div className="p-5 pt-0">
                    <button onClick={() => { setSelectedUni(uni); setActiveTab('portal'); }} className="w-full bg-blue-600 hover:bg-blue-500 text-white py-2.5 rounded-xl text-xs font-bold shadow-md transition transform active:scale-95">
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
          <div className="max-w-3xl mx-auto bg-gray-900/90 border border-gray-800 p-8 rounded-3xl shadow-2xl space-y-6 card-3d-tilt">
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

              <button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 py-3.5 rounded-xl font-bold text-sm text-white shadow-lg transition transform hover:scale-[1.01]">
                Submit Application for State & UGC Review
              </button>
            </form>
          </div>
        )}

        {/* 4. Admin Login Portal */}
        {currentView === 'admin-login' && !isAdminLoggedIn && (
          <div className="max-w-md mx-auto bg-gray-900 border border-gray-800 p-8 rounded-3xl shadow-2xl space-y-6 my-12 card-3d-tilt">
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

            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 space-y-4 shadow-xl">
              <h3 className="text-lg font-bold text-white">Pending University Applications</h3>
              <div className="space-y-3">
                {registeredApplications.map(app => (
                  <div key={app.id} className="bg-gray-950 border border-gray-800 p-4 rounded-xl flex justify-between items-center hover:border-blue-500/50 transition">
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
            
            <div className="relative h-56 rounded-3xl overflow-hidden shadow-2xl border border-gray-800 flex items-end p-6 card-3d-tilt">
              <div className="absolute inset-0 bg-cover bg-center filter brightness-50 transition transform hover:scale-105 duration-700" style={{ backgroundImage: `url(${selectedUni.image})` }}></div>
              <div className="absolute inset-0 bg-gradient-to-t from-[#05070c] via-transparent to-transparent"></div>
              <div className="relative z-10">
                <span className="bg-blue-600 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow">Active Campus</span>
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
                  🎓 Student Portal & Dashboard
                </button>
                <button onClick={() => setActiveTab('faculty-portal')} className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-semibold transition ${activeTab === 'faculty-portal' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-300 hover:bg-gray-800'}`}>
                  👨‍🏫 Faculty Marks Management
                </button>
                <button onClick={() => setActiveTab('documents')} className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-semibold transition ${activeTab === 'documents' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-300 hover:bg-gray-800'}`}>
                  📄 Document Verification
                </button>
                <button onClick={() => setActiveTab('uni-admin')} className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-semibold transition ${activeTab === 'uni-admin' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-300 hover:bg-gray-800'}`}>
                  🛡️ Uni Admin Panel (Salary & Docs)
                </button>
                <button onClick={() => setActiveTab('manager')} className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-semibold transition ${activeTab === 'manager' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-300 hover:bg-gray-800'}`}>
                  🏛️ Organisation Panel
                </button>
              </div>

              {/* Main Content Area */}
              <div className="md:col-span-3 space-y-6">

                {/* Overview Tab with Gallery */}
                {activeTab === 'portal' && (
                  <div className="space-y-6">
                    <div className="bg-gray-900 border border-gray-800 p-6 rounded-2xl space-y-4 shadow-xl card-3d-tilt">
                      <h3 className="text-xl font-bold text-white">Welcome to {selectedUni.name} Portal</h3>
                      <p className="text-xs text-gray-300 leading-relaxed">{selectedUni.desc}</p>
                      <div className="grid grid-cols-2 gap-4 pt-4">
                        <div className="bg-gray-950 p-4 rounded-xl border border-gray-800 shadow">
                          <p className="text-[10px] text-gray-400 font-semibold uppercase">Total Registered Candidates</p>
                          <p className="text-2xl font-extrabold text-blue-400 mt-1">{selectedUni.candidates.length}</p>
                        </div>
                        <div className="bg-gray-950 p-4 rounded-xl border border-gray-800 shadow">
                          <p className="text-[10px] text-gray-400 font-semibold uppercase">Verification Status</p>
                          <p className="text-2xl font-extrabold text-emerald-400 mt-1">Verified</p>
                        </div>
                      </div>
                    </div>

                    {/* Campus Gallery Section */}
                    {selectedUni.gallery && selectedUni.gallery.length > 0 && (
                      <div className="bg-gray-900 border border-gray-800 p-6 rounded-2xl space-y-4 shadow-xl">
                        <h4 className="text-lg font-bold text-white">📷 Campus Gallery & Events</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {selectedUni.gallery.map((imgUrl, idx) => (
                            <div key={idx} className="h-48 rounded-xl overflow-hidden border border-gray-800 shadow card-3d-tilt">
                              <img src={imgUrl} alt={`Campus Gallery ${idx + 1}`} className="w-full h-full object-cover hover:scale-110 transition duration-500" />
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
                    <h3 className="text-xl font-bold text-white">Active Election Candidates</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {selectedUni.candidates.map(cand => (
                        <div key={cand.id} className="card-3d-tilt bg-gray-900 border border-gray-800 p-5 rounded-2xl flex justify-between items-center shadow-lg">
                          <div>
                            <h4 className="font-bold text-white text-base">{cand.name}</h4>
                            <p className="text-xs text-blue-400 font-medium">Party: {cand.party}</p>
                            <p className="text-xs text-gray-400 mt-1">Current Votes: <span className="font-bold text-white">{cand.votes}</span></p>
                          </div>
                          <button onClick={() => handleVote(selectedUni.id, cand.id)} className="bg-emerald-600 hover:bg-emerald-500 px-4 py-2 rounded-xl text-xs font-bold text-white shadow-md transition transform active:scale-95">
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
                    
                    {/* 1. Student Dashboard Overview */}
                    <div className="bg-gray-900 border border-gray-800 p-6 rounded-2xl shadow-xl space-y-4 card-3d-tilt">
                      <h3 className="text-xl font-bold text-white">🎓 Student Dashboard Overview</h3>
                      <p className="text-xs text-gray-400">Welcome back! Here is your quick academic summary and stats.</p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-2">
                        <div className="bg-gray-950 p-4 rounded-xl border border-gray-800 shadow">
                          <p className="text-[10px] text-gray-400 font-semibold uppercase">Current CGPA</p>
                          <p className="text-2xl font-extrabold text-blue-400 mt-1">8.92 / 10</p>
                        </div>
                        <div className="bg-gray-950 p-4 rounded-xl border border-gray-800 shadow">
                          <p className="text-[10px] text-gray-400 font-semibold uppercase">Attendance</p>
                          <p className="text-2xl font-extrabold text-emerald-400 mt-1">92.4%</p>
                        </div>
                        <div className="bg-gray-950 p-4 rounded-xl border border-gray-800 shadow">
                          <p className="text-[10px] text-gray-400 font-semibold uppercase">Fee Status</p>
                          <p className="text-2xl font-extrabold text-amber-400 mt-1">1 Pending</p>
                        </div>
                        <div className="bg-gray-950 p-4 rounded-xl border border-gray-800 shadow">
                          <p className="text-[10px] text-gray-400 font-semibold uppercase">Registered Exams</p>
                          <p className="text-2xl font-extrabold text-purple-400 mt-1">6 Subjects</p>
                        </div>
                      </div>
                    </div>

                    {/* 2. Student Marks based on Different Examinations (Real-time dynamic updates) */}
                    <div className="bg-gray-900 border border-gray-800 p-6 rounded-2xl shadow-xl space-y-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="text-xl font-bold text-white">📝 Examination Marks & Grades (Live View)</h3>
                          <p className="text-xs text-gray-400">View live marks entered by the faculty members for Mid-Term, End-Term, and Quizzes.</p>
                        </div>
                      </div>

                      <div className="space-y-3 pt-2">
                        {['Mid-Term Exam', 'End-Term Exam', 'Quiz 1'].map((examName) => (
                          <div key={examName} className="bg-gray-950 border border-gray-800 p-4 rounded-xl space-y-2 shadow">
                            <h4 className="font-bold text-blue-400 text-sm border-b border-gray-800 pb-2">{examName}</h4>
                            <div className="space-y-2 pt-1">
                              {studentMarks.filter(m => m.exam === examName).length === 0 ? (
                                <p className="text-[11px] text-gray-500">No records found for {examName}.</p>
                              ) : (
                                studentMarks.filter(m => m.exam === examName).map(m => (
                                  <div key={m.id} className="flex justify-between items-center bg-gray-900/60 p-2.5 rounded-lg border border-gray-800">
                                    <div>
                                      <h5 className="font-semibold text-white text-xs">{m.subject}</h5>
                                      <p className="text-[11px] text-gray-400">Marks Obtained: <span className="text-white font-bold">{m.marks}</span></p>
                                    </div>
                                    <span className="bg-blue-600/20 text-blue-400 border border-blue-500/30 px-2.5 py-1 rounded-lg text-xs font-bold">
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

                    {/* 3. Student Fees Update & Status */}
                    <div className="bg-gray-900 border border-gray-800 p-6 rounded-2xl shadow-xl space-y-4">
                      <h3 className="text-xl font-bold text-white">💳 Student Fee Dues & Status</h3>
                      <p className="text-xs text-gray-400">Check tuition fee status and clear pending semester payments.</p>
                      
                      <div className="space-y-3">
                        {studentFees.map(fee => (
                          <div key={fee.id} className="bg-gray-950 border border-gray-800 p-4 rounded-xl flex justify-between items-center shadow">
                            <div>
                              <h4 className="font-bold text-white text-sm">{fee.semester}</h4>
                              <p className="text-xs text-gray-400">Amount: <span className="text-white font-semibold">{fee.amount}</span> | Due Date: {fee.dueDate}</p>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className={`text-xs font-bold px-3 py-1 rounded-full border ${fee.status === 'Paid' ? 'bg-emerald-950 text-emerald-400 border-emerald-800' : 'bg-amber-950 text-amber-400 border-amber-800'}`}>
                                {fee.status}
                              </span>
                              {fee.status === 'Pending' && (
                                <button onClick={() => handlePayFee(fee.id)} className="bg-emerald-600 hover:bg-emerald-500 px-3 py-1.5 rounded-xl text-xs font-bold text-white shadow">
                                  Pay Now
                                </button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* 4. Upcoming Events */}
                    <div className="bg-gray-900 border border-gray-800 p-6 rounded-2xl shadow-xl space-y-4">
                      <h3 className="text-xl font-bold text-white">📅 Upcoming Campus Events</h3>
                      <p className="text-xs text-gray-400">Stay updated with upcoming academic and extracurricular schedules.</p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {upcomingEvents.map(evt => (
                          <div key={evt.id} className="card-3d-tilt bg-gray-950 border border-gray-800 p-4 rounded-xl space-y-2 shadow">
                            <span className="bg-blue-600/20 text-blue-400 border border-blue-500/30 px-2.5 py-0.5 rounded text-[10px] font-bold">{evt.date}</span>
                            <h4 className="font-bold text-white text-sm mt-1">{evt.title}</h4>
                            <p className="text-xs text-gray-400">{evt.desc}</p>
                            <p className="text-[11px] text-emerald-400 font-medium">📍 {evt.venue}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>
                )}

                {/* Faculty Portal / Marks Management Tab */}
                {activeTab === 'faculty-portal' && (
                  <div className="bg-gradient-to-b from-gray-900 via-gray-900 to-[#0b0e17] border border-blue-500/30 p-8 rounded-3xl shadow-2xl space-y-8 backdrop-blur-xl card-3d-tilt">
                    
                    {/* Header Banner */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-gray-800/80 pb-5 gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="w-3 h-3 rounded-full bg-blue-500 animate-pulse"></span>
                          <span className="text-[11px] font-bold tracking-wider text-blue-400 uppercase">Faculty Assessment Dashboard</span>
                        </div>
                        <h3 className="text-2xl font-extrabold text-white tracking-tight">Marks & Evaluation Portal</h3>
                        <p className="text-xs text-gray-400">Manage, evaluate, and publish verified student marks and academic grades in real-time.</p>
                      </div>
                      {isFacultyLoggedIn && (
                        <button onClick={() => setIsFacultyLoggedIn(false)} className="bg-red-500/10 hover:bg-red-500/20 text-red-400 px-4 py-2 rounded-xl text-xs font-bold border border-red-500/30 transition shadow-lg flex items-center gap-1.5">
                          🔒 Logout Faculty Session
                        </button>
                      )}
                    </div>

                    {!isFacultyLoggedIn ? (
                      <div className="max-w-md mx-auto bg-gradient-to-b from-gray-950 to-gray-900 border border-gray-800/80 p-8 rounded-3xl shadow-2xl space-y-6 my-6 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl pointer-events-none"></div>
                        <div className="text-center space-y-2">
                          <div className="w-14 h-14 bg-blue-600/20 border border-blue-500/30 text-blue-400 rounded-2xl mx-auto flex items-center justify-center font-bold text-2xl shadow-inner">👨‍🏫</div>
                          <h4 className="font-bold text-white text-lg">Faculty Secure Portal</h4>
                          <p className="text-xs text-gray-400">Please authenticate with your faculty credentials to manage student grades.</p>
                          <div className="bg-blue-950/40 border border-blue-500/20 p-2.5 rounded-xl text-[11px] text-blue-300 font-mono mt-2">
                            🔑 Demo: faculty@univote.com / Faculty@1234
                          </div>
                        </div>
                        <form onSubmit={handleFacultyLogin} className="space-y-4 pt-2">
                          <div>
                            <label className="block text-xs font-semibold text-gray-300 mb-1.5">Faculty Email</label>
                            <input type="email" value={facultyEmail} onChange={(e) => setFacultyEmail(e.target.value)} placeholder="faculty@univote.com" className="w-full bg-gray-900 border border-gray-800 focus:border-blue-500 rounded-xl p-3 text-sm text-white outline-none transition" required />
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-gray-300 mb-1.5">Password</label>
                            <input type="password" value={facultyPassword} onChange={(e) => setFacultyPassword(e.target.value)} placeholder="••••••••" className="w-full bg-gray-900 border border-gray-800 focus:border-blue-500 rounded-xl p-3 text-sm text-white outline-none transition" required />
                          </div>
                          <button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 py-3 rounded-xl font-bold text-sm text-white shadow-xl transition transform active:scale-[0.99]">
                            Authenticate Faculty Login →
                          </button>
                        </form>
                      </div>
                    ) : (
                      <div className="space-y-8">
                        
                        {/* Add Marks Form Box */}
                        <div className="bg-gray-950/80 border border-gray-800/80 p-6 rounded-3xl shadow-xl space-y-4">
                          <div className="flex items-center gap-2 border-b border-gray-800/80 pb-3">
                            <span className="text-lg">✍️</span>
                            <h4 className="font-bold text-white text-sm uppercase tracking-wider">Publish New Student Examination Marks</h4>
                          </div>
                          <form onSubmit={handleAddMark} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <label className="block text-xs font-semibold text-gray-300 mb-1.5">Select Examination Type</label>
                                <select value={newExamType} onChange={(e) => setNewExamType(e.target.value)} className="w-full bg-gray-900 border border-gray-800 focus:border-blue-500 rounded-xl p-3 text-xs text-white outline-none transition">
                                  <option value="Mid-Term Exam">Mid-Term Exam</option>
                                  <option value="End-Term Exam">End-Term Exam</option>
                                  <option value="Quiz 1">Quiz 1</option>
                                </select>
                              </div>
                              <div>
                                <label className="block text-xs font-semibold text-gray-300 mb-1.5">Subject Title</label>
                                <input type="text" value={newSubject} onChange={(e) => setNewSubject(e.target.value)} placeholder="e.g. Artificial Intelligence & ML" className="w-full bg-gray-900 border border-gray-800 focus:border-blue-500 rounded-xl p-3 text-xs text-white outline-none transition" required />
                              </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <label className="block text-xs font-semibold text-gray-300 mb-1.5">Marks Obtained</label>
                                <input type="text" value={newMarks} onChange={(e) => setNewMarks(e.target.value)} placeholder="e.g. 45/50 or 92/100" className="w-full bg-gray-900 border border-gray-800 focus:border-blue-500 rounded-xl p-3 text-xs text-white outline-none transition" required />
                              </div>
                              <div>
                                <label className="block text-xs font-semibold text-gray-300 mb-1.5">Grade Awarded</label>
                                <input type="text" value={newGrade} onChange={(e) => setNewGrade(e.target.value)} placeholder="e.g. A+ or O" className="w-full bg-gray-900 border border-gray-800 focus:border-blue-500 rounded-xl p-3 text-xs text-white outline-none transition" required />
                              </div>
                            </div>
                            <button type="submit" className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 py-3 rounded-xl font-bold text-xs text-white shadow-lg transition">
                              ✓ Publish Marks Instantly to Student Portal
                            </button>
                          </form>
                        </div>

                        {/* Current Marks Table / List with Enhanced UI */}
                        <div className="space-y-4">
                          <div className="flex justify-between items-center">
                            <h4 className="font-bold text-white text-sm uppercase tracking-wider flex items-center gap-2">
                              <span>📋</span> Active Student Grade Records ({studentMarks.length})
                            </h4>
                            <span className="text-xs text-gray-400">Synced live with student accounts</span>
                          </div>

                          <div className="grid grid-cols-1 gap-3">
                            {studentMarks.map(m => (
                              <div key={m.id} className="bg-gray-950/90 border border-gray-800/80 hover:border-blue-500/40 p-4 rounded-2xl flex justify-between items-center transition shadow-md group">
                                <div className="space-y-1">
                                  <div className="flex items-center gap-2">
                                    <span className="bg-blue-600/20 text-blue-400 border border-blue-500/30 px-2.5 py-0.5 rounded-md text-[10px] font-bold">
                                      {m.exam}
                                    </span>
                                  </div>
                                  <h5 className="font-bold text-white text-sm group-hover:text-blue-300 transition">{m.subject}</h5>
                                  <p className="text-xs text-gray-400">
                                    Marks Scored: <span className="text-white font-semibold">{m.marks}</span>
                                  </p>
                                </div>
                                
                                <div className="flex items-center gap-4">
                                  <div className="text-right">
                                    <span className="text-[10px] text-gray-500 uppercase block">Grade</span>
                                    <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3 py-1 rounded-xl text-xs font-black">
                                      {m.grade}
                                    </span>
                                  </div>
                                  <button onClick={() => handleDeleteMark(m.id)} className="bg-red-500/10 hover:bg-red-600 text-red-400 hover:text-white border border-red-500/20 px-3 py-2 rounded-xl text-xs font-semibold transition shadow">
                                    🗑️ Delete
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
                  <div className="bg-gray-900 border border-gray-800 p-6 rounded-2xl shadow-xl space-y-4 card-3d-tilt">
                    <h3 className="text-xl font-bold text-white">Student Verification Document Portal</h3>
                    <p className="text-xs text-gray-400">Upload your identity and academic certificates for {selectedUni.name}.</p>
                    
                    <form onSubmit={handleDocumentSubmit} className="space-y-4">
                      <div>
                        <label className="block text-xs font-semibold text-gray-300 mb-1">Identity Card Document / PDF</label>
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

                {/* University Admin Panel - View Documents, Upload Images & Control Faculty Salaries */}
                {activeTab === 'uni-admin' && (
                  <div className="bg-gray-900 border border-gray-800 p-6 rounded-2xl shadow-xl space-y-6">
                    <div className="flex justify-between items-center border-b border-gray-800 pb-3">
                      <div>
                        <h3 className="text-xl font-bold text-white">University Admin Panel ({selectedUni.name})</h3>
                        <p className="text-xs text-gray-400">Review student documents, manage campus portal images, and control faculty salaries.</p>
                      </div>
                      {isUniAdminLoggedIn && (
                        <button onClick={() => setIsUniAdminLoggedIn(false)} className="bg-red-600/20 text-red-400 px-3 py-1 rounded-lg text-xs font-bold border border-red-500/30">Logout Uni Admin</button>
                      )}
                    </div>

                    {!isUniAdminLoggedIn ? (
                      <div className="max-w-md mx-auto bg-gray-950 border border-gray-800 p-6 rounded-2xl space-y-4 my-4 shadow">
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
                      <div className="space-y-6">
                        
                        {/* Faculty Salary Control & Payroll Section */}
                        <div className="bg-gray-950 border border-gray-800 p-5 rounded-2xl space-y-5 shadow">
                          <h4 className="font-bold text-white text-sm">💵 Faculty Salary & Payroll Control</h4>
                          <p className="text-xs text-gray-400">Manage faculty members' monthly salary compensation packages and add new faculty members.</p>
                          
                          {/* Add New Faculty Form */}
                          <form onSubmit={handleAddFaculty} className="bg-gray-900 border border-gray-800 p-4 rounded-xl space-y-3">
                            <h5 className="font-semibold text-blue-400 text-xs">➕ Add New Faculty Member to Payroll</h5>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                              <input type="text" value={newFacultyName} onChange={(e) => setNewFacultyName(e.target.value)} placeholder="Faculty Full Name" className="bg-gray-950 border border-gray-800 rounded-xl p-2.5 text-xs text-white" required />
                              <input type="text" value={newFacultyDept} onChange={(e) => setNewFacultyDept(e.target.value)} placeholder="Department Name" className="bg-gray-950 border border-gray-800 rounded-xl p-2.5 text-xs text-white" required />
                              <input type="text" value={newFacultySalary} onChange={(e) => setNewFacultySalary(e.target.value)} placeholder="Monthly Salary (e.g. ₹90,000)" className="bg-gray-950 border border-gray-800 rounded-xl p-2.5 text-xs text-white" required />
                            </div>
                            <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-500 py-2 rounded-xl text-xs font-bold text-white shadow">
                              Add Faculty & Set Salary
                            </button>
                          </form>

                          {/* Existing Faculty Salaries List & Editor */}
                          <div className="space-y-3 pt-2">
                            <h5 className="font-semibold text-white text-xs">📋 Current Faculty Salary List</h5>
                            <div className="space-y-2">
                              {facultySalaries.map(fac => (
                                <div key={fac.id} className="bg-gray-900 border border-gray-800 p-3.5 rounded-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
                                  <div>
                                    <h6 className="font-bold text-white text-xs">{fac.name}</h6>
                                    <p className="text-[11px] text-gray-400">Dept: <span className="text-blue-400 font-medium">{fac.dept}</span></p>
                                  </div>
                                  <div className="flex items-center gap-2 w-full md:w-auto">
                                    <input 
                                      type="text" 
                                      defaultValue={fac.salary} 
                                      onBlur={(e) => handleUpdateSalary(fac.id, e.target.value)}
                                      className="bg-gray-950 border border-gray-800 rounded-lg p-1.5 text-xs text-emerald-400 font-bold w-28 text-center" 
                                      title="Click outside to save updated salary"
                                    />
                                    <span className="text-[10px] text-gray-500">(Edit & click outside)</span>
                                    <button onClick={() => handleDeleteFaculty(fac.id)} className="bg-red-600/20 hover:bg-red-600 text-red-400 hover:text-white px-2.5 py-1.5 rounded-lg text-xs font-semibold transition ml-auto">
                                      Remove
                                    </button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Image Upload & Management Section */}
                        <div className="bg-gray-950 border border-gray-800 p-5 rounded-2xl space-y-5 shadow">
                          <h4 className="font-bold text-white text-sm">🖼️ Manage University Portal Images</h4>
                          
                          <div className="space-y-2 border-b border-gray-800 pb-4">
                            <div className="flex justify-between items-center">
                              <label className="text-xs font-semibold text-gray-300">Update Header Banner Image</label>
                              <div className="flex gap-1 bg-gray-900 p-1 rounded-lg border border-gray-800 text-[10px]">
                                <button type="button" onClick={() => setBannerInputType('url')} className={`px-2 py-0.5 rounded ${bannerInputType === 'url' ? 'bg-blue-600 text-white font-bold' : 'text-gray-400'}`}>Paste URL</button>
                                <button type="button" onClick={() => setBannerInputType('file')} className={`px-2 py-0.5 rounded ${bannerInputType === 'file' ? 'bg-blue-600 text-white font-bold' : 'text-gray-400'}`}>Choose File</button>
                              </div>
                            </div>

                            <form onSubmit={handleUpdateBanner} className="flex gap-2 pt-1">
                              {bannerInputType === 'url' ? (
                                <input type="text" value={newBannerImage} onChange={(e) => setNewBannerImage(e.target.value)} placeholder="https://images.unsplash.com/photo-..." className="flex-1 bg-gray-900 border border-gray-800 rounded-xl p-2.5 text-xs text-white" />
                              ) : (
                                <input type="file" accept="image/*" onChange={(e) => setBannerFileObj(e.target.files[0])} className="flex-1 bg-gray-900 border border-gray-800 rounded-xl p-1.5 text-xs text-gray-300 file:mr-2 file:py-1 file:px-2 file:rounded-lg file:border-0 file:text-[10px] file:font-semibold file:bg-blue-600 file:text-white cursor-pointer" />
                              )}
                              <button type="submit" className="bg-blue-600 hover:bg-blue-500 px-4 py-2.5 rounded-xl text-xs font-bold text-white whitespace-nowrap">Update Banner</button>
                            </form>
                          </div>

                          <div className="space-y-2">
                            <div className="flex justify-between items-center">
                              <label className="text-xs font-semibold text-gray-300">Add Campus / Event Photo to Gallery</label>
                              <div className="flex gap-1 bg-gray-900 p-1 rounded-lg border border-gray-800 text-[10px]">
                                <button type="button" onClick={() => setGalleryInputType('url')} className={`px-2 py-0.5 rounded ${galleryInputType === 'url' ? 'bg-emerald-600 text-white font-bold' : 'text-gray-400'}`}>Paste URL</button>
                                <button type="button" onClick={() => setGalleryInputType('file')} className={`px-2 py-0.5 rounded ${galleryInputType === 'file' ? 'bg-emerald-600 text-white font-bold' : 'text-gray-400'}`}>Choose File</button>
                              </div>
                            </div>

                            <form onSubmit={handleAddGalleryImage} className="flex gap-2 pt-1">
                              {galleryInputType === 'url' ? (
                                <input type="text" value={newGalleryImage} onChange={(e) => setNewGalleryImage(e.target.value)} placeholder="https://images.unsplash.com/photo-..." className="flex-1 bg-gray-900 border border-gray-800 rounded-xl p-2.5 text-xs text-white" />
                              ) : (
                                <input type="file" accept="image/*" onChange={(e) => setGalleryFileObj(e.target.files[0])} className="flex-1 bg-gray-900 border border-gray-800 rounded-xl p-1.5 text-xs text-gray-300 file:mr-2 file:py-1 file:px-2 file:rounded-lg file:border-0 file:text-[10px] file:font-semibold file:bg-emerald-600 file:text-white cursor-pointer" />
                              )}
                              <button type="submit" className="bg-emerald-600 hover:bg-emerald-500 px-4 py-2.5 rounded-xl text-xs font-bold text-white whitespace-nowrap">Add Photo</button>
                            </form>
                          </div>

                        </div>

                        {/* Student Document Submissions */}
                        <div className="space-y-4">
                          <h4 className="font-bold text-white text-sm">Student Document Submissions</h4>
                          <div className="space-y-4">
                            {submittedSubmissions.filter(sub => sub.uniId === selectedUni.id).length === 0 ? (
                              <p className="text-xs text-gray-400">No student documents submitted for this university yet.</p>
                            ) : (
                              submittedSubmissions.filter(sub => sub.uniId === selectedUni.id).map(sub => (
                                <div key={sub.id} className="bg-gray-950 border border-gray-800 p-4 rounded-xl space-y-3 shadow">
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
                                    <div>📌 ID Doc: <span className="text-blue-400 font-medium">{sub.aadhaar}</span></div>
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
                      </div>
                    )}
                  </div>
                )}

                {/* Organisation Panel / Candidate Manager Tab */}
                {activeTab === 'manager' && (
                  <div className="bg-gray-900 border border-gray-800 p-6 rounded-2xl shadow-xl space-y-4 card-3d-tilt">
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