import React from 'react';
import { Check } from 'lucide-react';

const DEPARTMENTS = [
  'All Departments',
  'Computer Science',
  'Information Technology',
  'Electronics & Comm',
  'Mechanical',
  'Civil Engineering',
  'Electrical & Electronics',
];

// Mapping short names to full names or queries
export const getFullDepartmentName = (dept) => {
  if (dept === 'Computer Science') return 'Computer Science Engineering';
  if (dept === 'Electronics & Comm') return 'Electronics and Communication Engineering';
  if (dept === 'Mechanical') return 'Mechanical Engineering';
  if (dept === 'Electrical & Electronics') return 'Electrical and Electronics Engineering';
  return dept;
};

const DepartmentFilter = ({ selectedDepartment, onSelectDepartment }) => {
  return (
    <div className="dept-filter-container">
      {DEPARTMENTS.map((dept) => {
        const fullDeptName = getFullDepartmentName(dept);
        const isActive =
          selectedDepartment === fullDeptName ||
          (dept === 'All Departments' && (!selectedDepartment || selectedDepartment === 'All Departments'));

        return (
          <button
            key={dept}
            type="button"
            className={`dept-pill ${isActive ? 'active' : ''}`}
            onClick={() => onSelectDepartment(dept === 'All Departments' ? 'All Departments' : fullDeptName)}
          >
            {isActive && <Check size={14} strokeWidth={2.5} />}
            <span>{dept}</span>
          </button>
        );
      })}
    </div>
  );
};

export default DepartmentFilter;
