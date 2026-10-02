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

  // University Admin Image Upload States
  const [bannerInputType, setBannerInputType] = useState('url'); // 'url' or 'file'
  const [newBannerImage, setNewBannerImage] = useState('');
  const [bannerFileObj, setBannerFileObj] = useState(null);

  const [galleryInputType, setGalleryInputType] = useState('url'); // 'url' or 'file'
  const [newGalleryImage, setNewGalleryImage] = useState('');
  const [galleryFileObj, setGalleryFileObj] = useState(null);

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

  // Faculty login strictly validated against university admin generated faculty records
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

  // Payment Gateway Trigger Functions with rigorous check for student registration/login
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

  const handleUpdateSalary = (facultyId, updatedSalary) => {
    setFacultySalaries(prev => prev.map(f => f.id === facultyId ? { ...f, salary: updatedSalary } : f));
    alert("Faculty salary updated successfully!");
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

  const getFileUrl = (fileObj) => {
    if (!fileObj) return '';
    return URL.createObjectURL(fileObj);
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
                A clean, attractive framework featuring secure university registrations, faculty payroll controls, live timetables, and encrypted digital elections.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
              <div className={`p-7 rounded-3xl transition-all duration-300 hover:-translate-y-1 shadow-[0_8px_30px_rgb(0,0,0,0.03)] border backdrop-blur-xl ${isDark ? 'bg-zinc-950/70 border-zinc-800/80 hover:border-indigo-500/50' : 'bg-[#FDFBF7]/75 border-[#EBE6DC] hover:border-stone-300'}`}>
                <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-700 flex items-center justify-center font-bold text-base mb-5 shadow-inner">👨‍🏫</div>
                <h4 className={`text-sm font-bold mb-2 ${isDark ? 'text-zinc-100' : 'text-stone-900'}`}>Faculty & Timetable Controls</h4>
                <p className={`text-xs leading-relaxed ${isDark ? 'text-zinc-400' : 'text-stone-600'}`}>Admin & faculty controls for publishing class timetables, rosters, and monthly compensation packages securely.</p>
              </div>
              <div className={`p-7 rounded-3xl transition-all duration-300 hover:-translate-y-1 shadow-[0_8px_30px_rgb(0,0,0,0.03)] border backdrop-blur-xl ${isDark ? 'bg-zinc-950/70 border-zinc-800/80 hover:border-indigo-500/50' : 'bg-[#FDFBF7]/75 border-[#EBE6DC] hover:border-stone-300'}`}>
                <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-700 flex items-center justify-center font-bold text-base mb-5 shadow-inner">🗳</div>
                <h4 className={`text-sm font-bold mb-2 ${isDark ? 'text-zinc-100' : 'text-stone-900'}`}>Campus Voting Booth</h4>
                <p className={`text-xs leading-relaxed ${isDark ? 'text-zinc-400' : 'text-stone-600'}`}>Secure, authenticated student voting booths for annual student union elections with live vote tallying.</p>
              </div>
              <div className={`p-7 rounded-3xl transition-all duration-300 hover:-translate-y-1 shadow-[0_8px_30px_rgb(0,0,0,0.03)] border backdrop-blur-xl ${isDark ? 'bg-zinc-950/70 border-zinc-800/80 hover:border-indigo-500/50' : 'bg-[#FDFBF7]/75 border-[#EBE6DC] hover:border-stone-300'}`}>
                <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-700 flex items-center justify-center font-bold text-base mb-5 shadow-inner">📊</div>
                <h4 className={`text-sm font-bold mb-2 ${isDark ? 'text-zinc-100' : 'text-stone-900'}`}>Student Portal & Records</h4>
                <p className={`text-xs leading-relaxed ${isDark ? 'text-zinc-400' : 'text-stone-600'}`}>Dedicated student dashboards to view live timetables, subject marks, exam results, fee updates, and events.</p>
              </div>
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

                <h3 className="text-xs font-bold text-amber-800 uppercase tracking-wider pt-2">B. Land & Infrastructure (Min 50 Acres)</h3>
                <input type="text" value={regLandDoc} onChange={(e) => setRegLandDoc(e.target.value)} placeholder="Sale Deed / CLU Certificate Link or Ref" className={`w-full rounded-2xl p-3.5 text-xs outline-none border ${isDark ? 'bg-zinc-900 border-zinc-800 text-zinc-100' : 'bg-[#F4F1EA]/60 border-[#EBE6DC] text-stone-900'}`} required />

                <h3 className="text-xs font-bold text-amber-800 uppercase tracking-wider pt-2">C. Financial Documents</h3>
                <input type="text" value={regCorpusFund} onChange={(e) => setRegCorpusFund(e.target.value)} placeholder="Corpus Fund Proof (Rs 25 Cr FD Ref)" className={`w-full rounded-2xl p-3.5 text-xs outline-none border ${isDark ? 'bg-zinc-900 border-zinc-800 text-zinc-100' : 'bg-[#F4F1EA]/60 border-[#EBE6DC] text-stone-900'}`} required />
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
              <div className="text-center pt-2">
                <button type="button" onClick={() => setCurrentView('home')} className={`text-xs font-bold ${isDark ? 'text-zinc-400 hover:text-white' : 'text-stone-500 hover:text-stone-800'}`}>← Return to Home</button>
              </div>
            </form>
          </div>
        )}

        {/* 5. Admin Dashboard */}
        {currentView === 'admin-panel' && isAdminLoggedIn && (
          <div className="space-y-6">
            <div className={`p-6 rounded-3xl border backdrop-blur-xl flex justify-between items-center ${isDark ? 'bg-zinc-950/70 border-zinc-800' : 'bg-[#FDFBF7]/75 border-[#EBE6DC] shadow-[0_8px_30px_rgb(0,0,0,0.03)]'}`}>
              <div>
                <h2 className="text-lg font-extrabold">Global Admin Control Panel</h2>
                <p className={`text-xs mt-0.5 ${isDark ? 'text-zinc-400' : 'text-stone-500'}`}>Review sponsoring body documents and approve university applications.</p>
              </div>
              <button onClick={() => { setIsAdminLoggedIn(false); setCurrentView('home'); }} className="bg-red-500/10 hover:bg-red-500/20 text-red-400 px-4 py-2 rounded-xl text-xs font-bold border border-red-500/20 transition">Logout Admin</button>
            </div>

            <div className={`p-6 rounded-3xl border backdrop-blur-xl space-y-4 ${isDark ? 'bg-zinc-950/70 border-zinc-800' : 'bg-[#FDFBF7]/75 border-[#EBE6DC] shadow-[0_8px_30px_rgb(0,0,0,0.03)]'}`}>
              <h3 className="text-sm font-bold">Pending University Applications</h3>
              <div className="space-y-3">
                {registeredApplications.map(app => (
                  <div key={app.id} className={`p-4 rounded-2xl border flex justify-between items-center transition-all ${isDark ? 'bg-zinc-900/50 border-zinc-800 hover:border-zinc-700' : 'bg-[#F4F1EA]/50 border-[#EBE6DC] hover:border-stone-300'}`}>
                    <div>
                      <h4 className="font-bold text-xs">{app.name}</h4>
                      <p className={`text-xs mt-0.5 ${isDark ? 'text-zinc-400' : 'text-stone-500'}`}>📍 {app.location} | Trust: {app.trust}</p>
                      <p className={`text-[11px] mt-1 ${isDark ? 'text-zinc-400' : 'text-stone-500'}`}>Status: <span className="text-amber-700 font-bold">{app.status}</span></p>
                    </div>
                    {app.status === 'Pending Approval' ? (
                      <button onClick={() => handleApproveUni(app.id)} className="bg-stone-900 hover:bg-stone-800 text-[#FDFBF7] px-4 py-2.5 rounded-xl text-xs font-bold shadow-md transition">
                        Approve & Publish
                      </button>
                    ) : (
                      <span className="text-xs font-bold text-emerald-600 bg-emerald-500/10 px-3 py-1.5 rounded-xl border border-emerald-500/20">✓ Approved</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 6. University Interface & Dashboard with Isolated Portals per Role */}
        {selectedUni && (
          <div className="space-y-6">
            <button onClick={() => setSelectedUni(null)} className={`text-xs font-bold ${isDark ? 'text-zinc-400 hover:text-white' : 'text-stone-500 hover:text-stone-800'}`}>← Back to Universities</button>
            
            <div className="relative h-60 rounded-3xl overflow-hidden border border-indigo-500/20 flex items-end p-7 shadow-xl bg-zinc-900">
              <div 
                className="absolute inset-0 bg-cover bg-center filter brightness-50" 
                style={{ backgroundImage: `url(${selectedUni.image})` }}
              ></div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
              <div className="relative z-10 space-y-2">
                <span className="bg-stone-900/80 backdrop-blur-md text-[#FDFBF7] text-[10px] font-bold px-3 py-1 rounded-lg uppercase tracking-wider">Active Campus</span>
                <h2 className="text-2xl md:text-3xl font-extrabold text-white">{selectedUni.name}</h2>
                <p className="text-xs text-zinc-300 font-medium">📍 {selectedUni.location} • Eligible Voters: <span className="text-white font-bold">{selectedUni.eligible}</span></p>
              </div>
            </div>

            {/* University Portal Layout (Sidebar + Content with strict isolation rules) */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              
              {/* Sidebar Options with Strict Access Control: if faculty is logged in, restrict access to other portals */}
              <div className={`p-3 rounded-3xl border backdrop-blur-xl space-y-1 h-fit ${isDark ? 'bg-zinc-950/70 border-zinc-800' : 'bg-[#FDFBF7]/75 border-[#EBE6DC] shadow-[0_8px_30px_rgb(0,0,0,0.03)]'}`}>
                <p className="text-[10px] font-extrabold text-amber-800 uppercase tracking-wider px-3 py-2">University Menu</p>
                
                {isFacultyLoggedIn ? (
                  <>
                    <p className="text-[10px] text-amber-600 px-3 font-semibold pb-1">🔒 Faculty Mode Active (Portals Restricted)</p>
                    <button onClick={() => setActiveTab('faculty-portal')} className={`w-full text-left px-3.5 py-3 rounded-2xl text-xs font-bold transition-all ${activeTab === 'faculty-portal' ? 'bg-stone-900 text-[#FDFBF7] shadow-md' : isDark ? 'text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200' : 'text-stone-600 hover:bg-[#F4F1EA] hover:text-stone-900'}`}>
                      👨‍🏫 Faculty Marks Management
                    </button>
                    <button onClick={() => setActiveTab('timetable')} className={`w-full text-left px-3.5 py-3 rounded-2xl text-xs font-bold transition-all ${activeTab === 'timetable' ? 'bg-stone-900 text-[#FDFBF7] shadow-md' : isDark ? 'text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200' : 'text-stone-600 hover:bg-[#F4F1EA] hover:text-stone-900'}`}>
                      📅 Class Timetable
                    </button>
                  </>
                ) : (
                  <>
                    <button onClick={() => setActiveTab('portal')} className={`w-full text-left px-3.5 py-3 rounded-2xl text-xs font-bold transition-all ${activeTab === 'portal' ? 'bg-stone-900 text-[#FDFBF7] shadow-md' : isDark ? 'text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200' : 'text-stone-600 hover:bg-[#F4F1EA] hover:text-stone-900'}`}>
                      🏠 University Overview
                    </button>
                    <button onClick={() => setActiveTab('voting')} className={`w-full text-left px-3.5 py-3 rounded-2xl text-xs font-bold transition-all ${activeTab === 'voting' ? 'bg-stone-900 text-[#FDFBF7] shadow-md' : isDark ? 'text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200' : 'text-stone-600 hover:bg-[#F4F1EA] hover:text-stone-900'}`}>
                      🗳️ Voting Booth
                    </button>
                    <button onClick={() => setActiveTab('student-portal')} className={`w-full text-left px-3.5 py-3 rounded-2xl text-xs font-bold transition-all ${activeTab === 'student-portal' ? 'bg-stone-900 text-[#FDFBF7] shadow-md' : isDark ? 'text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200' : 'text-stone-600 hover:bg-[#F4F1EA] hover:text-stone-900'}`}>
                      🎓 Student Portal & Dashboard
                    </button>
                    <button onClick={() => setActiveTab('faculty-portal')} className={`w-full text-left px-3.5 py-3 rounded-2xl text-xs font-bold transition-all ${activeTab === 'faculty-portal' ? 'bg-stone-900 text-[#FDFBF7] shadow-md' : isDark ? 'text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200' : 'text-stone-600 hover:bg-[#F4F1EA] hover:text-stone-900'}`}>
                      👨‍🏫 Faculty Marks Management
                    </button>
                    <button onClick={() => setActiveTab('timetable')} className={`w-full text-left px-3.5 py-3 rounded-2xl text-xs font-bold transition-all ${activeTab === 'timetable' ? 'bg-stone-900 text-[#FDFBF7] shadow-md' : isDark ? 'text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200' : 'text-stone-600 hover:bg-[#F4F1EA] hover:text-stone-900'}`}>
                      📅 Class Timetable
                    </button>
                    <button onClick={() => setActiveTab('documents')} className={`w-full text-left px-3.5 py-3 rounded-2xl text-xs font-bold transition-all ${activeTab === 'documents' ? 'bg-stone-900 text-[#FDFBF7] shadow-md' : isDark ? 'text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200' : 'text-stone-600 hover:bg-[#F4F1EA] hover:text-stone-900'}`}>
                      📄 Document Verification
                    </button>
                    <button onClick={() => setActiveTab('uni-admin')} className={`w-full text-left px-3.5 py-3 rounded-2xl text-xs font-bold transition-all ${activeTab === 'uni-admin' ? 'bg-stone-900 text-[#FDFBF7] shadow-md' : isDark ? 'text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200' : 'text-stone-600 hover:bg-[#F4F1EA] hover:text-stone-900'}`}>
                      🛡️ Uni Admin Panel
                    </button>
                    <button onClick={() => setActiveTab('manager')} className={`w-full text-left px-3.5 py-3 rounded-2xl text-xs font-bold transition-all ${activeTab === 'manager' ? 'bg-stone-900 text-[#FDFBF7] shadow-md' : isDark ? 'text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200' : 'text-stone-600 hover:bg-[#F4F1EA] hover:text-stone-900'}`}>
                      🏛️ Organisation Panel
                    </button>
                  </>
                )}
              </div>

              {/* Main Content Area */}
              <div className="md:col-span-3 space-y-6">

                {/* Overview Tab with Gallery & Image fallback fixes */}
                {activeTab === 'portal' && (!isFacultyLoggedIn) && (
                  <div className="space-y-6">
                    <div className={`p-7 rounded-3xl border backdrop-blur-xl space-y-4 ${isDark ? 'bg-zinc-950/70 border-zinc-800' : 'bg-[#FDFBF7]/75 border-[#EBE6DC] shadow-[0_8px_30px_rgb(0,0,0,0.03)]'}`}>
                      <h3 className="text-base font-extrabold">Welcome to {selectedUni.name} Portal</h3>
                      <p className={`text-xs leading-relaxed ${isDark ? 'text-zinc-300' : 'text-stone-600'}`}>{selectedUni.desc}</p>
                      <div className="grid grid-cols-2 gap-4 pt-2">
                        <div className={`p-4 rounded-2xl border ${isDark ? 'bg-zinc-900/60 border-zinc-800' : 'bg-[#F4F1EA]/60 border-[#EBE6DC]'}`}>
                          <p className="text-[10px] font-extrabold text-amber-800 uppercase">Total Candidates</p>
                          <p className="text-2xl font-extrabold mt-1">{selectedUni.candidates.length}</p>
                        </div>
                        <div className={`p-4 rounded-2xl border ${isDark ? 'bg-zinc-900/60 border-zinc-800' : 'bg-[#F4F1EA]/60 border-[#EBE6DC]'}`}>
                          <p className="text-[10px] font-extrabold text-amber-800 uppercase">Verification Status</p>
                          <p className="text-2xl font-extrabold text-emerald-600 mt-1">Verified</p>
                        </div>
                      </div>
                    </div>

                    {/* Campus Gallery Section with fallback image handling */}
                    {selectedUni.gallery && selectedUni.gallery.length > 0 && (
                      <div className={`p-7 rounded-3xl border backdrop-blur-xl space-y-4 ${isDark ? 'bg-zinc-950/70 border-zinc-800' : 'bg-[#FDFBF7]/75 border-[#EBE6DC] shadow-[0_8px_30px_rgb(0,0,0,0.03)]'}`}>
                        <h4 className="text-sm font-extrabold">📷 Campus Gallery & Events</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {selectedUni.gallery.map((imgUrl, idx) => (
                            <div key={idx} className="h-48 rounded-2xl overflow-hidden border border-zinc-800/80 group bg-zinc-900 flex items-center justify-center">
                              <img 
                                src={imgUrl} 
                                alt={`Gallery ${idx + 1}`} 
                                className="w-full h-full object-cover group-hover:scale-105 transition duration-500" 
                                onError={(e)=>{e.target.onerror = null; e.target.src='https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=800&q=80'}}
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Voting Booth Tab */}
                {activeTab === 'voting' && (!isFacultyLoggedIn) && (
                  <div className="space-y-4">
                    <h3 className="text-base font-extrabold">Active Election Candidates</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {selectedUni.candidates.map(cand => (
                        <div key={cand.id} className={`p-6 rounded-3xl border backdrop-blur-xl flex justify-between items-center transition-all ${isDark ? 'bg-zinc-950/70 border-zinc-800 hover:border-indigo-500/50' : 'bg-[#FDFBF7]/75 border-[#EBE6DC] hover:border-stone-300 shadow-[0_8px_30px_rgb(0,0,0,0.03)]'}`}>
                          <div>
                            <h4 className="font-bold text-sm">{cand.name}</h4>
                            <p className={`text-xs mt-1 ${isDark ? 'text-zinc-400' : 'text-stone-500'}`}>Party: <span className="font-bold">{cand.party}</span></p>
                            <p className={`text-xs mt-1 ${isDark ? 'text-zinc-400' : 'text-stone-500'}`}>Current Votes: <span className="font-extrabold">{cand.votes}</span></p>
                          </div>
                          <button onClick={() => handleVote(selectedUni.id, cand.id)} className="bg-stone-900 hover:bg-stone-800 text-[#FDFBF7] px-4 py-2.5 rounded-xl text-xs font-bold shadow-md transition">
                            Vote Now
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Student Portal & Dashboard Tab */}
                {activeTab === 'student-portal' && (!isFacultyLoggedIn) && (
                  <div className="space-y-6">
                    
                    {/* Student Dashboard Overview */}
                    <div className={`p-7 rounded-3xl border backdrop-blur-xl space-y-4 ${isDark ? 'bg-zinc-950/70 border-zinc-800' : 'bg-[#FDFBF7]/75 border-[#EBE6DC] shadow-[0_8px_30px_rgb(0,0,0,0.03)]'}`}>
                      <h3 className="text-base font-extrabold">🎓 Student Dashboard Overview</h3>
                      <p className={`text-xs ${isDark ? 'text-zinc-400' : 'text-stone-500'}`}>Welcome back! Here is your quick academic summary and stats.</p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 pt-1">
                        <div className={`p-4 rounded-2xl border ${isDark ? 'bg-zinc-900/60 border-zinc-800' : 'bg-[#F4F1EA]/60 border-[#EBE6DC]'}`}>
                          <p className="text-[10px] font-extrabold text-amber-800 uppercase">Current CGPA</p>
                          <p className="text-xl font-extrabold mt-1">8.92 / 10</p>
                        </div>
                        <div className={`p-4 rounded-2xl border ${isDark ? 'bg-zinc-900/60 border-zinc-800' : 'bg-[#F4F1EA]/60 border-[#EBE6DC]'}`}>
                          <p className="text-[10px] font-extrabold text-amber-800 uppercase">Attendance</p>
                          <p className="text-xl font-extrabold text-emerald-600 mt-1">92.4%</p>
                        </div>
                        <div className={`p-4 rounded-2xl border ${isDark ? 'bg-zinc-900/60 border-zinc-800' : 'bg-[#F4F1EA]/60 border-[#EBE6DC]'}`}>
                          <p className="text-[10px] font-extrabold text-amber-800 uppercase">Fee Status</p>
                          <p className="text-xl font-extrabold text-amber-700 mt-1">1 Pending</p>
                        </div>
                        <div className={`p-4 rounded-2xl border ${isDark ? 'bg-zinc-900/60 border-zinc-800' : 'bg-[#F4F1EA]/60 border-[#EBE6DC]'}`}>
                          <p className="text-[10px] font-extrabold text-amber-800 uppercase">Registered Exams</p>
                          <p className="text-xl font-extrabold mt-1">6 Subjects</p>
                        </div>
                      </div>
                    </div>

                    {/* University News & Announcements Section */}
                    <div className={`p-7 rounded-3xl border backdrop-blur-xl space-y-4 ${isDark ? 'bg-zinc-950/70 border-zinc-800' : 'bg-[#FDFBF7]/75 border-[#EBE6DC] shadow-[0_8px_30px_rgb(0,0,0,0.03)]'}`}>
                      <div className="flex justify-between items-center border-b pb-3 border-[#EBE6DC]">
                        <div>
                          <span className="text-[10px] font-extrabold tracking-wider text-amber-800 uppercase">Live University Feed</span>
                          <h3 className="text-base font-extrabold">📰 Campus News & Announcements</h3>
                        </div>
                        <span className="bg-amber-500/10 text-amber-800 border border-amber-500/20 px-3 py-1 rounded-xl text-xs font-bold">
                          {newsList.length} Active Bulletins
                        </span>
                      </div>

                      <div className="space-y-3 pt-1">
                        {newsList.length === 0 ? (
                          <p className={`text-xs ${isDark ? 'text-zinc-400' : 'text-stone-500'}`}>No news or announcements posted by the university admin yet.</p>
                        ) : (
                          newsList.map(news => (
                            <div key={news.id} className={`p-5 rounded-2xl border space-y-2 transition-all ${isDark ? 'bg-zinc-900/40 border-zinc-800 hover:border-indigo-500/40' : 'bg-[#F4F1EA]/50 border-[#EBE6DC]'}`}>
                              <div className="flex justify-between items-center">
                                <span className="bg-amber-500/10 text-amber-800 border border-amber-500/20 px-2.5 py-0.5 rounded-lg text-[10px] font-bold">
                                  {news.category}
                                </span>
                                <span className={`text-[11px] font-medium ${isDark ? 'text-zinc-400' : 'text-stone-500'}`}>📅 {news.date}</span>
                              </div>
                              <h4 className="font-bold text-sm tracking-tight">{news.title}</h4>
                              <p className={`text-xs leading-relaxed ${isDark ? 'text-zinc-300' : 'text-stone-600'}`}>{news.content}</p>
                            </div>
                          ))
                        )}
                      </div>
                    </div>

                    <div className={`p-7 rounded-3xl border backdrop-blur-xl space-y-4 ${isDark ? 'bg-zinc-950/70 border-zinc-800' : 'bg-[#FDFBF7]/75 border-[#EBE6DC] shadow-[0_8px_30px_rgb(0,0,0,0.03)]'}`}>
                      <h3 className="text-base font-extrabold">📝 Examination Marks & Grades</h3>
                      <p className={`text-xs ${isDark ? 'text-zinc-400' : 'text-stone-500'}`}>View live marks entered by faculty members.</p>

                      <div className="space-y-3 pt-1">
                        {['Mid-Term Exam', 'End-Term Exam', 'Quiz 1'].map((examName) => (
                          <div key={examName} className={`p-5 rounded-2xl border space-y-2.5 ${isDark ? 'bg-zinc-900/40 border-zinc-800' : 'bg-[#F4F1EA]/50 border-[#EBE6DC]'}`}>
                            <h4 className="font-bold text-xs uppercase tracking-wider text-amber-800 border-b pb-2 border-[#EBE6DC]">{examName}</h4>
                            <div className="space-y-2 pt-1">
                              {studentMarks.filter(m => m.exam === examName).length === 0 ? (
                                <p className="text-[11px] text-stone-500">No records found for {examName}.</p>
                              ) : (
                                studentMarks.filter(m => m.exam === examName).map(m => (
                                  <div key={m.id} className={`p-3.5 rounded-xl border flex justify-between items-center ${isDark ? 'bg-zinc-950 border-zinc-800/80' : 'bg-[#FDFBF7] border-[#EBE6DC]'}`}>
                                    <div>
                                      <h5 className="font-bold text-xs">{m.subject}</h5>
                                      <p className={`text-[11px] mt-0.5 ${isDark ? 'text-zinc-400' : 'text-stone-500'}`}>Marks: <span className="font-bold">{m.marks}</span></p>
                                    </div>
                                    <span className="bg-stone-900/10 text-stone-900 border border-stone-300 px-3 py-1 rounded-xl text-xs font-bold">
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

                    {/* Student Fee Dues & Payment Gateway Integration - Strictly allowed only if registered/logged in */}
                    <div className={`p-7 rounded-3xl border backdrop-blur-xl space-y-4 ${isDark ? 'bg-zinc-950/70 border-zinc-800' : 'bg-[#FDFBF7]/75 border-[#EBE6DC] shadow-[0_8px_30px_rgb(0,0,0,0.03)]'}`}>
                      <div className="flex justify-between items-center border-b pb-3 border-[#EBE6DC]">
                        <div>
                          <span className="text-[10px] font-extrabold tracking-wider text-amber-800 uppercase">Secure Finance Portal</span>
                          <h3 className="text-base font-extrabold">💳 Student Fee Dues & Payment Gateway</h3>
                        </div>
                        <span className="bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-3 py-1 rounded-xl text-xs font-bold">
                          🔒 256-Bit SSL Encrypted
                        </span>
                      </div>
                      <p className={`text-xs ${isDark ? 'text-zinc-400' : 'text-stone-500'}`}>Check tuition fee status and securely clear pending semester payments online. (Note: Payment allowed only for logged-in students).</p>
                      
                      <div className="space-y-3">
                        {studentFees.map(fee => (
                          <div key={fee.id} className={`p-4.5 rounded-2xl border flex justify-between items-center ${isDark ? 'bg-zinc-900/40 border-zinc-800' : 'bg-[#F4F1EA]/50 border-[#EBE6DC]'}`}>
                            <div>
                              <h4 className="font-bold text-xs">{fee.semester}</h4>
                              <p className={`text-xs mt-0.5 ${isDark ? 'text-zinc-400' : 'text-stone-500'}`}>Amount: <span className="font-bold text-amber-700">{fee.amount}</span> | Due Date: {fee.dueDate}</p>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className={`text-xs font-bold px-3 py-1 rounded-xl border ${fee.status === 'Paid' ? 'bg-emerald-50/80 text-emerald-700 border-emerald-200' : 'bg-amber-50/80 text-amber-700 border-amber-200'}`}>
                                {fee.status === 'Paid' ? '✓ Paid' : 'Pending Dues'}
                              </span>
                              {fee.status === 'Pending' && (
                                <button onClick={() => openPaymentModal(fee)} className="bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-xl text-xs font-bold shadow-lg transition transform hover:-translate-y-0.5">
                                  Pay Now →
                                </button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className={`p-7 rounded-3xl border backdrop-blur-xl space-y-4 ${isDark ? 'bg-zinc-950/70 border-zinc-800' : 'bg-[#FDFBF7]/75 border-[#EBE6DC] shadow-[0_8px_30px_rgb(0,0,0,0.03)]'}`}>
                      <h3 className="text-base font-extrabold">📅 Upcoming Campus Events</h3>
                      <p className={`text-xs ${isDark ? 'text-zinc-400' : 'text-stone-500'}`}>Stay updated with upcoming academic and extracurricular schedules.</p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        {upcomingEvents.map(evt => (
                          <div key={evt.id} className={`p-4.5 rounded-2xl border space-y-2 ${isDark ? 'bg-zinc-900/40 border-zinc-800' : 'bg-[#F4F1EA]/50 border-[#EBE6DC]'}`}>
                            <span className="bg-amber-500/10 text-amber-800 border border-amber-500/20 px-2.5 py-0.5 rounded-lg text-[10px] font-bold">{evt.date}</span>
                            <h4 className="font-bold text-xs mt-1">{evt.title}</h4>
                            <p className={`text-xs leading-relaxed ${isDark ? 'text-zinc-400' : 'text-stone-600'}`}>{evt.desc}</p>
                            <p className="text-[11px] font-bold text-amber-800">📍 {evt.venue}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>
                )}

                {/* Faculty Portal Tab - Enforcing ID & Password provided by University Admin & Login requirement for marking */}
                {activeTab === 'faculty-portal' && (
                  <div className={`p-7 rounded-3xl border backdrop-blur-xl space-y-6 ${isDark ? 'bg-zinc-950/70 border-zinc-800' : 'bg-[#FDFBF7]/75 border-[#EBE6DC] shadow-[0_8px_30px_rgb(0,0,0,0.03)]'}`}>
                    
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b pb-4 border-[#EBE6DC] gap-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-amber-700"></span>
                          <span className="text-[10px] font-extrabold tracking-wider text-amber-800 uppercase">Faculty Assessment Dashboard</span>
                        </div>
                        <h3 className="text-lg font-extrabold">Marks & Evaluation Portal</h3>
                        <p className={`text-xs ${isDark ? 'text-zinc-400' : 'text-stone-500'}`}>Manage and publish verified student marks and academic grades in real-time. (Faculty must be logged in to allot marks).</p>
                      </div>
                      {isFacultyLoggedIn && (
                        <button onClick={() => setIsFacultyLoggedIn(false)} className="bg-red-500/10 hover:bg-red-500/20 text-red-400 px-4 py-2 rounded-xl text-xs font-bold border border-red-500/20 transition">
                          🔒 Logout Faculty
                        </button>
                      )}
                    </div>

                    {!isFacultyLoggedIn ? (
                      <div className={`max-w-md mx-auto p-6 rounded-3xl border space-y-4 my-4 ${isDark ? 'bg-zinc-900/60 border-zinc-800' : 'bg-[#F4F1EA]/60 border-[#EBE6DC]'}`}>
                        <div className="text-center space-y-1.5">
                          <div className="w-12 h-12 bg-amber-500/10 border border-amber-500/20 text-amber-800 rounded-2xl mx-auto flex items-center justify-center font-bold text-base">👨‍‍🏫</div>
                          <h4 className="font-extrabold text-sm">Faculty Secure Portal</h4>
                          <p className={`text-xs ${isDark ? 'text-zinc-400' : 'text-stone-500'}`}>Enter Faculty ID and Password provided by University Admin.</p>
                          <div className="bg-amber-500/10 border border-amber-500/20 p-2.5 rounded-xl text-[11px] text-amber-900 font-mono mt-2 text-left space-y-1">
                            <div>📌 Faculty IDs provided by Admin:</div>
                            {facultySalaries.map(f => (
                              <div key={f.id}>• ID: <b>{f.facultyId}</b> ({f.name})</div>
                            ))}
                            <div>🔑 Password: <b>Faculty@1234</b></div>
                          </div>
                        </div>
                        <form onSubmit={handleFacultyLogin} className="space-y-3.5 pt-1">
                          <div>
                            <label className={`block text-xs font-bold mb-1.5 ${isDark ? 'text-zinc-300' : 'text-stone-700'}`}>Faculty ID (Provided by Uni Admin)</label>
                            <input type="text" value={facultyIdInput} onChange={(e) => setFacultyIdInput(e.target.value)} placeholder="e.g. FAC101" className={`w-full rounded-2xl p-3 text-xs outline-none border ${isDark ? 'bg-zinc-950 border-zinc-800 text-zinc-100' : 'bg-[#FDFBF7] border-[#EBE6DC] text-stone-900'}`} required />
                          </div>
                          <div>
                            <label className={`block text-xs font-bold mb-1.5 ${isDark ? 'text-zinc-300' : 'text-stone-700'}`}>Password</label>
                            <input type="password" value={facultyPassword} onChange={(e) => setFacultyPassword(e.target.value)} placeholder="••••••••" className={`w-full rounded-2xl p-3 text-xs outline-none border ${isDark ? 'bg-zinc-950 border-zinc-800 text-zinc-100' : 'bg-[#FDFBF7] border-[#EBE6DC] text-stone-900'}`} required />
                          </div>
                          <button type="submit" className="w-full bg-stone-900 hover:bg-stone-800 text-[#FDFBF7] py-3.5 rounded-2xl font-bold text-xs shadow-md transition">
                            Authenticate Faculty →
                          </button>
                        </form>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        
                        <div className={`p-6 rounded-2xl border space-y-4 ${isDark ? 'bg-zinc-900/40 border-zinc-800' : 'bg-[#F4F1EA]/50 border-[#EBE6DC]'}`}>
                          <h4 className="font-extrabold text-xs uppercase tracking-wider text-amber-800">✍️ Publish New Student Examination Marks (Faculty Logged In)</h4>
                          <form onSubmit={handleAddMark} className="space-y-3.5">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                              <div>
                                <label className={`block text-xs font-bold mb-1 ${isDark ? 'text-zinc-300' : 'text-stone-700'}`}>Examination Type</label>
                                <select value={newExamType} onChange={(e) => setNewExamType(e.target.value)} className={`w-full rounded-xl p-3 text-xs outline-none border ${isDark ? 'bg-zinc-950 border-zinc-800 text-zinc-200' : 'bg-[#FDFBF7] border-[#EBE6DC] text-stone-900'}`}>
                                  <option value="Mid-Term Exam">Mid-Term Exam</option>
                                  <option value="End-Term Exam">End-Term Exam</option>
                                  <option value="Quiz 1">Quiz 1</option>
                                </select>
                              </div>
                              <div>
                                <label className={`block text-xs font-bold mb-1 ${isDark ? 'text-zinc-300' : 'text-stone-700'}`}>Subject Title</label>
                                <input type="text" value={newSubject} onChange={(e) => setNewSubject(e.target.value)} placeholder="e.g. AI & ML" className={`w-full rounded-xl p-3 text-xs outline-none border ${isDark ? 'bg-zinc-950 border-zinc-800 text-zinc-200' : 'bg-[#FDFBF7] border-[#EBE6DC] text-stone-900'}`} required />
                              </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                              <div>
                                <label className={`block text-xs font-bold mb-1 ${isDark ? 'text-zinc-300' : 'text-stone-700'}`}>Marks Obtained</label>
                                <input type="text" value={newMarks} onChange={(e) => setNewMarks(e.target.value)} placeholder="e.g. 45/50" className={`w-full rounded-xl p-3 text-xs outline-none border ${isDark ? 'bg-zinc-950 border-zinc-800 text-zinc-200' : 'bg-[#FDFBF7] border-[#EBE6DC] text-stone-900'}`} required />
                              </div>
                              <div>
                                <label className={`block text-xs font-bold mb-1 ${isDark ? 'text-zinc-300' : 'text-stone-700'}`}>Grade Awarded</label>
                                <input type="text" value={newGrade} onChange={(e) => setNewGrade(e.target.value)} placeholder="e.g. A+" className={`w-full rounded-xl p-3 text-xs outline-none border ${isDark ? 'bg-zinc-950 border-zinc-800 text-zinc-200' : 'bg-[#FDFBF7] border-[#EBE6DC] text-stone-900'}`} required />
                              </div>
                            </div>
                            <button type="submit" className="w-full bg-stone-900 hover:bg-stone-800 text-[#FDFBF7] py-3 rounded-xl font-bold text-xs shadow-md transition">
                              ✓ Publish Marks Instantly
                            </button>
                          </form>
                        </div>

                        <div className="space-y-3">
                          <h4 className="font-extrabold text-xs uppercase tracking-wider text-amber-800">📋 Active Student Grade Records ({studentMarks.length})</h4>
                          <div className="space-y-2.5">
                            {studentMarks.map(m => (
                              <div key={m.id} className={`p-4 rounded-2xl border flex justify-between items-center ${isDark ? 'bg-zinc-900/40 border-zinc-800' : 'bg-[#F4F1EA]/50 border-[#EBE6DC]'}`}>
                                <div className="space-y-1">
                                  <span className="bg-amber-500/10 text-amber-800 border border-amber-500/20 px-2.5 py-0.5 rounded-lg text-[10px] font-bold">
                                    {m.exam}
                                  </span>
                                  <h5 className="font-bold text-xs mt-1">{m.subject}</h5>
                                  <p className={`text-xs ${isDark ? 'text-zinc-400' : 'text-stone-500'}`}>Marks: <span className="font-bold">{m.marks}</span></p>
                                </div>
                                <div className="flex items-center gap-3">
                                  <span className="bg-emerald-500/10 text-emerald-700 border border-emerald-500/20 px-3 py-1 rounded-xl text-xs font-bold">
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

                {/* Class Timetable Interface Tab */}
                {activeTab === 'timetable' && (
                  <div className={`p-7 rounded-3xl border backdrop-blur-xl space-y-6 ${isDark ? 'bg-zinc-950/70 border-zinc-800' : 'bg-[#FDFBF7]/75 border-[#EBE6DC] shadow-[0_8px_30px_rgb(0,0,0,0.03)]'}`}>
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b pb-4 border-[#EBE6DC] gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-amber-700"></span>
                          <span className="text-[10px] font-extrabold tracking-wider text-amber-800 uppercase">Live Academic Schedule</span>
                        </div>
                        <h3 className="text-lg font-extrabold">📅 University Class Timetable</h3>
                        <p className={`text-xs mt-0.5 ${isDark ? 'text-zinc-400' : 'text-stone-500'}`}>Faculty & Admin updates made here are instantly reflected on the student schedule interface.</p>
                      </div>
                      <div className="flex items-center gap-2">
                        {!isFacultyLoggedIn && !isUniAdminLoggedIn && (
                          <span className="bg-amber-500/10 text-amber-800 border border-amber-500/20 px-3 py-1 rounded-xl text-[11px] font-bold">
                            👁️ Student View Mode (Login as Faculty/Admin to add slots)
                          </span>
                        )}
                      </div>
                    </div>

                    {(isFacultyLoggedIn || isUniAdminLoggedIn) && (
                      <div className={`p-5 rounded-2xl border space-y-3.5 ${isDark ? 'bg-zinc-900/60 border-zinc-800' : 'bg-[#F4F1EA]/50 border-[#EBE6DC]'}`}>
                        <h4 className="font-extrabold text-xs uppercase tracking-wider text-amber-800">➕ Add / Update Class Timetable Slot</h4>
                        <form onSubmit={handleAddTimetableSlot} className="space-y-3">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            <div>
                              <label className={`block text-xs font-bold mb-1 ${isDark ? 'text-zinc-300' : 'text-stone-700'}`}>Day</label>
                              <select value={newTzDay} onChange={(e) => setNewTzDay(e.target.value)} className={`w-full rounded-xl p-2.5 text-xs outline-none border ${isDark ? 'bg-zinc-950 border-zinc-800 text-zinc-200' : 'bg-[#FDFBF7] border-[#EBE6DC] text-stone-900'}`}>
                                {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map(d => (
                                  <option key={d} value={d}>{d}</option>
                                ))}
                              </select>
                            </div>
                            <div>
                              <label className={`block text-xs font-bold mb-1 ${isDark ? 'text-zinc-300' : 'text-stone-700'}`}>Time Slot</label>
                              <input type="text" value={newTzTime} onChange={(e) => setNewTzTime(e.target.value)} placeholder="e.g. 09:00 AM - 10:00 AM" className={`w-full rounded-xl p-2.5 text-xs outline-none border ${isDark ? 'bg-zinc-950 border-zinc-800 text-zinc-200' : 'bg-[#FDFBF7] border-[#EBE6DC] text-stone-900'}`} required />
                            </div>
                            <div>
                              <label className={`block text-xs font-bold mb-1 ${isDark ? 'text-zinc-300' : 'text-stone-700'}`}>Subject Title</label>
                              <input type="text" value={newTzSubj} onChange={(e) => setNewTzSubj(e.target.value)} placeholder="e.g. Operating Systems" className={`w-full rounded-xl p-2.5 text-xs outline-none border ${isDark ? 'bg-zinc-950 border-zinc-800 text-zinc-200' : 'bg-[#FDFBF7] border-[#EBE6DC] text-stone-900'}`} required />
                            </div>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div>
                              <label className={`block text-xs font-bold mb-1 ${isDark ? 'text-zinc-300' : 'text-stone-700'}`}>Faculty In-Charge</label>
                              <input type="text" value={newTzFaculty} onChange={(e) => setNewTzFaculty(e.target.value)} placeholder="e.g. Dr. Sneha Sharma" className={`w-full rounded-xl p-2.5 text-xs outline-none border ${isDark ? 'bg-zinc-950 border-zinc-800 text-zinc-200' : 'bg-[#FDFBF7] border-[#EBE6DC] text-stone-900'}`} required />
                            </div>
                            <div>
                              <label className={`block text-xs font-bold mb-1 ${isDark ? 'text-zinc-300' : 'text-stone-700'}`}>Room / Hall</label>
                              <input type="text" value={newTzRoom} onChange={(e) => setNewTzRoom(e.target.value)} placeholder="e.g. LH-204" className={`w-full rounded-xl p-2.5 text-xs outline-none border ${isDark ? 'bg-zinc-950 border-zinc-800 text-zinc-200' : 'bg-[#FDFBF7] border-[#EBE6DC] text-stone-900'}`} required />
                            </div>
                          </div>
                          <button type="submit" className="w-full bg-stone-900 hover:bg-stone-800 text-[#FDFBF7] py-2.5 rounded-xl font-bold text-xs shadow-md transition">
                            ✓ Publish to Student Timetable
                          </button>
                        </form>
                      </div>
                    )}

                    <div className="space-y-4">
                      {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map((dayName) => {
                        const daySlots = timetable.filter(t => t.day === dayName);
                        if (daySlots.length === 0) return null;
                        return (
                          <div key={dayName} className={`p-5 rounded-2xl border space-y-3 ${isDark ? 'bg-zinc-900/40 border-zinc-800' : 'bg-[#F4F1EA]/50 border-[#EBE6DC]'}`}>
                            <div className="flex items-center justify-between border-b pb-2 border-[#EBE6DC]">
                              <h4 className="font-extrabold text-xs uppercase tracking-wider text-amber-800">{dayName}</h4>
                              <span className="text-[10px] font-bold text-stone-500">{daySlots.length} Classes Scheduled</span>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              {daySlots.map(slot => (
                                <div key={slot.id} className={`p-4 rounded-xl border flex justify-between items-center ${isDark ? 'bg-zinc-950 border-zinc-800/80' : 'bg-[#FDFBF7] border-[#EBE6DC]'}`}>
                                  <div className="space-y-1">
                                    <span className="bg-amber-500/10 text-amber-800 border border-amber-500/20 px-2 py-0.5 rounded text-[10px] font-bold">
                                      ⏰ {slot.time}
                                    </span>
                                    <h5 className="font-bold text-xs mt-1">{slot.subject}</h5>
                                    <p className={`text-[11px] ${isDark ? 'text-zinc-400' : 'text-stone-500'}`}>👨‍🏫 {slot.faculty} | 📍 <span className="font-semibold text-emerald-600">{slot.room}</span></p>
                                  </div>
                                  {(isFacultyLoggedIn || isUniAdminLoggedIn) && (
                                    <button onClick={() => handleDeleteTimetableSlot(slot.id)} className="bg-red-500/10 hover:bg-red-500/20 text-red-400 px-3 py-1.5 rounded-xl text-[11px] font-bold transition">
                                      Delete
                                    </button>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                  </div>
                )}

                {/* Document Verification Tab */}
                {activeTab === 'documents' && (!isFacultyLoggedIn) && (
                  <div className={`p-7 rounded-3xl border backdrop-blur-xl space-y-5 ${isDark ? 'bg-zinc-950/70 border-zinc-800' : 'bg-[#FDFBF7]/75 border-[#EBE6DC] shadow-[0_8px_30px_rgb(0,0,0,0.03)]'}`}>
                    <h3 className="text-base font-extrabold">Student Verification Document Portal</h3>
                    <p className={`text-xs ${isDark ? 'text-zinc-400' : 'text-stone-500'}`}>Upload your identity and academic certificates for {selectedUni.name}.</p>
                    
                    <form onSubmit={handleDocumentSubmit} className="space-y-3.5">
                      <div>
                        <label className={`block text-xs font-bold mb-1.5 ${isDark ? 'text-zinc-300' : 'text-stone-700'}`}>Identity Card Document / PDF</label>
                        <input type="file" onChange={(e) => setAadhaarFile(e.target.files[0]?.name || '')} className={`w-full rounded-2xl p-2.5 text-xs file:mr-4 file:py-1.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-stone-900 file:text-[#FDFBF7] hover:file:bg-stone-800 cursor-pointer border ${isDark ? 'bg-zinc-900 border-zinc-800 text-zinc-300' : 'bg-[#F4F1EA]/60 border-[#EBE6DC] text-stone-700'}`} required />
                      </div>
                      <div>
                        <label className={`block text-xs font-bold mb-1.5 ${isDark ? 'text-zinc-300' : 'text-stone-700'}`}>PAN Card Document / PDF</label>
                        <input type="file" onChange={(e) => setPanFile(e.target.files[0]?.name || '')} className={`w-full rounded-2xl p-2.5 text-xs file:mr-4 file:py-1.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-stone-900 file:text-[#FDFBF7] hover:file:bg-stone-800 cursor-pointer border ${isDark ? 'bg-zinc-900 border-zinc-800 text-zinc-300' : 'bg-[#F4F1EA]/60 border-[#EBE6DC] text-stone-700'}`} required />
                      </div>
                      <div>
                        <label className={`block text-xs font-bold mb-1.5 ${isDark ? 'text-zinc-300' : 'text-stone-700'}`}>10th Marksheet (PDF/Image)</label>
                        <input type="file" onChange={(e) => setTenthFile(e.target.files[0]?.name || '')} className={`w-full rounded-2xl p-2.5 text-xs file:mr-4 file:py-1.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-stone-900 file:text-[#FDFBF7] hover:file:bg-stone-800 cursor-pointer border ${isDark ? 'bg-zinc-900 border-zinc-800 text-zinc-300' : 'bg-[#F4F1EA]/60 border-[#EBE6DC] text-stone-700'}`} required />
                      </div>
                      <div>
                        <label className={`block text-xs font-bold mb-1.5 ${isDark ? 'text-zinc-300' : 'text-stone-700'}`}>12th Marksheet (PDF/Image)</label>
                        <input type="file" onChange={(e) => setTwelfthFile(e.target.files[0]?.name || '')} className={`w-full rounded-2xl p-2.5 text-xs file:mr-4 file:py-1.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-stone-900 file:text-[#FDFBF7] hover:file:bg-stone-800 cursor-pointer border ${isDark ? 'bg-zinc-900 border-zinc-800 text-zinc-300' : 'bg-[#F4F1EA]/60 border-[#EBE6DC] text-stone-700'}`} required />
                      </div>
                      <div>
                        <label className={`block text-xs font-bold mb-1.5 ${isDark ? 'text-zinc-300' : 'text-stone-700'}`}>Character Certificate (PDF/Image)</label>
                        <input type="file" onChange={(e) => setCharCertFile(e.target.files[0]?.name || '')} className={`w-full rounded-2xl p-2.5 text-xs file:mr-4 file:py-1.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-stone-900 file:text-[#FDFBF7] hover:file:bg-stone-800 cursor-pointer border ${isDark ? 'bg-zinc-900 border-zinc-800 text-zinc-300' : 'bg-[#F4F1EA]/60 border-[#EBE6DC] text-stone-700'}`} required />
                      </div>
                      <button type="submit" className="w-full bg-stone-900 hover:bg-stone-800 text-[#FDFBF7] py-3.5 rounded-2xl font-bold text-xs shadow-md transition">
                        Submit All Documents to University Admin
                      </button>
                      {docSubmitted && <p className="text-xs text-emerald-600 text-center font-bold">✓ Documents submitted successfully for review!</p>}
                    </form>
                  </div>
                )}

                {/* University Admin Panel - Allows generating Faculty IDs & passwords */}
                {activeTab === 'uni-admin' && (!isFacultyLoggedIn) && (
                  <div className={`p-7 rounded-3xl border backdrop-blur-xl space-y-6 ${isDark ? 'bg-zinc-950/70 border-zinc-800' : 'bg-[#FDFBF7]/75 border-[#EBE6DC] shadow-[0_8px_30px_rgb(0,0,0,0.03)]'}`}>
                    <div className="flex justify-between items-center border-b pb-4 border-[#EBE6DC]">
                      <div>
                        <h3 className="text-base font-extrabold">University Admin Panel ({selectedUni.name})</h3>
                        <p className={`text-xs mt-0.5 ${isDark ? 'text-zinc-400' : 'text-stone-500'}`}>Manage faculty accounts (IDs & Passwords), broadcast news, and review submissions.</p>
                      </div>
                      {isUniAdminLoggedIn && (
                        <button onClick={() => setIsUniAdminLoggedIn(false)} className="bg-red-500/10 text-red-400 px-3.5 py-1.5 rounded-xl text-xs font-bold border border-red-500/20">Logout</button>
                      )}
                    </div>

                    {!isUniAdminLoggedIn ? (
                      <div className={`max-w-md mx-auto p-6 rounded-2xl border space-y-3.5 my-2 ${isDark ? 'bg-zinc-900/60 border-zinc-800' : 'bg-[#F4F1EA]/60 border-[#EBE6DC]'}`}>
                        <div className="text-center">
                          <h4 className="font-extrabold text-xs">University Admin Login Required</h4>
                          <p className="text-[11px] text-amber-800 font-mono mt-1">uniorg@univote.com / Uni@1234</p>
                        </div>
                        <form onSubmit={handleUniAdminLogin} className="space-y-3">
                          <input type="email" value={uniAdminUser} onChange={(e) => setUniAdminUser(e.target.value)} placeholder="uniorg@univote.com" className={`w-full rounded-xl p-3 text-xs border ${isDark ? 'bg-zinc-950 border-zinc-800 text-zinc-200' : 'bg-[#FDFBF7] border-[#EBE6DC] text-stone-900'}`} required />
                          <input type="password" value={uniAdminPass} onChange={(e) => setUniAdminPass(e.target.value)} placeholder="••••••••" className={`w-full rounded-xl p-3 text-xs border ${isDark ? 'bg-zinc-950 border-zinc-800 text-zinc-200' : 'bg-[#FDFBF7] border-[#EBE6DC] text-stone-900'}`} required />
                          <button type="submit" className="w-full bg-stone-900 hover:bg-stone-800 text-[#FDFBF7] py-3 rounded-xl font-bold text-xs shadow-md transition">Login as Uni Admin</button>
                        </form>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        
                        {/* Faculty Credentials Generator Section */}
                        <div className={`p-5 rounded-2xl border space-y-4 ${isDark ? 'bg-zinc-900/40 border-zinc-800' : 'bg-[#F4F1EA]/50 border-[#EBE6DC]'}`}>
                          <h4 className="font-extrabold text-xs uppercase tracking-wider text-amber-800">👨‍🏫 Provide Faculty ID and Password</h4>
                          
                          <form onSubmit={handleAddFaculty} className={`p-4 rounded-xl border space-y-3.5 ${isDark ? 'bg-zinc-950 border-zinc-800/80' : 'bg-[#FDFBF7] border-[#EBE6DC]'}`}>
                            <h5 className="font-bold text-xs">Create Faculty Credential</h5>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              <div>
                                <label className={`block text-xs font-bold mb-1 ${isDark ? 'text-zinc-300' : 'text-stone-700'}`}>Faculty ID</label>
                                <input type="text" value={newFacultyId} onChange={(e) => setNewFacultyId(e.target.value)} placeholder="e.g. FAC104" className={`w-full rounded-xl p-2.5 text-xs border ${isDark ? 'bg-zinc-900 border-zinc-800 text-zinc-200' : 'bg-[#F4F1EA]/60 border-[#EBE6DC] text-stone-900'}`} required />
                              </div>
                              <div>
                                <label className={`block text-xs font-bold mb-1 ${isDark ? 'text-zinc-300' : 'text-stone-700'}`}>Faculty Full Name</label>
                                <input type="text" value={newFacultyName} onChange={(e) => setNewFacultyName(e.target.value)} placeholder="e.g. Dr. Alok Kumar" className={`w-full rounded-xl p-2.5 text-xs border ${isDark ? 'bg-zinc-900 border-zinc-800 text-zinc-200' : 'bg-[#F4F1EA]/60 border-[#EBE6DC] text-stone-900'}`} required />
                              </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              <div>
                                <label className={`block text-xs font-bold mb-1 ${isDark ? 'text-zinc-300' : 'text-stone-700'}`}>Department</label>
                                <input type="text" value={newFacultyDept} onChange={(e) => setNewFacultyDept(e.target.value)} placeholder="e.g. Civil Engineering" className={`w-full rounded-xl p-2.5 text-xs border ${isDark ? 'bg-zinc-900 border-zinc-800 text-zinc-200' : 'bg-[#F4F1EA]/60 border-[#EBE6DC] text-stone-900'}`} required />
                              </div>
                              <div>
                                <label className={`block text-xs font-bold mb-1 ${isDark ? 'text-zinc-300' : 'text-stone-700'}`}>Monthly Salary</label>
                                <input type="text" value={newFacultySalary} onChange={(e) => setNewFacultySalary(e.target.value)} placeholder="e.g. ₹90,000" className={`w-full rounded-xl p-2.5 text-xs border ${isDark ? 'bg-zinc-900 border-zinc-800 text-zinc-200' : 'bg-[#F4F1EA]/60 border-[#EBE6DC] text-stone-900'}`} required />
                              </div>
                            </div>
                            <p className="text-[11px] text-amber-700">Default password for generated faculty account is <b>Faculty@1234</b>.</p>
                            <button type="submit" className="w-full bg-stone-900 hover:bg-stone-800 text-[#FDFBF7] py-2.5 rounded-xl font-bold text-xs shadow-md transition">
                              Generate & Register Faculty Credentials
                            </button>
                          </form>

                          <div className="space-y-2">
                            <h5 className="font-bold text-xs">Active Faculty Roster & Credentials ({facultySalaries.length})</h5>
                            {facultySalaries.map(f => (
                              <div key={f.id} className={`p-3 rounded-xl border flex justify-between items-center ${isDark ? 'bg-zinc-950 border-zinc-800' : 'bg-[#FDFBF7] border-[#EBE6DC]'}`}>
                                <div>
                                  <span className="text-[10px] font-bold text-amber-800">ID: {f.facultyId} • {f.dept}</span>
                                  <h6 className="font-bold text-xs">{f.name} ({f.salary})</h6>
                                </div>
                                <button onClick={() => handleDeleteFaculty(f.id)} className="bg-red-500/10 text-red-400 px-3 py-1 rounded-lg text-xs font-bold">Remove</button>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Broadcast University News Section */}
                        <div className={`p-5 rounded-2xl border space-y-4 ${isDark ? 'bg-zinc-900/40 border-zinc-800' : 'bg-[#F4F1EA]/50 border-[#EBE6DC]'}`}>
                          <h4 className="font-extrabold text-xs uppercase tracking-wider text-amber-800">📰 Broadcast University News & Announcements</h4>
                          
                          <form onSubmit={handleAddNews} className={`p-4 rounded-xl border space-y-3.5 ${isDark ? 'bg-zinc-950 border-zinc-800/80' : 'bg-[#FDFBF7] border-[#EBE6DC]'}`}>
                            <h5 className="font-bold text-xs">Publish New Announcement</h5>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              <div>
                                <label className={`block text-xs font-bold mb-1 ${isDark ? 'text-zinc-300' : 'text-stone-700'}`}>News Title</label>
                                <input type="text" value={newNewsTitle} onChange={(e) => setNewNewsTitle(e.target.value)} placeholder="e.g. Semester Exam Schedule Out" className={`w-full rounded-xl p-2.5 text-xs border ${isDark ? 'bg-zinc-900 border-zinc-800 text-zinc-200' : 'bg-[#F4F1EA]/60 border-[#EBE6DC] text-stone-900'}`} required />
                              </div>
                              <div>
                                <label className={`block text-xs font-bold mb-1 ${isDark ? 'text-zinc-300' : 'text-stone-700'}`}>Category</label>
                                <select value={newNewsCategory} onChange={(e) => setNewNewsCategory(e.target.value)} className={`w-full rounded-xl p-2.5 text-xs border ${isDark ? 'bg-zinc-900 border-zinc-800 text-zinc-200' : 'bg-[#F4F1EA]/60 border-[#EBE6DC] text-stone-900'}`}>
                                  <option value="Announcement">Announcement</option>
                                  <option value="Academic">Academic</option>
                                  <option value="Event">Event</option>
                                  <option value="Facility">Facility</option>
                                </select>
                              </div>
                            </div>
                            <div>
                              <label className={`block text-xs font-bold mb-1 ${isDark ? 'text-zinc-300' : 'text-stone-700'}`}>Announcement Content</label>
                              <textarea value={newNewsContent} onChange={(e) => setNewNewsContent(e.target.value)} placeholder="Enter full details..." rows="3" className={`w-full rounded-xl p-2.5 text-xs border ${isDark ? 'bg-zinc-900 border-zinc-800 text-zinc-200' : 'bg-[#F4F1EA]/60 border-[#EBE6DC] text-stone-900'}`} required />
                            </div>
                            <button type="submit" className="w-full bg-stone-900 hover:bg-stone-800 text-[#FDFBF7] py-2.5 rounded-xl font-bold text-xs shadow-md transition">
                              Broadcast News to Students
                            </button>
                          </form>

                          <div className="space-y-2">
                            <h5 className="font-bold text-xs">Active Broadcasts ({newsList.length})</h5>
                            {newsList.map(n => (
                              <div key={n.id} className={`p-3 rounded-xl border flex justify-between items-center ${isDark ? 'bg-zinc-950 border-zinc-800' : 'bg-[#FDFBF7] border-[#EBE6DC]'}`}>
                                <div>
                                  <span className="text-[10px] font-bold text-amber-800">{n.category} • {n.date}</span>
                                  <h6 className="font-bold text-xs">{n.title}</h6>
                                </div>
                                <button onClick={() => handleDeleteNews(n.id)} className="bg-red-500/10 text-red-400 px-3 py-1 rounded-lg text-xs font-bold">Delete</button>
                              </div>
                            ))}
                          </div>
                        </div>

                      </div>
                    )}
                  </div>
                )}

              </div>
            </div>
          </div>
        )}

      </main>

      {/* Secure Payment Gateway Modal Overlay */}
      {isPaymentModalOpen && activePaymentFee && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fade-in">
          <div className={`w-full max-w-lg p-7 rounded-3xl border shadow-2xl space-y-6 ${isDark ? 'bg-zinc-950 border-zinc-800 text-zinc-100' : 'bg-[#FDFBF7] border-[#EBE6DC] text-stone-900'}`}>
            
            <div className="flex justify-between items-center border-b pb-4 border-[#EBE6DC]">
              <div>
                <span className="text-[10px] font-extrabold tracking-wider text-indigo-400 uppercase">Secure Checkout</span>
                <h3 className="text-lg font-extrabold">Fee Payment Gateway</h3>
              </div>
              <button onClick={() => setIsPaymentModalOpen(false)} className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${isDark ? 'bg-zinc-900 hover:bg-zinc-800 text-zinc-300' : 'bg-[#F4F1EA] hover:bg-stone-200 text-stone-700'}`}>✕</button>
            </div>

            <div className={`p-4 rounded-2xl border space-y-1 ${isDark ? 'bg-zinc-900/60 border-zinc-800' : 'bg-[#F4F1EA]/60 border-[#EBE6DC]'}`}>
              <div className="flex justify-between items-center text-xs">
                <span className={isDark ? 'text-zinc-400' : 'text-stone-500'}>Fee Particulars:</span>
                <span className="font-bold">{activePaymentFee.semester}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className={isDark ? 'text-zinc-400' : 'text-stone-500'}>Due Date:</span>
                <span className="font-bold">{activePaymentFee.dueDate}</span>
              </div>
              <div className="flex justify-between items-center text-sm pt-2 border-t border-zinc-800/40">
                <span className="font-extrabold">Total Payable Amount:</span>
                <span className="font-extrabold text-amber-700 text-base">{activePaymentFee.amount}</span>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="space-y-3">
              <label className={`block text-xs font-bold ${isDark ? 'text-zinc-300' : 'text-stone-700'}`}>Select Payment Method</label>
              <div className="grid grid-cols-3 gap-2.5">
                <button type="button" onClick={() => setPaymentMethod('upi')} className={`py-2.5 px-3 rounded-xl text-xs font-bold border transition ${paymentMethod === 'upi' ? 'bg-indigo-600 border-indigo-500 text-white shadow-md' : isDark ? 'bg-zinc-900 border-zinc-800 text-zinc-400' : 'bg-[#F4F1EA] border-[#EBE6DC] text-stone-700'}`}>
                  📱 UPI / QR
                </button>
                <button type="button" onClick={() => setPaymentMethod('card')} className={`py-2.5 px-3 rounded-xl text-xs font-bold border transition ${paymentMethod === 'card' ? 'bg-indigo-600 border-indigo-500 text-white shadow-md' : isDark ? 'bg-zinc-900 border-zinc-800 text-zinc-400' : 'bg-[#F4F1EA] border-[#EBE6DC] text-stone-700'}`}>
                  💳 Credit / Debit
                </button>
                <button type="button" onClick={() => setPaymentMethod('netbanking')} className={`py-2.5 px-3 rounded-xl text-xs font-bold border transition ${paymentMethod === 'netbanking' ? 'bg-indigo-600 border-indigo-500 text-white shadow-md' : isDark ? 'bg-zinc-900 border-zinc-800 text-zinc-400' : 'bg-[#F4F1EA] border-[#EBE6DC] text-stone-700'}`}>
                  🏦 Net Banking
                </button>
              </div>
            </div>

            {/* Payment Form Details */}
            <form onSubmit={handleProcessPayment} className="space-y-4">
              {paymentMethod === 'upi' && (
                <div className="space-y-1.5">
                  <label className={`block text-xs font-bold ${isDark ? 'text-zinc-300' : 'text-stone-700'}`}>Enter UPI ID / VPA</label>
                  <input type="text" value={upiId} onChange={(e) => setUpiId(e.target.value)} placeholder="username@okhdfcbank or 9876543210@paytm" className={`w-full rounded-xl p-3 text-xs outline-none border ${isDark ? 'bg-zinc-900 border-zinc-800 text-zinc-100' : 'bg-[#F4F1EA] border-[#EBE6DC] text-stone-900'}`} required />
                  <p className={`text-[10px] ${isDark ? 'text-zinc-400' : 'text-stone-500'}`}>Supported: Google Pay, PhonePe, Paytm, BHIM UPI</p>
                </div>
              )}

              {paymentMethod === 'card' && (
                <div className="space-y-3">
                  <div>
                    <label className={`block text-xs font-bold mb-1 ${isDark ? 'text-zinc-300' : 'text-stone-700'}`}>Card Number</label>
                    <input type="text" value={cardNumber} onChange={(e) => setCardNumber(e.target.value)} placeholder="4532 •••• •••• 8890" maxLength="19" className={`w-full rounded-xl p-3 text-xs outline-none border ${isDark ? 'bg-zinc-900 border-zinc-800 text-zinc-100' : 'bg-[#F4F1EA] border-[#EBE6DC] text-stone-900'}`} required />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className={`block text-xs font-bold mb-1 ${isDark ? 'text-zinc-300' : 'text-stone-700'}`}>Expiry (MM/YY)</label>
                      <input type="text" value={cardExpiry} onChange={(e) => setCardExpiry(e.target.value)} placeholder="12/28" maxLength="5" className={`w-full rounded-xl p-3 text-xs outline-none border ${isDark ? 'bg-zinc-900 border-zinc-800 text-zinc-100' : 'bg-[#F4F1EA] border-[#EBE6DC] text-stone-900'}`} required />
                    </div>
                    <div>
                      <label className={`block text-xs font-bold mb-1 ${isDark ? 'text-zinc-300' : 'text-stone-700'}`}>CVV</label>
                      <input type="password" value={cardCvv} onChange={(e) => setCardCvv(e.target.value)} placeholder="•••" maxLength="4" className={`w-full rounded-xl p-3 text-xs outline-none border ${isDark ? 'bg-zinc-900 border-zinc-800 text-zinc-100' : 'bg-[#F4F1EA] border-[#EBE6DC] text-stone-900'}`} required />
                    </div>
                  </div>
                </div>
              )}

              {paymentMethod === 'netbanking' && (
                <div className="space-y-1.5">
                  <label className={`block text-xs font-bold ${isDark ? 'text-zinc-300' : 'text-stone-700'}`}>Select Preferred Bank</label>
                  <select value={selectedBank} onChange={(e) => setSelectedBank(e.target.value)} className={`w-full rounded-xl p-3 text-xs outline-none border ${isDark ? 'bg-zinc-900 border-zinc-800 text-zinc-100' : 'bg-[#F4F1EA] border-[#EBE6DC] text-stone-900'}`}>
                    <option value="HDFC Bank">HDFC Bank</option>
                    <option value="State Bank of India">State Bank of India (SBI)</option>
                    <option value="ICICI Bank">ICICI Bank</option>
                    <option value="Axis Bank">Axis Bank</option>
                    <option value="Punjab National Bank">Punjab National Bank</option>
                  </select>
                </div>
              )}

              <button type="submit" disabled={isProcessingPayment} className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-3.5 rounded-xl font-bold text-xs shadow-lg transition-all flex items-center justify-center gap-2">
                {isProcessingPayment ? (
                  <>
                    <span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin"></span>
                    Processing Secure Payment...
                  </>
                ) : (
                  `Pay Securely ${activePaymentFee.amount}`
                )}
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}