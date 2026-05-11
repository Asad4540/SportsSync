import React, { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  HiOutlineChartBarSquare,
  HiOutlineTrophy,
  HiOutlineClipboardDocumentList,
  HiOutlineMegaphone,
  HiOutlineArrowLeft,
  HiOutlineArrowRightOnRectangle,
  HiBars3,
  HiXMark,
} from 'react-icons/hi2';

/**
 * AdminLayout - Layout for admin dashboard pages
 */
const AdminLayout = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { path: '/admin', icon: HiOutlineChartBarSquare, label: 'Dashboard', exact: true },
    { path: '/admin/tournaments', icon: HiOutlineTrophy, label: 'Tournaments' },
    { path: '/admin/registrations', icon: HiOutlineClipboardDocumentList, label: 'Registrations' },
    { path: '/admin/announcements', icon: HiOutlineMegaphone, label: 'Announcements' },
  ];

  const isActive = (path, exact = false) => {
    if (exact) return location.pathname === path;
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-dark-900">
      {/* Top Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-40 bg-dark-900/80 backdrop-blur-xl border-b border-dark-800">
        <div className="flex items-center justify-between px-4 h-16">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 text-dark-400 hover:text-white rounded-lg hover:bg-dark-800 transition-colors"
            >
              {sidebarOpen ? <HiXMark className="w-6 h-6" /> : <HiBars3 className="w-6 h-6" />}
            </button>
            <Link to="/admin" className="flex items-center gap-2.5">
              <div className="w-9 h-9 bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg flex items-center justify-center font-bold text-white text-sm shadow-lg shadow-amber-500/25">
                AD
              </div>
              <div className="hidden sm:block">
                <span className="text-lg font-bold text-white">Admin Panel</span>
                <span className="text-xs text-dark-500 block -mt-0.5">SportSync Management</span>
              </div>
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/dashboard"
              className="flex items-center gap-1.5 px-3 py-1.5 bg-dark-800 text-dark-300 text-xs font-semibold rounded-lg border border-dark-700 hover:bg-dark-700 hover:text-white transition-colors"
            >
              <HiOutlineArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Back to App</span>
            </Link>
            <div className="w-8 h-8 bg-gradient-to-br from-amber-500 to-orange-500 rounded-full flex items-center justify-center text-sm font-bold text-white">
              {user?.username?.[0]?.toUpperCase() || 'A'}
            </div>
          </div>
        </div>
      </nav>

      {/* Sidebar Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-30 bg-black/50 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`fixed top-16 left-0 z-30 h-[calc(100vh-4rem)] w-64 bg-dark-900 border-r border-dark-800 transform transition-transform duration-300 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}>
        <div className="flex flex-col h-full p-4">
          <p className="text-xs font-semibold text-dark-500 uppercase tracking-wider px-3 mb-3">Management</p>
          <div className="space-y-1 flex-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  isActive(item.path, item.exact)
                    ? 'bg-amber-500/15 text-amber-400'
                    : 'text-dark-400 hover:text-dark-200 hover:bg-dark-800'
                }`}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </Link>
            ))}
          </div>

          <div className="border-t border-dark-800 pt-4 mt-4">
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-dark-400 hover:text-red-400 hover:bg-red-500/10 transition-colors w-full"
            >
              <HiOutlineArrowRightOnRectangle className="w-5 h-5" />
              Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:ml-64 pt-16 min-h-screen">
        <div className="p-4 md:p-6 lg:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
