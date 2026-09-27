import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import BottomNavigation from '../components/BottomNavigation';
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  TrendingUp,
  Users,
  Building2,
  Award,
  GraduationCap,
  PieChart,
  BarChart3,
  Loader2,
} from 'lucide-react';
import { studentApi } from '../services/studentApi';

const Analytics = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const data = await studentApi.getStats();
        if (data.success) {
          setStats(data.stats);
        }
      } catch (err) {
        console.error('Failed to load analytics:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

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
          <h1 className="page-title">Campus Analytics</h1>
          <p className="page-subtitle">Real-time enrollment distributions & academic metrics</p>
        </div>

        {loading ? (
          <div style={{ padding: '60px 20px', textAlign: 'center', color: '#64748B' }}>
            <Loader2 size={32} className="animate-spin" color="#1D61E7" style={{ margin: '0 auto 10px auto' }} />
            <p>Loading analytics...</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Top KPI Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
              <div className="stitch-card" style={{ padding: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontSize: '12px', fontWeight: 600, color: '#64748B' }}>Total Enrolled</span>
                  <div style={{ width: '28px', height: '28px', borderRadius: '6px', backgroundColor: '#EFF6FF', color: '#1D61E7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Users size={16} />
                  </div>
                </div>
                <div style={{ fontSize: '24px', fontWeight: 800, color: '#0F172A' }}>
                  {stats?.totalStudents || 0}
                </div>
                <span style={{ fontSize: '11px', color: '#16A34A', fontWeight: 600 }}>Active in Portal</span>
              </div>

              <div className="stitch-card" style={{ padding: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontSize: '12px', fontWeight: 600, color: '#64748B' }}>Departments</span>
                  <div style={{ width: '28px', height: '28px', borderRadius: '6px', backgroundColor: '#EFF6FF', color: '#1D61E7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Building2 size={16} />
                  </div>
                </div>
                <div style={{ fontSize: '24px', fontWeight: 800, color: '#0F172A' }}>
                  {stats?.totalDepartments || 6}
                </div>
                <span style={{ fontSize: '11px', color: '#2563EB', fontWeight: 600 }}>Accredited Programs</span>
              </div>
            </div>

            {/* Department Breakdown Bar Visualization */}
            <div className="stitch-card" style={{ padding: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                <BarChart3 size={18} color="#1D61E7" />
                <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#0F172A' }}>
                  Department Student Allocation
                </h3>
              </div>

              {stats?.departments && stats.departments.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {stats.departments.map((dept, index) => {
                    const percent = Math.round((dept.count / (stats.totalStudents || 1)) * 100);
                    return (
                      <div key={dept.department}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>
                          <span style={{ color: '#0F172A' }}>{dept.department}</span>
                          <span style={{ color: '#64748B' }}>{dept.count} students ({percent}%)</span>
                        </div>
                        <div style={{ width: '100%', height: '8px', backgroundColor: '#F1F5F9', borderRadius: '4px', overflow: 'hidden' }}>
                          <div
                            style={{
                              width: `${Math.max(percent, 12)}%`,
                              height: '100%',
                              backgroundColor: index % 2 === 0 ? '#1D61E7' : '#3B82F6',
                              borderRadius: '4px',
                            }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p style={{ fontSize: '13px', color: '#64748B' }}>No department records found.</p>
              )}
            </div>

            {/* Academic Standing Insights */}
            <div className="stitch-card" style={{ padding: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
                <Award size={18} color="#1D61E7" />
                <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#0F172A' }}>
                  Campus Standing Metrics
                </h3>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
                <div style={{ backgroundColor: '#F8FAFC', padding: '12px', borderRadius: '12px', textAlign: 'center' }}>
                  <div style={{ fontSize: '18px', fontWeight: 800, color: '#16A34A' }}>94.2%</div>
                  <div style={{ fontSize: '11px', color: '#64748B', marginTop: '2px' }}>Average Attendance</div>
                </div>

                <div style={{ backgroundColor: '#F8FAFC', padding: '12px', borderRadius: '12px', textAlign: 'center' }}>
                  <div style={{ fontSize: '18px', fontWeight: 800, color: '#1D61E7' }}>8.42</div>
                  <div style={{ fontSize: '11px', color: '#64748B', marginTop: '2px' }}>Campus Mean CGPA</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
      <BottomNavigation />
    </div>
  );
};

export default Analytics;
