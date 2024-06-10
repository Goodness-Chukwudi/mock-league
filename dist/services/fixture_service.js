"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.returnHtmlForUniqueFixtureLink = exports.fixtureRepository = void 0;
const DBQuery_1 = __importDefault(require("./DBQuery"));
const fixture_1 = __importDefault(require("../models/fixture"));
class FixtureRepository extends DBQuery_1.default {
    constructor() {
        super(fixture_1.default);
    }
}
const fixtureRepository = new FixtureRepository();
exports.fixtureRepository = fixtureRepository;
const returnHtmlForUniqueFixtureLink = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const fixtureUrlId = req.params.fixture_url_id;
        const fixture = yield fixtureRepository.findOne({ url_id: fixtureUrlId });
        if (!fixture)
            return res.status(200).send("<h1>Not Found!</h1>");
        const kickoff = fixture.time_started || fixture.kick_off;
        const fixtureHtml = `
        <div style="font-size: larger; padding-top: 8vh; margin: 20px auto; text-align: center; background-color: #082785; color: #ffffff; width: 70vw; height: 50vh;">
            <h1>${fixture.home_team.name} ${fixture.home_team.score} - ${fixture.away_team.score} ${fixture.away_team.name}</h1>
            <p><b>Venue:</b> ${fixture.venue}</p>
            <p><b>Kick Off:</b> ${kickoff.toUTCString()}</p>
            <p><b>Referee:</b> ${fixture.referee}</p>
            <p><b>Status:</b> ${fixture.status}</p>
        </div>`;
        res.status(200).send(fixtureHtml);
    }
    catch (error) {
        res.status(200).send("<h1>Something went wrong</h1>");
    }
});
exports.returnHtmlForUniqueFixtureLink = returnHtmlForUniqueFixtureLink;
exports.default = FixtureRepository;
//# sourceMappingURL=fixture_service.js.map