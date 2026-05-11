import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { registrationAPI } from '../../services/api';
import { HiOutlineMagnifyingGlass, HiOutlineCheckCircle, HiOutlineXCircle, HiOutlineEye, HiOutlineTrash } from 'react-icons/hi2';
import StatusBadge from '../../components/common/StatusBadge';
import ConfirmModal from '../../components/common/ConfirmModal';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import toast from 'react-hot-toast';

const ManageRegistrations = () => {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [deleteId, setDeleteId] = useState(null);

  const fetchRegs = async () => {
    try {
      const params = {};
      if (search) params.search = search;
      if (statusFilter) params.status = statusFilter;
      const res = await registrationAPI.getAll(params);
      setRegistrations(res.data);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchRegs(); }, [statusFilter]);

  const handleSearch = (e) => { e.preventDefault(); setLoading(true); fetchRegs(); };

  const handleStatusChange = async (id, status) => {
    try {
      await registrationAPI.updateStatus(id, { status });
      setRegistrations(registrations.map(r => r._id === id ? { ...r, status } : r));
      toast.success(`Registration ${status}`);
    } catch (e) { toast.error('Failed to update status'); }
  };

  const handleDelete = async () => {
    try {
      await registrationAPI.delete(deleteId);
      setRegistrations(registrations.filter(r => r._id !== deleteId));
      toast.success('Registration deleted');
      setDeleteId(null);
    } catch (e) { toast.error('Failed to delete'); }
  };

  const formatDate = (d) => new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });

  if (loading) return <LoadingSpinner />;

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Manage Registrations</h1>
        <p className="text-dark-400 mt-1">{registrations.length} registrations total</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-3 mb-6">
        <form onSubmit={handleSearch} className="flex-1 relative">
          <HiOutlineMagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-500" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by team, captain, college..."
            className="w-full bg-dark-800 border border-dark-700 rounded-lg pl-10 pr-4 py-2.5 text-white placeholder-dark-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50" />
        </form>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-dark-800 border border-dark-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-primary-500/50">
          <option value="">All Status</option><option value="pending">Pending</option><option value="approved">Approved</option><option value="rejected">Rejected</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-dark-800/50 border border-dark-700/50 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead><tr className="text-left text-xs text-dark-500 uppercase border-b border-dark-700">
              <th className="p-4">Team</th><th className="p-4">Sport</th><th className="p-4">Captain</th><th className="p-4">College</th><th className="p-4">Date</th><th className="p-4">Status</th><th className="p-4">Actions</th>
            </tr></thead>
            <tbody className="divide-y divide-dark-700/50">
              {registrations.map(r => (
                <tr key={r._id} className="hover:bg-dark-700/30">
                  <td className="p-4"><p className="text-sm font-medium text-white">{r.teamName}</p><p className="text-xs text-dark-500">{r.email}</p></td>
                  <td className="p-4 text-sm text-dark-400">{r.tournament?.sport}</td>
                  <td className="p-4 text-sm text-dark-400">{r.captainName}</td>
                  <td className="p-4 text-sm text-dark-400">{r.collegeName}</td>
                  <td className="p-4 text-sm text-dark-400">{formatDate(r.createdAt)}</td>
                  <td className="p-4"><StatusBadge status={r.status} /></td>
                  <td className="p-4">
                    <div className="flex items-center gap-1">
                      <Link to={`/admin/registrations/${r._id}`} className="p-1.5 text-dark-400 hover:text-primary-400 hover:bg-primary-500/10 rounded-lg" title="View"><HiOutlineEye className="w-4 h-4" /></Link>
                      {r.status !== 'approved' && <button onClick={() => handleStatusChange(r._id, 'approved')} className="p-1.5 text-dark-400 hover:text-emerald-400 hover:bg-emerald-500/10 rounded-lg" title="Approve"><HiOutlineCheckCircle className="w-4 h-4" /></button>}
                      {r.status !== 'rejected' && <button onClick={() => handleStatusChange(r._id, 'rejected')} className="p-1.5 text-dark-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg" title="Reject"><HiOutlineXCircle className="w-4 h-4" /></button>}
                      <button onClick={() => setDeleteId(r._id)} className="p-1.5 text-dark-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg" title="Delete"><HiOutlineTrash className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <ConfirmModal isOpen={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={handleDelete}
        title="Delete Registration" message="This action cannot be undone." />
    </div>
  );
};

export default ManageRegistrations;
