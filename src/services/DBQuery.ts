import {Model, ClientSession, UpdateQuery, FilterQuery } from "mongoose";
import { PaginationCustomLabels } from "../common/config/app_config";
import { ITEM_STATUS } from "../data/enums/enum";
import { DbPopulation, DbSortQuery } from "../data/interfaces/types";
import { PaginatedDocument } from "../data/interfaces/interfaces";

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
     * @param {ClientSession} session An optional mongoose client session, required to commit a running database transaction if any
     * @returns {TDocument} A promise resolving to the saved document
    */
    public save(data: TCreate, session: ClientSession|null = null): Promise<TDocument> {
        try {
            const model = new this.Model(data);
            return model.save({session: session}) as Promise<TDocument>;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Fetches all documents that matches the provided query
     * @param {FilterQuery<T>} query An optional mongo query to fetch documents that matched the filter. Returns all documents if query isn't provided
     * @param {string[]} selectedFields An optional array of string, containing fields in the document that are to be selected
     * @param {DbSortQuery} sort An optional mongoose sort object specifying the field and order to sort the list with
     * @param {ClientSession} session An optional mongoose client session, required if the operation is in a transaction
     * @returns {Promise<TDocument[]>} A promise resolving to a a list of documents that match filter
    */
    public find(query:FilterQuery<T> = {}, limit?:number,  selectedFields?:string|string[], sort?:DbSortQuery, session?:ClientSession): Promise<TDocument[]> {
        const finalQuery = query.status ? query : Object.assign(query, {status: {$ne: ITEM_STATUS.DELETED}});
        return new Promise((resolve, reject) => {
            this.Model.find(finalQuery)
                .session(session || null)
                .sort(sort || {created_at: -1})
                .limit(limit || 10)
                .select(selectedFields || [])
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
     * @param {number} limit Sets the number of documents per page. Default is 10
     * @param {number} page Sets the page to fetch. Default is 1
     * @param {string[]} selectedFields An optional array of string, containing fields in the document that are to be selected
     * @param {DbSortQuery} sort An optional mongoose sort object specifying the field and order to sort the list with
     * @returns {Promise<PaginatedDocument<T>>} A promise resolving to a paginated list of documents that match filter
    */
    public paginate(query:FilterQuery<T> = {}, limit?:number, page?:number, sort?:DbSortQuery, selectedFields?:string|string[]): Promise<PaginatedDocument<T>> {
        const finalQuery = query.status ? query : Object.assign(query, {status: {$ne: ITEM_STATUS.DELETED}});

        const options = {
            select: selectedFields || [],
            page: page || 1,
            limit: limit || 10,
            sort: sort || {created_at: -1},
            customLabels: PaginationCustomLabels
        };

        return new Promise((resolve, reject) => {
            // @ts-ignore
            this.Model.paginate(finalQuery, options)
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
     * @param {string[]} selectedFields An optional array of string, containing fields in the document that are to be selected
     * @param {ClientSession} session An optional mongoose client session, required if the operation is in a transaction
     * @returns {Promise<TDocument>} A promise resolving to a mongodb document.
    */
   public findById(id: string, selectedFields?:string|string[], session?:ClientSession): Promise<TDocument> {
        return new Promise((resolve, reject) => {
            this.Model.findById(id)
                .session(session || null)
                .select(selectedFields || [])
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
     * @param {string[]} selectedFields An optional array of string, containing fields in the document that are to be selected
     * @param {DbPopulation} populatedFields An optional array of string or objects, specifying fields in the document that are to be populated
     * @param {ClientSession} session An optional mongoose client session, required if the operation is in a transaction
     * @returns {Promise<TDocument>} A promise resolving to a mongodb document. The ref paths are populated with it's parent documents
    */
    public findByIdAndPopulate(id:string, populatedFields?:DbPopulation, selectedFields?:string|string[], session?:ClientSession): Promise<TDocument> {
        return new Promise((resolve, reject) => {
            this.Model.findById(id)
            //@ts-ignore
                .populate(populatedFields || [])
                .session(session || null)
                .select(selectedFields || [])
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
     * @param {string[]} selectedFields An optional array of string, containing fields in the document that are to be selected
     * @param {ClientSession} session An optional mongoose client session, required if the operation is in a transaction
     * @returns {Promise<TDocument>} A promise resolving to a mongodb document.
    */
    public findOne(query:FilterQuery<T> = {}, selectedFields?:string|string[], session?:ClientSession): Promise<TDocument> {
        const finalQuery = query.status ? query : Object.assign(query, {status: {$ne: ITEM_STATUS.DELETED}});
        return new Promise((resolve, reject) => {
            this.Model.findOne(finalQuery)
                .session(session || null)
                .select(selectedFields || [])
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
     * @param {string[]} selectedFields An optional array of string, containing fields in the document that are to be selected
     * @param {DbPopulation} populatedFields An optional array of string or objects, specifying fields in the document that are to be populated
     * @param {ClientSession} session An optional mongoose client session, required if the operation is in a transaction
     * @returns {Promise<TDocument>} A promise resolving to a mongodb document. The ref paths are populated with it's parent documents
    */
    public findOneAndPopulate(query:FilterQuery<T> = {},  populatedFields?:DbPopulation, selectedFields?:string|string[], session?:ClientSession): Promise<TDocument> {
        const finalQuery = query.status ? query : Object.assign(query, {status: {$ne: ITEM_STATUS.DELETED}});
        return new Promise((resolve, reject) => {
            this.Model.findOne(finalQuery)
            //@ts-ignore
                .populate(populatedFields)
                .session(session || null)
                .select(selectedFields || [])
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
     * @param {UpdateQuery<T>} data The update to be made
     * @param {ClientSession} session An optional mongoose client session, required if the operation is in a transaction
     * @param {string[]} selectedFields An optional array of string, containing fields in the document that are to be selected
     * @returns {Promise<TDocument>} A promise resolving to a mongodb document. The ref paths are populated with it's parent documents
    */
    public updateById(id:string, data:UpdateQuery<T>, session?:ClientSession, selectedFields?:string|string[]): Promise<TDocument> {
        return new Promise((resolve, reject) => {
            this.Model.findByIdAndUpdate(id, data, {new: true})
            .session(session || null)
            .select(selectedFields || [])
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
     * @param {ClientSession} session An optional mongoose client session, required if the operation is in a transaction
     * @returns {Promise<TDocument>} A promise resolving to the deleted document.
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