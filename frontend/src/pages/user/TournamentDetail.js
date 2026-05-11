import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { tournamentAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { HiOutlineCalendar, HiOutlineMapPin, HiOutlineUsers, HiOutlineCurrencyRupee, HiOutlineClock, HiOutlineDocumentText, HiArrowLeft } from 'react-icons/hi2';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import StatusBadge from '../../components/common/StatusBadge';
import LoadingSpinner from '../../components/common/LoadingSpinner';

// Fix Leaflet default icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

const TournamentDetail = () => {
  const { id } = useParams();
  const { isAuthenticated } = useAuth();
  const [tournament, setTournament] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    tournamentAPI.getById(id).then(res => setTournament(res.data))
      .catch(e => console.error(e)).finally(() => setLoading(false));
  }, [id]);

  if (loading) return <LoadingSpinner message="Loading tournament..." />;
  if (!tournament) return (
    <div className="text-center py-16">
      <h2 className="text-xl font-bold text-white">Tournament not found</h2>
      <Link to="/sports" className="text-primary-400 mt-2 inline-block">← Back to Sports</Link>
    </div>
  );

  const formatDate = (d) => new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
  const isDeadlinePassed = new Date() > new Date(tournament.registrationDeadline);
  const isFull = tournament.currentParticipants >= tournament.maxParticipants;
  const sportIcons = { 'Cricket': '🏏', 'Football': '⚽', 'Volleyball': '🏐', 'Badminton': '🏸', 'Chess': '♟️' };

  const details = [
    { icon: HiOutlineCalendar, label: 'Tournament Date', value: formatDate(tournament.tournamentDate), color: 'text-primary-400' },
    { icon: HiOutlineClock, label: 'Deadline', value: formatDate(tournament.registrationDeadline), color: isDeadlinePassed ? 'text-red-400' : 'text-amber-400' },
    { icon: HiOutlineUsers, label: 'Team Size', value: `${tournament.teamSize} players`, color: 'text-success-400' },
    { icon: HiOutlineCurrencyRupee, label: 'Fees', value: `₹${tournament.registrationFees}`, color: 'text-accent-400' },
    { icon: HiOutlineMapPin, label: 'Venue', value: tournament.venue, color: 'text-blue-400' },
    { icon: HiOutlineUsers, label: 'Slots', value: `${tournament.currentParticipants}/${tournament.maxParticipants}`, color: 'text-purple-400' },
  ];

  return (
    <div className="animate-fade-in max-w-5xl mx-auto">
      <Link to="/sports" className="inline-flex items-center gap-1.5 text-sm text-dark-400 hover:text-white mb-6">
        <HiArrowLeft className="w-4 h-4" /> Back to Sports
      </Link>

      {/* Header */}
      <div className="bg-dark-800/50 border border-dark-700/50 rounded-xl overflow-hidden mb-6">
        <div className="bg-gradient-to-r from-primary-600/20 via-primary-700/10 to-dark-800 p-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <span className="text-5xl">{sportIcons[tournament.sport] || '🏆'}</span>
              <div>
                <h1 className="text-3xl font-bold text-white">{tournament.sport} Tournament</h1>
                <p className="text-dark-400 mt-1">{tournament.description}</p>
              </div>
            </div>
            <StatusBadge status={tournament.status} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Details Grid */}
          <div className="bg-dark-800/50 border border-dark-700/50 rounded-xl p-6">
            <h2 className="text-xl font-bold text-white mb-4">Tournament Details</h2>
            <div className="grid grid-cols-2 gap-4">
              {details.map((item, idx) => (
                <div key={idx} className="flex items-start gap-3 p-3 bg-dark-700/30 rounded-lg">
                  <item.icon className={`w-5 h-5 mt-0.5 ${item.color}`} />
                  <div>
                    <p className="text-xs text-dark-500">{item.label}</p>
                    <p className="text-sm font-medium text-white mt-0.5">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Rules */}
          {tournament.rules && (
            <div className="bg-dark-800/50 border border-dark-700/50 rounded-xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <HiOutlineDocumentText className="w-5 h-5 text-primary-400" />
                <h2 className="text-xl font-bold text-white">Rules & Regulations</h2>
              </div>
              <div className="space-y-2">
                {tournament.rules.split('\n').map((rule, idx) => (
                  <p key={idx} className="text-sm text-dark-300 pl-3 border-l-2 border-dark-700 py-1">{rule}</p>
                ))}
              </div>
            </div>
          )}

          {/* Map */}
          {tournament.venueCoordinates?.lat !== 0 && (
            <div className="bg-dark-800/50 border border-dark-700/50 rounded-xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <HiOutlineMapPin className="w-5 h-5 text-success-400" />
                <h2 className="text-xl font-bold text-white">Venue Location</h2>
              </div>
              {tournament.venueAddress && <p className="text-sm text-dark-400 mb-4">{tournament.venueAddress}</p>}
              <div className="h-64 rounded-xl overflow-hidden border border-dark-700">
                <MapContainer center={[tournament.venueCoordinates.lat, tournament.venueCoordinates.lng]} zoom={14} style={{ height: '100%', width: '100%' }}>
                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; OpenStreetMap' />
                  <Marker position={[tournament.venueCoordinates.lat, tournament.venueCoordinates.lng]}>
                    <Popup>{tournament.venue}</Popup>
                  </Marker>
                </MapContainer>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar CTA */}
        <div>
          <div className="bg-dark-800/50 border border-dark-700/50 rounded-xl p-6 sticky top-24">
            <div className="text-center mb-6">
              <p className="text-3xl font-bold text-white">₹{tournament.registrationFees}</p>
              <p className="text-sm text-dark-500 mt-1">per team</p>
            </div>
            <div className="mb-6">
              <div className="flex justify-between text-xs text-dark-500 mb-1.5">
                <span>Slots</span>
                <span>{tournament.currentParticipants}/{tournament.maxParticipants}</span>
              </div>
              <div className="w-full bg-dark-700 rounded-full h-2">
                <div className={`h-2 rounded-full ${isFull ? 'bg-red-500' : 'bg-gradient-to-r from-primary-500 to-success-500'}`}
                  style={{ width: `${Math.min((tournament.currentParticipants / tournament.maxParticipants) * 100, 100)}%` }}></div>
              </div>
            </div>
            {isDeadlinePassed ? (
              <div className="text-center p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                <p className="text-sm text-red-400 font-medium">Registration Closed</p>
              </div>
            ) : isFull ? (
              <div className="text-center p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg">
                <p className="text-sm text-amber-400 font-medium">Tournament Full</p>
              </div>
            ) : isAuthenticated ? (
              <Link to={`/register-team/${tournament._id}`}
                className="block w-full text-center px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-500 hover:to-primary-400 text-white font-semibold rounded-lg shadow-lg shadow-primary-500/25 transition-all">
                Register Your Team
              </Link>
            ) : (
              <Link to="/login" className="block w-full text-center px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-500 text-white font-semibold rounded-lg shadow-lg shadow-primary-500/25">
                Login to Register
              </Link>
            )}
            <p className="text-xs text-dark-500 text-center mt-3">Deadline: {formatDate(tournament.registrationDeadline)}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TournamentDetail;
