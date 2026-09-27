import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import StudentForm from '../components/StudentForm';
import { studentApi } from '../services/studentApi';
import { useToast } from '../context/ToastContext';

const EditStudent = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        setLoading(true);
        const res = await studentApi.getById(id);
        if (res.success) {
          setStudent(res.student);
        }
      } catch (err) {
        console.error('Failed to load student for editing:', err);
        showToast('Failed to load student record', 'error');
        navigate('/');
      } finally {
        setLoading(false);
      }
    };

    fetchStudent();
  }, [id, navigate, showToast]);

  const handleUpdate = async (formData) => {
    try {
      setIsSubmitting(true);
      const res = await studentApi.update(id, formData);
      if (res.success) {
        showToast('Student updated successfully', 'success');
        navigate(`/students/${id}`);
      }
    } catch (err) {
      console.error('Failed to update student:', err);
      const message = err.response?.data?.message || 'Failed to update student record.';
      showToast(message, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div
        className="app-container"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
        }}
      >
        <div style={{ textAlign: 'center', color: '#64748B' }}>
          <Loader2 size={36} className="animate-spin" color="#1D61E7" style={{ margin: '0 auto 12px auto' }} />
          <p style={{ fontWeight: 600 }}>Loading student details...</p>
        </div>
      </div>
    );
  }

  if (!student) return null;

  return (
    <StudentForm
      mode="edit"
      initialData={student}
      onSubmit={handleUpdate}
      isSubmitting={isSubmitting}
    />
  );
};

export default EditStudent;
