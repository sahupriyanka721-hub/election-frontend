import React, { useState, useEffect } from 'react';
import { auth, googleProvider } from './firebase';
import { signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';

export default function App() {
  const [user, setUser] = useState(null);
  const [currentView, setCurrentView] = useState('home'); // 'home', 'universities', 'admin'
  const [selectedUni, setSelectedUni] = useState(null);
  const [activeTab, setActiveTab] = useState('portal'); // 'portal', 'voting', 'student-portal', 'manager', 'documents'

  // Theme State ('dark' or 'light')
  const [theme, setTheme] = useState('dark');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Form states for Event Manager Portal
  const [candidateName, setCandidateName] = useState('');
  const [candidateParty, setCandidateParty] = useState('');

  // Form states for Student Document Verification Upload
  const [aadhaar, setAadhaar] = useState('');
  const [pan, setPan] = useState('');
  const [tenthFile, setTenthFile] = useState('');
  const [twelfthFile, setTwelfthFile] = useState('');
  const [charCert, setCharCert] = useState('');
  const [docSubmitted, setDocSubmitted] = useState(false);

  // Student Marks Management States
  const [studentMarks, setStudentMarks] = useState([
    { id: 1, subject: 'Data Structures & Algorithms', marks: '88/100', grade: 'A+' },
    { id: 2, subject: 'Database Management Systems', marks: '82/100', grade: 'A' },
    { id: 3, subject: 'Software Engineering', marks: '90/100', grade: 'O' }
  ]);

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
    if (!user) {
      alert("Please sign in with Google to register candidates!");
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
    alert("Candidate registered successfully!");
  };

  const handleDocumentSubmit = (e) => {
    e.preventDefault();
    if (!user) {
      alert("Please sign in with Google to upload verification documents!");
      return;
    }
    setDocSubmitted(true);
    alert("Verification documents submitted successfully!");
  };

  const isDark = theme === 'dark';

  return (
    <div className={`min-h-screen font-sans relative transition-colors duration-300 ${isDark ? 'bg-[#030508] text-gray-100' : 'bg-gray-50 text-gray-900'}`}>
      
      {/* Navbar */}
      <nav className={`p-4 border-b sticky top-0 z-50 ${isDark ? 'border-gray-800 bg-[#030508]/90' : 'border-gray-200 bg-white/90'}`}>
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="cursor-pointer" onClick={() => { setCurrentView('home'); setSelectedUni(null); }}>
            <h1 className="text-lg font-bold text-white">UniVote Pro</h1>
            <p className="text-[9px] text-gray-400">National Campus Election Portal</p>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={toggleTheme} className="px-3 py-1 rounded text-xs border bg-gray-800 text-yellow-400">
              {isDark ? '☀️ Light' : '🌙 Dark'}
            </button>
            {user ? (
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-300">Hi, {user.displayName}</span>
                <button onClick={handleLogout} className="bg-red-600 px-3 py-1 rounded text-xs text-white">Logout</button>
              </div>
            ) : (
              <button onClick={handleGoogleLogin} className="bg-blue-600 px-3 py-1 rounded text-xs text-white font-medium">Sign in with Google</button>
            )}
          </div>
        </div>
      </nav>

      {/* Main Container */}
      <main className="p-6 max-w-7xl mx-auto">
        {currentView === 'home' && !selectedUni && (
          <div className="text-center py-16 space-y-6">
            <h2 className="text-4xl font-bold">Select Your University Portal</h2>
            <p className="text-gray-400 max-w-xl mx-auto">Choose your institution to cast votes, check student records, and upload verification documents.</p>
            <button onClick={() => setCurrentView('universities')} className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold shadow-lg">
              Explore Universities →
            </button>
          </div>
        )}

        {currentView === 'universities' && !selectedUni && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Approved Universities</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {universities.map(uni => (
                <div key={uni.id} className="bg-gray-900 border border-gray-800 p-5 rounded-2xl flex flex-col justify-between">
                  <div>
                    <img src={uni.image} alt={uni.name} className="w-full h-36 object-cover rounded-xl mb-4" />
                    <h3 className="font-bold text-lg text-white">{uni.name}</h3>
                    <p className="text-xs text-blue-400 mb-2">📍 {uni.location}</p>
                    <p className="text-xs text-gray-400 mb-4">{uni.desc}</p>
                  </div>
                  <button onClick={() => { setSelectedUni(uni); setActiveTab('voting'); }} className="w-full bg-blue-600 text-white py-2 rounded-xl text-sm font-medium">
                    Open Portal →
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {selectedUni && (
          <div>
            <button onClick={() => setSelectedUni(null)} className="text-sm text-blue-400 mb-4 block">← Back to Universities</button>
            <h2 className="text-3xl font-bold text-white mb-2">{selectedUni.name}</h2>
            
            {/* Dashboard Tabs including Document Verification */}
            <div className="flex flex-wrap gap-2 mb-6 border-b border-gray-800 pb-3">
              <button onClick={() => setActiveTab('voting')} className={`px-4 py-2 rounded-lg text-xs font-semibold ${activeTab === 'voting' ? 'bg-blue-600 text-white' : 'bg-gray-900 text-gray-400'}`}>
                Voting Booth
              </button>
              <button onClick={() => setActiveTab('documents')} className={`px-4 py-2 rounded-lg text-xs font-semibold ${activeTab === 'documents' ? 'bg-blue-600 text-white' : 'bg-gray-900 text-gray-400'}`}>
                📄 Document Verification & Upload
              </button>
              <button onClick={() => setActiveTab('manager')} className={`px-4 py-2 rounded-lg text-xs font-semibold ${activeTab === 'manager' ? 'bg-blue-600 text-white' : 'bg-gray-900 text-gray-400'}`}>
                Candidate Manager
              </button>
            </div>

            {/* Voting Tab */}
            {activeTab === 'voting' && (
              <div className="space-y-4">
                <h3 className="text-xl font-bold">Active Candidates</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {selectedUni.candidates.map(cand => (
                    <div key={cand.id} className="bg-gray-900 border border-gray-800 p-4 rounded-xl flex justify-between items-center">
                      <div>
                        <h4 className="font-bold text-white">{cand.name}</h4>
                        <p className="text-xs text-blue-400">Party: {cand.party}</p>
                        <p className="text-xs text-gray-400 mt-1">Votes: {cand.votes}</p>
                      </div>
                      <button onClick={() => handleVote(selectedUni.id, cand.id)} className="bg-emerald-600 hover:bg-emerald-500 px-4 py-2 rounded-lg text-xs font-bold text-white">
                        Vote
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Document Verification Tab */}
            {activeTab === 'documents' && (
              <div className="bg-gray-900 border border-gray-800 p-6 rounded-2xl max-w-2xl">
                <h3 className="text-xl font-bold mb-2">Student Document Verification</h3>
                <p className="text-xs text-gray-400 mb-6">Upload your academic and identity certificates to verify your eligibility for the student union polls.</p>
                
                <form onSubmit={handleDocumentSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-1">Aadhaar Number / ID Proof</label>
                    <input type="text" value={aadhaar} onChange={(e) => setAadhaar(e.target.value)} placeholder="Enter 12-digit Aadhaar number" className="w-full bg-gray-950 border border-gray-800 rounded-lg p-2.5 text-sm text-white" required />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-1">PAN Card Number</label>
                    <input type="text" value={pan} onChange={(e) => setPan(e.target.value)} placeholder="Enter PAN number" className="w-full bg-gray-950 border border-gray-800 rounded-lg p-2.5 text-sm text-white" required />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-1">10th Marksheet (PDF/Image Link)</label>
                    <input type="text" value={tenthFile} onChange={(e) => setTenthFile(e.target.value)} placeholder="Paste document drive link or filename" className="w-full bg-gray-950 border border-gray-800 rounded-lg p-2.5 text-sm text-white" required />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-1">12th Marksheet (PDF/Image Link)</label>
                    <input type="text" value={twelfthFile} onChange={(e) => setTwelfthFile(e.target.value)} placeholder="Paste document drive link or filename" className="w-full bg-gray-950 border border-gray-800 rounded-lg p-2.5 text-sm text-white" required />
                  </div>
                  <button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 py-3 rounded-xl font-bold text-sm text-white transition">
                    Submit Documents for Verification
                  </button>
                  {docSubmitted && <p className="text-xs text-emerald-400 text-center font-medium mt-2">✓ Documents submitted successfully and pending approval.</p>}
                </form>
              </div>
            )}

            {/* Candidate Manager Tab */}
            {activeTab === 'manager' && (
              <div className="bg-gray-900 border border-gray-800 p-6 rounded-2xl max-w-xl">
                <h3 className="text-xl font-bold mb-4">Register New Candidate</h3>
                <form onSubmit={handleAddCandidate} className="space-y-4">
                  <input type="text" value={candidateName} onChange={(e) => setCandidateName(e.target.value)} placeholder="Candidate Full Name" className="w-full bg-gray-950 border border-gray-800 rounded-lg p-2.5 text-sm text-white" required />
                  <input type="text" value={candidateParty} onChange={(e) => setCandidateParty(e.target.value)} placeholder="Party / Alliance Name" className="w-full bg-gray-950 border border-gray-800 rounded-lg p-2.5 text-sm text-white" required />
                  <button type="submit" className="w-full bg-blue-600 py-2.5 rounded-xl font-bold text-sm text-white">Add Candidate</button>
                </form>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}