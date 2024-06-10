"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class RequestUtils {
    constructor(router) {
        this.router = router;
        this.router.use((req, res, next) => {
            this.request = req;
            this.response = res;
            next();
        });
    }
    /**
     * Sets the provided data with the provided key to the response.locals object of express instance.
     * @param {string} key The key to be used to save the provided data
     * @param {*} data Data of type any, to be saved
     * @returns  void
    */
    addDataToState(key, data) {
        this.response.locals[key] = data;
    }
    /**
     * fetches the value of the provided key from the response.locals object of express instance.
     * @param {string} key The key to be used to fetch the data
     * @returns {*} The saved data of type any or null
    */
    getDataFromState(key) {
        return this.response.locals[key] || null;
    }
    /**
     * @returns {string[]} an array containing the assigned access roles of the logged in user.
    */
    getUserRoles() {
        var _a;
        return ((_a = this.response.locals) === null || _a === void 0 ? void 0 : _a.user_roles) || [];
    }
    /**
     * @returns {IUserDocument} an object containing details of the logged in user.
    */
    getRequestUser() {
        return this.response.locals.user;
    }
    /**
     * @returns {ILoginSessionDocument} an object containing details of the logged in session.
    */
    getLoginSession() {
        return this.response.locals.login_session;
    }
}
exports.default = RequestUtils;
//# sourceMappingURL=RequestUtils.js.map