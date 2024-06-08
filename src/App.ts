import express, { Express } from "express";
import helmet from "helmet";
import compression from "compression"
import Env from "./common/config/environment_variables";
import corsSettings from "./common/utils/cors";
import UserRoutes from "./routes/UserRoutes";
import AdminRoutes from "./routes/AdminRoutes";
import responseTime from "response-time";
import { recordResponseTime } from "./common/utils/app_utils";
import PublicController from "./controllers/PublicController";
import { returnHtmlForUniqueFixtureLink } from "./services/fixture_service";
import { redisSessionStore } from "./common/utils/redis";

class App {

    public app: Express;
    private userRoutes: UserRoutes;
    private adminRoutes: AdminRoutes;

    constructor() {
      this.app = express();
      this.plugInMiddlewares();
      this.plugInRoutes();
    }

    private async plugInMiddlewares() {
      this.app.use(express.json());
      this.app.use(express.urlencoded({ extended: false }));
      this.app.use(redisSessionStore());
      this.app.use(corsSettings);
      this.app.use(helmet());
      this.app.use(compression());
      this.app.use(responseTime(recordResponseTime));
    }
    
    private plugInRoutes() {
      this.userRoutes = new UserRoutes(this.app);
      this.adminRoutes = new AdminRoutes(this.app);
      
      this.app.get("/", (req, res) => res.status(200).send("<h1>Successful</h1>"));
      this.app.get("/:fixture_url_id", returnHtmlForUniqueFixtureLink);

      this.app.get(Env.API_PATH + "/health", (req, res) => {
        const response = "Server is healthy____   " + new Date().toUTCString();
        res.status(200).send(response);
      });

      this.app.use(Env.API_PATH, PublicController);
      this.adminRoutes.initializeRoutes();
      this.userRoutes.initializeRoutes();

      //return a 404 for unspecified/unmatched routes
      this.app.all("*", (req, res) => res.status(404).send("RESOURCE NOT FOUND"));
    }
}

export default new App().app;