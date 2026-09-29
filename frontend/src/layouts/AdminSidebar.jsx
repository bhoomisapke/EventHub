import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  CalendarDays,
  ClipboardList,
  Ticket,
  CreditCard,
  BarChart3,
  Settings,
  LogOut,
  Home,
} from "lucide-react";
import "./AdminSidebar.css";

function AdminSidebar({ collapsed }) {
  const navigate = useNavigate();

  const menuItems = [
    {
      label: "Dashboard",
      path: "/admin/dashboard",
      icon: LayoutDashboard,
    },
    {
      label: "Users",
      path: "/admin/users",
      icon: Users,
    },
    {
      label: "Events",
      path: "/admin/events",
      icon: CalendarDays,
    },
    {
      label: "Registrations",
      path: "/admin/registrations",
      icon: ClipboardList,
    },
    {
      label: "Categories",
      path: "/admin/categories",
      icon: Ticket,
    },
   
    
   
  ];

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    navigate("/");
  };

  return (
    <aside
      className={`admin-sidebar ${
        collapsed ? "admin-sidebar-collapsed" : ""
      }`}
    >
      <nav className="admin-sidebar-nav">
        <p className="admin-nav-title">MAIN MENU</p>

        <div className="admin-menu-list">
          {menuItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                title={collapsed ? item.label : ""}
                className={({ isActive }) =>
                  `admin-menu-item ${isActive ? "active" : ""}`
                }
              >
                <Icon
                  size={20}
                  strokeWidth={2}
                  className="admin-menu-icon"
                />

                <span>{item.label}</span>
              </NavLink>
            );
          })}

          {/* Back to Website */}
          <button
            type="button"
            className="admin-menu-item admin-menu-button"
            title={collapsed ? "Back to Website" : ""}
            onClick={() => navigate("/")}
          >
            <Home size={20} strokeWidth={2} className="admin-menu-icon" />
            <span>Back to Website</span>
          </button>

          {/* Logout */}
          <button
            type="button"
            className="admin-menu-item admin-menu-button logout"
            title={collapsed ? "Logout" : ""}
            onClick={handleLogout}
          >
            <LogOut size={20} strokeWidth={2} className="admin-menu-icon" />
            <span>Logout</span>
          </button>
        </div>
      </nav>
    </aside>
  );
}

export default AdminSidebar;