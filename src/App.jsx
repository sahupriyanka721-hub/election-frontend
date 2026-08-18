import React, { useState, useEffect } from 'react';
import { auth, googleProvider } from './firebase';
import { signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';

export default function App() {
  const [user, setUser] = useState(null);
  const [selectedUni, setSelectedUni] = useState(null);
  const [activeTab, setActiveTab] = useState('voting');

  const [universities] = useState([
    { id: 'graphic-era', name: 'Graphic Era University', location: 'Dehradun, UK', desc: 'Student union election portal.', eligible: '18,500+' },
    { id: 'amity', name: 'Amity University', location: 'Noida, UP', desc: 'Annual Student Council Election.', eligible: '25,000+' },
    { id: 'lpu', name: 'Lovely Professional Uni', location: 'Phagwara, PB', desc: 'Official Campus Senate Portal.', eligible: '35,000+' },
    { id: 'chandigarh', name: 'Chandigarh University', location: 'Mohali, PB', desc: 'Central Student Rep Elections.', eligible: '30,000+' }
  ]);

  useEffect(() => {
    onAuthStateChanged(auth, (u) => setUser(u));
  }, []);

  return (
    <div className="min-h-screen bg-[#020617] text-gray-100 font-sans p-4 md:p-6 lg:p-10 selection:bg-blue-500">
      
      {/* Optimized Navigation */}
      <nav className="flex flex-wrap justify-between items-center gap-4 mb-12">
        <div>
          <h1 className="text-2xl md:text-3xl font-black bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">UniVote Pro</h1>
        </div>
        {user ? (
          <div className="flex items-center gap-3 bg-white/5 px-4 py-2 rounded-2xl border border-white/10 backdrop-blur-md">
            <img src={user.photoURL} className="w-8 h-8 rounded-full border border-blue-500" />
            <div className="hidden sm:block">
              <p className="text-[10px] font-bold">{user.displayName}</p>
            </div>
            <button onClick={() => signOut(auth)} className="text-[10px] bg-red-600 px-3 py-1 rounded-lg">Exit</button>
          </div>
        ) : (
          <button onClick={() => signInWithPopup(auth, googleProvider)} className="bg-blue-600 px-6 py-2.5 rounded-2xl text-sm font-bold shadow-lg shadow-blue-900/20 hover:scale-105 transition-transform">Sign In</button>
        )}
      </nav>

      {/* Main Content */}
      <main>
        {!selectedUni ? (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl md:text-5xl font-black mb-4">Select University</h2>
              <p className="text-gray-400 text-sm md:text-base max-w-lg mx-auto">Choose your campus to access the official election portal.</p>
            </div>

            {/* Perfect Responsive Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
              {universities.map((uni) => (
                <div key={uni.id} className="group relative overflow-hidden bg-gradient-to-b from-gray-900/80 to-gray-950/80 border border-white/5 p-6 rounded-3xl hover:border-blue-500/50 transition-all duration-500 hover:shadow-2xl hover:shadow-blue-900/10">
                  <div className="text-3xl mb-4 opacity-80 group-hover:scale-110 transition-transform">🏛️</div>
                  <h3 className="font-bold text-lg mb-2 group-hover:text-blue-400 transition-colors">{uni.name}</h3>
                  <p className="text-xs text-gray-500 mb-6">{uni.desc}</p>
                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/5">
                    <span className="text-[10px] text-gray-400">Voters: {uni.eligible}</span>
                    <button 
                      onClick={() => setSelectedUni(uni)}
                      className="bg-white/5 hover:bg-blue-600 px-4 py-2 rounded-xl text-[11px] font-bold transition-all"
                    >
                      Open →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="animate-in slide-in-from-bottom-10 duration-700">
            <button onClick={() => setSelectedUni(null)} className="text-blue-400 text-xs font-bold mb-6 hover:underline">← Back to List</button>
            <h2 className="text-4xl md:text-6xl font-black mb-12">{selectedUni.name}</h2>
            {/* Voting content... */}
          </div>
        )}
      </main>
    </div>
  );
}