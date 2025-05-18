import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useApps } from '../contexts/AppsContext';
import './AppSidebar.css';

const AppSidebar: React.FC = () => {
  const { apps } = useApps();
  const navigate = useNavigate();
  const { id: selectedAppId } = useParams<{ id: string }>();

  return (
    <div className="app-sidebar">
      <h6 className="sidebar-title">Apps</h6>

      {apps.map((app) => (
        <div
          key={app.id}
          className={`app-item ${String(app.id) === selectedAppId ? 'active' : ''}`}
          onClick={() => navigate(`/meta-app-collector/apps/${app.id}`)}
        >
          <img src={app.iconUrl} alt={app.name} className="app-icon" />
          <span className="app-name">{app.name}</span>
        </div>
      ))}

      <div
        className="app-item new-app"
        onClick={() => navigate('/meta-app-collector/apps/new')}
      >
        <div className="app-icon new-app-icon d-flex align-items-center justify-content-center">
          <strong>+</strong>
        </div>
        <span className="app-name">New App</span>
      </div>
    </div>
  );
};

export default AppSidebar;
