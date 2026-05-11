import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

/**
 * Register Page - User registration with form validation
 */
const Register = () => {
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors }, watch } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await registerUser({
        username: data.username,
        email: data.email,
        password: data.password,
        phone: data.phone,
        college: data.college,
      });
      toast.success('Account created successfully!');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-success-900 via-success-800 to-dark-900 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-72 h-72 bg-success-400 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-primary-400 rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative z-10 flex flex-col justify-center px-16">
          <div className="w-16 h-16 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-8 border border-white/20">
            <span className="text-2xl font-bold text-white">SS</span>
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">
            Join <br />
            <span className="text-success-300">SportSync</span>
          </h1>
          <p className="text-lg text-success-200/70 max-w-md">
            Create your account and start registering for exciting inter-college sports tournaments today.
          </p>
          
          <div className="mt-12 grid grid-cols-2 gap-4">
            {[
              { num: '5+', label: 'Sports' },
              { num: '100+', label: 'Teams' },
              { num: '500+', label: 'Players' },
              { num: '10+', label: 'Colleges' },
            ].map((stat) => (
              <div key={stat.label} className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                <p className="text-2xl font-bold text-white">{stat.num}</p>
                <p className="text-sm text-success-200/60">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel - Register Form */}
      <div className="flex-1 flex items-center justify-center bg-dark-900 px-6 py-12">
        <div className="w-full max-w-md">
          <div className="lg:hidden mb-8 text-center">
            <div className="w-14 h-14 bg-gradient-to-br from-success-500 to-success-700 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-success-500/25">
              <span className="text-xl font-bold text-white">SS</span>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white">Create Account</h2>
            <p className="text-dark-400 mt-1">Fill in your details to get started</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label htmlFor="reg-username" className="block text-sm font-medium text-dark-300 mb-1.5">Username</label>
              <input
                id="reg-username"
                type="text"
                className={`w-full bg-dark-800 border ${errors.username ? 'border-red-500' : 'border-dark-700'} rounded-lg px-4 py-2.5 text-white placeholder-dark-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500/50`}
                placeholder="John Doe"
                {...register('username', {
                  required: 'Username is required',
                  minLength: { value: 3, message: 'At least 3 characters' },
                })}
              />
              {errors.username && <p className="mt-1 text-xs text-red-400">{errors.username.message}</p>}
            </div>

            <div>
              <label htmlFor="reg-email" className="block text-sm font-medium text-dark-300 mb-1.5">Email</label>
              <input
                id="reg-email"
                type="email"
                className={`w-full bg-dark-800 border ${errors.email ? 'border-red-500' : 'border-dark-700'} rounded-lg px-4 py-2.5 text-white placeholder-dark-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500/50`}
                placeholder="you@example.com"
                {...register('email', {
                  required: 'Email is required',
                  pattern: { value: /^\S+@\S+\.\S+$/, message: 'Invalid email' },
                })}
              />
              {errors.email && <p className="mt-1 text-xs text-red-400">{errors.email.message}</p>}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="reg-phone" className="block text-sm font-medium text-dark-300 mb-1.5">Phone</label>
                <input
                  id="reg-phone"
                  type="tel"
                  className="w-full bg-dark-800 border border-dark-700 rounded-lg px-4 py-2.5 text-white placeholder-dark-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500/50"
                  placeholder="9876543210"
                  {...register('phone')}
                />
              </div>
              <div>
                <label htmlFor="reg-college" className="block text-sm font-medium text-dark-300 mb-1.5">College</label>
                <input
                  id="reg-college"
                  type="text"
                  className="w-full bg-dark-800 border border-dark-700 rounded-lg px-4 py-2.5 text-white placeholder-dark-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500/50"
                  placeholder="Your college"
                  {...register('college')}
                />
              </div>
            </div>

            <div>
              <label htmlFor="reg-password" className="block text-sm font-medium text-dark-300 mb-1.5">Password</label>
              <input
                id="reg-password"
                type="password"
                className={`w-full bg-dark-800 border ${errors.password ? 'border-red-500' : 'border-dark-700'} rounded-lg px-4 py-2.5 text-white placeholder-dark-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500/50`}
                placeholder="••••••••"
                {...register('password', {
                  required: 'Password is required',
                  minLength: { value: 6, message: 'At least 6 characters' },
                })}
              />
              {errors.password && <p className="mt-1 text-xs text-red-400">{errors.password.message}</p>}
            </div>

            <div>
              <label htmlFor="reg-confirm" className="block text-sm font-medium text-dark-300 mb-1.5">Confirm Password</label>
              <input
                id="reg-confirm"
                type="password"
                className={`w-full bg-dark-800 border ${errors.confirmPassword ? 'border-red-500' : 'border-dark-700'} rounded-lg px-4 py-2.5 text-white placeholder-dark-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500/50`}
                placeholder="••••••••"
                {...register('confirmPassword', {
                  required: 'Please confirm your password',
                  validate: (value) => value === watch('password') || 'Passwords do not match',
                })}
              />
              {errors.confirmPassword && <p className="mt-1 text-xs text-red-400">{errors.confirmPassword.message}</p>}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-success-600 to-success-500 hover:from-success-500 hover:to-success-400 text-white font-semibold py-2.5 rounded-lg transition-all shadow-lg shadow-success-500/25 hover:shadow-success-500/40 disabled:opacity-50"
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-dark-400">
            Already have an account?{' '}
            <Link to="/login" className="text-primary-400 hover:text-primary-300 font-medium">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
