import { Model, Document } from "mongoose";
import {} from "./IGenericRepo.js";
export class GenericRepo {
    model;
    constructor(model) {
        this.model = model;
    }
    async findById(id) {
        return await this.model.findById(id);
    }
    async findOne(filter) {
        return await this.model.findOne(filter);
    }
    async create(data, session) {
        const document = new this.model(data);
        if (session) {
            return await document.save({ session });
        }
        return await document.save();
    }
    async update(id, data, session) {
        if (session) {
            return await this.model.findByIdAndUpdate(id, data, { new: true, session });
        }
        return await this.model.findByIdAndUpdate(id, data, { new: true });
    }
    async delete(id, session) {
        let result;
        if (session) {
            result = await this.model.findByIdAndDelete(id).session(session);
        }
        else {
            result = await this.model.findByIdAndDelete(id);
        }
        return result !== null;
    }
    async findAll(filter) {
        return await this.model.find(filter || {});
    }
    async bulkDelete(ids, session) {
        const query = this.model.deleteMany({ _id: { $in: ids } });
        if (session) {
            query.session(session);
        }
        const result = await query;
        return result.deletedCount || 0;
    }
    async updateMany(filter, data, session) {
        const query = this.model.updateMany(filter, data);
        if (session) {
            query.session(session);
        }
        const result = await query;
        return result.modifiedCount || 0;
    }
}
//# sourceMappingURL=genericRepo.js.map