import React from 'react';
import { AppDetailDTO } from '../DTOs/AppDetailDTO';

interface Props {
  app: AppDetailDTO;
}

const AppDetails: React.FC<Props> = ({ app }) => {
  return (
    <div>
      <h2>{app.name}</h2>
      <p>{app.description}</p>
      <p><strong>Developer:</strong> {app.developer}</p>
      <p><strong>Release date:</strong> {app.releaseDate}</p>
      <p><strong>PEGI:</strong> {app.pegi}</p>
      <p><strong>Size:</strong> {app.sizeMB} MB</p>
      <p><strong>Available on:</strong> {app.availableOnAndroid && 'Android '} {app.availableOnIos && 'iOS'}</p>
    </div>
  );
};

export default AppDetails;
