import React, { useState, useEffect } from 'react';
import { auth, googleProvider } from './firebase';
import { signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';

export default function App() {
  const [user, setUser] = useState(null);
  const [selectedUni, setSelectedUni] = useState(null);
  const [activeTab, setActiveTab] = useState('voting');
  const [candidateName, setCandidateName] = useState('');
  const [candidateParty, setCandidateParty] = useState('');
  
  // Previous State remains same
  const [universities, setUniversities] = useState([
    { 
      id: 'graphic-era', 
      name: 'Graphic Era University', 
      location: 'Dehradun, Uttarakhand', 
      desc: 'Graphic Era (Deemed to be University) student union election portal.', 
      eligible: '18,500+',
      candidates: [
        { id: 1, name: 'Aarav Sharma', party: 'Vivant', votes: 120 },
        { id: 2, name: 'Rahul Verma', party: 'Ojashvi', votes: 95 },
        { id: 3, name: 'Priya Negi', party: 'Ashre Army', votes: 45 }
      ]
    },
    { 
      id: 'amity', 
      name: 'Amity University', 
      location: 'Noida, Uttar Pradesh', 
      desc: 'Annual Student Council Election for Amity University main campus.', 
      eligible: '25,000+',
      candidates: [
        { id: 1, name: 'Priya Singh', party: 'Vivant', votes: 150 },
        { id: 2, name: 'Amit Kumar', party: 'Ashre Army', votes: 130 },
        { id: 3, name: 'Rohit Singh', party: 'Ojashvi', votes: 90 }
      ]
    },
    { 
      id: 'lpu', 
      name: 'Lovely Professional University', 
      location: 'Phagwara, Punjab', 
      desc: 'Official Campus Senate Election Portal.', 
      eligible: '35,000+',
      candidates: [
        { id: 1, name: 'Simran Kaur', party: 'Ojashvi', votes: 210 },
        { id: 2, name: 'Rohit Gupta', party: 'Vivant', votes: 180 },
        { id: 3, name: 'Ankit Sharma', party: 'Ashre Army', votes: 110 }
      ]
    },
    { 
      id: 'chandigarh', 
      name: 'Chandigarh University', 
      location: 'Mohali, Punjab', 
      desc: 'Central Student Representative Elections.', 
      eligible: '30,000+',
      candidates: [
        { id: 1, name: 'Vikas Patel', party: 'Ashre Army', votes: 160 },
        { id: 2, name: 'Neha Sharma', party: 'Vivant', votes: 145 },
        { id: 3, name: 'Karan Mehra', party: 'Ojashvi', votes: 115 }
      ]
    }
  ]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleGoogleLogin = async () => {
    try { await signInWithPopup(auth, googleProvider); } 
    catch (error) { alert("Login failed: " + error.message); }
  };

  const handleLogout = async () => {
    try { await signOut(auth); } 
    catch (error) { alert("Logout failed: " + error.message); }
  };

  // ... (handleVote and handleAddCandidate remain same as before) ...
  const handleVote = (uniId, candidateId) => {
    if (!user) { alert("Please sign in with Google first!"); return; }
    setUniversities(universities.map(uni => uni.id === uniId ? { ...uni, candidates: uni.candidates.map(c => c.id === candidateId ? { ...c, votes: c.votes + 1 } : c) } : uni));
    alert("Vote recorded!");
  };

  const handleAddCandidate = (e) => {
    e.preventDefault();
    if (!user) { alert("Please sign in!"); return; }
    const newCandidate = { id: Date.now(), name: candidateName, party: candidateParty, votes: 0 };
    setUniversities(universities.map(uni => uni.id === selectedUni.id ? { ...uni, candidates: [...uni.candidates, newCandidate] } : uni));
    setSelectedUni(prev => ({ ...prev, candidates: [...prev.candidates, newCandidate] }));
    setCandidateName(''); setCandidateParty('');
  };

  return (
    <div className="min-h-screen bg-[#0b0f17] text-gray-100 font-sans">
      <nav className="p-4 border-b border-gray-800 flex justify-between items-center max-w-7xl mx-auto">
        <h1 className="text-xl font-bold text-white">UniVote Pro</h1>
        
        {user ? (
          <div className="flex items-center gap-4">
            {/* User Profile Section */}
            <div className="flex items-center gap-2 bg-gray-800 px-3 py-1 rounded-full border border-gray-700">
              <img src={user.photoURL} alt="Profile" className="w-8 h-8 rounded-full" />
              <div className="text-xs">
                <p className="font-bold">{user.displayName}</p>
                <p className="text-gray-400 text-[10px]">{user.email}</p>
              </div>
            </div>
            <button onClick={handleLogout} className="bg-red-600 px-4 py-1 rounded text-sm">Logout</button>
          </div>
        ) : (
          <button onClick={handleGoogleLogin} className="bg-blue-600 px-4 py-2 rounded text-sm">Sign in with Google</button>
        )}
      </nav>

      <main className="p-8 max-w-7xl mx-auto">
        {/* Rest of the UI remains same, just ensure this nav is replaced */}
        {!selectedUni ? (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {universities.map((uni) => (
                    <div key={uni.id} className="bg-gray-900 border border-gray-800 p-6 rounded-xl">
                        <h3 className="font-bold text-lg">{uni.name}</h3>
                        <button onClick={() => { setSelectedUni(uni); setActiveTab('voting'); }} className="w-full mt-4 bg-blue-600 py-2 rounded">Open Portal</button>
                    </div>
                ))}
            </div>
        ) : (
            // ... (Your existing voting/manager portal logic) ...
            <div className="text-white">Portal content for {selectedUni.name}</div>
        )}
      </main>
    </div>
  );
}