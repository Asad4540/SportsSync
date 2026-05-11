import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { registrationAPI, tournamentAPI, announcementAPI } from '../../services/api';
import { HiOutlineTrophy, HiOutlineClipboardDocumentList, HiOutlineCheckCircle, HiOutlineClock, HiOutlineXCircle, HiArrowRight, HiOutlineMegaphone } from 'react-icons/hi2';
import StatusBadge from '../../components/common/StatusBadge';
import LoadingSpinner from '../../components/common/LoadingSpinner';

/**
 * User Dashboard - Overview of registrations and quick actions
 */
const Dashboard = () => {
  const { user } = useAuth();
  const [registrations, setRegistrations] = useState([]);
  const [tournaments, setTournaments] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [regRes, tourRes, annRes] = await Promise.all([
          registrationAPI.getMy(),
          tournamentAPI.getAll({ status: 'upcoming' }),
          announcementAPI.getAll(),
        ]);
        setRegistrations(regRes.data);
        setTournaments(tourRes.data.slice(0, 3));
        setAnnouncements(annRes.data.slice(0, 2));
      } catch (error) {
        console.error('Dashboard fetch error:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <LoadingSpinner message="Loading dashboard..." />;

  const stats = {
    total: registrations.length,
    approved: registrations.filter(r => r.status === 'approved').length,
    pending: registrations.filter(r => r.status === 'pending').length,
    rejected: registrations.filter(r => r.status === 'rejected').length,
  };

  const formatDate = (date) => new Date(date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });

  return (
    <div className="animate-fade-in">
      {/* Welcome */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-white">
          Welcome back, <span className="text-primary-400">{user?.username}</span>! 👋
        </h1>
        <p className="text-dark-400 mt-1">Here's an overview of your tournament activities</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Registrations', value: stats.total, icon: HiOutlineClipboardDocumentList, color: 'primary' },
          { label: 'Approved', value: stats.approved, icon: HiOutlineCheckCircle, color: 'success' },
          { label: 'Pending', value: stats.pending, icon: HiOutlineClock, color: 'accent' },
          { label: 'Rejected', value: stats.rejected, icon: HiOutlineXCircle, color: 'red' },
        ].map((stat) => (
          <div key={stat.label} className="bg-dark-800/50 border border-dark-700/50 rounded-xl p-5 hover:border-dark-600 transition-colors">
            <div className="flex items-center justify-between mb-3">
              <stat.icon className={`w-8 h-8 ${
                stat.color === 'primary' ? 'text-primary-400' :
                stat.color === 'success' ? 'text-emerald-400' :
                stat.color === 'accent' ? 'text-amber-400' :
                'text-red-400'
              }`} />
            </div>
            <p className="text-2xl font-bold text-white">{stat.value}</p>
            <p className="text-xs text-dark-500 mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Registrations */}
        <div className="lg:col-span-2">
          <div className="bg-dark-800/50 border border-dark-700/50 rounded-xl overflow-hidden">
            <div className="flex items-center justify-between p-5 border-b border-dark-700">
              <h2 className="text-lg font-semibold text-white">Recent Registrations</h2>
              <Link to="/my-registrations" className="text-sm text-primary-400 hover:text-primary-300 flex items-center gap-1">
                View All <HiArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            
            {registrations.length === 0 ? (
              <div className="p-8 text-center">
                <HiOutlineClipboardDocumentList className="w-12 h-12 text-dark-600 mx-auto" />
                <p className="text-dark-400 mt-3">No registrations yet</p>
                <Link to="/sports" className="text-primary-400 text-sm mt-2 inline-block hover:underline">
                  Browse tournaments →
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-dark-700">
                {registrations.slice(0, 5).map((reg) => (
                  <div key={reg._id} className="p-4 flex items-center justify-between hover:bg-dark-700/30 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary-500/10 rounded-lg flex items-center justify-center">
                        <HiOutlineTrophy className="w-5 h-5 text-primary-400" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white">{reg.teamName}</p>
                        <p className="text-xs text-dark-500">{reg.tournament?.sport} • {formatDate(reg.createdAt)}</p>
                      </div>
                    </div>
                    <StatusBadge status={reg.status} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar: Quick Actions + Announcements */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="bg-dark-800/50 border border-dark-700/50 rounded-xl p-5">
            <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <Link to="/sports" className="flex items-center gap-3 p-3 bg-primary-500/10 border border-primary-500/20 rounded-lg hover:bg-primary-500/20 transition-colors">
                <HiOutlineTrophy className="w-5 h-5 text-primary-400" />
                <span className="text-sm font-medium text-primary-300">Browse Tournaments</span>
              </Link>
              <Link to="/my-registrations" className="flex items-center gap-3 p-3 bg-dark-700/50 border border-dark-700 rounded-lg hover:bg-dark-700 transition-colors">
                <HiOutlineClipboardDocumentList className="w-5 h-5 text-dark-400" />
                <span className="text-sm font-medium text-dark-300">My Registrations</span>
              </Link>
            </div>
          </div>

          {/* Announcements */}
          {announcements.length > 0 && (
            <div className="bg-dark-800/50 border border-dark-700/50 rounded-xl p-5">
              <div className="flex items-center gap-2 mb-4">
                <HiOutlineMegaphone className="w-5 h-5 text-accent-400" />
                <h3 className="text-lg font-semibold text-white">Notices</h3>
              </div>
              <div className="space-y-3">
                {announcements.map((ann) => (
                  <div key={ann._id} className="p-3 bg-dark-700/30 rounded-lg border border-dark-700/50">
                    <p className="text-sm font-medium text-white">{ann.title}</p>
                    <p className="text-xs text-dark-500 mt-1 line-clamp-2">{ann.content}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
