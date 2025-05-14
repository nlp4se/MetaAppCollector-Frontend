import React from 'react';
import { AppSummaryDTO } from '../DTOs/AppSummaryDTO';
import './AppSidebar.css';

interface Props {
  apps: AppSummaryDTO[];
  selectedAppId: string | null;
  onSelectApp: (appId: string) => void;
}

const AppSidebar: React.FC<Props> = ({ apps, selectedAppId, onSelectApp }) => {
  return (
    <div className="app-sidebar">
      <h6 className="sidebar-title">Apps</h6>

      {apps.map((app) => (
        <div
          key={app.id}
          className={`app-item ${app.id === selectedAppId ? 'active' : ''}`}
          onClick={() => onSelectApp(app.id)}
        >
          <img src={app.iconUrl} alt={app.name} className="app-icon" />
          <span className="app-name">{app.name}</span>
        </div>
      ))}

      <div
  className="app-item new-app"
  onClick={() => onSelectApp('new')}
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
