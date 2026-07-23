import axios from 'axios';

let apiUrl = import.meta.env.VITE_API_URL;
if (!apiUrl) {
  throw new Error('Missing required frontend environment variable: VITE_API_URL');
}

apiUrl = apiUrl.replace(/\/+$/, '');
if (!apiUrl.endsWith('/api')) {
  apiUrl = `${apiUrl}/api`;
}

const client = axios.create({
  baseURL: apiUrl,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

client.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    error.message = error.response?.data?.error?.message || error.message || 'Unable to reach the service.';
    error.code = error.response?.data?.error?.code || error.code || 'NETWORK_ERROR';

    if (status === 401 && typeof window !== 'undefined') {
      window.dispatchEvent(new Event('metroscope:unauthorized'));
    }
    return Promise.reject(error);
  }
);

export default client;
