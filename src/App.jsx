{/* VIEW 3: ADMIN ID & PASSWORD LOGIN + DASHBOARD */}
{currentView === 'admin' && (
  <div>
    {!isAdminLoggedIn ? (
      <div className="max-w-md mx-auto mt-12 bg-gradient-to-b from-gray-900 to-gray-950 border border-gray-800 p-8 rounded-3xl shadow-2xl backdrop-blur-md">
        <div className="text-center mb-6">
          <span className="text-xs bg-purple-500/15 text-purple-400 px-3 py-1 rounded-full border border-purple-500/30 font-semibold uppercase tracking-widest inline-block mb-2">Restricted Access</span>
          <h2 className="text-2xl font-black text-white">Admin Portal Login</h2>
          <p className="text-xs text-gray-400 mt-1">Please authenticate to access the document review settings.</p>
        </div>

        <form onSubmit={handleAdminLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1.5">Admin Username</label>
            <input 
              type="text" 
              value={adminUsername}
              onChange={(e) => setAdminUsername(e.target.value)}
              placeholder="Username"
              className="w-full bg-gray-950 border border-gray-800 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-blue-500"
              required 
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1.5">Password</label>
            <input 
              type="password" 
              value={adminPassword}
              onChange={(e) => setAdminPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-gray-950 border border-gray-800 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-blue-500"
              required 
            />
          </div>
          <button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 text-white py-3.5 rounded-xl text-sm font-bold shadow-lg mt-2">
            Login
          </button>
        </form>
      </div>
    ) : (
      // Admin Dashboard code...