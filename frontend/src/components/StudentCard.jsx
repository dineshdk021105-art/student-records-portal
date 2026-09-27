import React from 'react';
import { Link } from 'react-router-dom';
import { Contact, Phone, Pencil, Trash2, ArrowRight } from 'lucide-react';

const StudentCard = ({ student, onDelete }) => {
  const getInitials = (name) => {
    if (!name) return 'S';
    return name
      .split(' ')
      .map((n) => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  return (
    <div className="student-card">
      {/* Top Header: Avatar, Name, Dept, Status Badge */}
      <div className="student-card-header">
        <div className="student-profile-info">
          {student.image_url ? (
            <img
              src={student.image_url}
              alt={student.name}
              className="student-avatar"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
          ) : null}
          <div
            className="student-avatar-placeholder"
            style={{ display: student.image_url ? 'none' : 'flex' }}
          >
            {getInitials(student.name)}
          </div>

          <div>
            <h3 className="student-name">{student.name}</h3>
            <p className="student-dept">{student.department}</p>
          </div>
        </div>

        <div className="active-pill">
          <span className="active-dot"></span>
          <span>Active</span>
        </div>
      </div>

      {/* Details Box: Reg Number & Phone */}
      <div className="student-details-box">
        <div className="student-info-row">
          <Contact size={15} strokeWidth={1.8} />
          <span>
            Reg: <strong>{student.register_number}</strong>
          </span>
        </div>
        <div className="student-info-row">
          <Phone size={15} strokeWidth={1.8} />
          <span>
            Phone: <strong>{student.phone}</strong>
          </span>
        </div>
      </div>

      {/* Footer: View Details link & Action Buttons */}
      <div className="student-card-footer">
        <Link to={`/students/${student.id}`} className="view-details-link">
          <span>View details</span>
          <ArrowRight size={15} strokeWidth={2.2} />
        </Link>

        <div className="card-actions">
          <Link
            to={`/students/${student.id}/edit`}
            className="icon-action-btn"
            title="Edit student"
            aria-label="Edit student"
          >
            <Pencil size={16} strokeWidth={1.8} />
          </Link>
          <button
            type="button"
            className="icon-action-btn delete-btn"
            title="Delete student"
            aria-label="Delete student"
            onClick={() => onDelete(student)}
          >
            <Trash2 size={16} strokeWidth={1.8} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudentCard;
