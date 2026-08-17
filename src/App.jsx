import React, { useState, useEffect } from 'react';
import { auth, googleProvider } from './firebase';
import { signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';

export default function App() {
  const [user, setUser] = useState(null);
  const [selectedUni, setSelectedUni] = useState(null);
  const [activeTab, setActiveTab] = useState('voting');

  const [candidateName, setCandidateName] = useState('');
  const [candidateParty, setCandidateParty] = useState('');
  
  // Updated Data with your requested party names
  const [universities, setUniversities] = useState([
    { 
      id: 'graphic-era', 
      name: 'Graphic Era University', 
      location: 'Dehradun, Uttarakhand', 
      desc: 'Official student union election portal.', 
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
      desc: 'Annual Student Council Election portal.', 
      eligible: '25,000+',
      candidates: [
        { id: 1, name: 'Siddharth Roy', party: 'Vivant', votes: 150 },
        { id: 2, name: 'Anjali Singh', party: 'Visionary League', votes: 130 },
        { id: 3, name: 'Vikram Singh', party: 'Ashre Army', votes: 88 }
      ]
    },
    { 
      id: 'lpu', 
      name: 'Lovely Professional University', 
      location: 'Phagwara, Punjab', 
      desc: 'Campus Senate Election Portal.', 
      eligible: '35,000+',
      candidates: [
        { id: 1, name: 'Karan Mehra', party: 'Ojashvi', votes: 210 },
        { id: 2, name: 'Neha Kakkar', party: 'Global Force', votes: 180 },
        { id: 3, name: 'Rohan Gupta', party: 'Vivant', votes: 140 }
      ]
    },
    { 
      id: 'chandigarh', 
      name: 'Chandigarh University', 
      location: 'Mohali, Punjab', 
      desc: 'Central Student Representative Elections.', 
      eligible: '30,000+',
      candidates: [
        { id: 1, name: 'Arjun Reddy', party: 'Ashre Army', votes: 190 },
        { id: 2, name: 'Sneha Rao', party: 'Vivant', votes: 165 },
        { id: 3, name: 'Manish Kumar', party: 'Ojashvi', votes: 125 }
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
    const newCandidate = { id: Date.now(), name: candidateName, party: candidateParty, votes: 0 };
    setUniversities(universities.map(uni => {
      if (uni.id === selectedUni.id) {
        return { ...uni, candidates: [...uni.candidates, newCandidate] };
      }
      return uni;
    }));
    setSelectedUni(prev => ({ ...prev, candidates: [...prev.candidates, newCandidate] }));
    setCandidateName(''); setCandidateParty('');
    alert("Candidate added successfully!");
  };

  return (
    <div className="min-h-screen bg-[#0b0f17] text-gray-100 font-sans">
      <nav className="p-4 border-b border-gray-800 flex justify-between items-center max-w-7xl mx-auto">
        <h1 className="text-xl font-bold tracking-wider text-white">UniVote Pro</h1>
        {user ? (
            <button onClick={handleLogout} className="bg-red-600 px-4 py-2 rounded text-sm">Logout</button>
          ) : (
            <button onClick={handleGoogleLogin} className="bg-blue-600 px-4 py-2 rounded text-sm">Sign in with Google</button>
        )}
      </nav>

      <main className="p-8 max-w-7xl mx-auto">
        {!selectedUni ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {universities.map((uni) => (
              <div key={uni.id} className="bg-gray-900 border border-gray-800 p-6 rounded-xl">
                <h3 className="font-bold text-lg mb-1">{uni.name}</h3>
                <p className="text-xs text-gray-400 mb-4">{uni.location}</p>
                <button onClick={() => { setSelectedUni(uni); setActiveTab('voting'); }} className="w-full bg-blue-600 py-2 rounded text-sm">Open Portal →</button>
              </div>
            ))}
          </div>
        ) : (
          <div>
            <button onClick={() => setSelectedUni(null)} className="text-blue-400 mb-6">← Back</button>
            <h2 className="text-3xl font-bold mb-6">{selectedUni.name}</h2>
            <div className="flex gap-4 mb-8">
              <button onClick={() => setActiveTab('voting')} className={`px-4 py-2 rounded ${activeTab === 'voting' ? 'bg-blue-600' : 'bg-gray-900'}`}>Voting Booth</button>
              <button onClick={() => setActiveTab('manager')} className={`px-4 py-2 rounded ${activeTab === 'manager' ? 'bg-blue-600' : 'bg-gray-900'}`}>Event Manager</button>
            </div>
            {activeTab === 'voting' ? (
              <div className="space-y-4">
                {selectedUni.candidates.map((cand) => (
                  <div key={cand.id} className="bg-gray-900 p-4 rounded-xl flex justify-between items-center border border-gray-800">
                    <div>
                      <p className="text-[10px] text-blue-400 uppercase">{cand.party}</p>
                      <h4 className="font-bold text-sm">{cand.name}</h4>
                      <p className="text-xs text-gray-400">Votes: {cand.votes}</p>
                    </div>
                    <button onClick={() => handleVote(selectedUni.id, cand.id)} className="bg-green-600 px-6 py-2 rounded text-sm">Vote</button>
                  </div>
                ))}
              </div>
            ) : (
              <form onSubmit={handleAddCandidate} className="bg-gray-900 p-6 rounded-xl border border-gray-800">
                <h3 className="mb-4">Register New Candidate</h3>
                <input className="w-full bg-gray-800 p-2 rounded mb-3" placeholder="Candidate Name" value={candidateName} onChange={(e) => setCandidateName(e.target.value)} required />
                <input className="w-full bg-gray-800 p-2 rounded mb-3" placeholder="Party Name" value={candidateParty} onChange={(e) => setCandidateParty(e.target.value)} required />
                <button type="submit" className="bg-blue-600 w-full py-2 rounded">Add Candidate</button>
              </form>
            )}
          </div>
        )}
      </main>
    </div>
  );
}