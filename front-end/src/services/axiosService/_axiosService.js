import axios from 'axios';
import { UserService } from '..';

/**
 * Interceptor for http requests. Appends the access token
 * at the headers of every request.
 */
const API_URL = 'http://localhost:4000/';

axios.interceptors.request.use(
  (config) => {
    if (UserService.isLoggedIn()) {
      const cb = () => {
        config.headers['Authorization'] = `Bearer ${UserService.getToken()}`;
      }
      UserService.updateToken(cb);

      config.cancelToken = new axios.CancelToken((cancel) => {
        config.cancel = cancel
      });

      return config;
    }
  },
  (error) => {
    Promise.reject(error);
  }
);

const api = axios.create({
  baseURL: API_URL
});

export default api;
