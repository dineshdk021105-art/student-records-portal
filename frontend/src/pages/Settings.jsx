import React, { useState } from 'react';
import Header from '../components/Header';
import BottomNavigation from '../components/BottomNavigation';
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  Settings as SettingsIcon,
  Shield,
  Bell,
  Database,
  Save,
  CheckCircle2,
  RefreshCw,
} from 'lucide-react';
import { useToast } from '../context/ToastContext';

const Settings = () => {
  const { showToast } = useToast();
  const [campusName, setCampusName] = useState('University Campus - Main Directorate');
  const [academicYear, setAcademicYear] = useState('2024-2025');
  const [smsAlerts, setSmsAlerts] = useState(true);
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [auditLogRetention, setAuditLogRetention] = useState('90');

  const handleSave = (e) => {
    e.preventDefault();
    showToast('Portal configuration saved successfully', 'success');
  };

  const handleTestBackup = () => {
    showToast('MySQL database backup archive generated (#LOG-9482)', 'success');
  };

  return (
    <div className="app-container">
      <Header />
      <main className="main-content">
        <Link
          to="/"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            color: '#1D61E7',
            textDecoration: 'none',
            fontSize: '14px',
            fontWeight: 700,
            marginBottom: '16px',
          }}
        >
          <ArrowLeft size={16} />
          <span>Back to Directory</span>
        </Link>

        <div style={{ marginBottom: '20px' }}>
          <h1 className="page-title">Portal Settings</h1>
          <p className="page-subtitle">Configure campus registrar protocols and preferences</p>
        </div>

        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* General Institutional Info */}
          <div className="stitch-card" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <SettingsIcon size={18} color="#1D61E7" />
              <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#0F172A' }}>
                Collegiate Settings
              </h3>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#0F172A', marginBottom: '6px' }}>
                  Institution / Campus Name
                </label>
                <input
                  type="text"
                  value={campusName}
                  onChange={(e) => setCampusName(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '10px',
                    border: '1px solid #CBD5E1',
                    background: '#FFFFFF',
                    fontSize: '14px',
                    outline: 'none',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#0F172A', marginBottom: '6px' }}>
                  Current Academic Intake Year
                </label>
                <select
                  value={academicYear}
                  onChange={(e) => setAcademicYear(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '10px',
                    border: '1px solid #CBD5E1',
                    background: '#FFFFFF',
                    fontSize: '14px',
                    outline: 'none',
                  }}
                >
                  <option value="2023-2024">2023–2024</option>
                  <option value="2024-2025">2024–2025 (Active)</option>
                  <option value="2025-2026">2025–2026</option>
                </select>
              </div>
            </div>
          </div>

          {/* Notifications Preferences */}
          <div className="stitch-card" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <Bell size={18} color="#1D61E7" />
              <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#0F172A' }}>
                Alert Preferences
              </h3>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: '#0F172A' }}>SMS Verification Alerts</div>
                  <div style={{ fontSize: '11px', color: '#64748B' }}>Notify students on registration & enrollment</div>
                </div>
                <input
                  type="checkbox"
                  checked={smsAlerts}
                  onChange={(e) => setSmsAlerts(e.target.checked)}
                  style={{ width: '18px', height: '18px', accentColor: '#1D61E7', cursor: 'pointer' }}
                />
              </label>

              <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: '#0F172A' }}>Registrar Email Sync</div>
                  <div style={{ fontSize: '11px', color: '#64748B' }}>Send audit digests to registrar admin inbox</div>
                </div>
                <input
                  type="checkbox"
                  checked={emailAlerts}
                  onChange={(e) => setEmailAlerts(e.target.checked)}
                  style={{ width: '18px', height: '18px', accentColor: '#1D61E7', cursor: 'pointer' }}
                />
              </label>
            </div>
          </div>

          {/* Database & Audit Sync */}
          <div className="stitch-card" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <Database size={18} color="#1D61E7" />
              <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#0F172A' }}>
                Database Health & Backup
              </h3>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#F8FAFC', padding: '12px 14px', borderRadius: '12px', border: '1px solid #E2E8F0', marginBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle2 size={16} color="#16A34A" />
                <span style={{ fontSize: '13px', fontWeight: 600, color: '#0F172A' }}>
                  MySQL `student_portal` connected
                </span>
              </div>
              <button
                type="button"
                onClick={handleTestBackup}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontSize: '12px',
                  fontWeight: 700,
                  color: '#1D61E7',
                }}
              >
                <RefreshCw size={12} />
                <span>Backup Now</span>
              </button>
            </div>

            <p style={{ fontSize: '11px', color: '#94A3B8' }}>
              Action protocol: Admin Console v2.4 • Institutional Log #LOG-9482
            </p>
          </div>

          <button
            type="submit"
            className="btn-primary"
            style={{ width: '100%', height: '48px', fontSize: '15px', borderRadius: '14px' }}
          >
            <Save size={18} />
            <span>Save Settings</span>
          </button>
        </form>
      </main>
      <BottomNavigation />
    </div>
  );
};

export default Settings;
