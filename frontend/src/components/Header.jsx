import React, { useState, useRef, useEffect } from 'react';
import {
  GraduationCap,
  Bell,
  CheckCheck,
  User,
  Settings,
  TrendingUp,
  LogOut,
  Shield,
  X,
  Clock,
  UserPlus,
  FileCheck,
  CheckCircle2,
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useToast } from '../context/ToastContext';

const INITIAL_NOTIFICATIONS = [
  {
    id: 1,
    title: 'New Student Registered',
    message: 'Vikram Malhotra was enrolled into Civil Engineering',
    time: '5m ago',
    read: false,
    icon: UserPlus,
    color: '#1D61E7',
    bgColor: '#EFF6FF',
  },
  {
    id: 2,
    title: 'Semester Course Allocation',
    message: 'Academic Year 2024-25 syllabus mapping finalized for CSE & IT',
    time: '1h ago',
    read: false,
    icon: FileCheck,
    color: '#16A34A',
    bgColor: '#DCFCE7',
  },
  {
    id: 3,
    title: 'Institutional Audit Log',
    message: 'Database backup synchronized under protocol #LOG-9482',
    time: '3h ago',
    read: false,
    icon: Shield,
    color: '#7C3AED',
    bgColor: '#EDE9FE',
  },
  {
    id: 4,
    title: 'Cohort Honors List Generated',
    message: 'Current CGPA cohort ranking compiled for Registrar review',
    time: 'Yesterday',
    read: true,
    icon: CheckCircle2,
    color: '#EA580C',
    bgColor: '#FFEDD5',
  },
];

