const joi = require('joi');

// اسکیمای حذف کاربر
const deleteUserSchema = joi.object({
    userName: joi.string()
        .alphanum()
        .min(3)
        .max(30)
        .required()
        .messages({
            'string.alphanum': 'User name must contain only letters and numbers.',
            'string.min': 'User name must be at least 3 characters long.',
            'string.max': 'User name must be less than or equal to 30 characters.',
            'any.required': 'User name is required.',
        }),

    password: joi.string()
        .pattern(new RegExp('^(?=.*[A-Z])(?=.*\\d)[A-Za-z\\d]{8,}$'))
        .required()
        .messages({
            'string.pattern.base': 'Password must contain one uppercase letter, one number, and be at least 8 characters long.',
            'any.required': 'Password is required.',
        }),
});

module.exports = deleteUserSchema;
