import Keycloak from "keycloak-js";

const _kc = new Keycloak('/keycloak.json');

/**
 * Initializes Keycloak instance and calls the provided callback function if successfully authenticated.
 *
 * @param onAuthenticatedCallback
 */
const initKeycloak = (onAuthenticatedCallback) => {
  _kc.init({
    onLoad: 'check-sso',
    silentCheckSsoRedirectUri: window.location.origin + '/silent-check-sso.html',
    pkceMethod: 'S256',
  })
    .then((authenticated) => {
      if (!authenticated) {
        console.log("User is not authenticated!");
      }
      onAuthenticatedCallback();
    })
    .catch(console.error);

};

/**
 *  Simulate an API call.
 *  On resolve, update user session as well.
 * 
 *  MUST BE CALLED between transactions to update credit balance.
 *  */
const getUserInfo = async () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const response = {
        new_user: true,
        _id: 1234567810,
        email: 'demos@testos.com',
        number_of_charts: '0',
        last_login: 1682970603153
      };

      sessionStorage.setItem('userInfo', JSON.stringify(response));
      resolve(response);
      // reject(new Error('Failed to fetch user info'));
    }, 2500);
  });
};

const getUsername = () => _kc.tokenParsed?.preferred_username;

const doLogin = _kc.login;

const doLogout = async () => {
  await _kc.logout();
  sessionStorage.removeItem('userInfo');

  // const requestBody = { email: getEmail(), lastLogoutTimestamp: Date.now() };
  // dbConnector.saveMailTimestamp(requestBody);
};

const getId = () => _kc.tokenParsed?.sub;

const isLoggedIn = () => !!_kc.token;

const updateToken = (successCallback) =>
  _kc.updateToken(5)
    .then(successCallback)
    .catch(doLogin);

const hasRole = (roles) => roles.some((role) => _kc.hasRealmRole(role));

const UserService = {
  doLogin,
  doLogout,
  getId,
  getUsername,
  getUserInfo,
  hasRole,
  initKeycloak,
  isLoggedIn,
  updateToken,
};

export default UserService;
