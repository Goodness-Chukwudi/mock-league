"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addToDate = exports.subtractFromDate = exports.getStartOfDay = exports.getEndOfDay = void 0;
const moment_1 = __importDefault(require("moment"));
/**
 * Adds the specified duration/unit of time to a date object
 * @param {Date} date A javascript date object
 * @param {string} unit a string specifying the unit of time to be added - unit options are [seconds, minutes, hours, days, months]
 * @param {number} amount a number specifying the quantity of the specified unit to be added
 * @returns {Date} a javascript date object
*/
const addToDate = (date, unit, amount) => {
    //@ts-ignore
    return (0, moment_1.default)(date).add(amount, unit).toDate();
};
exports.addToDate = addToDate;
/**
 * Subtracts the specified duration/unit of time from a date object
 * @param {Date} date A javascript date object
 * @param {string} unit a string specifying the unit of time to be subtracted - unit options are [seconds, minutes, hours, days, months]
 * @param {number} amount a number specifying the quantity of the specified unit to be subtracted
 * @returns {Date} a javascript date object
*/
const subtractFromDate = (date, unit, amount) => {
    //@ts-ignore
    return (0, moment_1.default)(date).subtract(amount, unit).toDate();
};
exports.subtractFromDate = subtractFromDate;
/**
 * Gets a date that it's equivalent to the beginning of the provided date object
 * @param {Date} date A javascript date object.
 * @returns {Date} a javascript date object
*/
const getStartOfDay = (date) => {
    return (0, moment_1.default)(date).startOf("day").toDate();
};
exports.getStartOfDay = getStartOfDay;
/**
 * Gets a date that it's equivalent to the ending of the provided date object
 * @param {Date} date A javascript date object.
 * @returns {Date} a javascript date object
*/
const getEndOfDay = (date) => {
    return (0, moment_1.default)(date).endOf("day").toDate();
};
exports.getEndOfDay = getEndOfDay;
//# sourceMappingURL=date_utils.js.map