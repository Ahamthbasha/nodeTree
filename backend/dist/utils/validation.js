export class ValidationHelper {
    static EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    static validateEmail(email) {
        if (!email || typeof email !== "string") {
            return { isValid: false, message: "Email is required" };
        }
        const trimmedEmail = email.trim();
        if (trimmedEmail.length === 0) {
            return { isValid: false, message: "Email cannot be empty" };
        }
        if (trimmedEmail.length > 254) {
            return { isValid: false, message: "Email is too long" };
        }
        if (!this.EMAIL_REGEX.test(trimmedEmail)) {
            return { isValid: false, message: "Please enter a valid email address" };
        }
        if (trimmedEmail.includes("..")) {
            return { isValid: false, message: "Email cannot contain consecutive dots" };
        }
        if (trimmedEmail.startsWith(".") || trimmedEmail.endsWith(".")) {
            return { isValid: false, message: "Email cannot start or end with a dot" };
        }
        const [localPart] = trimmedEmail.split("@");
        if (localPart && localPart.length > 64) {
            return { isValid: false, message: "Email local part is too long" };
        }
        return { isValid: true };
    }
    static validatePassword(password) {
        if (!password || typeof password !== "string") {
            return { isValid: false, message: "Password is required" };
        }
        if (password.length < 8) {
            return {
                isValid: false,
                message: "Password must be at least 8 characters long",
            };
        }
        if (password.length > 128) {
            return {
                isValid: false,
                message: "Password is too long (maximum 128 characters)",
            };
        }
        if (!/[a-z]/.test(password)) {
            return {
                isValid: false,
                message: "Password must contain at least one lowercase letter",
            };
        }
        if (!/[A-Z]/.test(password)) {
            return {
                isValid: false,
                message: "Password must contain at least one uppercase letter",
            };
        }
        if (!/\d/.test(password)) {
            return {
                isValid: false,
                message: "Password must contain at least one number",
            };
        }
        if (!/[@$!%*?&#^()_+\-=\[\]{};':"\\|,.<>\/]/.test(password)) {
            return {
                isValid: false,
                message: "Password must contain at least one special character (@$!%*?&#^()_+-=[]{};':\"\\|,.<>/)",
            };
        }
        const weakPasswords = [
            "password",
            "12345678",
            "qwerty123",
            "abc123456",
            "password1",
            "password123",
            "admin123",
            "welcome123",
        ];
        const lowerPassword = password.toLowerCase();
        if (weakPasswords.some((weak) => lowerPassword.includes(weak))) {
            return {
                isValid: false,
                message: "Password is too common. Please choose a stronger password",
            };
        }
        if (/(.)\1{5,}/.test(password)) {
            return {
                isValid: false,
                message: "Password contains too many repeated characters",
            };
        }
        return { isValid: true };
    }
    static sanitizeEmail(email) {
        return email.trim().toLowerCase();
    }
    static validateLoginRequest(data) {
        const emailValidation = this.validateEmail(data.email);
        const passwordValidation = this.validatePassword(data.password);
        const errors = {};
        if (!emailValidation.isValid) {
            errors.email = emailValidation.message;
        }
        if (!passwordValidation.isValid) {
            errors.password = passwordValidation.message;
        }
        return {
            isValid: Object.keys(errors).length === 0,
            errors,
        };
    }
}
//# sourceMappingURL=validation.js.map