const {ObjectId} = require("mongodb");

module.exports = class Database {
    #database;
    #db;
    constructor(dbService) {
        this.#database = dbService;
    }
    async #connectToDb(){
        if(!this.#db){
            await this.#database.connect();
            this.#db = await this.#database.db(process.env.MONGODB_DB_NAME);
            console.log('Connected successfully !');
        }
        return this.#db;
    }
    async #getCollection(collectionName) {
        const db = await this.#connectToDb()
        return  await db.collection(collectionName);
    }
    async findOne (query, collectionName) {
        const collection =await this.#getCollection(collectionName);
        return await collection.findOne(query);
    }
    async insertOne (data, collectionName) {
        const collection = await this.#getCollection(collectionName);
        const result = await collection.insertOne(data);
        console.log("data inserted successfully!");
        return result;
    }
    async findAll (collectionName) {
        const collection = await this.#getCollection(collectionName);
        return  await collection.find().toArray();
    }
    async findById(id, collectionName) {
            const collection = await this.#getCollection(collectionName);
            // Check the correctness of the ID format
            if (!ObjectId.isValid(id)) {
                console.error('Invalid ID format!');
                return { isError: true, message: 'Invalid ID format', status: 400 };
            }
            // Search for the document in the database
            const document = await collection.findOne({ _id: new ObjectId(id) });
            // Check if the document is found or not
            if (!document) {
                return { isError: true, message: 'Document not found', status: 404 };
            }
            // return the finded document
            return { isError: false, data: document, status: 200 };
    }
    async deleteOne (query, collectionName) {
        const collection = await this.#getCollection(collectionName);
        const result = await collection.deleteOne(query);

        if(result.deletedCount === 0) {
            return { isError: true, message: 'Document not found!', status: 404 };
        }
        console.log("User Deleted successfully!");
        return { isError: false, message: 'User Deleted successfully!', status: 200 };
    }
    async updateOne (query, data, collectionName) {
        const collection = await this.#getCollection(collectionName);

        const result = await collection.findOneAndUpdate({_id : query}, {$set: data},{returnDocument : 'after'});
        console.log('data updated successfully! : ', result);
        if(result.modifiedCount === 0) {
            return { isError: true, message: 'Document not found!', status: 404 };
        }
        return { isError: false, message: 'User Updated Successfully!',body :result  ,status: 200 };
    }
}
