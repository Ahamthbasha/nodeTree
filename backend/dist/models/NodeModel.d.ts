import mongoose, { Document } from "mongoose";
export interface INode extends Document {
    name: string;
    parentId: string | null;
    userId: string;
    children: string[];
    createdAt: Date;
    updatedAt: Date;
}
export declare const Node: mongoose.Model<INode, {}, {}, {}, mongoose.Document<unknown, {}, INode, {}, mongoose.DefaultSchemaOptions> & INode & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, INode>;
//# sourceMappingURL=NodeModel.d.ts.map