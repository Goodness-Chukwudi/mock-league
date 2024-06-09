import DBQuery from './DBQuery';
import Fixture, { IFixture, ICreateFixture, IFixtureDocument } from '../models/fixture';
import { Request, Response } from "express"

class FixtureRepository extends DBQuery<IFixture, ICreateFixture, IFixtureDocument> {

    constructor() {
        super(Fixture);
    }
}

const fixtureRepository = new FixtureRepository();

const returnHtmlForUniqueFixtureLink = async (req: Request, res: Response) => {
    try {
        const fixtureUrlId = req.params.fixture_url_id;

        const fixture = await fixtureRepository.findOne({url_id: fixtureUrlId});
        if (!fixture) return res.status(200).send("<h1>Not Found!</h1>");

        const kickoff = fixture.time_started || fixture.kick_off;
        const fixtureHtml = `
        <div style="font-size: larger; padding-top: 8vh; margin: 20px auto; text-align: center; background-color: #082785; color: #ffffff; width: 70vw; height: 50vh;">
            <h1>${fixture.home_team.name}   ${fixture.home_team.score} - ${fixture.away_team.score}   ${fixture.away_team.name}</h1>
            <p><b>Venue: </b> ${fixture.venue}</p>
            <p><b>Kick Off: </b> ${kickoff.toUTCString()}</p>
            <p><b>Referee: </b> ${fixture.referee}</p>
            <p><b>Status: </b> ${fixture.status}</p>
        </div>`
        
        res.status(200).send(fixtureHtml)
    } catch (error) {
        res.status(200).send("<h1>Something went wrong</h1>")
    }
}

export default FixtureRepository;
export { fixtureRepository, returnHtmlForUniqueFixtureLink };
