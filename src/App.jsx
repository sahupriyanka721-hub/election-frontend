import React, { useState } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut } from 'firebase/auth';
import { getFirestore, doc, getDoc, setDoc, updateDoc, collection, addDocs, getDocs } from 'firebase/firestore';

// Firebase configuration using environment variables
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
  const [activeTab, setActiveTab] = useState('vote'); // 'vote' or 'events'
  
  // Event Manager Form State
  const [orgName, setOrgName] = useState('');
  const [eventName, setEventName] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [eventsList, setEventsList] = useState([
    { id: 1, org: 'ABVP Council', name: 'Annual Youth Summit', date: '2026-08-25' },
    { id: 2, org: 'NSUI wing', name: 'Campus Debate Competition', date: '2026-08-28' }
  ]);

  // Dummy Universities List for Multiple Cards
  const universities = [
    { id: 'graphic-era', name: 'Graphic Era University', location: 'Dehradun', image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=600&q=80' },
    { id: 'amity', name: 'Amity University', location: 'Noida', image: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=600&q=80' },
    { id: 'lpu', name: 'Lovely Professional University', location: 'Punjab', image: 'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=600&q=80' },
    { id: 'chandigarh', name: 'Chandigarh University', location: 'Mohali', image: 'https://images.unsplash.com/photo-14982436915f1-8f15d7e7e641?auto=format&fit=crop&w=600&q=80' }
  ];

  // Candidates for Voting
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
      alert("Please login first to cast your vote!");
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
    <div className="min-h-screen bg-gray-900 text-white font-sans">
      {/* Navbar */}
      <nav className="flex justify-between items-center px-6 py-4 bg-gray-800 border-b border-gray-700">
        <div>
          <h1 className="text-xl font-bold tracking-wider text-blue-400">UniVote Pro</h1>
          <p className="text-xs text-gray-400">National Campus Election & Event Portal</p>
        </div>
        <div>
          {user ? (
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-300">Welcome, {user.displayName}</span>
              <button onClick={handleLogout} className="bg-red-600 hover:bg-red-700 px-4 py-1.5 rounded text-sm font-medium">Logout</button>
            </div>
          ) : (
            <button onClick={handleLogin} className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-sm font-medium">Sign in with Google</button>
          )}
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="p-8 max-w-6xl mx-auto">
        {!selectedUniversity ? (
          <div>
            <h2 className="text-2xl font-semibold mb-2">Select Your University</h2>
            <p className="text-gray-400 mb-6">Choose your university below to view elections, vote, or manage campus events.</p>
            
            {/* University Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {universities.map((uni) => (
                <div 
                  key={uni.id} 
                  onClick={() => setSelectedUniversity(uni)}
                  className="bg-gray-800 rounded-lg overflow-hidden border border-gray-700 hover:border-blue-500 cursor-pointer transition transform hover:-translate-y-1 shadow-lg"
                >
                  <img src={uni.image} alt={uni.name} className="h-40 w-full object-cover" />
                  <div className="p-4">
                    <h3 className="font-bold text-lg mb-1">{uni.name}</h3>
                    <p className="text-sm text-gray-400">{uni.location}</p>
                    <button className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-sm py-2 rounded font-medium">Enter Portal</button>
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
              className="mb-6 bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded text-sm font-medium"
            >
              ← Back to Universities
            </button>

            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 mb-6">
              <h2 className="text-3xl font-bold text-blue-400 mb-1">{selectedUniversity.name}</h2>
              <p className="text-gray-400">Location: {selectedUniversity.location} | Student Union Election & Event Management Portal</p>
              
              {/* Portal Navigation Tabs */}
              <div className="flex gap-4 mt-6 border-b border-gray-700 pb-3">
                <button 
                  onClick={() => setActiveTab('vote')}
                  className={`px-4 py-2 rounded font-medium text-sm ${activeTab === 'vote' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300'}`}
                >
                  Student Voting Booth
                </button>
                <button 
                  onClick={() => setActiveTab('events')}
                  className={`px-4 py-2 rounded font-medium text-sm ${activeTab === 'events' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300'}`}
                >
                  Event Manager Portal (Org Registration)
                </button>
              </div>
            </div>

            {/* TAB 1: VOTING SYSTEM */}
            {activeTab === 'vote' && (
              <div>
                <h3 className="text-xl font-semibold mb-4">Student Union Election 2026 - Cast Your Vote</h3>
                <div className="grid gap-4">
                  {candidates.map((item) => (
                    <div key={item.id} className="bg-gray-800 p-5 rounded-lg border border-gray-700 flex justify-between items-center">
                      <div>
                        <span className="text-xs uppercase bg-blue-900 text-blue-300 px-2 py-1 rounded font-semibold">Party: {item.party}</span>
                        <h4 className="text-lg font-bold mt-2">Candidate: {item.candidate}</h4>
                        <p className="text-sm text-gray-400 mt-1">Total Votes: <span className="text-white font-bold">{item.votes}</span></p>
                      </div>
                      <button 
                        onClick={() => handleVote(item.id)}
                        className="bg-green-600 hover:bg-green-700 px-6 py-2.5 rounded font-medium text-sm"
                      >
                        Vote
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 2: EVENT MANAGER PORTAL */}
            {activeTab === 'events' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Organization Registration & Event Adding Form */}
                <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                  <h3 className="text-xl font-semibold mb-2">Organization / Event Manager Registration</h3>
                  <p className="text-sm text-gray-400 mb-4">Register your organization and publish campus events directly to the university portal.</p>
                  
                  <form onSubmit={handleAddEvent} className="space-y-4">
                    <div>
                      <label className="block text-sm text-gray-300 mb-1">Organization / Club Name</label>
                      <input 
                        type="text" 
                        value={orgName} 
                        onChange={(e) => setOrgName(e.target.value)} 
                        placeholder="e.g. Cultural Club / ABVP / NSUI" 
                        className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-300 mb-1">Event Title</label>
                      <input 
                        type="text" 
                        value={eventName} 
                        onChange={(e) => setEventName(e.target.value)} 
                        placeholder="e.g. Annual Tech Fest 2026" 
                        className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-300 mb-1">Event Date</label>
                      <input 
                        type="date" 
                        value={eventDate} 
                        onChange={(e) => setEventDate(e.target.value)} 
                        className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500 text-white"
                      />
                    </div>
                    <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 py-2.5 rounded text-sm font-medium">
                      Register & Publish Event
                    </button>
                  </form>
                </div>

                {/* Display Upcoming University Events */}
                <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                  <h3 className="text-xl font-semibold mb-4">Scheduled Campus Events</h3>
                  <div className="space-y-3">
                    {eventsList.map((evt) => (
                      <div key={evt.id} className="bg-gray-900 p-4 rounded border border-gray-700">
                        <span className="text-xs text-blue-400 font-semibold">{evt.org}</span>
                        <h4 className="font-bold text-md mt-1">{evt.name}</h4>
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