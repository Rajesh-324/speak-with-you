"use client";

import AuthGuard from "@/components/ui/AuthGuard";
import { useAuth } from "@/contexts/AuthContext";
import { useState, useEffect } from "react";
import { getLeaderboard, getUserProgress, claimReferral, LeaderboardEntry } from "@/lib/firestore";
import Link from "next/link";

export default function LeaderboardPage() {
  return (
    <AuthGuard>
      <LeaderboardContent />
    </AuthGuard>
  );
}

function LeaderboardContent() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<"xp" | "streak">("xp");
  const [xpRankings, setXpRankings] = useState<LeaderboardEntry[]>([]);
  const [streakRankings, setStreakRankings] = useState<LeaderboardEntry[]>([]);
  const [progress, setProgress] = useState<any>(null);
  
  // Referral input
  const [refCode, setRefCode] = useState("");
  const [claiming, setClaiming] = useState(false);
  const [claimingStatus, setClaimingStatus] = useState<{ success?: boolean; msg?: string } | null>(null);

  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      const { xpLeaderboard, streakLeaderboard } = await getLeaderboard();
      setXpRankings(xpLeaderboard);
      setStreakRankings(streakLeaderboard);

      if (user) {
        const p = await getUserProgress(user.uid);
        setProgress(p);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [user]);

  const handleClaimCode = async () => {
    if (!user || !refCode.trim() || claiming) return;
    setClaiming(true);
    setClaimingStatus(null);

    try {
      const result = await claimReferral(user.uid, refCode.trim());
      if (result.success) {
        setClaimingStatus({ success: true, msg: "Congratulations! +250 XP reward claimed successfully!" });
        setRefCode("");
        // Reload data to reflect new XP
        await loadData();
      } else {
        setClaimingStatus({ success: false, msg: result.error || "Failed to claim code." });
      }
    } catch (err) {
      console.error(err);
      setClaimingStatus({ success: false, msg: "Server error occurred. Please try again." });
    } finally {
      setClaiming(false);
    }
  };

  const currentList = activeTab === "xp" ? xpRankings : streakRankings;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950/20 to-slate-950 text-white py-12 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Back navigation */}
        <div>
          <Link href="/dashboard" className="text-xs text-indigo-400 hover:text-indigo-300">
            ← Back to Dashboard
          </Link>
          <h1 className="text-xl font-bold flex items-center gap-2 mt-1">
            <span>🏆</span> Global Leaderboard & Referrals
          </h1>
        </div>

        {loading ? (
          <div className="glass-card p-12 text-center space-y-3">
            <div className="w-8 h-8 border-4 border-indigo-400 border-t-indigo-600 rounded-full animate-spin mx-auto" />
            <p className="text-xs text-slate-500">Compiling user database...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Leaderboard Rankings (2 Cols) */}
            <div className="lg:col-span-2 space-y-4">
              <div className="glass-card p-5 border border-white/5 space-y-4">
                
                {/* Tab Selectors */}
                <div className="flex border-b border-white/5 pb-2">
                  <button
                    onClick={() => setActiveTab("xp")}
                    className={`flex-1 pb-2 text-xs font-bold uppercase tracking-wider transition-colors border-b-2 ${
                      activeTab === "xp" ? "text-indigo-400 border-indigo-500" : "text-slate-500 border-transparent hover:text-slate-300"
                    }`}
                  >
                    ⚡ Top Learners (XP)
                  </button>
                  <button
                    onClick={() => setActiveTab("streak")}
                    className={`flex-1 pb-2 text-xs font-bold uppercase tracking-wider transition-colors border-b-2 ${
                      activeTab === "streak" ? "text-purple-400 border-purple-500" : "text-slate-500 border-transparent hover:text-slate-300"
                    }`}
                  >
                    🔥 Streak Kings (Days)
                  </button>
                </div>

                {/* List */}
                <div className="space-y-2.5 max-h-[500px] overflow-y-auto custom-scrollbar pr-1">
                  {currentList.map((entry, index) => {
                    const isCurrentUser = entry.uid === user?.uid;
                    const rankMedal = index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : `${index + 1}`;
                    return (
                      <div
                        key={entry.uid}
                        className={`flex items-center justify-between p-3.5 rounded-xl border transition-all ${
                          isCurrentUser
                            ? "bg-indigo-500/10 border-indigo-500/30 shadow-inner"
                            : "bg-slate-900/40 border-white/5"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className={`w-6 text-center font-bold text-sm ${index < 3 ? "text-lg" : "text-slate-500"}`}>{rankMedal}</span>
                          {entry.photoURL ? (
                            <img
                              src={entry.photoURL}
                              alt=""
                              className="w-8 h-8 rounded-full border border-white/10 shrink-0"
                              referrerPolicy="no-referrer"
                            />
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center font-bold text-xs shrink-0">
                              {entry.displayName.charAt(0).toUpperCase()}
                            </div>
                          )}
                          <div>
                            <span className="text-sm font-bold block leading-tight">{entry.displayName}</span>
                            {isCurrentUser && <span className="text-[9px] text-indigo-400 font-bold uppercase">You</span>}
                          </div>
                        </div>

                        <div className="text-right">
                          <span className="font-bold text-sm block">
                            {activeTab === "xp" ? `${entry.xp} XP` : `${entry.streak} Days`}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>

              </div>
            </div>

            {/* Referrals & Invites (1 Col) */}
            <div className="space-y-4">
              <div className="glass-card p-6 border border-white/5 space-y-6">
                
                {/* Refer code section */}
                <div className="space-y-2">
                  <h3 className="text-xs font-bold text-indigo-400 uppercase tracking-wider">🔗 Share Referral Code</h3>
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    Invite your friends to learn English! Share your unique referral code below. You both earn +250 XP on sign up!
                  </p>
                  
                  <div className="flex items-center gap-2 mt-2 bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 justify-between font-mono font-bold text-sm tracking-wider">
                    <span>{progress?.referralCode || "SPEAK-XXXXXX"}</span>
                    <button
                      onClick={() => {
                        if (progress?.referralCode) {
                          navigator.clipboard.writeText(progress.referralCode);
                          alert("Referral code copied to clipboard!");
                        }
                      }}
                      className="text-xs text-indigo-400 hover:text-indigo-300 font-bold font-sans"
                    >
                      Copy
                    </button>
                  </div>
                </div>

                {/* Redeem Referral code */}
                <div className="space-y-2 border-t border-white/5 pt-5">
                  <h3 className="text-xs font-bold text-purple-400 uppercase tracking-wider">🎁 Enter Friend's Code</h3>
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    Were you referred by a classmate or friend? Paste their code below to instantly earn +250 XP bonus.
                  </p>

                  <div className="flex gap-2 mt-2">
                    <input
                      type="text"
                      value={refCode}
                      onChange={(e) => setRefCode(e.target.value)}
                      placeholder="E.g. SPEAK-A8D2F3"
                      disabled={progress?.referredBy || claiming}
                      className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500 disabled:opacity-50"
                    />
                    <button
                      onClick={handleClaimCode}
                      disabled={!refCode.trim() || progress?.referredBy || claiming}
                      className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-xs font-bold rounded-xl shadow-md transition-all active:scale-[0.98] disabled:opacity-50"
                    >
                      Claim
                    </button>
                  </div>

                  {progress?.referredBy && (
                    <div className="text-[10px] text-emerald-400 font-bold bg-emerald-500/5 p-2 rounded border border-emerald-500/10 text-center mt-2">
                      ✔ Referral code claimed successfully!
                    </div>
                  )}

                  {claimingStatus && (
                    <div className={`text-[10px] p-2 rounded border mt-2 text-center font-bold ${
                      claimingStatus.success ? "text-emerald-400 bg-emerald-500/5 border-emerald-500/10" : "text-rose-400 bg-rose-500/5 border-rose-500/10"
                    }`}>
                      {claimingStatus.msg}
                    </div>
                  )}
                </div>

              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
