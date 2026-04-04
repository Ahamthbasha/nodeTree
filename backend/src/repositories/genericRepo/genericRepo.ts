import { Model, Document,type ClientSession } from "mongoose";
import {type IGenericRepo } from "./IGenericRepo.js";

export class GenericRepo<T extends Document> implements IGenericRepo<T> {
  protected model: Model<T>;

  constructor(model: Model<T>) {
    this.model = model;
  }

  async findById(id: string): Promise<T | null> {
    return await this.model.findById(id);
  }

  async findOne(filter: Record<string, unknown>): Promise<T | null> {
    return await this.model.findOne(filter);
  }

  async create(data: Partial<T>, session?: ClientSession): Promise<T> {
    const document = new this.model(data);
    if (session) {
      return await document.save({ session });
    }
    return await document.save();
  }

  async update(id: string, data: Partial<T>, session?: ClientSession): Promise<T | null> {
    if (session) {
      return await this.model.findByIdAndUpdate(id, data, { new: true, session });
    }
    return await this.model.findByIdAndUpdate(id, data, { new: true });
  }

  async delete(id: string, session?: ClientSession): Promise<boolean> {
    let result;
    if (session) {
      result = await this.model.findByIdAndDelete(id).session(session);
    } else {
      result = await this.model.findByIdAndDelete(id);
    }
    return result !== null;
  }

  async findAll(filter?: Record<string, unknown>): Promise<T[]> {
    return await this.model.find(filter || {});
  }

  // Additional helper methods
  async bulkDelete(ids: string[], session?: ClientSession): Promise<number> {
    const query = this.model.deleteMany({ _id: { $in: ids } });
    if (session) {
      query.session(session);
    }
    const result = await query;
    return result.deletedCount || 0;
  }

  async updateMany(filter: Record<string, unknown>, data: Partial<T>, session?: ClientSession): Promise<number> {
    const query = this.model.updateMany(filter, data);
    if (session) {
      query.session(session);
    }
    const result = await query;
    return result.modifiedCount || 0;
  }
}