import React from "react";
import { ArrowUpRight } from "lucide-react";

import "./AdminStatCard.css";

function AdminStatCard({
  title,
  value,
  icon: Icon,
  description,
  trend,
}) {
  return (
    <div className="admin-stat-card">

      {/* ICON */}
      <div className="admin-stat-icon">
        {Icon && (
          <Icon
            size={23}
            strokeWidth={2}
          />
        )}
      </div>

      {/* CONTENT */}
      <div className="admin-stat-content">

        <p className="admin-stat-title">
          {title}
        </p>

        <h2 className="admin-stat-value">
          {value}
        </h2>

        {description && (
          <p className="admin-stat-description">
            {description}
          </p>
        )}

      </div>

      {/* TREND */}
      {trend && (
        <div className="admin-stat-trend">
          <ArrowUpRight size={15} />
          <span>{trend}</span>
        </div>
      )}

    </div>
  );
}

export default AdminStatCard;