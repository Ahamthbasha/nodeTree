export class UserService {
    _userRepo;
    _hashService;
    _jwtService;
    constructor(userRepo, hashService, jwtService) {
        this._userRepo = userRepo;
        this._hashService = hashService;
        this._jwtService = jwtService;
    }
    async login(data) {
        const { email, password } = data;
        const existingUser = await this._userRepo.findByEmail(email);
        if (!existingUser) {
            const hashedPassword = await this._hashService.hashPassword(password);
            const newUser = await this._userRepo.create({
                email,
                password: hashedPassword,
                role: "user",
            });
            const tokens = await this._jwtService.generateTokens({
                id: newUser._id.toString(),
                email: newUser.email,
                role: newUser.role,
            });
            return {
                success: true,
                message: "Account created and logged in successfully",
                accessToken: tokens.accessToken,
                refreshToken: tokens.refreshToken,
                user: {
                    id: newUser._id.toString(),
                    email: newUser.email,
                    role: newUser.role,
                },
            };
        }
        const isPasswordValid = await this._hashService.comparePassword(password, existingUser.password);
        if (!isPasswordValid) {
            return {
                success: false,
                message: "Invalid password",
            };
        }
        const tokens = await this._jwtService.generateTokens({
            id: existingUser._id.toString(),
            email: existingUser.email,
            role: existingUser.role,
        });
        return {
            success: true,
            message: "Login successful",
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken,
            user: {
                id: existingUser._id.toString(),
                email: existingUser.email,
                role: existingUser.role,
            },
        };
    }
}
//# sourceMappingURL=userAuthService.js.map