export declare class ValidationHelper {
    private static readonly EMAIL_REGEX;
    static validateEmail(email: unknown): {
        isValid: boolean;
        message?: string | undefined;
    };
    static validatePassword(password: unknown): {
        isValid: boolean;
        message?: string | undefined;
    };
    static sanitizeEmail(email: string): string;
    static validateLoginRequest(data: {
        email: unknown;
        password: unknown;
    }): {
        isValid: boolean;
        errors: {
            email?: string | undefined;
            password?: string | undefined;
        };
    };
}
//# sourceMappingURL=validation.d.ts.map