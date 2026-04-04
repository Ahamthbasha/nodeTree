import bcrypt from "bcryptjs";
import {} from "./interface/IHashService.js";
export class HashService {
    saltRounds = 10;
    async hashPassword(password) {
        return await bcrypt.hash(password, this.saltRounds);
    }
    async comparePassword(password, hashedPassword) {
        return await bcrypt.compare(password, hashedPassword);
    }
}
//# sourceMappingURL=hashService.js.map