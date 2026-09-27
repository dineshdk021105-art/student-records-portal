import React from 'react';
import { NavLink } from 'react-router-dom';
import { Users, TrendingUp, GraduationCap, Settings } from 'lucide-react';

const BottomNavigation = () => {
  return (
    <nav className="bottom-nav">
      <NavLink
        to="/"
        end
        className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
      >
        <Users size={20} strokeWidth={2} />
        <span>Directory</span>
      </NavLink>

      <NavLink
        to="/analytics"
        className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
      >
        <TrendingUp size={20} strokeWidth={2} />
        <span>Analytics</span>
      </NavLink>

      <NavLink
        to="/admissions"
        className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
      >
        <GraduationCap size={20} strokeWidth={2} />
        <span>Admissions</span>
      </NavLink>

      <NavLink
        to="/settings"
        className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
      >
        <Settings size={20} strokeWidth={2} />
        <span>Settings</span>
      </NavLink>
    </nav>
  );
};

export default BottomNavigation;
