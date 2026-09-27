import React, { useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  X,
  GraduationCap,
  Camera,
  Upload,
  ShieldCheck,
  CreditCard,
  Phone,
  Info,
  Shield,
  UserPlus,
  Loader2,
  Trash2,
} from 'lucide-react';
import { useToast } from '../context/ToastContext';

const DEPARTMENTS = [
  'Information Technology',
  'Computer Science Engineering',
  'Electronics and Communication Engineering',
  'Electrical and Electronics Engineering',
  'Mechanical Engineering',
  'Civil Engineering',
];

const StudentForm = ({
  mode = 'create', // 'create' or 'edit'
  initialData = {},
  onSubmit,
  isSubmitting = false,
}) => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    name: initialData.name || '',
    department: initialData.department || '',
    register_number: initialData.register_number || '',
    phone: initialData.phone || '',
    image_url: initialData.image_url || '',
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(initialData.image_url || '');
  const [errors, setErrors] = useState({});

  const isEdit = mode === 'edit';

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.match(/image\/(jpeg|jpg|png|webp)/)) {
      showToast('Please upload a JPG, JPEG, or PNG image file.', 'error');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      showToast('Image size exceeds 5MB limit.', 'error');
      return;
    }

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleRemoveImage = (e) => {
    e.stopPropagation();
    setImageFile(null);
    setImagePreview('');
    setFormData((prev) => ({ ...prev, image_url: '' }));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Student Name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    if (!formData.department) {
      newErrors.department = 'Please select an academic department';
    }

    if (!formData.register_number.trim()) {
      newErrors.register_number = 'Register Number is required';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone Number is required';
    } else {
      const clean = formData.phone.replace(/[\s\-\(\)]/g, '');
      if (!/^\+?[0-9]{7,15}$/.test(clean)) {
        newErrors.phone = 'Enter a valid phone number (e.g. +91 98765 43210)';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      showToast('Please fix the errors in the form before submitting.', 'error');
      return;
    }

    // Submit multipart FormData
    const dataToSend = new FormData();
    dataToSend.append('name', formData.name.trim());
    dataToSend.append('department', formData.department);
    dataToSend.append('register_number', formData.register_number.trim());
    dataToSend.append('phone', formData.phone.trim());

    if (imageFile) {
      dataToSend.append('image', imageFile);
    } else if (formData.image_url) {
      dataToSend.append('image_url', formData.image_url);
    }

    onSubmit(dataToSend);
  };

  return (
    <div className="app-container" style={{ background: '#F8FAFC' }}>
      {/* Top Header matching Stitch screenshot 2 */}
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
          <span>Back to Students</span>
        </Link>

        <h2 style={{ fontSize: '15px', fontWeight: 700, color: '#0F172A' }}>
          {isEdit ? 'Edit Student Record' : 'Add New Student'}
        </h2>

        <Link
          to="/"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            color: '#64748B',
            textDecoration: 'none',
          }}
          aria-label="Close"
        >
          <X size={20} strokeWidth={2} />
        </Link>
      </header>

      <main className="main-content" style={{ paddingBottom: '40px' }}>
        {/* Academic Year Badge */}
        <div style={{ marginBottom: '14px' }}>
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: '#EFF6FF',
              color: '#1E40AF',
              border: '1px solid #DBEAFE',
              fontSize: '12px',
              fontWeight: 600,
              padding: '4px 12px',
              borderRadius: '999px',
            }}
          >
            <GraduationCap size={14} strokeWidth={2.2} />
            <span>Academic Year 2024-25</span>
          </span>
        </div>

        {/* Heading */}
        <h1 className="page-title">{isEdit ? 'Edit Student' : 'Add New Student'}</h1>
        <p className="page-subtitle" style={{ marginBottom: '24px' }}>
          {isEdit ? 'Update existing student records.' : "Enter the student's details below."}
        </p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Photo Upload Section */}
          <div>
            <label
              style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: 700,
                color: '#0F172A',
                marginBottom: '8px',
              }}
            >
              Student Photo <span style={{ fontWeight: 400, color: '#64748B' }}>(Optional)</span>
            </label>

            <div
              style={{
                border: '2px dashed #CBD5E1',
                borderRadius: '18px',
                padding: '24px 20px',
                background: '#FFFFFF',
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'border-color 0.2s ease',
              }}
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/jpg,image/webp"
                onChange={handleFileChange}
                style={{ display: 'none' }}
              />

              {imagePreview ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
                  <img
                    src={imagePreview}
                    alt="Preview"
                    style={{
                      width: '90px',
                      height: '90px',
                      borderRadius: '16px',
                      objectFit: 'cover',
                      border: '2px solid #1D61E7',
                      boxShadow: '0 4px 12px rgba(29, 97, 231, 0.15)',
                    }}
                  />
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button
                      type="button"
                      className="btn-secondary"
                      style={{ padding: '6px 14px', fontSize: '12px' }}
                      onClick={(e) => {
                        e.stopPropagation();
                        fileInputRef.current?.click();
                      }}
                    >
                      Change Photo
                    </button>
                    <button
                      type="button"
                      className="btn-secondary"
                      style={{ padding: '6px 14px', fontSize: '12px', color: '#DC2626' }}
                      onClick={handleRemoveImage}
                    >
                      <Trash2 size={13} />
                      <span>Remove</span>
                    </button>
                  </div>
                </div>
              ) : (
                <>
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
                      margin: '0 auto 12px auto',
                    }}
                  >
                    <Camera size={26} strokeWidth={2} />
                  </div>

                  <div
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      color: '#1D61E7',
                      fontSize: '14px',
                      fontWeight: 700,
                      marginBottom: '4px',
                    }}
                  >
                    <span>Upload student image</span>
                    <Upload size={14} strokeWidth={2.5} />
                  </div>

                  <p style={{ fontSize: '12px', color: '#64748B', marginBottom: '16px' }}>
                    PNG, JPG up to 5MB. Recommended square aspect.
                  </p>

                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      borderTop: '1px solid #F1F5F9',
                      paddingTop: '12px',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        fontSize: '12px',
                        color: '#475569',
                      }}
                    >
                      <ShieldCheck size={14} color="#16A34A" />
                      <span>Face detection check enabled</span>
                    </div>

                    <button
                      type="button"
                      style={{
                        fontSize: '13px',
                        fontWeight: 700,
                        color: '#1D61E7',
                      }}
                    >
                      Browse file
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Student Name */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <label style={{ fontSize: '14px', fontWeight: 700, color: '#0F172A' }}>
                Student Name <span style={{ color: '#DC2626' }}>*</span>
              </label>
              <span style={{ fontSize: '11px', color: '#64748B' }}>As per official ID</span>
            </div>
            <input
              type="text"
              name="name"
              placeholder="e.g. Aarav Sharma"
              value={formData.name}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '12px 14px',
                borderRadius: '12px',
                border: `1px solid ${errors.name ? '#EF4444' : '#CBD5E1'}`,
                background: '#FFFFFF',
                fontSize: '14px',
                outline: 'none',
              }}
            />
            {errors.name && (
              <p style={{ fontSize: '12px', color: '#EF4444', marginTop: '4px' }}>{errors.name}</p>
            )}
          </div>

          {/* Department */}
          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: 700, color: '#0F172A', marginBottom: '6px' }}>
              Department <span style={{ color: '#DC2626' }}>*</span>
            </label>
            <div style={{ position: 'relative' }}>
              <select
                name="department"
                value={formData.department}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  borderRadius: '12px',
                  border: `1px solid ${errors.department ? '#EF4444' : '#CBD5E1'}`,
                  background: '#FFFFFF',
                  fontSize: '14px',
                  color: formData.department ? '#0F172A' : '#64748B',
                  outline: 'none',
                  appearance: 'none',
                  cursor: 'pointer',
                }}
              >
                <option value="">Select academic department</option>
                {DEPARTMENTS.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
              <div
                style={{
                  position: 'absolute',
                  right: '14px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  pointerEvents: 'none',
                  color: '#64748B',
                }}
              >
                ▼
              </div>
            </div>
            {errors.department ? (
              <p style={{ fontSize: '12px', color: '#EF4444', marginTop: '4px' }}>{errors.department}</p>
            ) : (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontSize: '11px',
                  color: '#64748B',
                  marginTop: '5px',
                }}
              >
                <Info size={12} />
                <span>Course syllabus and faculty advisor map automatically</span>
              </div>
            )}
          </div>

          {/* Register Number */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <label style={{ fontSize: '14px', fontWeight: 700, color: '#0F172A' }}>
                Register Number <span style={{ color: '#DC2626' }}>*</span>
              </label>
              <span style={{ fontSize: '11px', color: '#1D61E7', fontWeight: 600 }}>Format: DEPT + YEAR + ID</span>
            </div>
            <div style={{ position: 'relative' }}>
              <div
                style={{
                  position: 'absolute',
                  left: '14px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#94A3B8',
                }}
              >
                <CreditCard size={18} strokeWidth={1.8} />
              </div>
              <input
                type="text"
                name="register_number"
                placeholder="e.g. CSE2023089"
                value={formData.register_number}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '12px 14px 12px 42px',
                  borderRadius: '12px',
                  border: `1px solid ${errors.register_number ? '#EF4444' : '#CBD5E1'}`,
                  background: '#FFFFFF',
                  fontSize: '14px',
                  outline: 'none',
                }}
              />
            </div>
            {errors.register_number && (
              <p style={{ fontSize: '12px', color: '#EF4444', marginTop: '4px' }}>
                {errors.register_number}
              </p>
            )}
          </div>

          {/* Phone Number */}
          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: 700, color: '#0F172A', marginBottom: '6px' }}>
              Phone Number <span style={{ color: '#DC2626' }}>*</span>
            </label>
            <div style={{ position: 'relative' }}>
              <div
                style={{
                  position: 'absolute',
                  left: '14px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#94A3B8',
                }}
              >
                <Phone size={18} strokeWidth={1.8} />
              </div>
              <input
                type="text"
                name="phone"
                placeholder="e.g. +91 98765 43210"
                value={formData.phone}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '12px 14px 12px 42px',
                  borderRadius: '12px',
                  border: `1px solid ${errors.phone ? '#EF4444' : '#CBD5E1'}`,
                  background: '#FFFFFF',
                  fontSize: '14px',
                  outline: 'none',
                }}
              />
            </div>
            {errors.phone ? (
              <p style={{ fontSize: '12px', color: '#EF4444', marginTop: '4px' }}>{errors.phone}</p>
            ) : (
              <p style={{ fontSize: '11px', color: '#64748B', marginTop: '5px' }}>
                Used for official SMS alerts, exam schedules, and verification.
              </p>
            )}
          </div>

          {/* Institutional Verification Notice */}
          <div
            style={{
              backgroundColor: '#EFF6FF',
              border: '1px solid #DBEAFE',
              borderRadius: '16px',
              padding: '14px 16px',
              display: 'flex',
              gap: '12px',
              alignItems: 'flex-start',
            }}
          >
            <Shield size={20} color="#1D61E7" style={{ flexShrink: 0, marginTop: '2px' }} />
            <div>
              <h4 style={{ fontSize: '13px', fontWeight: 700, color: '#1E40AF', marginBottom: '3px' }}>
                Institutional Verification Notice
              </h4>
              <p style={{ fontSize: '12px', color: '#475569', lineHeight: 1.4 }}>
                Data entered is instantaneously submitted to the Registrar Database under Admin Console v2.4 protocol.
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '8px' }}>
            <button
              type="submit"
              className="btn-primary"
              style={{ width: '100%', height: '48px', fontSize: '15px', borderRadius: '14px' }}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  <span>{isEdit ? 'Updating Student...' : 'Adding Student...'}</span>
                </>
              ) : (
                <>
                  <UserPlus size={18} strokeWidth={2.2} />
                  <span>{isEdit ? 'Update Student Record' : 'Add Student'}</span>
                </>
              )}
            </button>

            <button
              type="button"
              className="btn-secondary"
              style={{ width: '100%', height: '48px', fontSize: '15px', borderRadius: '14px' }}
              onClick={() => navigate('/')}
              disabled={isSubmitting}
            >
              Cancel
            </button>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              fontSize: '11px',
              color: '#94A3B8',
              marginTop: '10px',
            }}
          >
            <Shield size={12} />
            <span>Secure Student Records Portal • Collegiate Admin</span>
          </div>
        </form>
      </main>
    </div>
  );
};

export default StudentForm;
