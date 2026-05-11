import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { tournamentAPI, registrationAPI } from '../../services/api';
import toast from 'react-hot-toast';
import { HiArrowLeft, HiOutlinePlus, HiOutlineTrash } from 'react-icons/hi2';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const RegisterTeam = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tournament, setTournament] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [teamMembers, setTeamMembers] = useState([{ name: '', role: 'Player' }]);
  const [paymentFile, setPaymentFile] = useState(null);

  const { register, handleSubmit, formState: { errors } } = useForm();

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await tournamentAPI.getById(id);
        setTournament(res.data);
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    };
    fetch();
  }, [id]);

  const addMember = () => setTeamMembers([...teamMembers, { name: '', role: 'Player' }]);
  const removeMember = (idx) => setTeamMembers(teamMembers.filter((_, i) => i !== idx));
  const updateMember = (idx, field, value) => {
    const updated = [...teamMembers];
    updated[idx][field] = value;
    setTeamMembers(updated);
  };

  const onSubmit = async (data) => {
    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('tournament', id);
      formData.append('teamName', data.teamName);
      formData.append('captainName', data.captainName);
      formData.append('email', data.email);
      formData.append('phone', data.phone);
      formData.append('collegeName', data.collegeName);
      formData.append('teamMembers', JSON.stringify(teamMembers.filter(m => m.name.trim())));
      if (paymentFile) formData.append('paymentScreenshot', paymentFile);

      await registrationAPI.create(formData);
      toast.success('Registration submitted successfully!');
      navigate('/my-registrations');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
    } finally { setSubmitting(false); }
  };

  if (loading) return <LoadingSpinner />;
  if (!tournament) return <div className="text-center py-16"><p className="text-white">Tournament not found</p></div>;

  return (
    <div className="animate-fade-in max-w-3xl mx-auto">
      <Link to={`/tournaments/${id}`} className="inline-flex items-center gap-1.5 text-sm text-dark-400 hover:text-white mb-6">
        <HiArrowLeft className="w-4 h-4" /> Back to {tournament.sport}
      </Link>

      <div className="bg-dark-800/50 border border-dark-700/50 rounded-xl p-6 mb-6">
        <h1 className="text-2xl font-bold text-white">Register for {tournament.sport} Tournament</h1>
        <p className="text-dark-400 mt-1">Team size: {tournament.teamSize} players • Fees: ₹{tournament.registrationFees}</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="bg-dark-800/50 border border-dark-700/50 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Team Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-dark-300 mb-1.5">Team Name *</label>
              <input className={`w-full bg-dark-800 border ${errors.teamName ? 'border-red-500' : 'border-dark-700'} rounded-lg px-4 py-2.5 text-white placeholder-dark-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50`}
                placeholder="e.g., Thunder Hawks" {...register('teamName', { required: 'Required' })} />
              {errors.teamName && <p className="mt-1 text-xs text-red-400">{errors.teamName.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-dark-300 mb-1.5">Captain Name *</label>
              <input className={`w-full bg-dark-800 border ${errors.captainName ? 'border-red-500' : 'border-dark-700'} rounded-lg px-4 py-2.5 text-white placeholder-dark-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50`}
                placeholder="Captain's full name" {...register('captainName', { required: 'Required' })} />
              {errors.captainName && <p className="mt-1 text-xs text-red-400">{errors.captainName.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-dark-300 mb-1.5">Email *</label>
              <input type="email" className={`w-full bg-dark-800 border ${errors.email ? 'border-red-500' : 'border-dark-700'} rounded-lg px-4 py-2.5 text-white placeholder-dark-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50`}
                placeholder="team@email.com" {...register('email', { required: 'Required', pattern: { value: /^\S+@\S+\.\S+$/, message: 'Invalid email' } })} />
              {errors.email && <p className="mt-1 text-xs text-red-400">{errors.email.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-dark-300 mb-1.5">Phone *</label>
              <input type="tel" className={`w-full bg-dark-800 border ${errors.phone ? 'border-red-500' : 'border-dark-700'} rounded-lg px-4 py-2.5 text-white placeholder-dark-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50`}
                placeholder="9876543210" {...register('phone', { required: 'Required' })} />
              {errors.phone && <p className="mt-1 text-xs text-red-400">{errors.phone.message}</p>}
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-dark-300 mb-1.5">College Name *</label>
              <input className={`w-full bg-dark-800 border ${errors.collegeName ? 'border-red-500' : 'border-dark-700'} rounded-lg px-4 py-2.5 text-white placeholder-dark-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50`}
                placeholder="Your college name" {...register('collegeName', { required: 'Required' })} />
              {errors.collegeName && <p className="mt-1 text-xs text-red-400">{errors.collegeName.message}</p>}
            </div>
          </div>
        </div>

        {/* Team Members */}
        <div className="bg-dark-800/50 border border-dark-700/50 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white">Team Members</h2>
            <button type="button" onClick={addMember} className="flex items-center gap-1 text-sm text-primary-400 hover:text-primary-300">
              <HiOutlinePlus className="w-4 h-4" /> Add Member
            </button>
          </div>
          <div className="space-y-3">
            {teamMembers.map((member, idx) => (
              <div key={idx} className="flex gap-3 items-center">
                <input className="flex-1 bg-dark-800 border border-dark-700 rounded-lg px-4 py-2.5 text-white placeholder-dark-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50 text-sm"
                  placeholder={`Player ${idx + 1} name`} value={member.name} onChange={(e) => updateMember(idx, 'name', e.target.value)} />
                <select className="bg-dark-800 border border-dark-700 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/50"
                  value={member.role} onChange={(e) => updateMember(idx, 'role', e.target.value)}>
                  <option value="Player">Player</option>
                  <option value="Captain">Captain</option>
                  <option value="Vice Captain">Vice Captain</option>
                  <option value="Substitute">Substitute</option>
                </select>
                {teamMembers.length > 1 && (
                  <button type="button" onClick={() => removeMember(idx)} className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg">
                    <HiOutlineTrash className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Payment */}
        <div className="bg-dark-800/50 border border-dark-700/50 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Payment Screenshot</h2>
          <p className="text-sm text-dark-400 mb-3">Upload your payment screenshot (JPEG, PNG, WebP - Max 5MB)</p>
          <input type="file" accept="image/*" onChange={(e) => setPaymentFile(e.target.files[0])}
            className="block w-full text-sm text-dark-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-primary-500/20 file:text-primary-300 hover:file:bg-primary-500/30 cursor-pointer" />
          {paymentFile && <p className="mt-2 text-xs text-success-400">✓ {paymentFile.name}</p>}
        </div>

        <button type="submit" disabled={submitting}
          className="w-full bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-500 hover:to-primary-400 text-white font-semibold py-3 rounded-xl shadow-lg shadow-primary-500/25 transition-all disabled:opacity-50">
          {submitting ? 'Submitting...' : 'Submit Registration'}
        </button>
      </form>
    </div>
  );
};

export default RegisterTeam;
