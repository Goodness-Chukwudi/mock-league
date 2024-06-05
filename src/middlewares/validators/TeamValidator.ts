import { NextFunction, Request, Response, Router } from "express";
import Joi from "joi";
import BaseRouterMiddleware from "../BaseRouterMiddleware";
import { JoiValidatorOptions } from "../../common/config/app_config";
import { TEAM_STATUS } from "../../data/enums/enum";
import { badRequestError } from "../../common/constant/error_response_message";

class TeamValidator extends BaseRouterMiddleware {

    constructor(appRouter: Router) {
        super(appRouter);
    }

    validateTeam = async ( req: Request, res: Response, next: NextFunction ) => {
        try {
            const BodySchema = Joi.object({
                name: Joi.string().max(255).required(),
                slogan: Joi.string().max(255).required(),
                stadium: Joi.string().max(255).required()
            });

            await BodySchema.validateAsync(req.body, JoiValidatorOptions);

            next();
        } catch (error: any) {
            return this.sendErrorResponse(res, error, badRequestError(error.message), 400);
        }
    };

    validateTeamUpdate = async ( req: Request, res: Response, next: NextFunction ) => {
        try {
            const BodySchema = Joi.object({
                name: Joi.string().max(255).required(),
                slogan: Joi.string().max(255).required(),
                stadium: Joi.string().max(255).required(),
                status: Joi.string().valid(...Object.values(TEAM_STATUS))

            });

            await BodySchema.validateAsync(req.body, JoiValidatorOptions);

            next();
        } catch (error: any) {
            return this.sendErrorResponse(res, error, badRequestError(error.message), 400);
        }
    };
}

export default TeamValidator;