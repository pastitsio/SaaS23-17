import axios from 'axios';
import { UserService } from '..';

/**
 * Interceptor for http requests. Appends the access token
 * at the headers of every request.
 */

const api = axios.create({
  baseURL: process.env.REACT_APP_BACKEND_API_URL
});

api.interceptors.request.use(
  (config) => {
    if (UserService.isLoggedIn()) {
      const cb = () => {
        config.headers.Authorization = `Bearer ${UserService.getToken()}`;
      }
      cb();
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


export default api;
