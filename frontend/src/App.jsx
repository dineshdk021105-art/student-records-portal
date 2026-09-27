import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { TrendingUp, GraduationCap, Settings } from 'lucide-react';
import { ToastProvider } from './context/ToastContext';
import Dashboard from './pages/Dashboard';
import AddStudent from './pages/AddStudent';
import EditStudent from './pages/EditStudent';
import StudentDetails from './pages/StudentDetails';
import PlaceholderView from './pages/PlaceholderView';

function App() {
  return (
    <ToastProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/students/new" element={<AddStudent />} />
          <Route path="/students/:id" element={<StudentDetails />} />
          <Route path="/students/:id/edit" element={<EditStudent />} />

          {/* Secondary views */}
          <Route
            path="/analytics"
            element={
              <PlaceholderView
                title="Campus Analytics"
                description="View aggregate university academic progression metrics and department breakdown."
                icon={TrendingUp}
              />
            }
          />
          <Route
            path="/admissions"
            element={
              <PlaceholderView
                title="Admissions Center"
                description="Manage intake cycles, new applicant verifications, and quota enrollments."
                icon={GraduationCap}
              />
            }
          />
          <Route
            path="/settings"
            element={
              <PlaceholderView
                title="System Settings"
                description="Configure campus registrar credentials, automated SMS alerts, and database backup."
                icon={Settings}
              />
            }
          />

          {/* Catch-all redirect to Dashboard */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </ToastProvider>
  );
}

export default App;
