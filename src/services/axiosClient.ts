import axios from 'axios';

let authToken: string | undefined = undefined;
// Export the API base URL so other modules (e.g., OAuth button) can build absolute URLs for full-page redirects
// export const API_BASE_URL = 'https://localhost:7283/api';
export const API_BASE_URL = 'https://growmate.azurewebsites.net/api';

export const setAuthToken = (token?: string) => {
  authToken = token;
};

const axiosClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosClient.interceptors.request.use(
  (config) => {
    if (authToken) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${authToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosClient;