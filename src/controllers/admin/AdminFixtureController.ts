
import BaseApiController from "../base controllers/BaseApiController";
import { UNABLE_TO_COMPLETE_REQUEST, resourceNotFound } from "../../common/constant/error_response_message";
import { teamRepository } from "../../services/team_service";
import FixtureValidator from "../../middlewares/validators/FixtureValidator";
import { fixtureRepository } from "../../services/fixture_service";
import { nanoid } from "nanoid";
import Env from "../../common/config/environment_variables";
import { deleteCachedData, getCachedData, setCachedData } from "../../common/utils/redis";
import { createMongooseTransaction } from "../../common/utils/app_utils";
import { FIXTURES_KEY, PENDING_FIXTURES_KEY } from "../../common/constant/app_constants";
import { FIXTURE_STATUS } from "../../data/enums/enum";

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
        this.generateFixtureUrl("/:id"); //POST
    }

    addFixture(path:string) {
        this.router.post(path, this.fixtureValidator.validateFixture);
        this.router.post(path, async (req, res) => {
            const session = await createMongooseTransaction();
            try {
                const user = this.requestUtils.getRequestUser();
                const body = req.body;

                const homeTeam = await teamRepository.findById(body.home_team);
                if (!homeTeam) {
                    const error = new Error("Home team not found");
                    return this.sendErrorResponse(res, error, resourceNotFound("Home team"), 404);
                }

                const awayTeam = await teamRepository.findById(body.away_team);
                if (!awayTeam) {
                    const error = new Error("Away team not found");
                    return this.sendErrorResponse(res, error, resourceNotFound("Away team"), 404);
                }
 
                const fixtureData = {
                    venue: body.venue,
                    kick_off: body.kick_off,
                    home_team: { name: homeTeam.name, team: homeTeam.id },
                    away_team: { name: awayTeam.name, team: awayTeam.id },
                    referee: body.referee,
                    created_by: user.id
                };
                const fixture = await fixtureRepository.save(fixtureData, session);

                //remove cached data to trigger a refetch from db on next request
                await deleteCachedData([FIXTURES_KEY, PENDING_FIXTURES_KEY]);
        
                this.sendSuccessResponse(res, fixture, 201, session);
            } catch (error:any) {
                this.sendErrorResponse(res, error, UNABLE_TO_COMPLETE_REQUEST, 500, session) 
            }
        });
    }

    listFixtures(path:string) {
        this.router.get(path, async (req, res) => {
            try {
                let fixtures = await getCachedData(FIXTURES_KEY);
                if (!fixtures) {
                    fixtures = await fixtureRepository.find();
                    await setCachedData(FIXTURES_KEY, fixtures)
                }

                this.sendSuccessResponse(res, fixtures);
            } catch (error:any) {
                this.sendErrorResponse(res, error, UNABLE_TO_COMPLETE_REQUEST, 500) 
            }
        });
    }

    viewFixture(path:string) {
        this.router.get(path, async (req, res) => {
            try {
                const populatedFields = [
                    { path: "home_team", select: "team score" },
                    { path: "away_team", select: "team score" },
                    { path: "created_by", select: "first_name middle_name last_name" }
                ];

                const fixture = await fixtureRepository.findByIdAndPopulate(req.params.id, populatedFields);
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
            const session = await createMongooseTransaction();
            try {
                const body = req.body;                
                const update = {
                    venue: body.venue,
                    kick_off: body.body,
                    referee: body.referee,
                    time_started: body.time_started, 
                    time_ended: body.time_ended,
                    "home_team.score": body.home_team_score,
                    "away_team.score": body.away_team_score,
                    status: body.status
                }
                const updatedFixture = await fixtureRepository.updateById(req.params.id, update, session);

                if (!updatedFixture) {
                    const error = new Error("Fixture not found");
                    return this.sendErrorResponse(res, error, resourceNotFound("Fixture"), 404) 
                }

                //remove cached data to trigger a refetch from db on next request
                const keys = [FIXTURES_KEY];
                if (updatedFixture.status = FIXTURE_STATUS.PENDING) keys.push(FIXTURE_STATUS.PENDING);
                if (updatedFixture.status = FIXTURE_STATUS.COMPLETED) keys.push(FIXTURE_STATUS.COMPLETED);

                await deleteCachedData(keys);

                this.sendSuccessResponse(res, updatedFixture, 200, session);
            } catch (error:any) {
                this.sendErrorResponse(res, error, UNABLE_TO_COMPLETE_REQUEST, 500, session);
            }
        });
    }

    generateFixtureUrl(path:string) {
        this.router.post(path, async (req, res) => {
            try {
                const id = nanoid(); //uniques 21 digits string     
                const fixtureLink = `${Env.APP_URL}/${id}`;
                
                const updatedFixture = await fixtureRepository.updateById(req.params.id, {url_id: id});

                if (!updatedFixture) {
                    const error = new Error("Fixture not found");
                    return this.sendErrorResponse(res, error, resourceNotFound("Fixture"), 404) 
                }

                this.sendSuccessResponse(res, fixtureLink);
            } catch (error:any) {
                this.sendErrorResponse(res, error, UNABLE_TO_COMPLETE_REQUEST, 500);
            }
        });
    }

    removeFixture(path:string) {
        this.router.delete(path, async (req, res) => {
            const session = await createMongooseTransaction();
            try {
                const deletedFixture = await fixtureRepository.deleteById(req.params.id, session);

                if (!deletedFixture) {
                    const error = new Error("Fixture not found");
                    return this.sendErrorResponse(res, error, resourceNotFound("Fixture"), 404) 
                }

                //remove cached data to trigger a refetch from db on next request
                const keys = [FIXTURES_KEY];
                if (deletedFixture.status = FIXTURE_STATUS.PENDING) keys.push(FIXTURE_STATUS.PENDING);
                if (deletedFixture.status = FIXTURE_STATUS.COMPLETED) keys.push(FIXTURE_STATUS.COMPLETED);

                await deleteCachedData(keys);
        
                this.sendSuccessResponse(res, {}, 200, session);
            } catch (error:any) {
                this.sendErrorResponse(res, error, UNABLE_TO_COMPLETE_REQUEST, 500, session);
            }
        });
    }
}

export default new AdminFixtureController().router;