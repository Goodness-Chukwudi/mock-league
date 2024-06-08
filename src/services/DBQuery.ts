import {Model, ClientSession, UpdateQuery, FilterQuery } from "mongoose";
import { PaginationCustomLabels } from "../common/config/app_config";
import { ITEM_STATUS } from "../data/enums/enum";
import { IQueryOptions, PaginatedDocument } from "../data/interfaces/interfaces";

/**
 * An abstract class that provides methods for performing DB queries.
 * Classes(entity repositories mostly) that extends this class:
 * - provide the interface of the mongoose document schema
 * - provide the mongoose model in the constructor
 * - inherit it's database access methods
 * @param {Model<T>} Model A mongoose model on which the query is performed
 * @param {T} interface of the model schema
 * @param {TCreate} interface of the payload to create the  document
 * @param {TDocument} interface of the document schema
*/
abstract class DBQuery<T, TCreate, TDocument> {

    private readonly Model:Model<Required<T>>;

    constructor(Model:Model<Required<T>>) {
        this.Model = Model;
    }

    /**
     * Saves document using mongoose's save api.
     * @param {TCreate} data Document to be saved
     * @param {IQueryOptions} options An optional object containing parameters that can be passed to the mongoose query
    */
    public save(data: TCreate, options?: IQueryOptions): Promise<TDocument> {
        try {
            const model = new this.Model(data);
            return model.save({session: options?.session}) as Promise<TDocument>;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Fetches all documents that matches the provided query
     * @param {FilterQuery<T>} query An optional mongo query to fetch documents that matched the filter. Returns all documents if query isn't provided
     * @param {IQueryOptions} options An optional object containing parameters that can be passed to the mongoose query
    */
    public find(query:FilterQuery<T> = {}, options?: IQueryOptions): Promise<TDocument[]> {
        const finalQuery = query.status ? query : Object.assign(query, {status: {$ne: ITEM_STATUS.DELETED}});
        return new Promise((resolve, reject) => {
            this.Model.find(finalQuery)
                .session(options?.session || null)
                .sort(options?.sort || {created_at: -1})
                .limit(options?.limit || 10)
                .select(options?.selectedFields || [])
                .then((data) => {
                    resolve(data as TDocument[]);
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
    public paginate(query:FilterQuery<T> = {}, options?: IQueryOptions): Promise<PaginatedDocument<T>> {
        const finalQuery = query.status ? query : Object.assign(query, {status: {$ne: ITEM_STATUS.DELETED}});
        const paginationOptions = {
            select: options?.selectedFields || [],
            page: options?.page || 1,
            limit: options?.limit || 10,
            sort: options?.sort || {created_at: -1},
            customLabels: PaginationCustomLabels
        };

        return new Promise((resolve, reject) => {
            // @ts-ignore
            this.Model.paginate(finalQuery, paginationOptions)
                .then((data: any) => {
                    resolve(data as PaginatedDocument<T>);
                })
                .catch((e:Error) => {
                    reject(e);
                });
        });
    }

    /**
     * Fetches a document with the provided id.
     * @param {string} id The object id of the document to be fetched
     *  @param {IQueryOptions} options An optional object containing parameters that can be passed to the mongoose query
    */
   public findById(id: string, options?: IQueryOptions): Promise<TDocument> {
        return new Promise((resolve, reject) => {
            this.Model.findById(id)
                .session(options?.session || null)
                .select(options?.selectedFields || [])
                .then((data) => {
                    resolve(data as TDocument);
                })
                .catch((e:Error) => {
                    reject(e);
                })
            ;
        });
    }

    /**
     * Fetches a document with the provided id. The specified ref paths are populated
     * @param {string} id The object id of the document to be fetched
     *  @param {IQueryOptions} options An optional object containing parameters that can be passed to the mongoose query
    */
    public findByIdAndPopulate(id:string, options?: IQueryOptions): Promise<TDocument> {
        return new Promise((resolve, reject) => {
            this.Model.findById(id)
                .populate(options?.populatedFields || [])
                .session(options?.session || null)
                .select(options?.selectedFields || [])
                .then((data) => {
                    resolve(data as TDocument);
                })
                .catch((e:Error) => {
                    reject(e);
                })
            ;
        });
    }

    /**
     * Fetches a document that matched the provided filter.
     * @param {FilterQuery<T>} query An mongo query to fetch a document that matches the filter
     *  @param {IQueryOptions} options An optional object containing parameters that can be passed to the mongoose query
    */
    public findOne(query:FilterQuery<T> = {}, options?: IQueryOptions): Promise<TDocument> {
        const finalQuery = query.status ? query : Object.assign(query, {status: {$ne: ITEM_STATUS.DELETED}});
        return new Promise((resolve, reject) => {
            this.Model.findOne(finalQuery)
                .session(options?.session || null)
                .select(options?.selectedFields || [])
                .then((data) => {
                    resolve(data as TDocument);
                })
                .catch((e:Error) => {
                    reject(e);
                })
            ;
        });
    }

    /**
     * Fetches a document that matched the provided filter. The specified ref paths are populated
     * @param {FilterQuery<T>} query An optional mongo query to fetch a list of documents that match filter
     *  @param {IQueryOptions} options An optional object containing parameters that can be passed to the mongoose query
    */
    public findOneAndPopulate(query:FilterQuery<T> = {}, options?: IQueryOptions ): Promise<TDocument> {
        const finalQuery = query.status ? query : Object.assign(query, {status: {$ne: ITEM_STATUS.DELETED}});
        return new Promise((resolve, reject) => {
            this.Model.findOne(finalQuery)
                .populate(options?.populatedFields || [])
                .session(options?.session || null)
                .select(options?.selectedFields || [])
                .then((data:any) => {
                    resolve(data as TDocument);
                })
                .catch((e:Error) => {
                    reject(e);
                })
            ;
        });
    }

    /**
     * Updates a document that matches the provided object id
     * @param {string} id The object id of the document to be updated
     *  @param {IQueryOptions} options An optional object containing parameters that can be passed to the mongoose query
    */
    public updateById(id:string, data:UpdateQuery<T>, options?: IQueryOptions): Promise<TDocument> {
        return new Promise((resolve, reject) => {
            this.Model.findByIdAndUpdate(id, data, {new: true})
            .session(options?.session || null)
            .select(options?.selectedFields || [])
            .then((data) => {
                resolve(data as TDocument);
            })
            .catch((e:Error) => {
                reject(e);
            })
        });
    }

    /**
     * Deletes the document with the id
     * @param {string} query ObjectId of the document to be deleted
     *  @param {IQueryOptions} options An optional object containing parameters that can be passed to the mongoose query
    */
    public deleteById(id:string, session?:ClientSession): Promise<TDocument> {
        try {
            return this.Model.findByIdAndDelete(id).session(session || null).exec() as Promise<TDocument>;
            
        } catch (error) {
            throw error;
        }
    }
}

export default DBQuery;