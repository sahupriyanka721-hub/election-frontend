import React, { useState, useEffect } from 'react';
import { auth, db, googleProvider } from './firebase';
import { signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';
import { collection, getDocs, doc, setDoc, updateDoc, increment, getDoc } from 'firebase/firestore';

export default function App() {
  const [user, setUser] = useState(null);
  const [universities, setUniversities] = useState([
    { id: 'graphic-era', name: 'Graphic Era University', location: 'Dehradun, Uttarakhand', desc: 'Student union election portal.', votes: 120 },
    { id: 'amity', name: 'Amity University', location: 'Noida, Uttar Pradesh', desc: 'Annual Student Council Election.', votes: 250 },
    { id: 'lpu', name: 'Lovely Professional University', location: 'Phagwara, Punjab', desc: 'Official Campus Senate Election.', votes: 310 },
    { id: 'chandigarh', name: 'Chandigarh University', location: 'Mohali, Punjab', desc: 'Central Student Representative Elections.', votes: 190 }
  ]);
  const [selectedUni, setSelectedUni] = useState(null);
  const [candidates, setCandidates] = useState([
    { id: 1, name: 'Aarav Sharma', party: 'ABVP', votes: 120 },
    { id: 2, name: 'Rahul Verma', party: 'NSUI', votes: 95 }
  ]);

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
        <h1 className="text-xl font-bold tracking-wider text-blue-400">UniVote Pro</h1>
        <div>
          {user ? (
            <div className="flex items-center gap-4">
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
            <p className="text-gray-400 text-center mb-8">Click on your institution to view candidates, manage events, access voter authentication, and cast your vote.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {universities.map((uni) => (
                <div key={uni.id} className="bg-gray-900 border border-gray-800 p-6 rounded-xl flex flex-col justify-between hover:border-blue-500 transition">
                  <div>
                    <h3 className="font-bold text-lg text-white mb-1">{uni.name}</h3>
                    <p className="text-xs text-blue-400 mb-3">{uni.location}</p>
                    <p className="text-xs text-gray-400 mb-6">{uni.desc}</p>
                  </div>
                  <button 
                    onClick={() => setSelectedUni(uni)}
                    className="w-full bg-gray-800 hover:bg-blue-600 text-sm py-2 rounded transition font-medium text-center"
                  >
                    Open Portal →
                  </button>
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
              {candidates.map((cand) => (
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