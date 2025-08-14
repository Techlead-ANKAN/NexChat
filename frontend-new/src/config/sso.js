/**
 * SSO Configuration
 * This file contains all SSO-related configuration settings
 */

export const SSO_CONFIG = {
    // Encryption key from Laravel backend (APP_KEY)
    ENCRYPTION_KEY: 'uTkyuVSoBIzhh5v7h+18xfwXhmj8dSEwL6mAotEoMrQ=',
    
    // URL parameter name for encrypted data
    URL_PARAM: 'ur',
    
    // Valid user types from SSO system
    VALID_USER_TYPES: ['Member', 'Mentor', 'Admin'],
    
    // Role mapping from SSO type to internal role
    ROLE_MAPPING: {
        'Admin': 'admin',
        'Mentor': 'user',
        'Member': 'user'
    },
    
    // Debug mode for development
    DEBUG: import.meta.env.MODE === 'development',
    
    // SSO redirect URL (where users come from)
    SSO_REDIRECT_URL: import.meta.env.VITE_SSO_REDIRECT_URL || 'https://your-laravel-app.com',
    
    // Auto-login on SSO data detection
    AUTO_LOGIN: true,
    
    // Session timeout for SSO users (in minutes)
    SESSION_TIMEOUT: 480, // 8 hours
};

/**
 * Get SSO encryption key
 * @returns {string} The encryption key
 */
export function getSSOEncryptionKey() {
    return SSO_CONFIG.ENCRYPTION_KEY;
}

/**
 * Check if SSO is enabled
 * @returns {boolean} True if SSO is enabled
 */
export function isSSOEnabled() {
    return !!SSO_CONFIG.ENCRYPTION_KEY;
}

/**
 * Get role for SSO user type
 * @param {string} ssoType - SSO user type
 * @returns {string} Internal role
 */
export function getRoleForSSOType(ssoType) {
    return SSO_CONFIG.ROLE_MAPPING[ssoType] || 'user';
}

/**
 * Validate SSO user type
 * @param {string} ssoType - SSO user type to validate
 * @returns {boolean} True if valid
 */
export function isValidSSOUserType(ssoType) {
    return SSO_CONFIG.VALID_USER_TYPES.includes(ssoType);
}
