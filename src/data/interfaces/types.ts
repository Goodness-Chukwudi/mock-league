// import { Request } from "express"

import { ILoginSessionDocument } from "../../models/login_session";
import { IUserDocument } from "../../models/user";

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
    DbSortQuery,
    DbPopulation
}