import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Share2,
  Download,
  MoreVertical,
  CheckCircle2,
  Star,
  Shield,
  FileText,
  CreditCard,
  Phone,
  Mail,
  Calendar,
  Pencil,
  Trash2,
  Copy,
  Check,
  ExternalLink,
  Loader2,
} from 'lucide-react';
import DeleteConfirmation from '../components/DeleteConfirmation';
import { studentApi } from '../services/studentApi';
import { useToast } from '../context/ToastContext';

const StudentDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('personal');
  const [copiedField, setCopiedField] = useState(null);

  // Delete state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        setLoading(true);
        const res = await studentApi.getById(id);
        if (res.success) {
          setStudent(res.student);
        }
      } catch (err) {
        console.error('Failed to get student details:', err);
        showToast('Student record not found.', 'error');
        navigate('/');
      } finally {
        setLoading(false);
      }
    };

    fetchStudent();
  }, [id, navigate, showToast]);

  const copyToClipboard = (text, fieldName) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    showToast(`Copied ${fieldName} to clipboard`, 'success', 2000);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      const res = await studentApi.delete(id);
      if (res.success) {
        showToast('Student deleted successfully', 'success');
        navigate('/');
      }
    } catch (err) {
      console.error('Failed to delete student:', err);
      showToast('Failed to delete student record.', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  const getInitials = (name) => {
    if (!name) return 'S';
    return name
      .split(' ')
      .map((n) => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  if (loading) {
    return (
      <div
        className="app-container"
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}
      >
        <div style={{ textAlign: 'center', color: '#64748B' }}>
          <Loader2 size={36} className="animate-spin" color="#1D61E7" style={{ margin: '0 auto 12px auto' }} />
          <p style={{ fontWeight: 600 }}>Loading student profile...</p>
        </div>
      </div>
    );
  }

  if (!student) return null;

  // Generate clean email based on name
  const studentEmail = `${student.name.toLowerCase().replace(/[^a-z0-9]/g, '.')}@college.edu`;

  return (
    <div className="app-container" style={{ background: '#F8FAFC' }}>
      {/* Top Header */}
      <header
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '16px 20px',
          background: '#FFFFFF',
          borderBottom: '1px solid #E2E8F0',
          position: 'sticky',
          top: 0,
          zIndex: 40,
        }}
      >
        <Link
          to="/"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            color: '#1D61E7',
            textDecoration: 'none',
            fontSize: '14px',
            fontWeight: 700,
          }}
        >
          <ArrowLeft size={18} strokeWidth={2.2} />
          <span>Student Directory</span>
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#475569' }}>
          <button
            type="button"
            style={{ padding: '6px', color: '#64748B' }}
            title="Share Profile"
            onClick={() => {
              if (navigator.share) {
                navigator.share({ title: student.name, url: window.location.href });
              } else {
                copyToClipboard(window.location.href, 'link');
              }
            }}
          >
            <Share2 size={18} />
          </button>
          <button
            type="button"
            style={{ padding: '6px', color: '#64748B' }}
            title="Download PDF"
            onClick={() => window.print()}
          >
            <Download size={18} />
          </button>
          <button
            type="button"
            style={{ padding: '6px', color: '#64748B' }}
            title="More Options"
          >
            <MoreVertical size={18} />
          </button>
        </div>
      </header>

      <main className="main-content" style={{ paddingBottom: '50px' }}>
        {/* Main Profile Card with Top Blue Border Accent */}
        <div
          className="stitch-card"
          style={{
            borderTop: '5px solid #1D61E7',
            padding: '24px 20px 20px 20px',
            textAlign: 'center',
            position: 'relative',
          }}
        >
          {/* Avatar Container with Verified Badge */}
          <div
            style={{
              position: 'relative',
              width: '96px',
              height: '96px',
              margin: '0 auto 14px auto',
            }}
          >
            {student.image_url ? (
              <img
                src={student.image_url}
                alt={student.name}
                style={{
                  width: '100%',
                  height: '100%',
                  borderRadius: '50%',
                  objectFit: 'cover',
                  border: '3px solid #FFFFFF',
                  boxShadow: '0 4px 14px rgba(0, 0, 0, 0.1)',
                }}
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
            ) : null}
            <div
              style={{
                display: student.image_url ? 'none' : 'flex',
                width: '100%',
                height: '100%',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #DBEAFE 0%, #BFDBFE 100%)',
                color: '#1D61E7',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800,
                fontSize: '32px',
                border: '3px solid #FFFFFF',
                boxShadow: '0 4px 14px rgba(0, 0, 0, 0.1)',
              }}
            >
              {getInitials(student.name)}
            </div>

            {/* Green Checkmark Badge */}
            <div
              style={{
                position: 'absolute',
                bottom: '2px',
                right: '4px',
                backgroundColor: '#16A34A',
                color: '#FFFFFF',
                borderRadius: '50%',
                width: '24px',
                height: '24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '2px solid #FFFFFF',
              }}
            >
              <CheckCircle2 size={16} strokeWidth={2.5} />
            </div>
          </div>

          {/* Student Name */}
          <h1 style={{ fontSize: '22px', fontWeight: 800, color: '#0F172A', marginBottom: '8px' }}>
            {student.name}
          </h1>

          {/* Department Badge */}
          <div style={{ display: 'inline-flex', marginBottom: '8px' }}>
            <span
              style={{
                backgroundColor: '#EFF6FF',
                color: '#1E40AF',
                border: '1px solid #DBEAFE',
                fontSize: '13px',
                fontWeight: 600,
                padding: '4px 12px',
                borderRadius: '999px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <span>💻</span>
              <span>{student.department}</span>
            </span>
          </div>

          {/* Status Badge */}
          <div>
            <span
              style={{
                backgroundColor: '#F0FDF4',
                color: '#15803D',
                border: '1px solid #BBF7D0',
                fontSize: '12px',
                fontWeight: 600,
                padding: '3px 10px',
                borderRadius: '999px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#16A34A' }}></span>
              <span>Full-Time • 3rd Year</span>
            </span>
          </div>

          {/* Academic Metric Stat Boxes matching Stitch */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '12px',
              marginTop: '20px',
            }}
          >
            <div
              style={{
                backgroundColor: '#F8FAFC',
                border: '1px solid #E2E8F0',
                borderRadius: '16px',
                padding: '14px',
                textAlign: 'center',
              }}
            >
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontSize: '12px',
                  fontWeight: 600,
                  color: '#64748B',
                  marginBottom: '4px',
                }}
              >
                <Star size={13} color="#EAB308" fill="#EAB308" />
                <span>Current CGPA</span>
              </div>
              <div style={{ fontSize: '20px', fontWeight: 800, color: '#0F172A' }}>
                8.84 <span style={{ fontSize: '13px', color: '#94A3B8', fontWeight: 500 }}>/ 10</span>
              </div>
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 600,
                  color: '#16A34A',
                  display: 'inline-block',
                  marginTop: '4px',
                }}
              >
                Top 5% Cohort
              </span>
            </div>

            <div
              style={{
                backgroundColor: '#F8FAFC',
                border: '1px solid #E2E8F0',
                borderRadius: '16px',
                padding: '14px',
                textAlign: 'center',
              }}
            >
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontSize: '12px',
                  fontWeight: 600,
                  color: '#64748B',
                  marginBottom: '4px',
                }}
              >
                <Shield size={13} color="#2563EB" />
                <span>Attendance</span>
              </div>
              <div style={{ fontSize: '20px', fontWeight: 800, color: '#0F172A' }}>
                94% <span style={{ fontSize: '13px', color: '#94A3B8', fontWeight: 500 }}>Avg</span>
              </div>
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 600,
                  color: '#16A34A',
                  display: 'inline-block',
                  marginTop: '4px',
                }}
              >
                Regular Status
              </span>
            </div>
          </div>
        </div>

        {/* Tab Strip: Personal Info / Academic History / Fees & Dues */}
        <div
          style={{
            display: 'flex',
            borderBottom: '1px solid #E2E8F0',
            marginTop: '20px',
            marginBottom: '16px',
          }}
        >
          <button
            type="button"
            onClick={() => setActiveTab('personal')}
            style={{
              padding: '10px 16px',
              fontSize: '14px',
              fontWeight: 700,
              color: activeTab === 'personal' ? '#1D61E7' : '#64748B',
              borderBottom: activeTab === 'personal' ? '2.5px solid #1D61E7' : '2.5px solid transparent',
            }}
          >
            Personal Info
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('academic')}
            style={{
              padding: '10px 16px',
              fontSize: '14px',
              fontWeight: 600,
              color: activeTab === 'academic' ? '#1D61E7' : '#64748B',
              borderBottom: activeTab === 'academic' ? '2.5px solid #1D61E7' : '2.5px solid transparent',
            }}
          >
            Academic History
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('fees')}
            style={{
              padding: '10px 16px',
              fontSize: '14px',
              fontWeight: 600,
              color: activeTab === 'fees' ? '#1D61E7' : '#64748B',
              borderBottom: activeTab === 'fees' ? '2.5px solid #1D61E7' : '2.5px solid transparent',
            }}
          >
            Fees & Dues
          </button>
        </div>

        {/* Primary Enrollment Details Section */}
        <div className="stitch-card" style={{ padding: '20px' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '16px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FileText size={18} color="#1D61E7" />
              <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#0F172A' }}>
                Primary Enrollment Details
              </h3>
            </div>
            <span
              style={{
                fontSize: '11px',
                fontWeight: 600,
                color: '#64748B',
                backgroundColor: '#F1F5F9',
                padding: '2px 8px',
                borderRadius: '6px',
              }}
            >
              Batch '26
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {/* Register Number */}
            <div
              style={{
                backgroundColor: '#F8FAFC',
                border: '1px solid #E2E8F0',
                borderRadius: '12px',
                padding: '12px 14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '8px',
                    backgroundColor: '#EFF6FF',
                    color: '#1D61E7',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <CreditCard size={18} />
                </div>
                <div>
                  <div style={{ fontSize: '11px', color: '#64748B', fontWeight: 600 }}>
                    Register Number
                  </div>
                  <div style={{ fontSize: '14px', fontWeight: 800, color: '#0F172A' }}>
                    {student.register_number}
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => copyToClipboard(student.register_number, 'register number')}
                style={{ color: copiedField === 'register number' ? '#16A34A' : '#64748B', padding: '6px' }}
                title="Copy Register Number"
              >
                {copiedField === 'register number' ? <Check size={16} /> : <Copy size={16} />}
              </button>
            </div>

            {/* Phone Number */}
            <div
              style={{
                backgroundColor: '#F8FAFC',
                border: '1px solid #E2E8F0',
                borderRadius: '12px',
                padding: '12px 14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '8px',
                    backgroundColor: '#EFF6FF',
                    color: '#1D61E7',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Phone size={18} />
                </div>
                <div>
                  <div style={{ fontSize: '11px', color: '#64748B', fontWeight: 600 }}>
                    Phone Number
                  </div>
                  <div style={{ fontSize: '14px', fontWeight: 800, color: '#0F172A' }}>
                    {student.phone}
                  </div>
                </div>
              </div>
              <a
                href={`tel:${student.phone}`}
                style={{ color: '#1D61E7', padding: '6px' }}
                title="Call Student"
              >
                <Phone size={16} />
              </a>
            </div>

            {/* Institutional Email */}
            <div
              style={{
                backgroundColor: '#F8FAFC',
                border: '1px solid #E2E8F0',
                borderRadius: '12px',
                padding: '12px 14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '8px',
                    backgroundColor: '#EFF6FF',
                    color: '#1D61E7',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Mail size={18} />
                </div>
                <div>
                  <div style={{ fontSize: '11px', color: '#64748B', fontWeight: 600 }}>
                    Institutional Email
                  </div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: '#1D61E7' }}>
                    {studentEmail}
                  </div>
                </div>
              </div>
              <a
                href={`mailto:${studentEmail}`}
                style={{ color: '#1D61E7', padding: '6px' }}
                title="Send Email"
              >
                <ExternalLink size={16} />
              </a>
            </div>

            {/* Admission Tenure */}
            <div
              style={{
                backgroundColor: '#F8FAFC',
                border: '1px solid #E2E8F0',
                borderRadius: '12px',
                padding: '12px 14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '8px',
                    backgroundColor: '#EFF6FF',
                    color: '#1D61E7',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Calendar size={18} />
                </div>
                <div>
                  <div style={{ fontSize: '11px', color: '#64748B', fontWeight: 600 }}>
                    Admission Tenure
                  </div>
                  <div style={{ fontSize: '14px', fontWeight: 800, color: '#0F172A' }}>
                    2022 – 2026
                  </div>
                </div>
              </div>
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 600,
                  backgroundColor: '#EFF6FF',
                  color: '#2563EB',
                  padding: '4px 8px',
                  borderRadius: '6px',
                }}
              >
                Semester VI
              </span>
            </div>
          </div>
        </div>

        {/* Faculty Mentor Card matching Stitch */}
        <div
          className="stitch-card"
          style={{
            padding: '16px 20px',
            marginTop: '16px',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '14px',
          }}
        >
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '50%',
              backgroundColor: '#EDE9FE',
              color: '#7C3AED',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              fontSize: '14px',
              flexShrink: 0,
            }}
          >
            DR
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h4 style={{ fontSize: '14px', fontWeight: 800, color: '#0F172A' }}>
                Dr. Rajesh Swaminathan
              </h4>
              <span style={{ fontSize: '11px', color: '#64748B', fontWeight: 500 }}>
                Faculty Mentor
              </span>
            </div>
            <p style={{ fontSize: '12px', color: '#64748B', marginTop: '4px', lineHeight: 1.4 }}>
              Student approved for Summer Research Practicum in Distributed Systems.
            </p>
          </div>
        </div>

        {/* Action Buttons: Edit and Delete */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '20px' }}>
          <Link
            to={`/students/${student.id}/edit`}
            className="btn-primary"
            style={{
              width: '100%',
              height: '48px',
              borderRadius: '14px',
              fontSize: '15px',
              textDecoration: 'none',
            }}
          >
            <Pencil size={18} strokeWidth={2} />
            <span>Edit Student Record</span>
          </Link>

          <button
            type="button"
            className="btn-secondary"
            style={{
              width: '100%',
              height: '48px',
              borderRadius: '14px',
              fontSize: '15px',
              color: '#DC2626',
              borderColor: '#FCA5A5',
              backgroundColor: '#FFF5F5',
            }}
            onClick={() => setShowDeleteModal(true)}
          >
            <Trash2 size={18} strokeWidth={2} />
            <span>Delete Student</span>
          </button>
        </div>

        <p
          style={{
            fontSize: '11px',
            color: '#94A3B8',
            textAlign: 'center',
            marginTop: '18px',
          }}
        >
          Record UID: REC-99420-AS • Last updated 2 hrs ago by Registrar Admin
        </p>
      </main>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmation
        isOpen={showDeleteModal}
        student={student}
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteModal(false)}
        isDeleting={isDeleting}
      />
    </div>
  );
};

export default StudentDetails;
