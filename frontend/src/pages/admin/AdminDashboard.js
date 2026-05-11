import React, { useState, useEffect } from 'react';
import { tournamentAPI, registrationAPI, announcementAPI, authAPI } from '../../services/api';
import { HiOutlineTrophy, HiOutlineClipboardDocumentList, HiOutlineUsers, HiOutlineMegaphone, HiOutlineCheckCircle, HiOutlineClock } from 'react-icons/hi2';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const AdminDashboard = () => {
  const [stats, setStats] = useState({ tournaments: 0, registrations: 0, users: 0, announcements: 0, pending: 0, approved: 0 });
  const [recentRegs, setRecentRegs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [tourRes, regRes, userRes, annRes] = await Promise.all([
          tournamentAPI.getAll(), registrationAPI.getAll(), authAPI.getAllUsers(), announcementAPI.getAll(),
        ]);
        setStats({
          tournaments: tourRes.data.length, registrations: regRes.data.length,
          users: userRes.data.length, announcements: annRes.data.length,
          pending: regRes.data.filter(r => r.status === 'pending').length,
          approved: regRes.data.filter(r => r.status === 'approved').length,
        });
        setRecentRegs(regRes.data.slice(0, 5));
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    };
    fetchStats();
  }, []);

  if (loading) return <LoadingSpinner message="Loading admin dashboard..." />;

  const statCards = [
    { label: 'Tournaments', value: stats.tournaments, icon: HiOutlineTrophy, color: 'primary', gradient: 'from-primary-600/20 to-primary-800/20' },
    { label: 'Registrations', value: stats.registrations, icon: HiOutlineClipboardDocumentList, color: 'success', gradient: 'from-emerald-600/20 to-emerald-800/20' },
    { label: 'Users', value: stats.users, icon: HiOutlineUsers, color: 'accent', gradient: 'from-amber-600/20 to-amber-800/20' },
    { label: 'Announcements', value: stats.announcements, icon: HiOutlineMegaphone, color: 'purple', gradient: 'from-purple-600/20 to-purple-800/20' },
    { label: 'Pending', value: stats.pending, icon: HiOutlineClock, color: 'amber', gradient: 'from-orange-600/20 to-orange-800/20' },
    { label: 'Approved', value: stats.approved, icon: HiOutlineCheckCircle, color: 'green', gradient: 'from-green-600/20 to-green-800/20' },
  ];

  const colorMap = { primary: 'text-primary-400', success: 'text-emerald-400', accent: 'text-amber-400', purple: 'text-purple-400', amber: 'text-orange-400', green: 'text-green-400' };

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
        <p className="text-dark-400 mt-1">Overview of the tournament management system</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {statCards.map(s => (
          <div key={s.label} className={`bg-gradient-to-br ${s.gradient} border border-dark-700/50 rounded-xl p-5`}>
            <s.icon className={`w-8 h-8 ${colorMap[s.color]} mb-3`} />
            <p className="text-3xl font-bold text-white">{s.value}</p>
            <p className="text-sm text-dark-400 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="bg-dark-800/50 border border-dark-700/50 rounded-xl overflow-hidden">
        <div className="p-5 border-b border-dark-700">
          <h2 className="text-lg font-semibold text-white">Recent Registrations</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead><tr className="text-left text-xs text-dark-500 uppercase border-b border-dark-700">
              <th className="p-4">Team</th><th className="p-4">Sport</th><th className="p-4">Captain</th><th className="p-4">College</th><th className="p-4">Status</th>
            </tr></thead>
            <tbody className="divide-y divide-dark-700/50">
              {recentRegs.map(r => (
                <tr key={r._id} className="hover:bg-dark-700/30">
                  <td className="p-4 text-sm font-medium text-white">{r.teamName}</td>
                  <td className="p-4 text-sm text-dark-400">{r.tournament?.sport}</td>
                  <td className="p-4 text-sm text-dark-400">{r.captainName}</td>
                  <td className="p-4 text-sm text-dark-400">{r.collegeName}</td>
                  <td className="p-4"><span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${r.status === 'approved' ? 'bg-emerald-500/20 text-emerald-400' : r.status === 'rejected' ? 'bg-red-500/20 text-red-400' : 'bg-amber-500/20 text-amber-400'}`}>{r.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
