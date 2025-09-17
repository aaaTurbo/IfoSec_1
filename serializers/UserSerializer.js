const User = require("../model/User");

module.exports = class UserSerializer {

    static toJson(user) {
        return {
            name: user.username
        }
    }

    static toUser(json) {
        return new User(
            json.username,
            json.password
        );
    }

}