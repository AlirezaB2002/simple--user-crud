require('dotenv').config()
const {MongoClient, ObjectId} = require('mongodb')
const url = process.env.MONGODB_URL;
const client = new MongoClient(url);
const dbName = process.env.MONGODB_DB_NAME;


const Database = require('../database/db');
const databaseInterface = new Database(client);

const collectionName = 'users' ;

module.exports = class User {
    #database;
    constructor() {
        this.#database = databaseInterface;
    }
    async insertUser(userInfo) {
         await this.#database.insertOne(userInfo,collectionName)
    }
    async getUsers() {
        return await this.#database.findAll(collectionName);
    }
    async getUserById(id) {
        return await this.#database.findById(id,collectionName);
    }
    async getByUserName(userName) {
        return await this.#database.findOne(userName,collectionName)
    }
    async deleteUser(userInfo) {
        return await this.#database.deleteOne(userInfo,collectionName)
    }
    async updateUser(userId, userInfo) {
        // بررسی اینکه userId یک ObjectId معتبر است
        if (!(userId instanceof ObjectId)) {
            if (!ObjectId.isValid(userId)) {
                throw new Error('Invalid ObjectId format');
            }
            // اگر userId یک رشته است، تبدیل به ObjectId
            userId = new ObjectId(userId);
        }
        return await this.#database.updateOne(userId, userInfo, collectionName);
    }


}
