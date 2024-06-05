import DBQuery from './DBQuery';
import Fixture, { IFixture, ICreateFixture, IFixtureDocument } from '../models/fixture';

class FixtureRepository extends DBQuery<IFixture, ICreateFixture, IFixtureDocument> {

    constructor() {
        super(Fixture);
    }
}

const fixtureRepository = new FixtureRepository();

export default FixtureRepository;
export { fixtureRepository };
