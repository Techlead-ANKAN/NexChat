import CryptoJS from 'crypto-js';
import { useState, useEffect } from 'react';

/**
 * Decode encrypted chat user data from Laravel backend
 * @param {string} encryptedData - Base64 encoded encrypted data from URL parameter 'ur'
 * @param {string} encryptionKey - The encryption key from your backend system
 * @returns {Object|null} Decoded user data object or null if decryption fails
 */
export function decodeChatUserData(encryptedData, encryptionKey) {
    try {
        // Convert URL-safe base64 back to standard base64
        const standardBase64 = encryptedData.replace(/-/g, '+').replace(/_/g, '/');
        
        // Add padding if needed
        const paddedBase64 = standardBase64 + '='.repeat((4 - standardBase64.length % 4) % 4);
        
        // 4-layer base64 decoding
        const layer4 = atob(paddedBase64);
        const layer3 = atob(layer4);
        const layer2 = atob(layer3);
        const layer1 = atob(layer2);
        
        // Split the decrypted string by '||'
        const userDataParts = layer1.split('||');
        
        if (userDataParts.length !== 5) {
            throw new Error('Invalid user data format');
        }
        
        // Return structured user data
        return {
            id: parseInt(userDataParts[0]),
            type: userDataParts[1],
            name: userDataParts[2],
            email: userDataParts[3],
            phone: userDataParts[4]
        };
        
    } catch (error) {
        console.error('Error decoding chat user data:', error);
        return null;
    }
}


/**
 * Get user data from URL parameters
 * @param {string} encryptionKey - The encryption key
 * @returns {Object|null} Decoded user data or null
 */
export function getChatUserDataFromURL(encryptionKey) {
    const urlParams = new URLSearchParams(window.location.search);
    const encryptedData = urlParams.get('ur');
    
    if (!encryptedData) {
        return null;
    }
    
    return decodeChatUserData(encryptedData, encryptionKey);
}

/**
 * React Hook for getting chat user data
 * @param {string} encryptionKey - The encryption key
 * @returns {Object} { userData, loading, error }
 */
export function useChatUserData(encryptionKey) {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    useEffect(() => {
        try {
            const data = getChatUserDataFromURL(encryptionKey);
            if (data) {
                setUserData(data);
            } else {
                setError('Failed to decode user data');
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [encryptionKey]);
    
    return { userData, loading, error };
}

/**
 * Validate user data structure
 * @param {Object} userData - The decoded user data
 * @returns {boolean} True if valid, false otherwise
 */
export function validateUserData(userData) {
    if (!userData) return false;
    
    const required = ['id', 'type', 'name', 'email', 'phone'];
    
    for (const field of required) {
        if (!userData[field]) {
            return false;
        }
    }
    
    // Validate user type
    const validTypes = ['Member', 'Mentor', 'Admin'];
    if (!validTypes.includes(userData.type)) {
        return false;
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userData.email)) {
        return false;
    }
    
    return true;
}

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
