"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FIXTURE_STATUS = exports.TEAM_STATUS = exports.USER_ROLES = exports.ITEM_STATUS = exports.PASSWORD_STATUS = exports.BIT = exports.GENDER = void 0;
const GENDER = Object.freeze({
    MALE: "male",
    FEMALE: "female",
    OTHER: "others"
});
exports.GENDER = GENDER;
const BIT = Object.freeze({
    ON: 1,
    OFF: 0
});
exports.BIT = BIT;
const PASSWORD_STATUS = Object.freeze({
    ACTIVE: "active",
    DEACTIVATED: "deactivated",
    COMPROMISED: "compromised",
    BLACKLISTED: "blacklisted"
});
exports.PASSWORD_STATUS = PASSWORD_STATUS;
const ITEM_STATUS = Object.freeze({
    ACTIVE: 'active',
    DEACTIVATED: 'deactivated',
    DELETED: 'deleted',
    APPROVED: 'approved',
});
exports.ITEM_STATUS = ITEM_STATUS;
const USER_ROLES = Object.freeze({
    ADMIN: "admin",
    SUPER_ADMIN: "super-admin"
});
exports.USER_ROLES = USER_ROLES;
const TEAM_STATUS = Object.freeze({
    ACTIVE: "active",
    IN_ACTIVE: "in-active",
    RELEGATED: "relegated",
    SUSPENDED: "suspended",
    BANNED: "banned"
});
exports.TEAM_STATUS = TEAM_STATUS;
const FIXTURE_STATUS = Object.freeze({
    PENDING: "pending",
    COMPLETED: "completed",
    UPCOMING: "upcoming",
    IN_PROGRESS: "in-progress",
    OUTSTANDING: "outstanding",
    DELAYED: "delayed",
    CANCELLED: "cancelled",
    POSTPONED: "postponed"
});
exports.FIXTURE_STATUS = FIXTURE_STATUS;
//# sourceMappingURL=enum.js.map