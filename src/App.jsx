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

  // Slideshow State for Hero Carousel
  const [currentSlide, setCurrentSlide] = useState(0);

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

  // Unique Universities Data with Slideshow Highlights
  const [universities, setUniversities] = useState([
    { 
      id: 'graphic-era', 
      name: 'Graphic Era University', 
      location: 'Dehradun, Uttarakhand', 
      desc: 'Graphic Era (Deemed to be University) student union election & management portal.', 
      eligible: '18,500+',
      status: 'Approved',
      image: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=1200&q=80',
      tagline: 'Excellence in Innovation & Research',
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
      tagline: 'Global Education & World-Class Infrastructure',
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
      tagline: 'Transforming Education, Transforming India',
      gallery: [
        'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=800&q=80'
      ],
      candidates: [
        { id: 1, name: 'Simran Kaur', party: 'Panther Group', votes: 210 },
        { id: 2, name: 'Rohit Gupta', party: 'Students Voice', votes: 180 }
      ]
    }
  ]);

  // Automatic Hero Slideshow Effect
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % universities.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [universities.length]);

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
      tagline: 'Approved Center of Academic Excellence',
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
    <div className={`min-h-screen font-sans relative overflow-x-hidden transition-colors duration-300 ${isDark ? 'bg-[#0b0b0f] text-zinc-100' : 'bg-gradient-to-br from-slate-50 via-indigo-50/20 to-blue-50/30 text-slate-800'}`}>

      {/* Navbar */}
      <nav className={`p-4 border-b sticky top-0 z-50 backdrop-blur-xl transition-colors ${isDark ? 'border-zinc-800/80 bg-[#0b0b0f]/85' : 'border-slate-200/80 bg-white/85 shadow-sm'}`}>
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="cursor-pointer flex items-center gap-3 group" onClick={() => { setCurrentView('home'); setSelectedUni(null); }}>
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs tracking-tight shadow-md transition-transform group-hover:scale-105 ${isDark ? 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white' : 'bg-gradient-to-br from-indigo-600 to-blue-600 text-white'}`}>U</div>
            <div>
              <h1 className={`text-sm font-bold tracking-tight ${isDark ? 'text-zinc-100' : 'text-slate-900'}`}>UniVote Pro</h1>
              <p className={`text-[10px] font-medium ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>Campus Management Framework</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2.5">
            <button onClick={() => setCurrentView('register-uni')} className={`hidden md:flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all shadow-sm ${isDark ? 'bg-zinc-900 hover:bg-zinc-800 border border-zinc-700/80 text-zinc-200' : 'bg-white hover:bg-slate-100 border border-slate-200 text-slate-700'}`}>
              🏛️ Register University
            </button>
            <button onClick={() => setCurrentView('admin-login')} className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all shadow-sm ${isDark ? 'bg-zinc-900 hover:bg-zinc-800 border border-zinc-700/80 text-zinc-200' : 'bg-white hover:bg-slate-100 border border-slate-200 text-slate-700'}`}>
              🔐 Admin Portal
            </button>
            <button onClick={toggleTheme} className={`p-2 rounded-xl border text-xs transition-all shadow-sm ${isDark ? 'border-zinc-700 bg-zinc-900 hover:bg-zinc-800 text-amber-400' : 'border-slate-200 bg-white hover:bg-slate-100 text-indigo-600'}`}>
              {isDark ? '☀️ Light' : '🌙 Dark'}
            </button>
            {user ? (
              <div className={`flex items-center gap-2 px-3 py-1 rounded-xl border ${isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-slate-200 shadow-sm'}`}>
                <span className={`text-xs font-medium ${isDark ? 'text-zinc-300' : 'text-slate-700'}`}>{user.displayName || user.email}</span>
                <button onClick={handleLogout} className="bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 px-2 py-0.5 rounded text-[10px] font-semibold transition">Logout</button>
              </div>
            ) : (
              <button onClick={handleGoogleLogin} className={`px-4 py-1.5 rounded-xl text-xs font-bold shadow-md transition-all ${isDark ? 'bg-zinc-100 hover:bg-white text-zinc-900' : 'bg-indigo-600 hover:bg-indigo-700 text-white'}`}>
                Sign in with Google
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* Main Container */}
      <main className="p-6 max-w-7xl mx-auto relative z-10">

        {/* 1. Landing Page with Slideshow Carousel */}
        {currentView === 'home' && !selectedUni && (
          <div className="py-8 space-y-16">
            
            {/* Hero Slideshow Section */}
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-indigo-500/20 group">
              <div className="absolute inset-0 bg-cover bg-center transition-all duration-1000 transform scale-105 filter brightness-50" style={{ backgroundImage: `url(${universities[currentSlide].image})` }}></div>
              <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/60 to-transparent"></div>
              
              <div className="relative z-10 p-8 md:p-14 max-w-2xl space-y-5">
                <span className="inline-flex items-center gap-2 bg-indigo-500/20 backdrop-blur-md text-indigo-300 text-xs font-bold px-3.5 py-1.5 rounded-full border border-indigo-500/30">
                  <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse"></span>
                  Featured Campus Showcase • {currentSlide + 1} of {universities.length}
                </span>
                <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white leading-tight">
                  {universities[currentSlide].name}
                </h2>
                <p className="text-indigo-200 text-xs md:text-sm font-medium tracking-wide">
                  📍 {universities[currentSlide].location} | ✨ {universities[currentSlide].tagline}
                </p>
                <p className="text-zinc-300 text-xs md:text-sm leading-relaxed line-clamp-2">
                  {universities[currentSlide].desc}
                </p>
                <div className="flex flex-wrap gap-3 pt-2">
                  <button onClick={() => { setSelectedUni(universities[currentSlide]); setActiveTab('portal'); }} className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-xl font-bold text-xs shadow-lg transition-all transform hover:-translate-y-0.5">
                    Explore University Portal →
                  </button>
                  <button onClick={() => setCurrentView('universities')} className="bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white px-5 py-3 rounded-xl font-bold text-xs transition-all">
                    View All Universities
                  </button>
                </div>
              </div>

              {/* Carousel Navigation Arrows */}
              <div className="absolute bottom-6 right-6 flex items-center gap-2 z-20">
                <button onClick={() => setCurrentSlide((currentSlide - 1 + universities.length) % universities.length)} className="w-9 h-9 rounded-full bg-black/50 hover:bg-black/80 backdrop-blur-md border border-white/20 text-white flex items-center justify-center text-xs transition">‹</button>
                <div className="flex gap-1.5 px-2">
                  {universities.map((_, idx) => (
                    <button key={idx} onClick={() => setCurrentSlide(idx)} className={`h-2 rounded-full transition-all ${currentSlide === idx ? 'w-6 bg-indigo-500' : 'w-2 bg-white/40'}`} />
                  ))}
                </div>
                <button onClick={() => setCurrentSlide((currentSlide + 1) % universities.length)} className="w-9 h-9 rounded-full bg-black/50 hover:bg-black/80 backdrop-blur-md border border-white/20 text-white flex items-center justify-center text-xs transition">›</button>
              </div>
            </div>

            <div className="text-center space-y-4 max-w-3xl mx-auto pt-4">
              <h3 className="text-2xl md:text-3xl font-extrabold tracking-tight">
                Modernizing Higher Education Administration
              </h3>
              <p className={`text-xs md:text-sm leading-relaxed ${isDark ? 'text-zinc-400' : 'text-slate-600'}`}>
                A clean, attractive framework featuring secure university registrations, faculty payroll controls, student academic tracking, and encrypted digital elections.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
              <div className={`p-7 rounded-3xl transition-all duration-300 hover:-translate-y-1 shadow-sm border ${isDark ? 'bg-zinc-950/70 border-zinc-800/80 hover:border-indigo-500/50' : 'bg-white border-slate-200 hover:border-indigo-300 shadow-indigo-50/50'}`}>
                <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-500 flex items-center justify-center font-bold text-base mb-5 shadow-inner">👨‍🏫</div>
                <h4 className={`text-sm font-bold mb-2 ${isDark ? 'text-zinc-100' : 'text-slate-900'}`}>Faculty & Salary Management</h4>
                <p className={`text-xs leading-relaxed ${isDark ? 'text-zinc-400' : 'text-slate-600'}`}>Admin controls for managing faculty rosters, payrolls, and updating monthly compensation packages securely.</p>
              </div>
              <div className={`p-7 rounded-3xl transition-all duration-300 hover:-translate-y-1 shadow-sm border ${isDark ? 'bg-zinc-950/70 border-zinc-800/80 hover:border-indigo-500/50' : 'bg-white border-slate-200 hover:border-indigo-300 shadow-indigo-50/50'}`}>
                <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-500 flex items-center justify-center font-bold text-base mb-5 shadow-inner">🗳️</div>
                <h4 className={`text-sm font-bold mb-2 ${isDark ? 'text-zinc-100' : 'text-slate-900'}`}>Campus Voting Booth</h4>
                <p className={`text-xs leading-relaxed ${isDark ? 'text-zinc-400' : 'text-slate-600'}`}>Secure, authenticated student voting booths for annual student union elections with live vote tallying.</p>
              </div>
              <div className={`p-7 rounded-3xl transition-all duration-300 hover:-translate-y-1 shadow-sm border ${isDark ? 'bg-zinc-950/70 border-zinc-800/80 hover:border-indigo-500/50' : 'bg-white border-slate-200 hover:border-indigo-300 shadow-indigo-50/50'}`}>
                <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-500 flex items-center justify-center font-bold text-base mb-5 shadow-inner">📊</div>
                <h4 className={`text-sm font-bold mb-2 ${isDark ? 'text-zinc-100' : 'text-slate-900'}`}>Student Portal & Records</h4>
                <p className={`text-xs leading-relaxed ${isDark ? 'text-zinc-400' : 'text-slate-600'}`}>Dedicated student dashboards to manage subject-wise marks, exam results, fee updates, and academic events.</p>
              </div>
            </div>
          </div>
        )}

        {/* 2. Universities List View */}
        {currentView === 'universities' && !selectedUni && (
          <div className="space-y-6">
            <div className={`p-6 rounded-3xl border flex justify-between items-center ${isDark ? 'bg-zinc-950/70 border-zinc-800' : 'bg-white border-slate-200 shadow-sm'}`}>
              <div>
                <h2 className="text-lg font-extrabold">Approved Universities & Campuses</h2>
                <p className={`text-xs mt-0.5 ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>Select an institution to access its dedicated portal and voting booth.</p>
              </div>
              <button onClick={() => setCurrentView('home')} className={`text-xs font-bold px-4 py-2 rounded-xl border transition ${isDark ? 'bg-zinc-900 border-zinc-700 text-zinc-300 hover:bg-zinc-800' : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'}`}>← Back to Home</button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {universities.map(uni => (
                <div key={uni.id} className={`rounded-3xl overflow-hidden border transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between group ${isDark ? 'bg-zinc-950/70 border-zinc-800 hover:border-indigo-500/50' : 'bg-white border-slate-200 hover:border-indigo-300 shadow-sm'}`}>
                  <div>
                    <div className="h-48 overflow-hidden relative">
                      <img src={uni.image} alt={uni.name} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
                      <span className="absolute top-3 right-3 bg-black/60 backdrop-blur-md text-emerald-400 border border-emerald-500/30 text-[10px] font-bold px-2.5 py-1 rounded-full">✓ {uni.status}</span>
                    </div>
                    <div className="p-6 space-y-2">
                      <h3 className="font-bold text-sm">{uni.name}</h3>
                      <p className={`text-xs font-semibold ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>📍 {uni.location}</p>
                      <p className={`text-xs line-clamp-2 leading-relaxed ${isDark ? 'text-zinc-400' : 'text-slate-600'}`}>{uni.desc}</p>
                    </div>
                  </div>
                  <div className="p-6 pt-0">
                    <button onClick={() => { setSelectedUni(uni); setActiveTab('portal'); }} className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-3 rounded-2xl text-xs font-bold shadow-md transition-all">
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
          <div className={`max-w-3xl mx-auto p-8 rounded-3xl border shadow-xl space-y-6 ${isDark ? 'bg-zinc-950/90 border-zinc-800' : 'bg-white border-slate-200'}`}>
            <div className="flex justify-between items-center border-b pb-4 border-zinc-800/40">
              <div>
                <h2 className="text-lg font-extrabold">University Registration Portal</h2>
                <p className={`text-xs mt-0.5 ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>Sponsoring Body → State Govt → UGC Setup Route Application Form</p>
              </div>
              <button onClick={() => setCurrentView('home')} className={`text-xs font-bold ${isDark ? 'text-zinc-400 hover:text-white' : 'text-slate-500 hover:text-slate-800'}`}>Cancel</button>
            </div>

            <form onSubmit={handleUniversityRegistration} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={`block text-xs font-bold mb-1.5 ${isDark ? 'text-zinc-300' : 'text-slate-700'}`}>University Name</label>
                  <input type="text" value={regUniName} onChange={(e) => setRegUniName(e.target.value)} placeholder="e.g. Apex International University" className={`w-full rounded-2xl p-3.5 text-xs outline-none border transition ${isDark ? 'bg-zinc-900 border-zinc-800 text-zinc-100 focus:border-indigo-500' : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-indigo-600'}`} required />
                </div>
                <div>
                  <label className={`block text-xs font-bold mb-1.5 ${isDark ? 'text-zinc-300' : 'text-slate-700'}`}>Location (State / City)</label>
                  <input type="text" value={regLocation} onChange={(e) => setRegLocation(e.target.value)} placeholder="e.g. Ranchi, Jharkhand" className={`w-full rounded-2xl p-3.5 text-xs outline-none border transition ${isDark ? 'bg-zinc-900 border-zinc-800 text-zinc-100 focus:border-indigo-500' : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-indigo-600'}`} required />
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <h3 className="text-xs font-bold text-indigo-400 uppercase tracking-wider">A. Sponsoring Body Documents</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <input type="text" value={regTrustDeed} onChange={(e) => setRegTrustDeed(e.target.value)} placeholder="Trust Deed / Society Reg. Number" className={`w-full rounded-2xl p-3.5 text-xs outline-none border ${isDark ? 'bg-zinc-900 border-zinc-800 text-zinc-100' : 'bg-slate-50 border-slate-200 text-slate-900'}`} required />
                  <input type="text" value={regPan} onChange={(e) => setRegPan(e.target.value)} placeholder="Trust PAN Number" className={`w-full rounded-2xl p-3.5 text-xs outline-none border ${isDark ? 'bg-zinc-900 border-zinc-800 text-zinc-100' : 'bg-slate-50 border-slate-200 text-slate-900'}`} required />
                </div>

                <h3 className="text-xs font-bold text-indigo-400 uppercase tracking-wider pt-2">B. Land & Infrastructure (Min 50 Acres)</h3>
                <input type="text" value={regLandDoc} onChange={(e) => setRegLandDoc(e.target.value)} placeholder="Sale Deed / CLU Certificate Link or Ref" className={`w-full rounded-2xl p-3.5 text-xs outline-none border ${isDark ? 'bg-zinc-900 border-zinc-800 text-zinc-100' : 'bg-slate-50 border-slate-200 text-slate-900'}`} required />

                <h3 className="text-xs font-bold text-indigo-400 uppercase tracking-wider pt-2">C. Financial Documents</h3>
                <input type="text" value={regCorpusFund} onChange={(e) => setRegCorpusFund(e.target.value)} placeholder="Corpus Fund Proof (Rs 25 Cr FD Ref)" className={`w-full rounded-2xl p-3.5 text-xs outline-none border ${isDark ? 'bg-zinc-900 border-zinc-800 text-zinc-100' : 'bg-slate-50 border-slate-200 text-slate-900'}`} required />
              </div>

              <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-3.5 rounded-2xl font-bold text-xs shadow-lg transition-all">
                Submit Application for State & UGC Review →
              </button>
            </form>
          </div>
        )}

        {/* 4. Admin Login Portal */}
        {currentView === 'admin-login' && !isAdminLoggedIn && (
          <div className={`max-w-md mx-auto p-8 rounded-3xl border shadow-xl space-y-6 my-12 ${isDark ? 'bg-zinc-950/90 border-zinc-800' : 'bg-white border-slate-200'}`}>
            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-indigo-500/10 border border-indigo-500/20 text-indigo-500 rounded-2xl mx-auto flex items-center justify-center font-bold text-base shadow-inner">🔐</div>
              <h2 className="text-base font-extrabold">Global Admin Secure Login</h2>
              <p className={`text-xs ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>Enter admin credentials to manage university approvals.</p>
            </div>
            <form onSubmit={handleAdminLogin} className="space-y-4">
              <div>
                <label className={`block text-xs font-bold mb-1.5 ${isDark ? 'text-zinc-300' : 'text-slate-700'}`}>Admin Email ID</label>
                <input type="email" value={adminEmail} onChange={(e) => setAdminEmail(e.target.value)} placeholder="admin@univote.com" className={`w-full rounded-2xl p-3.5 text-xs outline-none border ${isDark ? 'bg-zinc-900 border-zinc-800 text-zinc-100' : 'bg-slate-50 border-slate-200 text-slate-900'}`} required />
              </div>
              <div>
                <label className={`block text-xs font-bold mb-1.5 ${isDark ? 'text-zinc-300' : 'text-slate-700'}`}>Password</label>
                <input type="password" value={adminPassword} onChange={(e) => setAdminPassword(e.target.value)} placeholder="••••••••" className={`w-full rounded-2xl p-3.5 text-xs outline-none border ${isDark ? 'bg-zinc-900 border-zinc-800 text-zinc-100' : 'bg-slate-50 border-slate-200 text-slate-900'}`} required />
              </div>
              <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-3.5 rounded-2xl font-bold text-xs shadow-md transition">
                Login as Global Admin
              </button>
              <div className="text-center pt-2">
                <button type="button" onClick={() => setCurrentView('home')} className={`text-xs font-bold ${isDark ? 'text-zinc-400 hover:text-white' : 'text-slate-500 hover:text-slate-800'}`}>← Return to Home</button>
              </div>
            </form>
          </div>
        )}

        {/* 5. Admin Dashboard */}
        {currentView === 'admin-panel' && isAdminLoggedIn && (
          <div className="space-y-6">
            <div className={`p-6 rounded-3xl border flex justify-between items-center ${isDark ? 'bg-zinc-950/70 border-zinc-800' : 'bg-white border-slate-200 shadow-sm'}`}>
              <div>
                <h2 className="text-lg font-extrabold">Global Admin Control Panel</h2>
                <p className={`text-xs mt-0.5 ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>Review sponsoring body documents and approve university applications.</p>
              </div>
              <button onClick={() => { setIsAdminLoggedIn(false); setCurrentView('home'); }} className="bg-red-500/10 hover:bg-red-500/20 text-red-400 px-4 py-2 rounded-xl text-xs font-bold border border-red-500/20 transition">Logout Admin</button>
            </div>

            <div className={`p-6 rounded-3xl border space-y-4 ${isDark ? 'bg-zinc-950/70 border-zinc-800' : 'bg-white border-slate-200 shadow-sm'}`}>
              <h3 className="text-sm font-bold">Pending University Applications</h3>
              <div className="space-y-3">
                {registeredApplications.map(app => (
                  <div key={app.id} className={`p-4 rounded-2xl border flex justify-between items-center transition-all ${isDark ? 'bg-zinc-900/50 border-zinc-800 hover:border-zinc-700' : 'bg-slate-50 border-slate-200'}`}>
                    <div>
                      <h4 className="font-bold text-xs">{app.name}</h4>
                      <p className={`text-xs mt-0.5 ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>📍 {app.location} | Trust: {app.trust}</p>
                      <p className={`text-[11px] mt-1 ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>Status: <span className="text-amber-400 font-bold">{app.status}</span></p>
                    </div>
                    {app.status === 'Pending Approval' ? (
                      <button onClick={() => handleApproveUni(app.id)} className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2.5 rounded-xl text-xs font-bold shadow-md transition">
                        Approve & Publish
                      </button>
                    ) : (
                      <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-xl border border-emerald-500/20">✓ Approved</span>
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
            <button onClick={() => setSelectedUni(null)} className={`text-xs font-bold ${isDark ? 'text-zinc-400 hover:text-white' : 'text-slate-500 hover:text-slate-800'}`}>← Back to Universities</button>
            
            <div className="relative h-60 rounded-3xl overflow-hidden border border-indigo-500/20 flex items-end p-7 shadow-xl">
              <div className="absolute inset-0 bg-cover bg-center filter brightness-50" style={{ backgroundImage: `url(${selectedUni.image})` }}></div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
              <div className="relative z-10 space-y-2">
                <span className="bg-indigo-600/80 backdrop-blur-md text-white text-[10px] font-bold px-3 py-1 rounded-lg uppercase tracking-wider">Active Campus</span>
                <h2 className="text-2xl md:text-3xl font-extrabold text-white">{selectedUni.name}</h2>
                <p className="text-xs text-zinc-300 font-medium">📍 {selectedUni.location} • Eligible Voters: <span className="text-white font-bold">{selectedUni.eligible}</span></p>
              </div>
            </div>

            {/* University Portal Layout (Sidebar + Content) */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              
              {/* Sidebar Options */}
              <div className={`p-3 rounded-3xl border space-y-1 h-fit ${isDark ? 'bg-zinc-950/70 border-zinc-800' : 'bg-white border-slate-200 shadow-sm'}`}>
                <p className="text-[10px] font-extrabold text-indigo-400 uppercase tracking-wider px-3 py-2">University Menu</p>
                <button onClick={() => setActiveTab('portal')} className={`w-full text-left px-3.5 py-3 rounded-2xl text-xs font-bold transition-all ${activeTab === 'portal' ? 'bg-indigo-600 text-white shadow-md' : isDark ? 'text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'}`}>
                  🏠 University Overview
                </button>
                <button onClick={() => setActiveTab('voting')} className={`w-full text-left px-3.5 py-3 rounded-2xl text-xs font-bold transition-all ${activeTab === 'voting' ? 'bg-indigo-600 text-white shadow-md' : isDark ? 'text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'}`}>
                  🗳️ Voting Booth
                </button>
                <button onClick={() => setActiveTab('student-portal')} className={`w-full text-left px-3.5 py-3 rounded-2xl text-xs font-bold transition-all ${activeTab === 'student-portal' ? 'bg-indigo-600 text-white shadow-md' : isDark ? 'text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'}`}>
                  🎓 Student Portal & Dashboard
                </button>
                <button onClick={() => setActiveTab('faculty-portal')} className={`w-full text-left px-3.5 py-3 rounded-2xl text-xs font-bold transition-all ${activeTab === 'faculty-portal' ? 'bg-indigo-600 text-white shadow-md' : isDark ? 'text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'}`}>
                  👨‍🏫 Faculty Marks Management
                </button>
                <button onClick={() => setActiveTab('documents')} className={`w-full text-left px-3.5 py-3 rounded-2xl text-xs font-bold transition-all ${activeTab === 'documents' ? 'bg-indigo-600 text-white shadow-md' : isDark ? 'text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'}`}>
                  📄 Document Verification
                </button>
                <button onClick={() => setActiveTab('uni-admin')} className={`w-full text-left px-3.5 py-3 rounded-2xl text-xs font-bold transition-all ${activeTab === 'uni-admin' ? 'bg-indigo-600 text-white shadow-md' : isDark ? 'text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'}`}>
                  🛡️ Uni Admin Panel
                </button>
                <button onClick={() => setActiveTab('manager')} className={`w-full text-left px-3.5 py-3 rounded-2xl text-xs font-bold transition-all ${activeTab === 'manager' ? 'bg-indigo-600 text-white shadow-md' : isDark ? 'text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'}`}>
                  🏛️ Organisation Panel
                </button>
              </div>

              {/* Main Content Area */}
              <div className="md:col-span-3 space-y-6">

                {/* Overview Tab with Gallery */}
                {activeTab === 'portal' && (
                  <div className="space-y-6">
                    <div className={`p-7 rounded-3xl border space-y-4 ${isDark ? 'bg-zinc-950/70 border-zinc-800' : 'bg-white border-slate-200 shadow-sm'}`}>
                      <h3 className="text-base font-extrabold">Welcome to {selectedUni.name} Portal</h3>
                      <p className={`text-xs leading-relaxed ${isDark ? 'text-zinc-300' : 'text-slate-600'}`}>{selectedUni.desc}</p>
                      <div className="grid grid-cols-2 gap-4 pt-2">
                        <div className={`p-4 rounded-2xl border ${isDark ? 'bg-zinc-900/60 border-zinc-800' : 'bg-slate-50 border-slate-200'}`}>
                          <p className="text-[10px] font-extrabold text-indigo-400 uppercase">Total Candidates</p>
                          <p className="text-2xl font-extrabold mt-1">{selectedUni.candidates.length}</p>
                        </div>
                        <div className={`p-4 rounded-2xl border ${isDark ? 'bg-zinc-900/60 border-zinc-800' : 'bg-slate-50 border-slate-200'}`}>
                          <p className="text-[10px] font-extrabold text-indigo-400 uppercase">Verification Status</p>
                          <p className="text-2xl font-extrabold text-emerald-400 mt-1">Verified</p>
                        </div>
                      </div>
                    </div>

                    {/* Campus Gallery Section */}
                    {selectedUni.gallery && selectedUni.gallery.length > 0 && (
                      <div className={`p-7 rounded-3xl border space-y-4 ${isDark ? 'bg-zinc-950/70 border-zinc-800' : 'bg-white border-slate-200 shadow-sm'}`}>
                        <h4 className="text-sm font-extrabold">📷 Campus Gallery & Events</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {selectedUni.gallery.map((imgUrl, idx) => (
                            <div key={idx} className="h-48 rounded-2xl overflow-hidden border border-zinc-800/80 group">
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
                    <h3 className="text-base font-extrabold">Active Election Candidates</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {selectedUni.candidates.map(cand => (
                        <div key={cand.id} className={`p-6 rounded-3xl border flex justify-between items-center transition-all ${isDark ? 'bg-zinc-950/70 border-zinc-800 hover:border-indigo-500/50' : 'bg-white border-slate-200 shadow-sm'}`}>
                          <div>
                            <h4 className="font-bold text-sm">{cand.name}</h4>
                            <p className={`text-xs mt-1 ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>Party: <span className="font-bold">{cand.party}</span></p>
                            <p className={`text-xs mt-1 ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>Current Votes: <span className="font-extrabold">{cand.votes}</span></p>
                          </div>
                          <button onClick={() => handleVote(selectedUni.id, cand.id)} className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2.5 rounded-xl text-xs font-bold shadow-md transition">
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
                    
                    <div className={`p-7 rounded-3xl border space-y-4 ${isDark ? 'bg-zinc-950/70 border-zinc-800' : 'bg-white border-slate-200 shadow-sm'}`}>
                      <h3 className="text-base font-extrabold">🎓 Student Dashboard Overview</h3>
                      <p className={`text-xs ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>Welcome back! Here is your quick academic summary and stats.</p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 pt-1">
                        <div className={`p-4 rounded-2xl border ${isDark ? 'bg-zinc-900/60 border-zinc-800' : 'bg-slate-50 border-slate-200'}`}>
                          <p className="text-[10px] font-extrabold text-indigo-400 uppercase">Current CGPA</p>
                          <p className="text-xl font-extrabold mt-1">8.92 / 10</p>
                        </div>
                        <div className={`p-4 rounded-2xl border ${isDark ? 'bg-zinc-900/60 border-zinc-800' : 'bg-slate-50 border-slate-200'}`}>
                          <p className="text-[10px] font-extrabold text-indigo-400 uppercase">Attendance</p>
                          <p className="text-xl font-extrabold text-emerald-400 mt-1">92.4%</p>
                        </div>
                        <div className={`p-4 rounded-2xl border ${isDark ? 'bg-zinc-900/60 border-zinc-800' : 'bg-slate-50 border-slate-200'}`}>
                          <p className="text-[10px] font-extrabold text-indigo-400 uppercase">Fee Status</p>
                          <p className="text-xl font-extrabold text-amber-400 mt-1">1 Pending</p>
                        </div>
                        <div className={`p-4 rounded-2xl border ${isDark ? 'bg-zinc-900/60 border-zinc-800' : 'bg-slate-50 border-slate-200'}`}>
                          <p className="text-[10px] font-extrabold text-indigo-400 uppercase">Registered Exams</p>
                          <p className="text-xl font-extrabold mt-1">6 Subjects</p>
                        </div>
                      </div>
                    </div>

                    <div className={`p-7 rounded-3xl border space-y-4 ${isDark ? 'bg-zinc-950/70 border-zinc-800' : 'bg-white border-slate-200 shadow-sm'}`}>
                      <h3 className="text-base font-extrabold">📝 Examination Marks & Grades</h3>
                      <p className={`text-xs ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>View live marks entered by faculty members.</p>

                      <div className="space-y-3 pt-1">
                        {['Mid-Term Exam', 'End-Term Exam', 'Quiz 1'].map((examName) => (
                          <div key={examName} className={`p-5 rounded-2xl border space-y-2.5 ${isDark ? 'bg-zinc-900/40 border-zinc-800' : 'bg-slate-50 border-slate-200'}`}>
                            <h4 className="font-bold text-xs uppercase tracking-wider text-indigo-400 border-b pb-2 border-zinc-800/40">{examName}</h4>
                            <div className="space-y-2 pt-1">
                              {studentMarks.filter(m => m.exam === examName).length === 0 ? (
                                <p className="text-[11px] text-zinc-500">No records found for {examName}.</p>
                              ) : (
                                studentMarks.filter(m => m.exam === examName).map(m => (
                                  <div key={m.id} className={`p-3.5 rounded-xl border flex justify-between items-center ${isDark ? 'bg-zinc-950 border-zinc-800/80' : 'bg-white border-slate-200'}`}>
                                    <div>
                                      <h5 className="font-bold text-xs">{m.subject}</h5>
                                      <p className={`text-[11px] mt-0.5 ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>Marks: <span className="font-bold">{m.marks}</span></p>
                                    </div>
                                    <span className="bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 px-3 py-1 rounded-xl text-xs font-bold">
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

                    <div className={`p-7 rounded-3xl border space-y-4 ${isDark ? 'bg-zinc-950/70 border-zinc-800' : 'bg-white border-slate-200 shadow-sm'}`}>
                      <h3 className="text-base font-extrabold">💳 Student Fee Dues & Status</h3>
                      <p className={`text-xs ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>Check tuition fee status and clear pending semester payments.</p>
                      
                      <div className="space-y-3">
                        {studentFees.map(fee => (
                          <div key={fee.id} className={`p-4.5 rounded-2xl border flex justify-between items-center ${isDark ? 'bg-zinc-900/40 border-zinc-800' : 'bg-slate-50 border-slate-200'}`}>
                            <div>
                              <h4 className="font-bold text-xs">{fee.semester}</h4>
                              <p className={`text-xs mt-0.5 ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>Amount: <span className="font-bold">{fee.amount}</span> | Due: {fee.dueDate}</p>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className={`text-xs font-bold px-3 py-1 rounded-xl border ${fee.status === 'Paid' ? 'bg-emerald-950/40 text-emerald-400 border-emerald-900/50' : 'bg-amber-950/40 text-amber-400 border-amber-900/50'}`}>
                                {fee.status}
                              </span>
                              {fee.status === 'Pending' && (
                                <button onClick={() => handlePayFee(fee.id)} className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-md transition">
                                  Pay Now
                                </button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className={`p-7 rounded-3xl border space-y-4 ${isDark ? 'bg-zinc-950/70 border-zinc-800' : 'bg-white border-slate-200 shadow-sm'}`}>
                      <h3 className="text-base font-extrabold">📅 Upcoming Campus Events</h3>
                      <p className={`text-xs ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>Stay updated with upcoming academic and extracurricular schedules.</p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        {upcomingEvents.map(evt => (
                          <div key={evt.id} className={`p-4.5 rounded-2xl border space-y-2 ${isDark ? 'bg-zinc-900/40 border-zinc-800' : 'bg-slate-50 border-slate-200'}`}>
                            <span className="bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-2.5 py-0.5 rounded-lg text-[10px] font-bold">{evt.date}</span>
                            <h4 className="font-bold text-xs mt-1">{evt.title}</h4>
                            <p className={`text-xs leading-relaxed ${isDark ? 'text-zinc-400' : 'text-slate-600'}`}>{evt.desc}</p>
                            <p className="text-[11px] font-bold text-indigo-400">📍 {evt.venue}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>
                )}

                {/* Faculty Portal Tab */}
                {activeTab === 'faculty-portal' && (
                  <div className={`p-7 rounded-3xl border space-y-6 ${isDark ? 'bg-zinc-950/70 border-zinc-800' : 'bg-white border-slate-200 shadow-sm'}`}>
                    
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b pb-4 border-zinc-800/40 gap-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                          <span className="text-[10px] font-extrabold tracking-wider text-indigo-400 uppercase">Faculty Assessment Dashboard</span>
                        </div>
                        <h3 className="text-lg font-extrabold">Marks & Evaluation Portal</h3>
                        <p className={`text-xs ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>Manage and publish verified student marks and academic grades in real-time.</p>
                      </div>
                      {isFacultyLoggedIn && (
                        <button onClick={() => setIsFacultyLoggedIn(false)} className="bg-red-500/10 hover:bg-red-500/20 text-red-400 px-4 py-2 rounded-xl text-xs font-bold border border-red-500/20 transition">
                          🔒 Logout Faculty
                        </button>
                      )}
                    </div>

                    {!isFacultyLoggedIn ? (
                      <div className={`max-w-md mx-auto p-6 rounded-3xl border space-y-4 my-4 ${isDark ? 'bg-zinc-900/60 border-zinc-800' : 'bg-slate-50 border-slate-200'}`}>
                        <div className="text-center space-y-1.5">
                          <div className="w-12 h-12 bg-indigo-500/10 border border-indigo-500/20 text-indigo-500 rounded-2xl mx-auto flex items-center justify-center font-bold text-base">👨‍🏫</div>
                          <h4 className="font-extrabold text-sm">Faculty Secure Portal</h4>
                          <p className={`text-xs ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>Authenticate with your faculty credentials.</p>
                          <div className="bg-indigo-500/10 border border-indigo-500/20 p-2.5 rounded-xl text-[11px] text-indigo-300 font-mono mt-2">
                            🔑 faculty@univote.com / Faculty@1234
                          </div>
                        </div>
                        <form onSubmit={handleFacultyLogin} className="space-y-3.5 pt-1">
                          <div>
                            <label className={`block text-xs font-bold mb-1.5 ${isDark ? 'text-zinc-300' : 'text-slate-700'}`}>Faculty Email</label>
                            <input type="email" value={facultyEmail} onChange={(e) => setFacultyEmail(e.target.value)} placeholder="faculty@univote.com" className={`w-full rounded-2xl p-3 text-xs outline-none border ${isDark ? 'bg-zinc-950 border-zinc-800 text-zinc-100' : 'bg-white border-slate-200 text-slate-900'}`} required />
                          </div>
                          <div>
                            <label className={`block text-xs font-bold mb-1.5 ${isDark ? 'text-zinc-300' : 'text-slate-700'}`}>Password</label>
                            <input type="password" value={facultyPassword} onChange={(e) => setFacultyPassword(e.target.value)} placeholder="••••••••" className={`w-full rounded-2xl p-3 text-xs outline-none border ${isDark ? 'bg-zinc-950 border-zinc-800 text-zinc-100' : 'bg-white border-slate-200 text-slate-900'}`} required />
                          </div>
                          <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-3.5 rounded-2xl font-bold text-xs shadow-md transition">
                            Authenticate Faculty →
                          </button>
                        </form>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        
                        <div className={`p-6 rounded-2xl border space-y-4 ${isDark ? 'bg-zinc-900/40 border-zinc-800' : 'bg-slate-50 border-slate-200'}`}>
                          <h4 className="font-extrabold text-xs uppercase tracking-wider text-indigo-400">✍️ Publish New Student Examination Marks</h4>
                          <form onSubmit={handleAddMark} className="space-y-3.5">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                              <div>
                                <label className={`block text-xs font-bold mb-1 ${isDark ? 'text-zinc-300' : 'text-slate-700'}`}>Examination Type</label>
                                <select value={newExamType} onChange={(e) => setNewExamType(e.target.value)} className={`w-full rounded-xl p-3 text-xs outline-none border ${isDark ? 'bg-zinc-950 border-zinc-800 text-zinc-200' : 'bg-white border-slate-200 text-slate-900'}`}>
                                  <option value="Mid-Term Exam">Mid-Term Exam</option>
                                  <option value="End-Term Exam">End-Term Exam</option>
                                  <option value="Quiz 1">Quiz 1</option>
                                </select>
                              </div>
                              <div>
                                <label className={`block text-xs font-bold mb-1 ${isDark ? 'text-zinc-300' : 'text-slate-700'}`}>Subject Title</label>
                                <input type="text" value={newSubject} onChange={(e) => setNewSubject(e.target.value)} placeholder="e.g. AI & ML" className={`w-full rounded-xl p-3 text-xs outline-none border ${isDark ? 'bg-zinc-950 border-zinc-800 text-zinc-200' : 'bg-white border-slate-200 text-slate-900'}`} required />
                              </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                              <div>
                                <label className={`block text-xs font-bold mb-1 ${isDark ? 'text-zinc-300' : 'text-slate-700'}`}>Marks Obtained</label>
                                <input type="text" value={newMarks} onChange={(e) => setNewMarks(e.target.value)} placeholder="e.g. 45/50" className={`w-full rounded-xl p-3 text-xs outline-none border ${isDark ? 'bg-zinc-950 border-zinc-800 text-zinc-200' : 'bg-white border-slate-200 text-slate-900'}`} required />
                              </div>
                              <div>
                                <label className={`block text-xs font-bold mb-1 ${isDark ? 'text-zinc-300' : 'text-slate-700'}`}>Grade Awarded</label>
                                <input type="text" value={newGrade} onChange={(e) => setNewGrade(e.target.value)} placeholder="e.g. A+" className={`w-full rounded-xl p-3 text-xs outline-none border ${isDark ? 'bg-zinc-950 border-zinc-800 text-zinc-200' : 'bg-white border-slate-200 text-slate-900'}`} required />
                              </div>
                            </div>
                            <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-3 rounded-xl font-bold text-xs shadow-md transition">
                              ✓ Publish Marks Instantly
                            </button>
                          </form>
                        </div>

                        <div className="space-y-3">
                          <h4 className="font-extrabold text-xs uppercase tracking-wider text-indigo-400">📋 Active Student Grade Records ({studentMarks.length})</h4>
                          <div className="space-y-2.5">
                            {studentMarks.map(m => (
                              <div key={m.id} className={`p-4 rounded-2xl border flex justify-between items-center ${isDark ? 'bg-zinc-900/40 border-zinc-800' : 'bg-slate-50 border-slate-200'}`}>
                                <div className="space-y-1">
                                  <span className="bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-2.5 py-0.5 rounded-lg text-[10px] font-bold">
                                    {m.exam}
                                  </span>
                                  <h5 className="font-bold text-xs mt-1">{m.subject}</h5>
                                  <p className={`text-xs ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>Marks: <span className="font-bold">{m.marks}</span></p>
                                </div>
                                <div className="flex items-center gap-3">
                                  <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3 py-1 rounded-xl text-xs font-bold">
                                    {m.grade}
                                  </span>
                                  <button onClick={() => handleDeleteMark(m.id)} className="bg-red-500/10 hover:bg-red-500/20 text-red-400 px-3.5 py-1.5 rounded-xl text-xs font-bold transition">
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
                  <div className={`p-7 rounded-3xl border space-y-5 ${isDark ? 'bg-zinc-950/70 border-zinc-800' : 'bg-white border-slate-200 shadow-sm'}`}>
                    <h3 className="text-base font-extrabold">Student Verification Document Portal</h3>
                    <p className={`text-xs ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>Upload your identity and academic certificates for {selectedUni.name}.</p>
                    
                    <form onSubmit={handleDocumentSubmit} className="space-y-3.5">
                      <div>
                        <label className={`block text-xs font-bold mb-1.5 ${isDark ? 'text-zinc-300' : 'text-slate-700'}`}>Identity Card Document / PDF</label>
                        <input type="file" onChange={(e) => setAadhaarFile(e.target.files[0]?.name || '')} className={`w-full rounded-2xl p-2.5 text-xs file:mr-4 file:py-1.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-indigo-600 file:text-white hover:file:bg-indigo-500 cursor-pointer border ${isDark ? 'bg-zinc-900 border-zinc-800 text-zinc-300' : 'bg-slate-50 border-slate-200 text-slate-700'}`} required />
                      </div>
                      <div>
                        <label className={`block text-xs font-bold mb-1.5 ${isDark ? 'text-zinc-300' : 'text-slate-700'}`}>PAN Card Document / PDF</label>
                        <input type="file" onChange={(e) => setPanFile(e.target.files[0]?.name || '')} className={`w-full rounded-2xl p-2.5 text-xs file:mr-4 file:py-1.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-indigo-600 file:text-white hover:file:bg-indigo-500 cursor-pointer border ${isDark ? 'bg-zinc-900 border-zinc-800 text-zinc-300' : 'bg-slate-50 border-slate-200 text-slate-700'}`} required />
                      </div>
                      <div>
                        <label className={`block text-xs font-bold mb-1.5 ${isDark ? 'text-zinc-300' : 'text-slate-700'}`}>10th Marksheet (PDF/Image)</label>
                        <input type="file" onChange={(e) => setTenthFile(e.target.files[0]?.name || '')} className={`w-full rounded-2xl p-2.5 text-xs file:mr-4 file:py-1.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-indigo-600 file:text-white hover:file:bg-indigo-500 cursor-pointer border ${isDark ? 'bg-zinc-900 border-zinc-800 text-zinc-300' : 'bg-slate-50 border-slate-200 text-slate-700'}`} required />
                      </div>
                      <div>
                        <label className={`block text-xs font-bold mb-1.5 ${isDark ? 'text-zinc-300' : 'text-slate-700'}`}>12th Marksheet (PDF/Image)</label>
                        <input type="file" onChange={(e) => setTwelfthFile(e.target.files[0]?.name || '')} className={`w-full rounded-2xl p-2.5 text-xs file:mr-4 file:py-1.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-indigo-600 file:text-white hover:file:bg-indigo-500 cursor-pointer border ${isDark ? 'bg-zinc-900 border-zinc-800 text-zinc-300' : 'bg-slate-50 border-slate-200 text-slate-700'}`} required />
                      </div>
                      <div>
                        <label className={`block text-xs font-bold mb-1.5 ${isDark ? 'text-zinc-300' : 'text-slate-700'}`}>Character Certificate (PDF/Image)</label>
                        <input type="file" onChange={(e) => setCharCertFile(e.target.files[0]?.name || '')} className={`w-full rounded-2xl p-2.5 text-xs file:mr-4 file:py-1.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-indigo-600 file:text-white hover:file:bg-indigo-500 cursor-pointer border ${isDark ? 'bg-zinc-900 border-zinc-800 text-zinc-300' : 'bg-slate-50 border-slate-200 text-slate-700'}`} required />
                      </div>
                      <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-3.5 rounded-2xl font-bold text-xs shadow-md transition">
                        Submit All Documents to University Admin
                      </button>
                      {docSubmitted && <p className="text-xs text-emerald-400 text-center font-bold">✓ Documents submitted successfully for review!</p>}
                    </form>
                  </div>
                )}

                {/* University Admin Panel */}
                {activeTab === 'uni-admin' && (
                  <div className={`p-7 rounded-3xl border space-y-6 ${isDark ? 'bg-zinc-950/70 border-zinc-800' : 'bg-white border-slate-200 shadow-sm'}`}>
                    <div className="flex justify-between items-center border-b pb-4 border-zinc-800/40">
                      <div>
                        <h3 className="text-base font-extrabold">University Admin Panel ({selectedUni.name})</h3>
                        <p className={`text-xs mt-0.5 ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>Review student documents, manage portal images, and control faculty salaries.</p>
                      </div>
                      {isUniAdminLoggedIn && (
                        <button onClick={() => setIsUniAdminLoggedIn(false)} className="bg-red-500/10 text-red-400 px-3.5 py-1.5 rounded-xl text-xs font-bold border border-red-500/20">Logout</button>
                      )}
                    </div>

                    {!isUniAdminLoggedIn ? (
                      <div className={`max-w-md mx-auto p-6 rounded-2xl border space-y-3.5 my-2 ${isDark ? 'bg-zinc-900/60 border-zinc-800' : 'bg-slate-50 border-slate-200'}`}>
                        <div className="text-center">
                          <h4 className="font-extrabold text-xs">University Admin Login Required</h4>
                          <p className="text-[11px] text-indigo-400 font-mono mt-1">uniorg@univote.com / Uni@1234</p>
                        </div>
                        <form onSubmit={handleUniAdminLogin} className="space-y-3">
                          <input type="email" value={uniAdminUser} onChange={(e) => setUniAdminUser(e.target.value)} placeholder="uniorg@univote.com" className={`w-full rounded-xl p-3 text-xs border ${isDark ? 'bg-zinc-950 border-zinc-800 text-zinc-200' : 'bg-white border-slate-200 text-slate-900'}`} required />
                          <input type="password" value={uniAdminPass} onChange={(e) => setUniAdminPass(e.target.value)} placeholder="••••••••" className={`w-full rounded-xl p-3 text-xs border ${isDark ? 'bg-zinc-950 border-zinc-800 text-zinc-200' : 'bg-white border-slate-200 text-slate-900'}`} required />
                          <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-3 rounded-xl font-bold text-xs shadow-md transition">Login as Uni Admin</button>
                        </form>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        
                        {/* Faculty Salary Control */}
                        <div className={`p-5 rounded-2xl border space-y-4 ${isDark ? 'bg-zinc-900/40 border-zinc-800' : 'bg-slate-50 border-slate-200'}`}>
                          <h4 className="font-extrabold text-xs uppercase tracking-wider text-indigo-400">💵 Faculty Salary & Payroll Control</h4>
                          
                          <form onSubmit={handleAddFaculty} className={`p-4 rounded-xl border space-y-3 ${isDark ? 'bg-zinc-950 border-zinc-800/80' : 'bg-white border-slate-200'}`}>
                            <h5 className="font-bold text-xs">➕ Add New Faculty Member</h5>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
                              <input type="text" value={newFacultyName} onChange={(e) => setNewFacultyName(e.target.value)} placeholder="Faculty Name" className={`rounded-xl p-2.5 text-xs border ${isDark ? 'bg-zinc-900 border-zinc-800 text-zinc-200' : 'bg-slate-50 border-slate-200 text-slate-900'}`} required />
                              <input type="text" value={newFacultyDept} onChange={(e) => setNewFacultyDept(e.target.value)} placeholder="Department" className={`rounded-xl p-2.5 text-xs border ${isDark ? 'bg-zinc-900 border-zinc-800 text-zinc-200' : 'bg-slate-50 border-slate-200 text-slate-900'}`} required />
                              <input type="text" value={newFacultySalary} onChange={(e) => setNewFacultySalary(e.target.value)} placeholder="Salary (₹90,000)" className={`rounded-xl p-2.5 text-xs border ${isDark ? 'bg-zinc-900 border-zinc-800 text-zinc-200' : 'bg-slate-50 border-slate-200 text-slate-900'}`} required />
                            </div>
                            <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-2.5 rounded-xl font-bold text-xs shadow-md transition">
                              Add Faculty & Set Salary
                            </button>
                          </form>

                          <div className="space-y-2 pt-1">
                            <h5 className="font-bold text-xs">📋 Current Faculty Salary List</h5>
                            <div className="space-y-2.5">
                              {facultySalaries.map(fac => (
                                <div key={fac.id} className={`p-3.5 rounded-xl border flex flex-col md:flex-row justify-between items-start md:items-center gap-2 ${isDark ? 'bg-zinc-950 border-zinc-800/80' : 'bg-white border-slate-200'}`}>
                                  <div>
                                    <h6 className="font-bold text-xs">{fac.name}</h6>
                                    <p className={`text-[11px] ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>Dept: <span className="font-bold">{fac.dept}</span></p>
                                  </div>
                                  <div className="flex items-center gap-2.5 w-full md:w-auto">
                                    <input 
                                      type="text" 
                                      defaultValue={fac.salary} 
                                      onBlur={(e) => handleUpdateSalary(fac.id, e.target.value)}
                                      className={`rounded-xl p-2 text-xs text-emerald-400 font-extrabold w-28 text-center border ${isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-slate-50 border-slate-200'}`} 
                                    />
                                    <button onClick={() => handleDeleteFaculty(fac.id)} className="bg-red-500/10 hover:bg-red-500/20 text-red-400 px-3 py-2 rounded-xl text-xs font-bold transition ml-auto">
                                      Remove
                                    </button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Image Upload Section */}
                        <div className={`p-5 rounded-2xl border space-y-3.5 ${isDark ? 'bg-zinc-900/40 border-zinc-800' : 'bg-slate-50 border-slate-200'}`}>
                          <h4 className="font-extrabold text-xs uppercase tracking-wider text-indigo-400">🖼️ Manage University Portal Images</h4>
                          <div className="space-y-2">
                            <label className={`text-xs font-bold block ${isDark ? 'text-zinc-300' : 'text-slate-700'}`}>Update Header Banner Image</label>
                            <form onSubmit={handleUpdateBanner} className="flex gap-2.5">
                              {bannerInputType === 'url' ? (
                                <input type="text" value={newBannerImage} onChange={(e) => setNewBannerImage(e.target.value)} placeholder="https://images.unsplash.com/photo-..." className={`flex-1 rounded-xl p-3 text-xs border ${isDark ? 'bg-zinc-950 border-zinc-800 text-zinc-200' : 'bg-white border-slate-200 text-slate-900'}`} />
                              ) : (
                                <input type="file" accept="image/*" onChange={(e) => setBannerFileObj(e.target.files[0])} className={`flex-1 rounded-xl p-1.5 text-xs border ${isDark ? 'bg-zinc-950 border-zinc-800 text-zinc-300' : 'bg-white border-slate-200 text-slate-700'}`} />
                              )}
                              <button type="submit" className="bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-xl text-xs font-bold shadow-md whitespace-nowrap">Update Banner</button>
                            </form>
                          </div>
                        </div>

                        {/* Student Document Submissions */}
                        <div className="space-y-3">
                          <h4 className="font-extrabold text-xs uppercase tracking-wider text-indigo-400">Student Document Submissions</h4>
                          <div className="space-y-3">
                            {submittedSubmissions.filter(sub => sub.uniId === selectedUni.id).length === 0 ? (
                              <p className={`text-xs ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>No student documents submitted for this university yet.</p>
                            ) : (
                              submittedSubmissions.filter(sub => sub.uniId === selectedUni.id).map(sub => (
                                <div key={sub.id} className={`p-4.5 rounded-2xl border space-y-3 ${isDark ? 'bg-zinc-900/40 border-zinc-800' : 'bg-slate-50 border-slate-200'}`}>
                                  <div className="flex justify-between items-start">
                                    <div>
                                      <h5 className="font-bold text-xs">{sub.studentName}</h5>
                                      <p className={`text-xs ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>{sub.studentEmail}</p>
                                    </div>
                                    <span className={`text-xs font-bold px-3 py-1 rounded-xl border ${sub.status === 'Approved' ? 'bg-emerald-950/40 text-emerald-400 border-emerald-900/50' : sub.status === 'Rejected' ? 'bg-red-950/40 text-red-400 border-red-900/50' : 'bg-amber-950/40 text-amber-400 border-amber-900/50'}`}>
                                      {sub.status}
                                    </span>
                                  </div>

                                  <div className="flex gap-2.5 pt-1">
                                    <button onClick={() => handleDocAction(sub.id, 'Approved')} className="bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 px-4 py-2 rounded-xl text-xs font-bold transition">
                                      Approve
                                    </button>
                                    <button onClick={() => handleDocAction(sub.id, 'Rejected')} className="bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 px-4 py-2 rounded-xl text-xs font-bold transition">
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
                  <div className={`p-7 rounded-3xl border space-y-4 ${isDark ? 'bg-zinc-950/70 border-zinc-800' : 'bg-white border-slate-200 shadow-sm'}`}>
                    <h3 className="text-base font-extrabold">Organisation & Candidate Panel</h3>
                    <p className={`text-xs ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>Register new election candidates for {selectedUni.name}.</p>
                    <form onSubmit={handleAddCandidate} className="space-y-3.5">
                      <input type="text" value={candidateName} onChange={(e) => setCandidateName(e.target.value)} placeholder="Candidate Full Name" className={`w-full rounded-2xl p-3.5 text-xs outline-none border ${isDark ? 'bg-zinc-900 border-zinc-800 text-zinc-100' : 'bg-slate-50 border-slate-200 text-slate-900'}`} required />
                      <input type="text" value={candidateParty} onChange={(e) => setCandidateParty(e.target.value)} placeholder="Party Name" className={`w-full rounded-2xl p-3.5 text-xs outline-none border ${isDark ? 'bg-zinc-900 border-zinc-800 text-zinc-100' : 'bg-slate-50 border-slate-200 text-slate-900'}`} required />
                      <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-3.5 rounded-2xl font-bold text-xs shadow-md transition">
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