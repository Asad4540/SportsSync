import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { tournamentAPI } from '../../services/api';
import { HiOutlinePlus, HiOutlinePencil, HiOutlineTrash } from 'react-icons/hi2';
import StatusBadge from '../../components/common/StatusBadge';
import ConfirmModal from '../../components/common/ConfirmModal';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import toast from 'react-hot-toast';

const ManageTournaments = () => {
  const [tournaments, setTournaments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState(null);

  const fetchTournaments = async () => {
    try {
      const res = await tournamentAPI.getAll();
      setTournaments(res.data);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchTournaments(); }, []);

  const handleDelete = async () => {
    try {
      await tournamentAPI.delete(deleteId);
      setTournaments(tournaments.filter(t => t._id !== deleteId));
      toast.success('Tournament deleted');
      setDeleteId(null);
    } catch (e) { toast.error('Failed to delete'); }
  };

  const formatDate = (d) => new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

  if (loading) return <LoadingSpinner />;

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Manage Tournaments</h1>
          <p className="text-dark-400 mt-1">{tournaments.length} tournaments total</p>
        </div>
        <Link to="/admin/tournaments/new" className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-primary-600 to-primary-500 text-white font-semibold rounded-lg shadow-lg shadow-primary-500/25 text-sm">
          <HiOutlinePlus className="w-4 h-4" /> Add Tournament
        </Link>
      </div>

      <div className="bg-dark-800/50 border border-dark-700/50 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead><tr className="text-left text-xs text-dark-500 uppercase border-b border-dark-700">
              <th className="p-4">Sport</th><th className="p-4">Venue</th><th className="p-4">Date</th><th className="p-4">Slots</th><th className="p-4">Fees</th><th className="p-4">Status</th><th className="p-4">Actions</th>
            </tr></thead>
            <tbody className="divide-y divide-dark-700/50">
              {tournaments.map(t => (
                <tr key={t._id} className="hover:bg-dark-700/30">
                  <td className="p-4 text-sm font-medium text-white">{t.sport}</td>
                  <td className="p-4 text-sm text-dark-400">{t.venue}</td>
                  <td className="p-4 text-sm text-dark-400">{formatDate(t.tournamentDate)}</td>
                  <td className="p-4 text-sm text-dark-400">{t.currentParticipants}/{t.maxParticipants}</td>
                  <td className="p-4 text-sm text-dark-400">₹{t.registrationFees}</td>
                  <td className="p-4"><StatusBadge status={t.status} /></td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <Link to={`/admin/tournaments/edit/${t._id}`} className="p-1.5 text-dark-400 hover:text-primary-400 hover:bg-primary-500/10 rounded-lg"><HiOutlinePencil className="w-4 h-4" /></Link>
                      <button onClick={() => setDeleteId(t._id)} className="p-1.5 text-dark-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg"><HiOutlineTrash className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <ConfirmModal isOpen={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={handleDelete}
        title="Delete Tournament" message="This action cannot be undone. All registrations for this tournament will be affected." />
    </div>
  );
};

export default ManageTournaments;
