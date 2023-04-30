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

const getUserProfile = async () => {
  const profile = await _kc.loadUserProfile();
  console.log('profile :>> ', _kc.tokenParsed);
  return profile;
};

const getUsername = () => _kc.tokenParsed?.preferred_username;

// const getEmail = () => _kc.tokenParsed?.email;

const doLogin = _kc.login;

const doLogout = async () => {
  await _kc.logout();
  // const requestBody = { email: getEmail(), lastLogoutTimestamp: Date.now() };
  // dbConnector.saveMailTimestamp(requestBody);
};

const getId = () => _kc.tokenParsed?.sub;

// const getToken = () => _kc.token;

const isLoggedIn = () => !!_kc.token;

const updateToken = (successCallback) =>
  _kc.updateToken(5)
    .then(successCallback)
    .catch(doLogin);

const hasRole = (roles) => roles.some((role) => _kc.hasRealmRole(role));

const checkNewUser = () => {
  return new Promise((resolve) => {
    // Simulate an API call
    setTimeout(() => {
      resolve({ 
        newUser: true, 
        msg: 'value2'
      });
    }, 2500);
  });
}

const UserService = {
  checkNewUser,
  doLogin,
  doLogout,
  getId,
  getUsername,
  getUserProfile,
  hasRole,
  initKeycloak,
  isLoggedIn,
  updateToken,
};

export default UserService;
