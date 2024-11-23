const joi = require('joi');


const updateUserSchema = joi.object({
    oldUserName : joi.string()
        .alphanum()
        .required()
        .min(3)
        .max(30)
        .messages({
            'string.pattern.base': 'user name must contain only letters and between 3 to 30 characters.',
        }),
    oldPassword : joi.string()
        .pattern(new RegExp('^(?=.*[A-Z])(?=.*\\d)[A-Za-z\\d]{8,}$'))
        .required()
        .messages({
            'string.pattern.base': 'password must contain one big letter and one number and greater than 8 characters.',
        }),
    userName : joi.string()
        .alphanum()
        .min(3)
        .max(30)
        .messages({
            'string.pattern.base': 'user name must contain only letters and between 3 to 30 characters.',
        }),
    password : joi.string()
        .pattern(new RegExp('^(?=.*[A-Z])(?=.*\\d)[A-Za-z\\d]{8,}$'))
        .messages({
            'string.pattern.base': 'password must contain one big letter and one number and greater than 8 characters.',
        }),
    email : joi.string()
        .email({ tlds: { allow: ['com', 'org'] } })
        .messages({
            'string.pattern.base': 'email must be with com or org domain',
        }),
    firstName : joi.string()
        .pattern(/^[a-zA-Z]+$/)
        .min(3)
        .max(30)
        .messages({
            'string.pattern.base': 'First name must contain only letters.',
        }),
    lastName: joi.string()
        .min(2)
        .max(30)
        .pattern(/^[a-zA-Z]+$/)
        .messages({
            'string.pattern.base': 'Last name must contain only letters.',
        }),
})

module.exports = updateUserSchema;
