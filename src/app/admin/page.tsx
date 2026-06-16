"use client";

import AuthGuard from "@/components/ui/AuthGuard";
import { useAuth } from "@/contexts/AuthContext";
import { useState, useEffect } from "react";
import { getAdminStats } from "@/lib/firestore";
import Link from "next/link";

export default function AdminPage() {
  return (
    <AuthGuard>
      <AdminContent />
    </AuthGuard>
  );
}

function AdminContent() {
  const { user } = useAuth();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const isAdmin = user?.email === "gunagantirajesh7@gmail.com";

  useEffect(() => {
    if (!isAdmin) return;
    const fetchStats = async () => {
      try {
        const data = await getAdminStats();
        setStats(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [user, isAdmin]);

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white">
        <div className="text-center space-y-4">
          <span className="text-5xl">🛑</span>
          <h1 className="text-xl font-bold">Access Denied</h1>
          <p className="text-xs text-slate-500 max-w-xs mx-auto">
            You do not have administrative privileges to view platform statistics.
          </p>
          <Link href="/dashboard" className="text-xs text-indigo-400 hover:underline inline-block mt-2">
            ← Return to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950/20 to-slate-950 text-white py-12 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Back navigation */}
        <div>
          <Link href="/dashboard" className="text-xs text-indigo-400 hover:text-indigo-300">
            ← Back to Dashboard
          </Link>
          <h1 className="text-xl font-bold flex items-center gap-2 mt-1">
            <span>⚙️</span> Platform Admin Console
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">Aggregate usage telemetry compiled from Firestore records.</p>
        </div>

        {loading ? (
          <div className="glass-card p-12 text-center space-y-3">
            <div className="w-8 h-8 border-4 border-indigo-400 border-t-indigo-600 rounded-full animate-spin mx-auto" />
            <p className="text-xs text-slate-500">Aggregating collections metrics...</p>
          </div>
        ) : stats ? (
          <div className="space-y-6">
            
            {/* Grid Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <div className="glass-card p-5 border border-white/5 space-y-1">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest block">Total Registered Users</span>
                <span className="text-2xl font-black">{stats.totalUsers}</span>
              </div>
              <div className="glass-card p-5 border border-white/5 space-y-1">
                <span className="text-[10px] text-indigo-400 font-bold uppercase tracking-widest block">Active Users (7 Days)</span>
                <span className="text-2xl font-black text-indigo-300">{stats.activeUsers}</span>
              </div>
              <div className="glass-card p-5 border border-white/5 space-y-1">
                <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest block">Lesson Days Completed</span>
                <span className="text-2xl font-black text-emerald-300">{stats.totalLessonsCompleted}</span>
              </div>
              <div className="glass-card p-5 border border-white/5 space-y-1">
                <span className="text-[10px] text-rose-400 font-bold uppercase tracking-widest block">Total Mock Interviews</span>
                <span className="text-2xl font-black text-rose-300">{stats.totalInterviews}</span>
              </div>
            </div>

            {/* Platform Health and Info */}
            <div className="glass-card p-6 border border-white/5 space-y-3">
              <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">🛠️ Platform Management</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                All platform modules are fully operational. Firestore collections metrics reflect live users authentication mappings, Streaks progressions, and Gemini conversational evaluation records.
              </p>
              <div className="pt-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-300 text-[10px] font-bold uppercase tracking-wider">
                  🟢 System Status: Active & Hardened
                </span>
              </div>
            </div>

          </div>
        ) : (
          <div className="glass-card p-8 text-center text-slate-500 text-xs">
            Failed to compile platform statistics.
          </div>
        )}

      </div>
    </div>
  );
}
