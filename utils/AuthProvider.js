const jwt = require('jsonwebtoken');

const cfg = require(`../config/cfg.json`);

module.exports = class AuthProvider {

    constructor() {
        this.authcfg = {
            "aud": cfg.jwt.aud,
            "iss": cfg.jwt.issuer,
            "algorithm": cfg.jwt.algorithms,
        };

        this.secret = cfg.jwt.secret;
    }


    static async getInstance() {
        if (!AuthProvider.instance) {
            AuthProvider.instance = new AuthProvider();
        }

        return AuthProvider.instance;
    }

    async generate(username = "") {
        return jwt
            .sign(
                {"username": username, ...this.authcfg},
                this.secret,
                {expiresIn: "1h"}
            );
    }

    async authenticate(token = "") {
        return jwt.verify(token, this.secret, this.authcfg, (err, decoded) => {
            if (!err) {
                return decoded.username;
            } else {
                throw err;
            }
        })
    }

}