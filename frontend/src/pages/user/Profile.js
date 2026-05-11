import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../context/AuthContext';
import { authAPI } from '../../services/api';
import toast from 'react-hot-toast';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: { username: user?.username || '', phone: user?.phone || '', college: user?.college || '' },
  });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const res = await authAPI.updateProfile(data);
      updateUser(res.data.user);
      toast.success('Profile updated successfully!');
    } catch (e) { toast.error(e.response?.data?.message || 'Update failed'); }
    finally { setLoading(false); }
  };

  return (
    <div className="animate-fade-in max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">My Profile</h1>
        <p className="text-dark-400 mt-1">Manage your account settings</p>
      </div>

      <div className="bg-dark-800/50 border border-dark-700/50 rounded-xl p-6 mb-6">
        <div className="flex items-center gap-4 mb-6 pb-6 border-b border-dark-700">
          <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-accent-500 rounded-full flex items-center justify-center text-2xl font-bold text-white">
            {user?.username?.[0]?.toUpperCase() || 'U'}
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">{user?.username}</h2>
            <p className="text-dark-400">{user?.email}</p>
            <span className="inline-block mt-1 px-2 py-0.5 bg-primary-500/20 text-primary-400 text-xs font-medium rounded capitalize">{user?.role}</span>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-dark-300 mb-1.5">Username</label>
            <input className={`w-full bg-dark-800 border ${errors.username ? 'border-red-500' : 'border-dark-700'} rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-primary-500/50`}
              {...register('username', { required: 'Required', minLength: { value: 3, message: 'Min 3 chars' } })} />
            {errors.username && <p className="mt-1 text-xs text-red-400">{errors.username.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-dark-300 mb-1.5">Email</label>
            <input className="w-full bg-dark-800 border border-dark-700 rounded-lg px-4 py-2.5 text-dark-500 cursor-not-allowed" value={user?.email || ''} disabled />
            <p className="mt-1 text-xs text-dark-500">Email cannot be changed</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-dark-300 mb-1.5">Phone</label>
              <input className="w-full bg-dark-800 border border-dark-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-primary-500/50"
                placeholder="Your phone number" {...register('phone')} />
            </div>
            <div>
              <label className="block text-sm font-medium text-dark-300 mb-1.5">College</label>
              <input className="w-full bg-dark-800 border border-dark-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-primary-500/50"
                placeholder="Your college name" {...register('college')} />
            </div>
          </div>
          <button type="submit" disabled={loading}
            className="px-6 py-2.5 bg-gradient-to-r from-primary-600 to-primary-500 text-white font-semibold rounded-lg shadow-lg shadow-primary-500/25 transition-all disabled:opacity-50">
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Profile;
