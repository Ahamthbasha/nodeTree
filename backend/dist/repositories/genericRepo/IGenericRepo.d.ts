import { type ClientSession } from "mongoose";
export interface IGenericRepo<T> {
    findById(id: string): Promise<T | null>;
    findOne(filter: object): Promise<T | null>;
    create(data: Partial<T>, session?: ClientSession): Promise<T>;
    update(id: string, data: Partial<T>, session?: ClientSession): Promise<T | null>;
    delete(id: string, session?: ClientSession): Promise<boolean>;
    findAll(filter?: object): Promise<T[]>;
    bulkDelete(ids: string[], session?: ClientSession): Promise<number>;
    updateMany(filter: Record<string, unknown>, data: Partial<T>, session?: ClientSession): Promise<number>;
}
//# sourceMappingURL=IGenericRepo.d.ts.map