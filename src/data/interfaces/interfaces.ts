import joi, { Extension, Root } from "joi";
import { ILoginSessionDocument } from "../../models/login_session";
import { IUserDocument } from "../../models/user";
import { ClientSession } from "mongoose";

interface IResponseMessage {
    response_code: number;
    message: string;
}

interface IObjectIdExtension extends Extension {
    type: 'string',
    base: joi.StringSchema
    messages: {'string.objectId': string},
    rules: {
        objectId: { validate(value:string, helpers:any): any }
    }
}

declare const JoiExtensionFactory: (joi: Root) => IObjectIdExtension;

interface PaginatedDocument<T> {
    items: T[];
    paginator: {
        items_count: number;
        items_per_page: number;
        current_page: number;
        next_page: number | null;
        previous_page: number | null;
        has_previous_page: boolean;
        has_next_page: boolean;
        total_pages: number;
        serial_number: number;

    }
}

interface AuthTokenPayload {
    user: string;
    loginSession: string
}

interface IQueryOptions {
    session?: ClientSession;
    selectedFields?: string|string[];
    populatedFields?: DbPopulation;
    limit?: number;
    page?: number;
    sort?: DbSortQuery;
}

type DbSortQuery = Record<string, 1|-1> | null;
type DbPopulation = string[] | {path: string, select: string|string[]}[];

// declare module "express-serve-static-core" {
//     interface Request {
//       sessionsss: boolean;
//     }
// }
declare module 'express-session' {
    interface SessionData {
        data: {
            user: IUserDocument;
            login_session: ILoginSessionDocument;
            user_roles: string[];
        }
    }
}

export {
    IResponseMessage,
    JoiExtensionFactory,
    PaginatedDocument,
    AuthTokenPayload,
    IQueryOptions,
    DbSortQuery,
    DbPopulation
}
