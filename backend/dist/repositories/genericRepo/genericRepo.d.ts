import { Model, Document, type ClientSession } from "mongoose";
import { type IGenericRepo } from "./IGenericRepo.js";
export declare class GenericRepo<T extends Document> implements IGenericRepo<T> {
    protected model: Model<T>;
    constructor(model: Model<T>);
    findById(id: string): Promise<T | null>;
    findOne(filter: Record<string, unknown>): Promise<T | null>;
    create(data: Partial<T>, session?: ClientSession): Promise<T>;
    update(id: string, data: Partial<T>, session?: ClientSession): Promise<T | null>;
    delete(id: string, session?: ClientSession): Promise<boolean>;
    findAll(filter?: Record<string, unknown>): Promise<T[]>;
    bulkDelete(ids: string[], session?: ClientSession): Promise<number>;
    updateMany(filter: Record<string, unknown>, data: Partial<T>, session?: ClientSession): Promise<number>;
}
//# sourceMappingURL=genericRepo.d.ts.map