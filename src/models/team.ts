import { Document, Schema, Types, model} from "mongoose";
import { TEAM_STATUS } from "../data/enums/enum";
import MODEL_NAMES from "../data/model_names";
import { IUserDocument } from "./user";

const ObjectId = Types.ObjectId;

const TeamSchema = new Schema<Record<keyof ICreateTeam, any>>({
    name: { type: String, required: true, unique: true, index: true},
    logo_url: {type: String, required: true},
    slogan: {type: String, required: true},
    stadium: {type: String, required: true, unique: true},
    added_by: { type: ObjectId, required: true, ref: MODEL_NAMES.USER},
    status: {type: String, enum: Object.values(TEAM_STATUS), default: TEAM_STATUS.ACTIVE}
}, 
{
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

interface ICreateTeam {
    name: string;
    logo_url: string;
    slogan: string;
    stadium: string;
    added_by: string | IUserDocument
    status?: string;
}

interface ITeam extends Required<ICreateTeam> {};

const Team = model<ITeam>(MODEL_NAMES.TEAM, TeamSchema);
interface ITeamDocument extends ITeam, Document {_id: Types.ObjectId};

export default Team;
export { ITeam, ICreateTeam, ITeamDocument };