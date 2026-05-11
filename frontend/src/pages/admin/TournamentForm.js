import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { tournamentAPI } from '../../services/api';
import toast from 'react-hot-toast';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const TournamentForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;
  const [loading, setLoading] = useState(isEdit);
  const [submitting, setSubmitting] = useState(false);

  const { register, handleSubmit, formState: { errors }, reset } = useForm();

  useEffect(() => {
    if (isEdit) {
      tournamentAPI.getById(id).then(res => {
        const t = res.data;
        reset({
          sport: t.sport, description: t.description, rules: t.rules, venue: t.venue,
          venueAddress: t.venueAddress, lat: t.venueCoordinates?.lat || 0, lng: t.venueCoordinates?.lng || 0,
          teamSize: t.teamSize, registrationFees: t.registrationFees,
          tournamentDate: t.tournamentDate?.split('T')[0], registrationDeadline: t.registrationDeadline?.split('T')[0],
          maxParticipants: t.maxParticipants, status: t.status,
        });
        setLoading(false);
      }).catch(() => { toast.error('Tournament not found'); navigate('/admin/tournaments'); });
    }
  }, [id, isEdit, reset, navigate]);

  const onSubmit = async (data) => {
    setSubmitting(true);
    try {
      const payload = {
        sport: data.sport, description: data.description, rules: data.rules, venue: data.venue,
        venueAddress: data.venueAddress, venueCoordinates: { lat: parseFloat(data.lat) || 0, lng: parseFloat(data.lng) || 0 },
        teamSize: parseInt(data.teamSize), registrationFees: parseInt(data.registrationFees),
        tournamentDate: data.tournamentDate, registrationDeadline: data.registrationDeadline,
        maxParticipants: parseInt(data.maxParticipants), status: data.status || 'upcoming',
      };
      if (isEdit) { await tournamentAPI.update(id, payload); toast.success('Tournament updated!'); }
      else { await tournamentAPI.create(payload); toast.success('Tournament created!'); }
      navigate('/admin/tournaments');
    } catch (e) { toast.error(e.response?.data?.message || 'Failed to save'); }
    finally { setSubmitting(false); }
  };

  if (loading) return <LoadingSpinner />;

  const inputCls = (err) => `w-full bg-dark-800 border ${err ? 'border-red-500' : 'border-dark-700'} rounded-lg px-4 py-2.5 text-white placeholder-dark-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50`;

  return (
    <div className="animate-fade-in max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">{isEdit ? 'Edit' : 'Create'} Tournament</h1>
        <p className="text-dark-400 mt-1">{isEdit ? 'Update tournament details' : 'Add a new tournament'}</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="bg-dark-800/50 border border-dark-700/50 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Basic Info</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-dark-300 mb-1.5">Sport Name *</label>
              <input className={inputCls(errors.sport)} placeholder="e.g., Cricket" {...register('sport', { required: 'Required' })} />
              {errors.sport && <p className="mt-1 text-xs text-red-400">{errors.sport.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-dark-300 mb-1.5">Status</label>
              <select className={inputCls()} {...register('status')}>
                <option value="upcoming">Upcoming</option><option value="ongoing">Ongoing</option><option value="completed">Completed</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-dark-300 mb-1.5">Description *</label>
              <textarea rows={3} className={inputCls(errors.description)} placeholder="Tournament description" {...register('description', { required: 'Required' })} />
              {errors.description && <p className="mt-1 text-xs text-red-400">{errors.description.message}</p>}
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-dark-300 mb-1.5">Rules</label>
              <textarea rows={4} className={inputCls()} placeholder="One rule per line..." {...register('rules')} />
            </div>
          </div>
        </div>

        <div className="bg-dark-800/50 border border-dark-700/50 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Venue & Location</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-dark-300 mb-1.5">Venue Name *</label>
              <input className={inputCls(errors.venue)} placeholder="e.g., Central Stadium" {...register('venue', { required: 'Required' })} />
            </div>
            <div>
              <label className="block text-sm font-medium text-dark-300 mb-1.5">Venue Address</label>
              <input className={inputCls()} placeholder="Full address" {...register('venueAddress')} />
            </div>
            <div>
              <label className="block text-sm font-medium text-dark-300 mb-1.5">Latitude</label>
              <input type="number" step="any" className={inputCls()} placeholder="19.0760" {...register('lat')} />
            </div>
            <div>
              <label className="block text-sm font-medium text-dark-300 mb-1.5">Longitude</label>
              <input type="number" step="any" className={inputCls()} placeholder="72.8777" {...register('lng')} />
            </div>
          </div>
        </div>

        <div className="bg-dark-800/50 border border-dark-700/50 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Tournament Settings</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-dark-300 mb-1.5">Team Size *</label>
              <input type="number" className={inputCls(errors.teamSize)} {...register('teamSize', { required: 'Required', min: { value: 1, message: 'Min 1' } })} />
            </div>
            <div>
              <label className="block text-sm font-medium text-dark-300 mb-1.5">Registration Fees (₹) *</label>
              <input type="number" className={inputCls(errors.registrationFees)} {...register('registrationFees', { required: 'Required', min: { value: 0, message: 'Min 0' } })} />
            </div>
            <div>
              <label className="block text-sm font-medium text-dark-300 mb-1.5">Max Participants *</label>
              <input type="number" className={inputCls(errors.maxParticipants)} {...register('maxParticipants', { required: 'Required', min: { value: 2, message: 'Min 2' } })} />
            </div>
            <div></div>
            <div>
              <label className="block text-sm font-medium text-dark-300 mb-1.5">Tournament Date *</label>
              <input type="date" className={inputCls(errors.tournamentDate)} {...register('tournamentDate', { required: 'Required' })} />
            </div>
            <div>
              <label className="block text-sm font-medium text-dark-300 mb-1.5">Registration Deadline *</label>
              <input type="date" className={inputCls(errors.registrationDeadline)} {...register('registrationDeadline', { required: 'Required' })} />
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <button type="submit" disabled={submitting}
            className="flex-1 bg-gradient-to-r from-primary-600 to-primary-500 text-white font-semibold py-3 rounded-xl shadow-lg shadow-primary-500/25 disabled:opacity-50">
            {submitting ? 'Saving...' : isEdit ? 'Update Tournament' : 'Create Tournament'}
          </button>
          <button type="button" onClick={() => navigate('/admin/tournaments')}
            className="px-6 py-3 bg-dark-800 text-dark-300 font-semibold rounded-xl border border-dark-700 hover:bg-dark-700">Cancel</button>
        </div>
      </form>
    </div>
  );
};

export default TournamentForm;
