import { useState } from "react";
import {
  LayoutDashboard,
  Users,
  Briefcase,
  UserCog,
  BarChart3,
  Settings,
  ChevronLeft,
} from "lucide-react";
import "./Sidebar.css";
import { NavLink } from "react-router-dom";

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);

  const menuItems = [
    { name: "Dashboard", icon: LayoutDashboard, path: "/" },
    { name: "Leads", icon: Users, path: "/leads" },
    { name: "By Status", icon: Users, path: "/leads/status" },
    { name: "By Agent", icon: Users, path: "/leads/agents" },
    { name: "Sales", icon: Briefcase, path: "/sales" },
    { name: "Agents", icon: UserCog, path: "/agents" },
    { name: "Reports", icon: BarChart3, path: "/reports" },
    { name: "Settings", icon: Settings, path: "/settings" },
  ];

  return (
    <div className="layout">
      {/* SIDEBAR */}
      <aside className={`sidebar ${collapsed ? "collapsed" : ""}`}>
        {/* HEADER */}
        <div className="sidebar-header">
          <NavLink className="brand text-decoration-none text-dark">
            <div className="logo-box">E</div>
            {!collapsed && <span className="logo-text">Eterris CRM</span>}
          </NavLink>

          <button
            className={`toggle-btn ${collapsed ? "collapsed" : ""}`}
            onClick={() => setCollapsed(!collapsed)}
            aria-label="Toggle Sidebar"
          >
            <ChevronLeft size={18} />
          </button>
        </div>

        {/* NAVIGATION */}
        <nav className="nav">
          {menuItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink to={item.path}
                key={item.name}
                className={({ isActive }) =>
                  `nav-item text-decoration-none ${isActive ? "active" : ""}`
                }
              >
                <Icon size={20} className="nav-icon" />
                {!collapsed && (
                  <span className="label">{item.name}</span>
                )}
              </NavLink>
            );
          })}
        </nav>
      </aside>

    </div>
  );
}
