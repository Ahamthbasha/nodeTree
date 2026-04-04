import { type IHashService } from "./interface/IHashService.js";
export declare class HashService implements IHashService {
    private readonly saltRounds;
    hashPassword(password: string): Promise<string>;
    comparePassword(password: string, hashedPassword: string): Promise<boolean>;
}
//# sourceMappingURL=hashService.d.ts.map