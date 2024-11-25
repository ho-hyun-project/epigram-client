import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API;

const getToken = () => {
  return (
    localStorage.getItem('access_token') ||
    process.env.NEXT_PUBLIC_ACCESS_TOKEN ||
    ''
  );
};

const instance = axios.create({
  baseURL: API_URL,
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

instance.interceptors.request.use(
  config => {
    const accessToken = getToken();
    config.headers['Authorization'] = `Bearer ${accessToken}`;
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  response => {
    return response;
  },
  async error => {
    const originalRequest = error.config;

    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refresh_token');
        const response = await axios.post(`${API_URL}/auth/refresh-token`, {
          refreshToken: refreshToken,
        });
        const newAccessToken = response.data.accessToken;
        localStorage.setItem('access_token', newAccessToken);
        originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;

        return instance(originalRequest);
      } catch (err) {
        console.error('리프레시 토큰 갱신에 실패했습니다.', err);
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);
export default instance;
