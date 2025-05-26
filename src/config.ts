const isDev = window.location.hostname === 'localhost';

export const METAAPP_API_URL = isDev
  ? 'http://127.0.0.1:8000/api/'
  : 'https://metaapp.tudomini.com/api/';
