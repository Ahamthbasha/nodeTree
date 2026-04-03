export class ValidationHelper {
  private static readonly EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  // Removed unused PASSWORD_REGEX

  static validateEmail(email: unknown): { isValid: boolean; message?: string | undefined } {
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

    // Check for consecutive dots
    if (trimmedEmail.includes("..")) {
      return { isValid: false, message: "Email cannot contain consecutive dots" };
    }

    // Check for leading or trailing dots
    if (trimmedEmail.startsWith(".") || trimmedEmail.endsWith(".")) {
      return { isValid: false, message: "Email cannot start or end with a dot" };
    }

    // Check local part length (before @)
    const [localPart] = trimmedEmail.split("@");
    if (localPart && localPart.length > 64) {
      return { isValid: false, message: "Email local part is too long" };
    }

    return { isValid: true };
  }

  static validatePassword(password: unknown): { isValid: boolean; message?: string | undefined } {
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

    // Check for common weak passwords
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

    // Check for repeated characters (e.g., aaaaaaaa)
    if (/(.)\1{5,}/.test(password)) {
      return {
        isValid: false,
        message: "Password contains too many repeated characters",
      };
    }

    return { isValid: true };
  }

  static sanitizeEmail(email: string): string {
    return email.trim().toLowerCase();
  }

  // Helper method to validate login request
  static validateLoginRequest(data: { email: unknown; password: unknown }): {
    isValid: boolean;
    errors: { email?: string | undefined; password?: string | undefined };
  } {
    const emailValidation = this.validateEmail(data.email);
    const passwordValidation = this.validatePassword(data.password);

    const errors: { email?: string | undefined; password?: string | undefined } = {};

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