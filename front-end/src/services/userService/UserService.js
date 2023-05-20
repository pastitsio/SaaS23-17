import Keycloak from "keycloak-js";


const _kc = new Keycloak('/keycloak.json');
/**
 * Initializes Keycloak instance and calls the provided callback function if successfully authenticated.
 *
 * @param onAuthenticatedCallback
 */
const initKeycloak = (onAuthenticatedCallback) => {
  //   onAuthenticatedCallback()
  // }
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

const getToken = () => _kc.token;

const getUsername = () => _kc.tokenParsed?.preferred_username;

const doLogin = _kc.login;

const doLogout = () => {
  sessionStorage.removeItem('userInfo');
  _kc.logout();
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
  getToken,
  getUsername,
  hasRole,
  initKeycloak,
  isLoggedIn,
  updateToken,
};

export default UserService;
