import React, { useState, useEffect } from 'react';
import { registrationAPI, certificateAPI } from '../../services/api';
import { HiOutlineTrophy, HiOutlineDocumentArrowDown, HiOutlineEye } from 'react-icons/hi2';
import StatusBadge from '../../components/common/StatusBadge';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import toast from 'react-hot-toast';

const MyRegistrations = () => {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const fetchRegs = async () => {
      try {
        const res = await registrationAPI.getMy();
        setRegistrations(res.data);
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    };
    fetchRegs();
  }, []);

  const downloadCertificate = async (regId, teamName) => {
    try {
      const res = await certificateAPI.generate(regId);
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.download = `certificate_${teamName.replace(/\s+/g, '_')}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      toast.success('Certificate downloaded!');
    } catch (e) {
      toast.error('Failed to download certificate');
    }
  };

  const filtered = filter === 'all' ? registrations : registrations.filter(r => r.status === filter);
  const formatDate = (d) => new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

  if (loading) return <LoadingSpinner message="Loading registrations..." />;

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">My Registrations</h1>
        <p className="text-dark-400 mt-1">Track the status of your tournament registrations</p>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        {['all', 'pending', 'approved', 'rejected'].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-all ${filter === f ? 'bg-primary-500/20 text-primary-300 border border-primary-500/30' : 'bg-dark-800 text-dark-400 border border-dark-700 hover:border-dark-600'}`}>
            {f} {f !== 'all' && `(${registrations.filter(r => r.status === f).length})`}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16 bg-dark-800/50 rounded-xl border border-dark-700">
          <HiOutlineTrophy className="w-12 h-12 text-dark-600 mx-auto" />
          <h3 className="text-lg font-semibold text-white mt-4">No registrations found</h3>
          <p className="text-dark-400 mt-1">Browse tournaments and register your team</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((reg) => (
            <div key={reg._id} className="bg-dark-800/50 border border-dark-700/50 rounded-xl p-5 hover:border-dark-600 transition-colors">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary-500/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <HiOutlineTrophy className="w-6 h-6 text-primary-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">{reg.teamName}</h3>
                    <p className="text-sm text-dark-400">{reg.tournament?.sport} • {reg.collegeName}</p>
                    <p className="text-xs text-dark-500 mt-1">Registered: {formatDate(reg.createdAt)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <StatusBadge status={reg.status} />
                  {reg.status === 'approved' && (
                    <button onClick={() => downloadCertificate(reg._id, reg.teamName)}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-success-500/10 text-success-400 text-sm font-medium rounded-lg border border-success-500/20 hover:bg-success-500/20 transition-colors">
                      <HiOutlineDocumentArrowDown className="w-4 h-4" /> Certificate
                    </button>
                  )}
                </div>
              </div>
              {reg.adminRemarks && (
                <div className="mt-3 p-3 bg-dark-700/30 rounded-lg border-l-2 border-amber-500">
                  <p className="text-xs text-dark-500">Admin Remarks:</p>
                  <p className="text-sm text-dark-300">{reg.adminRemarks}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyRegistrations;
