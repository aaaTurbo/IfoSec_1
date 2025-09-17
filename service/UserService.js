const Dao = require("../dao/UserDao");
const crypto = require("crypto");

module.exports = class UserService {

    static async getInstance() {
        if (UserService.instance)
            return UserService.instance;

        let instance = new UserService();
        await instance.init();
        UserService.instance = instance;

        return UserService.instance;
    }

    async init() {
        if (!this.dao)
            this.dao = await Dao.getInstance();
    }

    async auth(user) {
        user.password = this.hashString(user.password);
        let found = await this.findByUsername(user);
        if (found.password === user.password) {
            return true;
        } else {
            throw new Error("Invalid login");
        }
    }

    async save(user) {
        user.password = this.hashString(user.password);
        return this.dao.save(user);
    }

    async findByUsername(user) {
        return this.dao.findByUsername(user);
    }

    async findAll() {
        return this.dao.findAll();
    }

    hashString(str) {
        return crypto.createHash('md5').update(str).digest("hex");
    }

}