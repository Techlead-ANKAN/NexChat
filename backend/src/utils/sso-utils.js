/**
 * SSO Utility Functions
 * Helper functions for SSO operations
 */

/**
 * Map SSO user type to internal role
 * @param {string} ssoType - SSO user type (Member, Mentor, Admin)
 * @returns {string} Internal role (user, admin)
 */
export function mapSSOTypeToRole(ssoType) {
    switch (ssoType) {
        case 'Admin':
            return 'admin';
        case 'Mentor':
        case 'Member':
        default:
            return 'user';
    }
}

/**
 * Map internal role to SSO user type
 * @param {string} role - Internal role (user, admin)
 * @returns {string} SSO user type
 */
export function mapRoleToSSOType(role) {
    switch (role) {
        case 'admin':
            return 'Admin';
        case 'user':
        default:
            return 'Member';
    }
}

/**
 * Validate SSO user type
 * @param {string} ssoType - SSO user type to validate
 * @returns {boolean} True if valid
 */
export function isValidSSOUserType(ssoType) {
    const validTypes = ['Member', 'Mentor', 'Admin'];
    return validTypes.includes(ssoType);
}

/**
 * Validate SSO user data structure
 * @param {Object} userData - The SSO user data
 * @returns {Object} Validation result with isValid and errors
 */
export function validateSSOUserData(userData) {
    const errors = [];
    
    if (!userData) {
        errors.push('User data is required');
        return { isValid: false, errors };
    }
    
    const required = ['id', 'type', 'name', 'email'];
    
    for (const field of required) {
        if (!userData[field]) {
            errors.push(`Missing required field: ${field}`);
        }
    }
    
    if (userData.type && !isValidSSOUserType(userData.type)) {
        errors.push(`Invalid user type: ${userData.type}`);
    }
    
    if (userData.email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(userData.email)) {
            errors.push(`Invalid email format: ${userData.email}`);
        }
    }
    
    return {
        isValid: errors.length === 0,
        errors
    };
}

/**
 * Generate SSO user profile picture URL
 * @param {string} name - User's full name
 * @param {string} email - User's email (fallback)
 * @returns {string} Profile picture URL
 */
export function generateSSOProfilePic(name, email) {
    if (name) {
        return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random&size=200`;
    }
    
    if (email) {
        const initials = email.split('@')[0].substring(0, 2).toUpperCase();
        return `https://ui-avatars.com/api/?name=${initials}&background=random&size=200`;
    }
    
    return `https://ui-avatars.com/api/?name=U&background=random&size=200`;
}

/**
 * Check if user should be updated from SSO data
 * @param {Object} existingUser - Existing user from database
 * @param {Object} ssoData - New SSO data
 * @returns {boolean} True if user should be updated
 */
export function shouldUpdateUserFromSSO(existingUser, ssoData) {
    if (!existingUser || !ssoData) return false;
    
    // Check if any SSO fields have changed
    if (existingUser.ssoId !== ssoData.id.toString()) return true;
    if (existingUser.ssoType !== ssoData.type) return true;
    if (existingUser.fullName !== ssoData.name) return true;
    if (existingUser.email !== ssoData.email.toLowerCase()) return true;
    if (ssoData.phone && existingUser.phone !== ssoData.phone) return true;
    
    return false;
}

/**
 * Get SSO user display name
 * @param {Object} user - User object
 * @returns {string} Display name
 */
export function getSSOUserDisplayName(user) {
    if (user.ssoType && user.fullName) {
        return `${user.fullName} (${user.ssoType})`;
    }
    
    if (user.ssoType) {
        return `${user.email} (${user.ssoType})`;
    }
    
    return user.fullName || user.email;
}

/**
 * Format SSO login timestamp
 * @param {Date} timestamp - SSO login timestamp
 * @returns {string} Formatted timestamp
 */
export function formatSSOLoginTime(timestamp) {
    if (!timestamp) return 'Never';
    
    const now = new Date();
    const diff = now - new Date(timestamp);
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    
    if (days > 0) {
        return `${days} day(s) ago`;
    } else if (hours > 0) {
        return `${hours} hour(s) ago`;
    } else if (minutes > 0) {
        return `${minutes} minute(s) ago`;
    } else {
        return 'Just now';
    }
}
