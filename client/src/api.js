import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const authApi = axios.create({
  baseURL: API_BASE_URL,
});

authApi.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

authApi.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    if (
  (status === 401 || status === 403) &&
  window.location.pathname !== "/login"
) {
  localStorage.removeItem("token");
  window.location.href = "/login";
}
    return Promise.reject(error);
  }
);

const publicApi = axios.create({
  baseURL: API_BASE_URL,
});

export { authApi, publicApi };