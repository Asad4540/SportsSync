import React from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import './Navbar.css';

function Navbar() {
    const location = useLocation();

    const logout = () => {
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('user');
        window.location.href = '/login';
    }

    return (
        <div className="dashboard-layout">
            <nav className="top-navbar">
                <Link className="brand-title" to="/">
                    <div className="brand-logo">UC</div>
                    User Management CRUD
                </Link>
                <div className="navbar-actions">
                    <Link className="nav-link-btn" to="/">Dashboard</Link>
                    <Link className="nav-link-btn primary" to="/adduser">+ Add New User</Link>
                </div>
            </nav>

            <div className="main-container">
                <aside className="sidebar">
                    <ul className="sidebar-menu">
                        <li>
                            <Link
                                to="/"
                                className={`sidebar-item ${location.pathname === '/' ? 'active' : ''}`}
                            >
                                <span className="sidebar-item-icon">📊</span>
                                Dashboard
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/adduser"
                                className={`sidebar-item ${location.pathname === '/adduser' ? 'active' : ''}`}
                            >
                                <span className="sidebar-item-icon">👤</span>
                                User Directory
                            </Link>
                        </li>
                        <li>
                            <div className="sidebar-item">
                                <span className="sidebar-item-icon">⚙️</span>
                                Settings
                            </div>
                        </li>
                        <li>
                            <div className="sidebar-item">
                                <span className="sidebar-item-icon">🛡️</span>
                                Security
                            </div>
                        </li>
                        <li>
                            <div className="sidebar-item" onClick={logout}>
                                <span className="sidebar-item-icon" >❌</span>
                                Logout
                            </div>
                        </li>
                    </ul>
                </aside>

                <main className="content-panel">
                    <Outlet />
                </main>
            </div>
        </div>
    )
}

export default Navbar;