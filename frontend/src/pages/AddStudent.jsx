import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import StudentForm from '../components/StudentForm';
import { studentApi } from '../services/studentApi';
import { useToast } from '../context/ToastContext';

const AddStudent = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { showToast } = useToast();

  const handleCreate = async (formData) => {
    try {
      setIsSubmitting(true);
      const res = await studentApi.create(formData);
      if (res.success) {
        showToast('Student added successfully', 'success');
        navigate('/');
      }
    } catch (err) {
      console.error('Failed to create student:', err);
      const message = err.response?.data?.message || 'Failed to add student. Please verify all fields.';
      showToast(message, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <StudentForm
      mode="create"
      onSubmit={handleCreate}
      isSubmitting={isSubmitting}
    />
  );
};

export default AddStudent;
