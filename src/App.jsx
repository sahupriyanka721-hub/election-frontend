import React, { useState, useEffect, useRef, useCallback } from "react";
import { Lock, Check, X, ShieldCheck, Users, Vote, LogOut, RotateCcw, ArrowRight } from "lucide-react";

/* ---------------------------------------------------
   College Union Election — Kiosk Frontend
   NOW CONNECTED to the real backend (Node/Express + MongoDB).

   IMPORTANT: change API_BASE below once your backend is deployed
   (e.g. to Render). Right now it points at your local backend.
--------------------------------------------------- */

const API_BASE = "https://election-backend-2-owlq.onrender.com/api";
// After deploying the backend (Section: "Deploy your project"), change this to
// something like: "https://election-backend-xyz.onrender.com/api"

const PARTY_COLORS = ["#E8952C", "#2E6E62", "#B23A2E", "#5A5FA6", "#8A6E3A", "#3A6EA5"];

async function apiFetch(path, options = {}) {
  const res = await fetch(API_BASE + path, {
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
    ...options,
  });
  let data = {};
  try {
    data = await res.json();
  } catch (_) {
    /* empty body */
  }
  if (!res.ok) {
    throw new Error(data.error || `Request failed (${res.status})`);
  }
  return data;
}

function initials(name) {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function Seal({ label = "VERIFIED VOTE", size = 128 }) {
  const r = size / 2 - 10;
  const cx = size / 2;
  const cy = size / 2;
  const pathId = "sealpath-" + label.replace(/\s/g, "");
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="seal-svg">
      <defs>
        <path id={pathId} d={`M ${cx - r},${cy} a ${r},${r} 0 1,1 ${r * 2},0`} fill="none" />
      </defs>
      <circle cx={cx} cy={cy} r={r + 6} className="seal-ring-outer" />
      <circle cx={cx} cy={cy} r={r - 6} className="seal-ring-inner" />
      <text className="seal-text" dy="4">
        <textPath href={`#${pathId}`} startOffset="50%" textAnchor="middle">
          {label} • {label} •
        </textPath>
      </text>
      <g transform={`translate(${cx},${cy})`}>
        <path d="M -14,0 L -4,11 L 16,-12" stroke="currentColor" strokeWidth="6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </svg>
  );
}

function Confetti() {
  const pieces = useRef(
    Array.from({ length: 60 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 1.4,
      dur: 2.6 + Math.random() * 1.8,
      rot: Math.random() * 360,
      color: ["#E8952C", "#2E6E62", "#B23A2E", "#F5EFE3"][i % 4],
      size: 6 + Math.random() * 8,
    }))
  ).current;
  return (
    <div className="confetti-layer" aria-hidden="true">
      {pieces.map((p) => (
        <span
          key={p.id}
          className="confetti-piece"
          style={{
            left: p.left + "%",
            animationDelay: p.delay + "s",
            animationDuration: p.dur + "s",
            background: p.color,
            width: p.size,
            height: p.size * 0.4,
            transform: `rotate(${p.rot}deg)`,
          }}
        />
      ))}
    </div>
  );
}

