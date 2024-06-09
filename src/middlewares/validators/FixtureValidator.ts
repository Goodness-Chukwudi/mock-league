import { NextFunction, Request, Response, Router } from "express";
import Joi from "joi";
import BaseRouterMiddleware from "../BaseRouterMiddleware";
import { JoiValidatorOptions } from "../../common/config/app_config";
import { FIXTURE_STATUS } from "../../data/enums/enum";
import { badRequestError } from "../../common/constant/error_response_message";
import { objectId } from "../../common/utils/joi_extensions";

const JoiId = Joi.extend(objectId);

class TeamValidator extends BaseRouterMiddleware {

    constructor(appRouter: Router) {
        super(appRouter);
    }

    validateFixture = async ( req: Request, res: Response, next: NextFunction ) => {
        try {
            const BodySchema = Joi.object({
                kick_off: Joi.date().required(),
                home_team: JoiId.string().objectId().required(),
                away_team: JoiId.string().objectId().required(),
                referee: Joi.string().max(255).required()
            });

            await BodySchema.validateAsync(req.body, JoiValidatorOptions);

            next();
        } catch (error: any) {
            return this.sendErrorResponse(res, error, badRequestError(error.message), 400);
        }
    };

    validateFixtureUpdate = async ( req: Request, res: Response, next: NextFunction ) => {
        try {
            const BodySchema = Joi.object({
                venue: Joi.string().max(255),
                kick_off: Joi.date(),
                referee: Joi.string().max(255),
                time_started: Joi.date(), 
                time_ended: Joi.date(),
                home_team_score: Joi.number(),
                away_team_score: Joi.number(),
                status: Joi.string().valid(...Object.values(FIXTURE_STATUS))
            });

            await BodySchema.validateAsync(req.body, JoiValidatorOptions);

            next();
        } catch (error: any) {
            return this.sendErrorResponse(res, error, badRequestError(error.message), 400);
        }
    };
}

export default TeamValidator;