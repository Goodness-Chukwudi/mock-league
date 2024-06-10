"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.date = exports.objectId = void 0;
const mongoose_1 = require("mongoose");
/**
 * A Joi extension for validating mongo object ids
 * - the extension factory returned by this method, provides custom validation for object ids
 * @returns an extension factory function of type ObjectIdExtension for object mongo object ids
*/
function objectIdExtension() {
    const extension = (joi) => ({
        type: "string",
        base: joi.string(),
        messages: {
            'string.objectId': '{{#label}} must be a valid Id',
        },
        rules: {
            objectId: {
                validate: (value, helpers) => {
                    const alphaNumRegex = new RegExp(/^[a-z0-9]+$/);
                    if (!(0, mongoose_1.isValidObjectId)(value) || !alphaNumRegex.test(value)) {
                        return helpers.error('string.objectId');
                    }
                    return value;
                }
            }
        }
    });
    return extension;
}
/**
 * A Joi extension for validating dates
 * - the extension factory returned by this method, provides custom validation for dates in multiple formats
 * @returns an extension factory function for validating dates
*/
function dateExtension() {
    return require('@joi/date');
}
const objectId = objectIdExtension();
exports.objectId = objectId;
const date = dateExtension();
exports.date = date;
//# sourceMappingURL=joi_extensions.js.map