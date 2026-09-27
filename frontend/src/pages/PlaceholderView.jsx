import React from 'react';
import Header from '../components/Header';
import BottomNavigation from '../components/BottomNavigation';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const PlaceholderView = ({ title, description, icon: Icon }) => {
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
            marginBottom: '20px',
          }}
        >
          <ArrowLeft size={16} />
          <span>Back to Directory</span>
        </Link>

        <div
          className="stitch-card"
          style={{
            padding: '48px 24px',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '14px',
          }}
        >
          {Icon && (
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                backgroundColor: '#EFF6FF',
                color: '#1D61E7',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Icon size={32} />
            </div>
          )}
          <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#0F172A' }}>{title}</h2>
          <p style={{ fontSize: '14px', color: '#64748B', maxWidth: '340px' }}>{description}</p>
        </div>
      </main>
      <BottomNavigation />
    </div>
  );
};

export default PlaceholderView;
