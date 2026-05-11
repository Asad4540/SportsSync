import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { tournamentAPI } from '../../services/api';
import { HiOutlineCalendar, HiOutlineMapPin, HiOutlineUsers, HiOutlineCurrencyRupee, HiArrowRight } from 'react-icons/hi2';
import StatusBadge from '../../components/common/StatusBadge';
import LoadingSpinner from '../../components/common/LoadingSpinner';

/**
 * Sports Page - Grid display of all available tournaments
 */
const Sports = () => {
  const [tournaments, setTournaments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const fetchTournaments = async () => {
      try {
        const params = filter !== 'all' ? { status: filter } : {};
        const response = await tournamentAPI.getAll(params);
        setTournaments(response.data);
      } catch (error) {
        console.error('Error fetching tournaments:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchTournaments();
  }, [filter]);

  const sportIcons = {
    'Cricket': '🏏', 'Football': '⚽', 'Volleyball': '🏐',
    'Badminton': '🏸', 'Chess': '♟️',
  };

  const sportColors = {
    'Cricket': 'from-green-600/20 to-green-800/20',
    'Football': 'from-blue-600/20 to-blue-800/20',
    'Volleyball': 'from-orange-600/20 to-orange-800/20',
    'Badminton': 'from-purple-600/20 to-purple-800/20',
    'Chess': 'from-gray-600/20 to-gray-800/20',
  };

  const formatDate = (date) => new Date(date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

  if (loading) return <LoadingSpinner message="Loading tournaments..." />;

  return (
    <div className="animate-fade-in">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Sports & Tournaments</h1>
        <p className="text-dark-400 mt-2">Browse all available tournaments and register your team</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-8">
        {['all', 'upcoming', 'ongoing', 'completed'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all capitalize ${
              filter === f
                ? 'bg-primary-500/20 text-primary-300 border border-primary-500/30'
                : 'bg-dark-800 text-dark-400 border border-dark-700 hover:border-dark-600 hover:text-dark-300'
            }`}
          >
            {f === 'all' ? 'All Sports' : f}
          </button>
        ))}
      </div>

      {/* Tournaments Grid */}
      {tournaments.length === 0 ? (
        <div className="text-center py-16 bg-dark-800/50 rounded-xl border border-dark-700">
          <span className="text-4xl">🏆</span>
          <h3 className="text-lg font-semibold text-white mt-4">No Tournaments Found</h3>
          <p className="text-dark-400 mt-1">Check back later for new tournaments</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {tournaments.map((tournament) => (
            <Link
              key={tournament._id}
              to={`/tournaments/${tournament._id}`}
              className="group bg-dark-800/50 border border-dark-700/50 rounded-xl overflow-hidden hover:border-primary-500/30 transition-all duration-300 hover:shadow-xl hover:shadow-primary-500/5 hover:-translate-y-1"
            >
              {/* Sport Banner */}
              <div className={`bg-gradient-to-br ${sportColors[tournament.sport] || 'from-primary-600/20 to-primary-800/20'} p-6 relative`}>
                <div className="flex items-center justify-between">
                  <span className="text-5xl">{sportIcons[tournament.sport] || '🏆'}</span>
                  <StatusBadge status={tournament.status} />
                </div>
              </div>

              {/* Card Content */}
              <div className="p-5">
                <h3 className="text-xl font-bold text-white group-hover:text-primary-300 transition-colors">
                  {tournament.sport}
                </h3>
                <p className="text-sm text-dark-400 mt-2 line-clamp-2">{tournament.description}</p>

                <div className="grid grid-cols-2 gap-3 mt-5">
                  <div className="flex items-center gap-2 text-sm text-dark-400">
                    <HiOutlineCalendar className="w-4 h-4 text-primary-500" />
                    {formatDate(tournament.tournamentDate)}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-dark-400">
                    <HiOutlineMapPin className="w-4 h-4 text-success-500" />
                    {tournament.venue}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-dark-400">
                    <HiOutlineUsers className="w-4 h-4 text-accent-500" />
                    Team of {tournament.teamSize}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-dark-400">
                    <HiOutlineCurrencyRupee className="w-4 h-4 text-amber-400" />
                    ₹{tournament.registrationFees}
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mt-5">
                  <div className="flex justify-between text-xs text-dark-500 mb-1">
                    <span>Slots</span>
                    <span>{tournament.currentParticipants}/{tournament.maxParticipants}</span>
                  </div>
                  <div className="w-full bg-dark-700 rounded-full h-1.5">
                    <div
                      className="bg-gradient-to-r from-primary-500 to-success-500 h-1.5 rounded-full transition-all"
                      style={{ width: `${Math.min((tournament.currentParticipants / tournament.maxParticipants) * 100, 100)}%` }}
                    ></div>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-5 pt-4 border-t border-dark-700/50">
                  <span className="text-sm text-dark-500">Deadline: {formatDate(tournament.registrationDeadline)}</span>
                  <span className="text-sm text-primary-400 font-medium flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    Details <HiArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Sports;
