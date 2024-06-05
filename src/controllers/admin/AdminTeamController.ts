
import BaseApiController from "../base controllers/BaseApiController";
import TeamValidator from "../../middlewares/validators/TeamValidator";
import { getEndOfDay, getStartOfDay } from "../../common/utils/date_utils";
import { UNABLE_TO_COMPLETE_REQUEST, resourceNotFound } from "../../common/constant/error_response_message";
import { teamRepository } from "../../services/team_service";

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
        
                this.sendSuccessResponse(res, team, 201);
            } catch (error:any) {
                this.sendErrorResponse(res, error, UNABLE_TO_COMPLETE_REQUEST, 500) 
            }
        });
    }

    listTeams(path:string) {
        this.router.get(path, async (req, res) => {
            try {
                const reqQuery: Record<string, any> = req.query;
                let query = {};

                if (reqQuery.status) query = {...query, status: reqQuery.status};
                if (reqQuery.added_by) query = {...query, added_by: reqQuery.added_by};
                if (reqQuery.start_date && reqQuery.end_date) {
                    const startDate = getStartOfDay(reqQuery.start_date)
                    const endDate = getEndOfDay(reqQuery.end_date)
                    query = {...query, created_at: { $gte: startDate, $lte: endDate }}
                }
                if (reqQuery.search) query = {
                    ...query,
                    $or: [
                        {name: new RegExp(`${req.query.search}`, "i")},
                        {slogan: new RegExp(`${req.query.search}`, "i")},
                        {stadium: new RegExp(`${req.query.search}`, "i")}
                    ]
                };


                let limit;
                let page;
                if (reqQuery.limit) limit = Number(reqQuery.limit);
                if (reqQuery.page) page = Number(reqQuery.page);

                const tasks = await teamRepository.paginate(query, limit, page);
        
                this.sendSuccessResponse(res, tasks);
            } catch (error:any) {
                this.sendErrorResponse(res, error, UNABLE_TO_COMPLETE_REQUEST, 500) 
            }
        });
    }

    viewTeam(path:string) {
        this.router.get(path, async (req, res) => {
            try {
                const team = await teamRepository.findById(req.params.id);
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
            try {
                const {name, slogan, stadium, status} = req.body;                
                const update = {
                    name, 
                    slogan,
                    stadium,
                    status
                }
                const updatedTeam = await teamRepository.updateById(req.params.id, update);

                if (!updatedTeam) {
                    const error = new Error("Team not found");
                    return this.sendErrorResponse(res, error, resourceNotFound("Team"), 404) 
                }

                this.sendSuccessResponse(res, updatedTeam);
            } catch (error:any) {
                this.sendErrorResponse(res, error, UNABLE_TO_COMPLETE_REQUEST, 500);
            }
        });
    }

    removeTeam(path:string) {
        this.router.delete(path, async (req, res) => {
            try {
                await teamRepository.deleteById(req.params.id);
        
                this.sendSuccessResponse(res);
            } catch (error:any) {
                this.sendErrorResponse(res, error, UNABLE_TO_COMPLETE_REQUEST, 500);
            }
        });
    }
}

export default new AdminTeamController().router;