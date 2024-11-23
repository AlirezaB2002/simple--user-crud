const userSchemaToAdd = require('../schemas/addUserSchema');
const userSchemaToDelete = require('../schemas/deleteUserSchema');
const userSchemaToUpdate = require('../schemas/updateUserSchema');
const UserController = require('../controllers/userController');
const userController = UserController.instance;

function validationToAdd(userData) {
    const {error, value} = userSchemaToAdd.validate(userData);
    if(error) {
        console.error('Validation error:', error.details[0].message);
        userController.validationError(error);
    } else {
        console.log('Validation successful:', value);
        userController.addUser(userData)
            .catch(error => console.log(error));
    }
}

function validationToDelete(userData) {
    const {error, value} = userSchemaToDelete.validate(userData);
    if(error) {
        console.error('Validation error:', error.details[0].message);
        userController.validationError(error);
    } else {
        console.log('Validation successful:', value);
        userController.deleteUser(userData)
            .catch(error => console.log(error));
    }
}
function validationToUpdate(userData) {
    const {error, value} = userSchemaToUpdate.validate(userData)
    if(error) {
        console.error('Validation error:', error.details[0].message);
        userController.validationError(error);
    } else {
        console.log('Validation successful:', value);
        userController.updateUser(userData)
            .catch(error => console.log(error));
    }
}
module.exports = {
    validationToAdd,
    validationToDelete,
    validationToUpdate
}