// Validation utilities for authentication
import { LoginCredentials, RegisterData } from '@/services/authService';

export interface ValidationError {
  field: string;
  message: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

export const authValidation = {
  // Email validation
  validateEmail(email: string): ValidationError | null {
    if (!email) {
      return { field: 'email', message: 'Email is required' };
    }
    
    if (!email.trim()) {
      return { field: 'email', message: 'Email cannot be empty' };
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return { field: 'email', message: 'Please enter a valid email address' };
    }
    
    if (email.length > 254) {
      return { field: 'email', message: 'Email is too long' };
    }
    
    return null;
  },

  // Password validation
  validatePassword(password: string): ValidationError | null {
    if (!password) {
      return { field: 'password', message: 'Password is required' };
    }
    
    if (password.length < 6) {
      return { field: 'password', message: 'Password must be at least 6 characters long' };
    }
    
    if (password.length > 128) {
      return { field: 'password', message: 'Password is too long (max 128 characters)' };
    }
    
    // Check for at least one letter and one number
    if (!/(?=.*[a-zA-Z])(?=.*\d)/.test(password)) {
      return { field: 'password', message: 'Password must contain at least one letter and one number' };
    }
    
    return null;
  },

  // Name validation
  validateName(name: string): ValidationError | null {
    if (!name) {
      return { field: 'name', message: 'Name is required' };
    }
    
    if (!name.trim()) {
      return { field: 'name', message: 'Name cannot be empty' };
    }
    
    if (name.trim().length < 2) {
      return { field: 'name', message: 'Name must be at least 2 characters long' };
    }
    
    if (name.length > 100) {
      return { field: 'name', message: 'Name is too long (max 100 characters)' };
    }
    
    // Only allow letters, spaces, hyphens, and apostrophes
    if (!/^[a-zA-Z\s\-']+$/.test(name)) {
      return { field: 'name', message: 'Name can only contain letters, spaces, hyphens, and apostrophes' };
    }
    
    return null;
  },

  // Confirm password validation
  validateConfirmPassword(password: string, confirmPassword: string): ValidationError | null {
    if (!confirmPassword) {
      return { field: 'confirmPassword', message: 'Please confirm your password' };
    }
    
    if (password !== confirmPassword) {
      return { field: 'confirmPassword', message: 'Passwords do not match' };
    }
    
    return null;
  },

  // Login validation
  validateLoginCredentials(credentials: LoginCredentials): ValidationResult {
    const errors: ValidationError[] = [];
    
    const emailError = this.validateEmail(credentials.email);
    if (emailError) errors.push(emailError);
    
    const passwordError = this.validatePassword(credentials.password);
    if (passwordError) errors.push(passwordError);
    
    return {
      isValid: errors.length === 0,
      errors
    };
  },

  // Registration validation
  validateRegistrationData(userData: RegisterData): ValidationResult {
    const errors: ValidationError[] = [];
    
    const nameError = this.validateName(userData.name);
    if (nameError) errors.push(nameError);
    
    const emailError = this.validateEmail(userData.email);
    if (emailError) errors.push(emailError);
    
    const passwordError = this.validatePassword(userData.password);
    if (passwordError) errors.push(passwordError);
    
    const confirmPasswordError = this.validateConfirmPassword(userData.password, userData.confirmPassword);
    if (confirmPasswordError) errors.push(confirmPasswordError);
    
    return {
      isValid: errors.length === 0,
      errors
    };
  },

  // Get password strength
  getPasswordStrength(password: string): {
    score: number;
    label: string;
    color: string;
    suggestions: string[];
  } {
    let score = 0;
    const suggestions: string[] = [];
    
    // Length check
    if (password.length >= 8) score += 1;
    else suggestions.push('Use at least 8 characters');
    
    // Lowercase check
    if (/[a-z]/.test(password)) score += 1;
    else suggestions.push('Add lowercase letters');
    
    // Uppercase check
    if (/[A-Z]/.test(password)) score += 1;
    else suggestions.push('Add uppercase letters');
    
    // Number check
    if (/\d/.test(password)) score += 1;
    else suggestions.push('Add numbers');
    
    // Special character check
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score += 1;
    else suggestions.push('Add special characters (!@#$%^&*)');
    
    let label = '';
    let color = '';
    
    switch (score) {
      case 0:
      case 1:
        label = 'Very Weak';
        color = 'text-red-600';
        break;
      case 2:
        label = 'Weak';
        color = 'text-orange-600';
        break;
      case 3:
        label = 'Fair';
        color = 'text-yellow-600';
        break;
      case 4:
        label = 'Good';
        color = 'text-blue-600';
        break;
      case 5:
        label = 'Strong';
        color = 'text-green-600';
        break;
      default:
        label = 'Very Weak';
        color = 'text-red-600';
    }
    
    return { score, label, color, suggestions };
  }
};