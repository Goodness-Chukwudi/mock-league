import { Document, Schema, Types, model} from "mongoose";
import mongoosePagination from "mongoose-paginate-v2";
import { FIXTURE_STATUS } from "../data/enums/enum";
import MODEL_NAMES from "../data/model_names";
import { IUserDocument } from "./user";
import { ITeamDocument } from "./team";

const ObjectId = Types.ObjectId;

const Team = {
    name: {type: String, required: true, index: true},//team's name field is added and indexed to improve search
    score: {type: Number},
    team: {type: ObjectId, required: true, ref: MODEL_NAMES.TEAM}
};

const FixtureSchema = new Schema<Record<keyof ICreateFixture, any>>({
    venue: { type: String, required: true},
    kick_off: {type: Date, required: true}, //supposed kickoff date and time
    time_started: {type: Date}, 
    time_ended: {type: Date},
    home_team: Team,
    away_team: Team,
    url_id: {type: String, unique: true, sparse: true },
    referee: {type: String, required: true},
    created_by: { type: ObjectId, required: true, ref: MODEL_NAMES.USER},
    status: {type: String, enum: Object.values(FIXTURE_STATUS), default: FIXTURE_STATUS.PENDING}
}, 
{
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

interface ICreateFixture {
    venue: string;
    kick_off: Date;
    time_started?: Date;
    time_ended?: Date;
    home_team: {
        name: string;
        score?: number;
        team: string | ITeamDocument;
    };
    away_team: {
        name: string;
        score?: number;
        team: string | ITeamDocument;
    };
    url_id?: string;
    referee: string;
    created_by: string | IUserDocument;
    status?: string;
}

interface IFixture extends Required<ICreateFixture> {};

FixtureSchema.plugin(mongoosePagination);

const Fixture = model<IFixture>(MODEL_NAMES.FIXTURE, FixtureSchema);
interface IFixtureDocument extends IFixture, Document {_id: Types.ObjectId};

export default Fixture;
export { IFixture, ICreateFixture, IFixtureDocument };