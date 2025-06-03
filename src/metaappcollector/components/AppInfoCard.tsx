import React from 'react';
import { AppDetailDTO } from '../DTOs/AppDetailDTO';
import { Button, Image } from 'react-bootstrap';

interface Props {
  app: AppDetailDTO;
  onEdit: () => void;
  onDelete: () => void;
  onExportCSV: () => void;
}

const AppInfoCard: React.FC<Props> = ({ app, onEdit, onDelete, onExportCSV }) => {
  return (
    <>
      <div className="text-center mb-4">
        <Image src={app.iconUrl} alt={`${app.name} logo`} roundedCircle width={100} height={100} />
      </div>

      <h2 className="text-center">{app.name}</h2>
      <p>{app.description || 'No description available.'}</p>
      <p><strong>App Store ID:</strong> {app.appStoreId || 'N/A'}</p>
      <p><strong>Play Store ID:</strong> {app.playStoreId || 'N/A'}</p>
      <p><strong>Developer:</strong> {app.developer || 'N/A'}</p>
      <p><strong>Release Date:</strong> {app.releaseDate || 'N/A'}</p>
      <p><strong>PEGI:</strong> {app.pegi || 'N/A'}</p>

      {app.sizeMB != null && (
        <p><strong>Size:</strong> {app.sizeMB} MB</p>
      )}

      <div>
        <strong>Available on:</strong>
        <ul>
          {app.availableOnAndroid && <li>Android</li>}
          {app.availableOnIos && <li>iOS</li>}
        </ul>
      </div>

      <div className="d-flex justify-content-end gap-2 mt-3">
        <Button variant="secondary" size="sm" onClick={onEdit}>Edit</Button>
        <Button variant="danger" size="sm" onClick={onDelete}>Remove</Button>
      </div>

      <div className="d-flex justify-content-end gap-2 mt-3">
        <Button variant="success" size="sm" onClick={onExportCSV}>
          Export all metrics to CSV
        </Button>
      </div>
    </>
  );
};

export default AppInfoCard;
