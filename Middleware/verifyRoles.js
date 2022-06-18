const verifyRoles = (...allowRoles) => {
    return (req, res, next) => {
        if(!req?.roles) return res.sendStatus(401);

        const roles = [...allowRoles];
        const userRoles = req.roles;
        const hasAccess = userRoles.map(role => roles.includes(role)).find(val => val === true);

        if(!hasAccess) return res.sendStatus(401);

        next();
    }
}

module.exports = verifyRoles;