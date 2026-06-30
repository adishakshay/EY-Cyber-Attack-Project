import React from 'react';
import { useSecurity } from '../context/SecurityContext';
import { Shield, LayoutDashboard, Zap, Database, Clock, LogOut } from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const { logoutAdmin } = useSecurity();

  const menuItems = [
    { id: 'dashboard', label: 'Shield Dashboard', icon: LayoutDashboard },
    { id: 'simulator', label: 'Attack Simulator', icon: Zap },
    { id: 'database', label: 'MongoDB Database', icon: Database },
    { id: 'timeline', label: 'Breach Timeline', icon: Clock },
  ];

  return (
    <div className="sidebar">
      <div>
        <div className="sidebar-logo">
          <div className="sidebar-logo-text">
            <Shield className="sidebar-logo-shield" size={24} />
            <span>LINKEDIN <span className="glow-text-blue">SHIELD</span></span>
          </div>
        </div>

        <div className="sidebar-menu">
          {menuItems.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <div
                key={item.id}
                className={`sidebar-item ${isActive ? 'active' : ''}`}
                onClick={() => setActiveTab(item.id)}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="sidebar-footer">
        <div className="admin-badge">
          <div className="admin-avatar">AA</div>
          <div className="admin-info">
            <span className="admin-name">Adish A</span>
            <span className="admin-role">SOC Director</span>
          </div>
        </div>
        <button onClick={logoutAdmin} className="logout-btn">
          <LogOut size={14} />
          <span>Exit SOC Console</span>
        </button>
      </div>
    </div>
  );
};
