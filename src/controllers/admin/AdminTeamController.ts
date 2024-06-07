
import BaseApiController from "../base controllers/BaseApiController";
import TeamValidator from "../../middlewares/validators/TeamValidator";
import { UNABLE_TO_COMPLETE_REQUEST, resourceNotFound } from "../../common/constant/error_response_message";
import { teamRepository } from "../../services/team_service";
import { TEAMS_KEY } from "../../common/constant/app_constants";
import { deleteCachedData, getCachedData, setCachedData } from "../../common/utils/redis";
import { createMongooseTransaction } from "../../common/utils/app_utils";

class AdminTeamController extends BaseApiController {
    private teamValidator: TeamValidator;

    constructor() {
        super();
    }

    protected initializeServices() {}
    
    protected initializeMiddleware() {
        this.teamValidator = new TeamValidator(this.router)
    }

    protected initializeRoutes() {
        this.addTeam("/"); //POST
        this.listTeams("/"); //GET
        this.viewTeam("/:id"); //GET
        this.removeTeam("/:id"); //DELETE
        this.updateTeam("/:id"); //PATCH
    }

    addTeam(path:string) {
        this.router.post(path, this.teamValidator.validateTeam);
        this.router.post(path, async (req, res) => {
            const session = await createMongooseTransaction();
            try {
                const user = this.requestUtils.getRequestUser();
                const body = req.body;
                
                const teamData = {
                    name: body.name,
                    slogan: body.slogan,
                    stadium: body.stadium,
                    added_by: user.id
                };
                const team = await teamRepository.save(teamData);

                //remove cached data to trigger a refetch from db on next request
                await deleteCachedData([TEAMS_KEY]);
        
                this.sendSuccessResponse(res, team, 201, session);
            } catch (error:any) {
                this.sendErrorResponse(res, error, UNABLE_TO_COMPLETE_REQUEST, 500, session) 
            }
        });
    }

    listTeams(path:string) {
        this.router.get(path, async (req, res) => {
            try {

                let teams = await getCachedData(TEAMS_KEY);
                if (!teams) {
                    teams = await teamRepository.find();
                    await setCachedData(TEAMS_KEY, teams)
                }
        
                this.sendSuccessResponse(res, teams);
            } catch (error:any) {
                this.sendErrorResponse(res, error, UNABLE_TO_COMPLETE_REQUEST, 500) 
            }
        });
    }

    viewTeam(path:string) {
        this.router.get(path, async (req, res) => {
            try {
                const populatedFields = [
                    { path: "created_by", select: "first_name middle_name last_name" }
                ];

                const team = await teamRepository.findByIdAndPopulate(req.params.id, populatedFields);
                if (!team) {
                    const error = new Error("Team not found");
                    return this.sendErrorResponse(res, error, resourceNotFound("Team"), 404) 
                }
        
                this.sendSuccessResponse(res, team);
            } catch (error:any) {
                this.sendErrorResponse(res, error, UNABLE_TO_COMPLETE_REQUEST, 500);
            }
        });
    }

    updateTeam(path:string) {
        this.router.patch(path, this.teamValidator.validateTeamUpdate);
        this.router.patch(path, async (req, res) => {
            const session = await createMongooseTransaction();
            try {
                const {name, slogan, stadium, status} = req.body;                
                const update = {
                    name, 
                    slogan,
                    stadium,
                    status
                }
                const updatedTeam = await teamRepository.updateById(req.params.id, update, session);

                if (!updatedTeam) {
                    const error = new Error("Team not found");
                    return this.sendErrorResponse(res, error, resourceNotFound("Team"), 404) 
                }

                //remove cached data to trigger a refetch from db on next request
                await deleteCachedData([TEAMS_KEY]);

                this.sendSuccessResponse(res, updatedTeam, 200, session);
            } catch (error:any) {
                this.sendErrorResponse(res, error, UNABLE_TO_COMPLETE_REQUEST, 500, session);
            }
        });
    }

    removeTeam(path:string) {
        this.router.delete(path, async (req, res) => {
            const session = await createMongooseTransaction();
            try {
                const deletedTeam = await teamRepository.deleteById(req.params.id, session);

                if (!deletedTeam) {
                    const error = new Error("Team not found");
                    return this.sendErrorResponse(res, error, resourceNotFound("Team"), 404) 
                }

                //remove cached data to trigger a refetch from db on next request
                await deleteCachedData([TEAMS_KEY]);
        
                this.sendSuccessResponse(res, {}, 200, session);
            } catch (error:any) {
                this.sendErrorResponse(res, error, UNABLE_TO_COMPLETE_REQUEST, 500, session);
            }
        });
    }
}

export default new AdminTeamController().router;