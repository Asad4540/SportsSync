import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { tournamentAPI, announcementAPI } from '../../services/api';
import { HiOutlineTrophy, HiOutlineUsers, HiOutlineMapPin, HiOutlineCalendar, HiOutlineMegaphone, HiArrowRight } from 'react-icons/hi2';

/**
 * Home Page - Public landing page with hero, featured tournaments, announcements
 */
const Home = () => {
  const [tournaments, setTournaments] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [tourRes, annRes] = await Promise.all([
          tournamentAPI.getAll({ status: 'upcoming' }),
          announcementAPI.getAll(),
        ]);
        setTournaments(tourRes.data.slice(0, 6));
        setAnnouncements(annRes.data.slice(0, 3));
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const sportIcons = {
    'Cricket': '🏏',
    'Football': '⚽',
    'Volleyball': '🏐',
    'Badminton': '🏸',
    'Chess': '♟️',
  };

  const formatDate = (date) => new Date(date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

  return (
    <div className="min-h-screen bg-dark-900">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-600/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent-500/10 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary-500/5 rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-6 py-24 md:py-32 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary-500/10 border border-primary-500/20 rounded-full mb-6 animate-fade-in">
            <span className="w-2 h-2 bg-primary-400 rounded-full animate-pulse"></span>
            <span className="text-sm text-primary-300 font-medium">Registrations Now Open</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 animate-slide-up">
            Inter-College{' '}
            <span className="bg-gradient-to-r from-primary-400 via-accent-400 to-success-400 bg-clip-text text-transparent">
              Sports Tournament
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-dark-400 max-w-2xl mx-auto mb-10 animate-slide-up" style={{ animationDelay: '0.1s' }}>
            Register your team for Cricket, Football, Volleyball, Badminton, and Chess tournaments. Compete against the best college teams.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <Link
              to="/sports"
              className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-500 hover:to-primary-400 text-white font-semibold rounded-xl shadow-lg shadow-primary-500/25 hover:shadow-primary-500/40 transition-all"
            >
              Browse Tournaments
              <HiArrowRight className="w-5 h-5" />
            </Link>
            <Link
              to="/register"
              className="inline-flex items-center justify-center px-8 py-3 bg-dark-800 hover:bg-dark-700 text-dark-200 font-semibold rounded-xl border border-dark-700 transition-all"
            >
              Create Account
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16 max-w-3xl mx-auto">
            {[
              { value: '5+', label: 'Sports', icon: '🏆' },
              { value: '100+', label: 'Teams', icon: '👥' },
              { value: '500+', label: 'Athletes', icon: '🏃' },
              { value: '15+', label: 'Colleges', icon: '🎓' },
            ].map((stat) => (
              <div key={stat.label} className="bg-dark-800/50 backdrop-blur-sm border border-dark-700/50 rounded-xl p-4 hover:border-primary-500/30 transition-colors">
                <span className="text-2xl">{stat.icon}</span>
                <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
                <p className="text-xs text-dark-500">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Tournaments */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-white">Upcoming Tournaments</h2>
            <p className="text-dark-400 mt-1">Register before the deadline</p>
          </div>
          <Link to="/sports" className="text-primary-400 hover:text-primary-300 text-sm font-medium flex items-center gap-1">
            View All <HiArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1,2,3].map(i => (
              <div key={i} className="bg-dark-800 rounded-xl h-72 animate-pulse"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tournaments.map((tournament) => (
              <Link
                key={tournament._id}
                to={`/tournaments/${tournament._id}`}
                className="group bg-dark-800/50 border border-dark-700/50 rounded-xl overflow-hidden hover:border-primary-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-primary-500/5"
              >
                {/* Card Header */}
                <div className="bg-gradient-to-br from-primary-600/20 to-primary-800/20 p-6 relative">
                  <span className="text-4xl">{sportIcons[tournament.sport] || '🏆'}</span>
                  <div className="absolute top-4 right-4">
                    <span className="px-2.5 py-1 bg-primary-500/20 text-primary-300 text-xs font-semibold rounded-full border border-primary-500/30">
                      {tournament.status}
                    </span>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-5">
                  <h3 className="text-lg font-bold text-white group-hover:text-primary-300 transition-colors">
                    {tournament.sport} Tournament
                  </h3>
                  <p className="text-sm text-dark-400 mt-1 line-clamp-2">{tournament.description}</p>

                  <div className="mt-4 space-y-2">
                    <div className="flex items-center gap-2 text-sm text-dark-400">
                      <HiOutlineCalendar className="w-4 h-4 text-dark-500" />
                      {formatDate(tournament.tournamentDate)}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-dark-400">
                      <HiOutlineMapPin className="w-4 h-4 text-dark-500" />
                      {tournament.venue}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-dark-400">
                      <HiOutlineUsers className="w-4 h-4 text-dark-500" />
                      {tournament.currentParticipants}/{tournament.maxParticipants} teams
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-5 pt-4 border-t border-dark-700">
                    <span className="text-xl font-bold text-white">₹{tournament.registrationFees}</span>
                    <span className="text-sm text-primary-400 font-medium group-hover:translate-x-1 transition-transform flex items-center gap-1">
                      View Details <HiArrowRight className="w-4 h-4" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Announcements */}
      {announcements.length > 0 && (
        <section className="max-w-7xl mx-auto px-6 py-16">
          <div className="flex items-center gap-2 mb-8">
            <HiOutlineMegaphone className="w-6 h-6 text-accent-400" />
            <h2 className="text-2xl font-bold text-white">Latest Announcements</h2>
          </div>
          <div className="space-y-4">
            {announcements.map((announcement) => (
              <div
                key={announcement._id}
                className={`bg-dark-800/50 border rounded-xl p-5 ${
                  announcement.priority === 'high'
                    ? 'border-red-500/30 bg-red-500/5'
                    : announcement.priority === 'medium'
                    ? 'border-amber-500/30 bg-amber-500/5'
                    : 'border-dark-700/50'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-white">{announcement.title}</h3>
                      {announcement.priority === 'high' && (
                        <span className="px-1.5 py-0.5 bg-red-500/20 text-red-400 text-xs font-medium rounded">Important</span>
                      )}
                    </div>
                    <p className="text-sm text-dark-400">{announcement.content}</p>
                  </div>
                  <span className="text-xs text-dark-500 whitespace-nowrap ml-4">
                    {formatDate(announcement.createdAt)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="border-t border-dark-800 mt-16">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg flex items-center justify-center font-bold text-white text-xs">
                SS
              </div>
              <span className="text-sm font-semibold text-white">SportSync</span>
            </div>
            <p className="text-sm text-dark-500">
              © 2026 SportSync Tournament Portal. All rights reserved.
            </p>
            <div className="flex gap-4">
              <Link to="/sports" className="text-sm text-dark-400 hover:text-white">Tournaments</Link>
              <Link to="/login" className="text-sm text-dark-400 hover:text-white">Login</Link>
              <Link to="/register" className="text-sm text-dark-400 hover:text-white">Register</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
