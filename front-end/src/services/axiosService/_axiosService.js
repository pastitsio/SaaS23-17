import axios from 'axios';
import { UserService } from '..';

/**
 * Interceptor for http requests. Appends the access token
 * at the headers of every request.
 */
const _axios = axios.create();
_axios.interceptors.request.use((config) => {
  if (UserService.isLoggedIn()) {
    const cb = () => {
      config.headers.Authorization = `Bearer ${UserService.getToken()}`;
      return Promise.resolve(config);
    };
    return UserService.updateToken(cb);
  }

  return config;
});


export default _axios