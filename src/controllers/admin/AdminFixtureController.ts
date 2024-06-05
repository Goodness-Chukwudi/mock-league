
import BaseApiController from "../base controllers/BaseApiController";
import { getEndOfDay, getStartOfDay } from "../../common/utils/date_utils";
import { UNABLE_TO_COMPLETE_REQUEST, resourceNotFound } from "../../common/constant/error_response_message";
import { teamRepository } from "../../services/team_service";
import FixtureValidator from "../../middlewares/validators/FixtureValidator";
import { fixtureRepository } from "../../services/fixture_service";

class AdminFixtureController extends BaseApiController {
    private fixtureValidator: FixtureValidator;

    constructor() {
        super();
    }

    protected initializeServices() {}
    
    protected initializeMiddleware() {
        this.fixtureValidator = new FixtureValidator(this.router)
    }

    protected initializeRoutes() {
        this.addFixture("/"); //POST
        this.listFixtures("/"); //GET
        this.viewFixture("/:id"); //GET
        this.removeFixture("/:id"); //DELETE
        this.updateFixture("/:id"); //PATCH
    }

    addFixture(path:string) {
        this.router.post(path, this.fixtureValidator.validateFixture);
        this.router.post(path, async (req, res) => {
            try {
                const user = this.requestUtils.getRequestUser();
                const body = req.body;
                
                const fixtureData = {
                    venue: body.venue,
                    kick_off: body.kick_off,
                    home_team: body.home_team,
                    away_team: body.away_team,
                    referee: body.referee,
                    created_by: user.id
                };
                const fixture = await fixtureRepository.save(fixtureData);
        
                this.sendSuccessResponse(res, fixture, 201);
            } catch (error:any) {
                this.sendErrorResponse(res, error, UNABLE_TO_COMPLETE_REQUEST, 500) 
            }
        });
    }

    listFixtures(path:string) {
        this.router.get(path, async (req, res) => {
            try {
                const reqQuery: Record<string, any> = req.query;
                let query = {};

                if (reqQuery.status) query = {...query, status: reqQuery.status};
                if (reqQuery.added_by) query = {...query, added_by: reqQuery.added_by};
                if (reqQuery.start_date && reqQuery.end_date) {
                    const startDate = getStartOfDay(reqQuery.start_date)
                    const endDate = getEndOfDay(reqQuery.end_date)
                    query = {...query, kick_off: { $gte: startDate, $lte: endDate }}
                }

                let limit;
                let page;
                if (reqQuery.limit) limit = Number(reqQuery.limit);
                if (reqQuery.page) page = Number(reqQuery.page);

                const fixtures = await fixtureRepository.paginate(query, limit, page);
        
                this.sendSuccessResponse(res, fixtures);
            } catch (error:any) {
                this.sendErrorResponse(res, error, UNABLE_TO_COMPLETE_REQUEST, 500) 
            }
        });
    }

    viewFixture(path:string) {
        this.router.get(path, async (req, res) => {
            try {
                const fixture = await fixtureRepository.findById(req.params.id);
                if (!fixture) {
                    const error = new Error("Fixture not found");
                    return this.sendErrorResponse(res, error, resourceNotFound("Fixture"), 404) 
                }
        
                this.sendSuccessResponse(res, fixture);
            } catch (error:any) {
                this.sendErrorResponse(res, error, UNABLE_TO_COMPLETE_REQUEST, 500);
            }
        });
    }

    updateFixture(path:string) {
        this.router.patch(path, this.fixtureValidator.validateFixtureUpdate);
        this.router.patch(path, async (req, res) => {
            try {
                const body = req.body;                
                const update = {
                    venue: body.venue,
                    kick_off: body.body,
                    referee: body.referee,
                    time_started: body.time_started, 
                    time_ended: body.time_ended,
                    home_team_score: body.home_team_score,
                    away_team_score: body.away_team_score,
                    status: body.status
                }
                const updatedFixture = await teamRepository.updateById(req.params.id, update);

                if (!updatedFixture) {
                    const error = new Error("Fixture not found");
                    return this.sendErrorResponse(res, error, resourceNotFound("Fixture"), 404) 
                }

                this.sendSuccessResponse(res, updatedFixture);
            } catch (error:any) {
                this.sendErrorResponse(res, error, UNABLE_TO_COMPLETE_REQUEST, 500);
            }
        });
    }

    removeFixture(path:string) {
        this.router.delete(path, async (req, res) => {
            try {
                await fixtureRepository.deleteById(req.params.id);
        
                this.sendSuccessResponse(res);
            } catch (error:any) {
                this.sendErrorResponse(res, error, UNABLE_TO_COMPLETE_REQUEST, 500);
            }
        });
    }
}

export default new AdminFixtureController().router;