const authUser = require('./auth-user');
const pageNotFound = require('./page-not-found');
const errorHandlerMiddleware = require('./error-handler');

module.exports = {
    authUser,
    pageNotFound,
    errorHandlerMiddleware
}