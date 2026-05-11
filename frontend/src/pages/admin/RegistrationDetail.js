import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { registrationAPI } from '../../services/api';
import { HiArrowLeft, HiOutlineCheckCircle, HiOutlineXCircle } from 'react-icons/hi2';
import StatusBadge from '../../components/common/StatusBadge';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import toast from 'react-hot-toast';

const RegistrationDetail = () => {
  const { id } = useParams();
  const [reg, setReg] = useState(null);
  const [loading, setLoading] = useState(true);
  const [remarks, setRemarks] = useState('');

  useEffect(() => {
    registrationAPI.getById(id).then(res => { setReg(res.data); setRemarks(res.data.adminRemarks || ''); })
      .catch(e => console.error(e)).finally(() => setLoading(false));
  }, [id]);

  const handleStatus = async (status) => {
    try {
      await registrationAPI.updateStatus(id, { status, adminRemarks: remarks });
      setReg({ ...reg, status, adminRemarks: remarks });
      toast.success(`Registration ${status}`);
    } catch (e) { toast.error('Failed to update'); }
  };

  if (loading) return <LoadingSpinner />;
  if (!reg) return <div className="text-center py-16"><p className="text-white">Registration not found</p></div>;

  const formatDate = (d) => new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <div className="animate-fade-in max-w-4xl mx-auto">
      <Link to="/admin/registrations" className="inline-flex items-center gap-1.5 text-sm text-dark-400 hover:text-white mb-6">
        <HiArrowLeft className="w-4 h-4" /> Back to Registrations
      </Link>

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">{reg.teamName}</h1>
          <p className="text-dark-400">{reg.tournament?.sport} Tournament</p>
        </div>
        <StatusBadge status={reg.status} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Team Info */}
        <div className="bg-dark-800/50 border border-dark-700/50 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Team Information</h2>
          <div className="space-y-3">
            {[
              ['Captain', reg.captainName], ['Email', reg.email], ['Phone', reg.phone],
              ['College', reg.collegeName], ['Registered', formatDate(reg.createdAt)],
            ].map(([l, v]) => (
              <div key={l} className="flex justify-between py-2 border-b border-dark-700/50">
                <span className="text-sm text-dark-500">{l}</span>
                <span className="text-sm text-white font-medium">{v}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Team Members */}
        <div className="bg-dark-800/50 border border-dark-700/50 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Team Members ({reg.teamMembers?.length || 0})</h2>
          <div className="space-y-2">
            {reg.teamMembers?.map((m, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-dark-700/30 rounded-lg">
                <span className="text-sm text-white">{m.name}</span>
                <span className="text-xs text-dark-500 bg-dark-700 px-2 py-0.5 rounded">{m.role}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Payment Screenshot */}
        {reg.paymentScreenshot && (
          <div className="bg-dark-800/50 border border-dark-700/50 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Payment Screenshot</h2>
            <img src={`http://localhost:5000/uploads/${reg.paymentScreenshot}`} alt="Payment" className="rounded-lg max-h-64 w-auto" />
          </div>
        )}

        {/* Admin Actions */}
        <div className="bg-dark-800/50 border border-dark-700/50 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Admin Actions</h2>
          <div className="mb-4">
            <label className="block text-sm font-medium text-dark-300 mb-1.5">Remarks</label>
            <textarea rows={3} value={remarks} onChange={e => setRemarks(e.target.value)}
              className="w-full bg-dark-800 border border-dark-700 rounded-lg px-4 py-2.5 text-white placeholder-dark-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50"
              placeholder="Add remarks for the team..." />
          </div>
          <div className="flex gap-3">
            <button onClick={() => handleStatus('approved')}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-lg transition-colors">
              <HiOutlineCheckCircle className="w-5 h-5" /> Approve
            </button>
            <button onClick={() => handleStatus('rejected')}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-red-600 hover:bg-red-500 text-white font-semibold rounded-lg transition-colors">
              <HiOutlineXCircle className="w-5 h-5" /> Reject
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegistrationDetail;
