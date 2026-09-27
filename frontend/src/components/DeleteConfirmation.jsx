import React from 'react';
import { AlertTriangle, Trash2, GraduationCap, Loader2 } from 'lucide-react';

const DeleteConfirmation = ({ isOpen, student, onConfirm, onCancel, isDeleting }) => {
  if (!isOpen || !student) return null;

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="drag-handle"></div>

        {/* Warning Icon Circle */}
        <div
          style={{
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            backgroundColor: '#FEE2E2',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#DC2626',
            marginBottom: '16px',
          }}
        >
          <AlertTriangle size={28} strokeWidth={2.2} />
        </div>

        <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#0F172A', marginBottom: '8px' }}>
          Delete Student?
        </h3>
        <p style={{ fontSize: '14px', color: '#64748B', maxWidth: '320px', lineHeight: 1.45 }}>
          Are you sure you want to delete this student? This action cannot be undone.
        </p>

        {/* Target Student Pill */}
        <div
          style={{
            width: '100%',
            backgroundColor: '#EFF6FF',
            border: '1px solid #DBEAFE',
            borderRadius: '12px',
            padding: '12px 16px',
            marginTop: '18px',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            color: '#1E40AF',
            fontSize: '14px',
            fontWeight: 600,
          }}
        >
          <GraduationCap size={16} strokeWidth={2} />
          <span>
            {student.name} • Reg: {student.register_number}
          </span>
        </div>

        {/* Actions */}
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <button
            type="button"
            className="btn-danger"
            style={{ width: '100%', height: '46px' }}
            onClick={onConfirm}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                <span>Deleting...</span>
              </>
            ) : (
              <>
                <Trash2 size={18} strokeWidth={2} />
                <span>Delete Student</span>
              </>
            )}
          </button>

          <button
            type="button"
            className="btn-secondary"
            style={{ width: '100%', height: '46px' }}
            onClick={onCancel}
            disabled={isDeleting}
          >
            Cancel
          </button>
        </div>

        <p style={{ fontSize: '11px', color: '#94A3B8', marginTop: '18px' }}>
          Action will be logged in institutional audit log #LOG-9482
        </p>
      </div>
    </div>
  );
};

export default DeleteConfirmation;
