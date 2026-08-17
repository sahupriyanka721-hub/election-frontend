import React, { useState } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
const db = getFirestore(app);

export default function App() {
  const [selectedUniversity, setSelectedUniversity] = useState(null);
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('vote');
  
  // Event Manager Form State
  const [orgName, setOrgName] = useState('');
  const [eventName, setEventName] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [eventsList, setEventsList] = useState([
    { id: 1, org: 'ABVP Council', name: 'Annual Youth Summit', date: '2026-08-25' },
    { id: 2, org: 'NSUI wing', name: 'Campus Debate Competition', date: '2026-08-28' }
  ]);

  const universities = [
    { 
      id: 'graphic-era', 
      name: 'Graphic Era University', 
      location: 'Dehradun, Uttarakhand', 
      desc: 'Graphic Era (Deemed to be University) student union election portal.',
      eligible: '18,500+'
    },
    { 
      id: 'amity', 
      name: 'Amity University', 
      location: 'Noida, Uttar Pradesh', 
      desc: 'Annual Student Council Election for Amity University main campus.',
      eligible: '25,000+'
    },
    { 
      id: 'lpu', 
      name: 'Lovely Professional University', 
      location: 'Phagwara, Punjab', 
      desc: 'Official Campus Senate Election Portal.',
      eligible: '35,000+'
    },
    { 
      id: 'chandigarh', 
      name: 'Chandigarh University', 
      location: 'Mohali, Punjab', 
      desc: 'Central Student Representative Elections.',
      eligible: '30,000+'
    }
  ];

  const [candidates, setCandidates] = useState([
    { id: 'abvp', party: 'ABVP', candidate: 'Aarav Sharma', votes: 120 },
    { id: 'nsui', party: 'NSUI', candidate: 'Priya Verma', votes: 95 },
    { id: 'aisa', party: 'AISA', candidate: 'Rohan Gupta', votes: 45 }
  ]);

  const handleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      setUser(result.user);
    } catch (error) {
      alert("Login failed: " + error.message);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    setUser(null);
  };

  const handleVote = (candidateId) => {
    if (!user) {
      alert("Please login with Google first to cast your vote!");
      handleLogin();
      return;
    }
    setCandidates(candidates.map(c => c.id === candidateId ? { ...c, votes: c.votes + 1 } : c));
    alert("Vote cast successfully!");
  };

  const handleAddEvent = (e) => {
    e.preventDefault();
    if (!orgName || !eventName || !eventDate) {
      alert("Please fill all event details!");
      return;
    }
    const newEvt = { id: Date.now(), org: orgName, name: eventName, date: eventDate };
    setEventsList([newEvt, ...eventsList]);
    setOrgName('');
    setEventName('');
    setEventDate('');
    alert("Event registered successfully by organization!");
  };

  return (
    <div className="min-h-screen bg-[#0b0f17] text-gray-100 font-sans">
      {/* Navbar */}
      <nav className="flex justify-between items-center px-8 py-4 bg-[#0b0f17] border-b border-gray-800">
        <div>
          <h1 className="text-xl font-bold tracking-wide text-white">UniVote Pro</h1>
          <p className="text-xs text-gray-400">National Campus Election & Event Management Portal</p>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-xs text-emerald-400 flex items-center gap-1.5 bg-emerald-950/50 px-2.5 py-1 rounded-full border border-emerald-800/50">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span> Live Connection Active
          </span>
          {user ? (
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-300">Welcome, {user.displayName}</span>
              <button onClick={handleLogout} className="bg-red-600 hover:bg-red-700 px-3 py-1.5 rounded text-xs font-medium transition">Logout</button>
            </div>
          ) : (
            <button onClick={handleLogin} className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-sm font-medium transition">Sign in with Google</button>
          )}
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="p-8 max-w-7xl mx-auto">
        {!selectedUniversity ? (
          <div className="text-center py-6">
            <h2 className="text-4xl font-bold tracking-tight mb-2 text-white">Select Your University</h2>
            <p className="text-gray-400 text-sm mb-10">Click on your institution to view candidates, manage events, access voter authentication, and cast votes.</p>
            
            {/* University Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
              {universities.map((uni) => (
                <div 
                  key={uni.id} 
                  onClick={() => setSelectedUniversity(uni)}
                  className="bg-[#111827] rounded-2xl p-6 border border-gray-800 hover:border-blue-500 cursor-pointer transition-all duration-300 hover:-translate-y-1 shadow-xl flex flex-col justify-between relative group"
                >
                  <div>
                    <div className="flex justify-between items-start mb-4">
                      <div className="w-10 h-10 rounded-xl bg-gray-800 flex items-center justify-center text-blue-400 border border-gray-700">
                        🏛️
                      </div>
                      <span className="text-[10px] bg-emerald-950 text-emerald-400 px-2.5 py-1 rounded-full font-medium border border-emerald-800/40">
                        Elections & Events Active
                      </span>
                    </div>
                    <h3 className="font-bold text-lg text-white mb-1">{uni.name}</h3>
                    <p className="text-xs text-gray-400 mb-3 flex items-center gap-1">📍 {uni.location}</p>
                    <p className="text-xs text-gray-300 leading-relaxed mb-6">{uni.desc}</p>
                  </div>
                  
                  <div className="pt-4 border-t border-gray-800 flex justify-between items-center text-xs">
                    <span className="text-gray-400">Eligible: <strong className="text-white">{uni.eligible}</strong></span>
                    <span className="text-blue-400 font-semibold group-hover:translate-x-1 transition flex items-center gap-1">
                      Open Portal →
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* Full Screen University Detail Portal */
          <div>
            <button 
              onClick={() => setSelectedUniversity(null)}
              className="mb-6 bg-gray-800 hover:bg-gray-700 text-gray-300 px-4 py-2 rounded-lg text-sm font-medium transition border border-gray-700"
            >
              ← Back to Universities
            </button>

            <div className="bg-[#111827] rounded-2xl p-8 border border-gray-800 mb-8 shadow-xl">
              <h2 className="text-3xl font-bold text-white mb-2">{selectedUniversity.name}</h2>
              <p className="text-gray-400 text-sm">Student Union Election 2026 - Cast Your Vote</p>
              
              {/* Portal Navigation Tabs */}
              <div className="flex gap-3 mt-6 border-b border-gray-800 pb-4">
                <button 
                  onClick={() => setActiveTab('vote')}
                  className={`px-4 py-2 rounded-lg font-medium text-sm transition ${activeTab === 'vote' ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-400 hover:text-white'}`}
                >
                  Student Voting Booth
                </button>
                <button 
                  onClick={() => setActiveTab('events')}
                  className={`px-4 py-2 rounded-lg font-medium text-sm transition ${activeTab === 'events' ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-400 hover:text-white'}`}
                >
                  Event Manager Portal (Org Registration)
                </button>
              </div>
            </div>

            {/* TAB 1: VOTING SYSTEM */}
            {activeTab === 'vote' && (
              <div className="space-y-4">
                {candidates.map((item) => (
                  <div key={item.id} className="bg-[#111827] p-6 rounded-2xl border border-gray-800 flex justify-between items-center shadow-lg">
                    <div>
                      <span className="text-[10px] uppercase bg-blue-950 text-blue-400 px-2.5 py-1 rounded-md font-bold border border-blue-800/40">
                        Party: {item.party}
                      </span>
                      <h4 className="text-lg font-bold text-white mt-2">Candidate: {item.candidate}</h4>
                      <p className="text-sm text-gray-400 mt-1">Total Votes: <span className="text-white font-bold">{item.votes}</span></p>
                    </div>
                    <button 
                      onClick={() => handleVote(item.id)}
                      className="bg-emerald-600 hover:bg-emerald-700 px-6 py-2.5 rounded-xl font-medium text-sm transition shadow-lg text-white"
                    >
                      Vote
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* TAB 2: EVENT MANAGER PORTAL */}
            {activeTab === 'events' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Organization Registration & Event Adding Form */}
                <div className="bg-[#111827] p-6 rounded-2xl border border-gray-800 shadow-xl">
                  <h3 className="text-xl font-semibold mb-2 text-white">Organization / Event Manager Registration</h3>
                  <p className="text-sm text-gray-400 mb-6">Register your organization and publish campus events directly to the university portal.</p>
                  
                  <form onSubmit={handleAddEvent} className="space-y-4">
                    <div>
                      <label className="block text-xs text-gray-300 mb-1.5 font-medium">Organization / Club Name</label>
                      <input 
                        type="text" 
                        value={orgName} 
                        onChange={(e) => setOrgName(e.target.value)} 
                        placeholder="e.g. Cultural Club / ABVP / NSUI" 
                        className="w-full bg-[#0b0f17] border border-gray-700 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-300 mb-1.5 font-medium">Event Title</label>
                      <input 
                        type="text" 
                        value={eventName} 
                        onChange={(e) => setEventName(e.target.value)} 
                        placeholder="e.g. Annual Tech Fest 2026" 
                        className="w-full bg-[#0b0f17] border border-gray-700 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-300 mb-1.5 font-medium">Event Date</label>
                      <input 
                        type="date" 
                        value={eventDate} 
                        onChange={(e) => setEventDate(e.target.value)} 
                        className="w-full bg-[#0b0f17] border border-gray-700 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 text-white"
                      />
                    </div>
                    <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 py-3 rounded-xl text-sm font-medium transition shadow-lg">
                      Register & Publish Event
                    </button>
                  </form>
                </div>

                {/* Display Upcoming University Events */}
                <div className="bg-[#111827] p-6 rounded-2xl border border-gray-800 shadow-xl">
                  <h3 className="text-xl font-semibold mb-4 text-white">Scheduled Campus Events</h3>
                  <div className="space-y-3">
                    {eventsList.map((evt) => (
                      <div key={evt.id} className="bg-[#0b0f17] p-4 rounded-xl border border-gray-800">
                        <span className="text-[10px] text-blue-400 font-semibold uppercase">{evt.org}</span>
                        <h4 className="font-bold text-sm text-white mt-1">{evt.name}</h4>
                        <p className="text-xs text-gray-400 mt-1">Date: {evt.date}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}