import { NextFunction, Request, Response, Router } from "express";
import Joi from "joi";
import BaseRouterMiddleware from "../BaseRouterMiddleware";
import { JoiValidatorOptions } from "../../common/config/app_config";
import { TEAM_STATUS } from "../../data/enums/enum";
import { badRequestError } from "../../common/constant/error_response_message";
import { teamRepository } from "../../services/team_service";

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

            const existingTeam = await teamRepository.findOne({$or: [{name: req.body.name}, {stadium: req.body.stadium}]});
            if(existingTeam) {
                if (existingTeam.name == req.body.name) {
                    const error = new Error("A team with this name already exist");
                    return this.sendErrorResponse(res, error, badRequestError(error.message), 400);
                }
                if (existingTeam.stadium == req.body.stadium) {
                    const error = new Error("A team with this stadium already exist");
                    return this.sendErrorResponse(res, error, badRequestError(error.message), 400)
                }
            }

            next();
        } catch (error: any) {
            return this.sendErrorResponse(res, error, badRequestError(error.message), 400);
        }
    };

    validateTeamUpdate = async ( req: Request, res: Response, next: NextFunction ) => {
        try {
            const BodySchema = Joi.object({
                name: Joi.string().max(255),
                slogan: Joi.string().max(255),
                stadium: Joi.string().max(255),
                status: Joi.string().valid(...Object.values(TEAM_STATUS))

            });

            await BodySchema.validateAsync(req.body, JoiValidatorOptions);

            const query  = {_id: {$ne: req.params.id}, $or: [{name: req.body.name}, {stadium: req.body.stadium}]};
            const existingTeam = await teamRepository.findOne(query);
            if(existingTeam) {
                if (existingTeam.name == req.body.name) {
                    const error = new Error("A team with this name already exist");
                    return this.sendErrorResponse(res, error, badRequestError(error.message), 400);
                }
                if (existingTeam.stadium == req.body.stadium) {
                    const error = new Error("A team with this stadium already exist");
                    return this.sendErrorResponse(res, error, badRequestError(error.message), 400)
                }
            }

            next();
        } catch (error: any) {
            return this.sendErrorResponse(res, error, badRequestError(error.message), 400);
        }
    };
}

export default TeamValidator;