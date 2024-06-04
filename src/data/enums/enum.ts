
const GENDER = Object.freeze({
    MALE: "male",
    FEMALE: "female",
    OTHER: "others"
});

const BIT = Object.freeze({
    ON: 1,
    OFF: 0
});

const PASSWORD_STATUS = Object.freeze({
    ACTIVE: "active",
    DEACTIVATED: "deactivated",
    COMPROMISED: "compromised",
    BLACKLISTED: "blacklisted"
});

const ITEM_STATUS = Object.freeze({
    ACTIVE: 'active',
    DEACTIVATED: 'deactivated',
    DELETED: 'deleted',
    APPROVED: 'approved',
});

const USER_ROLES = Object.freeze({
    ADMIN: "admin",
    SUPER_ADMIN: "super-admin"
});

export {
    GENDER,
    BIT,
    PASSWORD_STATUS,
    ITEM_STATUS,
    USER_ROLES
}