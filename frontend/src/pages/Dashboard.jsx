import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  Plus,
  Users,
  Building2,
  TrendingUp,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  Loader2,
  UserPlus,
} from 'lucide-react';
import Header from '../components/Header';
import StatCard from '../components/StatCard';
import SearchBar from '../components/SearchBar';
import DepartmentFilter from '../components/DepartmentFilter';
import StudentCard from '../components/StudentCard';
import DeleteConfirmation from '../components/DeleteConfirmation';
import BottomNavigation from '../components/BottomNavigation';
import { studentApi } from '../services/studentApi';
import { useToast } from '../context/ToastContext';

const Dashboard = () => {
  const [students, setStudents] = useState([]);
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalDepartments: 6,
    recentAddedCount: 0,
  });
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 4,
    totalPages: 1,
    showingFrom: 0,
    showingTo: 0,
  });

  const [search, setSearch] = useState('');
  const [selectedDept, setSelectedDept] = useState('All Departments');
  const [loading, setLoading] = useState(true);

  // Delete state
  const [studentToDelete, setStudentToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const { showToast } = useToast();

  // Fetch stats from DB
  const loadStats = async () => {
    try {
      const data = await studentApi.getStats();
      if (data.success) {
        setStats(data.stats);
      }
    } catch (err) {
      console.error('Failed to load stats:', err);
    }
  };

  // Fetch students with current filters
  const loadStudents = useCallback(async (pageToLoad = 1) => {
    try {
      setLoading(true);
      const data = await studentApi.getAll({
        search,
        department: selectedDept,
        page: pageToLoad,
        limit: 4,
      });

      if (data && data.success && Array.isArray(data.students)) {
        setStudents(data.students);
        if (data.pagination) {
          setPagination(data.pagination);
        }
      } else {
        throw new Error(data?.message || 'Failed to load students');
      }
    } catch (err) {
      console.error('Failed to load students:', err);
      showToast('Failed to load students. Check backend connection.', 'error');
    } finally {
      setLoading(false);
    }
  }, [search, selectedDept, showToast]);

  // Load data on search / filter changes
  useEffect(() => {
    loadStats();
    loadStudents(1);
  }, [loadStudents]);

  // Pagination navigation
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      loadStudents(newPage);
      window.scrollTo({ top: 200, behavior: 'smooth' });
    }
  };

  // Trigger delete modal
  const handleDeleteClick = (student) => {
    setStudentToDelete(student);
  };

  // Execute deletion
  const handleConfirmDelete = async () => {
    if (!studentToDelete) return;
    try {
      setIsDeleting(true);
      const res = await studentApi.delete(studentToDelete.id);
      if (res.success) {
        showToast('Student deleted successfully', 'success');
        setStudentToDelete(null);
        await loadStats();
        // If current page is empty after deletion, go back one page if possible
        const pageToLoad =
          students.length === 1 && pagination.page > 1 ? pagination.page - 1 : pagination.page;
        await loadStudents(pageToLoad);
      }
    } catch (err) {
      console.error('Failed to delete student:', err);
      const msg = err.response?.data?.message || 'Failed to delete student record';
      showToast(msg, 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="app-container">
      <Header />

      <main className="main-content">
        {/* Title Bar & Add Student Button */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
          <div>
            <h1 className="page-title">Student Management</h1>
            <p className="page-subtitle">Manage student information efficiently</p>
          </div>
          <Link
            to="/students/new"
            className="btn-primary"
            style={{ borderRadius: '14px', whiteSpace: 'nowrap', padding: '10px 16px' }}
          >
            <Plus size={18} strokeWidth={2.5} />
            <span>Add Student</span>
          </Link>
        </div>

        {/* Dashboard Statistics */}
        <div className="stats-grid">
          <StatCard
            label="Total Students"
            value={stats.totalStudents ? stats.totalStudents.toLocaleString() : '0'}
            icon={Users}
            badgeText="+12% this semester"
            badgeIcon={TrendingUp}
          />
          <StatCard
            label="Total Departments"
            value={`${stats.totalDepartments} Active`}
            icon={Building2}
            badgeText="Full Accreditation"
            badgeIcon={Building2}
          />
        </div>

        {/* Students List Section Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginTop: '24px',
            marginBottom: '4px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#0F172A' }}>Students</h2>
            <span
              style={{
                backgroundColor: '#EFF6FF',
                color: '#2563EB',
                fontSize: '12px',
                fontWeight: 700,
                padding: '2px 8px',
                borderRadius: '999px',
              }}
            >
              ({pagination.total ? pagination.total.toLocaleString() : '0'})
            </span>
          </div>

          <button
            type="button"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '13px',
              fontWeight: 600,
              color: '#1D61E7',
              padding: '4px 8px',
              borderRadius: '8px',
            }}
            onClick={() => {
              // Quick reset filter or toggle view
              setSelectedDept('All Departments');
              setSearch('');
            }}
          >
            <SlidersHorizontal size={15} strokeWidth={2} />
            <span>Refine</span>
          </button>
        </div>

        {/* Search Bar */}
        <SearchBar
          value={search}
          onChange={(val) => setSearch(val)}
          onClear={() => setSearch('')}
        />

        {/* Department Filter Chips */}
        <DepartmentFilter
          selectedDepartment={selectedDept}
          onSelectDepartment={(dept) => setSelectedDept(dept)}
        />

        {/* Students Listing */}
        {loading ? (
          <div
            style={{
              padding: '60px 20px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px',
              color: '#64748B',
            }}
          >
            <Loader2 size={32} className="animate-spin" color="#1D61E7" />
            <p style={{ fontSize: '14px', fontWeight: 600 }}>Loading student records...</p>
          </div>
        ) : students.length === 0 ? (
          <div
            style={{
              background: '#FFFFFF',
              border: '1px dashed #CBD5E1',
              borderRadius: '20px',
              padding: '48px 24px',
              textAlign: 'center',
              marginTop: '16px',
            }}
          >
            <div
              style={{
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                backgroundColor: '#EFF6FF',
                color: '#1D61E7',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px auto',
              }}
            >
              <UserPlus size={26} strokeWidth={2} />
            </div>
            <h3 style={{ fontSize: '17px', fontWeight: 700, color: '#0F172A', marginBottom: '6px' }}>
              No Students Added Yet
            </h3>
            <p style={{ fontSize: '13px', color: '#64748B', maxWidth: '300px', margin: '0 auto 20px auto' }}>
              {search || (selectedDept && selectedDept !== 'All Departments')
                ? 'No students matched your search criteria. Try adjusting your filters.'
                : 'Add your first student to start managing student records in the portal.'}
            </p>
            <Link to="/students/new" className="btn-primary" style={{ borderRadius: '12px' }}>
              <Plus size={16} strokeWidth={2.5} />
              <span>Add Student</span>
            </Link>
          </div>
        ) : (
          <div className="students-list">
            {students.map((student) => (
              <StudentCard
                key={student.id}
                student={student}
                onDelete={handleDeleteClick}
              />
            ))}
          </div>
        )}

        {/* Pagination Section matching Stitch: Showing 1 - 4 of X students */}
        {!loading && pagination.total > 0 && (
          <div className="pagination-wrapper">
            <span className="pagination-text">
              Showing <strong>{pagination.showingFrom} – {pagination.showingTo}</strong> of{' '}
              <strong>{pagination.total.toLocaleString()}</strong> students
            </span>

            <div className="pagination-controls">
              <button
                type="button"
                className="pagination-btn"
                disabled={pagination.page <= 1}
                onClick={() => handlePageChange(pagination.page - 1)}
                aria-label="Previous Page"
              >
                <ChevronLeft size={18} strokeWidth={2.2} />
              </button>
              <button
                type="button"
                className="pagination-btn"
                disabled={pagination.page >= pagination.totalPages}
                onClick={() => handlePageChange(pagination.page + 1)}
                aria-label="Next Page"
              >
                <ChevronRight size={18} strokeWidth={2.2} />
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmation
        isOpen={!!studentToDelete}
        student={studentToDelete}
        onConfirm={handleConfirmDelete}
        onCancel={() => setStudentToDelete(null)}
        isDeleting={isDeleting}
      />

      {/* Persistent Bottom Navigation */}
      <BottomNavigation />
    </div>
  );
};

export default Dashboard;
