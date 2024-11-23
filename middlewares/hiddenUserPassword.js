module.exports = function hiddenUserPassword(userData) {
    if(Array.isArray(userData)) {
        return  userData.map(user => {
            return {...user, password: undefined};
        });
    }
    return {...userData, password: undefined};
}