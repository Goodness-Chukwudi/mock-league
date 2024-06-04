import moment from 'moment';

/**
 * Adds the specified duration/unit of time to a date object
 * @param {Date} date A javascript date object
 * @param {string} unit a string specifying the unit of time to be added - unit options are [seconds, minutes, hours, days, months]
 * @param {number} amount a number specifying the quantity of the specified unit to be added
 * @returns {Date} a javascript date object
*/
const addToDate = (date: Date, unit: string, amount: number) => {
    //@ts-ignore
    return moment(date).add(amount, unit).toDate();
}

/**
 * Subtracts the specified duration/unit of time from a date object
 * @param {Date} date A javascript date object
 * @param {string} unit a string specifying the unit of time to be subtracted - unit options are [seconds, minutes, hours, days, months]
 * @param {number} amount a number specifying the quantity of the specified unit to be subtracted
 * @returns {Date} a javascript date object
*/
const subtractFromDate = (date: Date, unit: string, amount: number) => {
    //@ts-ignore
    return moment(date).subtract(amount, unit).toDate();
}

/**
 * Gets a date that it's equivalent to the beginning of the provided date object
 * @param {Date} date A javascript date object.
 * @returns {Date} a javascript date object
*/
const getStartOfDay = (date: Date) => {
    return moment(date).startOf("day").toDate();
}

/**
 * Gets a date that it's equivalent to the ending of the provided date object
 * @param {Date} date A javascript date object.
 * @returns {Date} a javascript date object
*/
const getEndOfDay = (date: Date) => {
    return moment(date).endOf("day").toDate();
}

export {
    getEndOfDay,
    getStartOfDay,
    subtractFromDate,
    addToDate
};