function Chrome({ children, kioskCorner }) {
  return (
    <div className="stage">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,600;9..144,800;9..144,900&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@500;600&display=swap');
        .stage { min-height: 100vh; width: 100%; background: radial-gradient(circle at 15% 10%, #232C4E 0%, transparent 45%), radial-gradient(circle at 85% 90%, #1F2847 0%, transparent 50%), #1B2340; background-attachment: fixed; font-family: 'Inter', sans-serif; color: #F5EFE3; position: relative; padding: 28px 16px 40px; box-sizing: border-box; }
        .stage::before { content: ""; position: absolute; inset: 0; background-image: radial-gradient(rgba(245,239,227,0.05) 1px, transparent 1px); background-size: 22px 22px; pointer-events: none; }
        .topbar { max-width: 880px; margin: 0 auto 22px; display: flex; align-items: center; justify-content: space-between; position: relative; z-index: 2; }
        .brand { font-family: 'Fraunces', serif; font-weight: 800; font-size: 20px; letter-spacing: 0.02em; color: #F5EFE3; display: flex; align-items: center; gap: 8px; }
        .brand .dot { width: 8px; height: 8px; border-radius: 50%; background: #E8952C; }
        .corner-link { font-family: 'JetBrains Mono', monospace; font-size: 11px; letter-spacing: 0.08em; color: rgba(245,239,227,0.55); text-transform: uppercase; cursor: pointer; border: 1px solid rgba(245,239,227,0.2); padding: 7px 12px; border-radius: 3px; transition: all 0.15s ease; background: transparent; }
        .corner-link:hover { border-color: #E8952C; color: #E8952C; }
        .card { max-width: 480px; margin: 0 auto; position: relative; z-index: 2; background: #F5EFE3; color: #1D1A15; border-radius: 4px; box-shadow: 0 30px 60px -20px rgba(0,0,0,0.5), 0 2px 0 #E8952C; padding: 40px 36px 34px; overflow: hidden; }
        .card::before { content: ""; position: absolute; top: 0; left: 0; right: 0; height: 3px; background: repeating-linear-gradient(90deg, #1B2340 0 10px, transparent 10px 20px); }
        .eyebrow { font-family: 'JetBrains Mono', monospace; font-size: 11px; letter-spacing: 0.14em; text-transform: uppercase; color: #8A6E3A; margin-bottom: 10px; display: flex; align-items: center; gap: 8px; }
        h1.title { font-family: 'Fraunces', serif; font-weight: 800; font-size: 30px; line-height: 1.08; margin: 0 0 8px; color: #1B2340; }
        .sub { font-size: 14.5px; color: #4A4436; margin: 0 0 26px; line-height: 1.5; }
        label.field-label { display: block; font-family: 'JetBrains Mono', monospace; font-size: 11px; letter-spacing: 0.08em; text-transform: uppercase; color: #6B6455; margin-bottom: 6px; }
        input.field { width: 100%; box-sizing: border-box; padding: 12px 14px; margin-bottom: 18px; border: 1.5px solid #D9D0BC; border-radius: 3px; background: #FFFDF8; font-family: 'Inter', sans-serif; font-size: 15px; color: #1D1A15; outline: none; transition: border-color 0.15s ease; }
        input.field:focus { border-color: #1B2340; }
        button.btn-primary { width: 100%; padding: 13px 16px; background: #1B2340; color: #F5EFE3; border: none; border-radius: 3px; font-family: 'Inter', sans-serif; font-weight: 600; font-size: 14.5px; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px; transition: background 0.15s ease; letter-spacing: 0.01em; }
        button.btn-primary:hover { background: #232C4E; }
        button.btn-primary:disabled { opacity: 0.55; cursor: not-allowed; }
        button.btn-ghost { width: 100%; padding: 11px 16px; background: transparent; color: #6B6455; border: 1.5px solid #D9D0BC; border-radius: 3px; font-family: 'Inter', sans-serif; font-weight: 600; font-size: 13.5px; cursor: pointer; margin-top: 10px; }
        button.btn-ghost:hover { border-color: #1B2340; color: #1B2340; }
        .error-strip { background: #FBE7E2; border: 1px solid #E3A090; color: #93331F; font-size: 13px; padding: 10px 12px; border-radius: 3px; margin-bottom: 18px; display: flex; gap: 8px; align-items: flex-start; }
        .party-grid { display: grid; gap: 14px; margin: 6px 0 8px; }
        .party-card { border: 2px solid #E4DCC7; border-radius: 4px; padding: 18px 16px; display: flex; align-items: center; gap: 14px; cursor: pointer; background: #FFFDF8; transition: transform 0.12s ease, border-color 0.12s ease, box-shadow 0.12s ease; }
        .party-card:hover { transform: translateY(-2px); box-shadow: 0 8px 18px -8px rgba(0,0,0,0.25); }
        .party-mark { width: 46px; height: 46px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-family: 'Fraunces', serif; font-weight: 800; font-size: 15px; color: #FFFDF8; flex-shrink: 0; }
        .party-name { font-family: 'Fraunces', serif; font-weight: 700; font-size: 18px; color: #1B2340; }
        .party-sub { font-family: 'JetBrains Mono', monospace; font-size: 10.5px; color: #8A8272; letter-spacing: 0.06em; }
        .modal-backdrop { position: fixed; inset: 0; background: rgba(27,35,64,0.72); display: flex; align-items: center; justify-content: center; z-index: 50; padding: 20px; }
        .modal-box { background: #F5EFE3; border-radius: 4px; padding: 30px 28px; max-width: 340px; width: 100%; text-align: center; box-shadow: 0 30px 60px rgba(0,0,0,0.5); }
        .modal-row { display: flex; gap: 10px; margin-top: 20px; }
        .modal-row button { flex: 1; padding: 11px; border-radius: 3px; font-weight: 600; font-size: 13.5px; cursor: pointer; border: none; }
        .btn-confirm { background: #1B2340; color: #F5EFE3; }
        .btn-cancel { background: transparent; border: 1.5px solid #D9D0BC !important; color: #6B6455; }
        .center-col { display: flex; flex-direction: column; align-items: center; text-align: center; }
        .seal-svg { color: #1B2340; margin-bottom: 6px; }
        .seal-ring-outer { fill: none; stroke: #1B2340; stroke-width: 1.5; stroke-dasharray: 3 3; }
        .seal-ring-inner { fill: none; stroke: #1B2340; stroke-width: 2; }
        .seal-text { font-family: 'JetBrains Mono', monospace; font-size: 7.2px; letter-spacing: 0.12em; fill: #1B2340; }
        .thanks-msg { font-family: 'Fraunces', serif; font-weight: 800; font-size: 24px; color: #1B2340; margin: 14px 0 6px; }
        .thanks-sub { font-size: 13.5px; color: #6B6455; }
        .admin-row { display: flex; justify-content: space-between; align-items: center; padding: 12px 0; border-bottom: 1px solid #E4DCC7; }
        .admin-row:last-child { border-bottom: none; }
        .voter-name { font-weight: 600; font-size: 14px; color: #1B2340; }
        .voter-reg { font-family: 'JetBrains Mono', monospace; font-size: 11px; color: #8A8272; }
        .pill { font-size: 10.5px; font-family: 'JetBrains Mono', monospace; padding: 3px 9px; border-radius: 20px; letter-spacing: 0.05em; }
        .pill-voted { background: #E3EDE9; color: #2E6E62; }
        .pill-pending { background: #F1EADB; color: #8A6E3A; }
        .status-badge { display: inline-flex; align-items: center; gap: 6px; font-family: 'JetBrains Mono', monospace; font-size: 11px; letter-spacing: 0.08em; text-transform: uppercase; padding: 5px 11px; border-radius: 20px; margin-bottom: 20px; }
        .status-not { background: #EDEAE0; color: #6B6455; }
        .status-ongoing { background: #FCEBD3; color: #8A5A1B; }
        .status-ended { background: #E3EDE9; color: #2E6E62; }
        .turnout-track { height: 8px; background: #E4DCC7; border-radius: 4px; overflow: hidden; margin: 10px 0 22px; }
        .turnout-fill { height: 100%; background: #1B2340; transition: width 0.4s ease; }
        .results-card { max-width: 560px; }
        .winner-block { text-align: center; padding: 6px 0 24px; }
        .winner-name { font-family: 'Fraunces', serif; font-weight: 900; font-size: 34px; color: #1B2340; margin: 10px 0 2px; }
        .winner-tag { font-family: 'JetBrains Mono', monospace; font-size: 11px; letter-spacing: 0.1em; color: #8A6E3A; text-transform: uppercase; }
        .tally-row { display: flex; align-items: center; gap: 12px; margin-bottom: 14px; }
        .tally-label { width: 100px; font-size: 13px; font-weight: 600; color: #1B2340; flex-shrink: 0; }
        .tally-track { flex: 1; height: 20px; background: #E4DCC7; border-radius: 3px; overflow: hidden; }
        .tally-fill { height: 100%; border-radius: 3px; transition: width 0.8s cubic-bezier(.2,.8,.2,1); }
        .tally-count { font-family: 'JetBrains Mono', monospace; font-size: 12.5px; width: 34px; text-align: right; color: #4A4436; }
        .confetti-layer { position: fixed; inset: 0; overflow: hidden; pointer-events: none; z-index: 40; }
        .confetti-piece { position: absolute; top: -20px; border-radius: 1px; animation-name: fall; animation-timing-function: linear; animation-iteration-count: infinite; }
        @keyframes fall { 0% { transform: translateY(0) rotate(0deg); opacity: 1; } 100% { transform: translateY(110vh) rotate(340deg); opacity: 0.9; } }
        .stamp-in { animation: stampIn 0.5s cubic-bezier(.2,.9,.3,1.3); }
        @keyframes stampIn { 0% { transform: scale(2.4) rotate(-14deg); opacity: 0; } 60% { transform: scale(0.92) rotate(3deg); opacity: 1; } 100% { transform: scale(1) rotate(0deg); opacity: 1; } }
        .loading-txt { font-family: 'JetBrains Mono', monospace; font-size: 12.5px; color: #8A8272; text-align: center; padding: 30px 0; }
        @media (prefers-reduced-motion: reduce) { .confetti-piece, .stamp-in { animation: none !important; } }
      `}</style>
      <div className="topbar">
        <div className="brand"><span className="dot" />College Union Election</div>
        {kioskCorner}
      </div>
      {children}
    </div>
  );
}

export default function App() {
  const [screen, setScreen] = useState("voter");
  const [parties, setParties] = useState([]);
  const [election, setElection] = useState({ status: "not_started", resultsPublished: false });
  const [loading, setLoading] = useState(true);

  const [regNo, setRegNo] = useState("");
  const [name, setName] = useState("");
  const [formError, setFormError] = useState("");
  const [votingToken, setVotingToken] = useState(null);
  const [voterName, setVoterName] = useState("");

  const [selectedParty, setSelectedParty] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [castingVote, setCastingVote] = useState(false);

  const [adminU, setAdminU] = useState("");
  const [adminP, setAdminP] = useState("");
  const [loginError, setLoginError] = useState("");
  const [adminToken, setAdminToken] = useState(() => localStorage.getItem("adminToken") || null);
  const [voters, setVoters] = useState([]);
  const [adminBusy, setAdminBusy] = useState(false);
  const [adminError, setAdminError] = useState("");

  const [results, setResults] = useState(null);

  // ---- fetch election status + parties on load, then poll every 4s ----
  const refreshStatus = useCallback(async () => {
    try {
      const s = await apiFetch("/election/status");
      setElection(s);
      const p = await apiFetch("/parties");
      setParties(p);
      setLoading(false);
      return s;
    } catch (err) {
      setLoading(false);
      return null;
    }
  }, []);

  useEffect(() => {
    refreshStatus();
    const interval = setInterval(refreshStatus, 4000);
    return () => clearInterval(interval);
  }, [refreshStatus]);

  // Kiosk auto-jumps to results the moment admin ends the election
  useEffect(() => {
    if (election.status === "ended" && (screen === "voter" || screen === "booth")) {
      loadResults();
      setScreen("results");
    }
  }, [election.status]); // eslint-disable-line react-hooks/exhaustive-deps

  async function loadResults() {
    try {
      const r = await apiFetch("/results");
      setResults(r);
    } catch (err) {
      setResults(null);
    }
  }

  // Auto-return from thank-you screen
  useEffect(() => {
    setFormError("");
  }, [screen]);

 async function handleVerify(e) {
    e.preventDefault();
    setFormError("");
    setVotingToken("test-token-123");
    setVoterName(name || "Test Voter");
    setScreen("booth");
  } async function castVote() {
    if (!selectedParty || !votingToken) return;
    setCastingVote(true);
    try {
      await apiFetch("/votes/cast", {
        method: "POST",
        body: JSON.stringify({ votingToken, partyId: selectedParty._id }),
      });
      setShowConfirm(false);
      setSelectedParty(null);
      setScreen("thanks");
    } catch (err) {
      setShowConfirm(false);
      setFormError(err.message);
      setScreen("voter");
    } finally {
      setCastingVote(false);
    }
  }

  async function handleAdminLogin(e) {
    e.preventDefault();
    setLoginError("");
    try {
      const data = await apiFetch("/admin/login", {
        method: "POST",
        body: JSON.stringify({ username: adminU, password: adminP }),
      });
      localStorage.setItem("adminToken", data.token);
      setAdminToken(data.token);
      setScreen("admin");
      loadVoters(data.token);
    } catch (err) {
      setLoginError(err.message);
    }
  }

  async function loadVoters(token) {
    try {
      const v = await apiFetch("/voters", { headers: { Authorization: `Bearer ${token || adminToken}` } });
      setVoters(v);
    } catch (err) {
      setAdminError(err.message);
    }
  }

  async function startElection() {
    setAdminBusy(true); setAdminError("");
    try {
      await apiFetch("/election/start", { method: "POST", headers: { Authorization: `Bearer ${adminToken}` } });
      await refreshStatus();
    } catch (err) {
      setAdminError(err.message);
    } finally {
      setAdminBusy(false);
    }
  }

  async function endElection() {
    setAdminBusy(true); setAdminError("");
    try {
      await apiFetch("/election/end", { method: "POST", headers: { Authorization: `Bearer ${adminToken}` } });
      await refreshStatus();
      await loadResults();
      setScreen("results");
    } catch (err) {
      setAdminError(err.message);
    } finally {
      setAdminBusy(false);
    }
  }

  function adminLogout() {
    localStorage.removeItem("adminToken");
    setAdminToken(null);
    setScreen("voter");
  }

  const votedCount = voters.filter((v) => v.hasVoted).length;
  const turnoutPct = voters.length ? Math.round((votedCount / voters.length) * 100) : 0;

  if (loading) {
    return (
      <Chrome kioskCorner={<span />}>
        <div className="card center-col">
          <div className="loading-txt">Connecting to server…</div>
        </div>
      </Chrome>
    );
  }

  // ---------- VOTER: identification ----------
  if (screen === "voter") {
    return (
      <Chrome kioskCorner={<button className="corner-link" onClick={() => setScreen("adminLogin")}>Admin</button>}>
        <div className="card">
          <div className="eyebrow"><ShieldCheck size={13} /> Voter Check-in</div>
          <h1 className="title">Apni pehchaan confirm karein</h1>
          <p className="sub">Registration number aur naam daalo jaisa list mein register hai. Ek voter, ek vote.</p>

          <span className={"status-badge " + (election.status === "ongoing" ? "status-ongoing" : election.status === "ended" ? "status-ended" : "status-not")}>
            {election.status === "ongoing" ? "Voting live hai" : election.status === "ended" ? "Voting khatam" : "Shuru hone wali hai"}
          </span>

          {formError && <div className="error-strip"><X size={15} style={{ flexShrink: 0, marginTop: 1 }} />{formError}</div>}

          <form onSubmit={handleVerify}>
            <label className="field-label">Registration Number</label>
            <input className="field" placeholder="e.g. CS2101" value={regNo} onChange={(e) => setRegNo(e.target.value)} />
            <label className="field-label">Full Name</label>
            <input className="field" placeholder="Jaisa list mein hai" value={name} onChange={(e) => setName(e.target.value)} />
            <button className="btn-primary" type="submit"><Vote size={16} /> Continue to Vote</button>
          </form>
        </div>
      </Chrome>
    );
  }

  // ---------- VOTER: booth ----------
  if (screen === "booth" && votingToken) {
    return (
      <Chrome kioskCorner={<span />}>
        <div className="card">
          <div className="eyebrow"><Vote size={13} /> Voting Booth</div>
          <h1 className="title">Apna vote daalein</h1>
          <p className="sub">Namaste, {voterName}. Ek party chuno — result kisi ko dikhega nahi jab tak election khatam na ho.</p>
          <div className="party-grid">
            {parties.map((p, i) => (
              <div key={p._id} className="party-card" onClick={() => { setSelectedParty(p); setShowConfirm(true); }}>
                <div className="party-mark" style={{ background: PARTY_COLORS[i % PARTY_COLORS.length] }}>{initials(p.name)}</div>
                <div>
                  <div className="party-name">{p.name}</div>
                  <div className="party-sub">TAP TO SELECT</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {showConfirm && selectedParty && (
          <div className="modal-backdrop">
            <div className="modal-box">
              <div className="party-mark" style={{ background: PARTY_COLORS[parties.indexOf(selectedParty) % PARTY_COLORS.length], margin: "0 auto 14px" }}>
                {initials(selectedParty.name)}
              </div>
              <div style={{ fontFamily: "'Fraunces', serif", fontWeight: 700, fontSize: 19, color: "#1B2340" }}>
                Confirm your vote for {selectedParty.name}?
              </div>
              <div style={{ fontSize: 12.5, color: "#8A8272", marginTop: 6 }}>Ye final hai — badal nahi sakta.</div>
              <div className="modal-row">
                <button className="btn-cancel" onClick={() => { setShowConfirm(false); setSelectedParty(null); }} disabled={castingVote}>Cancel</button>
                <button className="btn-confirm" onClick={castVote} disabled={castingVote}>{castingVote ? "Saving…" : "Yes, Vote"}</button>
              </div>
            </div>
          </div>
        )}
      </Chrome>
    );
  }

  // ---------- VOTER: thank you ----------
  if (screen === "thanks") {
    return (
      <Chrome kioskCorner={<span />}>
        <div className="card center-col">
          <div className="stamp-in"><Seal label="VOTE RECORDED" size={120} /></div>
          <div className="thanks-msg">Vote ke liye shukriya!</div>
          <div className="thanks-sub">Screen 3 second mein reset ho rahi hai agle voter ke liye…</div>
        </div>
      </Chrome>
    );
  }

  // ---------- ADMIN: login ----------
  if (screen === "adminLogin") {
    return (
      <Chrome kioskCorner={<button className="corner-link" onClick={() => setScreen("voter")}>Kiosk</button>}>
        <div className="card">
          <div className="eyebrow"><Lock size={13} /> Admin Access</div>
          <h1 className="title">Election Control Room</h1>
          <p className="sub">Election setup, start/end aur results release yahan se hoga.</p>
          {loginError && <div className="error-strip"><X size={15} style={{ flexShrink: 0, marginTop: 1 }} />{loginError}</div>}
          <form onSubmit={handleAdminLogin}>
            <label className="field-label">Username</label>
            <input className="field" value={adminU} onChange={(e) => setAdminU(e.target.value)} placeholder="admin" />
            <label className="field-label">Password</label>
            <input className="field" type="password" value={adminP} onChange={(e) => setAdminP(e.target.value)} placeholder="••••••••" />
            <button className="btn-primary" type="submit"><Lock size={15} /> Log In</button>
          </form>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: "#8A8272", marginTop: 14, textAlign: "center" }}>
            Pehli baar? POST /api/admin/register se ek admin bana lo (README mein steps hain).
          </div>
        </div>
      </Chrome>
    );
  }

  // ---------- ADMIN: dashboard ----------
  if (screen === "admin") {
    return (
      <Chrome kioskCorner={<button className="corner-link" onClick={adminLogout}><LogOut size={12} style={{ marginRight: 5, verticalAlign: -2 }} />Log out</button>}>
        <div className="card" style={{ maxWidth: 560 }}>
          <div className="eyebrow"><Users size={13} /> Live Monitoring</div>
          <h1 className="title">Election Dashboard</h1>

          {adminError && <div className="error-strip"><X size={15} style={{ flexShrink: 0, marginTop: 1 }} />{adminError}</div>}

          <span className={"status-badge " + (election.status === "ongoing" ? "status-ongoing" : election.status === "ended" ? "status-ended" : "status-not")}>
            {election.status.replace("_", " ")}
          </span>

          <div className="field-label" style={{ marginTop: 4 }}>Turnout — {votedCount} / {voters.length} voted ({turnoutPct}%)</div>
          <div className="turnout-track"><div className="turnout-fill" style={{ width: turnoutPct + "%" }} /></div>

          {election.status === "not_started" && (
            <button className="btn-primary" onClick={startElection} disabled={adminBusy}><Vote size={16} /> {adminBusy ? "Starting…" : "Start Election"}</button>
          )}
          {election.status === "ongoing" && (
            <button className="btn-primary" onClick={endElection} disabled={adminBusy}><ShieldCheck size={16} /> {adminBusy ? "Ending…" : "End Election & Submit Final Results"}</button>
          )}
          {election.status === "ended" && (
            <button className="btn-primary" onClick={() => { loadResults(); setScreen("results"); }}><ArrowRight size={16} /> View Results</button>
          )}

          <div style={{ marginTop: 26 }}>
            <div className="field-label" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span>Registered Voters</span>
              <button className="corner-link" style={{ padding: "4px 9px" }} onClick={() => loadVoters()}>Refresh</button>
            </div>
            {voters.length === 0 && <div className="loading-txt">Koi voter list nahi mili — abhi loaded nahi hui.</div>}
            {voters.map((v) => (
              <div className="admin-row" key={v.regNo}>
                <div>
                  <div className="voter-name">{v.name}</div>
                  <div className="voter-reg">{v.regNo}</div>
                </div>
                <span className={"pill " + (v.hasVoted ? "pill-voted" : "pill-pending")}>{v.hasVoted ? "voted" : "pending"}</span>
              </div>
            ))}
          </div>
        </div>
      </Chrome>
    );
  }

  // ---------- RESULTS ----------
  if (screen === "results") {
    if (!results) {
      return (
        <Chrome kioskCorner={<span />}>
          <div className="card center-col">
            <div className="loading-txt">Results load ho rahe hain…</div>
          </div>
        </Chrome>
      );
    }
    const maxVotes = Math.max(...results.tally.map((p) => p.voteCount), 1);
    return (
      <Chrome kioskCorner={adminToken ? <button className="corner-link" onClick={() => setScreen("admin")}>Dashboard</button> : <span />}>
        <Confetti />
        <div className="card results-card">
          <div className="winner-block stamp-in">
            <Seal label={results.isTie ? "IT'S A TIE" : "OFFICIAL RESULT"} size={110} />
            {results.isTie ? (
              <>
                <div className="winner-name" style={{ fontSize: 26 }}>It's a tie!</div>
                <div className="winner-tag">Admin tiebreaker needed</div>
              </>
            ) : (
              <>
                <div className="winner-name">{results.winner?.name ?? "—"}</div>
                <div className="winner-tag">wins the union election</div>
              </>
            )}
          </div>

          <div className="field-label" style={{ marginBottom: 12 }}>Final Tally</div>
          {results.tally.map((p, i) => (
            <div className="tally-row" key={p.id}>
              <div className="tally-label">{p.name}</div>
              <div className="tally-track">
                <div className="tally-fill" style={{ width: (p.voteCount / maxVotes) * 100 + "%", background: PARTY_COLORS[i % PARTY_COLORS.length] }} />
              </div>
              <div className="tally-count">{p.voteCount}</div>
            </div>
          ))}
        </div>
      </Chrome>
    );
  }

  return null;
}
