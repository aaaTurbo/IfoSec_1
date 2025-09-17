const helmet = require("helmet")
const express = require( 'express' );

const AuthModule = require("../modules/AuthModule");
const UserModule = require("../modules/UserModule");

const Application = express();

Application.use(helmet());

Application
    .use(AuthModule.prefix, AuthModule.AuthModule)
    .use(UserModule.prefix, UserModule.UserModule)
    .listen(3000)