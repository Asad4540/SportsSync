import React, { useState, useEffect } from 'react';
import { announcementAPI } from '../../services/api';
import { HiOutlinePlus, HiOutlinePencil, HiOutlineTrash } from 'react-icons/hi2';
import ConfirmModal from '../../components/common/ConfirmModal';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import toast from 'react-hot-toast';

const ManageAnnouncements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({ title: '', content: '', priority: 'medium' });

  useEffect(() => {
    announcementAPI.getAll().then(res => setAnnouncements(res.data)).catch(e => console.error(e)).finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        const res = await announcementAPI.update(editId, form);
        setAnnouncements(announcements.map(a => a._id === editId ? res.data.announcement : a));
        toast.success('Announcement updated');
      } else {
        const res = await announcementAPI.create(form);
        setAnnouncements([res.data.announcement, ...announcements]);
        toast.success('Announcement created');
      }
      resetForm();
    } catch (e) { toast.error('Failed to save'); }
  };

  const handleEdit = (ann) => {
    setForm({ title: ann.title, content: ann.content, priority: ann.priority });
    setEditId(ann._id);
    setShowForm(true);
  };

  const handleDelete = async () => {
    try {
      await announcementAPI.delete(deleteId);
      setAnnouncements(announcements.filter(a => a._id !== deleteId));
      toast.success('Announcement deleted');
      setDeleteId(null);
    } catch (e) { toast.error('Failed to delete'); }
  };

  const resetForm = () => { setForm({ title: '', content: '', priority: 'medium' }); setEditId(null); setShowForm(false); };

  const priorityColors = { high: 'border-red-500/30 bg-red-500/5', medium: 'border-amber-500/30 bg-amber-500/5', low: 'border-dark-700' };
  const formatDate = (d) => new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

  if (loading) return <LoadingSpinner />;

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Manage Announcements</h1>
          <p className="text-dark-400 mt-1">{announcements.length} announcements</p>
        </div>
        <button onClick={() => { resetForm(); setShowForm(!showForm); }}
          className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-primary-600 to-primary-500 text-white font-semibold rounded-lg text-sm">
          <HiOutlinePlus className="w-4 h-4" /> New Announcement
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-dark-800/50 border border-dark-700/50 rounded-xl p-6 mb-6 animate-slide-down">
          <h2 className="text-lg font-semibold text-white mb-4">{editId ? 'Edit' : 'New'} Announcement</h2>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-dark-300 mb-1.5">Title *</label>
                <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required
                  className="w-full bg-dark-800 border border-dark-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-primary-500/50" />
              </div>
              <div>
                <label className="block text-sm font-medium text-dark-300 mb-1.5">Priority</label>
                <select value={form.priority} onChange={e => setForm({ ...form, priority: e.target.value })}
                  className="w-full bg-dark-800 border border-dark-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-primary-500/50">
                  <option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-dark-300 mb-1.5">Content *</label>
              <textarea rows={3} value={form.content} onChange={e => setForm({ ...form, content: e.target.value })} required
                className="w-full bg-dark-800 border border-dark-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-primary-500/50" />
            </div>
            <div className="flex gap-3">
              <button type="submit" className="px-6 py-2.5 bg-primary-600 text-white font-semibold rounded-lg">{editId ? 'Update' : 'Post'}</button>
              <button type="button" onClick={resetForm} className="px-6 py-2.5 bg-dark-700 text-dark-300 rounded-lg">Cancel</button>
            </div>
          </div>
        </form>
      )}

      {/* List */}
      <div className="space-y-4">
        {announcements.map(ann => (
          <div key={ann._id} className={`bg-dark-800/50 border rounded-xl p-5 ${priorityColors[ann.priority]}`}>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-white">{ann.title}</h3>
                  <span className={`px-1.5 py-0.5 text-xs font-medium rounded capitalize ${ann.priority === 'high' ? 'bg-red-500/20 text-red-400' : ann.priority === 'medium' ? 'bg-amber-500/20 text-amber-400' : 'bg-dark-700 text-dark-400'}`}>{ann.priority}</span>
                </div>
                <p className="text-sm text-dark-400">{ann.content}</p>
                <p className="text-xs text-dark-500 mt-2">{formatDate(ann.createdAt)}</p>
              </div>
              <div className="flex items-center gap-1 ml-4">
                <button onClick={() => handleEdit(ann)} className="p-1.5 text-dark-400 hover:text-primary-400 hover:bg-primary-500/10 rounded-lg"><HiOutlinePencil className="w-4 h-4" /></button>
                <button onClick={() => setDeleteId(ann._id)} className="p-1.5 text-dark-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg"><HiOutlineTrash className="w-4 h-4" /></button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <ConfirmModal isOpen={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={handleDelete}
        title="Delete Announcement" message="This announcement will be permanently removed." />
    </div>
  );
};

export default ManageAnnouncements;