const Header = () => {
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);

  const notificationsRef = useRef(null);
  const profileRef = useRef(null);
  const navigate = useNavigate();
  const { showToast } = useToast();

  const unreadCount = notifications.filter((n) => !n.read).length;

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
        setNotificationsOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    showToast('All notifications marked as read', 'success');
  };

  const handleClearNotifications = () => {
    setNotifications([]);
    showToast('Notifications cleared', 'success');
  };

  const handleNotificationClick = (item) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === item.id ? { ...n, read: true } : n))
    );
  };

  const handleSignOut = () => {
    setProfileOpen(false);
    showToast('Signed out of Collegiate Admin session. Demo active.', 'success');
  };

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
        {/* Notification Bell with Dropdown */}
        <div style={{ position: 'relative' }} ref={notificationsRef}>
          <button
            type="button"
            className="notification-btn"
            title="Notifications"
            aria-label="Notifications"
            onClick={() => {
              setNotificationsOpen(!notificationsOpen);
              setProfileOpen(false);
            }}
            style={{
              backgroundColor: notificationsOpen ? '#EFF6FF' : 'transparent',
              color: notificationsOpen ? '#1D61E7' : '#475569',
            }}
          >
            <Bell size={20} strokeWidth={1.8} />
            {unreadCount > 0 && <span className="notification-dot"></span>}
          </button>

          {/* Notifications Dropdown Panel */}
          {notificationsOpen && (
            <div
              style={{
                position: 'absolute',
                top: 'calc(100% + 10px)',
                right: '-40px',
                width: '340px',
                maxWidth: '90vw',
                backgroundColor: '#FFFFFF',
                borderRadius: '16px',
                boxShadow: '0 10px 25px -5px rgba(15, 23, 42, 0.15), 0 8px 10px -6px rgba(15, 23, 42, 0.1)',
                border: '1px solid #E2E8F0',
                zIndex: 100,
                overflow: 'hidden',
                animation: 'slideUp 0.18s ease-out',
              }}
            >
              {/* Header */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '14px 16px',
                  borderBottom: '1px solid #F1F5F9',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#0F172A' }}>
                    Notifications
                  </h3>
                  {unreadCount > 0 && (
                    <span
                      style={{
                        backgroundColor: '#EFF6FF',
                        color: '#1D61E7',
                        fontSize: '11px',
                        fontWeight: 700,
                        padding: '2px 8px',
                        borderRadius: '999px',
                      }}
                    >
                      {unreadCount} New
                    </span>
                  )}
                </div>

                {unreadCount > 0 && (
                  <button
                    type="button"
                    onClick={handleMarkAllRead}
                    style={{
                      fontSize: '12px',
                      fontWeight: 600,
                      color: '#1D61E7',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                    }}
                  >
                    <CheckCheck size={14} />
                    <span>Mark all read</span>
                  </button>
                )}
              </div>

              {/* Notification List */}
              <div style={{ maxHeight: '340px', overflowY: 'auto' }}>
                {notifications.length === 0 ? (
                  <div style={{ padding: '32px 16px', textAlign: 'center', color: '#64748B' }}>
                    <CheckCircle2 size={32} color="#16A34A" style={{ margin: '0 auto 8px auto' }} />
                    <p style={{ fontSize: '14px', fontWeight: 700, color: '#0F172A' }}>
                      All caught up!
                    </p>
                    <p style={{ fontSize: '12px', marginTop: '2px' }}>
                      No unread notices in your inbox.
                    </p>
                  </div>
                ) : (
                  notifications.map((item) => {
                    const IconComponent = item.icon;
                    return (
                      <div
                        key={item.id}
                        onClick={() => handleNotificationClick(item)}
                        style={{
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: '12px',
                          padding: '12px 16px',
                          borderBottom: '1px solid #F8FAFC',
                          backgroundColor: item.read ? '#FFFFFF' : '#F8FAFC',
                          cursor: 'pointer',
                          transition: 'background 0.15s ease',
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#F1F5F9')}
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.backgroundColor = item.read ? '#FFFFFF' : '#F8FAFC')
                        }
                      >
                        <div
                          style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '50%',
                            backgroundColor: item.bgColor,
                            color: item.color,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                            marginTop: '2px',
                          }}
                        >
                          <IconComponent size={16} />
                        </div>
                        <div style={{ flex: 1 }}>
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              gap: '6px',
                            }}
                          >
                            <h4
                              style={{
                                fontSize: '13px',
                                fontWeight: item.read ? 600 : 700,
                                color: '#0F172A',
                                lineHeight: 1.25,
                              }}
                            >
                              {item.title}
                            </h4>
                            {!item.read && (
                              <span
                                style={{
                                  width: '6px',
                                  height: '6px',
                                  borderRadius: '50%',
                                  backgroundColor: '#1D61E7',
                                  flexShrink: 0,
                                }}
                              ></span>
                            )}
                          </div>
                          <p
                            style={{
                              fontSize: '12px',
                              color: '#64748B',
                              marginTop: '2px',
                              lineHeight: 1.35,
                            }}
                          >
                            {item.message}
                          </p>
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px',
                              fontSize: '10px',
                              color: '#94A3B8',
                              marginTop: '4px',
                            }}
                          >
                            <Clock size={10} />
                            <span>{item.time}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Footer */}
              {notifications.length > 0 && (
                <div
                  style={{
                    padding: '10px 16px',
                    borderTop: '1px solid #F1F5F9',
                    backgroundColor: '#F8FAFC',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <button
                    type="button"
                    onClick={handleClearNotifications}
                    style={{ fontSize: '12px', color: '#64748B', fontWeight: 600 }}
                  >
                    Clear All
                  </button>
                  <button
                    type="button"
                    onClick={() => setNotificationsOpen(false)}
                    style={{ fontSize: '12px', color: '#1D61E7', fontWeight: 700 }}
                  >
                    Close
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* User Profile Avatar with Dropdown */}
        <div style={{ position: 'relative' }} ref={profileRef}>
          <button
            type="button"
            onClick={() => {
              setProfileOpen(!profileOpen);
              setNotificationsOpen(false);
            }}
            title="Collegiate Admin Profile"
            aria-label="Collegiate Admin Profile"
            style={{
              position: 'relative',
              borderRadius: '50%',
              padding: 0,
              border: profileOpen ? '2px solid #1D61E7' : '2px solid transparent',
              transition: 'all 0.15s ease',
              display: 'flex',
            }}
          >
            <img
              src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80"
              alt="Admin Profile"
              className="avatar-sm"
              style={{ display: 'block', cursor: 'pointer' }}
            />
            <span
              style={{
                position: 'absolute',
                bottom: 0,
                right: 0,
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                backgroundColor: '#16A34A',
                border: '2px solid #FFFFFF',
              }}
            ></span>
          </button>

          {/* Profile Dropdown Menu */}
          {profileOpen && (
            <div
              style={{
                position: 'absolute',
                top: 'calc(100% + 10px)',
                right: 0,
                width: '280px',
                backgroundColor: '#FFFFFF',
                borderRadius: '16px',
                boxShadow: '0 10px 25px -5px rgba(15, 23, 42, 0.15), 0 8px 10px -6px rgba(15, 23, 42, 0.1)',
                border: '1px solid #E2E8F0',
                zIndex: 100,
                overflow: 'hidden',
                animation: 'slideUp 0.18s ease-out',
              }}
            >
              {/* Profile Card Header */}
              <div
                style={{
                  padding: '16px',
                  background: 'linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%)',
                  borderBottom: '1px solid #DBEAFE',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                }}
              >
                <img
                  src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80"
                  alt="Admin"
                  style={{
                    width: '46px',
                    height: '46px',
                    borderRadius: '50%',
                    objectFit: 'cover',
                    border: '2px solid #FFFFFF',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
                  }}
                />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <h4
                    style={{
                      fontSize: '14px',
                      fontWeight: 800,
                      color: '#0F172A',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    Dr. Preethi Sundaram
                  </h4>
                  <p
                    style={{
                      fontSize: '11px',
                      fontWeight: 600,
                      color: '#1E40AF',
                      marginTop: '1px',
                    }}
                  >
                    Collegiate Registrar Admin
                  </p>
                  <p
                    style={{
                      fontSize: '10px',
                      color: '#64748B',
                      marginTop: '2px',
                    }}
                  >
                    admin.registrar@college.edu
                  </p>
                </div>
              </div>

              {/* Status pill */}
              <div
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#F8FAFC',
                  borderBottom: '1px solid #F1F5F9',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  fontSize: '11px',
                }}
              >
                <span style={{ color: '#64748B' }}>Console v2.4 protocol</span>
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    color: '#15803D',
                    fontWeight: 700,
                  }}
                >
                  <span
                    style={{
                      width: '6px',
                      height: '6px',
                      borderRadius: '50%',
                      backgroundColor: '#16A34A',
                    }}
                  ></span>
                  Active
                </span>
              </div>

              {/* Menu Links */}
              <div style={{ padding: '6px 8px' }}>
                <button
                  type="button"
                  onClick={() => {
                    setProfileOpen(false);
                    navigate('/analytics');
                  }}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '9px 12px',
                    borderRadius: '8px',
                    fontSize: '13px',
                    fontWeight: 600,
                    color: '#334155',
                    textAlign: 'left',
                    transition: 'background 0.15s ease',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#F8FAFC')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                >
                  <TrendingUp size={16} color="#1D61E7" />
                  <span>Campus Analytics</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setProfileOpen(false);
                    navigate('/admissions');
                  }}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '9px 12px',
                    borderRadius: '8px',
                    fontSize: '13px',
                    fontWeight: 600,
                    color: '#334155',
                    textAlign: 'left',
                    transition: 'background 0.15s ease',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#F8FAFC')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                >
                  <GraduationCap size={16} color="#1D61E7" />
                  <span>Admissions Center</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setProfileOpen(false);
                    navigate('/settings');
                  }}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '9px 12px',
                    borderRadius: '8px',
                    fontSize: '13px',
                    fontWeight: 600,
                    color: '#334155',
                    textAlign: 'left',
                    transition: 'background 0.15s ease',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#F8FAFC')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                >
                  <Settings size={16} color="#1D61E7" />
                  <span>Portal Settings</span>
                </button>

                <div style={{ height: '1px', backgroundColor: '#F1F5F9', margin: '4px 0' }}></div>

                <button
                  type="button"
                  onClick={handleSignOut}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '9px 12px',
                    borderRadius: '8px',
                    fontSize: '13px',
                    fontWeight: 600,
                    color: '#DC2626',
                    textAlign: 'left',
                    transition: 'background 0.15s ease',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#FEF2F2')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                >
                  <LogOut size={16} color="#DC2626" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
