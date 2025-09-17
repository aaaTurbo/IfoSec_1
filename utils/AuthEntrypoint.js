const jwt = require('jsonwebtoken');

const express = require("express");
const authEntrypoint = express();

const cookieParser = require('cookie-parser');
authEntrypoint.use(cookieParser());

const AuthProvider = require("./AuthProvider");

authEntrypoint.all("*splat", async (req, res, next) => {

    try {
        let provider = await AuthProvider.getInstance();

        res.locals = {
            username:
                await provider.authenticate(
                        req.headers.authorization.replace('Bearer ', '')
                )
        };

        return next();
    } catch (error) {

        console.error('Error verifying token:', error);

        if (error instanceof jwt.TokenExpiredError) {
            res.sendStatus(401);
        } else {
            res.sendStatus(403);
        }
    }

})

module.exports = authEntrypoint;