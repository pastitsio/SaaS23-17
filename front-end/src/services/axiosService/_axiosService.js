import axios from 'axios';
import { UserService } from '..';

/**
 * Interceptor for http requests. Appends the access token
 * at the headers of every request.
 */
const _axios = axios.create();
_axios.interceptors.request.use((config) => {
  if (UserService.isLoggedIn()) {
    const source = axios.CancelToken.source();
    const cb = () => {
      config.headers.Authorization = `Bearer ${UserService.getToken()}`;
    };
    UserService.updateToken(cb);
    config.cancelToken = source.token;
  }

  return config;
});


export default _axios