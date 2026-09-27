import React from 'react';
import { GraduationCap, Bell } from 'lucide-react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="top-header">
      <Link to="/" style={{ textDecoration: 'none' }} className="brand-section">
        <div className="brand-icon-box">
          <GraduationCap size={22} strokeWidth={2.2} />
        </div>
        <div>
          <h2 className="brand-title">Student Records Portal</h2>
          <p className="brand-subtitle">University Campus</p>
        </div>
      </Link>

      <div className="header-actions">
        <button className="notification-btn" title="Notifications" aria-label="Notifications">
          <Bell size={20} strokeWidth={1.8} />
          <span className="notification-dot"></span>
        </button>
        <img
          src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
          alt="Admin Profile"
          className="avatar-sm"
        />
      </div>
    </header>
  );
};

export default Header;
