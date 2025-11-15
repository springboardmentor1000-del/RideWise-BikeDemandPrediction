import React from "react";
import "./Dashboard.css";
import ridewiseLogo from "../assets/ridewise_logo.png";

const Navbar = ({ activeTab, setActiveTab, apiConnected }) => {
  const tabs = [
    { id: 'dashboard', label: 'DASHBOARD', icon: '📊' },
    { id: 'predictions', label: 'AI PREDICTIONS', icon: '🤖' },
    { id: 'analytics', label: 'ANALYTICS', icon: '📈' },
    { id: 'insights', label: 'INSIGHTS', icon: '💡' },
  ];

  return (
    <nav className="navbar-pro">
      <div className="navbar-container">
        <div className="navbar-left">
          <div className="logo">
            <img src={ridewiseLogo} alt="RideWise" className="logo-image" />
            <span className="logo-text">RIDEWISE</span>
          </div>
          
          <div className="nav-tabs">
            {tabs.map(tab => (
              <button
                key={tab.id}
                className={`nav-tab ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                <span className="tab-icon">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="navbar-right">
          <div className={`api-status ${apiConnected ? 'connected' : 'disconnected'}`}>
            <span className="status-dot"></span>
            {apiConnected ? 'API Connected' : 'API Disconnected'}
          </div>
          
          <div className="user-menu">
            <div className="user-avatar">
              <span>JD</span>
            </div>
            <span className="user-name">Welcome, John</span>
          </div>

          <button className="logout-btn">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
              <polyline points="16 17 21 12 16 7"></polyline>
              <line x1="21" y1="12" x2="9" y2="12"></line>
            </svg>
            LOGOUT
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
