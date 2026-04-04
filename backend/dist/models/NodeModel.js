import mongoose, { Schema, Document } from "mongoose";
const NodeSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    parentId: {
        type: String,
        default: null,
        index: true,
    },
    userId: {
        type: String,
        required: true,
        index: true,
    },
    children: [
        {
            type: String,
            ref: "Node",
        },
    ],
}, {
    timestamps: true,
});
NodeSchema.index({ userId: 1, parentId: 1 });
export const Node = mongoose.model("Node", NodeSchema);
//# sourceMappingURL=NodeModel.js.map