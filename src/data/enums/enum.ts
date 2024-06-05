
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

const TEAM_STATUS = Object.freeze({
    ACTIVE: "active",
    IN_ACTIVE: "in-active",
    RELEGATED: "relegated",
    SUSPENDED: "suspended",
    BANNED: "banned"
});

const FIXTURE_STATUS = Object.freeze({
    UPCOMING: "upcoming",
    IN_PROGRESS: "in-progress",
    PLAYED: "played",
    OUTSTANDING: "outstanding",
    DELAYED: "delayed",
    CANCELLED: "cancelled",
    POSTPONED: "postponed"
});

export {
    GENDER,
    BIT,
    PASSWORD_STATUS,
    ITEM_STATUS,
    USER_ROLES,
    TEAM_STATUS,
    FIXTURE_STATUS
}