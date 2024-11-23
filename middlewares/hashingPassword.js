const bcrypt = require("bcrypt");
const saltRounds = 10;

async function hashingPassword(password) {
    try {
        return  await bcrypt.hash(password, saltRounds);
    } catch (error) {
        console.log('error hashing password' , error);
        throw error;
    }
}

async function verifyPasswordHash(password, storedHash) {
    try {
        return await bcrypt.compare(password, storedHash);
    } catch (error) {
        console.log('error hashing password' , error);
        throw error;
    }
}

module.exports = {
    hashingPassword,
    verifyPasswordHash,
}