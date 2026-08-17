import React, { useState, useEffect } from 'react';
import { auth, googleProvider } from './firebase';
import { signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';

export default function App() {
  const [user, setUser] = useState(null);
  const [selectedUni, setSelectedUni] = useState(null);

  const universities = [
    { 
      id: 'graphic-era', 
      name: 'Graphic Era University', 
      location: 'Dehradun, Uttarakhand', 
      desc: 'Graphic Era (Deemed to be University) student union election portal.', 
      eligible: '18,500+',
      candidates: [
        { id: 1, name: 'Aarav Sharma', party: 'ABVP', votes: 120 },
        { id: 2, name: 'Rahul Verma', party: 'NSUI', votes: 95 }
      ]
    },
    { 
      id: 'amity', 
      name: 'Amity University', 
      location: 'Noida, Uttar Pradesh', 
      desc: 'Annual Student Council Election for Amity University main campus.', 
      eligible: '25,000+',
      candidates: [
        { id: 1, name: 'Priya Singh', party: 'Youth Front', votes: 150 },
        { id: 2, name: 'Amit Kumar', party: 'Student Voice', votes: 130 }
      ]
    },
    { 
      id: 'lpu', 
      name: 'Lovely Professional University', 
      location: 'Phagwara, Punjab', 
      desc: 'Official Campus Senate Election Portal.', 
      eligible: '35,000+',
      candidates: [
        { id: 1, name: 'Simran Kaur', party: 'Panah', votes: 210 },
        { id: 2, name: 'Rohit Gupta', party: 'Campus Alliance', votes: 180 }
      ]
    },
    { 
      id: 'chandigarh', 
      name: 'Chandigarh University', 
      location: 'Mohali, Punjab', 
      desc: 'Central Student Representative Elections.', 
      eligible: '30,000+',
      candidates: [
        { id: 1, name: 'Vikas Patel', party: 'Inquilab', votes: 160 },
        { id: 2, name: 'Neha Sharma', party: 'Students Association', votes: 145 }
      ]
    }
  ];

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

  return (
    <div className="min-h-screen bg-[#0b0f17] text-gray-100 font-sans">
      <nav className="p-4 border-b border-gray-800 flex justify-between items-center max-w-7xl mx-auto">
        <div>
          <h1 className="text-xl font-bold tracking-wider text-white">UniVote Pro</h1>
          <p className="text-[10px] text-gray-400">National Campus Election & Event Management Portal</p>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-xs text-green-400 flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-green-500 inline-block"></span> Live Connection Active
          </span>
          {user ? (
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-300">Hello, {user.displayName}</span>
              <button 
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded text-sm font-medium transition"
              >
                Logout
              </button>
            </div>
          ) : (
            <button 
              onClick={handleGoogleLogin}
              className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-sm font-medium transition"
            >
              Sign in with Google
            </button>
          )}
        </div>
      </nav>

      <main className="p-8 max-w-7xl mx-auto">
        {!selectedUni ? (
          <div>
            <h2 className="text-3xl font-bold text-center mb-2">Select Your University</h2>
            <p className="text-gray-400 text-center mb-8">Click on your institution to view candidates, manage events, access voter authentication, and cast votes.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {universities.map((uni) => (
                <div key={uni.id} className="bg-gray-900 border border-gray-800 p-6 rounded-xl flex flex-col justify-between hover:border-blue-500 transition relative">
                  <div>
                    <div className="flex justify-between items-start mb-3">
                      <span className="text-xl">🏛️</span>
                      <span className="text-[10px] bg-green-950 text-green-400 px-2 py-0.5 rounded border border-green-800">Elections & Events Active</span>
                    </div>
                    <h3 className="font-bold text-lg text-white mb-1">{uni.name}</h3>
                    <p className="text-xs text-blue-400 mb-2">📍 {uni.location}</p>
                    <p className="text-xs text-gray-400 mb-6">{uni.desc}</p>
                  </div>
                  <div>
                    <div className="flex justify-between items-center text-xs text-gray-400 mb-3 border-t border-gray-800 pt-3">
                      <span>Eligible: <strong className="text-white">{uni.eligible}</strong></span>
                    </div>
                    <button 
                      onClick={() => setSelectedUni(uni)}
                      className="w-full bg-gray-800 hover:bg-blue-600 text-sm py-2 rounded transition font-medium text-center text-white"
                    >
                      Open Portal →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div>
            <button 
              onClick={() => setSelectedUni(null)}
              className="text-sm text-blue-400 hover:underline mb-6 block"
            >
              ← Back to Universities
            </button>
            
            <h2 className="text-3xl font-bold text-white mb-1">{selectedUni.name}</h2>
            <p className="text-gray-400 mb-6">Student Union Election 2026 - Cast Your Vote</p>

            <div className="flex gap-4 mb-8 border-b border-gray-800 pb-4">
              <button className="bg-blue-600 text-white px-4 py-2 rounded text-sm font-medium">Student Voting Booth</button>
              <button className="text-gray-400 hover:text-white px-4 py-2 rounded text-sm font-medium">Event Manager Portal (Org Registration)</button>
            </div>

            <div className="space-y-4">
              {selectedUni.candidates.map((cand) => (
                <div key={cand.id} className="bg-gray-900 border border-gray-800 p-4 rounded-xl flex justify-between items-center">
                  <div>
                    <span className="text-[10px] text-blue-400 font-semibold uppercase">Party: {cand.party}</span>
                    <h4 className="font-bold text-sm text-white mt-1">Candidate: {cand.name}</h4>
                    <p className="text-xs text-gray-400 mt-1">Total Votes: {cand.votes}</p>
                  </div>
                  <button 
                    onClick={() => {
                      if(!user) {
                        alert("Please sign in with Google first to vote!");
                        return;
                      }
                      alert("Vote recorded successfully for " + cand.name);
                    }}
                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded text-sm font-medium transition"
                  >
                    Vote
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}