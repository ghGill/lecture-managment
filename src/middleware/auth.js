const jwt = require('jsonwebtoken');

function authSecretKey() {
    return process.env.JWT_SECRET_KEY || 'app-secret-key'
};

const authGenerateAccessToken = function(user) {
    try {
        const payload = user;
        const secret = authSecretKey();
        const options = { expiresIn: '1h' };
    
        return jwt.sign(payload, secret, options);
    }
    catch (e) {
        return false;
    }
}

const authVerifyAccessToken = function(token) {
    const secret = authSecretKey();
    
    try {
        const parts = token.split(" ");
        if (parts.length > 1)
            token = parts[1];
        else
            token = parts[0];

        const decoded = jwt.verify(token, secret);
        
        return { success: true, user: decoded};
    } 
    catch (error) {
        return { success: false, error: error.message };
    }
}

const role_admin = ["admin"];
const role_admin_or_teacher = ["teacher", "admin"];
const role_all = ["student", "teacher", "admin"];

const authRolePermission = function(roles=[]) {
    roles = roles.map(role => role.toLowerCase());

    return function(req, res, next) {
                const token = req.headers['authorization'];
                if (!token) {
                    return res.status(401).send('Access Denied. No token provided.');
                }

                const {user} = authVerifyAccessToken(token);

                if (!user)
                    return res.status(401).send('Invalid token.');

                if (roles.includes(user.role.toLowerCase()))
                    next();
                else
                    return res.status(401).send('Access Denied. user is not authorized to perform this action.');
            }
}

module.exports = {
    authSecretKey,
    authGenerateAccessToken,
    authVerifyAccessToken,
    authRolePermission,
    role_admin,
    role_admin_or_teacher,
    role_all
}
