const { BadRequest, Unauthorized } = require("../errors/errors");

const authUser = (req, res, next) => {
    const email = req.params.email || req.body.email || req.query.email;
    const authEmail = req.kauth.grant.access_token.content.email;
    
    if (!email || !authEmail) {
        throw new BadRequest("Email field is mandatory");
    }

    if (email !== authEmail) {
        throw new Unauthorized('You are not allowed access to this resource');
    }
    next();
}; 

module.exports = authUser;