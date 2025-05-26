import { Outlet, Navigate } from 'react-router-dom'

const getActiveBackend = () => {
  return localStorage.getItem('ACTIVE_BACKEND') || 'metaapp';
}

const getAccessToken = () => {
  const backend = getActiveBackend();
  if (backend === 'metaapp') {
    return localStorage.getItem('METAAPP_ACCESS_TOKEN');
  } else if (backend === 'reminer') {
    return localStorage.getItem('REMINER_ACCESS_TOKEN');
  }
  return null;
}

const getRefreshToken = () => {
  const backend = getActiveBackend();
  if (backend === 'metaapp') {
    return localStorage.getItem('METAAPP_REFRESH_TOKEN');
  } else if (backend === 'reminer') {
    return localStorage.getItem('REMINER_REFRESH_TOKEN');
  }
  return null;
}

const PrivateRoutes = () => {
  const accessToken = getAccessToken();
  const refreshToken = getRefreshToken();

  return accessToken && refreshToken ? <Outlet /> : <Navigate to="/login" />;
}

export default PrivateRoutes;
