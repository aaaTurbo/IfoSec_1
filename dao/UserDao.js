const DbProvider =  require("../db/PSQLProvider");
const User =  require("../model/User");

module.exports = class UserDao {

    static async getInstance() {
        if (UserDao.instance)
            return UserDao.instance;

        let instance = new UserDao();
        await instance.init();
        UserDao.instance = instance;

        return UserDao.instance;
    }

    async init() {
        if (!this.db)
            this.db = await DbProvider.getInstance();
    }

    async save(user) {
        if (!(user instanceof User))
            throw new Error('Invalid user instance');

        if (!user.username || !user.password)
            throw new Error('Invalid user');

        try {
            let connection = await this.db.connect();
            const query = `
                INSERT INTO users(username, password)
                VALUES ($1, $2) RETURNING *;
            `
            let result = await connection.query(query, [user.username, user.password]);
            await connection.release();

            if (result)
                return true
            else
                throw new Error('User was not saved!');

        } catch (e) {
            throw new Error('Error saving user: ' + e.message);
        }
    }

    async findByUsername(user) {
        if (!(user instanceof User))
            throw new Error('Invalid user');

        if (!user.username)
            throw new Error('Invalid user');

        try {
            let connection = await this.db.connect();
            const query = `
                SELECT * FROM users WHERE username = $1;
            `
            let result = await connection.query(query, [user.username]);
            await connection.release();

            if (result.rows[0])
                return result.rows[0];
            else
                throw new Error('User not found!');

        } catch (e) {
            throw new Error('Error searching user: ' + e.message);
        }
    }

    async findAll() {

        try {
            let connection = await this.db.connect();
            const query = `SELECT * FROM users;`;

            let result = await connection.query(query);
            await connection.release();

            return result.rows;

        } catch (e) {
            throw new Error('Error searching users: ' + e.message);
        }

    }

}