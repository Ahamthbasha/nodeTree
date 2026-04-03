import mongoose, { Schema, Document } from "mongoose";

export interface INode extends Document {
  name: string;
  parentId: string | null;
  userId: string;
  children: string[];
  createdAt: Date;
  updatedAt: Date;
}

const NodeSchema = new Schema<INode>(
  {
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
  },
  {
    timestamps: true,
  }
);

// Index for efficient querying
NodeSchema.index({ userId: 1, parentId: 1 });

export const Node = mongoose.model<INode>("Node", NodeSchema);