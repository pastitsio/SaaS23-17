const { BadRequest, Unauthorized } = require('../errors/custom-errors');

const authzUser = (req, res, next) => {
    const email = req.params.email || req.body.email || req.query.email;
    const reqEmail = req.kauth.grant.access_token.content.email;

    if (!email) {
        throw new BadRequest('Field email is mandatory');
    }

    if (!(email === reqEmail)) {
        throw new Unauthorized('Access to this resource is restricted');
    }
    next();
};

module.exports = authzUser;