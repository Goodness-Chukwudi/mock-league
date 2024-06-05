import BaseApiController from "./base controllers/BaseApiController";
import { UNABLE_TO_COMPLETE_REQUEST } from "../common/constant/error_response_message";
import { BIT, FIXTURE_STATUS, PASSWORD_STATUS } from "../data/enums/enum";
import { USER_PASSWORD_LABEL } from "../common/constant/app_constants";
import { createMongooseTransaction } from "../common/utils/app_utils";
import AppValidator from "../middlewares/validators/AppValidator";
import { PASSWORD_UPDATE_SUCCESSFUL } from "../common/constant/success_response_message";
import { passwordRepository } from "../services/password_service";
import { userService } from "../services/user_service";
import { teamRepository } from "../services/team_service";
import { fixtureRepository } from "../services/fixture_service";

class AppController extends BaseApiController {
    private appValidator: AppValidator;

    constructor() {
        super();
    }

    protected initializeServices() {}
    
    protected initializeMiddleware() {
        this.appValidator = new AppValidator(this.router)
    }

    protected initializeRoutes() {
        this.listTeams("/teams-list"); //GET
        this.listCompletedFixtures("/fixtures/completed"); //GET
        this.listPendingFixtures("/fixtures/pending"); //GET
        this.me("/me"); //GET
        this.logout("/logout"); //PATCH
        this.updatePassword("/password"); //PATCH
    }

    listTeams(path:string) {
        this.router.get(path, async (req, res) => {
            try {
                let limit;
                let page;
                if (req.query.limit) limit = Number(req.query.limit);
                if (req.query.page) page = Number(req.query.page);

                const teams = await teamRepository.paginate({}, limit, page);
        
                this.sendSuccessResponse(res, teams);
            } catch (error:any) {
                this.sendErrorResponse(res, error, UNABLE_TO_COMPLETE_REQUEST, 500) 
            }
        });
    }

    listPendingFixtures(path:string) {
        this.router.get(path, async (req, res) => {
            try {
                const query = {status: FIXTURE_STATUS.PENDING};
                let limit;
                let page;
                if (req.query.limit) limit = Number(req.query.limit);
                if (req.query.page) page = Number(req.query.page);

                const fixtures = await fixtureRepository.paginate(query, limit, page);
        
                this.sendSuccessResponse(res, fixtures);
            } catch (error:any) {
                this.sendErrorResponse(res, error, UNABLE_TO_COMPLETE_REQUEST, 500) 
            }
        });
    }

    listCompletedFixtures(path:string) {
        this.router.get(path, async (req, res) => {
            try {
                const query = {status: FIXTURE_STATUS.COMPLETED};
                let limit;
                let page;
                if (req.query.limit) limit = Number(req.query.limit);
                if (req.query.page) page = Number(req.query.page);

                const fixtures = await fixtureRepository.paginate(query, limit, page);
        
                this.sendSuccessResponse(res, fixtures);
            } catch (error:any) {
                this.sendErrorResponse(res, error, UNABLE_TO_COMPLETE_REQUEST, 500) 
            }
        });
    }

    me(path:string) {
        //returns the logged in user
        this.router.get(path, (req, res) => {
            const user = this.requestUtils.getRequestUser();
            this.sendSuccessResponse(res, user);
        })
    }

    logout(path:string) {
        this.router.patch(path, async (req, res) => {
            try {
                const activeLoginSession = this.requestUtils.getLoginSession();
    
                if (activeLoginSession.validity_end_date > new Date()) {
                    activeLoginSession.logged_out = true;
                    activeLoginSession.validity_end_date = new Date();
                } else {
                    activeLoginSession.expired = true
                }

                activeLoginSession.status = BIT.OFF;
                await activeLoginSession.save();
                this.sendSuccessResponse(res);
    
            } catch (error: any) {
                this.sendErrorResponse(res, error, UNABLE_TO_COMPLETE_REQUEST, 500);
            }
        });
    }


    updatePassword(path:string) {
        this.router.patch(path,
            this.appValidator.validatePasswordUpdate,
            this.userMiddleWare.validatePassword,
            this.userMiddleWare.hashNewPassword
        );

        this.router.patch(path, async (req, res) => {
            const session = await createMongooseTransaction();
            try {
                const user = this.requestUtils.getRequestUser();
                const previousPassword = this.requestUtils.getDataFromState(USER_PASSWORD_LABEL);

                const passwordData = {
                    password: req.body.password,
                    email: user.email,
                    user: user.id
                }
                await passwordRepository.save(passwordData, session);
                //Deactivate old password
                await passwordRepository.updateById(previousPassword.id, {status: PASSWORD_STATUS.DEACTIVATED}, session);

                await userService.logoutUser(user.id);
                const token = await userService.loginUser(user.id);
        
                this.sendSuccessResponse(res, {message: PASSWORD_UPDATE_SUCCESSFUL, token: token}, 200, session);
            } catch (error:any) {
                this.sendErrorResponse(res, error, UNABLE_TO_COMPLETE_REQUEST, 500, session) 
            }
        });
    }
}

export default new AppController().router;
