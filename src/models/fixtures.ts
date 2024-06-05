import { Document, Schema, Types, model} from "mongoose";
import { FIXTURE_STATUS } from "../data/enums/enum";
import MODEL_NAMES from "../data/model_names";
import { IUserDocument } from "./user";
import { ITeamDocument } from "./team";

const ObjectId = Types.ObjectId;

const FixtureSchema = new Schema<Record<keyof ICreateFixture, any>>({
    venue: { type: String, required: true},
    kick_off: {type: Date, required: true}, //supposed kickoff date and time
    time_started: {type: Date}, 
    time_ended: {type: Date},
    home_team_score: {type: Number, required: true},
    away_team_score: {type: Number, required: true},
    home_team: {type: ObjectId, required: true, ref: MODEL_NAMES.TEAM},
    away_team: {type: ObjectId, required: true, ref: MODEL_NAMES.TEAM},
    referee: {type: String, required: true},
    created_by: { type: ObjectId, required: true, ref: MODEL_NAMES.USER},
    status: {type: String, enum: Object.values(FIXTURE_STATUS), default: FIXTURE_STATUS.UPCOMING}
}, 
{
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

interface ICreateFixture {
    venue: string;
    kick_off: Date;
    time_started?: Date;
    time_ended?: Date;
    home_team_score?: number;
    away_team_score?: number;
    home_team: string | ITeamDocument;
    away_team: string | ITeamDocument;
    referee: string;
    created_by: string | IUserDocument;
    status?: string;
}

interface IFixture extends Required<ICreateFixture> {};

const Fixture = model<IFixture>(MODEL_NAMES.FIXTURE, FixtureSchema);
interface IFixtureDocument extends IFixture, Document {_id: Types.ObjectId};

export default Fixture;
export { IFixture, ICreateFixture, IFixtureDocument };