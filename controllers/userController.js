const UserModel = require('../models/User');
const userModel = new UserModel();
const hashPassword = require('../middlewares/hashingPassword');
const hiddenPassword = require('../middlewares/hiddenUserPassword');
const {isError} = require("joi");

class UserController {
    #request;
    #response;
    static instance; 

    constructor() {
        if (UserController.instance) {
            return UserController.instance;
        }
        
        UserController.instance = this;
    }

    initialize(req, res) {
        this.#request = req;
        this.#response = res;
    }
    #sendResponse(body, statusCode, contentType = 'application/json') {
        this.#response.writeHead(statusCode, {'Content-Type': contentType});
        this.#response.write(JSON.stringify(body));
        this.#response.end();
    }
    validationError(error) {
        this.#sendResponse({message: error.details[0].message, body: error.details[0].context.value}, 402);
    }

    async addUser(data) {
        try {
            const hashedPassword = await hashPassword.hashingPassword(data.password);
            data = {...data, password: hashedPassword};
            await userModel.insertUser(data);
            this.#sendResponse({
                message: 'User added successfully',
                body: hiddenPassword(data)
            }, 201);
        } catch (error) {
            console.log(error);
            this.#sendResponse({message: 'an error occurred!'}, 500);
        }
    }
    getAllUsers() {
            return new Promise( (resolve, reject) => {
                userModel.getUsers()
                    .then(allUsers => {
                        const filteredUsers = hiddenPassword(allUsers)
                        this.#sendResponse({
                            message: 'successfully',
                            values: filteredUsers
                        }, 200,);
                        resolve('All users get successfully :))) ');
                    })
                    .catch ((error) => {
                    console.log(error);
                    this.#sendResponse({message: 'an error occurred!'}, 500);
                    reject(error);
                })
            })
        }
    async getUserById(id) {
        try {
            const user = await userModel.getUserById(id);

            if (user.status === 200) {
                this.#sendResponse({
                    message: 'Successfully retrieved user by ID',
                    body:hiddenPassword(user.data) // hidden the password from data 
                }, 200);
            } else if (user.isError && user.status === 400) {
                this.#sendResponse({
                    message: user.message,
                    body: null
                }, 400);
            } else if (user.isError && user.status === 404) {
                this.#sendResponse({
                    message: user.message,
                    body: null
                }, 404);
            }
        } catch (error) {
            console.error("Error in getUserById:", error);
            this.#sendResponse({
                message: 'An error occurred while retrieving the user',
                body: null
            }, 500);
        }
    }
    async deleteUser(data) {
        try {
            const checkUser = await userModel.getByUserName( {userName : data.userName} );

            if (!checkUser) {
                return this.#sendResponse({
                    message: 'User not found!',
                    body: null
                }, 404);
            }

            const isPasswordValid = await hashPassword.verifyPasswordHash(data.password, checkUser.password);
            if (!isPasswordValid) {
                return this.#sendResponse({
                    message: 'Incorrect password!',
                    body: null
                }, 401);
            }

            const value = await userModel.deleteUser({userName : data.userName});
            return this.#sendResponse({
                message: value.message,
                body: { ...value, message: undefined }
            }, 200);
        } catch (error) {
            console.error("Error while deleting user:", error);
            return this.#sendResponse({
                message: 'Internal Server Error',
                body: null
            }, 500);
        }
    }
    async updateUser(data) {
        try {
            const checkUser = await userModel.getByUserName( {userName : data.oldUserName} );
            if (!checkUser) {
                return this.#sendResponse({
                    message: 'User not found!',
                    body: null
                }, 404);
            }
            const isPasswordValid = await hashPassword.verifyPasswordHash(data.oldPassword, checkUser.password);
            if (!isPasswordValid) {
                return this.#sendResponse({
                    message: 'Incorrect password!',
                    body: null
                }, 401);
            }
            if(data.password) {
                const hashedPassword = await hashPassword.hashingPassword(data.password);
                data = {...data, password: hashedPassword};
            }

            const filteredUserData = Object.fromEntries(Object.entries(data).filter(([key, value]) =>
                !key.startsWith('old') && value !== undefined && value !== null
            ))
            const value = await userModel.updateUser(checkUser._id,filteredUserData);
            console.log(value)
            return this.#sendResponse({
                message: value.message,
                body: hiddenPassword(value.body)
            }, 200);
        } catch (error) {
            console.error("Error while deleting user:", error);
            return this.#sendResponse({
                message: 'Internal Server Error',
                body: null
            }, 500);
        }
    }


}
module.exports = UserController;
