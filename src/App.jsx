import React, { useState, useEffect } from 'react';
import { auth, googleProvider } from './firebase';
import { signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';

export default function App() {
  const [user, setUser] = useState(null);
  const [currentView, setCurrentView] = useState('home'); // 'home', 'universities', 'register-uni', 'admin-login', 'admin-panel'
  const [selectedUni, setSelectedUni] = useState(null);
  const [activeTab, setActiveTab] = useState('portal'); // 'portal', 'voting', 'student-portal', 'manager', 'documents', 'uni-admin', 'faculty-portal', 'timetable'

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

  // Faculty Login States (ID & Password provided by University Admin)
  const [facultyIdInput, setFacultyIdInput] = useState('');
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

  // University News & Announcements States
  const [newsList, setNewsList] = useState([
    { id: 1, title: 'Admissions Open for 2026-27 Academic Session', date: '28 Sep 2026', category: 'Announcement', content: 'Applications are now live for all undergraduate and postgraduate engineering and management programs.' },
    { id: 2, title: 'Library Extended Hours During Examination Week', date: '25 Sep 2026', category: 'Facility', content: 'The central library will remain open 24/7 starting next Monday to support student preparation.' }
  ]);
  const [newNewsTitle, setNewNewsTitle] = useState('');
  const [newNewsCategory, setNewNewsCategory] = useState('Announcement');
  const [newNewsContent, setNewNewsContent] = useState('');

  // Faculty Salary Management States
  const [facultySalaries, setFacultySalaries] = useState([
    { id: 1, facultyId: 'FAC101', name: 'Dr. Rajesh Kumar', dept: 'Computer Science & Engg', salary: '₹95,000', status: 'Active' },
    { id: 2, facultyId: 'FAC102', name: 'Dr. Sneha Sharma', dept: 'Electronics & Comm.', salary: '₹88,000', status: 'Active' },
    { id: 3, facultyId: 'FAC103', name: 'Prof. Amit Verma', dept: 'Mechanical Engg', salary: '₹82,000', status: 'Active' }
  ]);
  const [newFacultyId, setNewFacultyId] = useState('');
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

  // Student Marks Management States
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

  // Class Timetable Management States
  const [timetable, setTimetable] = useState([
    { id: 1, day: 'Monday', time: '09:00 AM - 10:00 AM', subject: 'Data Structures & Algorithms', faculty: 'Dr. Rajesh Kumar', room: 'LH-101' },
    { id: 2, day: 'Monday', time: '10:00 AM - 11:00 AM', subject: 'Database Management Systems', faculty: 'Dr. Sneha Sharma', room: 'LH-102' },
    { id: 3, day: 'Tuesday', time: '11:00 AM - 12:00 PM', subject: 'Computer Networks', faculty: 'Prof. Amit Verma', room: 'LH-103' },
    { id: 4, day: 'Wednesday', time: '02:00 PM - 04:00 PM', subject: 'Software Engineering Lab', faculty: 'Dr. Rajesh Kumar', room: 'Lab-3' }
  ]);
  const [newTzDay, setNewTzDay] = useState('Monday');
  const [newTzTime, setNewTzTime] = useState('');
  const [newTzSubj, setNewTzSubj] = useState('');
  const [newTzFaculty, setNewTzFaculty] = useState('');
  const [newTzRoom, setNewTzRoom] = useState('');

  // Student Fees States
  const [studentFees, setStudentFees] = useState([
    { id: 1, semester: 'Semester 1 (2025-26)', amount: '₹45,000', status: 'Paid', dueDate: '15 Aug 2025' },
    { id: 2, semester: 'Semester 2 (2025-26)', amount: '₹45,000', status: 'Pending', dueDate: '15 Jan 2026' }
  ]);

  // Payment Gateway Modal States
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [activePaymentFee, setActivePaymentFee] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('upi'); // 'upi', 'card', 'netbanking'
  const [upiId, setUpiId] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [selectedBank, setSelectedBank] = useState('HDFC Bank');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

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
    const foundFaculty = facultySalaries.find(f => f.facultyId === facultyIdInput);
    if (foundFaculty && facultyPassword === 'Faculty@1234') {
      setIsFacultyLoggedIn(true);
      alert(`Faculty Logged In Successfully as ${foundFaculty.name}!`);
    } else {
      alert("Invalid Faculty ID provided by university admin or incorrect password!");
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
    if (!isFacultyLoggedIn) {
      alert("Access Denied! Faculty must be logged in to allot or modify marks.");
      return;
    }
    if (!newSubject || !newMarks || !newGrade) return;
    const item = { id: Date.now(), exam: newExamType, subject: newSubject, marks: newMarks, grade: newGrade };
    setStudentMarks(prev => [...prev, item]);
    setNewSubject('');
    setNewMarks('');
    setNewGrade('');
    alert("Student marks updated by faculty in real-time!");
  };

  const handleDeleteMark = (markId) => {
    if (!isFacultyLoggedIn) {
      alert("Access Denied! Faculty must be logged in to modify marks.");
      return;
    }
    setStudentMarks(prev => prev.filter(m => m.id !== markId));
    alert("Mark record deleted successfully!");
  };

  const handleAddTimetableSlot = (e) => {
    e.preventDefault();
    if (!newTzTime || !newTzSubj || !newTzFaculty || !newTzRoom) return;
    const item = {
      id: Date.now(),
      day: newTzDay,
      time: newTzTime,
      subject: newTzSubj,
      faculty: newTzFaculty,
      room: newTzRoom
    };
    setTimetable(prev => [...prev, item]);
    setNewTzTime('');
    setNewTzSubj('');
    setNewTzFaculty('');
    setNewTzRoom('');
    alert("Timetable updated successfully! Changes are now live on the student interface.");
  };

  const handleDeleteTimetableSlot = (id) => {
    setTimetable(prev => prev.filter(item => item.id !== id));
    alert("Timetable slot removed successfully!");
  };

  const openPaymentModal = (fee) => {
    const activeUser = user || auth.currentUser;
    if (!activeUser) {
      alert("Payment Error: Payment must be done only if the student is logged in or registered to the portal. Please sign in first.");
      return;
    }
    setActivePaymentFee(fee);
    setIsPaymentModalOpen(true);
  };

  const handleProcessPayment = (e) => {
    e.preventDefault();
    const activeUser = user || auth.currentUser;
    if (!activeUser) {
      alert("Payment Error: Student must be logged in to complete payment.");
      return;
    }
    if (paymentMethod === 'upi' && !upiId) {
      alert('Please enter a valid UPI ID (e.g. username@oksbi)');
      return;
    }
    if (paymentMethod === 'card' && (!cardNumber || !cardExpiry || !cardCvv)) {
      alert('Please complete all card details');
      return;
    }

    setIsProcessingPayment(true);
    setTimeout(() => {
      setStudentFees(prev => prev.map(f => f.id === activePaymentFee.id ? { ...f, status: 'Paid' } : f));
      setIsProcessingPayment(false);
      setIsPaymentModalOpen(false);
      setActivePaymentFee(null);
      setUpiId('');
      setCardNumber('');
      setCardExpiry('');
      setCardCvv('');
      alert('Payment successful! Fee receipt generated and updated in your student records.');
    }, 1500);
  };

  const handleAddNews = (e) => {
    e.preventDefault();
    if (!newNewsTitle.trim() || !newNewsContent.trim()) return;
    const item = {
      id: Date.now(),
      title: newNewsTitle,
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      category: newNewsCategory,
      content: newNewsContent
    };
    setNewsList(prev => [item, ...prev]);
    setNewNewsTitle('');
    setNewNewsContent('');
    alert("News broadcasted successfully! It is now live on the student panel.");
  };

  const handleDeleteNews = (newsId) => {
    setNewsList(prev => prev.filter(n => n.id !== newsId));
    alert("News item deleted successfully!");
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

  const handleAddFaculty = (e) => {
    e.preventDefault();
    if (!newFacultyId || !newFacultyName || !newFacultyDept || !newFacultySalary) return;
    const newFac = {
      id: Date.now(),
      facultyId: newFacultyId,
      name: newFacultyName,
      dept: newFacultyDept,
      salary: newFacultySalary,
      status: 'Active'
    };
    setFacultySalaries(prev => [...prev, newFac]);
    setNewFacultyId('');
    setNewFacultyName('');
    setNewFacultyDept('');
    setNewFacultySalary('');
    alert("New faculty credential generated and added by University Admin successfully!");
  };

  const handleDeleteFaculty = (facultyId) => {
    setFacultySalaries(prev => prev.filter(f => f.id !== facultyId));
    alert("Faculty removed from active payroll!");
  };

  const isDark = theme === 'dark';

  return (
    <div className={`min-h-screen font-sans relative overflow-x-hidden transition-colors duration-300 ${isDark ? 'bg-[#0b0b0f] text-zinc-100' : 'bg-gradient-to-br from-[#FAF8F5] via-[#F4F1EA] to-[#F7F5EF] text-stone-800'}`}>

      {/* Navbar */}
      <nav className={`p-4 border-b sticky top-0 z-50 backdrop-blur-xl transition-colors ${isDark ? 'border-zinc-800/80 bg-[#0b0b0f]/85' : 'border-[#EBE6DC] bg-[#FDFBF7]/80 shadow-[0_4px_20px_rgb(0,0,0,0.03)]'}`}>
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="cursor-pointer flex items-center gap-3 group" onClick={() => { setCurrentView('home'); setSelectedUni(null); }}>
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs tracking-tight shadow-md transition-transform group-hover:scale-105 ${isDark ? 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white' : 'bg-gradient-to-br from-amber-700 to-stone-800 text-[#FDFBF7]'}`}>U</div>
            <div>
              <h1 className={`text-sm font-bold tracking-tight ${isDark ? 'text-zinc-100' : 'text-stone-900'}`}>UniVote Pro</h1>
              <p className={`text-[10px] font-medium ${isDark ? 'text-zinc-400' : 'text-stone-500'}`}>Campus Management Framework</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2.5">
            <button onClick={() => setCurrentView('register-uni')} className={`hidden md:flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all shadow-sm ${isDark ? 'bg-zinc-900 hover:bg-zinc-800 border border-zinc-700/80 text-zinc-200' : 'bg-[#FDFBF7]/80 hover:bg-[#F4F1EA] border border-[#EBE6DC] text-stone-700 backdrop-blur-md'}`}>
              🏛️ Register University
            </button>
            <button onClick={() => setCurrentView('admin-login')} className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all shadow-sm ${isDark ? 'bg-zinc-900 hover:bg-zinc-800 border border-zinc-700/80 text-zinc-200' : 'bg-[#FDFBF7]/80 hover:bg-[#F4F1EA] border border-[#EBE6DC] text-stone-700 backdrop-blur-md'}`}>
              🔐 Admin Portal
            </button>
            <button onClick={toggleTheme} className={`p-2 rounded-xl border text-xs transition-all shadow-sm ${isDark ? 'border-zinc-700 bg-zinc-900 hover:bg-zinc-800 text-amber-400' : 'border-[#EBE6DC] bg-[#FDFBF7]/80 hover:bg-[#F4F1EA] text-amber-800 backdrop-blur-md'}`}>
              {isDark ? '☀️ Light' : '🌙 Dark'}
            </button>
            {user ? (
              <div className={`flex items-center gap-2 px-3 py-1 rounded-xl border ${isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-[#FDFBF7]/90 border-[#EBE6DC] shadow-sm backdrop-blur-md'}`}>
                <span className={`text-xs font-medium ${isDark ? 'text-zinc-300' : 'text-stone-700'}`}>{user.displayName || user.email}</span>
                <button onClick={handleLogout} className="bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 px-2 py-0.5 rounded text-[10px] font-semibold transition">Logout</button>
              </div>
            ) : (
              <button onClick={handleGoogleLogin} className={`px-4 py-1.5 rounded-xl text-xs font-bold shadow-md transition-all ${isDark ? 'bg-zinc-100 hover:bg-white text-zinc-900' : 'bg-stone-900 hover:bg-stone-800 text-[#FDFBF7]'}`}>
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
              <p className={`text-xs md:text-sm leading-relaxed ${isDark ? 'text-zinc-400' : 'text-stone-600'}`}>
                A clean, ivory glassmorphic framework featuring secure university registrations, faculty payroll controls, live timetables, and encrypted digital elections.
              </p>
            </div>
          </div>
        )}

        {/* 2. Universities List View */}
        {currentView === 'universities' && !selectedUni && (
          <div className="space-y-6">
            <div className={`p-6 rounded-3xl border backdrop-blur-xl flex justify-between items-center ${isDark ? 'bg-zinc-950/70 border-zinc-800' : 'bg-[#FDFBF7]/75 border-[#EBE6DC] shadow-[0_8px_30px_rgb(0,0,0,0.03)]'}`}>
              <div>
                <h2 className="text-lg font-extrabold">Approved Universities & Campuses</h2>
                <p className={`text-xs mt-0.5 ${isDark ? 'text-zinc-400' : 'text-stone-500'}`}>Select an institution to access its dedicated portal and voting booth.</p>
              </div>
              <button onClick={() => setCurrentView('home')} className={`text-xs font-bold px-4 py-2 rounded-xl border transition ${isDark ? 'bg-zinc-900 border-zinc-700 text-zinc-300 hover:bg-zinc-800' : 'bg-[#FDFBF7] border-[#EBE6DC] text-stone-700 hover:bg-[#F4F1EA]'}`}>← Back to Home</button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {universities.map(uni => (
                <div key={uni.id} className={`rounded-3xl overflow-hidden border backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between group ${isDark ? 'bg-zinc-950/70 border-zinc-800 hover:border-indigo-500/50' : 'bg-[#FDFBF7]/75 border-[#EBE6DC] hover:border-stone-300 shadow-[0_8px_30px_rgb(0,0,0,0.03)]'}`}>
                  <div>
                    <div className="h-48 overflow-hidden relative bg-zinc-900 flex items-center justify-center">
                      <img 
                        src={uni.image} 
                        alt={uni.name} 
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-500" 
                        onError={(e)=>{e.target.onerror = null; e.target.src='https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=1200&q=80'}} 
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
                      <span className="absolute top-3 right-3 bg-black/60 backdrop-blur-md text-emerald-400 border border-emerald-500/30 text-[10px] font-bold px-2.5 py-1 rounded-full">✓ {uni.status}</span>
                    </div>
                    <div className="p-6 space-y-2">
                      <h3 className="font-bold text-sm">{uni.name}</h3>
                      <p className={`text-xs font-semibold ${isDark ? 'text-zinc-400' : 'text-stone-500'}`}>📍 {uni.location}</p>
                      <p className={`text-xs line-clamp-2 leading-relaxed ${isDark ? 'text-zinc-400' : 'text-stone-600'}`}>{uni.desc}</p>
                    </div>
                  </div>
                  <div className="p-6 pt-0">
                    <button onClick={() => { setSelectedUni(uni); setActiveTab('portal'); }} className="w-full bg-stone-900 hover:bg-stone-800 text-[#FDFBF7] py-3 rounded-2xl text-xs font-bold shadow-md transition-all">
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
          <div className={`max-w-3xl mx-auto p-8 rounded-3xl border backdrop-blur-xl shadow-xl space-y-6 ${isDark ? 'bg-zinc-950/90 border-zinc-800' : 'bg-[#FDFBF7]/85 border-[#EBE6DC] shadow-[0_12px_40px_rgb(0,0,0,0.04)]'}`}>
            <div className="flex justify-between items-center border-b pb-4 border-[#EBE6DC]">
              <div>
                <h2 className="text-lg font-extrabold">University Registration Portal</h2>
                <p className={`text-xs mt-0.5 ${isDark ? 'text-zinc-400' : 'text-stone-500'}`}>Sponsoring Body → State Govt → UGC Setup Route Application Form</p>
              </div>
              <button onClick={() => setCurrentView('home')} className={`text-xs font-bold ${isDark ? 'text-zinc-400 hover:text-white' : 'text-stone-500 hover:text-stone-800'}`}>Cancel</button>
            </div>

            <form onSubmit={handleUniversityRegistration} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={`block text-xs font-bold mb-1.5 ${isDark ? 'text-zinc-300' : 'text-stone-700'}`}>University Name</label>
                  <input type="text" value={regUniName} onChange={(e) => setRegUniName(e.target.value)} placeholder="e.g. Apex International University" className={`w-full rounded-2xl p-3.5 text-xs outline-none border transition ${isDark ? 'bg-zinc-900 border-zinc-800 text-zinc-100 focus:border-indigo-500' : 'bg-[#F4F1EA]/60 border-[#EBE6DC] text-stone-900 focus:border-stone-400'}`} required />
                </div>
                <div>
                  <label className={`block text-xs font-bold mb-1.5 ${isDark ? 'text-zinc-300' : 'text-stone-700'}`}>Location (State / City)</label>
                  <input type="text" value={regLocation} onChange={(e) => setRegLocation(e.target.value)} placeholder="e.g. Ranchi, Jharkhand" className={`w-full rounded-2xl p-3.5 text-xs outline-none border transition ${isDark ? 'bg-zinc-900 border-zinc-800 text-zinc-100 focus:border-indigo-500' : 'bg-[#F4F1EA]/60 border-[#EBE6DC] text-stone-900 focus:border-stone-400'}`} required />
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <h3 className="text-xs font-bold text-amber-800 uppercase tracking-wider">A. Sponsoring Body Documents</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <input type="text" value={regTrustDeed} onChange={(e) => setRegTrustDeed(e.target.value)} placeholder="Trust Deed / Society Reg. Number" className={`w-full rounded-2xl p-3.5 text-xs outline-none border ${isDark ? 'bg-zinc-900 border-zinc-800 text-zinc-100' : 'bg-[#F4F1EA]/60 border-[#EBE6DC] text-stone-900'}`} required />
                  <input type="text" value={regPan} onChange={(e) => setRegPan(e.target.value)} placeholder="Trust PAN Number" className={`w-full rounded-2xl p-3.5 text-xs outline-none border ${isDark ? 'bg-zinc-900 border-zinc-800 text-zinc-100' : 'bg-[#F4F1EA]/60 border-[#EBE6DC] text-stone-900'}`} required />
                </div>
              </div>

              <button type="submit" className="w-full bg-stone-900 hover:bg-stone-800 text-[#FDFBF7] py-3.5 rounded-2xl font-bold text-xs shadow-lg transition-all">
                Submit Application for State & UGC Review →
              </button>
            </form>
          </div>
        )}

        {/* 4. Admin Login Portal */}
        {currentView === 'admin-login' && !isAdminLoggedIn && (
          <div className={`max-w-md mx-auto p-8 rounded-3xl border backdrop-blur-xl shadow-xl space-y-6 my-12 ${isDark ? 'bg-zinc-950/90 border-zinc-800' : 'bg-[#FDFBF7]/85 border-[#EBE6DC] shadow-[0_12px_40px_rgb(0,0,0,0.04)]'}`}>
            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-amber-500/10 border border-amber-500/20 text-amber-800 rounded-2xl mx-auto flex items-center justify-center font-bold text-base shadow-inner">🔐</div>
              <h2 className="text-base font-extrabold">Global Admin Secure Login</h2>
              <p className={`text-xs ${isDark ? 'text-zinc-400' : 'text-stone-500'}`}>Enter admin credentials to manage university approvals.</p>
            </div>
            <form onSubmit={handleAdminLogin} className="space-y-4">
              <div>
                <label className={`block text-xs font-bold mb-1.5 ${isDark ? 'text-zinc-300' : 'text-stone-700'}`}>Admin Email ID</label>
                <input type="email" value={adminEmail} onChange={(e) => setAdminEmail(e.target.value)} placeholder="admin@univote.com" className={`w-full rounded-2xl p-3.5 text-xs outline-none border ${isDark ? 'bg-zinc-900 border-zinc-800 text-zinc-100' : 'bg-[#F4F1EA]/60 border-[#EBE6DC] text-stone-900'}`} required />
              </div>
              <div>
                <label className={`block text-xs font-bold mb-1.5 ${isDark ? 'text-zinc-300' : 'text-stone-700'}`}>Password</label>
                <input type="password" value={adminPassword} onChange={(e) => setAdminPassword(e.target.value)} placeholder="••••••••" className={`w-full rounded-2xl p-3.5 text-xs outline-none border ${isDark ? 'bg-zinc-900 border-zinc-800 text-zinc-100' : 'bg-[#F4F1EA]/60 border-[#EBE6DC] text-stone-900'}`} required />
              </div>
              <button type="submit" className="w-full bg-stone-900 hover:bg-stone-800 text-[#FDFBF7] py-3.5 rounded-2xl font-bold text-xs shadow-md transition">
                Login as Global Admin
              </button>
            </form>
          </div>
        )}

        {/* 5. University Interface & Dashboard */}
        {selectedUni && (
          <div className="space-y-6">
            <button onClick={() => setSelectedUni(null)} className={`text-xs font-bold ${isDark ? 'text-zinc-400 hover:text-white' : 'text-stone-500 hover:text-stone-800'}`}>← Back to Universities</button>
            
            <div className="relative h-60 rounded-3xl overflow-hidden border border-indigo-500/20 flex items-end p-7 shadow-xl bg-zinc-900">
              <div className="absolute inset-0 bg-cover bg-center filter brightness-50" style={{ backgroundImage: `url(${selectedUni.image})` }}></div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
              <div className="relative z-10 space-y-2">
                <span className="bg-stone-900/80 backdrop-blur-md text-[#FDFBF7] text-[10px] font-bold px-3 py-1 rounded-lg uppercase tracking-wider">Active Campus</span>
                <h2 className="text-2xl md:text-3xl font-extrabold text-white">{selectedUni.name}</h2>
                <p className="text-xs text-zinc-300 font-medium">📍 {selectedUni.location} • Eligible Voters: <span className="text-white font-bold">{selectedUni.eligible}</span></p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className={`p-3 rounded-3xl border backdrop-blur-xl space-y-1 h-fit ${isDark ? 'bg-zinc-950/70 border-zinc-800' : 'bg-[#FDFBF7]/75 border-[#EBE6DC]'}`}>
                <p className="text-[10px] font-extrabold text-amber-800 uppercase tracking-wider px-3 py-2">University Menu</p>
                <button onClick={() => setActiveTab('portal')} className={`w-full text-left px-3.5 py-3 rounded-2xl text-xs font-bold transition-all ${activeTab === 'portal' ? 'bg-stone-900 text-[#FDFBF7]' : 'text-stone-600'}`}>
                  🏠 University Overview
                </button>
                <button onClick={() => setActiveTab('voting')} className={`w-full text-left px-3.5 py-3 rounded-2xl text-xs font-bold transition-all ${activeTab === 'voting' ? 'bg-stone-900 text-[#FDFBF7]' : 'text-stone-600'}`}>
                  🗳️ Voting Booth
                </button>
                <button onClick={() => setActiveTab('student-portal')} className={`w-full text-left px-3.5 py-3 rounded-2xl text-xs font-bold transition-all ${activeTab === 'student-portal' ? 'bg-stone-900 text-[#FDFBF7]' : 'text-stone-600'}`}>
                  🎓 Student Dashboard
                </button>
                <button onClick={() => setActiveTab('faculty-portal')} className={`w-full text-left px-3.5 py-3 rounded-2xl text-xs font-bold transition-all ${activeTab === 'faculty-portal' ? 'bg-stone-900 text-[#FDFBF7]' : 'text-stone-600'}`}>
                  👨‍🏫 Faculty Portal
                </button>
                <button onClick={() => setActiveTab('timetable')} className={`w-full text-left px-3.5 py-3 rounded-2xl text-xs font-bold transition-all ${activeTab === 'timetable' ? 'bg-stone-900 text-[#FDFBF7]' : 'text-stone-600'}`}>
                  📅 Class Timetable
                </button>
                <button onClick={() => setActiveTab('documents')} className={`w-full text-left px-3.5 py-3 rounded-2xl text-xs font-bold transition-all ${activeTab === 'documents' ? 'bg-stone-900 text-[#FDFBF7]' : 'text-stone-600'}`}>
                  📄 Document Verification
                </button>
                <button onClick={() => setActiveTab('uni-admin')} className={`w-full text-left px-3.5 py-3 rounded-2xl text-xs font-bold transition-all ${activeTab === 'uni-admin' ? 'bg-stone-900 text-[#FDFBF7]' : 'text-stone-600'}`}>
                  🛡️ Uni Admin Panel
                </button>
              </div>

              <div className="md:col-span-3 space-y-6">
                {activeTab === 'documents' && (
                  <div className={`p-7 rounded-3xl border backdrop-blur-xl space-y-5 ${isDark ? 'bg-zinc-950/70 border-zinc-800' : 'bg-[#FDFBF7]/75 border-[#EBE6DC]'}`}>
                    <h3 className="text-base font-extrabold">Student Verification Document Portal</h3>
                    <form onSubmit={handleDocumentSubmit} className="space-y-3.5">
                      <div>
                        <label className="block text-xs font-bold mb-1.5">Identity Document / PDF</label>
                        <input type="file" onChange={(e) => setAadhaarFile(e.target.files[0]?.name || '')} className="w-full text-xs" required />
                      </div>
                      <button type="submit" className="w-full bg-stone-900 hover:bg-stone-800 text-[#FDFBF7] py-3.5 rounded-2xl font-bold text-xs shadow-lg transition-all">
                        Upload Documents for Verification →
                      </button>
                    </form>
                    {docSubmitted && (
                      <p className="text-xs text-emerald-600 font-bold text-center pt-2">✓ Documents submitted successfully and pending university verification.</p>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Payment Modal */}
            {isPaymentModalOpen && activePaymentFee && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
                <div className="max-w-md w-full p-8 rounded-3xl border shadow-2xl space-y-6 bg-zinc-950 text-zinc-100">
                  <h3 className="text-lg font-extrabold">{activePaymentFee.semester}</h3>
                  <button onClick={() => setIsPaymentModalOpen(false)} className="w-full bg-indigo-600 text-white py-3 rounded-2xl">Close</button>
                </div>
              </div>
            )}
          </div>
        )}

      </main>
    </div>
  );
}