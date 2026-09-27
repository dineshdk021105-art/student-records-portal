import React from 'react';

const StatCard = ({ label, value, icon: Icon, badgeText, badgeIcon: BadgeIcon }) => {
  return (
    <div className="stat-card">
      <div className="stat-header">
        <span className="stat-label">{label}</span>
        {Icon && (
          <div className="stat-icon-wrapper">
            <Icon size={18} strokeWidth={2} />
          </div>
        )}
      </div>
      <div className="stat-number">{value}</div>
      {badgeText && (
        <div className="stat-badge">
          {BadgeIcon && <BadgeIcon size={12} strokeWidth={2.2} />}
          <span>{badgeText}</span>
        </div>
      )}
    </div>
  );
};

export default StatCard;
