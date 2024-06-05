import DBQuery from './DBQuery';
import Team, { ITeam, ICreateTeam, ITeamDocument } from '../models/team';

class TeamRepository extends DBQuery<ITeam, ICreateTeam, ITeamDocument> {

    constructor() {
        super(Team);
    }
}

const teamRepository = new TeamRepository();

export default TeamRepository;
export { teamRepository };
