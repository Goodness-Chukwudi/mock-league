"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_config_1 = require("../common/config/app_config");
const enum_1 = require("../data/enums/enum");
/**
 * An abstract class that provides methods for performing DB queries.
 * Classes(entity repositories mostly) that extends this class:
 * - provide the interface of the mongoose document schema
 * - provide the mongoose model in the constructor
 * - inherit it's database access methods
 * @param {Model<T>} Model A mongoose model on which the query is performed
 * @param {T} interface of the model schema
 * @param {TCreatePayload} interface of the payload to create the  document
 * @param {TDocument} interface of the document schema
*/
class DBQuery {
    constructor(Model) {
        this.Model = Model;
    }
    /**
     * Saves document using mongoose's save api.
     * @param {TCreate} data Document to be saved
     * @param {IQueryOptions} options An optional object containing parameters that can be passed to the mongoose query
    */
    save(data, options) {
        try {
            const model = new this.Model(data);
            return model.save({ session: options === null || options === void 0 ? void 0 : options.session });
        }
        catch (error) {
            throw error;
        }
    }
    /**
     * Fetches all documents that matches the provided query
     * @param {FilterQuery<T>} query An optional mongo query to fetch documents that matched the filter. Returns all documents if query isn't provided
     * @param {IQueryOptions} options An optional object containing parameters that can be passed to the mongoose query
    */
    find(query = {}, options) {
        const finalQuery = query.status ? query : Object.assign(query, { status: { $ne: enum_1.ITEM_STATUS.DELETED } });
        return new Promise((resolve, reject) => {
            this.Model.find(finalQuery)
                .session((options === null || options === void 0 ? void 0 : options.session) || null)
                .sort((options === null || options === void 0 ? void 0 : options.sort) || { created_at: -1 })
                .limit((options === null || options === void 0 ? void 0 : options.limit) || 10)
                .select((options === null || options === void 0 ? void 0 : options.selectedFields) || [])
                .then((data) => {
                resolve(data);
            })
                .catch((e) => {
                reject(e);
            });
        });
    }
    /**
     * Fetches a paginated list of documents that matches the provided filter.
     * @param {FilterQuery<T>} query An optional mongo query to fetch a list of documents that matched the filter
     * @param {IQueryOptions} options An optional object containing parameters that can be passed to the mongoose query
    */
    paginate(query = {}, options) {
        const finalQuery = query.status ? query : Object.assign(query, { status: { $ne: enum_1.ITEM_STATUS.DELETED } });
        const paginationOptions = {
            select: (options === null || options === void 0 ? void 0 : options.selectedFields) || [],
            page: (options === null || options === void 0 ? void 0 : options.page) || 1,
            limit: (options === null || options === void 0 ? void 0 : options.limit) || 10,
            sort: (options === null || options === void 0 ? void 0 : options.sort) || { created_at: -1 },
            customLabels: app_config_1.PaginationCustomLabels
        };
        return new Promise((resolve, reject) => {
            // @ts-ignore
            this.Model.paginate(finalQuery, paginationOptions)
                .then((data) => {
                resolve(data);
            })
                .catch((e) => {
                reject(e);
            });
        });
    }
    /**
     * Fetches a document with the provided id.
     * @param {string} id The object id of the document to be fetched
     *  @param {IQueryOptions} options An optional object containing parameters that can be passed to the mongoose query
    */
    findById(id, options) {
        return new Promise((resolve, reject) => {
            this.Model.findById(id)
                .session((options === null || options === void 0 ? void 0 : options.session) || null)
                .select((options === null || options === void 0 ? void 0 : options.selectedFields) || [])
                .then((data) => {
                resolve(data);
            })
                .catch((e) => {
                reject(e);
            });
        });
    }
    /**
     * Fetches a document with the provided id. The specified ref paths are populated
     * @param {string} id The object id of the document to be fetched
     *  @param {IQueryOptions} options An optional object containing parameters that can be passed to the mongoose query
    */
    findByIdAndPopulate(id, options) {
        return new Promise((resolve, reject) => {
            this.Model.findById(id)
                .populate((options === null || options === void 0 ? void 0 : options.populatedFields) || [])
                .session((options === null || options === void 0 ? void 0 : options.session) || null)
                .select((options === null || options === void 0 ? void 0 : options.selectedFields) || [])
                .then((data) => {
                resolve(data);
            })
                .catch((e) => {
                reject(e);
            });
        });
    }
    /**
     * Fetches a document that matched the provided filter.
     * @param {FilterQuery<T>} query An mongo query to fetch a document that matches the filter
     *  @param {IQueryOptions} options An optional object containing parameters that can be passed to the mongoose query
    */
    findOne(query = {}, options) {
        const finalQuery = query.status ? query : Object.assign(query, { status: { $ne: enum_1.ITEM_STATUS.DELETED } });
        return new Promise((resolve, reject) => {
            this.Model.findOne(finalQuery)
                .session((options === null || options === void 0 ? void 0 : options.session) || null)
                .select((options === null || options === void 0 ? void 0 : options.selectedFields) || [])
                .then((data) => {
                resolve(data);
            })
                .catch((e) => {
                reject(e);
            });
        });
    }
    /**
     * Fetches a document that matched the provided filter. The specified ref paths are populated
     * @param {FilterQuery<T>} query An optional mongo query to fetch a list of documents that match filter
     *  @param {IQueryOptions} options An optional object containing parameters that can be passed to the mongoose query
    */
    findOneAndPopulate(query = {}, options) {
        const finalQuery = query.status ? query : Object.assign(query, { status: { $ne: enum_1.ITEM_STATUS.DELETED } });
        return new Promise((resolve, reject) => {
            this.Model.findOne(finalQuery)
                .populate((options === null || options === void 0 ? void 0 : options.populatedFields) || [])
                .session((options === null || options === void 0 ? void 0 : options.session) || null)
                .select((options === null || options === void 0 ? void 0 : options.selectedFields) || [])
                .then((data) => {
                resolve(data);
            })
                .catch((e) => {
                reject(e);
            });
        });
    }
    /**
     * Updates a document that matches the provided object id
     * @param {string} id The object id of the document to be updated
     *  @param {IQueryOptions} options An optional object containing parameters that can be passed to the mongoose query
    */
    updateById(id, data, options) {
        return new Promise((resolve, reject) => {
            this.Model.findByIdAndUpdate(id, data, { new: true })
                .session((options === null || options === void 0 ? void 0 : options.session) || null)
                .select((options === null || options === void 0 ? void 0 : options.selectedFields) || [])
                .then((data) => {
                resolve(data);
            })
                .catch((e) => {
                reject(e);
            });
        });
    }
    /**
     * Deletes the document with the id
     * @param {string} query ObjectId of the document to be deleted
     *  @param {IQueryOptions} options An optional object containing parameters that can be passed to the mongoose query
    */
    deleteById(id, session) {
        try {
            return this.Model.findByIdAndDelete(id).session(session || null).exec();
        }
        catch (error) {
            throw error;
        }
    }
}
exports.default = DBQuery;
//# sourceMappingURL=DBQuery.js.map